import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'services/firebase.js';

export const useFirestoreSubscription = (queryKey, docPath) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const docRef = doc(db, ...docPath);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      const updatedDoc = { id: doc.id, ...doc.data() };
      queryClient.setQueryData(queryKey, updatedDoc);
    });
    return () => unsubscribe();
  }, [queryClient, queryKey, docPath]);
};
