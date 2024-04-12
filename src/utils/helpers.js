import { query, where, getDocs } from 'firebase/firestore';

// fetch all documents from a collection where field is in a list of ids
export async function fetchDocumentsInChunks(collectionRef, field, ids, chunkSize = 10) {
  console.log('feteching documents in chunks...')
  let documents = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const queryRef = query(collectionRef, where(field, 'in', chunk));
    const snapshot = await getDocs(queryRef);
    const fetchedDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    documents = [...documents, ...fetchedDocs];
  }
  return documents;
}
