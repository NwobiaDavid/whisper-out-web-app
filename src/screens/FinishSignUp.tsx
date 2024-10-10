/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { isSignInWithEmailLink, onAuthStateChanged, signInWithEmailLink } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@nextui-org/react';
import { collection, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../config/AuthContext.tsx';
import { auth, db } from '../config/firebase.ts';

import Emailheader from '../components/Emailheader.tsx';
import Footer from '../components/Footer.tsx';
import { FiInfo } from 'react-icons/fi';
import { generateRandomId } from '../../scripts/generateUniqueID.ts';

const email = window.localStorage.getItem('emailForSignIn');

interface UserType {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: UserType | null;
}

const FinishSignUp: React.FC  = () => {
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;
  useEffect(() => {
    const completeSignIn = async () => {
      setIsLoading(true);

      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem('emailForSignIn') || '';

          if (!email) {
            email = window.prompt('Please provide your email for confirmation.') || '';
          }

          if (email) {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');

            const emailDomain = email.split('@')[1];
            const companiesRef = collection(db, 'companies');
            const q = query(companiesRef, where('domain', '==', emailDomain));
            const querySnapshot = await getDocs(q);

            let companyName = emailDomain;
            
            if (!querySnapshot.empty) {
              const companyDoc = querySnapshot.docs[0];
              const companyData = companyDoc.data();
              companyName = companyData?.name || emailDomain;

              const authUnsubscribe = onAuthStateChanged(auth, async (authUser) => {
                if (authUser) {
                  setCurrentUser(authUser);

                  const userRef = doc(db, 'users', authUser.uid);
                  const userDoc = await getDoc(userRef);

                  if (userDoc.exists()) {
                    navigate('/home');
                  } else {
                    await setDoc(userRef, {
                      uid: authUser.uid,
                      email: authUser.email,
                      company: companyName,
                      domain: emailDomain,
                      secretId: generateRandomId(),
                    });
                    navigate('/interests');
                  }
                } else {
                  setMessage('User is not authenticated.');
                }
              });

              return () => {
                authUnsubscribe();
              };
            } else {
              navigate('/company-entry');
            }

          } else {
            setMessage('No email provided.');
          }
        } else {
          setMessage('Invalid sign-in link.');
        }
      } catch (error: any) {
        setMessage(`Error: ${error.message}`);
        console.error('Error completing sign-in:', error);
      }

      setIsLoading(false);
    };

    completeSignIn();
  }, [navigate]);

  return (
    <div
      className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
    >
      <Emailheader />

      <div className="w-full h-[75%] flex justify-center">
        {/* {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : ( */}
          <div className="w-full h-full justify-center flex">
            <div className="w-[70%] border-2 rounded-lg relative">
              <div className="w-full text-lg h-full absolute z-[999] backdrop-blur-sm bg-slate-900 bg-opacity-5 justify-center items-center flex flex-col">
                {isLoading ? (
                  <Spinner />
                ) : (
                  <div>
                    <h1 className="font-semibold">Sign-In Confirmation</h1>
                    <p>{message}</p>
                  </div>
                )}
              </div>

              <div className="xl:px-20 xl:pt-20 flex xl:w-[65%] flex-col">
                <div className="text-3xl mb-7 font-bold">
                  <h1>Just sent you an email</h1>
                  <h1>
                    Check your inbox to confirm your email address and continue
                  </h1>
                </div>
                <p>
                  We’ve sent a confirmation email to{' '}
                  <span className="font-bold">{email}</span>
                </p>
                <div className="mt-5 rounded-lg text-sm drop-shadow-md bg-white dark:bg-inherit px-7 py-5 w-[67%]">
                  <div className="flex font-semibold mb-4 items-center">
                    <FiInfo className="text-lg" />{' '}
                    <span className="ml-3">Didn’t receive an email?</span>
                  </div>
                  <p>
                    If you can’t find the email in your inbox or spam folder,
                    please click below and we will send you a new one
                  </p>
                  <button className="px-6 mt-4 rounded-md py-2 text-[#497ADC] font-medium bg-blue-50">
                    Resend Email
                  </button>
                </div>
                <div className="w-[60%] px-3 text-xs font-medium py-2 flex justify-end">
                  <button className="cursor-pointer">
                    Wrong email? Change it
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/* )} */}
      </div>

      <Footer />
    </div>
  );
};

export default FinishSignUp;
