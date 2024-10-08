import { useEffect, useContext } from 'react';
import { Image } from '@nextui-org/image';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@nextui-org/spinner';
import { AuthContext } from '../config/AuthContext.tsx';
import { motion } from 'framer-motion';

interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

const SplashScreen: React.FC  = () => {
  
  // const { user } = useContext(AuthContext);
  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  const navigate = useNavigate();
  // const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/home');
    } else {
      const timer = setTimeout(() => {
        navigate('/signup');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);


  return (
    <div className="max-w-screen h-screen">
      <div className="w-full h-full flex flex-col transition-all duration-200 justify-center items-center">
        <motion.div
          className="flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            className="w-[60px]"
            alt="WhisperOut logo"
            src={'/assets/logo1.png'}
          />
          <span className="text-3xl font-bold">WhisperOut</span>
        </motion.div>

        
          <motion.div
            className="mt-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 , delay: 3}}
          >
            <Spinner size="sm" />
          </motion.div>
        
      </div>
    </div>
  );
};

export default SplashScreen;
