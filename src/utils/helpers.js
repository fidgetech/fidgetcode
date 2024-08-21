// import DOMPurify from 'dompurify';
import { query, where, getDocs } from 'firebase/firestore';
import { useTheme } from '@mui/material/styles';

// fetch all documents from a collection where field is in a list of ids
export async function fetchDocumentsInChunks(collectionRef, field, ids, chunkSize = 10) {
  console.log('fetching documents in chunks...')
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

export const formatMarkdownForRender = (inputText) => {
  return inputText.replace(/(?<!\n)\n(?!\n)/g, '  \n'); // force markdown to recognize single newlines
};

export const localeOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };

// const sanitizeValue = (value) => typeof value === 'string' ? DOMPurify.sanitize(value) : value;
// export const sanitizeObject = (obj) => {
//   if (obj === null) return null;
//   if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item));
//   if (typeof obj === 'object') {
//     return Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => {
//         if (typeof value === 'object' || Array.isArray(value)) {
//           return [key, sanitizeObject(value)];
//         }
//         return [key, sanitizeValue(value)];
//       })
//     );
//   }
//   return sanitizeValue(obj);
// };

export const getGradeColor = (grade) => {
  console.log('grade', grade)
  const theme = useTheme();
  switch (grade) {
    case 'all': return theme.palette.green.main;
    case 'Meets standard all of the time': return theme.palette.green.main;
    case 'some': return theme.palette.orange.main;
    case 'Meets standard some of the time': return theme.palette.orange.main;
    case 'none': return theme.palette.red.main;
    case 'Does not meet this standard yet': return theme.palette.red.main;
  }
};
