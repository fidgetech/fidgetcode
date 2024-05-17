import { useState } from 'react';
import { db } from 'services/firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

export const useFirestoreSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createData = async (collectionPath, data) => {
    setLoading(true);
    setError(null);
    console.log('data:', data, 'collectionPath:', collectionPath)
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

  const updateData = async (docPath, data) => {
    setLoading(true);
    setError(null);
    try {
      await setDoc(doc(db, ...docPath), data, { merge: true });
      setLoading(false);
    } catch (err) {
      setError(new Error(`Failed to update data in Firestore: ${err.message}`));
      setLoading(false);
    }
  }  

  return { loading, error, createData, updateData };
};
