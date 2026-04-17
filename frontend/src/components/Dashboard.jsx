import React from 'react'
import ChatWindow from './ChatWindow'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
  const userID = localStorage.getItem("trtc_userID");
  if(!userID){
    navigate('/login')
    return;
  }
  return (
    <div className='h-screen w-full overflow-hidden bg-white'>
      <main className='h-full w-full'>
        <ChatWindow />
      </main>
    </div>
  )
}

export default Dashboard