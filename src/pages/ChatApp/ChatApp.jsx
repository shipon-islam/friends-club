import React from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
const ChatApp = () => {
  return (
   <div className='min-h-[80vh]'>
     <div className='bg-cyan-900 w-full md:w-3/5  mx-auto mt-5 md:mt-10 text-white rounded-lg'>
      <div className="chat-container flex flex-col md:flex-row">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
   </div>
  )
}

export default ChatApp