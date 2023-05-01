import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import ReplayBody from "./ReplayBody";


export default function ReplayArea({ comment }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const postRef = doc(db, "posts", comment.postId);
    const replayRef = doc(postRef, "comments", comment.id);
    const q=query(collection(replayRef, "replies"),orderBy("createAt", "desc"))

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((replayDoc) => {
        onSnapshot(
          doc(db, "users", replayDoc.data().userId),
          (userSnapshot) => {
            list.push({
              id: replayDoc.id,
              ...replayDoc.data(),
              user: userSnapshot.data(),
            });
            setReplies(list);
          }
        );
      });
    });
    return unsubscribe;
  }, [comment]);
  
  return (
    <div>     
        <ReplayBody replies={replies}/>     
    </div>
  );
}
