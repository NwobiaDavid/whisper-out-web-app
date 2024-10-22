import ChatRoom from '../../components/dashboard/ChatRoom';
import AdSection from '../../components/dashboard/AdSection'
import ChannelSection from '../../components/dashboard/ChannelSection'
import Header from '../../components/dashboard/Header'
import { Route, Routes } from 'react-router-dom';

const Homepage = () => {
    return (
        <div className=' max-h-screen dark:bg-maindark h-screen  ' >
            <div className="h-[10%] ">
                <Header />
            </div>
            <div className='flex  px-20 h-[90%]   '>
                <ChannelSection />
                <div className=' ml-[20%] p-5 w-[65%] overflow-y-auto h-[80vh] ' >
                <Routes>
                        <Route path="welfare" element={<ChatRoom channel="Welfare" />} />
                        <Route path="salaries" element={<ChatRoom channel="Salaries" />} />
                        <Route path="office-space" element={<ChatRoom channel="Office Space" />} />
                        <Route path="tech-jobs" element={<ChatRoom channel="Tech Jobs" />} />
                        <Route path="finance" element={<ChatRoom channel="Finance" />} />
                        <Route path="internship" element={<ChatRoom channel="Internship" />} />
                    </Routes>
                </div>
                <AdSection />
            </div>
        </div>
    )
}

export default Homepage