import { db } from '../../config/firebase';
import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent, useEffect, useContext, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { AuthContext } from '../../config/AuthContext.tsx';
import { FaAngleDown } from "react-icons/fa6";

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
}

const secretKey = 'your_secret_key';

const ChatRoom: React.FC<ChatRoomProps> = ({ channel }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [unreadMessages, setUnreadMessages] = useState<number>(0);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const authContext = useContext(AuthContext) as AuthContextType | undefined;
    const user = authContext?.user;

    const hashUserId = (userId: string) => {
        return CryptoJS.HmacSHA256(userId, secretKey).toString();
    };

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior: 'smooth' });
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
                });
            } catch (err) {
                console.error('Error adding message to Firestore:', err);
            }

            setInput('');
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'chatRooms', channel, 'messages'), orderBy('time'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedMessages = snapshot.docs.map((doc) => ({
                text: doc.data().text,
                time: doc.data().time.toDate().toLocaleTimeString(),
                userId: doc.data().userId,
            }));
            setMessages(updatedMessages);
        });

        return () => unsubscribe();
    }, [channel]);

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
            const isAtBottom = scrollHeight - scrollTop === clientHeight;

            if (isAtBottom) {
                setUnreadMessages(0); // Reset unread count when scrolled to bottom
            } else {
                // Calculate unread messages based on viewport
                const totalMessages = messages.length;
                const visibleMessages = Math.floor(scrollTop / (scrollHeight / totalMessages));
                const unreadCount = totalMessages - visibleMessages;

                setUnreadMessages(unreadCount);
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
            <div className='text-xl font-bold mb-4'>{channel} Chat</div>

            <div ref={messageContainerRef} className="flex-grow relative overflow-y-auto p-4 bg-gray-50 dark:bg-[#44427C80] rounded-md">
                {messages.length === 0 ? (
                    <div className='text-gray-500'>No messages yet. Start the conversation!</div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${msg.userId === hashedCurrentUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col ${msg.userId === hashedCurrentUserId ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`p-3 rounded-lg max-w-xs text-left
                                            ${msg.userId === hashedCurrentUserId ? 'bg-green-100 dark:text-gray-800 dark:bg-[#FFC157]' : 'bg-blue-100 dark:bg-[#44427C]'}`}>
                                        {msg.text}
                                    </div>
                                    <div className='text-xs font-medium text-gray-400'>
                                        {msg.time}
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

            <form className='flex p-4 dark:bg-[#44427C80] relative items-center' onSubmit={handleSendMessage}>
                <textarea
                    ref={textareaRef}
                    className='flex-grow p-3 rounded-xl border focus:outline-none dark:bg-[#33316880] dark:text-white resize-none overflow-hidden'
                    placeholder='Type your message...'
                    value={input}
                    onChange={handleInputChange}
                    rows={1}
                />
                <button type='submit' className='ml-2 absolute right-[21px] px-4 py-2 bg-blue-500 hover:bg-blue-700 duration-200 text-white rounded-full'>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
