import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import React, { useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const ChangePassword = () => {
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleCurrentPasswordVisibility = () => {
    setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    // Perform password change logic here
    alert('Password successfully changed!');
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
                placeholder=""
                onChange={handleCurrentPasswordChange}
                endContent={
                  <div
                    onClick={toggleCurrentPasswordVisibility}
                    className="cursor-pointer"
                  >
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



<button type="submit" className="mt-5">Change Password</button>

              </form>

            </div>
    </div>
  )
}

export default ChangePassword
