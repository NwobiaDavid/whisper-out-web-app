import { Input, Image, Spinner } from '@nextui-org/react';
import { useState, useContext, useEffect, FormEvent } from 'react';
import { GoOrganization } from 'react-icons/go';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'; 
import { db } from '../config/firebase.ts';
import Footer from '../components/Footer.tsx';
import { AuthContext } from '../config/AuthContext.tsx'; 



interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

const CompanyEntry = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  // const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setMessage('User is not authenticated. Please log in again.');
      return;
    }

    if (value.trim() === '') {
      setMessage('Please enter a company name.');
      return;
    }

    try {
      const emailDomain = user.email.split('@')[1];
      
      const companyData = {
        companyName: value.trim(),
        domain: emailDomain, 
        createdBy: user.uid,
        isApproved: false, 
      };

      await addDoc(collection(db, 'companies'), companyData); 

      navigate('/waiting-page');
    } catch (error) {
      console.error('Error submitting company request:', error);
      setMessage('Error: Unable to submit company request.');
    }


  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        {/* <p>Loading...</p> */}
        <Spinner />
      </div>
    );
  }

  return (
    <div
    className={`w-full  h-screen flex flex-col justify-center items-center relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
      // className="w-full h-screen bg-cover bg-no-repeat flex  items-center flex-col lg:justify-center dark:bg-maindark bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')]"
    >
      <div className="w-full h-full flex flex-col justify-center items-center py-5 lg:w-1/2 xl:w-1/3 lg:py-10 lg:px-8">
        <div className="flex h-[40%] justify-center flex-col items-center mb-4 lg:mb-8">
          <Image src="/assets/logo1.png" className="h-[50px] lg:h-[60px]" alt="company logo" />
          <h1 className="my-4 text-xl lg:text-2xl font-bold text-center">Welcome to WhisperOut</h1>
          <h3 className="text-md lg:text-lg font-semibold text-center">New Company? Cool!</h3>
        </div>

        <form 
          className="flex flex-col h-[60%] items-center w-[90%] max-w-sm md:w-[70%] lg:w-full mt-20 lg:mt-16 " 
          onSubmit={handleSubmit}
        >
          <p className="text-base lg:text-lg mb-4 font-medium text-center">Enter your Company Name</p>
          <Input
            size="lg"
            radius="md"
            type="text"
            variant="bordered"
            placeholder="Enter your company name"
            labelPlacement="inside"
            classNames={{
              label: "text-black/50 dark:text-white/90 text-sm lg:text-base ",
              inputWrapper: [
                "dark:border-gray-500",
                "dark:hover:border-gray-300",
                "!cursor-text",
              ],
            }}
            onValueChange={setValue}
            startContent={
              <GoOrganization className="text-2xl dark:text-white text-default-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
              <div>
                {value !== '' && (
                  <IoIosCheckmarkCircleOutline size={'20px'} className="text-green-500" />
                )}
              </div>
            }
            className="w-full"
          />
          {message && <p className="text-red-500 text-sm mt-2">{message}</p>}

          <button
            type="submit"
            className={`${
              value !== ''
                ? 'bg-[#FFC157] dark:bg-[#FFC157] hover:bg-[#f1b54d] text-white dark:text-black'
                : 'bg-blue-100 hidden '
            } p-3 rounded-lg active:scale-95 duration-200 font-semibold w-full mt-5`}
          >
            Continue
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyEntry;
