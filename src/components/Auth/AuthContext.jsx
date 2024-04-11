import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from 'src/firebase.js';
import { useQueryClient } from '@tanstack/react-query';

const validRoles = ['student', 'admin'];

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [trackId, setTrackId] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      setLoading(true);
      if (firebaseUser) {
        firebaseUser.getIdTokenResult().then((idTokenResult) => {
          const role = idTokenResult.claims.role;
          const trackId = idTokenResult.claims.trackId;
          if (!validRoles.includes(role)) return signOut();
          const userRef = doc(db, `${role}s`, firebaseUser.uid);
          getDoc(userRef).then((doc) => {
            if (!doc.exists()) return signOut();
            setCurrentUser({ uid: doc.id, ...doc.data() });
            setRole(role);
            setTrackId(trackId);
            setLoading(false);
            console.log('User auth data loaded');
            console.log('Logged in as', role, 'with trackId', trackId);
          });
        });
      } else {
        console.log('No user signed in.')
        setCurrentUser(null);
        setRole(null);
        setTrackId(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signOut = () => {
    setLoading(false);
    queryClient.invalidateQueries();
    auth.signOut();
  };

  const value = {
    currentUser,
    isSignedIn: !!currentUser,
    isAdmin: role === 'admin',
    isStudent: role === 'student',
    loading,
    setLoading,
    signOut,
    trackId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
