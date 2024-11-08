import React, { useState } from 'react'
import { FaRegMoon } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6'
import { IoSunnySharp } from 'react-icons/io5';
import { motion } from 'framer-motion';


const Settings = () => {

    const [showStatus, setShowStatus] = useState(true);

    const handleStatusChange = () => {
        setShowStatus(prevStatus => !prevStatus);
    }

    return (
        <div>
            <div className='text-3xl flex items-center mb-7 ' >
                <FaGear />
                <span className=" ml-2 font-semibold capitalize">settings</span>
            </div>


            <div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >accounts</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden text-lg rounded-md capitalize ' >
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white duration-200 bg-white dark:bg-[#44427C]  ' >
                            account settings
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400 ' />
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white  duration-200 bg-white dark:bg-[#44427C] ' >
                            notifications
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >Security settings</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden text-lg rounded-md capitalize ' >
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            change password
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >privacy</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden text-lg rounded-md capitalize ' >
                        <div className=' p-3  flex items-center justify-between hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            <span>show active status</span>

                            <div>
                            <div>
                                <motion.div
                                    onClick={handleStatusChange}
                                    className="w-14 h-7 flex items-center rounded-full p-1 cursor-pointer"
                                    animate={{
                                        backgroundColor: showStatus ? '#10B981' : '#9CA3AF',
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        className="w-6 h-6 bg-white rounded-full shadow-md"
                                        layout
                                        animate={{ x: showStatus ? 24 : 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    />
                                </motion.div>
                            </div>
                            </div>
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400  ' />
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white  duration-200 bg-white ' >
                            chat settings
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >support</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden text-lg rounded-md capitalize ' >
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            customer care
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400  ' />
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white  duration-200 bg-white ' >
                            FAQs
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >


                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden text-lg rounded-md capitalize ' >
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] text-red-500 font-semibold duration-200 bg-white dark:bg-[#44427C] ' >
                            logout
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Settings
