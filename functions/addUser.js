import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();
const auth = getAuth();
const db = getFirestore();

export const addUser = onCall(async ({ data }) => {
  const { name, email, trackId } = data;
  const role = 'student';
  try {
    const userRecord = await createAuthUser({ email, role, trackId });
    await createFirestoreUser({ userRecord, email, name, trackId });
    const link = await generatePasswordResetLink(email);
    return { link };
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`, error);
    throw new HttpsError('error', 'Error creating user');
  }
});

async function createAuthUser({ email, role, trackId }) {
  const userRecord = await auth.createUser({ email });
  logger.info(`* User created with email: ${userRecord.email}`);

  await auth.setCustomUserClaims(userRecord.uid, { role, trackId });
  logger.info(`* Role set to ${role} for ${userRecord.email}\n`);

  return userRecord;
}

async function createFirestoreUser({ userRecord, email, name, trackId }) {
  const uid = userRecord.uid; // assign Firestore record same uid as in Auth
  const userRef = db.collection('students').doc(uid);
  await userRef.set({
    createdAt: FieldValue.serverTimestamp(),
    email,
    name,
    trackId,
    active: true,
  });
  logger.info(`* student document created for ${userRecord.email}`);
}

async function generatePasswordResetLink(email) {
  const link = await auth.generatePasswordResetLink(email)
  return link;
}
