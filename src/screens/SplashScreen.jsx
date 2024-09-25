import { Image } from '@nextui-org/image';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {Spinner} from "@nextui-org/spinner";

const SplashScreen = () => {

   const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signup'); 
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
