/* eslint-disable no-unused-vars */
import React from 'react';
import { Input } from '@nextui-org/react';
import { useState, useMemo, useEffect, useContext } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../config/AuthContext.tsx';
import { auth } from '../config/firebase.ts';
import { useNavigate } from 'react-router-dom';


import { TbMail } from 'react-icons/tb';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { VscKey } from "react-icons/vsc";
import { FiEye, FiEyeOff } from 'react-icons/fi';


import { motion } from 'framer-motion';

import Emailheader from '../components/Emailheader.tsx';
import Footer from '../components/Footer.tsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';


interface UserType {
  uid: string;
  email: string;
  isActive: boolean;
}

interface AuthContextType {
  user: UserType | null;
  toggleUserStatus: (isActive: boolean) => void; 
}


const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const navigate = useNavigate();


  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  useEffect(() => {
    console.log("lonely useffect-> " + user)
    if (user) {
      navigate('/home');
    }
  }, []);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = useMemo(() => {
    if (email === '') return false;
    return validateEmail(email) ? false : true;
  }, [email]);


  const evaluatePasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return 'Bad';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  const handleAuth = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setError(null);

    // const emailDomain = email.split('@')[1];

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await sendEmailVerification(userCredential.user);
        toast.success('Sign up successful! Please verify your email.');

        localStorage.setItem('loginTimestamp', Date.now().toString());

        navigate('/verify-email');

      } else {
        console.log("the input data-> email" + email + " the password: " + password + " the auth: " + JSON.stringify(auth))

        // await signInWithEmailAndPassword(auth, email, password);
        // console.log("passed the signin funct")
        // toast.success('Logged in successfully');

        // localStorage.setItem('loginTimestamp', Date.now().toString());

        // navigate('/home');


        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Update the AuthContext with the logged-in user
        if (authContext) {
          const firebaseUser = userCredential.user;
          const userData: UserType = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            isActive: true,
          };
          authContext.toggleUserStatus(true); // Set the user status as active
          localStorage.setItem('loginTimestamp', Date.now().toString());
        }

        toast.success('Logged in successfully');
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Error with authentication:', error);

      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please log in instead.');
        setIsSignUp(false);
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast.error('User not found. Redirecting to sign-up...');
        setTimeout(() => setIsSignUp(true), 2000);
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error('Error: ' + error.message);
      }

    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    const strength = evaluatePasswordStrength(pwd);
    setPasswordStrength(strength);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  return (
    <div
      className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
    >
      <Emailheader />

      <motion.div
        initial={{ y: '10vw' }}
        animate={{ y: 0 }}
        exit={{ y: '-10vw' }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        className="w-full h-[83%] lg:h-[75%] flex justify-center">
        <div
          className=" w-[90%] md:w-[85%] lg:w-[75%] py-10 lg:py-0 rounded-lg xl:w-[70%] border-none lg:border bg-transparent dark:border dark:border-opacity-20 lg:dark:bg-[#44427C] border-gray-200 lg:grid flex flex-col  lg:grid-cols-2"
        >

          <form
            onSubmit={handleAuth}
            className="xl:px-20 lg:px-7  flex flex-col relative justify-center items-center"
          >
            <Input
              size="lg"
              radius="sm"
              type="email"
              variant="bordered"
              required
              label="Continue with your company email and password"
              placeholder=""
              classNames={{
                label: "text-black/50 instrument-sans-font dark:text-white/90 text-sm lg:text-base ",
                inputWrapper: [
                  "dark:border-gray-500",
                  "dark:hover:border-gray-300",
                  "!cursor-text",
                  "instrument-sans-font",
                ],
              }}
              labelPlacement="outside"
              isInvalid={isInvalid}
              errorMessage="Please enter a valid email"
              onValueChange={setEmail}
              startContent={
                <TbMail
                  className={`${isInvalid && 'text-red-600'
                    } text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                />
              }
              endContent={
                <div>
                  {!isInvalid && email !== '' && (
                    <IoIosCheckmarkCircleOutline
                      size={'20px'}
                      className="text-green-500"
                    />
                  )}
                </div>
              }
            />

            <Input
              size="lg"
              radius="sm"
              type={isPasswordVisible ? 'text' : 'password'}
              variant="bordered"
              // label="Enter your password"
              placeholder=""
              classNames={{
                label: "text-black/50 capitalize dark:text-white/90 text-sm lg:text-base ",
                inputWrapper: [
                  "dark:border-gray-500",
                  "dark:hover:border-gray-300",
                  "!cursor-text",
                ],
              }}
              required
              labelPlacement="outside"
              onChange={handlePasswordChange}
              onValueChange={setPassword}
              startContent={
                <VscKey
                  className={`${isInvalid && 'text-red-600'
                    } text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                />
              }
              endContent={
                <div onClick={togglePasswordVisibility} className={` ${passwordStrength !== 'Strong' && password != "" && isSignUp && 'text-red-600'} cursor-pointer`}>
                  {isPasswordVisible ? (
                    <FiEyeOff size={'20px'} />
                  ) : (
                    <FiEye size={'20px'} />
                  )}
                </div>
              }
            />
            {password && (
              <div className={` ${isSignUp ? "flex" : "hidden"} w-full px-1 `}>
                <p className={` font-light text-xs  ${passwordStrength === 'Bad' ? 'text-red-600' : passwordStrength === 'Good' ? 'text-yellow-600' : 'text-green-600'}`}>
                  Password strength: {passwordStrength}
                </p>
              </div>
            )}

{!isSignUp && (
              <div className=" w-full flex justify-end">
                <span
                  className="text-blue-600 text-xs cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </span>
              </div>
            )}

            <button
              type="submit"
              className={`${!isInvalid && email !== '' && password !== ''
                ? ' dark:bg-[#FFC157] dark:text-black  dark:hover:bg-[#f1b54d] bg-[#FFC157]   hover:bg-[#f1b54d] text-white'
                : 'bg-gray-200'
                } p-2 lg:p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-3 `}
            >
              {isSignUp ? 'Sign Up' : 'Log In'}
            </button>

            

            <div className="  text-center">
              {isSignUp ? (
                <p className='  lg:text-base text-sm mt-2 lg:mt-4 ' >
                  Already have an account?{' '}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setIsSignUp(false)}
                  >
                    Log In
                  </span>
                </p>
              ) : (
                <p className=' lg:text-base text-sm mt-2 lg:mt-0 2xl:mt-1 ' >
                  Don't have an account?
                  <span
                    className="text-blue-600 ml-1 cursor-pointer"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign Up
                  </span>
                </p>
              )}
            </div>

            <div className="  lg:absolute  lg:bottom-[4%] mt-2 sm:mt-4  md:mt-10 lg:mt-0 2xl:bottom-[10%] lg:px-7 xl:px-20 text-xs lg:text-sm">
              <p className="font-light leading-[16px] lg:leading-[15px]">
                By inserting your email, you confirm your agreement to
                WhisperOut Terms and Conditions and WhisperOut contacting you
                about our products and services. You can opt at any time by
                deleting your account. Find out more about our
                <span className="italic lg:hidden inline ml-1 font-medium">Privacy Policy</span>
              </p>
              <h4 className="italic hidden lg:flex font-normal">Privacy Policy</h4>
            </div>
          </form>

          <div className="flex -order-1 lg:order-1  flex-col justify-center lg:mb-0 md:mb-16 mb-10 lg:py-0 lg:px-7 xl:px-20">
            <h1 className=" text-xl md:text-2xl lg:text-3xl instrument-sans-font font-bold mb-6 lg:mb-10">{isSignUp ? 'Say Hello' : 'Log in'} to WhisperOut</h1>
            <div>
              <p className="font-light md:text-sm text-xs lg:text-[14px] leading-[16px]">
                WhisperOut is your go-to spot for real talk, zero judgment. Got
                questions you’ve been too shy to ask? Or opinions you want to
                share without the side-eye? WhisperOut lets you dive into
                honest, anonymous conversations about your company that&apos;s all
                about keeping it real. It’s where curiosity meets freedom. Ask
                anything, share your thoughts, and connect with others, all
                while staying completely under the radar.
              </p>
              <h3 className="mt-4 lg:text-base text-sm font-medium">WhisperOut, Every Voice Matters.</h3>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default SignupPage;
