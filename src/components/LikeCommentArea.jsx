import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { handleExpandComment, handleReplayExpand } from "../helper";
import ReplayArea from "./ReplayArea";

export default function LikeCommentArea({ post }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(collection(doc(db, "posts", post.id), "comments"),orderBy("createAt", "desc"));
    const unsubscribe = onSnapshot(q, (s) => {
      const list = [];
      s.docs.forEach((commentDoc) => {
        onSnapshot(
          doc(db, "users", commentDoc.data().userId),
          (userSnapshot) => {
            list.push({
              id: commentDoc.id,
              ...commentDoc.data(),
              user: userSnapshot.data(),
            });
            setComments(list);
          }
        );
      });
    });
    return unsubscribe;
  }, [post]);

  const handleComment = async (thisEle, postId) => {
    if(!currentUser){
      return navigate("/login")
    }
    let commentText = thisEle.previousElementSibling.value;
    const q = collection(doc(db, "posts", postId), "comments");
    await addDoc(q, {
      postId,
      userId: currentUser.uid,
      commentText,
      createAt:Timestamp.now()
    });
    thisEle.previousElementSibling.value=""
  };
  const handlelike = async (postId) => {
    if(!currentUser){
      return navigate("/login")
    }
    const id = currentUser.uid;
    const docRef = doc(db, "posts", postId);
    try {
      const docSnapshot = await getDoc(docRef);
      const isLike = docSnapshot.data().likes.includes(id);
      if (!isLike) {
        await updateDoc(docRef, {
          likes: arrayUnion(id),
        });
      } else {
        await updateDoc(docRef, {
          likes: arrayRemove(id),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleReplay=async(thisEle,postId,commentId)=>{
    if(!currentUser){
      return navigate("/login")
    }
    let replayText = thisEle.previousElementSibling.value;
   
    const postRef= doc(db, "posts", postId)
    const replayRef=doc(postRef,"comments",commentId)
    await addDoc(collection(replayRef,"replies"),{
        postId,
        commentId,
        userId:currentUser.uid,
        replayText,
        createAt:Timestamp.now()
    })
    thisEle.previousElementSibling.value=""
    thisEle.parentElement.parentElement.classList.add("hidden")
  }

  return (
    <div>
      <div
        aria-label="like functionality"
        className="flex justify-between mt-3 py-2 border-t "
      >
        <button
          onClick={() => handlelike(post.id)}
          className="flex items-center text-gray-800"
        >
          {post.likes?.includes(currentUser?.uid) ? (
            <AiFillHeart className="text-2xl text-red-500" />
          ) : (
            <AiOutlineHeart className="text-2xl" />
          )}
          <span className="text-md capitalize font-medium">
            like ({post.likes?.length})
          </span>
        </button>
        <button
          onClick={handleExpandComment}
          className="flex items-center gap-x-1"
        >
          <FaRegCommentAlt className="text-xl" />
          <span className="text-md capitalize font-medium">
            comment {comments?.length}
          </span>
        </button>
      </div>
      <div aria-label="comment-area" className="bg-gray-100 min-h-32 pb-4 hidden">
        <div aria-label="comment-send" className="h-[3rem] flex px-2 pt-2">
          <input
            type="text"
            className="focus:outline-none border-2 h-full w-full block pl-2 border-cyan-500 rounded-l-md"
            placeholder="Comment..."
          />
          <button
            onClick={(e) => handleComment(e.target, post.id)}
            className="bg-cyan-500 px-4 md:px-8 h-full block rounded-r-md"
          >
            OK
          </button>
        </div>
        <div className="max-h-[15rem] overflow-y-scroll" aria-label="comment-display">
          {comments?.map((comment) => (
            <motion.div initial={{ opacity: 0, scale: 0.5, translateY: -50 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ duration: 0.5 }} key={comment.id} className="px-4 mt-2">
              <div className="flex">
                <img
                  className="w-[30px] h-[30px] rounded-full object-cover border-2 border-gray-400"
                  src={comment?.user.avatar}
                  alt="user"
                />
                <div className="bg-gray-200 ml-2 py-2 pl-3 pr-10 rounded-md">
                  <h5 className="capitalize font-medium">
                    {comment?.user?.username}
                  </h5>
                  <p className="text-gray-600">{comment?.commentText}</p>
                </div>
              </div>
              <div>
                <button onClick={handleReplayExpand} className="block ml-36 text-gray-700 text-sm">
                  replay
                </button>
                <div className="hidden">
                <div
                  aria-label="comment-send"
                  className="h-[2.5rem] flex px-2 pt-2 w-4/5 md:w-1/2 "
                >
                  <input
                    type="text"
                    className="focus:outline-none border-2 h-full w-full block pl-2 border-cyan-500 rounded-l-md text-sm"
                    placeholder="Replay..."
                  />
                  <button
                    onClick={(e) => handleReplay(e.target,post.id,comment.id)}
                    className="bg-cyan-500 px-4 md:px-4 h-full block text-sm rounded-r-md"
                  >
                    OK
                  </button>
                </div>
                </div>
               
                  <ReplayArea comment={comment}/>
               
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
