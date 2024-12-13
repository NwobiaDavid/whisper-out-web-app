import { Input } from "@nextui-org/input"
import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { AuthContext } from '../config/AuthContext.tsx';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, query, setDoc, where } from "firebase/firestore";
import { db } from "../config/firebase.ts"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSmile, FaHeart, FaLaugh, FaSadCry } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { ImSad2 } from "react-icons/im";
import { BiSolidParty } from "react-icons/bi";

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
  creatorId: string;
}

interface Update {
  id: string;
  content: string;
  createdDate: string;
  senderId: string;
  reactions: Record<string, number>;
}

const HomeDash = () => {
  const [value, setValue] = useState("");
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedReactions, setSelectedReactions] = useState<Record<string, { icon: JSX.Element; text: string } | null>>({});

  const authContext = useContext(AuthContext) as AuthContextType | undefined;
  const user = authContext?.user;

  const reactionOptions = [
    { icon: <AiFillLike size={30} />, text: "Like" }, // 👍
    { icon: <BsFillHandThumbsDownFill size={30} />, text: "Dislike" }, // 👎
    { icon: <FaLaugh size={30} />, text: "laugh" }, // 😂
    { icon: <FaSadCry size={30} />, text: "cry" },  // 😭
    { icon: <FaHeart size={30} />, text: "love" },  // ❤️
    { icon: <BiSolidParty size={30} />, text: "party" },  // 🥳
    { icon: <ImSad2 size={30} />, text: "sad" },  // 😔
  ];

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const updatesRef = collection(db, "updates");
      const querySnapshot = await getDocs(updatesRef);

      const fetchedUpdates: Update[] = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const reactions = await fetchReactions(docSnap.id);
        fetchedUpdates.push({
          id: docSnap.id,
          content: data.content,
          createdDate: data.createdDate,
          senderId: data.senderId,
          reactions,
        });
      }

      setUpdates(fetchedUpdates);
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
      const reactionsRef = collection(db, "updates", updateId, "reactions2");
      const reactionsSnapshot = await getDocs(reactionsRef);

      const reactionCounts: Record<string, number> = {};
      reactionsSnapshot.forEach((reactionDoc) => {
        const reactionData = reactionDoc.data() as Reaction;
        if (reactionCounts[reactionData.reaction]) {
          reactionCounts[reactionData.reaction]++;
        } else {
          reactionCounts[reactionData.reaction] = 1;
        }
      });

      return reactionCounts;
    } catch (error) {
      console.error("Error fetching reactions:", error);
      return {};
    }
  };

  // const addReaction = async (updateId: string, newReactionType: string) => {
  //   if (!user) return;

  //   try {
  //     const reactionRef = collection(db, "updates", updateId, "reactions2");

  //     // Check if the user has already reacted
  //     const userReactionsQuery = query(
  //       reactionRef,
  //       where("creatorId", "==", user.uid)
  //     );
  //     const userReactionsSnapshot = await getDocs(userReactionsQuery);

  //     if (!userReactionsSnapshot.empty) {
  //       const existingReactionDoc = userReactionsSnapshot.docs[0];
  //       const existingReactionType = existingReactionDoc.data().reaction;

  //       if (existingReactionType === newReactionType) {
  //         // If the same reaction is clicked again, remove it
  //         await deleteDoc(existingReactionDoc.ref);

  //         // Update UI to decrement the count of the reaction
  //         setUpdates((prevUpdates) =>
  //           prevUpdates.map((update) =>
  //             update.id === updateId
  //               ? {
  //                   ...update,
  //                   reactions: {
  //                     ...update.reactions,
  //                     [existingReactionType]: Math.max(update.reactions[existingReactionType] - 1, 0),
  //                   },
  //                 }
  //               : update
  //           )
  //         );
  //         toast.info(`Removed ${existingReactionType}!`);
  //         return;
  //       } else {
  //         // If a different reaction is selected, remove the old reaction
  //         await deleteDoc(existingReactionDoc.ref);

  //         // Update UI to decrement the old reaction and increment the new reaction
  //         setUpdates((prevUpdates) =>
  //           prevUpdates.map((update) =>
  //             update.id === updateId
  //               ? {
  //                   ...update,
  //                   reactions: {
  //                     ...update.reactions,
  //                     [existingReactionType]: Math.max(update.reactions[existingReactionType] - 1, 0),
  //                     [newReactionType]: (update.reactions[newReactionType] || 0) + 1,
  //                   },
  //                 }
  //               : update
  //           )
  //         );
  //       }
  //     } else {
  //       // If the user hasn't reacted yet, add the new reaction
  //       setUpdates((prevUpdates) =>
  //         prevUpdates.map((update) =>
  //           update.id === updateId
  //             ? {
  //                 ...update,
  //                 reactions: {
  //                   ...update.reactions,
  //                   [newReactionType]: (update.reactions[newReactionType] || 0) + 1,
  //                 },
  //               }
  //             : update
  //         )
  //       );
  //     }

  //     // Add the new reaction
  //     await addDoc(reactionRef, {
  //       reaction: newReactionType,
  //       createdDate: new Date().toISOString(),
  //       creatorId: user.uid,
  //     });

  //     toast.success(`${newReactionType} updated!`);
  //   } catch (error) {
  //     console.error("Error updating reaction:", error);
  //     toast.error("Something went wrong!");
  //   }
  // };

  const addReaction = async (updateId: string, newReactionType: string) => {
    if (!user) return;

    try {
      const reactionRef = collection(db, "updates", updateId, "reactions2");

      // Check if the user has already reacted
      const userReactionsQuery = query(
        reactionRef,
        where("creatorId", "==", user.uid)
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
          toast.info(`Removed ${existingReactionType}!`);
        } else {
          // Switch reaction
          await deleteDoc(existingReactionDoc.ref);
          await addDoc(reactionRef, {
            reaction: newReactionType,
            createdDate: new Date().toISOString(),
            creatorId: user.uid,
          });
          toast.success(`Switched to ${newReactionType}!`);
        }
      } else {
        // Add new reaction
        await addDoc(reactionRef, {
          reaction: newReactionType,
          createdDate: new Date().toISOString(),
          creatorId: user.uid,
        });
        toast.success(`${newReactionType} added!`);
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleSearch = () => {
    console.log(value);
  };

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


  const handleMainButtonClick = (updateId: string) => {
    setSelectedReactions((prev) => {
      const currentReaction = prev[updateId];
      if (currentReaction) {
        return {
          ...prev,
          [updateId]: null,
        };
      } else {
        return {
          ...prev,
          [updateId]: { icon: <AiFillLike size={30} className="text-golden" />, text: "Like" },
        };
      }
    });
  };

  useEffect(() => {
  
    console.log("the selected reactions-> " + JSON.stringify(selectedReactions))
  }, [])


  return (
    <div className=" w-full h-full " >

      <div className="flex w-full py-3 gap-3 justify-center items-center " >
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
      </div>

      <div className="border dark:border-gray-400 bg-white dark:bg-[#44427C] rounded-md">
        {updates.map((update) => (
          <div key={update.id} className="py-4 2xl:py-8 border-b dark:border-gray-400 ">
            <div className="px-5 2xl:px-10">
              <div className="pb-3 flex justify-between items-center">
                <h1 className="font-bold capitalize text-3xl text-golden">Admin</h1>
                <p className="text-lg text-[#3D3B6F] dark:text-gray-200 ">{update.createdDate}</p>
              </div>
              <div className="pt-3 pb-5">
                <p>{update.content}</p>
              </div>

              <div className="pt-1 relative">
                <button
                  className="hover:bg-golden duration-200 hover:text-white text-golden px-3 py-2 rounded-md capitalize flex items-center gap-2"
                  onMouseEnter={() => setShowReactions(update.id)}
                  onMouseLeave={() => setShowReactions(null)}
                  onClick={() => handleReactionClick(update.id, { icon: <AiFillLike size={30} />, text: "Like" })}
                >
                  {selectedReactions[update.id]?.icon || <AiOutlineLike size={30} />}
                  

                  <span className="text-xl">
                    {selectedReactions[update.id]?.text || "Like"}
                  </span>
                </button>


                {showReactions === update.id && (
                  <div
                    className="absolute top-10 left-0 bg-gray-200 dark:bg-[#696794] shadow-md rounded-md flex gap-3 p-3"
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
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {update.reactions[reaction.text] || 0}
                        </span>

                        {hoveredReaction === reaction.text && (
                          <span className="absolute capitalize bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs p-1 rounded">
                            {reaction.text}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  )
}

export default HomeDash
