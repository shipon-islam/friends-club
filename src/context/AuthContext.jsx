import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";

import { Timestamp, doc, setDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = React.createContext();


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [isSignup, setIsSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  //create user function
  const createProfileUser = async (data) => {
    const { email, password, firstname, lastname } = data;
    await createUserWithEmailAndPassword(auth, email, password);
    // update profile
    await updateProfile(auth.currentUser, {
      displayName: (firstname + " " + lastname).toLowerCase(),
    });

    const user = auth.currentUser;
    setCurrentUser({
      ...user,
    });
    return user;
  };

  // signup function
  async function signup(data) {
    const { firstname, lastname, email, gender, phone, dob } = data;
    setIsSignup(true);
    try {
      const { uid, photoURL, displayName } = await createProfileUser(data);
      //create user on firestore
      await setDoc(doc(db, "users", uid), {
        uid,
        firstname,
        lastname,
        email,
        gender,
        phone,
        dob,
        username: displayName,
        avatar: photoURL,
        cover:"",
        createAt: Timestamp.now(),
      });
      await setDoc(doc(db, "userChats", uid), {});
      setIsSignup(false);
      toast.success("Register successful", { autoClose: 1000 });
      navigate("/profile");
    } catch (err) {
      setIsSignup(false);
      toast.error("User already exist", { autoClose: 1000 });
      console.log(err);
    }
  }
  //signup with google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    
    const {uid,displayName,email,photoURL} = auth.currentUser;
    await setDoc(doc(db, "users", uid), {
      uid,
      firstname:"",
      lastname:"",
      email,
      gender:"",
      phone:"",
      dob:"",
      username: displayName,
      avatar: photoURL,
      createAt: Timestamp.now(),
    });
    await setDoc(doc(db, "userChats", uid), {});
    navigate("/profile");
  };

  // login function
  async function login(data) {
    const { email, password } = data;
    setIsSignup(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsSignup(false);
      toast.success("Login successful", { autoClose: 1000 });
      navigate("/profile");
    } catch (error) {
      setIsSignup(false);
      toast.error("Invalid creadentials", { autoClose: 1000 });
    }
  }

  // logout function
  function logout() {
    signOut(auth);
    return navigate("/login");
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
    isSignup,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
