import Emailheader from '../components/Emailheader'
import Footer from '../components/Footer'
import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@nextui-org/input'
import { Spinner } from "@nextui-org/react";
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../config/firebase.ts';
import { AuthContext } from '../config/AuthContext.tsx';


import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom'
import { IoSearch } from 'react-icons/io5'

const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Education",
    "Manufacturing",
    "Construction",
    "Transportation",
    "Real Estate",
    "Hospitality",
    "Energy",
    "Telecommunications",
    "Agriculture",
    "Media",
    "Entertainment",
    "Pharmaceuticals",
    "Automotive",
    "Aerospace",
    "Defense",
    "Government",
    "Nonprofit",
    "Other"
];


const CompanyInfo = () => {
    // const [selectedIndustry, setSelectedIndustry] = useState('');
    // const [loading, setLoading] = useState(false);
    // const [message, setMessage] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIndustries, setFilteredIndustries] = useState(industries);
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [loading, setLoading] = useState(false);
    // const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    // const handleSelectionChange = (key: any) => {
    //   setSelectedIndustry(key);
    // };


    const handleSearchChange = (e: { target: { value: any } }) => {
        const term = e.target.value;
        setSearchTerm(term);
        setFilteredIndustries(
            industries.filter((industry) =>
                industry.toLowerCase().includes(term.toLowerCase())
            )
        );
    };

    const handleSelection = (industry: any) => {
        setSelectedIndustry(industry);
        setSearchTerm(industry);
        setFilteredIndustries([]);
    };



    // const [companyIndus, setCompanyIndus] = useState("")

    const handleSubmit = async () => {
        if (!user) {
            toast.error('User is not authenticated. Please log in again.');
            // setMessage('User is not authenticated. Please log in again.');
            return;
        }

        if (!selectedIndustry) {
            toast.info('Please select an industry.');
            return;
        }

        setLoading(true);
        try {
            const companiesRef = collection(db, 'companies');
            const querySnapshot = await getDocs(query(companiesRef, where('createdBy', '==', user.uid)));

            if (querySnapshot.empty) {
                throw new Error('No company document found for the user.');
            }

            // Assuming there's only one company document for a user
            const companyDoc = querySnapshot.docs[0];
            const companyRef = doc(db, 'companies', companyDoc.id);

            // Update the existing document
            await updateDoc(companyRef, {
                industry: selectedIndustry,
            });

            navigate('/waiting-page');
        } catch (error) {
            console.error('Error updating company industry:', error);
            // setMessage('Error: Unable to update company industry.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }


    return (
        <div
            className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
        >
            <Emailheader />

            <motion.div
                initial={{ y: '10vw' }}
                animate={{ y: 0 }}
                exit={{ y: '-10vw' }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                className="w-full h-[83%] lg:h-[75%] flex justify-center">
                <div
                    className=" w-[90%] md:w-[85%] lg:w-[75%] py-10 lg:py-0 rounded-lg xl:w-[70%] bg-white dark:bg-inherit lg:dark:bg-[#44427C] border border-transparent dark:border-transparent  lg:border-gray-300 lg:grid flex flex-col  lg:grid-cols-2"
                >

                    <form
                        onSubmit={handleSubmit}
                        className="xl:px-20 lg:px-7  flex flex-col relative justify-center items-center">
                        <div className="flex h-full w-full py-10 xl:py-16 flex-col">

                            <div className="flex w-full mb-3 lg:mb-10">
                                <h2 className=' text-xl lg:text-2xl font-semibold capitalize instrument-sans-font '>Company Information</h2>
                            </div>
                            <Input
                                radius="sm"
                                type="text"
                                variant="bordered"
                                value={searchTerm}
                                placeholder="Search for an industry"
                                required
                                classNames={{
                                    label: "text-black/50  dark:text-white/90 text-sm lg:text-base ",
                                    inputWrapper: [
                                        "dark:border-gray-500",
                                        "dark:hover:border-gray-300",
                                        "!cursor-text",
                                    ],
                                }}
                                label="Industry"
                                onChange={handleSearchChange}
                                className="mb-4"
                                startContent={
                                    <IoSearch
                                        className={` text-lg lg:text-xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
                                    />
                                }
                            />

                            <div className=' max-h-[200px] lg:max-h-[300px] ' >
                                {searchTerm && filteredIndustries.length > 0 && (
                                    <ul className="mb-4 dark:bg-maindark border dark:border-transparent rounded-lg max-h-full overflow-y-scroll ">
                                        {filteredIndustries.map((industry) => (
                                            <li
                                                key={industry}
                                                className="cursor-pointer p-2 hover:bg-gray-200 dark:bg-transparent dark:border dark:border-transparent dark:rounded-lg dark:hover:border-white "
                                                onClick={() => handleSelection(industry)}
                                            >
                                                {industry}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                            <button
                                type="submit"
                                className={`${selectedIndustry != ""
                                    ? ' dark:bg-[#FFC157] dark:text-black  dark:hover:bg-[#f1b54d] bg-[#FFC157]   hover:bg-[#f1b54d] text-white'
                                    : 'bg-gray-200'
                                    } p-2 lg:p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-3 `}
                            >
                                Continue
                            </button>

                        </div>



                    </form>

                    <div className="flex -order-1 lg:order-1  flex-col justify-center lg:mb-0 md:mb-16 mb-7 lg:py-0 lg:px-7 xl:px-20">
                        <h1 className=" text-xl md:text-2xl lg:text-3xl instrument-sans-font font-bold mb-6 lg:mb-10">Say Hello to WhisperOut</h1>
                        <div>
                            <p className="font-light md:text-sm text-xs lg:text-[14px] leading-[16px]">
                                WhisperOut is your go-to spot for real talk, zero judgment. Got
                                questions you’ve been too shy to ask? Or opinions you want to
                                share without the side-eye? WhisperOut lets you dive into
                                honest, anonymous conversations about your company that&apos;s all
                                about keeping it real. It’s where curiosity meets freedom. Ask
                                anything, share your thoughts, and connect with others, all
                                while staying completely under the radar.
                            </p>
                            <h3 className="mt-4 lg:text-base text-sm font-medium">WhisperOut, Every Voice Matters.</h3>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Footer />
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
    )
}

export default CompanyInfo
