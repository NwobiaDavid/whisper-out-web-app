import Footer from "../components/Footer";
import { Image } from "@nextui-org/image";
import { useState, FormEvent, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection, addDoc, getDoc, updateDoc } from 'firebase/firestore'; 
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

const CompanyInterests = () => {
  const [value, setValue] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);

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

  const fetchCompanyName = async (uid: string) => {
    try {
      console.log("the user uid=> "+uid);
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCompanyName(userData.company); 
      } else {
        console.error("No user document found for this UID");
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
    }
  };

  useEffect(() => {
    const currentUser = user;
    if (currentUser) {
      fetchCompanyName(currentUser.uid);
    }
  }, [navigate]);


  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Selected interests:", value);

    if (!companyName) {
      console.error("Company name not found.");
      return;
    }

    try {
      const companyDocRef = doc(db, "companies", companyName);
      const companyDoc = await getDoc(companyDocRef);

      if (companyDoc.exists()) {
        await updateDoc(companyDocRef, {
          interests: value, 
        });
      } else {
        await setDoc(companyDocRef, {
          interests: value,
        }, { merge: true }); 
      }

      navigate('/home');
      console.log("Interests updated for company:", companyName);
    } catch (error) {
      console.error("Error updating company document:", error);
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
      className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark`}
    >
      <div className="w-full h-[90%] flex xl:py-28 items-center flex-col ">
        <div className="flex flex-col items-center mb-5">
          <Image src="/assets/logo1.png" className="h-[60px]" alt="company logo" />
          <h1 className="my-5 text-2xl font-bold">
            What’s the most important things about your company?
          </h1>
          <h3 className="font-semibold text-lg">Select your strong 5</h3>
        </div>

        <form className="flex flex-col items-center mt-28 xl:w-[60%]" onSubmit={handleSubmit}>
          <div className="grid w-full xl:grid-cols-3 gap-3 mb-10 grid-cols-1 ">
            {interest.map((item, index) => (
              <div
                key={index}
                onClick={() => addValue(item)}
                className={`p-3 relative rounded-md border flex justify-center items-center cursor-pointer
                  ${!value.includes(item) && "hover:backdrop-blur-md hover:border-gray-300"}
                  duration-200`}
              >
                {item}

                {value.includes(item) && (
                  <div className="absolute top-[13.5%] right-[1%] ">

                    <IoIosCheckmarkCircleOutline
                      size={'20px'}
                      className="absolute right-2 top-2 text-green-500"
                    />
                  </div>
                )}

              </div>
            ))}
          </div>

          <button
            type="submit"
            className={`${
              value.length !== 0
                ? "dark:bg-[#FFC157] dark:text-black dark:hover:bg-[#f1b54d] bg-[#FFC157] hover:bg-[#f1b54d] text-white"
                : "bg-blue-100 hidden"
            } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] flex justify-center items-center duration-200 font-semibold w-1/2 mt-5`}
          >
            Continue
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyInterests;
