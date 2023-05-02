import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const {currentUser} = useAuth()

  return (
    <div className='flex flex-row-reverse bg-cyan-800 md:items-center justify-between px-4 gap-x-6 py-2'>
      <span className="font-bold">Chats.</span>
      <div className="flex gap-x-2 items-center">
        <img className="w-8 h-8 rounded-full border-2" src={currentUser.photoURL} alt="" />
        <span className='font-bold capitalize'>{currentUser.displayName}</span>
        
      </div>
    </div>
  )
}

export default Navbar