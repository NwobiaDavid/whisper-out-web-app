import { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {

  const [message, setMessage] = useState('Please check your email to confirm.');
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const email = window.localStorage.getItem('emailForSignIn');

  const handleResendLink = async () => {
    setIsResending(true);
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: 'http://localhost:3000/finishSignUp',
        handleCodeInApp: true,
      });
      setMessage('Link resent! Check your email.');
    } catch (error) {
      console.error('Error resending link:', error);
      setMessage(`Error: ${error.message}`);
    }
    setIsResending(false);
  };

  const handleEmailVerification = async () => {
    setIsLoading(true);
    // Simulate some async work (Firebase email verification logic)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/home'); // Navigate to the home page after success
    }, 2000); // Simulate delay, this should be the actual confirmation logic.
  };

  return (
    <div>
      <h1>Email Confirmation</h1>
      {isLoading ? (
        <div>Loading... {/* You can add a proper spinner here */}</div>
      ) : (
        <div>
          <p>{message}</p>
          <button onClick={handleResendLink} disabled={isResending}>
            {isResending ? 'Resending...' : 'Resend Email'}
          </button>
          <button onClick={handleEmailVerification}>Simulate Email Confirmation</button>
        </div>
      )}
    </div>
  )
}

export default ConfirmationPage
