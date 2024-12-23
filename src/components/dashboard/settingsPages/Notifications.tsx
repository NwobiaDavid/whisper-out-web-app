// import { useState } from 'react'
// import { FaRegMoon } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6'
// import { IoSunnySharp } from 'react-icons/io5';
// import { motion } from 'framer-motion';
// import { signOut } from 'firebase/auth';
// import { auth } from '../../config/firebase';
// import { auth, db } from '../../config/firebase';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';


const Notifications = () => {

    // const [sendUpdates, setSendUpdates] = useState(true);
    // const navigate = useNavigate();

    // const handleSendUpdates = () => {


    // }

    // const handleDeleteAccount = () => {

    // }

    return (
        <div>
            <div className=' text-xl xl:text-3xl flex items-center mb-7 ' >
                <FaGear />
                <span className=" ml-2 font-semibold capitalize">Notifications</span>
            </div>

            <div>
                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >accounts</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white duration-200 bg-white dark:bg-[#44427C]  ' >
                            notification sound
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400 ' />
                        <div className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white  duration-200 bg-white dark:bg-[#44427C] ' >
                            notifications
                        </div>
                    </div>
                </div>


                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >privacy</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div className='p-2 xl:p-3 hover:bg-[#3D3B6F] flex items-center justify-between hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            <span>show active status</span>

                            {/* <div>
                                <div>
                                    <motion.div
                                        onClick={handleSendUpdates}
                                        aria-label="Toggle Active Status"
                                        className="w-14 h-7 flex items-center rounded-full p-1 cursor-pointer"
                                        animate={{
                                            backgroundColor: sendUpdates ? '#10B981' : '#9CA3AF',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div
                                            className="w-6 h-6 bg-white rounded-full shadow-md"
                                            layout
                                            animate={{ x: sendUpdates ? 24 : 0 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 20,
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            </div> */}
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400  ' />
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white  duration-200 bg-white ' >
                            chat settings
                        </div>
                    </div>
                </div>


            </div>


        </div>
    )
}

export default Notifications
