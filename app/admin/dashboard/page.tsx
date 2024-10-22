"use client"
import React, { useContext, useEffect, useState } from 'react'
import AppModeContext from '@/context/appMode';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import LeaderBoard from '@/components/admin/dashboard/leaderBoard';
import { Count } from '@/components/admin/count';
import TimerCard from '@/components/admin/dashboard/timer';
import Popup from '@/components/admin/dashboard/Timerpopup';
import {Plus} from "lucide-react"

interface user {
  name: string;
  gender: string;
  age: string;
  points: number
}


export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [sessionUsers, setSessionUsers] = useState([])
  const [form, setForms] = useState([])
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);


  const modeContext = useContext(AppModeContext);
  if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
  const { lightmode, setLightMode } = modeContext;


  

  const getUsers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getAllusers/${process.env.NEXT_PUBLIC_ADMIN_ID}`;



      const response = await axios.get(url);
      const data = response.data;

      setUsers(data);


    } catch (error: any) {
      // Axios error objects contain the response inside error.response
      if (error.response) {
        console.error('Error fetching forms:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching forms:', error.message);
      }
    }
  };



  useEffect(() => {
    getUsers();


  }, [])
  
  const handleMegaLeaderBoardRestart = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/resetLeaderBoard`


      const response = await axios.post(url);
      setisLoading(true)
      if(response.status===200){
        getUsers()
      }

     


    } catch (error: any) {
      // Axios error objects contain the response inside error.response
      if (error.response) {
        console.error('Error fetching forms:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching forms:', error.message);
      }
    }
  };





  return (

    users.length > 0 ?

      (<div className={`flex flex-col-reverse md items-center md:flex-row p-4 md:items-start justify-between`}>


        <LeaderBoard lightmode={lightmode} heading='MegaLeaderboard' users={users} />



        <div className={`w-full h-[90%] px-5 ${lightmode ? "text-black" : "text-darkText"} flex-col justify-between`}>
          <div className='flex flex-row justify-between'>

          
          {/* total user card */}
          <div
            className={`w-[150px] h-[125px] rounded-xl p-6 flex flex-col items-center gap-3 ${lightmode ? "text-black shadow-lg" : "text-darkText bg-darkBg  border-[1px] border-darkBorder"}`}
          >
            <h3 className='text-[19px] font-bold'>Total Users</h3>
            <span className='text-[23px] font-medium'>{
           users.length
            }</span>

          </div>
          {/* Add Form */}
          <div
            className={`w-[150px] h-[125px] rounded-xl p-6 flex flex-col items-center gap-3 ${lightmode ? "text-black shadow-lg" : "text-darkText bg-darkBg  border-[1px] border-darkBorder"}`}
          >
            <h3 className='text-[19px] font-bold'>Add Form</h3>
            <span className='text-[23px] font-medium'>{
           <Plus/>
            }</span>

          </div>

          </div>

          <div>


          <TimerCard heading='MegaLeaderBoard' popup={isPopupOpen} setPopup={setPopupOpen} />
          <TimerCard heading='Session LeaderBoard' popup={isPopupOpen} setPopup={setPopupOpen}/>

          </div>




        </div>




        {/* LeaderBoard */}
        <LeaderBoard lightmode={lightmode} heading={"LeaderBoard"} users={sessionUsers} />

      {isPopupOpen &&  <Popup onClose={()=>{setPopupOpen(false)}}/> }
      </div>
      ) :
      (<div className='w-full h-[100vh] flex flex-row justify-center items-center'>
        <ClipLoader color="#00BFFF" loading={true} size={50} />
      </div>)
  )
}


