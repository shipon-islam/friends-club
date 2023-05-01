import { Timestamp, addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRef, useState } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { RiVideoAddFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";

function PostStatus() {
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

  const handlePost = async () => {
    setLoading(true);
    const collectionRef = collection(db, "posts");
    try {
      if (file) {
        const fileName = new Date().getTime().toString() + file.name;
        const storageRef = ref(storage, `posts/${fileName}`);
        const uploadtask = uploadBytesResumable(storageRef, file);
        uploadtask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
          },
          (err) => setError(err),
          async () => {
            const url = await getDownloadURL(uploadtask.snapshot.ref);
            await addDoc(collectionRef, {
              status: status ? status : "",
              image: file.type === "video/mp4" ? "" : url,
              video: file.type === "video/mp4" ? url : "",
              likes:[],
              userId: currentUser.uid,
              createAt: Timestamp.now(),
            });
            setProgress(0);
            setLoading(false)
            toast.success("Uploaded successfuly", { autoClose: 700 });
          }
        );
      } else {
        if (status) {
          await addDoc(collectionRef, {
            status: status ? status : "",
            image: "",
            video: "",
            likes:[],
            userId: currentUser.uid,
            createAt: Timestamp.now(),
          });
          setProgress(0);
          setLoading(false)
          toast.success("Uploaded successfuly", { autoClose: 700 });
        } else {
          toast.error("Please, write status", { autoClose: 700 });
          setProgress(0);
          setLoading(false)
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
    setFile("");
    setStatus("");
    fileRef.current.value = "";
  };

  return (
    <>
      
      <div
        className="h-2 rounded-lg w-0 bg-red-500"
        style={{ width: progress + "%" }}
      ></div>
      <div className="mt-8 md:mt-3  mx-auto border-2 px-4 md:px-12 pt-10 pb-3 rounded-md bg-white">
        <input
          onChange={(e) => setStatus(e.target.value)}
          value={status}
          type="text"
          placeholder="Write anything from your mind !"
          className="border-2 h-16 py-2 px-4 focus:outline-none border-gray-600 rounded-md block w-full"
        />
        {file && <p className="pl-1">{file.name}</p>}
        <div className="flex justify-between items-center px-2 mt-2">
          <input
            ref={fileRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <button className="flex gap-x-4" onClick={() => fileRef.current.click()}>
            <BsFillCameraFill className="text-3xl text-gray-600 hover:text-cyan-500" />
            <RiVideoAddFill className="text-3xl text-gray-600 hover:text-cyan-500" />

          </button>
          <button
            onClick={handlePost}
            className="bg-cyan-600  hover:bg-cyan-500 px-6 uppercase rounded-md py-1 text-white"
          >
            {loading ? "uploading..." : "post"}
          </button>
        </div>
      </div>
    </>
  );
}

export default PostStatus;
