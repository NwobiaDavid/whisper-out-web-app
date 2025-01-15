import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, setDoc, doc, getDoc  } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthContext } from '../config/AuthContext';
import Footer from '../components/Footer';
import Emailheader from '../components/Emailheader';
import { Spinner } from '@nextui-org/spinner';

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

const WaitingPage = () => {
  const [approvalStatus, setApprovalStatus] = useState(false);
  // const [hasCompany, setHasCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;
  const emailDomain = user?.email?.split('@')[1];



  // useEffect(() => {
  //   const checkApprovalStatus = async () => {
  //     if (!user) return;

  //     try {
  //       const companyQuery = query(collection(db, 'companies'), where('domain', '==', emailDomain));
  //       const companySnap = await getDocs(companyQuery);

  //       if (!companySnap.empty) {
  //         const { isApproved } = companySnap.docs[0].data();
  //         setApprovalStatus(isApproved);
  //       } else {
  //         console.error('No company request found.');
  //       }

  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error checking approval status:', error);
  //       setLoading(false);
  //     }
  //   };

  //   checkApprovalStatus();
  // }, [user, emailDomain]);



  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
  
    const checkApprovalStatus = async () => {
      console.log("checking stats approval---")
      if (!user || !emailDomain) return;
  
      try {
        const companyQuery = query(collection(db, 'companies'), where('domain', '==', emailDomain));
        const companySnap = await getDocs(companyQuery);
  
        if (isMounted && !companySnap.empty) {
          const { isApproved } = companySnap.docs[0].data();
          setApprovalStatus(isApproved);
        }
  
        setLoading(false);
      } catch (error) {
        if (isMounted) {
          console.error('Error checking approval status:', error);
          setLoading(false);
        }
      }
    };
  
    checkApprovalStatus();
  
    return () => {
      isMounted = false; // Cleanup function
    };
  }, [user, emailDomain]);


//   useEffect(() => {
//     if (approvalStatus) {
//       navigate('/interests'); // Proceed to the next page if approved
//     }

// useEffect(() => {
//     const createUser = async () => {
//       if (approvalStatus && user) {
//         try {

//         const companyQuery = query(collection(db, 'companies'), where('createdBy', '==', user.uid));
//         const companySnap = await getDocs(companyQuery);

//         console.log("comapy dat=>"+JSON.stringify(companySnap.docs[0]))
//           // console.log("com exis-> "+companySnap.exists())

//           // const companyName = companySnap.docs[0].data().companyName;


//           // await setDoc(doc(db, 'users', user.uid), {
//           //   uid: user.uid,
//           //   email: user.email,
//           //   company: companyName,
//           //   domain: emailDomain,
//           //   isActive: true,
//           // });

//           // navigate('/home');

//           if (!companySnap.empty) {
//             const companyName = companySnap.docs[0].data().companyName;
    
//             await setDoc(doc(db, 'users', user.uid), {
//               uid: user.uid,
//               email: user.email,
//               company: companyName,
//               domain: emailDomain,
//               isActive: true,
//             });
    
//             navigate('/home');
//           } else {
//             console.error('No company document found for the user.');
//           }
          
//         } catch (error) {
//           console.error('Error creating user after company approval:', error);
//         }
//       }else {
//         navigate('/home')
//       }
//     };

//     createUser();
//   }, [approvalStatus, navigate, user]);

useEffect(() => {
  const createUser = async () => {
    console.log("inside")
    if (!approvalStatus || !user) return;

    try {

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log('User already exists. Redirecting to home.');
          navigate('/home');
          return;
        }


      const companyQuery = query(collection(db, 'companies'), where('createdBy', '==', user.uid));
      const companySnap = await getDocs(companyQuery);
      console.log("in the user creation func")


      //check if the user field is created, if so, navigate them back to the home, if not, create the user

      if (!companySnap.empty) {
        const companyName = companySnap.docs[0].data().companyName;
        console.log("the company data "+companyName)

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          company: companyName,
          domain: emailDomain,
          isActive: true,
        });

        navigate('/home');
      } else {
        console.error('No company document found for the user.');
      }
    } catch (error) {
      console.error('Error creating user after company approval:', error);
    }
  };

  createUser();
}, [approvalStatus, user]);


  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
         <Spinner />
      </div>
    );
  }

  return (
    <div className={`w-full max-h-screen h-screen relative bg-cover bg-no-repeat bg-[url('')] lg:bg-[url('/assets/images/bg/auth.png')] dark:bg-[url('')] dark:bg-maindark `}>
      <Emailheader />

      <div className="w-full py-7 lg:py-20 h-[83%] lg:h-[75%] flex xl:py-28 items-center flex-col ">
        <p className=' font-semibold text-xl text-center ' >Your company is still currently under review.<br/>Please be patient</p>
      </div>
      <Footer />
    </div>
  );
};

export default WaitingPage;
