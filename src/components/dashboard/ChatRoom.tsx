import { db } from '../../config/firebase';
import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import CryptoJS from 'crypto-js'; 

interface ChatRoomProps {
    channel: string;
    userId: string;
}

interface Message {
    text: string;
    time: string;
    userId: string;
}

const secretKey = 'your_secret_key';

const ChatRoom: React.FC<ChatRoomProps> = ({ channel, userId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const hashUserId = (userId: string) => {
        return CryptoJS.HmacSHA256(userId, secretKey).toString();
    };

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            
            try {
                await addDoc(collection(db, 'chatRooms', channel, 'messages'), {
                    text: input,
                    time: Timestamp.now(),
                    userId: hashUserId(userId),
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


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };



    return (
        <div className='flex flex-col h-full'>
            <div className='text-xl font-bold mb-4'>{channel} Chat</div>
            <div className='flex-grow overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-800'>
                {messages.length === 0 ? (
                    <div className='text-gray-500'>No messages yet. Start the conversation!</div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className='mb-2'>
                            <div className='bg-blue-100 dark:bg-blue-700 p-3 rounded-lg max-w-xs text-left'>
                                {msg.text}
                            </div>
                            <div className='text-sm text-gray-400'>
                                {msg.time} - {msg.userId === hashUserId(userId) ? 'user name here'}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <form className='mt-4 flex' onSubmit={handleSendMessage}>
                <input
                    type='text'
                    className='flex-grow p-2 rounded-md border dark:bg-gray-700 dark:text-white'
                    placeholder='Type your message...'
                    value={input}
                    onChange={handleInputChange}
                />
                <button type='submit' className='ml-2 px-4 py-2 bg-blue-500 text-white rounded-md'>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
