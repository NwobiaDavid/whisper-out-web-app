import { Image } from '@nextui-org/image';

import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../state/theme/themeSlice';
import { useEffect } from 'react';

const Emailheader = () => {

    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.theme.darkMode);
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);

  return (
    <div className=" relative w-full px-3 py-10 bg-white dark:bg-slate-900 flex justify-center items-center ">
      <Image
        className=" w-[60px] "
        alt="Whisper out logo"
        src={'/assets/logo1.png'}
      />

      <div className="absolute bottom-[30%] left-[7%] ">
      <button
        onClick={() => dispatch(toggleDarkMode())}
        className="px-4 py-2 border border-gray-600 dark:border-white rounded-md"
      >
        Toggle Dark Mode
      </button>
      </div>
    </div>
  );
};

export default Emailheader;
