import { useEffect, useState } from 'react';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';


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
          setMessage(`Welcome, ${result.user.email}! Redirecting to home...`);
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
    <div>
    {isLoading ? (
      <div>Loading... {/* Add proper spinner component */}</div>
    ) : (
      <div>
        <h1>Sign-In Confirmation</h1>
        <p>{message}</p>
      </div>
    )}
  </div>
  )
}

export default FinishSignUp
