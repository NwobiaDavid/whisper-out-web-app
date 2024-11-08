import { Image } from '@nextui-org/image'
import { useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom"
import { RootState } from '../../state/store'
import { GoGear } from "react-icons/go";
import { useEffect, useState } from 'react';

const Header = () => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    const location = useLocation();

    // const getActiveClass = (path: string) => {
    //     return location.pathname === path ? ' border-b-5 text-blue-800 border-blue-800 dark:text-yellow-500 dark:border-yellow-500 ' : 'text-gray-700 dark:text-gray-200 ';
    // }

    const [activeChannel, setActiveChannel] = useState(location.pathname);

    useEffect(() => {
        setActiveChannel(location.pathname);
    }, [location.pathname]);
    

    return (
        <div className=' xl:px-8 h-[10%] border-b border-gray-300 dark:border-gray-300 flex fixed w-full justify-between   items-center ' >
            <div className=' w-1/3 ' >
                <Link to={"/home"} className=' flex items-center ' >
                    <Image
                        className=" w-[40px] lg:w-[50px] "
                        alt="Whisper out logo"
                        src={darkMode ? '/assets/logodark1.png' : '/assets/logo1.png'}
                    />
                    <h1 className=' text-2xl ml-1 capitalize font-bold  ' >Whisper out</h1>
                </Link>
            </div>


            {/* <div className=' flex items-center gap-5 w-1/3 h-full font-medium capitalize justify-center ' >

                <div className={`${getActiveClass("/home")}  h-full  `}>
                    <Link className=' h-full flex justify-center items-center px-2 ' to="/home">my domain</Link>
                </div>
                <div className={getActiveClass("/replies")}>
                    <Link className=' h-full flex justify-center items-center px-2 ' to="/replies">replies</Link>
                </div>
                <div className={getActiveClass("/updates")}>
                    <Link className=' h-full flex justify-center items-center px-2 ' to="/updates">updates</Link>
                </div>
            </div> */}

            <div className=' flex  w-1/3 justify-center ' >
                <Link to={'/home/settings'} className={`text-3xl  dark:hover:bg-[#44427C] hover:bg-[#d1d1d1] ${activeChannel === "/home/settings" && " bg-[#d1d1d1] dark:bg-[#44427C] "}  p-3 rounded-lg flex items-center group cursor-pointer duration-200`}>
                    <GoGear className="group-hover:-rotate-45 duration-200 transform" />
                    <span className="capitalize text-xl ml-3">
                        settings
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default Header
