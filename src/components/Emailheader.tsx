import { Image } from '@nextui-org/image';
import ToggleSwitch from './ui/ToggleSwitch';
import { useSelector } from 'react-redux';
import { Link  } from "react-router-dom"
import { RootState } from '../state/store'


const Emailheader = () => {
  

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className=" relative w-full px-3 h-[15%] bg-transparent dark:bg-maindark flex justify-around flex-row-reverse lg: lg:justify-center items-center ">
      <Link to={"/"}>

      <Image
        className=" w-[50px] lg:w-[60px] "
        alt="Whisper out logo"
        src={darkMode ? '/assets/logodark1.png' :'/assets/logo1.png'}
      />
      </Link>

      <div className="  lg:absolute bottom-[25%] left-[7%] ">
      <ToggleSwitch/>
      </div>
    </div>
  );
};

export default Emailheader;
