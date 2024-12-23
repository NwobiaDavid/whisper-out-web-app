import { Input } from '@nextui-org/input';
// import { Button } from '@nextui-org/react';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { SetStateAction, useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { FiEye, FiEyeOff } from 'react-icons/fi'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const auth = getAuth();

  const toggleCurrentPasswordVisibility = () => {
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleCurrentPasswordChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCurrentPassword(e.target.value);
  };

  const handlePasswordChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setConfirmPassword(e.target.value);
  };

  const isButtonEnabled = () => {
    return (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword
    );
  };

  const handleChangePassword = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    if (!currentPassword) {
      toast.error('Current password is required.');
      return;
    }

    const user = auth.currentUser;

    if (!user || !user.email) {
      toast.error('No authenticated user found.');
      return;
    }

    // Re-authenticate the user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      toast.success('Password successfully changed!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect current password.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('New password is too weak.');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    }
  };


  // const handleChangePassword = () => {
  //   }

  return (
    <div className='mt-5' >
      <div className=' text-xl xl:text-3xl flex items-center mb-7 ' >
        <FaGear />
        <span className=" ml-2 font-semibold capitalize">change password</span>
      </div>

      <div>

        <form onSubmit={handleChangePassword}
          className='flex flex-col '>
          <h1 className='text-lg font-medium mb-5'>To reset your password, please complete the form below:</h1>

          <Input
            size="lg"
            radius="sm"
            type={isCurrentPasswordVisible ? 'text' : 'password'}
            variant="bordered"
            required
            label="Current Password"
            className="mb-5"
            onChange={handleCurrentPasswordChange}
            onValueChange={setCurrentPassword}
            endContent={
              <div onClick={toggleCurrentPasswordVisibility} className="cursor-pointer">
                {isCurrentPasswordVisible ? <FiEyeOff size="20px" /> : <FiEye size="20px" />}
              </div>
            }
          />



          <Input
            size="lg"
            radius="sm"
            type={isPasswordVisible ? 'text' : 'password'}
            variant="bordered"
            required
            label="New Password"
            className="mb-5"
            onChange={handlePasswordChange}
            onValueChange={setNewPassword}
            endContent={
              <div onClick={togglePasswordVisibility} className="cursor-pointer">
                {isPasswordVisible ? <FiEyeOff size="20px" /> : <FiEye size="20px" />}
              </div>
            }
          />

          <Input
            size="lg"
            radius="sm"
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            variant="bordered"
            required
            label="Confirm Password"
            className="mb-5"
            onValueChange={setConfirmPassword}
            onChange={handleConfirmPasswordChange}
            endContent={
              <div onClick={toggleConfirmPasswordVisibility} className="cursor-pointer">
                {isConfirmPasswordVisible ? <FiEyeOff size="20px" /> : <FiEye size="20px" />}
              </div>
            }
          />



          <button
            type="submit"
            disabled={!isButtonEnabled()}
            className={`mt-5 py-2 px-4 rounded active:scale-95 duration-200 font-semibold ${isButtonEnabled()
              ? 'bg-golden text-white cursor-pointer hover:bg-golden '
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
          >
            Change Password
          </button>

        </form>

      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  )
}

export default ChangePassword
