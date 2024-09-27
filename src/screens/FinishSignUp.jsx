/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import {Spinner} from "@nextui-org/react";


import Emailheader from '../components/Emailheader';
import Footer from '../components/Footer';

import { FiInfo } from 'react-icons/fi';

const email = window.localStorage.getItem('emailForSignIn');


const FinishSignUp = () => {

    const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      setIsLoading(true);

      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');

        if (!email) {
          email = window.prompt('Please provide your email for confirmation.');
        }

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          setMessage("good");
          window.localStorage.removeItem('emailForSignIn');

          // Simulate loading before redirect
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        } catch (error) {
          console.error('Error completing sign-in:', error);
          setMessage(`Error: ${error.message}`);
        }
      } else {
        setMessage('Invalid sign-in link.');
      }
      setIsLoading(false);
    };

    completeSignIn();
  }, [navigate]);
    
  return (
    <div 
     style={{ backgroundImage: "url('/assets/images/bg/auth.png')" ,
      backgroundRepeat: 'no-repeat',  backgroundSize: 'cover', }}
    className=" w-full max-h-screen dark:bg-maindark h-screen " >
    <Emailheader />

    <div className="w-full h-[75%] flex justify-center  ">

    {isLoading ? (
      <div className="w-full h-full flex justify-center items-center ">
          <Spinner />
          </div>
    ) : (

      <div className=" w-full h-full justify-center flex ">
            <div className="w-[70%] border-2 rounded-lg relative ">


            <div className="w-full text-lg h-full absolute z-[999] backdrop-blur-sm bg-black bg-opacity-5 justify-center items-center flex flex-col" >
            {message === "good" ? (
              <Spinner />
            ): (
              <div>
                <h1 className="font-semibold " >Sign-In Confirmation</h1>
                <p>{message}</p>
              </div>
            )}
            </div>

              <div className="xl:px-20  xl:pt-20 flex xl:w-[65%] flex-col  ">
                <div className="text-3xl mb-7 font-bold ">
                  <h1>Just sent you an email</h1>
                  <h1>
                    Check your inbox to confirm your email address and continue
                  </h1>
                </div>
                <p className="  ">
                  We’ve sent a confirmation email to <span className="font-bold">{email}</span>
                </p>
                <div className="mt-5  rounded-lg text-sm drop-shadow-md bg-white dark:bg-inherit px-7 py-5 w-[67%] ">
                  <div className="flex font-semibold mb-4 items-center">
                    <FiInfo className=" text-lg " /> <span className="ml-3">Didn’t receive an email?</span>
                  </div>
                  <p>
                    If you can’t find the email in your inbox or spam folder,
                    please click below and we will send you a new one
                  </p>
                  <button className="px-6 mt-4 rounded-md py-2 text-[#497ADC] font-medium bg-blue-50 " >
                Resend Email
                  </button>
                </div>
                <div className=" w-[60%] px-3 text-xs font-medium py-2 flex justify-end " >
                  <button  className=" cursor-pointer " >Wrong email? Change it</button>
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
  </div>
  )
}

export default FinishSignUp
