'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.updateAssignmentStatus = functions.firestore
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
