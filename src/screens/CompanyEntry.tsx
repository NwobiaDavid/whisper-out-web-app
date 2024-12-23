import { Input, Spinner, DropdownSection } from '@nextui-org/react';
import { useState, useContext, useEffect, FormEvent, useMemo } from 'react';
// import { GoOrganization } from 'react-icons/go';
// import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase.ts';
import Footer from '../components/Footer.tsx';
import { AuthContext } from '../config/AuthContext.tsx';
import Emailheader from '../components/Emailheader.tsx';
import { motion } from "framer-motion"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

const CompanyEntry = () => {
  // const [value, setValue] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAbbrev, setCompanyAbbrev] = useState('');
  const [companyLoc, setCompanyLoc] = useState("");
  const [companySize, setCompanySize] = useState(new Set(["Company Size"]));


  // const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  // const { user } = useContext(AuthContext);



  // useEffect(() => {
  //   // console.log("lonely useffect-> " + user)
  //   if (user) {
  //     navigate('/home');
  //   }
  // }, []);


  useEffect(() => {

    const checkStatus = async () => {
      
      const emailDomain = user?.email?.split('@')[1];

      const companyQuery = query(collection(db, 'companies'), where('domain', '==', emailDomain));
      const companySnapshot = await getDocs(companyQuery);
      if (!companySnapshot.empty) {
        const companyDoc = companySnapshot.docs[0].data();
        const approvalStatus = companyDoc.isApproved;

        if (approvalStatus === true) {
          navigate('/home');
        } else {
          navigate('/waiting-page');
        }
      } 
      // else {
      //   navigate('/company-entry');
      // }

    }

    if (!user) {
      navigate('/signup');
    } else {
      checkStatus()
      setLoading(false);
    }
  }, [user, navigate]);

  // useEffect(() => {
  //   if (user !== undefined) {
  //     setLoading(false);
  //   }
  // }, [user]);


  const selectedValue = useMemo(
    () => Array.from(companySize).join(", ").replace(/_/g, ""),
    [companySize],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      // setMessage('User is not authenticated. Please log in again.');
      toast.error('User not authenticated.');
      return;
    }

    if (companyName.trim() === '' || companyAbbrev.trim() === '' || companyLoc.trim() === '') {
      // setMessage('Please fill in all fields.');
      toast.error('All fields are required.');
      return;
    }

    try {
      const emailDomain = user.email.split('@')[1];

      const companySizeArray = Array.from(companySize);

      const companyData = {
        companyName: companyName.trim(),
        companyAbbreviation: companyAbbrev.trim(),
        companyLocation: companyLoc.trim(),
        companySize: companySizeArray,
        domain: emailDomain,
        createdBy: user.uid,
        isApproved: false,
      };

      await addDoc(collection(db, 'companies'), companyData);

      navigate('/company-info');
    } catch (error) {
      console.error('Error submitting company request:', error);
      // setMessage('Error: Unable to submit company request.');
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
          className=" w-[90%] md:w-[85%] lg:w-[75%] py-8 lg:py-0 rounded-lg xl:w-[70%] bg-white dark:bg-inherit lg:dark:bg-[#44427C] border border-transparent dark:border-transparent  lg:border-gray-300 lg:grid flex flex-col  lg:grid-cols-2"
        >

          <form
            onSubmit={handleSubmit}
            className="xl:px-20 lg:px-7  flex flex-col relative justify-center items-center"
          >
            <div className="h-full flex flex-col justify-center w-full ">

              <div className="flex w-full mb-5 lg:mb-10">
                <h2 className=' text-xl lg:text-2xl capitalize font-semibold instrument-sans-font '>company information</h2>
              </div>
              <Input

                radius="sm"
                type="text"
                variant="bordered"
                required
                classNames={{
                  label: "text-black/50  dark:text-white/90 text-sm lg:text-base ",
                  inputWrapper: [
                    "dark:border-gray-500",
                    "dark:hover:border-gray-300",
                    "!cursor-text",
                  ],
                }}
                label="Company Name"
                className='mb-4  '
                placeholder="Enter company name"
                onValueChange={setCompanyName}
              />
              <Input
                radius="sm"
                type="text"
                variant="bordered"
                classNames={{
                  label: "text-black/50  dark:text-white/90 text-sm lg:text-base ",
                  inputWrapper: [
                    "dark:border-gray-500",
                    "dark:hover:border-gray-300",
                    "!cursor-text",
                  ],
                }}
                required
                label="Company Abbreviation"
                className='mb-4'
                placeholder="Enter abbreviation"
                onValueChange={setCompanyAbbrev}
              />
              <Input
                radius="sm"
                type="text"
                variant="bordered"
                required
                classNames={{
                  label: "text-black/50  dark:text-white/90 text-sm lg:text-base ",
                  inputWrapper: [
                    "dark:border-gray-500",
                    "dark:hover:border-gray-300",
                    "!cursor-text",
                  ],
                }}
                label="Company Location"
                className='mb-4'
                placeholder="Enter location"
                onValueChange={setCompanyLoc}
              />

              <Dropdown>
                <DropdownTrigger className=' dark:border-gray-500 rounded-md dark:hover:border-gray-300 active:border-black ' >
                  <Button className="capitalize  p-6 " variant="bordered">
                    {selectedValue}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Select company size"
                  selectedKeys={companySize}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={(keys) => setCompanySize(new Set(keys as Set<string>))}
                >
                  <DropdownSection title="Company Size">
                    <DropdownItem key="2-10">2-10 employees</DropdownItem>
                    <DropdownItem key="11-20">11-20 employees</DropdownItem>
                    <DropdownItem key="21-50">21-50 employees</DropdownItem>
                    <DropdownItem key="51-100">51-100 employees</DropdownItem>
                    <DropdownItem key="100+">101-1000 employees</DropdownItem>
                    <DropdownItem key="100+">1000+ employees</DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>

              <button
                type="submit"
                className={`${companyAbbrev != "" && companyName != "" && companyLoc != ""
                  ? ' dark:bg-[#FFC157] dark:text-black  dark:hover:bg-[#f1b54d] bg-[#FFC157]   hover:bg-[#f1b54d] text-white'
                  : 'bg-gray-200'
                  } p-2 lg:p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-10 `}
              >
                Continue
              </button>
            </div>



          </form>

          <div className="flex -order-1 lg:order-1  flex-col justify-center lg:mb-0 md:mb-16 mb-14 lg:py-0 lg:px-7 xl:px-20">
            <h1 className=" text-xl md:text-2xl lg:text-3xl instrument-sans-font font-bold mb-3 lg:mb-10">Say Hello to WhisperOut</h1>
            <div>
              <p className="font-light hidden lg:block md:text-sm text-xs lg:text-[14px] leading-[16px]">
                WhisperOut is your go-to spot for real talk, zero judgment. Got
                questions you’ve been too shy to ask? Or opinions you want to
                share without the side-eye? WhisperOut lets you dive into
                honest, anonymous conversations about your company that&apos;s all
                about keeping it real. It’s where curiosity meets freedom. Ask
                anything, share your thoughts, and connect with others, all
                while staying completely under the radar.
              </p>
              <p className="font-light block lg:hidden md:text-sm text-xs lg:text-[14px] leading-[16px]">
                WhisperOut is your go-to for honest, anonymous conversations.
                Ask questions, share opinions, and connect—no judgment, just real talk.
              </p>
              <h3 className="mt-4 lg:text-base text-sm font-medium">WhisperOut, Every Voice Matters.</h3>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default CompanyEntry;
