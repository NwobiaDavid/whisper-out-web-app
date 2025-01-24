import { useState, useEffect, useMemo } from 'react'
// import { FaRegMoon } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6'
// import { IoSunnySharp } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { signOut, updateEmail } from 'firebase/auth';
// import { auth } from '../../config/firebase';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {

    const [showStatus, setShowStatus] = useState(true);
    const navigate = useNavigate();
    const [emailName, setEmailName] = useState('');
    const [emailDomain, setEmailDomain] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');

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

        if (auth.currentUser?.email) {
            const [name, domain] = auth.currentUser.email.split('@');
            setEmailName(name);
            setEmailDomain(domain);
        }

    }, [userId]);

    const handleStatusChange = async () => {
        if (!userId) return;

        try {
            const newStatus = !showStatus;
            setShowStatus(newStatus);
            toast.success("Active status change successful")
            await updateDoc(doc(db, 'users', userId), { isActive: newStatus });
        } catch (error) {
            console.error('Error updating active status:', error);
        }
    };


    const handleUpdateEmail = async () => {
        if (!emailName || !emailDomain) {
            toast.error('Email cannot be empty.');
            return;
        }

        const newEmail = `${emailName}@${emailDomain}`;

        try {
            if (!auth.currentUser) throw new Error('User not authenticated.');
            await updateEmail(auth.currentUser, newEmail);

            setIsModalOpen(false)
            toast.success('Email address updated successfully.');
        } catch (error) {
            console.error('Error updating email:', error);
            toast.error('Failed to update email. Please try again.');
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
            toast.error("An error occurred. Please try again later.")
            // alert("An error occurred. Please try again later.");
            return;
        }

        const confirmation = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone once taken."
        );

        if (!confirmation) {
            return;
        }

        try {
            // Deactivate user in Firestore (set isActive to false)
            await updateDoc(doc(db, 'users', userId), { isActive: false });

            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated. Please log in again.");
            }

            // Delete the user account from Firebase Authentication
            // await auth.currentUser.delete();
            await user.delete();

            // Clear local storage and navigate to the signup page
            localStorage.removeItem('loginTimestamp');
            navigate('/signup');

            toast.success("Your account has been successfully deactivated or deleted.");
        } catch (error: any) {
            console.error("Error deleting account:", error);
            if (error?.code === "auth/requires-recent-login") {
                toast.error(
                    "Your session has expired. Please log in again to confirm account deletion."
                );
                // Redirect to login or trigger a reauthentication flow here
            } else {
                toast.error(
                    "An error occurred while trying to delete your account. Please try again later."
                );
            }
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

                    {/* <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer hover:text-white duration-200 bg-white dark:bg-[#44427C]  ' >
                            update email address
                        </div>
                    </div>  */}

                    <div className="border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize">
                        <div
                            className="p-2 xl:p-3 bg-white hover:bg-[#3D3B6F] hover:dark:bg-[#353361] hover:text-white duration-200 dark:bg-[#44427C] cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Update Email Address
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
                        {/* <hr className=' border-[#3D3B6F] dark:border-gray-400  ' />
                        <div className=' p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white  duration-200 bg-white ' >
                            chat settings
                        </div> */}
                    </div>

                    <div className=' mt-5 border border-[#3D3B6F] dark:border-gray-400 overflow-hidden  xl:text-lg rounded-md capitalize ' >
                        <div onClick={handleDeleteAccount} className='p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer text-red-500 dark:bg-[#44427C] hover:text-red-500  duration-200 bg-white  ' >
                            Delete Account
                        </div>
                    </div>
                </div>

                <div className=' mb-5 ' >
                    <h1 className=' capitalize text-[#FFC157] text-sm mb-1 ' >support</h1>

                    <div className=' border border-[#3D3B6F] dark:border-gray-400 overflow-hidden xl:text-lg rounded-md capitalize ' >
                        <div
                            onClick={() => {
                                window.location.href = "mailto:whisperoutofficial@gmail.com?subject=Customer%20Care&body=Hi%20Developer,%0A%0A";
                            }}
                            className=' p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white duration-200 bg-white  ' >
                            customer care
                        </div>
                        {/* <hr className=' border-[#3D3B6F] dark:border-gray-400  ' />
                        <div className=' p-2 xl:p-3 hover:bg-[#3D3B6F] hover:dark:bg-[#353361] cursor-pointer dark:bg-[#44427C] hover:text-white  duration-200 bg-white ' >
                            FAQs
                        </div> */}
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


            {isModalOpen && (
                <div className="fixed z-[999999999] inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-[#44427C] rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Update Email Address</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="text"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Email name"
                                className="p-2 border dark:bg-[#34325f] rounded-lg outline-none w-full"
                            />
                            <span>@{emailDomain}</span>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 active:scale-95 duration-200 dark:text-black bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateEmail}
                                className="px-4 active:scale-95 duration-200 py-2 bg-golden text-white rounded"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
    )
}

export default Settings
