// import { AuthContext } from '../config/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import Emailheader from '../components/Emailheader';
import Footer from '../components/Footer';
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


    // const authContext = useContext(AuthContext) as AuthContextType | undefined;
    // const user = authContext?.user;
    // console.log("user-> "+ JSON.stringify(user))

    useEffect(() => {
        const checkEmailVerification = async () => {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.reload(); 
            if (currentUser.emailVerified) {
              const uid = currentUser.uid;
              const emailDomain = currentUser.email.split('@')[1];
    
              const companyQuery = query(collection(db, 'companies'), where('domain', '==', emailDomain));
              const companySnapshot = await getDocs(companyQuery);
    
              if (!companySnapshot.empty) {
                const companyDoc = companySnapshot.docs[0].data();
                const companyName = companyDoc.companyName;
                const approvalStatus = companyDoc.approvalStatus;
    
                if (approvalStatus === true) {
                    await setDoc(doc(db, 'users', uid), {
                      uid,
                      email: currentUser.email,
                      company: companyName,
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
        }, 5000); 
    
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
    <div  className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}>
       <Emailheader />
       <div className="w-full py-7 lg:py-20 h-[83%] lg:h-[75%] flex xl:py-28 items-center flex-col ">
      <div className="border p-3 ">
        <h1 className='text-xl font-semibold ' >Verify Your Email</h1>
        <p className=' text-lg ' >Please check your inbox for a verification email.</p>
        <div className="flex mt-5 item-center gap-5 ">
          <button className=' p-2 rounded-md text-blue-800 font-semibold border hover:bg-blue-500 hover:text-white duration-200 border-blue-500 bg-blue-200 ' onClick={handleResendVerification}>Resend Verification Email</button>
          <button className=' p-2 rounded-md border hover:bg-black hover:text-white duration-200 '  onClick={() => navigate('/sign-up')}>Go to Login</button>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  )
}

export default VerifyEmailPage
