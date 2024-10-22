import { db } from '../../config/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface ChatRoomProps {
    channel: string;
}

interface Message {
    text: string;
    time: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ channel }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage = { text: input, time: new Date().toLocaleTimeString() };
            setMessages([...messages, newMessage]);

            // Save to Firestore
            try {
                await addDoc(collection(db, 'chatRooms', channel, 'messages'), {
                    text: input,
                    time: Timestamp.now(),
                });
            } catch (err) {
                console.error('Error adding message to Firestore:', err);
            }

            setInput('');
        }
    };

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
                            <div className='text-sm text-gray-400'>{msg.time}</div>
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
