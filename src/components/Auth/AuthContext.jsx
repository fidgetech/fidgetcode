import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from 'src/firebase.js';

const validRoles = ['student', 'admin'];

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      setLoading(true);
      if (firebaseUser) {
        firebaseUser.getIdTokenResult().then((idTokenResult) => {
          const role = idTokenResult.claims.role;
          if (!validRoles.includes(role)) return signOut();
          const userRef = doc(db, `${role}s`, firebaseUser.uid);
          getDoc(userRef).then((doc) => {
            if (!doc.exists()) return signOut();
            setCurrentUser(doc.data());
            setRole(role);
            setLoading(false);
          });
        });
      } else {
        console.log('No user signed in.')
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signOut = () => {
    setLoading(false);
    return auth.signOut();
  };

  const value = {
    currentUser,
    isSignedIn: !!currentUser,
    isAdmin: role === 'admin',
    isStudent: role === 'student',
    loading,
    setLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
