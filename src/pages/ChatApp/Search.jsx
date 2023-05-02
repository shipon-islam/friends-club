import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const Search = () => {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useAuth();

  const handleSearch = async (e) => {
    const username=e.target.value
    const q = query(collection(db, "users"), where("username", "==", username.toLowerCase()));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        console.log(doc.data());
      });
      
    } catch (err) {
      setErr(true);
    }
  };
  const debounce=(func)=>{
    let timer;
    return function(...args){
      const context=this;
      if(timer)clearTimeout(timer)
      timer=setTimeout(()=>{
        timer=null
        func.apply(context,args)
      },800)
    }
  }
  

  const handleSelect = async () => {
    
    //check whether the group(chats in firestore)
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    console.log(combinedId);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        console.log("first");
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        const u = await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.username,
            photoURL: user.avatar,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log(u);
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }

    setUser(null);
  };
  const optimizeVersion=useCallback(debounce(handleSearch),[])
  return (
    <div className="search">
      <div className="searchForm">
        <input
          className="focus:outline-none border-b bg-transparent py-2 pl-3"
          type="text"
          placeholder="Find a user"
          onChange={optimizeVersion}
          
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="flex items-center gap-x-2 p-2" onClick={handleSelect}>
          <img className="w-12 h-12 rounded-full" src={user.avatar} alt="" />
          <div className="text-lg font-medium">
            <span>{user.username}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
