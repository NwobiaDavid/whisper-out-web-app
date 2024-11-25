import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
// import { AiOutlineClose } from "react-icons/ai";
// import { useSelector } from 'react-redux';



interface ChannelSectionProps {
    onChannelClick?: () => void;
}


const ChannelSection: React.FC<ChannelSectionProps> = ({ onChannelClick }) => {
    const location = useLocation();
    const [activeChannel, setActiveChannel] = useState(location.pathname);
    // const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCounts = useSelector((state: any) => state.unreadMessages);

    useEffect(() => {
        setActiveChannel(location.pathname);
    }, [location.pathname]);

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
    //             onChannelClick?.();
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [onChannelClick]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest("a") // Allow clicks on links
            ) {
                onChannelClick?.();
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onChannelClick]);

    const channels = [
        { title: "welfare", img_dark: "/assets/images/icons/channels/channels_light/welfare-pension-insurance-premium_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
        { title: "salaries", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/salary-wage_svgrepo.com.png", link: "salaries" },
        { title: "office space", img_dark: "/assets/images/icons/channels/channels_light/office-chair_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/office-chair_svgrepo.com.png", link: "office-space" },
        { title: "tech jobs", img_dark: "/assets/images/icons/channels/channels_light/jobsmajor_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/jobsmajor_svgrepo.com.png", link: "tech-jobs" },
        { title: "finance", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "finance" },
        { title: "internship", img_dark: "/assets/images/icons/channels/channels_light/student-duotone_svgrepo.com (2).png", img_light: "/assets/images/icons/channels/student-duotone_svgrepo.com.png", link: "internship" },
    ];


    const darkMode = useSelector((state: any) => state.theme.darkMode);

    // useEffect(() => {
    //     const fetchUnreadCounts = async () => {
    //         const user = auth.currentUser;
    //         if (!user) return;

    //         const unreadCountsTemp: Record<string, number> = {};
    //         const userDoc = await getDoc(doc(db, 'users', user.uid));
    //         const companyName = userDoc?.data()?.company;

    //         if (!companyName) {
    //             console.error("User's company name not found");
    //             return;
    //         }

    //         const unsubscribeListeners: (() => void)[] = [];

    //         for (const channel of channels) {
    //             try {
    //                 const userLastSeenRef = doc(db, 'chatRooms', channel.link, 'userLastSeen', user.uid);
    //                 const lastSeenDoc = await getDoc(userLastSeenRef);
    //                 const lastSeenIndex = lastSeenDoc.exists() ? lastSeenDoc.data()?.lastSeenIndex || 0 : 0;

    //                 console.log("last seen index -> "+lastSeenIndex)

    //                 const messagesQuery = query(
    //                     collection(db, 'chatRooms', channel.link, 'messages'),
    //                     where('companyName', '==', companyName),
    //                     orderBy('time')
    //                 );

    //                 const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    //                     const unreadCount = snapshot.docs.length - lastSeenIndex - 1;
    //                     unreadCountsTemp[channel.link] = unreadCount > 0 ? unreadCount : 0;
    //                     setUnreadCounts({ ...unreadCountsTemp });
    //                 });

    //                 unsubscribeListeners.push(unsubscribe);

    //             } catch (error) {
    //                 console.error(`Error fetching unread counts for ${channel.title}:`, error);
    //             }
    //         }
    //         setUnreadCounts(unreadCountsTemp);
    //     };

    //     fetchUnreadCounts();
    // }, [channels]);

    
    console.log("the link-> " + activeChannel)
    console.log("the unread channels--> " + JSON.stringify(unreadCounts))


    const capitalizeFirstLetter = (text: string): string => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };


    const createChannel = () => {

    }


    return (
        <div ref={containerRef} className="absolute w-[80%] lg:w-full h-[70%] lg:h-full inset-0 top-0 p-2 lg:p-2 xl:p-4 pt-2 xl:pt-4 2xl:pt-8 bg-white dark:bg-maindark z-50 overflow-y-auto lg:static lg:bg-transparent lg:dark:bg-transparent">

            <div className="flex flex-col h-full py-0 md:py-2 lg:py-3 xl:py-0 ">

                {/* Suggest Channel Button */}
                <div className="h-[12%] hidden lg:block xl:h-[10%]">
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
                <div className="lg:bg-white overflow-y-auto px-0 lg:px-2 xl:px-3 py-4 h-[78%] xl:h-[80%] rounded-md lg:dark:bg-[#44427C80]">
                    <div className="space-y-3 flex-grow">
                        {channels.map((item, index) => (
                            <Link
                                to={item.link}
                                key={index}
                                onClick={() => { setActiveChannel("/home/" + item.link); onChannelClick?.(); }}
                                className={`flex items-center p-2 xl:p-3 rounded-lg cursor-pointer duration-200   text-sm xl:text-base font-medium capitalize ${activeChannel === "/home/" + item.link ? "bg-[#F2F2F2] dark:bg-maindark border border-gray-300" : "lg:hover:bg-gray-300 border border-gray-200 lg:border-transparent lg:dark:border-transparent dark:border-gray-100 dark:border-opacity-20 dark:hover:bg-maindark"}`
                                }
                            >
                                <div className=" flex items-center " >
                                    <Image
                                        src={!darkMode ? item.img_dark : item.img_light}
                                        className="mr-2 xl:mr-3 rounded-none "
                                    />
                                    {item.title}
                                </div>

                                { unreadCounts[capitalizeFirstLetter(item.link)] > 0 && (
                                    <span className="ml-auto bg-golden text-white text-xs px-2 py-1 rounded-full">
                                        {/* {console.log("Unread count for", item.link, ":", unreadCounts[capitalizeFirstLetter(item.link)])} */}
                                        {unreadCounts[capitalizeFirstLetter(item.link)]}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Footer Links */}
                    <div className="border-t hidden lg:block mt-10 md:mt-16 lg:mt-16 xl:mt-7 p-3 text-center text-sm xl:text-base">
                        <span>About</span> • <span>Terms</span> • <span>Privacy</span>
                    </div>
                </div>


                <div className="h-[12%] w-full flex justify-center items-center lg:hidden xl:h-[10%]">
                    <div
                        onClick={createChannel}
                        className="lg:mb-4 py-2 px-20 xl:p-3 text-center w-[50%] bg-[#FFC157] hover:bg-[#FFC157] duration-200 flex justify-center items-center text-sm whitespace-nowrap xl:text-xl 2xl:text-lg text-black font-medium rounded-md cursor-pointer"
                    >
                        Suggest Channel
                        <div className="ml-1 xl:ml-2 text-xl xl:text-2xl">
                            <IoIosAddCircleOutline />
                        </div>
                    </div>
                </div>



                {/* Toggle Switch */}
                <div className="lg:h-[10%] p-1 flex items-center">
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
