'use strict';

import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const updateAssignmentStatus = functions.firestore
  .document('students/{studentId}/assignments/{assignmentId}/submissions/{submissionId}')
  .onCreate(async (snap, context) => {
    const { studentId, assignmentId } = context.params;
    const submission = { ...snap.data(), id: snap.id };
    const assignmentRef = admin.firestore().doc(`students/${studentId}/assignments/${assignmentId}`);
    try {
      await assignmentRef.update({ status: 'submitted', latestSubmission: submission.id });
      functions.logger.info('Assignment status updated successfully');
    } catch (error) {
      functions.logger.error('Error updating assignment status', error);
    }
  });
