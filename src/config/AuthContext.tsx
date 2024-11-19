import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { checkAuthStatus } from './firebase';
import { Spinner } from '@nextui-org/react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UserType {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: UserType | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSetUser = (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userData: UserType = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      };
      setUser(userData);
      if (!localStorage.getItem('loginTimestamp')) {
        localStorage.setItem('loginTimestamp', Date.now().toString());
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuthStatus(handleSetUser, setLoading);
  }, []);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout | null = null;

    const logoutUser = () => {
      toast.warning('Session expired due to inactivity.');
      localStorage.removeItem('loginTimestamp');
      setUser(null);
      navigate('/signup');
    };

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(logoutUser, 15 * 60 * 1000); // 15 minutes inactivity logout
    };

    const checkTotalSessionDuration = () => {
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (loginTimestamp) {
        const elapsedTime = Date.now() - parseInt(loginTimestamp, 10);
        if (elapsedTime > 12 * 60 * 60 * 1000) { // 12 hours session max
          toast.warning('Session expired after 12 hours.');
          localStorage.removeItem('loginTimestamp');
          setUser(null);
          navigate('/signup');
        }
      }
    };

    const handleUserActivity = () => resetIdleTimer();
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    if (user) {
      resetIdleTimer();
    }

    const sessionInterval = setInterval(() => {
      if (user) checkTotalSessionDuration();
    }, 60 * 1000); // Check every minute

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      clearInterval(sessionInterval);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
