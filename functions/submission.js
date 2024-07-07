'use strict';

import { logger } from 'firebase-functions/v2';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { sendEmail } from './email.js';

if (!getApps().length) initializeApp();

export const updateAssignmentStatus = onDocumentWritten(
  'students/{studentId}/assignments/{assignmentId}/submissions/{submissionId}',
  async (event) => {
    const { studentId, assignmentId } = event.params;
    const change = event.data;
    const submissionData = change?.after.exists ? change.after.data() : null;
    if (!submissionData) return;

    const status = submissionData.review?.status || 'submitted';
    const db = getFirestore();
    const assignmentRef = db.doc(`students/${studentId}/assignments/${assignmentId}`);

    try {
      await assignmentRef.update({ status });
      logger.info('Assignment status updated successfully');
      if (status !== 'submitted') {
        const studentRef = db.doc(`students/${studentId}`);
        const studentDoc = await studentRef.get();
        const studentData = studentDoc.data();
        const assignmentDoc = await assignmentRef.get();
        const assignmentData = assignmentDoc.data();
        const emailData = {
          to: studentData.email,
          subject: `Independent Project reviewed: ${assignmentData.title}`,
          body: `<p>Your Independent Project <em>${assignmentData.title}</em> has been reviewed. Please check Fidgetech Code for details.</p>`
        };
        await sendEmail(emailData);
      }
    } catch (error) {
      logger.error('Error updating assignment status', error);
    }
  }
);
