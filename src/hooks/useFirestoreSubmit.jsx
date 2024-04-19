import { useState } from 'react';
import { db } from 'services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const useFirestoreSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitData = async (collectionPath, data) => {
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, ...collectionPath);
      const docRef = await addDoc(collectionRef, data);
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError(new Error(`Failed to write data to Firestore: ${err.message}`));
      setLoading(false);
    }
  };

  return { loading, error, submitData };
};
