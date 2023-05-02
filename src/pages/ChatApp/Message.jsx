import moment from "moment";
import React, { useContext, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } =useAuth();
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
    <div
      ref={ref}
      className={`flex gap-x-2 w-fit my-3 px-8 ${message.senderId === currentUser.uid && "ml-auto flex-row-reverse"}`}
    >
      <div className="messageInfo">
        <img
        className="w-12 h-12 rounded-full"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        
      </div>
      <div>
      <div className="bg-cyan-700 rounded-bl-xl rounded-tr-xl  py-2 pl-4 pr-2">
        <p>{message.text}</p>
        {message.img && <img className="w-24" src={message.img} alt="" />}
        {message.video && (
              <video className="max-h-[10rem] w-full object-cover" width="400" controls>
                <source src={message.video} type="video/mp4" />
              </video>
            )}
      </div>
      <span className="text-sm block w-fit ml-auto pt-2">{moment(message?.date.toDate()).startOf("second").fromNow()}</span>
      </div>
       
    </div>
   
  </>
  );
};

export default Message;
