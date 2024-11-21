import { Input } from "@nextui-org/input"
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../config/AuthContext.tsx';
import { FiSearch } from "react-icons/fi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaSmile, FaHeart, FaThumbsUp, FaLaugh } from "react-icons/fa";


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


  const fakeData = [
    {
      id: 1,
      date: "2 weeks",
      title: "salaries",
      message: "Hey guys, Please how much do you think the CEO gets? cos I’ve been really curious. I’m guessing the FA should know but Don’t really wanna ask in Person."
    },
    {
      id: 2,
      date: "3 days",
      title: "team outing",
      message: "Hey everyone, are we still on for the team outing this Friday? Just wondering if someone’s coordinating the rides."
    },
    {
      id: 3,
      date: "1 week",
      title: "project update",
      message: "Quick heads up, the client’s pushing for an earlier delivery on the app redesign. Can we discuss during tomorrow’s standup?"
    },
    {
      id: 4,
      date: "4 days",
      title: "lunch options",
      message: "What’s everyone feeling for lunch today? Indian, Chinese, or the food truck again? Let me know!"
    },
    {
      id: 5,
      date: "5 hours",
      title: "meeting reschedule",
      message: "Hey, can we move the 3 PM call to 4 PM instead? Some last-minute conflicts came up."
    },
    {
      id: 6,
      date: "2 months",
      title: "anniversary",
      message: "Time flies! Can’t believe it’s been two months since we launched the new website. Amazing work, team!"
    },
    {
      id: 7,
      date: "6 days",
      title: "technical issue",
      message: "Is anyone else having trouble accessing the shared drive? I’ve been locked out since yesterday afternoon."
    },
    {
      id: 8,
      date: "3 weeks",
      title: "holiday planning",
      message: "Let’s start planning for the end-of-year holiday party! Any theme suggestions or ideas for the venue?"
    },
    {
      id: 9,
      date: "1 month",
      title: "wellness check",
      message: "Friendly reminder to book your annual wellness checks if you haven’t already. Health is wealth!"
    },
    {
      id: 10,
      date: "2 hours",
      title: "urgent request",
      message: "Can someone help me out with last month’s report? Need it ASAP for a meeting!"
    },
    {
      id: 11,
      date: "1 day",
      title: "feedback",
      message: "Hey team, please drop your feedback on the new dashboard design in the shared doc. Need inputs before EOD."
    }
  ];

  const [showReactions, setShowReactions] = useState<number | null>(null);
  const [selectedReactions, setSelectedReactions] = useState<Record<number, { icon: JSX.Element; text: string }>>({});

  const reactionOptions = [
    { icon: <AiFillLike size={24} className="bg-blue-500 text-white p-2 rounded-full w-full h-full " />, text: "Like" },
    { icon: <FaHeart size={24} className="bg-red-500 text-white p-2 rounded-full w-full h-full " />, text: "Love" },
    { icon: <FaSmile size={24} className="bg-yellow-500 text-white p-2 rounded-full w-full h-full " />, text: "Smile" },
    { icon: <FaLaugh size={24} className="bg-green-500 text-white p-2 rounded-full w-full h-full " />, text: "Laugh" },
  ];

  const handleReactionClick = (itemId: number, reaction: { icon: JSX.Element; text: string }) => {
    setSelectedReactions((prev) => ({
      ...prev,
      [itemId]: reaction,
    }));
    setShowReactions(null);
  };

  return (
    <div className=" w-full h-full " >

      <div className="flex w-full py-3 gap-3 justify-center items-center " >
        <div>
          <div className="p-3 bg-white dark:bg-[#44427C] text-xl rounded-md ">
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
                " bg-white dark:bg-[#44427C]"
              ],
            }}
            onValueChange={setValue}

            className="w-full"
          />
        </div>
      </div>

      <div className="border dark:border-gray-400 bg-white dark:bg-[#44427C] rounded-md">
        {fakeData.map((item) => (
          <div key={item.id} className="py-8 border-b dark:border-gray-400 ">
            <div className="px-10"> 
              <div className="pb-3 flex justify-between items-center">
                <h1 className="font-bold capitalize text-3xl text-golden">{item.title}</h1>
                <p className="text-lg text-[#3D3B6F] dark:text-gray-200 ">{item.date}</p>
              </div>
              <div className="pt-3 pb-5">
                <p>{item.message}</p>
              </div>

              <div className="pt-1 relative">
                <button
                  className="hover:bg-golden duration-200 hover:text-white px-3 py-2 rounded-md capitalize flex items-center gap-2 "
                  onMouseEnter={() => setShowReactions(item.id)}
                  onMouseLeave={() => setShowReactions(null)}
                >
                  {selectedReactions[item.id]?.icon || <AiOutlineLike className="text-golden" size={30} />}
                  <span className="text-xl">
                    {selectedReactions[item.id]?.text || (<span className="text-golden">Like</span>)}
                  </span>
                </button>

                {showReactions === item.id && (
                  <div
                    className="absolute top-10 left-0 bg-white shadow-md rounded-md flex gap-3 p-3"
                    onMouseEnter={() => setShowReactions(item.id)}
                    onMouseLeave={() => setShowReactions(null)}
                  >
                    {reactionOptions.map((reaction, index) => (
                      <button
                        key={index}
                        className="hover:scale-125 duration-150"
                        onClick={() => handleReactionClick(item.id, reaction)}
                      >
                        {reaction.icon}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeDash
