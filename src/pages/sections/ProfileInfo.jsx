import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRef, useState } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { auth, db, storage } from "../../firebase";
const avatar =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

export default function ProfileInfo() {
  const fileRef = useRef(null);
  const [progress, setProgress] = useState(0)
  const { currentUser} = useAuth();

  const handlePictureUpdate = async(e) => {
    const file=e.target.files[0]
      const fileName = new Date().getTime().toString() + file.name;
      console.log(file)
      const storageRef = ref(storage, `profile/${fileName}`);
      const userDocRef = doc(db, "users", currentUser.uid);
  
      const uploadtask = uploadBytesResumable(storageRef, file);
      uploadtask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (err) => console.log(err),
        async () => {
          const url = await getDownloadURL(uploadtask.snapshot.ref);
          setProgress(0);
          //storage image already exist or not
          if (currentUser.photoURL === avatar) {
            await updateDoc(userDocRef, {
              avatar: url,
            });
            await updateProfile(auth.currentUser, {
              photoURL: url,
            });
          } else {
            const imageRef = ref(storage, currentUser.photoURL);
            await updateDoc(userDocRef, {
              avatar: url,
            });
            await updateProfile(auth.currentUser, {
              photoURL: url,
            });
            await deleteObject(imageRef);
          }
          
          toast.success("Uploaded successfuly", { autoClose: 700 });
         
        }
      );
    
    
  };
  return (
    <section className="md:sticky top-[5.5rem] left-0 md:h-screen bg-white rounded-md mt-4 md:mt-0">
     
      <div className="bg-white py-6 rounded-md">
        <div style={{backgroundImage:`url(${"http://via.placeholder.com/640x360"})`}} className="bg-cover bg-center bg-no-repeat bg-gray-500 bg-red-500 mx-5 py-4 rounded-md">
          <div className="relative  mx-auto w-fit">
            <button
              onClick={() => fileRef.current.click()}
              className="absolute -right-3 top-2 bg-gray-300 px-2 py-1 rounded-full"
            >
              <BsFillCameraFill className="text-xl text-gray-700 hover:text-darkblue" />
            </button>
            <input
              ref={fileRef}
              type="file"
              onChange={handlePictureUpdate}
              className="hidden"
            />
            <img
              className="w-24 h-24 object-cover rounded-full mx-auto border-gray-700 border-2"
              src={currentUser?.photoURL}
              alt="alt"
            />
          </div>
        </div>
        <div
          className="h-2 rounded-lg w-0 px-5 bg-red-500"
          style={{ width: progress + "%",display:progress<=0&&"none" }}
        ></div>
        <div>
          <div className="text-cente mt-6 mx-6 border p-2">
            <h3 className="text-lg capitalize text-darkblue border-b">
              <FaUserCheck className="inline-block text-2xl" />
              name
            </h3>
            <h3 className="text-lg capitalize py-1 ">
              {currentUser?.displayName}
            </h3>
          </div>
          <div className="text-cente mt-4 mx-6 border p-2">
            <h3 className="text-lg capitalize text-darkblue border-b">
              <MdMarkEmailRead className="inline-block text-2xl " />
              email
            </h3>
            <h3 className="text-lg capitalize py-1 ">{currentUser?.email}</h3>
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
