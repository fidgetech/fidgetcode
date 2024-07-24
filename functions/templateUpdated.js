'use strict';

import { logger } from 'firebase-functions/v2';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { githubFetch } from './githubFetch.js';

if (!getApps().length) initializeApp();
const db = getFirestore();

const document = 'tracks/{trackId}/courses/{courseId}/assignmentTemplates/{templateId}';
const fields = ['source'];

export const templateUpdated = onDocumentUpdated({ document, fields }, async (event) => {
  const beforeData = event.data?.before?.data();
  const afterData = event.data?.after?.data();

  if (!beforeData || !afterData) {
    logger.error('Missing before or after data.');
    return;
  }

  if (beforeData.source === afterData.source) {
    logger.info('No change in source field.');
    return;
  }

  const { trackId, courseId, templateId } = event.params;
  logger.info(`Source field updated for template ${templateId} in course ${courseId} of track ${trackId}.`);

  const source = afterData.source;
  logger.info(`New source URL: ${source}`);

  try {
    const { title, objectives, content } = await githubFetch({ url: source });
    logger.info('Fetched title, objectives, and content from source URL.');

    await event.data.after.ref.update({ title, objectives, content });
    logger.info(`Updated template ${templateId} with new data.`);
  } catch (error) {
    logger.error('Error fetching or updating document:', error);
  }

  logger.info(`Handled source update for template ${templateId}.`);
});
