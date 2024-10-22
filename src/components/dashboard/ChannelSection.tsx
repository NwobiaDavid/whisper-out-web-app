import React from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';
import { Link } from 'react-router-dom';

const ChannelSection = () => {

    const channels = [
        { title: "welfare", img: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
        { title: "salaries", img: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "salaries" },
        { title: "office space", img: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "office-space" },
        { title: "tech jobs", img: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "tech-jobs" },
        { title: "finance", img: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "/finance" },
        { title: "internship", img: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "internship" },
    ];

    const createChannel = () => {

    }

    return (
        <div className=' w-[20%] fixed left-[40px] h-[89%] p-5  ' >

            <div className="h-[10%] ">
                <div onClick={createChannel} className=' cursor-pointer dark:text-black dark:bg-white hover:bg-yellow-500 duration-200 bg-yellow-400 flex justify-center capitalize font-medium items-center text-xl rounded-md p-3 ' >
                    create topic
                    <div className='ml-2 text-2xl'>
                    <IoIosAddCircleOutline  />
                    </div>
                </div>
            </div>

            <div className=' bg-gray-100 dark:bg-[#44427C80] overflow-hidden h-[80%] rounded-md ' >
                <div className=' mb-5 capitalize ' >
                    {channels.map((item, index) => (
                        <Link to={item.link} key={index} className=' font-medium flex p-4 hover:bg-gray-300 dark:hover:text-yellow-400 dark:hover:bg-maindark  cursor-pointer duration-200 ' >
                            <Image src={item.img} className=' mr-3 ' />
                            {item.title}
                        </Link>
                    ))}
                </div>

            <div className='border-t-2 flex mx-5 mt-[50%] p-2 justify-center items-center capitalize  ' >
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
