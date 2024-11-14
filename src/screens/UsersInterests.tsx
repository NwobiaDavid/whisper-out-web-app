import Footer from "../components/Footer";
import { Image } from "@nextui-org/image";
import { useState, FormEvent, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, getDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '../config/firebase.ts';
import { AuthContext } from '../config/AuthContext.tsx'; 
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}


const UsersInterests = () => {
  const [value, setValue] = useState<string[]>([]);

  const navigate = useNavigate();

  const interest: string[] = [
    "salaries",
    "environment",
    "ethics",
    "salm",
    "enviro",
    "moral",
  ];

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Selected interests:", value);
  
      if (!user) {
        console.error("User not found.");
        return;
      }
  
      try {
        const interestsCollectionRef = collection(db, 'interests');
        const userInterestDocRef = doc(interestsCollectionRef, user.uid);
        
        const userInterestDoc = await getDoc(userInterestDocRef);
  
        if (userInterestDoc.exists()) {
          await updateDoc(userInterestDocRef, {
            interests: value, 
          });
        } else {
          await setDoc(userInterestDocRef, {
            userId: user.uid,
            interests: value,
          });
        }
  
        navigate('/home');
        console.log("Interests updated for user:", user.uid);
      } catch (error) {
        console.error("Error updating interests document:", error);
      }
    };

    const addValue = (item: string) => {
      if (value.includes(item)) {
        setValue(value.filter((v) => v !== item));
      } else if (value.length < 5) {
        setValue([...value, item]);
      }
    };

  return (
    <div
    className={`w-full h-full sm:h-screen md:h-screen relative bg-cover bg-no-repeat 
      bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark flex flex-col`}
  >
    <div className="w-full h-full px-5 md:px-8 lg:px-16 xl:px-20 py-7 lg:py-16 flex items-center flex-col">
      
      <div className="flex flex-col items-center h-[40%] justify-center ">
        <Image src="/assets/logo1.png" className="h-[50px] md:h-[60px]" alt="company logo" />
        <h1 className="my-2 text-2xl md:text-3xl text-center font-bold">
          What’s the most important thing about your company?
        </h1>
        <h3 className="font-semibold text-lg text-center">
          Select your top 5
        </h3>
      </div>

      <form className="flex flex-col items-center h-[60%] 2xl:justify-center gap-4 md:gap-8 w-full lg:w-3/4 xl:w-1/2" onSubmit={handleSubmit}>
        <div className="grid w-full gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {interest.map((item, index) => (
            <div
              key={index}
              onClick={() => addValue(item)}
              className={`p-4 rounded-md border flex justify-center items-center cursor-pointer
                ${!value.includes(item) && "hover:backdrop-blur-md hover:border-gray-300"}
                duration-200 relative`}
            >
              {item}
              {value.includes(item) && (
                <div className="absolute top-2 right-2">
                  <IoIosCheckmarkCircleOutline size={20} className="text-green-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`${
            value.length !== 0
              ? "bg-[#FFC157] text-black hover:bg-[#f1b54d] dark:bg-[#FFC157] dark:text-black dark:hover:bg-[#f1b54d]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } p-3 rounded-lg active:scale-95 flex justify-center items-center duration-200 font-semibold w-2/3 md:w-1/2 lg:w-1/3 mt-4`}
          disabled={value.length === 0}
        >
          Continue
        </button>
      </form>
    </div>
    <Footer />
  </div>
  )
}

export default UsersInterests
