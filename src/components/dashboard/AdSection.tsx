

const AdSection = () => {
  return (
    // <div className=' lg:w-[10%] 2xl:w-[15%] fixed  right-[50px] h-full p-5 ' >
    //   <div className="bg-white dark:bg-[#44427C80] h-[89%] flex flex-col items-center rounded-lg ">
    //     <h1 className=' capitalize p-2 text-lg font-semibold ' >advertisement</h1>
    //   </div>
    // </div>
    <div className="lg:w-[15%] hidden lg:block 2xl:w-[15%] h-full p-2 xl:p-5 relative">
    <div className="flex flex-col rounded-md items-center bg-white dark:bg-[#44427C80]  h-full">
      <h1 className=" xl:text-lg font-semibold p-2">Advertisement</h1>
      {/* Add ad content or placeholder here */}
    </div>
  </div>
  )
}

export default AdSection
