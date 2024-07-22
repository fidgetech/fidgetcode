'use strict';

import { logger } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { createHmac, timingSafeEqual } from 'crypto';
import { githubFetch } from './githubFetch.js';

if (!getApps().length) initializeApp();

export const githubWebhook = onRequest(async (req, res) => {
  const githubSignature = req.headers['x-hub-signature'];
  const payload = req.body;
  if (!verifyGithubSignature(githubSignature, payload)) {
    res.status(403).send('Unauthorized');
    return;
  }

  if (payload.ref === 'refs/heads/main') {
    if (!payload.commits?.length) {
      logger.error('No commits in payload:', payload);
      return;
    }
    const paths = updatedFiles(payload);

    const db = getFirestore();
  
    for (const path of paths) {
      logger.info('Processing updated file:', path);
      const { title, objectives, content } = await githubFetch({ path });

      logger.info('constructed source url:', constructSourceUrl(path));
      const assignmentTemplatesQuery = db.collectionGroup('assignmentTemplates').where('source', '==', constructSourceUrl(path));
      const snapshot = await assignmentTemplatesQuery.get();

      logger.info(`Found ${snapshot.size} assignment templates for path ${path}`);

      const batch = db.batch();
      try {
        snapshot.forEach((doc) => {
          logger.info(`Updating assignment template: ${doc.id}`);
          batch.update(doc.ref, { title, objectives, content });
        });
        await batch.commit();
      } catch (error) {
        logger.error('Error updating assignment templates for path ${path}:', error);
      }
    }
  }

  res.status(200).send('Webhook received and processed');
});

function verifyGithubSignature(signature, payload) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const hash = `sha1=${createHmac('sha1', secret).update(JSON.stringify(payload)).digest('hex')}`;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(hash));
}

function updatedFiles(payload) {
  const files = payload.commits.reduce((files, commit) => {
    files.push(...commit.added, ...commit.modified);
    return files;
  }, []);
  return Array.from(new Set(files));
}

function constructSourceUrl(path) {
  const org = process.env.GITHUB_ORG;
  const repo = process.env.GITHUB_INDEPENDENT_PROJECTS_REPO;
  return `https://github.com/${org}/${repo}/blob/main/${path}`;
}
