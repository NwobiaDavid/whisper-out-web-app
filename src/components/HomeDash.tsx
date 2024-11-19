import { Input } from "@nextui-org/input"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../config/AuthContext.tsx';
import { FiSearch } from "react-icons/fi";



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

      <div className="flex w-full py-3 gap-3 justify-center items-center " >
        <div>
          <div className="p-3 bg-[#44427C] text-xl rounded-md ">
            <FiSearch />
          </div>
        </div>

        <div className=" w-full " >
          <Input
            size="lg"
            radius="md"
            type="text"
            variant="bordered"
            placeholder="Search for conversation"
            labelPlacement="inside"
            classNames={{
              label: "text-black/50 dark:text-white/90 text-sm lg:text-base ",
              inputWrapper: [
                "border-transparent",
                "active:border-gray-300",
                "!cursor-text",
                "bg-[#44427C]"
              ],
            }}
            onValueChange={setValue}

            className="w-full"
          />
        </div>
      </div>

      <div className=" border rounded-md p-3  " >

      home dash board
      </div>
    </div>
  )
}

export default HomeDash
