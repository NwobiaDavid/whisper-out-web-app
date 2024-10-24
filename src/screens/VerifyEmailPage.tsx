import { AuthContext } from '../config/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
// import { sendEmailVerification } from "firebase/auth"


interface UserType {
    uid: string;
    email: string;
  }
  
  interface AuthContextType {
    user: UserType | null;
  }

const VerifyEmailPage = () => {
    const navigate = useNavigate();


    // const authContext = useContext(AuthContext) as AuthContextType | undefined;
    // const user = authContext?.user;
    // console.log("user-> "+ JSON.stringify(user))

    useEffect(() => {
        const checkEmailVerification = async () => {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.reload(); // Reload user data to get the updated verification status
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
    
        // Polling mechanism: check every 5 seconds to see if the email has been verified
        const verificationInterval = setInterval(() => {
          checkEmailVerification();
        }, 5000); // Poll every 5 seconds
    
        // Clear the interval when the component is unmounted
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
    <div>
       <div className="verify-email-page">
      <h1>Verify Your Email</h1>
      <p>Please check your inbox for a verification email.</p>
      <button onClick={handleResendVerification}>Resend Verification Email</button>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
    </div>
  )
}

export default VerifyEmailPage
