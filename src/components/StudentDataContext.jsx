import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'components/Auth/AuthContext';
import { db } from 'src/firebase.js';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

const StudentDataContext = createContext({ studentData: null, loading: null });

export const useStudentData = () => useContext(StudentDataContext);

export const StudentDataProvider = ({ children }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { trackId } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const trackRef = doc(db, 'tracks', trackId);
        const trackDoc = await getDoc(trackRef);
        if (!trackDoc.exists()) throw new Error('No track document found in db!');
        const trackData = trackDoc.data();

        const coursesRef = collection(db, 'tracks', trackId, 'courses');
        const q = query(coursesRef, orderBy('number'));
        const coursesSnapshot = await getDocs(q);
        const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // const sortedCoursesData = coursesData.sort((a, b) => a.number - b.number);

        setStudentData({ track: trackData, courses: coursesData });
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (trackId) fetchData();
  }, [trackId]);

  return (
    <StudentDataContext.Provider value={{ studentData, loading }}>
      {children}
    </StudentDataContext.Provider>
  );
}
