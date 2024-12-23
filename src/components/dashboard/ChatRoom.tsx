import { db } from '../../config/firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent, useEffect, useContext, useRef, KeyboardEvent } from 'react';
import CryptoJS from 'crypto-js';
import { AuthContext } from '../../config/AuthContext.tsx';
import { FaAngleDown } from "react-icons/fa6";
import { PiNavigationArrowBold } from "react-icons/pi";


import { useDispatch } from 'react-redux';
import { setUnreadMessages } from '../../state/unreadMessages/unreadMessagesSlice.ts';

import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../state/store.ts';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ChatRoomProps {
    channel: string;
    channelTitle: string;
}

interface UserType {
    uid: string;
    email: string;
}

interface AuthContextType {
    user: UserType | null;
}

interface Message {
    id: string;
    text: string;
    time: Timestamp;
    userId: string;
    username: string;
}


const secretKey = 'your_secret_key';

const ChatRoom: React.FC<ChatRoomProps> = ({ channel, channelTitle }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [unreadMessages, setUnreadMessagess] = useState<number>(0);
    const [activeUsers, setActiveUsers] = useState<number>(0);

    const [lastSeenIndex, setLastSeenIndex] = useState<number>(0);
    const [isApproved, setIsApproved] = useState<boolean | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const authContext = useContext(AuthContext) as AuthContextType | undefined;
    const user = authContext?.user;

    const hashUserId = (userId: string) => {
        return CryptoJS.HmacSHA256(userId, secretKey).toString();
    };

    const dispatch = useDispatch<AppDispatch>();


    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; messageId: string | null }>({
        visible: false,
        x: 0,
        y: 0,
        messageId: null,
    });

    const handleRightClick = (event: React.MouseEvent, messageId: string) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            messageId,
        });
    };
    const handleCloseContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
    };

    const handleReportMessage = async () => {
        if (contextMenu.messageId && user) {
            try {
                console.log('Reporting message ID:', contextMenu.messageId);
    
                const messageRef = doc(db, 'chatRoom', channel, 'messages', contextMenu.messageId);
                console.log('Message Ref:', messageRef.path);
    
                const messageDoc = await getDoc(messageRef);
    
                if (!messageDoc.exists()) {
                    console.error("Message does not exist at path:", messageRef.path);
                    toast.error('Message not found.');
                    return;
                }
    
                const messageData = messageDoc.data();
                console.log('Message Data:', messageData);  // Check the data
    
                if (!messageData) {
                    console.error('Message data is undefined!');
                    return;
                }  
    
                const reportData = {
                    messageId: contextMenu.messageId,
                    reportedBy: user.email,
                    username: user?.email || 'Anonymous',
                    messageText: messageData.text,
                    messageTimestamp: messageData.time,
                    reportedAt: Timestamp.now(),
                    channel: channel,
                    status: 'Pending',
                };
    
                await addDoc(collection(db, 'requests'), reportData);
                toast.info('Message has been reported.');
    
            } catch (err) {
                console.error("Error reporting message:", err);
                toast.error('Failed to report message.');
            }
        }
    
        handleCloseContextMenu();
    };

    useEffect(() => {
        const handleClickOutside = () => {
            if (contextMenu.visible) {
                handleCloseContextMenu();
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);


    const generateRandomUsername = () => {
        return `User-${uuidv4().slice(0, 8)}`;
    };

    useEffect(() => {
        // Fetch channel approval status
        const fetchChannelApprovalStatus = async () => {
            const channelDocRef = doc(db, 'chatRoom', channel);
            try {
                const channelDoc = await getDoc(channelDocRef);
                if (channelDoc.exists()) {
                    setIsApproved(channelDoc.data().isApproved || false);
                } else {
                    console.error("Channel document not found.");
                }
            } catch (err) {
                console.error("Error fetching channel approval status:", err);
            }
        };

        fetchChannelApprovalStatus();
    }, [channel]);

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
            setUnreadMessagess(0);
        }

        // if (messagesEndRef.current) {
        //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        // }

        console.log(
            'Scroll Details:',
            messageContainerRef.current?.scrollTop,
            messageContainerRef.current?.scrollHeight,
            messageContainerRef.current?.clientHeight
        );
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
                

                const newMessageRef = await addDoc(collection(db, 'chatRoom', channel, 'messages'), {
                    text: input,
                    time: Timestamp.now(),
                    userId: hashUserId(user?.uid || ""),
                    username: username,
                    companyName: companyName,
                });
    
                // Save the message ID in the document
                await setDoc(newMessageRef, {
                    id: newMessageRef.id,  // Save the Firestore-generated ID in the 'messageId' field
                }, { merge: true });

                setInput('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
                setTimeout(scrollToBottom, 50); 
            } catch (err) {
                console.error('Error adding message to Firestore:', err);
            }

        }
    };



    const fetchLastSeenIndex = async () => {
        if (user) {
            const userDocRef = doc(db, 'chatRoom', channel, 'userLastSeen', user.uid);

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

        }
    };


    const updateLastSeenMessage = async (index: number) => {
        if (user) {
            const userDocRef = doc(db, 'chatRoom', channel, 'userLastSeen', user.uid);
            await updateDoc(userDocRef, { lastSeenIndex: index });
            setLastSeenIndex(index);
        }
    };


    const fetchMessages = async () => {
        if (!user) return;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const companyName = userDoc?.data()?.company;

        if (!companyName) {
            console.error("User's company name not found");
            return;
        }

        const q = query(
            collection(db, 'chatRoom', channel, 'messages'),
            where('companyName', '==', companyName),
            orderBy('time')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedMessages = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: data.id,
                    text: data.text,
                    time: data.time instanceof Timestamp ? data.time : Timestamp.fromDate(new Date(data.time)),
                    userId: data.userId,
                    username: data.username,
                };
            });

            const newUnreadCount = updatedMessages.length - lastSeenIndex - 1;
            setMessages(updatedMessages);
            setUnreadMessagess(newUnreadCount);

            dispatch(setUnreadMessages({ channelTitle, count: newUnreadCount }));
        });

        return unsubscribe;
    };

    useEffect(() => {
        fetchLastSeenIndex();

        let unsubscribe: (() => void) | undefined;

        const setupMessages = async () => {
            unsubscribe = await fetchMessages();
        };

        setupMessages();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [channel, lastSeenIndex, user, dispatch]);




    useEffect(() => {
        if (lastSeenIndex >= 0 && messages.length > 0) {
            scrollToLastSeen();
        }
    }, [lastSeenIndex, messages]);




    
    useEffect(() => {
        const activeUsersQuery = query(
          collection(db, 'users'),
          where('isActive', '==', true)
        );
      
        const unsubscribe = onSnapshot(activeUsersQuery, (snapshot) => {
          const activeUsers = snapshot.docs.map((doc) => doc.data());
          setActiveUsers(activeUsers.length); // Update active users count
        });
      
        return () => unsubscribe();
      }, []);






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
                setUnreadMessagess(0);
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


    if (isApproved === false) {
        // Show approval message if the channel is not approved
        return (
            <div className='flex flex-col items-center justify-center h-full'>
                <p className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                    This channel needs to be approved before you can send or view messages.
                </p>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <div className=' flex justify-between h-[8%] items-center  ' >
                <div className='text-xl font-bold capitalize  text-[#FFC157] '>{channelTitle} Chat</div>

                <div className='flex justify-center items-center' >
                    <div className=' min-w-[6px] min-h-[6px] mr-1 bg-green-500 rounded-full ' ></div>
                    <span className="font-semibold text-green-500 ">{activeUsers} active users</span>
                </div>
            </div>


            <div ref={messageContainerRef}  
            className="flex-grow h-[94%]  bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(68,66,124,0.9)] bg-blend-lighten dark:bg-blend-soft-light relative overflow-y-auto overflow-x-hidden p-2 md:p-4 
                           bg-fixed bg-[url('/assets/images/bg/chatroom/chatroom_light.png')]  dark:bg-[url('/assets/images/bg/chatroom/chatroom_dark.png')] 
                           bg-no-repeat bg-fill bg-center rounded-t-md  "
                           >
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
                                    <div onContextMenu={(e) => handleRightClick(e, msg.id)}  className={`mb-3  flex ${msg.userId === hashedCurrentUserId ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex  flex-col ${msg.userId === hashedCurrentUserId ? 'items-end' : 'items-start'}`}>
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
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className="absolute z-50  bg-white dark:text-black border rounded shadow-md"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left"
                        onClick={handleReportMessage}
                    >
                        Report Message
                    </button>
                </div>
            )}

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
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
    );
};

export default ChatRoom;
