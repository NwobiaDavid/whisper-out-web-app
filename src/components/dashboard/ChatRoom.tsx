import { db } from '../../config/firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent, useEffect, useContext, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { AuthContext } from '../../config/AuthContext.tsx';
import { FaAngleDown } from "react-icons/fa6";
import { PiNavigationArrowBold } from "react-icons/pi";

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
    time: string;
    userId: string;
    username: string;
}

const secretKey = 'your_secret_key';

const ChatRoom: React.FC<ChatRoomProps> = ({ channel }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
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


    const generateUsername = (userId: string) => {
        return `User${hashUserId(userId).slice(-5)}`;
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

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            try {
                await addDoc(collection(db, 'chatRooms', channel, 'messages'), {
                    text: input,
                    time: Timestamp.now(),
                    userId: hashUserId(user?.uid || ""),
                    username: generateUsername(user?.uid || ""),
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
                    // Set the last seen index if it exists
                    setLastSeenIndex(userDoc.data().lastSeenIndex || 0);
                } else {
                    // Initialize lastSeenIndex to 0 if it doesn't exist
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
        fetchLastSeenIndex();

        const q = query(collection(db, 'chatRooms', channel, 'messages'), orderBy('time'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedMessages = snapshot.docs.map((doc) => ({
                text: doc.data().text,
                time: doc.data().time,
                userId: doc.data().userId,
                username: doc.data().username,
            }));
            setMessages(updatedMessages);


            const newUnreadCount = updatedMessages.length - lastSeenIndex - 1;
            setUnreadMessages(newUnreadCount > 0 ? newUnreadCount : 0);
        });

        return () => unsubscribe();
    }, [channel, lastSeenIndex]);


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

            if (isAtBottom && lastSeenIndex < messages.length - 1 ) {
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


    const hashedCurrentUserId = user?.uid ? hashUserId(user?.uid) : '';

    return (
        <div className='flex flex-col h-full'>
            <div className='text-xl font-bold mb-4 text-[#FFC157] '>{channel} Chat</div>

            <div ref={messageContainerRef} className="flex-grow relative overflow-y-auto p-4 bg-gray-50 dark:bg-[#44427C80] rounded-md">
                {messages.length === 0 ? (
                    <div className='text-gray-500'>No messages yet. Start the conversation!</div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-3 flex ${msg.userId === hashedCurrentUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col ${msg.userId === hashedCurrentUserId ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`p-2 flex-col flex rounded-lg max-w-xs text-left
                                            ${msg.userId === hashedCurrentUserId ? 'bg-green-100 dark:text-gray-800 dark:bg-[#FFC157]' : 'bg-blue-100 dark:bg-[#6967ac]'}`}>
                                        <span className='text-sm font-semibold dark:text-[#44427C80] text-gray-300'>{msg.username}</span>
                                        {msg.text}
                                    </div>
                                    <div className='text-xs text-gray-400'>
                                        {msg.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {unreadMessages > 0 && (
                <div className='relative w-full'>
                    <div className="absolute bottom-[10%] right-[5%] my-4">
                        <div onClick={scrollToBottom} className='relative z-10 cursor-pointer p-3 bg-blue-600 text-white rounded-full'>
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

            <div className='dark:bg-[#44427C80] rounded-md p-4'>
                <form
                    className='flex items-center border rounded-xl border-gray-200 z-10 dark:bg-[#33316880] overflow-hidden'
                    onSubmit={handleSendMessage}
                >
                    <textarea
                        ref={textareaRef}
                        className='flex-grow p-3 focus:outline-none dark:bg-inherit dark:text-white resize-none'
                        placeholder='Type your message...'
                        value={input}
                        onChange={handleInputChange}
                        rows={1}
                    />
                    <div className='w-[7%] flex justify-center dark:bg-[#33316880] items-center relative'>
                        <button
                            type='submit'
                            className='p-2 bg-[#FFC157] hover:bg-[#ffbe4d] duration-200 text-white rounded-full'
                        >
                            <PiNavigationArrowBold className='text-2xl rotate-[125deg]' />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
