// import { Input } from "@nextui-org/input"
import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from '../config/AuthContext.tsx';
import { addDoc, collection, deleteDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../config/firebase.ts"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLaughBeam } from "react-icons/fa";
// import { FiSearch } from "react-icons/fi";
import { AiFillLike } from "react-icons/ai";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
// import { ImSad2 } from "react-icons/im";
// import { BiSolidParty } from "react-icons/bi";
import { Spinner } from "@nextui-org/spinner";
// import { PiBellSimpleBold } from "react-icons/pi";
import { TbBulbFilled } from "react-icons/tb";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FaRegFaceSmile } from "react-icons/fa6";


interface UserType {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: UserType | null;
}

interface Reaction {
  reaction: string;
  createdDate: string;
  userId: string;
}

interface Update {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  senderId: string;
  reactions: Record<string, number>;
}

const HomeDash = () => {
  // const [value, setValue] = useState("");
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedReactions, setSelectedReactions] = useState<Record<string, { icon: JSX.Element; text: string } | null>>({});
  const [isLoading, setIsLoading] = useState(true)

  // const[allReactions, setAllReactions] = useState<Reaction[]>([])

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  const reactionOptions = [
    { icon: <AiFillLike className=" text-[#21CB6E] bg-[#CCE9D9] p-2 rounded-full " size={40} />, text: "Like" }, // 👍
    { icon: <BsFillHandThumbsDownFill className=" text-[#FF3A2F] bg-[#E5C8C7] p-2 rounded-full " size={40} />, text: "Dislike" }, // 👎
    { icon: <FaLaughBeam className=" text-[#FFC157] bg-[#F7F3CB] p-2 rounded-full " size={40} />, text: "Laugh" }, // 😂
    { icon: <TbBulbFilled className=" text-[#44427C] bg-[#B9B8CB] p-2  rounded-full " size={40} />, text: "Inspiration" },
  ];


  const reactionOptionsSmall = [
    { icon: <AiFillLike className=" text-[#21CB6E] bg-[#CCE9D9] p-1 rounded-full " size={25} />, text: "Like" }, // 👍
    { icon: <BsFillHandThumbsDownFill className=" text-[#FF3A2F] bg-[#E5C8C7] p-1 rounded-full " size={25} />, text: "Dislike" }, // 👎
    { icon: <FaLaughBeam className=" text-[#FFC157] bg-[#F7F3CB] p-1 rounded-full " size={25} />, text: "Laugh" }, // 😂
    { icon: <TbBulbFilled className=" text-[#44427C] bg-[#B9B8CB] p-1  rounded-full " size={25} />, text: "Inspiration" },
  ];

  useEffect(() => {
    fetchUpdates();
  }, []);


  const fetchUpdates = async () => {
    try {
      const updatesRef = collection(db, "updates");
      const updatesQuery = query(updatesRef, orderBy("createdDate", "desc"));
      const querySnapshot = await getDocs(updatesQuery);

      const fetchedUpdates: Update[] = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const reactions = await fetchReactions(docSnap.id);

        fetchedUpdates.push({
          id: docSnap.id,
          title: data.title,
          content: data.content,
          createdDate: formatDistanceToNow(parseISO(data.createdDate), { addSuffix: true }),
          senderId: data.senderId,
          reactions,
        });
      }

      setUpdates(fetchedUpdates);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  // const handleMainButtonClick = (itemId: string) => {
  //   setSelectedReactions((prev) => ({
  //     ...prev,
  //     [itemId]: prev[itemId] ? null : { icon: <AiFillLike size={24} className="bg-blue-500 text-white p-2 rounded-full h-full w-full " />, text: "Like" },
  //   }));
  // };

  const fetchReactions = async (updateId: string): Promise<Record<string, number>> => {
    try {
      const reactionsRef = collection(db, "updates", updateId, "reactions");
      const reactionsSnapshot = await getDocs(reactionsRef);

      const reactionCounts: Record<string, number> = {};
      let userReaction: Reaction | null = null;
      // const fetchedReactions: Reaction[] = reactionsSnapshot.docs.map((doc) => doc.data() as Reaction);

      reactionsSnapshot.forEach((reactionDoc) => {
        const reactionData = reactionDoc.data() as Reaction;
        if (reactionCounts[reactionData.reaction]) {
          reactionCounts[reactionData.reaction]++;
        } else {
          reactionCounts[reactionData.reaction] = 1;
        }

        if (reactionData.userId === user?.uid) {
          userReaction = reactionData;
        }
      });


      if (userReaction) {
        setSelectedReactions((prev) => ({
          ...prev,
          [updateId]: reactionOptions.find((r) => r.text === userReaction?.reaction) || null,
        }));
      }
      // setAllReactions(fetchedReactions)

      console.log("all reactions " + JSON.stringify(reactionsSnapshot.docs.map((doc) => doc.data() as Reaction)))

      return reactionCounts;
    } catch (error) {
      console.error("Error fetching reactions:", error);
      return {};
    }
  };




  const addReaction = async (updateId: string, newReactionType: string) => {
    if (!user) return;

    try {
      const reactionRef = collection(db, "updates", updateId, "reactions");

      // Check if the user has already reacted
      const userReactionsQuery = query(
        reactionRef,
        where("userId", "==", user.uid)
      );
      const userReactionsSnapshot = await getDocs(userReactionsQuery);

      setUpdates((prevUpdates) =>
        prevUpdates.map((update) => {
          if (update.id !== updateId) return update;

          const updatedReactions = { ...update.reactions };

          if (!userReactionsSnapshot.empty) {
            // Handle existing reaction
            const existingReactionDoc = userReactionsSnapshot.docs[0];
            const existingReactionType = existingReactionDoc.data().reaction;

            if (existingReactionType === newReactionType) {
              // If the same reaction is clicked again, remove it
              updatedReactions[existingReactionType] = Math.max(
                updatedReactions[existingReactionType] - 1,
                0
              );
            } else {
              // If switching reactions
              updatedReactions[existingReactionType] = Math.max(
                updatedReactions[existingReactionType] - 1,
                0
              );
              updatedReactions[newReactionType] =
                (updatedReactions[newReactionType] || 0) + 1;
            }
          } else {
            // New reaction
            updatedReactions[newReactionType] =
              (updatedReactions[newReactionType] || 0) + 1;
          }

          return {
            ...update,
            reactions: updatedReactions,
          };
        })
      );

      // Update Firestore
      if (!userReactionsSnapshot.empty) {
        const existingReactionDoc = userReactionsSnapshot.docs[0];
        const existingReactionType = existingReactionDoc.data().reaction;

        if (existingReactionType === newReactionType) {
          // Remove reaction
          await deleteDoc(existingReactionDoc.ref);
          setSelectedReactions((prev) => ({ ...prev, [updateId]: null }));
          toast.info(`Removed ${existingReactionType}!`);
        } else {
          // Switch reaction
          await deleteDoc(existingReactionDoc.ref);
          await addDoc(reactionRef, {
            reaction: newReactionType,
            createdDate: new Date().toISOString(),
            userId: user.uid,
          });
          toast.success(`Switched to ${newReactionType}!`);
        }
      } else {
        // Add new reaction
        await addDoc(reactionRef, {
          reaction: newReactionType,
          createdDate: new Date().toISOString(),
          userId: user.uid,
        });
        setSelectedReactions((prev) => ({
          ...prev,
          [updateId]: reactionOptions.find((r) => r.text === newReactionType) || null,
        }));
        toast.success(`${newReactionType} added!`);
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Something went wrong!");
    }
  };

  // const handleSearch = () => {
  //   console.log(value);
  // };

  // const handleReactionClick = (updateId: string, reaction: { text: string }) => {
  //   addReaction(updateId, reaction.text);
  //   setShowReactions(null);
  // };

  const handleReactionClick = (updateId: string, reaction: { icon: JSX.Element; text: string }) => {
    setSelectedReactions((prev) => ({
      ...prev,
      [updateId]: reaction,
    }));

    addReaction(updateId, reaction.text);
    setShowReactions(null);
  };


  // const handleMainButtonClick = (updateId: string) => {
  //   setSelectedReactions((prev) => {
  //     const currentReaction = prev[updateId];
  //     if (currentReaction) {
  //       return {
  //         ...prev,
  //         [updateId]: null,
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         [updateId]: { icon: <AiFillLike size={30} className="text-golden" />, text: "Like" },
  //       };
  //     }
  //   });
  // };

  useEffect(() => {

    console.log("the selected reactions-> " + JSON.stringify(selectedReactions))
  }, [])


  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className=" w-full h-full  " >

      <div className=" w-full py-5 px-3 flex items-center " >
        {/* <PiBellSimpleBold className=" text-lg lg:text-3xl " /> */}
        <div className="ml-2 text-2xl font-semibold capitalize " >
          updates
        </div>
      </div>

      {/* <div className="flex w-full py-3 gap-3 justify-center items-center " >
        <div>
          <div onClick={handleSearch} className="p-3 bg-white dark:bg-[#44427C] text-xl rounded-md ">
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
      </div> */}

      <div className="border dark:border-gray-400 bg-white dark:bg-[#44427C] rounded-md">
        {updates.map((update) => {
          const totalReactions = Object.values(update.reactions).reduce((acc, val) => acc + val, 0);
        
          return (
          <div key={update.id} className="py-4 2xl:py-8 border-b dark:border-gray-400 ">
            <div className="px-5 2xl:px-10">
              <div className=" flex justify-between items-center">
                <h1 className="font-bold capitalize text-xl lg:text-2xl text-golden">{update.title}</h1>
                <p className="text-base lg:text-lg capitalize text-[#3D3B6F] dark:text-gray-200 ">{update.createdDate}</p>
              </div>
              <div className="pt-3 text-lg md:text-base pb-5">
                <p>{update.content}</p>
              </div>

              {/* <div>
      {totalReactions > 0 && (
        <div className="flex items-center gap-4">
          {reactionOptionsSmall.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1">
              <span className="text-sm">
            <span className="icon-wrapper" style={{ width: '30px', height: '30px', display: 'inline-block' }}>
              {React.cloneElement(icon, { size: 30 })}
            </span>
          </span>
              <span className="text-gray-500">({update.reactions[text] || 0})</span>
            </div>
          ))}
        </div>
      )}
    </div> */}

<div>
      {/* Show reactions only if there are any */}
      {totalReactions > 0 && (
        <div className="flex  p-1 w-fit rounded-full shadow-inner shadow-maindark items-center gap-2">
          {reactionOptionsSmall.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-[2px] ">
              <span className=" flex justify-center items-center " >
              {icon}
              </span>
              <span className="text-gray-500">({update.reactions[text] || 0})</span>
            </div>
          ))}
        </div>
      )}
    </div>

              <div className=" relative">
                <button
                  className=" duration-200 hover:bg-gray-200  hover:dark:bg-maindark  px-3 py-2 rounded-md capitalize flex items-center gap-2"
                  onMouseEnter={() => setShowReactions(update.id)}
                  onMouseLeave={() => setShowReactions(null)}
                  onClick={() => setShowReactions((prev) => (prev === update.id ? null : update.id))}
                // onClick={() => handleReactionClick(update.id, { icon: <AiFillLike size={30} />, text: "Like" })}
                >
                  {selectedReactions[update.id]?.icon || (<div><FaRegFaceSmile size={30} /></div>)}


                  <span className="  lg:text-xl">
                    {selectedReactions[update.id]?.text }
                  </span>
                </button>


                {showReactions === update.id && (
                  <div
                    className="absolute top-8 left-0 bg-white border dark:border-transparent dark:bg-[#696794] shadow-md rounded-full flex gap-3 p-2 "
                    onMouseEnter={() => setShowReactions(update.id)}
                    onMouseLeave={() => setShowReactions(null)}
                  >
                    {reactionOptions.map((reaction, index) => (
                      <button
                        key={index}
                        className="hover:scale-125 duration-150 relative"
                        onMouseEnter={() => setHoveredReaction(reaction.text)}
                        onMouseLeave={() => setHoveredReaction(null)}
                        onClick={() => handleReactionClick(update.id, reaction)}
                      >
                        {reaction.icon}
                        {/* <span className="text-xs text-gray-700 dark:text-gray-300">
                          {update.reactions[reaction.text] || 0}
                        </span> */}

                        {hoveredReaction === reaction.text && (
                          <span className="absolute capitalize bottom-[-30px] whitespace-nowrap left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs p-1 rounded">
                            {update.reactions[reaction.text] || 0} | {reaction.text}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  )
}

export default HomeDash
