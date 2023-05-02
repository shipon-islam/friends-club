import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useRef, useState } from "react";
import { IoMdAttach, IoMdSend } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db, storage } from "../../firebase";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const attachRef = useRef();

  const { currentUser } = useAuth();
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    setLoading(true);
    if (img) {
      const fileName = new Date().getTime().toString() + img.name;
      const storageRef = ref(storage, `chat/${fileName}`);

      const uploadtask = uploadBytesResumable(storageRef, img);
      uploadtask.on(
        "state_changed",
        () => {},
        (err) => console.log(err),
        async () => {
          const url = await getDownloadURL(uploadtask.snapshot.ref);
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: new Date().getTime().toString(),
              text: text ? text : "",
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: img.type === "video/mp4" ? "" : url,
              video: img.type === "video/mp4" ? url : "",
            }),
          });
          setLoading(false);
          attachRef.current.value = "";
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: new Date().getTime().toString(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      setLoading(false);
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  return (
    <div className="grid grid-cols-[3fr_1fr] w-full mb-2 rounded-md">
      <input
        type="text"
     
        className="py-3 pl-5 focus:outline-none text-gray-700"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="flex">
        <button className="text-2xl px-4 bg-white text-gray-600" onClick={() => attachRef.current.click()}>
          <IoMdAttach className="hover:text-red-500"/>
        </button>
        <input
          type="file"
          ref={attachRef}
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <button className="bg-cyan-600 px-5" onClick={handleSend}>
          {loading ? (
            <div className="h-4 w-4 rounded-full border-b-2 border-r-2 border-l-2 border-white animate-spin mx-3"></div>
          ) : (
            <IoMdSend className="text-2xl"/>
          )}
        </button>
      </div>
    </div>
  );
};

export default Input;
