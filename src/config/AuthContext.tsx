import React, { createContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { checkAuthStatus } from './firebase';
import { Spinner } from '@nextui-org/react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

interface UserType {
  uid: string;
  email: string | null;
  isActive?: boolean;
}

interface AuthContextType {
  user: UserType | null;
  toggleUserStatus: (status: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();


  const updateUserStatusInFirestore = async (uid: string, isActive: boolean) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, { isActive, lastUpdated: serverTimestamp() });
    } catch (error) {
      console.error('Error updating user status in Firestore:', error);
    }
  };

  const toggleUserStatus = (status: boolean) => {
    if (user) {
      updateUserStatusInFirestore(user.uid, status);
      setUser((prevUser) => (prevUser ? { ...prevUser, isActive: status } : null));
    }
  };


  const handleSetUser = async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userData: UserType = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        isActive: true,
      };
      setUser(userData);

      if (!localStorage.getItem('loginTimestamp')) {
        localStorage.setItem('loginTimestamp', Date.now().toString());
      }

      await updateUserStatusInFirestore(firebaseUser.uid, true);
    } else {
      setUser(null);
    }
  };


  useEffect(() => {
    checkAuthStatus(handleSetUser, setLoading); // Pass both required arguments
  }, []);


  useEffect(() => {
    if (user?.uid) {
      const intervalId = setInterval(() => {
        updateUserStatusInFirestore(user.uid, true);
      }, 60 * 1000); // Update every minute

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [user?.uid]);
  


  // Monitor user disconnection (e.g., closing the tab or navigating away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // console.log("---hello from auth context--")
      if (user?.uid) {
        updateUserStatusInFirestore(user.uid, false);
      }

    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.uid]);


  // Monitor user activity (Idle timer and session expiration)
  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const logoutUser = () => {
      toast.warning('Session expired due to inactivity.');
      localStorage.removeItem('loginTimestamp');
      toggleUserStatus(false);
      setUser(null);
      navigate('/signup');
    };

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(logoutUser, 15 * 60 * 1000); // 15 minutes
    };

    const handleUserActivity = (): void => {
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    if (user) {
      resetIdleTimer();
    }

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [user, navigate]);


  useEffect(() => {
    if (user?.uid) {
      const userDocRef = doc(db, 'users', user.uid);
  
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data && data.isActive !== user.isActive) {
            setUser((prevUser) =>
              prevUser
                ? { ...prevUser, isActive: data.isActive }
                : null
            );
          }
        }
      });
  
      return () => unsubscribe();
    }
  }, [user?.uid]);


  const value = useMemo(() => ({ user, toggleUserStatus }), [user]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
