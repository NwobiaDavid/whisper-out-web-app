import { Image } from '@nextui-org/image'
import { useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom"
import { RootState } from '../../state/store'
import { GoGear } from "react-icons/go";

const Header = () => {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    const location = useLocation();

    const getActiveClass = (path: string) => {
        return location.pathname === path ? ' border-b-5 text-blue-800 border-blue-800 dark:text-yellow-500 dark:border-yellow-500 ' : 'text-gray-700 dark:text-gray-200 ';
    }

    return (
        <div className=' px-6 h-[10%] border-b flex fixed w-full justify-around   items-center ' >
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


            <div className=' flex items-center gap-5 w-1/3 h-full font-medium capitalize justify-center ' >

                <div className={`${getActiveClass("/home")}  h-full  `}>
                    <Link className=' h-full flex justify-center items-center px-2 ' to="/home">my domain</Link>
                </div>
                <div className={getActiveClass("/replies")}>
                    <Link className=' h-full flex justify-center items-center px-2 ' to="/replies">replies</Link>
                </div>
                <div className={getActiveClass("/updates")}>
                    <Link className=' h-full flex justify-center items-center px-2 ' to="/updates">updates</Link>
                </div>
            </div>

            <div className=' flex  w-1/3 justify-center ' >
                <div className=" text-3xl hover:scale-125 ">
                    <GoGear />
                </div>
            </div>
        </div>
    )
}

export default Header
