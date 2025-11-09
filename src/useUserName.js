import { useState, useEffect } from 'react';
import { auth, db } from './firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Custom hook to fetch and return user's name
export const useUserName = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.fullName || 'User');
          } else {
            // No profile yet, use email username or 'User'
            const emailName = user.email.split('@')[0];
            setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
          setUserName('User');
        } finally {
          setLoading(false);
        }
      } else {
        setUserName('');
        setUserEmail('');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userName, userEmail, loading };
};