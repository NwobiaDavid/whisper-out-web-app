import AdSection from '../../components/dashboard/AdSection'
import ChannelSection from '../../components/dashboard/ChannelSection'
import Header from '../../components/dashboard/Header'


const Homepage = () => {
    return (
        <div className=' max-h-screen dark:bg-maindark h-screen  ' >
            <div className="h-[10%] ">
                <Header />
            </div>
            <div className='flex  px-20 h-[90%]   '>
                <ChannelSection />
                <div className=' ml-[20%] p-5 w-[65%] overflow-y-auto h-[200vh] ' >
                    chat screen
                </div>
                <AdSection />
            </div>
        </div>
    )
}

export default Homepage