import { Input, Image } from '@nextui-org/react';
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
        approvalStatus: false, 
      };

      await addDoc(collection(db, 'companies'), companyData); 

      navigate('/waiting-page');
    } catch (error) {
      console.error('Error submitting company request:', error);
      setMessage('Error: Unable to submit company request.');
    }


    // try {
    //   console.log("the user => "+JSON.stringify(user));

    //   const emailDomain = user.email.split('@')[1];
      
    //   const companyData = {
    //     companyName: value.trim(),
    //     domain: emailDomain, 
    //     createdBy: user.uid,
    //   };

      
    //   const companyRef = await addDoc(collection(db, 'companies'), companyData);
    //   console.log("company ref--> "+JSON.stringify(companyRef));
      
    //   const userData = {
    //     uid: user.uid,
    //     email: user.email,
    //     company: value.trim(), 
    //   };

    //   const userRef = doc(db, 'users', user.uid);
    //   await setDoc(userRef, userData);

    //   navigate('/interests');
    // } catch (error) {
    //   console.error('Error storing company data:', error);
    //   setMessage('Error: Unable to save company data.');
    // }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
    >
      <div className="w-full py-7 lg:py-20 h-[93%] lg:h-[90%] flex xl:py-28 items-center flex-col ">
        <div className="flex flex-col items-center mb-5">
          <Image src="/assets/logo1.png" className="h-[60px]" alt="company logo" />
          <h1 className="my-6 text-2xl font-bold">Welcome to WhisperOut</h1>
          <h3 className="font-semibold text-lg">New Company? Cool!</h3>
        </div>

        <form className="flex flex-col items-center mt-28 w-[90%] lg:w-[40%] xl:w-[30%]" onSubmit={handleSubmit}>
          <p className="text-lg mb-5 font-medium">Enter your Company Name</p>
          <Input
            size="lg"
            radius="md"
            type="text"
            variant="bordered"
            placeholder="Enter your company name"
            labelPlacement="inside"
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
          />
          {message && <p className="text-red-500 text-sm mt-2">{message}</p>}

          <button
            type="submit"
            className={`${value !== ''
              ? 'dark:bg-[#FFC157] dark:text-black dark:hover:bg-[#f1b54d] bg-[#FFC157] hover:bg-[#f1b54d] text-white'
              : 'bg-blue-100 hidden '
            } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-5`}
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
