import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../state/theme/themeSlice';
import { useEffect } from 'react';
import { motion } from 'framer-motion';


import { FaRegMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";

const ToggleSwitch = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

   // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      const isDarkMode = JSON.parse(savedTheme);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      if (isDarkMode !== darkMode) {
        dispatch(toggleDarkMode());
      }
    }
  }, []); // Run once when component mounts

  // Update theme in localStorage and apply it to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', JSON.stringify(true)); // Save dark mode to localStorage
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', JSON.stringify(false)); // Save light mode to localStorage
    }
  }, [darkMode]); // Run every time darkMode changes

  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [darkMode]);

  return (
    <div className=" rounded-full flex border border-gray-50  drop-shadow-lg bg-white dark:bg-inherit transition-shadow w-[82px]  dark:border-gray-500  ">
      <motion.button
        onClick={() => dispatch(toggleDarkMode())}
        className="flex items-center justify-between opacity-50 p-2  rounded-full relative"
        initial={{ x: 0 }}
        animate={{ x: darkMode ? '41px' : '0px' }} 
        transition={{ type: 'tween', stiffness: 300 }}
      >
        <span className="text-2xl   ">{!darkMode ? <FaRegMoon /> : <IoSunnySharp className="text-[#FFC157]" />}</span>
      </motion.button>

      <motion.button
        onClick={() => dispatch(toggleDarkMode())}
        className="flex items-center justify-between  bg-white dark:text-maindark  drop-shadow-md dark:border-gray-500  p-2 rounded-full relative"
        initial={{ x: 0 }}
        animate={{ x: darkMode ? '-41px' : '0px' }} 
        transition={{ type: 'tween', stiffness: 300 }}
      >
        <span className="text-2xl">{darkMode ? <FaRegMoon /> : <IoSunnySharp className="text-[#FFC157]  "  />}</span>
      </motion.button>
    </div>
  );
};

export default ToggleSwitch;
