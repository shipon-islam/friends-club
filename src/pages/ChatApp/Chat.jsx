import React, { useContext } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import { ChatContext } from "../../context/ChatContext";
import Input from "./Input";
import Messages from "./Messages";


const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="w-full border-r-cyan-600 md:border-2 border-t">
      <div className="flex justify-between py-3 px-2">
        <span className="pl-3 capitalize">{data.user?.displayName}</span>
        <div className="flex justify-end">
          <IoMdVideocam className="text-2xl ml-3"/>
          <FaUserCheck className="text-2xl ml-3"/>
          <BsThreeDots className="text-2xl ml-3"/>
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
