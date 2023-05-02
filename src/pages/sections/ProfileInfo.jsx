import { updateProfile } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { auth, db, storage } from "../../firebase";
import useFileUpload from "../../hooks/useFileUpload";

export default function ProfileInfo() {
  const fileRef = useRef(null);
  const coverRef = useRef(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const { photoUpload } = useFileUpload();
  const userDocRef = doc(db, "users", currentUser.uid);

  useEffect(() => {
    onSnapshot(userDocRef, (snapshot) => {
      setUser(snapshot.data());
    });
  }, [userDocRef]);

  const handlePictureUpdate = async (e) => {
    const file = e.target.files[0];
    const profilePhotoRef = ref(storage, user.avatar);
    setLoading(true);
    const url = await photoUpload(file, "profile");
    await updateProfile(auth.currentUser, {
      photoURL: url,
    });
    if (!user.avatar) {
      await updateDoc(userDocRef, {
        avatar: url,
      });
    } else {
      await updateDoc(userDocRef, {
        avatar: url,
      });
      await deleteObject(profilePhotoRef);
    }
    setLoading(false);
    toast.success("Profile photo uploaded !", { autoClose: 700 });
  };

  //upload cover photo
  const handleCoverUpdate = async (e) => {
    const file = e.target.files[0];
    const coverPhotoRef = ref(storage, user.cover);
    setLoading(true);
    const url = await photoUpload(file, "cover");
    if (!user.cover) {
      await updateDoc(userDocRef, {
        cover: url,
      });
    } else {
      await updateDoc(userDocRef, {
        cover: url,
      });
      await deleteObject(coverPhotoRef);
    }
    toast.success("Cover photo uploaded !", { autoClose: 700 });
    setLoading(false);
  };

  return (
    <section className="md:sticky top-[5.5rem] left-0 md:h-screen bg-white rounded-md mt-4 md:mt-0">
      {loading && (
        <div className="h-2 rounded-lg border-2 border-red-500 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 300 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="bg-red-500 h-full w-16 rounded-md"
          ></motion.div>
        </div>
      )}
      <div className="bg-white py-6 rounded-md">
        <div
          style={{
            backgroundImage: `url(${
              user?.cover || "http://via.placeholder.com/640x360"
            })`,
          }}
          className="bg-cover bg-center bg-no-repeat  mx-5 py-4 rounded-md relative"
        >
          <button
            onClick={() => coverRef.current.click()}
            className="absolute right-1 top-1 bg-gray-300 px-2 py-1 rounded-full"
          >
            <BsFillCameraFill className="text-xl text-gray-700 hover:text-cyan-600" />
          </button>
          <input
            type="file"
            className="hidden"
            onChange={handleCoverUpdate}
            ref={coverRef}
          />
          <div className="relative  mx-auto w-fit">
            <button
              onClick={() => fileRef.current.click()}
              className="absolute -right-3 top-2 bg-gray-300 px-2 py-1 rounded-full"
            >
              <BsFillCameraFill className="text-xl text-gray-700 hover:text-cyan-600" />
            </button>
            <input
              ref={fileRef}
              type="file"
              onChange={handlePictureUpdate}
              className="hidden"
            />
            <img
              className="w-24 h-24 object-cover rounded-full mx-auto border-gray-700 border-2"
              src={user?.avatar}
              alt="alt"
            />
          </div>
        </div>

        <div>
          <div className="text-cente mt-6 mx-6 border p-2">
            <h3 className="text-lg capitalize text-darkblue border-b">
              <FaUserCheck className="inline-block text-2xl" />
              name
            </h3>
            <h3 className="text-lg capitalize py-1 ">{user?.username}</h3>
          </div>
          <div className="text-cente mt-4 mx-6 border p-2">
            <h3 className="text-lg capitalize text-darkblue border-b">
              <MdMarkEmailRead className="inline-block text-2xl " />
              email
            </h3>
            <h3 className="text-lg capitalize py-1 ">{user?.email}</h3>
          </div>
          <Link
            className="text-darkblue  block text-right mr-7 mt-3"
            to="/password/change"
          >
            Need password change?
          </Link>
        </div>
      </div>
    </section>
  );
}
