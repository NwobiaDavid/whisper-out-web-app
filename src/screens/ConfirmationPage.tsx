/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { AuthContext } from '../config/AuthContext.tsx';
import { auth } from '../config/firebase.ts';
import { useNavigate } from 'react-router-dom';
import {Spinner} from "@nextui-org/react";

import Emailheader from '../components/Emailheader.tsx';
import Footer from '../components/Footer.tsx';

import { FiInfo } from 'react-icons/fi';

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

const ConfirmationPage = () => {
  const [message, setMessage] = useState('Please check your email to confirm.');
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // const { user } = useContext(AuthContext);
  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  const email = window.localStorage.getItem('emailForSignIn');

  useEffect(() => {
    if (user) {
      navigate('/home');
    } 
  }, [user, navigate]);

  const handleResendLink = async () => {
    setIsResending(true);
    try {
      await sendSignInLinkToEmail(auth, email || "", {
        url: 'http://localhost:3000/finishSignUp',
        handleCodeInApp: true,
      });
      setMessage('Link resent! Check your email.');
    } catch (error:any) {
      console.error('Error resending link:', error);
      setMessage(`Error: ${error.message}`);
    }
    setIsResending(false);
  };


  const handleChangeEmail = () => {
    navigate('/signup');
  };
  

  return (
    <div 
     className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
     >
      <Emailheader />
      <div className="w-full h-[75%] flex justify-center  ">
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center ">
          <Spinner />
          </div>
        ) : (
          <div className=" w-full h-full justify-center flex ">
            <div className="w-[70%] border dark:border dark:border-opacity-20 dark:bg-[#44427C] border-gray-200 rounded-lg  ">
              <div className="xl:px-20 xl:pt-20 flex xl:w-[65%] flex-col  ">
                <div className="text-3xl mb-7 font-bold ">
                  <h1>Just sent you an email</h1>
                  <h1>
                    Check your inbox to confirm your email address and continue
                  </h1>
                </div>
                <p className="  ">
                  We’ve sent a confirmation email to <span className="font-bold">{email}</span>
                </p>

                <div className="mt-5  rounded-lg text-sm drop-shadow-md bg-white dark:bg-[#3D3B6F] dark:border dark:border-opacity-50 dark:border-white px-7 py-5 w-[67%] ">
                  <div className="flex font-semibold mb-4 items-center">
                    <FiInfo className=" text-lg " /> <span className="ml-3">Didn’t receive an email?</span>
                  </div>
                  <p>
                    If you can’t find the email in your inbox or spam folder,
                    please click below and we will send you a new one
                  </p>
                  <button className="px-6 mt-4 rounded-md py-2 text-[#497ADC] dark:border dark:border-opacity-50 dark:border-white dark:bg-[#0000001A;] dark:text-white font-medium bg-blue-50 " onClick={handleResendLink} disabled={isResending} >
                  {isResending ? 'Resending...' : 'Resend Email'}
                  </button>
                </div>

                <div className=" w-[60%] px-3 text-xs font-medium py-2 flex justify-end " >
                  <button onClick={handleChangeEmail} className=" cursor-pointer " >Wrong email? Change it</button>
                </div>

                {/* <p>{message}</p>
                <button onClick={handleResendLink} disabled={isResending}>
                  {isResending ? 'Resending...' : 'Resend Email'}
                </button> */}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* <h1>Email Confirmation</h1>
      {isLoading ? (
        <div>Loading... </div>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={handleResendLink} disabled={isResending}>
            {isResending ? 'Resending...' : 'Resend Email'}
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ConfirmationPage;
