import { db } from '../../config/firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent, useEffect, useContext, useRef, KeyboardEvent } from 'react';
import CryptoJS from 'crypto-js';
import { AuthContext } from '../../config/AuthContext.tsx';
import { FaAngleDown } from "react-icons/fa6";
import { PiNavigationArrowBold } from "react-icons/pi";
// import VisibilitySensor from 'react-visibility-sensor';
import { debounce } from 'lodash';

import { useDispatch } from 'react-redux';
import { setUnreadMessages } from '../../state/unreadMessages/unreadMessagesSlice.ts';

import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../../state/store.ts';
// import { Spinner } from '@nextui-org/spinner';
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

// interface Message {
//     id: string;
//     text: string;
//     timestamp: Timestamp;
//     userId: string;
//     username: string;
// }

type Message = {
    id: string;
    text: string;
    timestamp: Timestamp;
    userId: string;
    username: string;
    companyName: string;
    domain: string;
};

const secretKey = 'your_secret_key';

const ChatRoom: React.FC<ChatRoomProps> = ({ channel, channelTitle }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [unreadMessages, setUnreadMessagess] = useState<number>(0);
    const [activeUsers, setActiveUsers] = useState<number>(0);


    // const [isLoading, setIsLoading] = useState(true)
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);



    const [lastSeenIndex, setLastSeenIndex] = useState<number>(0);
    const [lastSeenMessageId, setLastSeenMessageId] = useState<string>('')
    const [isApproved, setIsApproved] = useState<boolean | null>(null);


    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const authContext = useContext(AuthContext) as AuthContextType | undefined;
    const user = authContext?.user;


    // let manualScroll = false;

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
                console.log("--passed here")

                if (!messageDoc.exists()) {
                    console.error("Message does not exist at path:", messageRef.path);
                    toast.error('Message not found.');
                    return;
                }

                const messageData = messageDoc.data();
                console.log('Message Data:', messageData);  // Check the data

                console.log('context menu data: ' + JSON.stringify(contextMenu))
                if (!messageData) {
                    console.error('Message data is undefined!');
                    return;
                }

                console.log("--passed here11111")
                const reportData = {
                    messageId: contextMenu.messageId,
                    reportedBy: user.email || 'Unknown',
                    messageText: messageData.text || 'No message text provided.',
                    messageTimestamp: messageData.timestamp instanceof Timestamp
                        ? messageData.timestamp
                        : Timestamp.now(),
                    reportedAt: Timestamp.now(),
                    channel: channel || 'Unknown channel', // Provide a default if channel is undefined
                    status: 'Pending',
                };

                console.log("--passed here222")

                const reportRef = doc(db, 'reportedMessages', contextMenu.messageId);
                console.log("--passed here333")
                await setDoc(reportRef, reportData);

                // await addDoc(collection(db, 'reportedMessages'), reportData);
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
        if (lastSeenMessageId) {
            const lastSeenElement = document.getElementById(lastSeenMessageId);

            if (lastSeenElement) {
                lastSeenElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // Ensures the element is positioned in the center of the view
                });
            } else {
                console.warn("Element for lastSeenMessageId not found");
            }
        }
    };




    const scrollToBottom = () => {

        // if (!manualScroll && messageContainerRef.current) {
        //     messageContainerRef.current.scrollTo({
        //         top: messageContainerRef.current.scrollHeight,
        //         behavior: 'smooth',
        //     });
        //     setShowScrollToBottom(false);
        //     setUnreadMessages(0);
        // }

        

    
    

        if ( messageContainerRef.current) {
            messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior: 'smooth' });
            updateLastSeenMessage(messages.length - 1);
            setShowScrollToBottom(false);
            setUnreadMessagess(0);
            dispatch(setUnreadMessages({ channelTitle, count: 0 }));
            console.log(`**********the message length: ${messages.length}. unread: ${unreadMessages} the last message: ${JSON.stringify(messages[messages.length -1])} `)
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


    const handleScroll = debounce(() => {
        if (messageContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;

            // Check if the user is near the bottom (adjust threshold as needed)
            const nearBottom = scrollHeight - scrollTop - clientHeight < 10;
            console.log("the near button-> " + nearBottom)

            if (!nearBottom) {
                setShowScrollToBottom(true);


            } else {
                setShowScrollToBottom(false);
                setUnreadMessagess(0);
                updateLastSeenMessage(messages.length - 1);
                dispatch(setUnreadMessages({ channelTitle, count: 0 }));
            }

        }
    }, 200)

    useEffect(() => {

        const container = messageContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };

    }, [messageContainerRef]);




    const handleSendMessage = async (e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (input.trim()) {
            try {
                const userDoc = await getDoc(doc(db, 'users', user?.uid || ""));
                const companyName = userDoc.data()?.company;
                const emailDomain = userDoc.data()?.email?.split('@')[1];

                if (!companyName) {
                    console.error("User's company name not found");
                    return;
                }


                const newMessage = {
                    id: `${Date.now()}`, // Temporary ID, Firestore will provide the final ID
                    text: input,
                    timestamp: Timestamp.now(),
                    userId: hashUserId(user?.uid || ""),
                    username: username,
                    companyName: companyName,
                    domain: emailDomain,
                };

                // Optimistically update messages state
                setMessages((prevMessages) => [...prevMessages, newMessage]);

                // Save the message to Firestore
                const newMessageRef = await addDoc(collection(db, 'chatRoom', channel, 'messages'), newMessage);

                // Save the Firestore-generated ID in the message document
                await setDoc(
                    newMessageRef,
                    { id: newMessageRef.id },
                    { merge: true }
                );

                console.log(`sending message: ${input}`)
    
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
                    const data = userDoc.data();
                    setLastSeenIndex(data.lastSeenIndex || 0);
                    setLastSeenMessageId(data.lastSeenMessageId || '');
                    console.log("inside fetch index: " + JSON.stringify(userDoc.data().lastSeenMessageId))
                } else {
                    await setDoc(userDocRef, { lastSeenIndex: 0, lastSeenMessageId: '' });
                    setLastSeenIndex(0);
                    setLastSeenMessageId('');
                }
            } catch (error) {
                console.error("Error fetching last seen index:", error);
            }

        }
    };




    const updateLastSeenMessage = async (index: number) => {
        if (user && index >= 0 && index < messages.length) {
            const userDocRef = doc(db, 'chatRoom', channel, 'userLastSeen', user.uid);

            const theMessage = messages[index]
            setLastSeenMessageId(messages[index].id)
            setLastSeenIndex(index);

            const newdata = {
                lastSeenMessageId,
                lastSeenIndex
            }
            await addDoc(collection(db, 'chatRoom', channel, 'userLastSeen', user.uid), newdata)

            console.log("latest message or the last " + JSON.stringify(messages[messages.length-1]))
            console.log("upl: the message last seen ->" + JSON.stringify(theMessage))
            console.log("upl: the last seen index " + index)
            console.log("upl: the last seen message " + messages[index].id)


            await updateDoc(userDocRef, { lastSeenIndex: index, lastSeenMessageId: messages[index].id });
        }
    };



    const fetchMessages = async () => {
        if (!user) return;

        // setIsLoading(true)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const companyDomain = userDoc?.data()?.domain;

        if (!companyDomain) {
            console.error("User's company domain not found");
            return; 
        }

        const q = query(
            collection(db, 'chatRoom', channel, 'messages'),
            where('domain', '==', companyDomain),
            orderBy('timestamp')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedMessages = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: data.id,
                    text: data.content,
                    timestamp: data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.fromDate(new Date(data.timestamp)),
                    userId: data.userId,
                    username: data.userName,
                    companyName: data.companyName,
                    domain: data.domain,
                };
            });

            const newUnreadCount = updatedMessages.length - lastSeenIndex - 1;
            setMessages(updatedMessages);
            setUnreadMessagess(newUnreadCount);
            // setIsLoading(false)
            dispatch(setUnreadMessages({ channelTitle, count: newUnreadCount }));
        });

        return unsubscribe;
    };


    // useEffect(() => {
    //     fetchLastSeenIndex().then(() => {
    //         if (lastSeenIndex >= 0 && messages.length > 0) {
    //             scrollToLastSeen();
    //         }
    //     });
    // }, [channel]);



    useEffect(() => {
        fetchLastSeenIndex();
        let unsubscribe: (() => void) | undefined;

        const setupMessages = async () => {
            unsubscribe = await fetchMessages();
        };

        setupMessages();

        console.log("-------- the last seen message: " + lastSeenMessageId)
        if (lastSeenMessageId) {
            scrollToLastSeen();
        }


        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [channel]);


    // useEffect(() => {
    //     fetchLastSeenIndex();
    // }, [channel]);


    useEffect(() => {
        fetchLastSeenIndex();
        if (lastSeenIndex >= 0 && messages.length > 0) {
            scrollToLastSeen();
        }
    }, [lastSeenIndex, messages]);



    // const debouncedHandleScroll = debounce(handleScroll, 200);

    // useEffect(() => {
    //     const container = messageContainerRef.current;
    //     if (container) {
    //         container.addEventListener('scroll', debouncedHandleScroll);
    //     }
    //     return () => {
    //         if (container) {
    //             container.removeEventListener('scroll', debouncedHandleScroll);
    //         }
    //     };
    // }, [messages]);









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


    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
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
                className="flex-grow h-[94%]  bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(68,66,124,0.9)] bg-blend-lighten  relative overflow-y-auto overflow-x-hidden p-2 md:p-4 
                           bg-fixed bg-[url('/assets/images/bg/chatroom/chatroom_light.png')]  dark:bg-[url('/assets/images/bg/chatroom/chatroom_dark1.png')] 
                           bg-no-repeat bg-cover lg:bg-fill lg:dark:bg-contain bg-center rounded-t-md  "
            >
                {/* {isLoading ? (
                               <div className='w-full h-full flex justify-center items-center ' >  <Spinner className='text-golden ' /></div>
                           ) : (
                               <>  */}

                {messages.length === 0 ? (
                    <div className='text-gray-900 font-semibold dark:text-gray-100'>No messages yet. Start the conversation!</div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const showDate = index === 0 || !isSameDay(msg.timestamp, messages[index - 1].timestamp);
                            return (
                                <React.Fragment key={index}>
                                    {showDate && (
                                        <div className="text-center  flex justify-center items-center font-semibold text-gray-400 my-2">
                                            <div className=" px-2 opacity-100  py-1 text-xs w-fit bg-slate-800  rounded-full">{formatDate(msg.timestamp)}</div>
                                        </div>
                                    )}
                                    <div
                                        id={msg.id}
                                        onContextMenu={(e) => handleRightClick(e, msg.id)}
                                        className={`mb-3   flex ${msg.userId === hashedCurrentUserId ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex  flex-col ${msg.userId === hashedCurrentUserId ? 'items-end' : 'items-start'}`}>
                                            <div className={`py-1 px-2 break-all flex flex-col rounded-lg w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg break-words text-left ${msg.userId === hashedCurrentUserId ? 'dark:text-gray-800 bg-[#FFC157]' : 'bg-[#6967ac]'}`}>
                                                <span className={`text-xs font-semibold ${msg.userId === hashedCurrentUserId ? "text-[#0e0c4180]" : "text-gray-300"}`}>{msg.username}</span>
                                                {msg.text}
                                                <div className={`text-xs text-right mt-2 ${msg.userId === hashedCurrentUserId ? "text-black text-opacity-50" : "text-gray-300"}`}>
                                                    {msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                    {/* {index === messages.length - 1 && (
                                <VisibilitySensor onChange={handleVisibilityChange} partialVisibility>
                                    <div ref={messagesEndRef} />
                                </VisibilitySensor>
                            )} */}
                                </React.Fragment>
                            );
                        })}
                    </>
                )}
                <div ref={messagesEndRef} />
                {/* </> )}  */}
            </div>


            {unreadMessages > 0 && showScrollToBottom && (
                <div className='relative w-full'>
                    <div className="absolute bottom-[10%] right-[50%] my-4">
                        <div onClick={scrollToBottom} className='relative z-10 cursor-pointer p-1 md:p-3 bg-[#FFC157] border border-[#c49038] text-maindark rounded-full'>
                            <div className="p-1">
                                <FaAngleDown />
                            </div>
                            {/* <div class >
                                {unreadMessages}
                            </div> */}
                            <div className="absolute right-[18%] bg-red-500  text-black text-sm h-[20px] w-[30px] flex justify-center items-center font-semibold rounded-full">
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
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
    );
};

export default ChatRoom;
