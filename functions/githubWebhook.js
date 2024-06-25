'use strict';

import { logger } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { createHmac, timingSafeEqual } from 'crypto';

if (!getApps().length) initializeApp();

export const githubWebhook = onRequest((req, res) => {
  const githubSignature = req.headers['x-hub-signature'];
  const payload = req.body;
  if (!verifyGithubSignature(githubSignature, payload)) {
    res.status(403).send('Unauthorized');
    return;
  }

  if (payload.ref === 'refs/heads/main') {
    // logger.info('Push to main branch detected:', payload);
    if (!payload.commits?.length) {
      logger.error('No commits in payload:', payload);
      return;
    }
    logger.info('Files changed:', updatedFiles(payload));

    const db = getFirestore();
    const assignmentsCollection = db.collectionGroup('assignments');
    logger.info('assignmentsCollection', assignmentsCollection);

  }

  res.status(200).send('Webhook received and processed');
});

function verifyGithubSignature(signature, payload) {
  const secret = process.env.GITHUB_SECRET;
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
