// import { AuthContext } from '../config/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import Emailheader from '../components/Emailheader';
import Footer from '../components/Footer';
import { FiInfo } from 'react-icons/fi';
// import { sendEmailVerification } from "firebase/auth"


// interface UserType {
//     uid: string;
//     email: string;
//   }

// interface AuthContextType {
//   user: UserType | null;
// }

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  // const [isChecking, setIsChecking] = useState<boolean>(true);

  // const authContext = useContext(AuthContext) as AuthContextType | undefined;
  // const user = authContext?.user;
  // console.log("user-> "+ JSON.stringify(user))

  useEffect(() => {
    const checkEmailVerification = async () => {
      const currentUser = auth.currentUser;
      setEmail(currentUser?.email || "");

      if (currentUser) {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          const uid = currentUser.uid;
          const emailDomain = currentUser.email?.split('@')[1];

          if (!emailDomain) {
            console.error('Invalid email domain.');
            return;
          }

          const companyQuery = query(collection(db, 'companies'), where('domain', '==', emailDomain));
          const companySnapshot = await getDocs(companyQuery);

          if (!companySnapshot.empty) {
            const companyDoc = companySnapshot.docs[0].data();
            const companyName = companyDoc.companyName;
            const approvalStatus = companyDoc.isApproved;

            if (approvalStatus === true) {
              await setDoc(doc(db, 'users', uid), {
                uid,
                email: currentUser.email,
                company: companyName,
                isActive: true,
              });

              navigate('/interests');
            } else {
              navigate('/waiting-page');
            }
          } else {
            navigate('/company-entry');
          }
        }
      }
    };


    const verificationInterval = setInterval(() => {
      checkEmailVerification();
    }, 3000);

    return () => clearInterval(verificationInterval);
  }, [navigate]);


  const handleResendVerification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      await sendEmailVerification(currentUser);
      alert('Verification email resent.');
    }
  };



  return (
    <div className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}>
      <Emailheader />

      <div className=' w-full h-[83%] lg:h-[75%]  flex justify-center lg:text-center xl:py-20 py-5 lg:px-10 px-5  ' >
        <div className=' flex items-center flex-col gap-4 ' >
          <div className=' instrument-sans-font ' >
            <h1 className=' text-xl xl:text-3xl font-bold' >Just sent you an email</h1>
            <h2 className='text-lg xl:text-2xl font-semibold tracking-tight ' >Check your inbox to confirm your email address and continue </h2>
          </div>


          <div className=' mt-3 lg:mt-5 mb-7 lg:mb-10 ' >
            <p className=' text-sm md:text-base lg:text-lg ' >
              We’ve sent a confirmation email to <span className="font-semibold">{email}</span>
            </p>
          </div>


          <div className=' px-5 lg:px-10 w-full border dark:border-transparent xl:w-[65%] py-3 lg:py-6 rounded-xl drop-shadow-md bg-white dark:bg-[#44427C] ' >
            <div className='flex pb-2  gap-2 justify-start lg:justify-center items-center ' >
              <span  >
              <FiInfo />
              </span>
              <p className=' font-medium ' >Didn’t receive an email?</p>
            </div>
            <div className=' lg:text-base text-xs ' >
              <p>If you can’t find the email in your inbox or spam folder, please click below and we will send you a new one</p>
            </div>
            <div className='pt-4' >
              <button  onClick={handleResendVerification} className='py-2 text-base  px-5 rounded-md  bg-blue-100 dark:bg-maindark dark:text-white dark:border capitalize text-blue-500 ' > resend email </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="w-full py-7 lg:py-20 h-[83%] lg:h-[75%] flex xl:py-28 items-center flex-col ">
        <div className="border p-3 ">
          <h1 className='text-xl font-semibold ' >Verify Your Email</h1>
          <p className=' text-lg ' >Please check your inbox for a verification email.</p>
          <div className="flex mt-5 item-center gap-5 ">
            <button className=' p-2 rounded-md text-blue-800 font-semibold border hover:bg-blue-500 hover:text-white duration-200 border-blue-500 bg-blue-200 ' onClick={handleResendVerification}>Resend Verification Email</button>
            <button className=' p-2 rounded-md border hover:bg-black hover:text-white duration-200 ' onClick={() => navigate('/sign-up')}>Go to Login</button>
          </div>
        </div>
      </div> */}

      <Footer />
    </div>
  )
}

export default VerifyEmailPage
