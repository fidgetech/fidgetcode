import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { doc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from 'services/firebase.js';

export const useFirestoreSubscription = ({ docPath, collectionPath, sort }) => {
  const queryClient = useQueryClient();
  const queryKey = docPath || collectionPath;
  const isDoc = !!docPath;
  useEffect(() => {
    const ref = isDoc ? doc(db, ...docPath) : collection(db, ...collectionPath);
    const queryRef = sort ? query(ref, orderBy(sort)) : ref;
    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const updatedData = isDoc ? { id: snapshot.id, ...snapshot.data() } : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      queryClient.setQueryData(queryKey, updatedData);
    });
    return () => unsubscribe();
  }, [queryClient, queryKey, isDoc, docPath, collectionPath, sort]);
};
