import { motion } from "framer-motion"

import Emailheader from "../components/Emailheader"
import Footer from "../components/Footer"
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TbMail } from "react-icons/tb";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Input } from "@nextui-org/input";


const ForgotPassword = () => {

    const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validateEmail(email)) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('A password reset email has been sent to your email address.');
      setTimeout(() => {
        navigate('/signup');
      }, 3000);
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      setError('Failed to send password reset email. Please try again.');
    }
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
        className="w-full h-[83%] lg:h-[75%] flex justify-center"
      >
        <div className=" w-[85%] lg:w-[75%] py-10 lg:py-0 rounded-lg xl:w-[70%] border-none lg:border bg-transparent dark:border dark:border-opacity-20 dark:bg-[#44427C] border-gray-200 lg:grid flex flex-col  lg:grid-cols-2">
          
          <form
            onSubmit={handleResetPassword}
            className="xl:px-20 lg:px-7  flex flex-col relative justify-center items-center"
          >
            <h1 className="text-2xl lg:text-3xl font-bold mb-10">Reset Your Password</h1>
            <p className="text-sm text-gray-500 mb-5">Enter your email below, and we'll send you instructions to reset your password.</p>

            <Input
              size="lg"
              radius="sm"
              type="email"
              variant="bordered"
              required
              label="Your email"
              placeholder=""
              labelPlacement="outside"
              isInvalid={isInvalid}
              errorMessage="Please enter a valid email"
              onValueChange={setEmail}
              startContent={
                <TbMail className={`${isInvalid && 'text-red-600'} text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`} />
              }
              endContent={
                <div>
                  {!isInvalid && email !== '' && (
                    <IoIosCheckmarkCircleOutline size={'20px'} className="text-green-500" />
                  )}
                </div>
              }
            />

            {error && <p className="text-red-600 mt-2">{error}</p>}
            {success && <p className="text-green-600 mt-2">{success}</p>}

            <button
              type="submit"
              className={`mt-4 ${email !== '' && !isInvalid ? 'dark:bg-[#FFC157] dark:text-black dark:hover:bg-[#f1b54d] bg-[#FFC157] hover:bg-[#f1b54d] text-white' : 'bg-gray-200'} p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full`}
            >
              Send Reset Email
            </button>

            <div className="mt-4 text-center">
              <p>
                Remember your password?{' '}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => navigate('/signup')}
                >
                  Sign In
                </span>
              </p>
            </div>

            <div className=" lg:absolute lg:bottom-[10%] mt-10 lg:mt-0 xl:bottom-[10%] lg:px-7 xl:px-20 text-sm">
              <p className="font-light leading-[16px] lg:leading-[15px]">
                By resetting your password, you agree to WhisperOut’s Terms of Service and Privacy Policy.
              </p>
            </div>
          </form>

          <div className="flex -order-1 lg:order-1  flex-col justify-center lg:mb-0 mb-16 lg:py-0 lg:px-7 xl:px-20">
            <h1 className=" text-2xl lg:text-3xl font-bold mb-10">Reset Your Password with WhisperOut</h1>
            <div>
              <p className="font-light text-[14px] leading-[16px]">
                WhisperOut ensures that you can reset your password anytime you forget it. Your security is our top priority.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  )
}

export default ForgotPassword