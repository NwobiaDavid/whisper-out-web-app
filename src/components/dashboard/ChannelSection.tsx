import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChannelSection = () => {
    const location = useLocation();
    const [activeChannel, setActiveChannel] = useState(location.pathname);

    useEffect(() => {
        setActiveChannel(location.pathname);
    }, [location.pathname]);

    const channels = [
        { title: "welfare", img_dark: "/assets/images/icons/channels/channels_light/welfare-pension-insurance-premium_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
        { title: "salaries", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/salary-wage_svgrepo.com.png", link: "salaries" },
        { title: "office space", img_dark: "/assets/images/icons/channels/channels_light/office-chair_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/office-chair_svgrepo.com.png", link: "office-space" },
        { title: "tech jobs", img_dark: "/assets/images/icons/channels/channels_light/jobsmajor_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/jobsmajor_svgrepo.com.png", link: "tech-jobs" },
        { title: "finance", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "finance" },
        { title: "internship", img_dark: "/assets/images/icons/channels/channels_light/student-duotone_svgrepo.com (2).png", img_light: "/assets/images/icons/channels/student-duotone_svgrepo.com.png", link: "internship" },
    ];


    const darkMode = useSelector((state: any) => state.theme.darkMode);


    console.log("the link-> " + activeChannel)

    const createChannel = () => {

    }


    return (
        <div className="w-[20%] lg:w-[15%] 2xl:w-[15%] h-full lg:px-0 flex flex-col">
        {/* Header & Channels List */}
        <div className="flex flex-col h-full py-2 xl:py-5 overflow-y-auto">
            
            {/* Suggest Channel Button */}
            <div className="h-[12%] xl:h-[10%]">
                <div 
                    onClick={createChannel} 
                    className="mb-4 p-2 xl:p-3 text-center bg-[#FFC157] hover:bg-[#FFC157] duration-200 flex justify-center items-center text-base xl:text-xl 2xl:text-lg text-black font-medium rounded-md cursor-pointer"
                >
                    Suggest Channel
                    <div className="ml-1 xl:ml-2 text-xl xl:text-2xl">
                        <IoIosAddCircleOutline />
                    </div>
                </div>
            </div>

            {/* Channels List */}
            <div className="bg-white px-2 xl:px-3 py-4 h-[78%] xl:h-[80%] rounded-md dark:bg-[#44427C80]">
                <div className="space-y-3 flex-grow">
                    {channels.map((item, index) => (
                        <Link 
                            to={item.link} 
                            key={index} 
                            onClick={() => setActiveChannel("/home/" + item.link)} 
                            className={`flex items-center p-2 xl:p-3 rounded-lg cursor-pointer duration-200 text-sm xl:text-base font-medium capitalize ${activeChannel === "/home/" + item.link ? "bg-[#F2F2F2] dark:bg-maindark border border-gray-300" : "hover:bg-gray-300 dark:hover:bg-maindark"}`
                            }
                        >
                            <Image 
                                src={!darkMode ? item.img_dark : item.img_light} 
                                className="mr-1 xl:mr-3" 
                            />
                            {item.title}
                        </Link>
                    ))}
                </div>

                {/* Footer Links */}
                <div className="border-t mt-10 p-3 text-center text-sm xl:text-base">
                    <span>About</span> • <span>Terms</span> • <span>Privacy</span>
                </div>
            </div>

            {/* Toggle Switch */}
            <div className="xl:h-[10%] flex items-center">
                <ToggleSwitch />
            </div>
        </div>

        <style>{`
            @media (max-height: 600px) {
                .h-full {
                    height: 80vh;
                }
                .h-[12%], .h-[10%] {
                    height: auto;
                }
                .overflow-y-auto {
                    overflow-y: hidden;
                    overflow-x: auto;
                    display: flex;
                    flex-direction: row;
                }
                .space-y-3 {
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                .p-2, .p-3 {
                    padding: 1rem;
                }
            }
        `}</style>
    </div>
    )
}

export default ChannelSection
