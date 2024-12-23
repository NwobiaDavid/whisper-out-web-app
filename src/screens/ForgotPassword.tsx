import { motion } from "framer-motion"

import Emailheader from "../components/Emailheader"
import Footer from "../components/Footer"
import { sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { auth } from "../config/firebase"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TbMail } from "react-icons/tb";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Input } from "@nextui-org/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCaretBackOutline } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
// import { EmailAuthProvider } from "firebase/auth/web-extension";


const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmIsPasswordVisible] = useState(false);
  // const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);


  // const evaluatePasswordStrength = (password: string): string => {
  //   if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
  //     return "Strong";
  //   }
  //   if (password.length >= 6) {
  //     return "Moderate";
  //   }
  //   return "Weak";
  // };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmIsPasswordVisible(!isConfirmPasswordVisible);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    // const strength = evaluatePasswordStrength(pwd);
    // setPasswordStrength(strength);
  };


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    // setSuccess(null);

    if (!validateEmail(email)) {
      setIsInvalid(true);
      toast.error("Invalid email format. Please try again.");
      return;
    }

    // setIsInvalid(false);
    // toast.success("Email verified. Please set a new password.");
    // setStep("reset");

    try {
      await sendPasswordResetEmail(auth, email);
      setIsInvalid(false);
      toast.success("Email sent! Please check your inbox to reset your password.");
      navigate("/signup")
      // setStep("reset");
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email. Please try again.");
    }
  };


  // const handleReauthenticateAndResetPassword = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // setError(null);
  //   // setSuccess(null);
  
  //   try {
  //     // Collect user's credentials (current password)
  //     const currentPassword = prompt("Please enter your current password for verification:");
  //     if (!currentPassword) {
  //       toast.error("Password verification is required.");
  //       return;
  //     }
  
  //     // Get the current user
  //     const user = auth.currentUser;
  //     if (!user) throw new Error("User not authenticated.");
  
  //     // Create credentials for reauthentication
  //     const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  
  //     // Reauthenticate the user
  //     await reauthenticateWithCredential(user, credential);
  
  //     // Update the password after successful reauthentication
  //     if (newPassword !== confirmPassword) {
  //       toast.error("Passwords do not match.");
  //       return;
  //     }
  
  //     if (newPassword.length < 6) {
  //       toast.error("Password must be at least 6 characters long.");
  //       return;
  //     }
  
  //     await updatePassword(user, newPassword);
  
  //     toast.success("Password reset successfully. Redirecting...");
  //     setTimeout(() => navigate("/signin"), 3000); // Redirect to login
  //   } catch (error: any) {
  //     console.error("Error resetting password:", error);
  //     toast.error(error.message || "Failed to reset password. Please try again.");
  //   }
  // };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    // setSuccess(null);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }


    try {

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      await updatePassword(user, newPassword);
      toast.success("Password reset successfully. Redirecting...");
      setTimeout(() => navigate("/signup"), 3000);

    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      toast.error("Failed to reset password. Please try again.");
    }
  };



  const handleBack = () => {
    if (step === "reset") {
      setStep("email"); 
    } else {
      navigate("/signup"); 
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


        <div className=" w-[85%] relative lg:w-[75%] py-14 lg:py-0 rounded-lg xl:w-[70%] bg-white dark:bg-inherit lg:dark:bg-[#44427C] border border-transparent dark:border-transparent  lg:border-gray-300 lg:grid flex flex-col  lg:grid-cols-2">

          <button
            type="button"
            className="lg:m-4 m-0 absolute top-0 z-30 bg-gray-300 p-4 cursor-pointer rounded-full active:scale-95 duration-200 font-semibold dark:bg-[#44427C] lg:dark:bg-maindark dark:text-white"
            onClick={handleBack}
          >
            <IoCaretBackOutline />
          </button>


          {step === "email" ? (
            <form
              onSubmit={handleEmailSubmit}
              className="xl:px-20 lg:px-7 flex flex-col relative justify-center items-center"
            >
              {/* <h1 className="text-2xl lg:text-3xl font-bold mb-2">Reset Your Password</h1>
              <p className="text-sm text-gray-500 mb-10">
                Enter your email below to verify your account.
              </p> */}

              <Input
                size="lg"
                radius="sm"
                type="email"
                variant="bordered"
                required
                classNames={{
                  label: "text-black/50  dark:text-white/90 text-sm lg:text-base ",
                  inputWrapper: [
                    "dark:border-gray-500",
                    "dark:hover:border-gray-300",
                    "!cursor-text",
                  ],
                }}
                label="Enter your email"
                placeholder=""
                labelPlacement="outside"
                isInvalid={isInvalid}
                errorMessage="Please enter a valid email"
                onValueChange={setEmail}
                startContent={
                  <TbMail
                    className={`${isInvalid && "text-red-600"} text-3xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                  />
                }
                endContent={
                  <div>
                    {!isInvalid && email !== "" && (
                      <IoIosCheckmarkCircleOutline
                        size={"20px"}
                        className="text-green-500"
                      />
                    )}
                  </div>
                }
              />


              <button
                type="submit"
                className={`mt-10 ${email !== "" && !isInvalid
                  ? "dark:bg-[#FFC157] dark:text-black dark:hover:bg-[#f1b54d] bg-[#FFC157] hover:bg-[#f1b54d] text-white"
                  : "bg-gray-200 cursor-not-allowed "
                  } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full`}
              >
                Verify Email
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleResetPassword}
              className="xl:px-20 lg:px-7 flex flex-col relative justify-center items-center"
            >
              <h1 className="text-2xl lg:text-3xl font-bold mb-10">Set a New Password</h1>
              <Input
                size="lg"
                radius="sm"
                type={isPasswordVisible ? 'text' : 'password'}
                variant="bordered"
                required
                label="New Password"
                className="mb-5"
                placeholder=""
                onChange={handlePasswordChange}
                endContent={
                  <div
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
                  >
                    {isPasswordVisible ? <FiEyeOff size="20px" /> : <FiEye size="20px" />}
                  </div>
                }
              />

              <Input
                size="lg"
                radius="sm"
                type={isConfirmPasswordVisible ? "text" : "password"}
                variant="bordered"
                required
                label="Confirm Password"
                placeholder=""
                onValueChange={setConfirmPassword}
                endContent={
                  <div
                    onClick={toggleConfirmPasswordVisibility}
                    className="cursor-pointer"
                  >
                    {isConfirmPasswordVisible ? <FiEyeOff size="20px" /> : <FiEye size="20px" />}
                  </div>
                }
              />


              <button
                type="submit"
                className={`mt-4 ${newPassword !== "" && confirmPassword !== "" && newPassword === confirmPassword
                  ? "dark:bg-[#FFC157] dark:text-black dark:hover:bg-[#f1b54d] bg-[#FFC157] hover:bg-[#f1b54d] text-white"
                  : "bg-gray-200"
                  } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full`}
              >
                Reset Password
              </button>
            </form>
          )}

          <div className="flex -order-1 lg:order-1  flex-col justify-center lg:mb-0 mb-16 lg:py-0 lg:px-7 xl:px-20">
            <h1 className=" text-2xl lg:text-3xl font-bold mb-10">Forgot your password?</h1>
            <div>
              <p className="font-light text-[14px] mb-5 leading-[16px]">
              You forgot your password, enter your already registered email to proceed to updating your password
              </p>
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

        </div>
      </motion.div>

      <Footer />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  )
}

export default ForgotPassword