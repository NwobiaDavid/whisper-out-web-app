import { useState, useEffect, useMemo } from 'react'
// import { FaRegMoon } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6'
// import { IoSunnySharp } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
// import { auth } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


const Settings = () => {

    const [showStatus, setShowStatus] = useState(true);
    const navigate = useNavigate();

    // const userId = useMemo(() => auth.currentUser?.uid, [auth.currentUser]);

    const userId = useMemo(() => auth.currentUser?.uid || null, [auth.currentUser]);

    useEffect(() => {
        if (!userId) return;

        const fetchActiveStatus = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setShowStatus(userData?.isActive ?? true);
                }
            } catch (error) {
                console.error('Error fetching active status:', error);
            }
        };

        fetchActiveStatus();
    }, [userId]);

    const handleStatusChange = async () => {
        if (!userId) return;

        try {
            const newStatus = !showStatus;
            setShowStatus(newStatus);
            await updateDoc(doc(db, 'users', userId), { isActive: newStatus });
        } catch (error) {
            console.error('Error updating active status:', error);
        }
    };

    useEffect(() => {
        console.log('Current userId:', userId);
    }, [userId]);

    // const handleStatusChange = () => {
    //     setShowStatus(prevStatus => !prevStatus);
    // }

    const handleDeleteAccount = async () => {
        if (!userId) {
            console.error("No user ID found.");
            return;
        }

        const confirmation = window.confirm(
            "Are you sure you want to deactivate or delete your account? This action cannot be undone."
        );

        if (!confirmation) {
            return;
        }

        try {
            // Deactivate user in Firestore (set isActive to false)
            await updateDoc(doc(db, 'users', userId), { isActive: false });

            // Delete the user account from Firebase Authentication
            await auth.currentUser.delete();

            // Clear local storage and navigate to the signup page
            localStorage.removeItem('loginTimestamp');
            navigate('/signup');

            alert("Your account has been successfully deactivated or deleted.");
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while trying to delete your account. Please try again.");
        }
    };


    const handleLogout = async () => {
        try {
            if (userId) {
                await updateDoc(doc(db, 'users', userId), { isActive: false }); // Mark as inactive on logout
            }
            await signOut(auth);
            localStorage.removeItem('loginTimestamp');
            navigate('/signup');
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    }


    return (
        <div className='mt-5'>
            <div className=' text-xl xl:text-3xl flex items-center mb-7 ' >
                <FaGear />
                <span className=" ml-2 font-semibold capitalize">settings</span>
            </div>


            <div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >accounts</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white duration-200 bg-white dark:bg-[#44427C]  ' >
                            account settings
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400 ' />
                        <div onClick={() => { navigate("settings/notifications") }} className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white  duration-200 bg-white dark:bg-[#44427C] ' >
                            notifications
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >Security settings</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden  xl:text-lg rounded-md capitalize ' >
                        <div onClick={() => { navigate("change-password") }} className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            change password
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >privacy</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div className='p-2 xl:p-3 hover:bg-[#3D3B6F] flex items-center justify-between hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            <span>show active status</span>

                            <div>
                                <div>
                                    <motion.div
                                        onClick={handleStatusChange}
                                        aria-label="Toggle Active Status"
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

                    <div className=' mt-5 border border-[#3D3B6F] dark:border-gray-400 overflow-hidden  xl:text-lg rounded-md capitalize ' >
                        <div onClick={handleDeleteAccount} className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer text-red-500 dark:bg-[#44427C] hover:text-red-500  duration-200 bg-white  ' >
                            Deactivate or Delete Account
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >support</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div className=' p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            customer care
                        </div>
                        <hr className=' border-[#3D3B6F] dark:border-gray-400  ' />
                        <div className=' p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white  duration-200 bg-white ' >
                            FAQs
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >


                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div onClick={handleLogout} className=' p-2 cursor-pointer xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] text-red-500 font-semibold duration-200 bg-white dark:bg-[#44427C] ' >
                            logout
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Settings
