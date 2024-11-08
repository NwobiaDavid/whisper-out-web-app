import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';
import { Link, useLocation } from 'react-router-dom';
import { useState } from "react";

const ChannelSection = () => {
    const location = useLocation();
    const [activeChannel, setActiveChannel] = useState(location.pathname);

    const channels = [
        { title: "welfare", img: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
        { title: "salaries", img: "/assets/images/icons/channels/salary-wage_svgrepo.com.png", link: "salaries" },
        { title: "office space", img: "/assets/images/icons/channels/office-chair_svgrepo.com.png", link: "office-space" },
        { title: "tech jobs", img: "/assets/images/icons/channels/jobsmajor_svgrepo.com.png", link: "tech-jobs" },
        { title: "finance", img: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "finance" },
        { title: "internship", img: "/assets/images/icons/channels/student-duotone_svgrepo.com.png", link: "internship" },
    ];

    console.log("the link-> " + activeChannel)

    const createChannel = () => {

    }

    return (
        <div className=' w-[20%] fixed left-[40px] h-[89%] p-5  ' >

            <div className="h-[10%] ">
                <div onClick={createChannel} className=' cursor-pointer dark:text-black dark:bg-white hover:bg-[#FFC157] duration-200 bg-[#FFC157] flex justify-center capitalize font-medium items-center text-xl rounded-md p-3 ' >
                    suggest channel
                    <div className='ml-2 text-2xl'>
                    <IoIosAddCircleOutline  />
                    </div>
                </div>
            </div>

            <div className=' bg-gray-100 dark:bg-[#44427C80] overflow-hidden h-[80%] rounded-md ' >
                <div className=' mb-5 capitalize ' >
                    {channels.map((item, index) => (
                        <Link to={item.link}  onClick={() => setActiveChannel("/home/"+item.link)} key={index} className={` font-medium flex p-4 ${activeChannel === "/home/"+item.link ? " dark:bg-maindark border-gray-50 rounded-xl " : " border-transparent "} hover:bg-gray-300 border  dark:hover:bg-maindark  cursor-pointer duration-200 `} >
                            <Image src={item.img} className={` mr-3 rounded-none ${activeChannel === "/home/"+item.link && " text-[#FFC157]  "}  `} />
                            {item.title}
                        </Link>
                    ))}
                </div>

            <div className='border-t flex mx-5 mt-[50%] p-2 justify-center items-center capitalize  ' >
                <span>about</span>
                <span className=" px-1 flex justify-center  items-center ">.</span>
                <span>terms</span>
                <span className=" px-1 flex justify-center  items-center ">.</span>
                <span>privacy</span>
            </div>
            </div>

            <div className=' h-[10%] flex items-center ' >
                <ToggleSwitch />
            </div>


        </div>
    )
}

export default ChannelSection
