
import { Input, Image } from '@nextui-org/react';
import { useState, useMemo, useEffect, useContext } from 'react';


import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { GoOrganization } from 'react-icons/go';

import Footer from '../components/Footer';


const CompanySearch = () => {

    const [value, setValue] = useState('');


    // go to the db in the company collection
    // search for the company name as the user os typing
    // store the list of company matching search reult in a state array
    // display it
    // the user is able to click one of the displayed company name
    // once clicked, it shows the companies name in the input component
    // the the user can click continue and it sends the user to the home rpute and also stores their info in the database

  return (
    <div
    className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}
  >
  <div className="w-full h-[90%] flex xl:py-28 items-center flex-col ">
    
      <div className=" flex flex-col items-center mb-5 " >
        <Image src="/assets/logo1.png" className=" h-[60px] " alt="company logo" />
        <h1 className=" my-5 text-2xl font-bold " >Welcome to WhisperOut</h1>
        <h3 className="  font-semibold text-lg " >Seen this before!</h3>
      </div>


      <form className=" flex flex-col items-center mt-28  xl:w-[30%] " >
        <p className=" text-lg mb-5 font-medium " >Search for your Company</p>
        <Input
          size="lg"
          radius="md"
          type="email"
          variant="bordered"
          placeholder="Continue with your company email"
          labelPlacement="inside"
          isInvalid={isInvalid}
          errorMessage="Please enter a valid email"
          onValueChange={setValue}
          startContent={
            <GoOrganization
              className={`${
                isInvalid && 'text-red-600'
              } text-2xl dark:text-white text-default-400 pointer-events-none flex-shrink-0`}
            />
          }
          endContent={
            <div>
              {!isInvalid && value !== '' && (
                <IoIosCheckmarkCircleOutline
                  size={'20px'}
                  className="text-green-500"
                />
              )}
            </div>
          }
        />
        <button
          type="submit"
          className={`${
            !isInvalid && value !== ''
              ? ' dark:bg-[#FFC157] dark:text-black  dark:hover:bg-[#f1b54d] bg-[#FFC157]   hover:bg-[#f1b54d] text-white'
              : 'bg-blue-100 hidden '
          } p-3 rounded-lg active:scale-95 dark:bg-[#BBC0CA6E] duration-200 font-semibold w-full mt-5`}
        >
          Continue
        </button>
      </form>
  </div>
  <Footer />
  </div>
  )
}

export default CompanySearch