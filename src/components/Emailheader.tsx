import { Image } from '@nextui-org/image';
import ToggleSwitch from './ui/ToggleSwitch';
import { useSelector } from 'react-redux';
import { Link  } from "react-router-dom"
import { RootState } from '../state/store'


const Emailheader = () => {
  

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className="w-full  relative h-[10%] lg:h-[15%] bg-transparent dark:bg-maindark flex justify-center items-center ">
      <div className="w-[85%] flex justify-between flex-row-reverse  lg:justify-center items-center ">
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
    </div>
  );
};

export default Emailheader;
