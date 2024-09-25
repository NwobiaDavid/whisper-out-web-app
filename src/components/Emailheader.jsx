import { Image } from '@nextui-org/image';

import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../state/theme/themeSlice';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
      <div className=" rounded-full flex border shadow-lg w-[100px]  dark:border-white  " >

      
        <motion.button
          onClick={() => dispatch(toggleDarkMode())}
          className="flex items-center justify-between opacity-20 p-2 rounded-full relative"
          initial={{ x: 0 }}
          animate={{ x: darkMode ? '50px' : '0px' }} // Adjust '40px' according to your design
          transition={{ type: 'tween', stiffness: 300 }}
        >
          <span className="text-2xl">{!darkMode ? '🌙' : '☀️'}</span> {/* Sun and Moon Icons */}
          {/* <span className="ml-2">{darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}</span> */}
        </motion.button>

        <motion.button
          onClick={() => dispatch(toggleDarkMode())}
          className="flex items-center justify-between border p-2 rounded-full relative"
          initial={{ x: 0 }}
          animate={{ x: darkMode ? '-50px' : '0px' }} // Adjust '40px' according to your design
          transition={{ type: 'tween', stiffness: 300 }}
        >
          <span className="text-2xl">{darkMode ? '🌙' : '☀️'}</span> {/* Sun and Moon Icons */}
          {/* <span className="ml-2">{darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode'}</span> */}
        </motion.button>
      </div>

      </div>
    </div>
  );
};

export default Emailheader;
