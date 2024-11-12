import ChatRoom from '../../components/dashboard/ChatRoom';
import AdSection from '../../components/dashboard/AdSection'
import ChannelSection from '../../components/dashboard/ChannelSection'
import Header from '../../components/dashboard/Header'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { AuthContext } from '../../config/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import Settings from '../../components/dashboard/Settings';
import { Spinner } from '@nextui-org/spinner';

const Homepage = () => {

  const [isVerified, setIsVerified] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  // const authContext = useContext(AuthContext);

  const [isChannelOpen, setIsChannelOpen] = useState(false);
  // const [isChannelOpen, setIsChannelOpen] = useState(window.innerWidth >= 1024);



  const user = auth.currentUser;
  const navigate = useNavigate();

  const toggleDrawer = () => setIsChannelOpen(!isChannelOpen);
  const closeDrawer = () => setIsChannelOpen(false);


  useEffect(() => {
    const checkAccessPermissions = async () => {
      if (!user) {
        navigate('/signup');
        return;
      }

      try {
        if (user.emailVerified) {
          setIsVerified(true);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().company) {
            setHasCompany(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccessPermissions();
  }, [user, navigate]);


  //   useEffect(() => {
  //   const handleResize = () => {
  //     setIsChannelOpen(window.innerWidth >= 1024);
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);


  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" />;
  } else if (!hasCompany) {
    return <Navigate to="/waiting-page" />
  }

  return (
    <div className=' max-h-screen bg-[#F2F2F2] dark:bg-maindark h-screen  ' >
      <div className="h-[8%]  ">
        <Header toggleDrawer={toggleDrawer} closeDrawer={closeDrawer} />
      </div>

      {isChannelOpen && (
        <div className="fixed lg:hidden  inset-0 top-[8%] bg-gray-800 bg-opacity-75 z-50">
          <ChannelSection onChannelClick={closeDrawer} />
        </div>
      )}

      <div className='flex-grow flex px-2 md:px-5 2xl:px-20 py-0 h-[90%]'>
        {/* {isChannelOpen && (
          <ChannelSection />
        )} */}

        <div className="hidden lg:block lg:w-[20%]  ">
          <ChannelSection onChannelClick={closeDrawer} />
        </div>

        <div className="flex-grow p-1 lg:p-5 lg:py-0 overflow-y-auto h-full w-full lg:w-[70%] 2xl:w-[65%]">
          <Routes>
            <Route path="/" element={<Navigate to="welfare" />} />
            <Route path="welfare" element={<ChatRoom channel="Welfare" />} />
            <Route path="salaries" element={<ChatRoom channel="Salaries" />} />
            <Route path="office-space" element={<ChatRoom channel="Office Space" />} />
            <Route path="tech-jobs" element={<ChatRoom channel="Tech Jobs" />} />
            <Route path="finance" element={<ChatRoom channel="Finance" />} />
            <Route path="internship" element={<ChatRoom channel="Internship" />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
        
        <AdSection />
      </div>
    </div>
  )
}

export default Homepage