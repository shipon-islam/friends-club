import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { BiError } from "react-icons/bi";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import PostStatus from "./sections/PostStatus";
import ProfileInfo from "./sections/ProfileInfo";
import TimeLine from "./sections/TimeLine";
export default function Profile() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const postQuery = query(
      collection(db, "posts"),
      orderBy("createAt", "desc")
    );
    const unsubscribe = onSnapshot(postQuery, (postSnapshot) => {
      const list = [];
      postSnapshot.forEach((postDoc) => {
        onSnapshot(doc(db, "users", postDoc.data().userId), (userSnapshot) => {
          if (currentUser.uid === userSnapshot.id) {
            list.push({
              id: postDoc.id,
              ...postDoc.data(),
              user: userSnapshot.data(),
            });
            setPosts(list);
          }
        });
      });
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <Layout className="bg-gray-200">
      <div className="grid md:grid-cols-[1fr_2fr] gap-x-16">
        <ProfileInfo />
        <div>
          <PostStatus />
          <div>
            {posts.length <= 0 ? (
              <div className="grid content-center justify-center h-[40vh]">
                <BiError className="text-6xl mx-auto text-red-500 mb-4" />
                <p className="text-2xl capitalize font-medium ">
                  there is no post
                </p>
              </div>
            ) : (
              <TimeLine posts={posts} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
