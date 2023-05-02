import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import ChangePassword from "./pages/ChangePassword";
import ChatApp from "./pages/ChatApp/ChatApp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Videos from "./pages/Videos";
import Footer from "./pages/sections/Footer";

export default function App() {
  return (
    <>
      <ToastContainer limit={1} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/chat" element={<ChatApp />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="password/change" element={<ChangePassword />} />
      </Routes>
      <Footer />
    </>
  );
}
