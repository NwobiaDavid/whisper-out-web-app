import React from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';

const ChannelSection = () => {

    const channels = [
        { title: "welfare", img: "" },
        { title: "salaries", img: "" },
        { title: "office space", img: "" },
        { title: "tech jobs", img: "" },
        { title: "finance", img: "" },
        { title: "internship", img: "" }
    ]

    const createChannel = () => {

    }
    return (
        <div className=' w-[20%] fixed left-[40px] h-[89%] p-5  ' >

            <div className="h-[10%] ">
                <div onClick={createChannel} className=' cursor-pointer hover:bg-yellow-500 duration-200 bg-yellow-400 flex justify-center capitalize font-medium items-center text-xl rounded-md p-3 ' >
                    create topic
                    <div className='ml-2 text-2xl'>
                    <IoIosAddCircleOutline  />
                    </div>
                </div>
            </div>

            <div className=' bg-gray-100 dark:bg-[#44427C80] overflow-hidden h-[80%] rounded-md ' >
                <div className=' mb-5 capitalize ' >
                    {channels.map((item, index) => (
                        <div key={index} className=' font-medium flex p-4 hover:bg-gray-300 cursor-pointer duration-200 ' >
                            <Image src={item.img} className=' mr-3 ' />
                            {item.title}
                        </div>
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
