'use strict';

import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

export const updateAssignmentStatus = functions.firestore
  .document('students/{studentId}/assignments/{assignmentId}/submissions/{submissionId}')
  .onWrite(async (change, context) => {
    const { studentId, assignmentId } = context.params;
    const assignmentRef = admin.firestore().doc(`students/${studentId}/assignments/${assignmentId}`);
    if (!change.after.exists) { return; }
    const status = change.before.exists ? 'reviewed' : 'submitted';
    try {
      await assignmentRef.update({ status });
      functions.logger.info('Assignment status updated successfully');
    } catch (error) {
      functions.logger.error('Error updating assignment status', error);
    }
  });
