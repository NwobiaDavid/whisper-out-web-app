import ChatRoom from '../../components/dashboard/ChatRoom';
import AdSection from '../../components/dashboard/AdSection'
import ChannelSection from '../../components/dashboard/ChannelSection'
import Header from '../../components/dashboard/Header'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { AuthContext } from '../../config/AuthContext';
import { updateDoc, query, where, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import Settings from '../../components/dashboard/Settings';
import { Spinner } from '@nextui-org/spinner';
import HomeDash from '../../components/HomeDash';
import ChangePassword from '../../components/dashboard/settingsPages/ChangePassword';
// import { updateDoc, query, where } from 'firebase/firestore';


interface ChatRoomData {
  id: string;
  title: string;
}

const Homepage = () => {

  const [isVerified, setIsVerified] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  // const authContext = useContext(AuthContext);

  const [isChannelOpen, setIsChannelOpen] = useState(false);
  // const [isChannelOpen, setIsChannelOpen] = useState(window.innerWidth >= 1024);



  const user = auth.currentUser;
  const navigate = useNavigate();

  const toggleDrawer = () => setIsChannelOpen(!isChannelOpen);
  const closeDrawer = () => setIsChannelOpen(false);

  const channels = [
    { title: "welfare", img_dark: "/assets/images/icons/channels/channels_light/welfare-pension-insurance-premium_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/welfare-pension-insurance-premium_svgrepo.com.png", link: "welfare" },
    { title: "salaries", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/salary-wage_svgrepo.com.png", link: "salaries" },
    { title: "office space", img_dark: "/assets/images/icons/channels/channels_light/office-chair_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/office-chair_svgrepo.com.png", link: "office space" },
    { title: "tech jobs", img_dark: "/assets/images/icons/channels/channels_light/jobsmajor_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/jobsmajor_svgrepo.com.png", link: "tech jobs" },
    { title: "finance", img_dark: "/assets/images/icons/channels/channels_light/salary-wage_svgrepo.com (1).png", img_light: "/assets/images/icons/channels/finance_svgrepo.com.png", link: "finance" },
    { title: "internship", img_dark: "/assets/images/icons/channels/channels_light/student-duotone_svgrepo.com (2).png", img_light: "/assets/images/icons/channels/student-duotone_svgrepo.com.png", link: "internships" },
  ];

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


  useEffect(() => {

    // const fetchWithRetries = async (fetchFunc, retries = 3) => {
    //   let attempts = 0;
    //   while (attempts < retries) {
    //     try {
    //       return await fetchFunc();
    //     } catch (error) {
    //       attempts++;
    //       if (attempts >= retries) throw error;
    //       await new Promise((resolve) => setTimeout(resolve, attempts * 1000)); // Exponential backoff
    //     }
    //   }
    // };


    const fetchChatRooms = async () => {
      try {
        const chatRoomsSnapshot = await getDocs(collection(db, 'chatRoom'));
        const rooms: ChatRoomData[] = chatRoomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title.toLowerCase(),
        }));
        setChatRooms(rooms);
        console.log("everything chatroom -> " + JSON.stringify(chatRooms))
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };

    fetchChatRooms();
  }, []);

  // useEffect(() => {
  //   const updateDefaultChannels = async () => {
  //     try {
  //       const channelTitles = channels.map((channel) => channel.title); 

  //       for (const title of channelTitles) {
  //         const channelQuery = query(
  //           collection(db, 'chatRoom'), 
  //           where('title', '==', title)
  //         );

  //         const querySnapshot = await getDocs(channelQuery);

  //         querySnapshot.forEach(async (doc) => {
  //           await updateDoc(doc.ref, { isDefault: true });
  //         });
  //       }

  //       console.log('Default channels updated successfully.');
  //     } catch (error) {
  //       console.error('Error updating default channels:', error);
  //     }
  //   };

  //   updateDefaultChannels();
  // }, [channels]);


  useEffect(() => {
    const updateDefaultChannels = async () => {
      try {
        const channelTitles = channels.map((channel) => channel.title.toLowerCase()); // Normalize to lowercase

        for (const title of channelTitles) {
          const channelQuery = query(
            collection(db, 'chatRoom'), // Replace with the actual collection name
            where('title', '==', title) // Compare in lowercase
          );

          const querySnapshot = await getDocs(channelQuery);

          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { isDefault: true });
          });
        }

        console.log('Default channels updated successfully.');
      } catch (error) {
        console.error('Error updating default channels:', error);
      }
    };

    updateDefaultChannels();
  }, []);

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

        <div className="hidden lg:block lg:w-[20%]  ">
          <ChannelSection onChannelClick={closeDrawer} />
        </div>

        <div className="flex-grow p-1 lg:p-5 lg:py-0 overflow-y-auto h-full w-full lg:w-[70%] 2xl:w-[65%]">
          <Routes>
            <Route path="/" element={<HomeDash />} />
            {/* <Route path="welfare" element={<ChatRoom channel="Welfare" />} />
            <Route path="salaries" element={<ChatRoom channel="Salaries" />} />
            <Route path="office-space" element={<ChatRoom channel="Office Space" />} />
            <Route path="tech-jobs" element={<ChatRoom channel="Tech Jobs" />} />
            <Route path="finance" element={<ChatRoom channel="Finance" />} />
            <Route path="internship" element={<ChatRoom channel="Internship" />} /> */}

            {chatRooms.map((room) => (
              <Route
                key={room.id}
                path={`${room.title}`}
                element={<ChatRoom channel={room.id} channelTitle={room.title} />}
              />
            ))}
            <Route path="settings" element={<Settings />} />

            {/* <Route path="settings" element={<Settings />}>
              <Route path="*" element={<div>Settings page not found</div>} />
            </Route> */}
              <Route path="settings/change-password" element={<ChangePassword />} />

            {/* <Route path="settings/notifications" element={<Settings />} />
            <Route path="settings/change-password" element={<ChangePassword />} /> */}
          </Routes>
        </div>

        <AdSection />
      </div>
    </div>
  )
}

export default Homepage