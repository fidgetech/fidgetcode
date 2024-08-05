import { useState } from 'react';
import { db } from 'services/firebase';
import { collection, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';

export const useFirestoreSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createData = async (collectionPath, data, docId=null) => {
    setLoading(true);
    setError(null);
    console.log('data:', data, 'collectionPath:', collectionPath)
    console.log('docId:', docId)
    try {
      const collectionRef = collection(db, ...collectionPath);
      const docRef = docId ? await setDoc(doc(collectionRef, docId), data) : await addDoc(collectionRef, data);
      setLoading(false);
      return docId || docRef.id;
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

  const deleteData = async (docPath) => {
    try {
      await deleteDoc(doc(db, ...docPath));
    } catch (err) {
      setError(new Error(`Failed to delete data in Firestore: ${err.message}`));
    }
  }

  return { loading, error, createData, updateData, deleteData };
};
