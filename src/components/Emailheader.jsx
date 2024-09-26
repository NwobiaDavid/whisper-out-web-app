import { Image } from '@nextui-org/image';
import ToggleSwitch from './ui/ToggleSwitch';
import { useSelector } from 'react-redux';



const Emailheader = () => {
  

  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className=" relative w-full px-3 h-[15%] bg-white dark:bg-maindark flex justify-center items-center ">
      <Image
        className=" w-[60px] "
        alt="Whisper out logo"
        src={darkMode ? '/assets/logodark1.png' :'/assets/logo1.png'}
      />

      <div className="absolute bottom-[25%] left-[7%] ">
      <ToggleSwitch/>

      </div>
    </div>
  );
};

export default Emailheader;
