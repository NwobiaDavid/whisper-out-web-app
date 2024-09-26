import { useEffect, useContext} from 'react';
import { Image } from '@nextui-org/image';
import { useNavigate } from 'react-router-dom';
import {Spinner} from "@nextui-org/spinner";
import { AuthContext } from '../config/AuthContext.jsx';

const SplashScreen = () => {
  const { user } = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
    if (user) {
      navigate('/home');
    } else {
      const timer = setTimeout(() => {
        navigate('/signup'); 
      }, 10000);
  
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // useEffect(() => {
   
  // }, [navigate]);

  return (
    <div className="max-w-screen h-screen">
      <div className="w-full h-full flex justify-center items-center ">
        <div className=" flex flex-col justify-center items-center ">
          <Image className=' w-[60px] ' alt="Whisper out logo" src={'/assets/logo1.png'} />
          <span className=" text-3xl font-bold "> WhisperOut </span>
           <div className="mt-3">
             <Spinner size='sm' />
           </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
