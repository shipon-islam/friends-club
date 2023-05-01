import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { motion } from "framer-motion";
import moment from "moment";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdReport } from "react-icons/md";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LikeCommentArea from "../../components/LikeCommentArea";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import {
  handleReportModal,
  handleThreeDot
} from "../../helper";

export default function TimeLine({ posts }) {
  const {currentUser}=useAuth()
  const navigate=useNavigate()
 
 //delete targeted post
 const handleDeletePost = async (postId) => {
  if(!currentUser){
    return navigate("/login")
  }
  const docRef = doc(db, "posts", postId);
  const existPost = (await getDoc(docRef)).data();
  if (existPost.userId === currentUser.uid) {
    const isAgree = window.confirm("Do you want delete status?");
    if (isAgree) {
      console.log(existPost)
      if (!existPost.image&&!existPost.video) {
        console.log("file nai")
        await deleteDoc(docRef);
        toast.success("Deleted successfuly", { autoClose: 700 });
      } else {
        console.log("file ace")
        const filePathUrl=existPost.image?existPost.image:existPost.video
        const imageRef = ref(storage, filePathUrl);
        await deleteDoc(docRef);
        await deleteObject(imageRef);
        toast.success("Deleted successfuly", { autoClose: 700 });
      }
    }
  } else {
    toast.error("You can't delete other's post", { autoClose: 700 });
  }
};

  return (
    <>
      {posts?.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.5, translateY: -50 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ duration: 0.5 }}
          className="border-2 px-4 py-2 my-3  rounded-md bg-white"
        >
          <div
            aria-level="head of status"
            className="flex justify-between items-center border-b py-2 relative"
          >
            <div className="flex items-center gap-x-2">
              <img
                className="w-[50px] h-[50px] rounded-full object-cover border-2 border-gray-400"
                src={post?.user?.avatar}
                alt="user"
              />
              <div className="">
                <h3 className="capitalize">{post?.user?.username}</h3>
                <p>
                  {moment(post?.createAt.toDate()).startOf("second").fromNow()}
                </p>
              </div>
            </div>
            <button onClick={handleThreeDot} className="block w-fit">
              <BsThreeDotsVertical />
            </button>
            <ul
              aria-label="dotbox"
              className="absolute bg-gray-300 pl-4 w-32 py-3 right-4 capitalize top-12 text-gray-700 rounded-md hidden"
            >
              <li
                onClick={() =>handleDeletePost(post.id)}
                className=" hover:text-darkblue cursor-pointer"
              >
                <RiDeleteBack2Fill className="inline-block text-xl" />
                delete
              </li>
              <li
                onClick={handleReportModal}
                className="mt-2 hover:text-darkblue cursor-pointer"
              >
                <MdReport className="inline-block text-xl" />
                report
              </li>
              <li className="relative hidden">
                <div className="absolute right-10 top-2 bg-gray-300 p-4 rounded-md z-[99]">
                  <label htmlFor="report">Report reason?</label>
                  <input
                    type="text"
                    placeholder="write report"
                    className="outline-none border-2 border-gray-600 rounded-md pl-2 py-1"
                  />
                  <button
                    onClick={(e) =>console.log("report")}
                    className="bg-red-400 px-4 py-1 rounded-md ml-auto block mt-2 hover:bg-red-300"
                  >
                    submit
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div aria-label="status picture">
            <p className="py-2">{post.status}</p>
            {post?.image && (
              <img
                className="h-[20rem] w-full object-cover"
                src={post.image}
                alt="status"
              />
            )}
            {post?.video && (
              <video
                className="max-h-[25rem] w-full object-cover"
                width="400"
                controls
              >
                <source src={post.video} type="video/mp4" />
              </video>
            )}
          </div>
          <LikeCommentArea post={post}/>
        </motion.div>
      ))}
    </>
  );
}
