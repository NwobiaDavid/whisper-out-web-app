import { IoIosAddCircleOutline } from "react-icons/io";
import ToggleSwitch from '../ui/ToggleSwitch';
import { Image } from '@nextui-org/image';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/modal";
import { Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc, query, Timestamp, where } from "firebase/firestore";
import { db, auth } from "../../config/firebase"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



interface ChannelSectionProps {
    onChannelClick?: () => void;
}

interface Channel {
    title?: string;
    img_dark?: string;
    img_light?: string;
    link?: string;
    id: string;
    timestamp?: {
        toMillis: () => number;
    };
    isDefault?: boolean;
}


const ChannelSection: React.FC<ChannelSectionProps> = ({ onChannelClick }) => {
    const location = useLocation();
    const [activeChannel, setActiveChannel] = useState(location.pathname);
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCounts = useSelector((state: any) => state.unreadMessages);
    const darkMode = useSelector((state: any) => state.theme.darkMode);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [channelName, setChannelName] = useState("");
    const [reason, setReason] = useState("");

    // const [channelsList, setChannelsList] = useState([]);
    const [channels, setChannels] = useState<Channel[]>([]);


    useEffect(() => {
        setActiveChannel(location.pathname);
    }, [location.pathname]);

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


    // useEffect(() => {
    //     const fetchChatrooms = async () => {
    //         try {
    //             const querySnapshot = await getDocs(collection(db, "chatRoom"));
    //             const fetchedChannels = querySnapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data()
    //             }));
    //             setChannelsList(fetchedChannels);
    //             console.log("getch channel list--> "+JSON.stringify(fetchedChannels))
    //         } catch (error) {
    //             console.error("Error fetching chatrooms:", error);
    //             toast.error("Failed to load channels. Please try again.");
    //         }
    //     };

    //     fetchChatrooms();
    // }, []);


    useEffect(() => {
        const fetchChatrooms = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "chatRoom"));
                const fetchedChatrooms = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Merge fetched chatrooms with static image data
                const mergedChannels = fetchedChatrooms.map(chatroom => {
                    const staticChannel = staticChannels.find(
                        channel => channel.title.toLowerCase() === chatroom.title.toLowerCase()
                    );
                    return {
                        ...chatroom,
                        ...staticChannel 
                    };
                });

                const staticChannelSet = new Set(staticChannels.map(sc => sc.title.toLowerCase()));

                const sortedChannels = mergedChannels.sort((a, b) => {
                    const isAStatic = staticChannelSet.has(a.title?.toLowerCase() || "");
                    const isBStatic = staticChannelSet.has(b.title?.toLowerCase() || "");
    
                    if (isAStatic && isBStatic) {
                        // Maintain the order from staticChannels array
                        return (
                            staticChannels.findIndex(sc => sc.title.toLowerCase() === a.title?.toLowerCase()) -
                            staticChannels.findIndex(sc => sc.title.toLowerCase() === b.title?.toLowerCase())
                        );
                    }
    
                    if (isAStatic) return -1; // Static channels come first
                    if (isBStatic) return 1;
    
                    // Sort others by timestamp (most recent first)
                    return (b.timestamp?.toMillis() ?? 0) - (a.timestamp?.toMillis() ?? 0);
                });

                setChannels(sortedChannels);
                console.log("getch channel list--> "+JSON.stringify(mergedChannels))
            } catch (error) {
                console.error("Error fetching chatrooms:", error);
                toast.error("Failed to load channels. Please try again.");
            }
        };

        fetchChatrooms();
    }, []);

    const staticChannels  = [
        { title: "welfare", img_dark: "/assets/images/icons/channels/channels_light/welfare-pension-insurance-premium_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
        { title: "salaries", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/salary-wage_svgrepo.com.png", link: "salaries" },
        { title: "office space", img_dark: "/assets/images/icons/channels/channels_light/office-chair_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/office-chair_svgrepo.com.png", link: "office space" },
        { title: "tech jobs", img_dark: "/assets/images/icons/channels/channels_light/jobsmajor_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/jobsmajor_svgrepo.com.png", link: "tech jobs" },
        { title: "finance", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "finance" },
        { title: "internships", img_dark: "/assets/images/icons/channels/channels_light/student-duotone_svgrepo.com (2).png", img_light: "/assets/images/icons/channels/student-duotone_svgrepo.com.png", link: "internships" },
    ];



    console.log("the link-> " + activeChannel)
    console.log("the unread channels--> " + JSON.stringify(unreadCounts))


    const capitalizeFirstLetter = (text: string): string => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const handleSuggestChannelClick = () => {
        setIsModalOpen(true);
    };



    const handleSubmitSuggestion = async (onClose: () => void) => {
        try {
            if (!channelName || !reason) {
                toast.warn("Please fill in both the channel name and reason.");
                return;
            }
    
            const currentUser = auth.currentUser; 
            if (!currentUser) {
                toast.error("You need to be logged in to suggest a channel.");
                return;
            }
    
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            const companyName = userDoc?.data()?.company;
    
            if (!companyName) {
                console.error("User's company name not found");
                toast.error("Your company information is missing. Please contact support.");
                return;
            }
    
            const suggestionsRef = collection(db, "channelSuggestions");
            const existingSuggestions = await getDocs(
                query(
                    suggestionsRef,
                    where("name", "==", channelName),
                    where("createdBy", "==", currentUser.uid)
                )
            );
            if (!existingSuggestions.empty) {
                toast.info("You have already suggested this channel.");
                return;
            }
    
            await addDoc(suggestionsRef, {
                reason: reason,
                name: channelName,
                createdBy: currentUser.uid,
                company: companyName,
                isApproved: "pending",
                timestamp: Timestamp.now(),
            });
    
            const chatRoomRef = await addDoc(collection(db, "chatRoom"), {
                title: channelName,
                isDefault: false,
                approvalStatus: "pending",
                company: companyName,
                createdBy: currentUser.uid,
                timestamp: Timestamp.now(),
            });
    
            await updateDoc(chatRoomRef, {
                id: chatRoomRef.id,
            });
    
            console.log("Suggestion submitted successfully.");
            toast.success("Your channel suggestion has been submitted!");
            setChannelName(""); 
            setReason("");
            onClose();
        } catch (error) {
            console.error("Error submitting suggestion:", error);
            toast.error("There was an error submitting your suggestion. Please try again.");
        }
    };

    const createChannel = () => {

    }


    return (
        <div ref={containerRef} className="absolute w-[80%] lg:w-full h-[70%] lg:h-full inset-0 top-0 p-2 lg:p-2 xl:p-4 pt-2 xl:pt-4 2xl:pt-8 bg-white dark:bg-maindark z-50 overflow-y-auto lg:static lg:bg-transparent lg:dark:bg-transparent">

            <div className="flex flex-col h-full py-0 md:py-2 lg:py-3 xl:py-0 ">

                {/* Suggest Channel Button */}
                <div className="h-[12%] hidden lg:block xl:h-[10%]">
                    <div
                        onClick={onOpen}
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
                        {channels.map((item:any, index) => (
                            <Link
                                to={`${item.title}`}
                                key={index}
                                onClick={() => { setActiveChannel(`/home/${item.title}`); onChannelClick?.(); }}
                                className={`flex items-center p-2 xl:p-3 rounded-lg cursor-pointer duration-200   text-sm xl:text-base font-medium capitalize ${activeChannel === "/home/" + item.link ? "bg-[#F2F2F2] dark:bg-maindark border border-gray-300" : "lg:hover:bg-gray-300 border border-gray-200 lg:border-transparent lg:dark:border-transparent dark:border-gray-100 dark:border-opacity-20 dark:hover:bg-maindark"}`
                                }
                            >
                                <div className=" flex items-center " >
                                {item.isDefault && item.img_dark && item.img_light ? (
                                        <Image
                                            src={!darkMode ? item.img_dark : item.img_light}
                                            className="mr-2 xl:mr-3 rounded-none"
                                        />
                                    ): (
                                        <div className="w-6 mr-2 xl:mr-3 h-6 rounded-lg bg-red-400">
                                            
                                        </div>
                                    )}
                                    {item.title}
                                </div>

                                {unreadCounts[capitalizeFirstLetter(item.title)] > 0 && (
                                    <span className="ml-auto bg-golden text-white text-xs px-2 py-1 rounded-full">
                                        {/* {console.log("Unread count for", item.link, ":", unreadCounts[capitalizeFirstLetter(item.link)])} */}
                                        {unreadCounts[capitalizeFirstLetter(item.title)]}
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

            {/* Modal */}
            <Modal
            classNames={{
                base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
              }}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Suggest a Channel</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Channel Name"
                                    placeholder="Enter channel name"
                                    variant="bordered"
                                    value={channelName}
                                    onChange={(e) => setChannelName(e.target.value)}
                                />
                                <Textarea

                                    label="Reason"
                                    placeholder="Why are you suggesting this channel?"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    variant="bordered"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={() => handleSubmitSuggestion(onClose)}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default ChannelSection
