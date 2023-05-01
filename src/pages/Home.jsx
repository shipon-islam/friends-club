import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TimeLine from "./sections/TimeLine";

import { db } from "../firebase";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    setLoading(true)
    const postQuery = query(
      collection(db, "posts"),
      orderBy("createAt", "desc")
    );
    const unsubscribe = onSnapshot(postQuery, (postSnapshot) => {
      const list = [];
      postSnapshot.forEach((postDoc) => {
        onSnapshot(doc(db, "users", postDoc.data().userId), (userSnapshot) => {
          list.push({
            id: postDoc.id,
            ...postDoc.data(),
            user: userSnapshot.data(),
          });
          setPosts(list);
          setLoading(false)
        });
      });
    });

    return unsubscribe;
  }, []);

  return (
    <Layout className="bg-gray-200 min-h-[80vh]">
      <div className="w-full md:w-2/3 mx-auto pt-2 md:pt-2">
        <div>
          {loading && (
            <div className="grid content-center justify-center h-[90vh]">
              <div className="w-12 h-12 rounded-full border-b-4 border-t-4 border-red-500 animate-spin mx-auto mb-3"></div>
              <p className="text-2xl">Loading...</p>
            </div>
          )}
        </div>
        {posts && <TimeLine posts={posts} />}
      </div>
    </Layout>
  );
}
