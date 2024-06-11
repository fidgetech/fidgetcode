'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { sendEmail } = require('./email');

admin.initializeApp();

exports.updateAssignmentStatus = functions.firestore
  .document('students/{studentId}/assignments/{assignmentId}/submissions/{submissionId}')
  .onWrite(async (change, context) => {
    const { studentId, assignmentId } = context.params;
    const submissionData = change.after.exists ? change.after.data() : null;
    if (!submissionData) { return; }
    const status = submissionData.review?.status || 'submitted';
    const assignmentRef = admin.firestore().doc(`students/${studentId}/assignments/${assignmentId}`);
    try {
      await assignmentRef.update({ status });
      functions.logger.info('Assignment status updated successfully');
      if (status !== 'submitted') {
        const studentRef = admin.firestore().doc(`students/${studentId}`);
        const studentDoc = await studentRef.get();
        const studentData = studentDoc.data();
        const assignmentDoc = await assignmentRef.get();
        const assignmentData = assignmentDoc.data();
        const emailData = {
          to: studentData.email,
          subject: `Independent Project reviewed: ${assignmentData.title}`,
          body: `<p>Your Independent Project <em>${assignmentData.title}</em> has been reviewed. Please check Fidgetcode for details.</p>`
        };
        await sendEmail(emailData);
      }
    } catch (error) {
      functions.logger.error('Error updating assignment status', error);
    }
  });
