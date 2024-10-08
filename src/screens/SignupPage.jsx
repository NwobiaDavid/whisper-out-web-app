/* eslint-disable no-unused-vars */
import { Input, Image } from '@nextui-org/react';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { useState, useMemo, useEffect, useContext } from 'react';
import { getAuth, sendSignInLinkToEmail, onAuthStateChanged  } from 'firebase/auth';
import { AuthContext } from '../config/AuthContext.jsx';
import { auth, db } from '../config/firebase.js';
import { useNavigate } from 'react-router-dom'; 
import { TbMail } from 'react-icons/tb';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { motion } from 'framer-motion'; // Import Framer Motion

import Emailheader from '../components/Emailheader';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // const db = 
  // const auth = getAuth();

  let email = window.localStorage.getItem('emailForSignIn');
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate('/home');
    } 
  }, [user, navigate]);
  
  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (value === '') return false;
    return validateEmail(value) ? false : true;
  }, [value]);

  const actionCodeSettings = {
    url: 'http://localhost:5173/finishSignUp',  // The URL to redirect to after sign-in
    handleCodeInApp: true, 
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    try {

      window.localStorage.setItem('emailForSignIn', value);
      email = value;
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage('Link sent! Check your email.');
      navigate('/confirmation');
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      setMessage(`Error: ${error.message}`);
    }
  };


  return (
    <div
     className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
    >
      <Emailheader />
      <motion.div
      initial={{ y: '10vw' }}
      animate={{ y: 0 }}
      exit={{ y: '-10vw' }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
       className="w-full h-[75%] flex justify-center">
        <div 
        className=" w-[75%] rounded-lg xl:w-[70%] border bg-transparent dark:border dark:border-opacity-20 dark:bg-[#44427C] border-gray-200 grid grid-cols-2"
        >
          <form
            onSubmit={handleSendLink}
            className="xl:px-20 lg:px-7 flex flex-col relative justify-center items-center"
          >
            <Input
              size="lg"
              radius="sm"
              type="email"
              variant="bordered"
              label="Continue with your company email"
              placeholder=""
              labelPlacement="outside"
              isInvalid={isInvalid}
              errorMessage="Please enter a valid email"
              onValueChange={setValue}
              startContent={
                <TbMail
                  className={`${
                    isInvalid && 'text-red-600'
                  } text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                />
              }
              endContent={
                <div>
                  {!isInvalid && value !== '' && (
                    <IoIosCheckmarkCircleOutline
                      size={'20px'}
                      className="text-green-500"
                    />
                  )}
                </div>
              }
            />

            <button
              type="submit"
              className={`${
                !isInvalid && value !== ''
                  ? ' dark:bg-[#FFC157] dark:text-black  dark:hover:bg-[#f1b54d] bg-[#FFC157]   hover:bg-[#f1b54d] text-white'
                  : 'bg-gray-200'
              } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-5`}
            >
              Continue
            </button>

            <div className="absolute lg:bottom-[10%] xl:bottom-[10%] lg:px-7 xl:px-20 text-sm">
              <p className="font-light leading-[15px]">
                By inserting your email, you confirm your agreement to
                WhisperOut Terms and Conditions and WhisperOut contacting you
                about our products and services. You can opt at any time by
                deleting your account. Find out more about our
              </p>
              <h4 className="italic font-normal">Privacy Policy</h4>
            </div>
          </form>

          <div className="flex flex-col justify-center lg:px-7 xl:px-20">
            <h1 className="text-3xl font-bold mb-10">Say Hello to WhisperOut</h1>
            <div>
              <p className="font-light text-[14px] leading-[16px]">
                WhisperOut is your go-to spot for real talk, zero judgment. Got
                questions you’ve been too shy to ask? Or opinions you want to
                share without the side-eye? WhisperOut lets you dive into
                honest, anonymous conversations about your company that&apos;s all
                about keeping it real. It’s where curiosity meets freedom. Ask
                anything, share your thoughts, and connect with others, all
                while staying completely under the radar.
              </p>
              <h3 className="mt-4 font-medium">WhisperOut, Every Voice Matters.</h3>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default SignupPage;
