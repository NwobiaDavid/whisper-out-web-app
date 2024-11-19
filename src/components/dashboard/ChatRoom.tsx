import { db } from '../../config/firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent, useEffect, useContext, useRef, KeyboardEvent } from 'react';
import CryptoJS from 'crypto-js';
import { AuthContext } from '../../config/AuthContext.tsx';
import { FaAngleDown } from "react-icons/fa6";
import { PiNavigationArrowBold } from "react-icons/pi";

import { v4 as uuidv4 } from 'uuid';


interface ChatRoomProps {
    channel: string;
}

interface UserType {
    uid: string;
    email: string;
}

interface AuthContextType {
    user: UserType | null;
}

interface Message {
    text: string;
    time: Timestamp;
    userId: string;
    username: string;
}

const secretKey = 'your_secret_key';

const ChatRoom: React.FC<ChatRoomProps> = ({ channel }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [unreadMessages, setUnreadMessages] = useState<number>(0);

    const [lastSeenIndex, setLastSeenIndex] = useState<number>(0);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const authContext = useContext(AuthContext) as AuthContextType | undefined;
    const user = authContext?.user;

    const hashUserId = (userId: string) => {
        return CryptoJS.HmacSHA256(userId, secretKey).toString();
    };


    // const generateUsername = (userId: string) => {
    //     return `User${hashUserId(userId).slice(-5)}`;
    // };

    const generateRandomUsername = () => {
        return `User-${uuidv4().slice(0, 8)}`;
    };


    const isSameDay = (timestamp1: Timestamp, timestamp2: Timestamp) => {
        const date1 = timestamp1.toDate();
        const date2 = timestamp2.toDate();
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const formatDate = (timestamp: Timestamp) => {
        return timestamp.toDate().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };


    const scrollToLastSeen = () => {
        if (messageContainerRef.current && lastSeenIndex < messages.length) {
            const lastSeenElement = messageContainerRef.current.children[lastSeenIndex] as HTMLElement;
            lastSeenElement?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior: 'smooth' });
            updateLastSeenMessage(messages.length - 1);
            setUnreadMessages(0);
        }
    };

    const handleSendMessage = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (input.trim()) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user?.uid || ""));
                const companyName = userDoc.data()?.company;

                if (!companyName) {
                    console.error("User's company name not found");
                    return;
                }
                

                await addDoc(collection(db, 'chatRooms', channel, 'messages'), {
                    text: input,
                    time: Timestamp.now(),
                    userId: hashUserId(user?.uid || ""),
                    username: username,
                    companyName: companyName,
                });

                setInput('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
                scrollToBottom();
            } catch (err) {
                console.error('Error adding message to Firestore:', err);
            }

        }
    };



    const fetchLastSeenIndex = async () => {
        if (user) {
            const userDocRef = doc(db, 'chatRooms', channel, 'userLastSeen', user.uid);

            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setLastSeenIndex(userDoc.data().lastSeenIndex || 0);
                } else {
                    await setDoc(userDocRef, { lastSeenIndex: 0 });
                    setLastSeenIndex(0);
                }
            } catch (error) {
                console.error("Error fetching last seen index:", error);
            }

            // const userDoc = await getDoc(userDocRef);
            // if (userDoc.exists()) {
            //     console.log("last seen index--> "+userDoc.data().lastSeenIndex);
            //     setLastSeenIndex(userDoc.data().lastSeenIndex || 0);
            // }

        }
    };


    const updateLastSeenMessage = async (index: number) => {
        if (user) {
            const userDocRef = doc(db, 'chatRooms', channel, 'userLastSeen', user.uid);
            await updateDoc(userDocRef, { lastSeenIndex: index });
            setLastSeenIndex(index);
        }
    };



    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
    
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const companyName = userDoc?.data()?.company;
    
            if (!companyName) {
                console.error("User's company name not found");
                return;
            }
    
            const q = query(
                collection(db, 'chatRooms', channel, 'messages'),
                where('companyName', '==', companyName),
                orderBy('time')
            );
    
            // Return the unsubscribe function from onSnapshot
            return onSnapshot(q, (snapshot) => {
                const updatedMessages = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        text: data.text,
                        time: data.time instanceof Timestamp ? data.time : Timestamp.fromDate(new Date(data.time)),
                        userId: data.userId,
                        username: data.username,
                    };
                });
    
                setMessages(updatedMessages);
                setUnreadMessages(updatedMessages.length - lastSeenIndex - 1);
            });
        };
    
        fetchLastSeenIndex();
    
        // Fetch messages and handle unsubscribe properly
        let unsubscribe: (() => void) | undefined;
        fetchMessages().then((unsub) => {
            if (unsub) unsubscribe = unsub;
        });
    
        // Clean up the subscription on component unmount
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [channel, lastSeenIndex, user]);


    useEffect(() => {
        if (lastSeenIndex >= 0 && messages.length > 0) {
            scrollToLastSeen();
        }
    }, [lastSeenIndex, messages]);


    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };



    const handleScroll = () => {
        if (messageContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = messageContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;

            if (isAtBottom && lastSeenIndex < messages.length - 1) {
                setUnreadMessages(0);
                updateLastSeenMessage(messages.length - 1);
            }
        }
    };



    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (messageContainerRef.current) {
                messageContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [messages]);

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSendMessage(e);
        }
    };

    const hashedCurrentUserId = user?.uid ? hashUserId(user?.uid) : '';

    useEffect(() => {
        if (user) {
            setUsername(generateRandomUsername());
        }
    }, [user]);

    return (
        <div className='flex flex-col h-full'>
            <div className=' flex justify-between h-[8%] items-center  ' >
                <div className='text-xl font-bold  text-[#FFC157] '>{channel} Chat</div>

                <div className='flex justify-center items-center' >
                    <div className=' min-w-[6px] min-h-[6px] mr-1 bg-green-500 rounded-full ' ></div>
                    <span className="font-semibold text-green-500 ">121 active users</span>
                </div>
            </div>


            <div ref={messageContainerRef}  className="flex-grow h-[94%]  bg-[rgba(255,255,255,0.6)] dark:bg-[#3D3B6F] bg-blend-lighten dark:bg-blend-overlay relative overflow-y-auto overflow-x-hidden p-2 md:p-4 
                           bg-fixed bg-[url('/assets/images/bg/chatroom/chatroom_light.png')]  dark:bg-[url('/assets/images/bg/chatroom/chatroom_dark.png')] 
                           bg-no-repeat bg-fill bg-center rounded-t-md">
                {messages.length === 0 ? (
                    <div className='text-gray-900 font-semibold dark:text-gray-100'>No messages yet. Start the conversation!</div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const showDate = index === 0 || !isSameDay(msg.time, messages[index - 1].time);
                            return (
                                <React.Fragment key={index}>
                                    {showDate && (
                                        <div className="text-center  flex justify-center items-center font-semibold text-gray-400 my-2">
                                            <div className=" px-2 opacity-100  py-1 text-xs w-fit bg-slate-800  rounded-full">{formatDate(msg.time)}</div>
                                        </div>
                                    )}
                                    <div className={`mb-3 flex ${msg.userId === hashedCurrentUserId ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex flex-col ${msg.userId === hashedCurrentUserId ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-2 flex flex-col rounded-lg max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg break-words text-left ${msg.userId === hashedCurrentUserId ? 'dark:text-gray-800 bg-[#FFC157]' : 'bg-[#6967ac]'}`}>
                                                <span className={`text-xs font-semibold ${msg.userId === hashedCurrentUserId ? "text-[#0e0c4180]" : "text-gray-300"}`}>{msg.username}</span>
                                                {msg.text}
                                                <div className={`text-xs text-right mt-2 ${msg.userId === hashedCurrentUserId ? "text-black text-opacity-50" : "text-gray-300"}`}>
                                                    {msg.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {unreadMessages > 0 && (
                <div className='relative w-full'>
                    <div className="absolute bottom-[10%] right-[5%] my-4">
                        <div onClick={scrollToBottom} className='relative z-10 cursor-pointer p-2 md:p-3 bg-[#FFC157] border border-[#c49038] text-maindark rounded-full'>
                            <div className="p-1">
                                <FaAngleDown />
                            </div>
                            <div className="absolute bg-red-500 text-black text-sm h-[20px] w-[30px] flex justify-center items-center font-semibold rounded-full">
                                {unreadMessages}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className='dark:bg-[#44427C80] rounded-b-md py-2 md:p-4'>
                <form className='flex items-center w-full p-1 border rounded-xl bg-white border-gray-500 dark:bg-[#44427C80]  overflow-hidden' onSubmit={handleSendMessage}>
                    <textarea
                        ref={textareaRef}
                        className='flex-grow p-2 focus:outline-none dark:bg-inherit dark:text-white resize-none'
                        placeholder="What's on your mind..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        rows={1}
                    />
                    <button type='submit' className='p-2 ml-2 bg-[#FFC157] hover:bg-[#ffbe4d] duration-200 text-white rounded-full'>
                        <PiNavigationArrowBold className='text-2xl rotate-[125deg]' />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
