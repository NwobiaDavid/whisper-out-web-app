import { Input } from "@nextui-org/input"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../config/AuthContext.tsx'; 



interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}


const HomeDash = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);


  return (
    <div className=" w-full h-full " >

      <div>
        <div>
          icon
        </div>

        <div>
        <Input
            size="lg"
            radius="md"
            type="text"
            variant="bordered"
            placeholder="Enter your company name"
            labelPlacement="inside"
            classNames={{
              label: "text-black/50 dark:text-white/90 text-sm lg:text-base ",
              inputWrapper: [
                "dark:border-gray-500",
                "dark:hover:border-gray-300",
                "!cursor-text",
              ],
            }}
            onValueChange={setValue}
           
            className="w-full"
          />
        </div>
      </div>
      home dash board
    </div>
  )
}

export default HomeDash
