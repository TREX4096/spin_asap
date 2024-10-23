"use client"
import React, { useContext, useEffect, useState } from 'react'
import AppModeContext from '@/context/appMode';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import LeaderBoard from '@/components/admin/dashboard/leaderBoard';
import ShortLeaderBoard from '@/components/admin/ShortleaderBoard';
import { Count } from '@/components/admin/count';
import TimerCard from '@/components/admin/dashboard/timer';
import Popup from '@/components/admin/dashboard/Timerpopup';
import { Plus } from "lucide-react"

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
  const [functionName, setFunctionName] = useState("")
  const [lastSession, setLastSession] = useState([]);
  const [session, setSession] = useState([]);
  const [mega, setMega] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);


  const modeContext = useContext(AppModeContext);
  if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
  const { lightmode, setLightMode } = modeContext;




  const getUsers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getAllusers/${process.env.NEXT_PUBLIC_ADMIN_ID}`;


      setisLoading(true);


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
    } finally {
      setisLoading(false);
    }
  };
  const getAdmin = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getAdmin/${process.env.NEXT_PUBLIC_ADMIN_ID}`;

      setisLoading(true);



      const response = await axios.get(url);

      if (response.status === 200) {
        setLastSession(response.data.lastSessionWinners)
        setSession(response.data.tasks.sessionWinner)
        setMega(response.data.tasks.setAllCareerPointsToZero)
      }
      else {
        console.log(response.data);

      }




    } catch (error: any) {
      // Axios error objects contain the response inside error.response
      if (error.response) {
        console.error('Error fetching forms:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching forms:', error.message);
      }
    } finally {
      setisLoading(false);
    }
  };
  const getSessionUsers = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getSessionusers/${process.env.NEXT_PUBLIC_ADMIN_ID}/sessionWinner`;

      setisLoading(true);

      const response = await axios.get(url);
      const data = response.data;

      setSessionUsers(data.users);


    } catch (error: any) {
      // Axios error objects contain the response inside error.response
      if (error.response) {
        console.error('Error fetching forms:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching forms:', error.message);
      }
    }
    finally {
      setisLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {

      try {
        await getUsers();          // Wait for getUsers to complete
        await getAdmin();          // Wait for getUsers to complete
        await getSessionUsers();   // Wait for getSessionUsers to complete
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      // Only set to false after both calls are done
    };

    fetchData();  // Call the async function

  }, [Popup]);




  return (

    !isLoading ?

      (<div className={`flex flex-col-reverse md items-center md:flex-row p-4 md:items-start justify-between`}>


        <LeaderBoard lightmode={lightmode} heading='MegaLeaderboard' users={users} />



        <div className={`w-full h-[90%] px-4 ${lightmode ? "text-black" : "text-darkText"} flex-col justify-between`}>
          <div className='flex flex-row gap-4'>


            {/* total user card */}
            <div
              className={`min-w-[150px] h-[180px] rounded-xl p-6 flex flex-col justify-center items-center gap-3 ${lightmode ? "text-black shadow-lg" : "text-darkText bg-darkBg  border-[1px] border-darkBorder"}`}
            >
              <h3 className='text-[19px] font-bold'>Total Users</h3>
              <span className='text-[23px] font-medium'>{
                users.length
              }</span>

            </div>
            {/* Last Session Winner */}
            <ShortLeaderBoard heading='Last Session Winners' lightmode={lightmode} users={lastSession} />



            {/* Add Form */}
            {/* <div
              className={`w-[150px] h-[150px] rounded-xl p-6 flex flex-col items-center gap-3 ${lightmode ? "text-black shadow-lg" : "text-darkText bg-darkBg  border-[1px] border-darkBorder"}`}
            >
              <h3 className='text-[19px] font-bold'>Add Form</h3>
              <span className='text-[23px] font-medium'>{
                <Plus />
              }</span>

            </div> */}

          </div>

          <div>


            <TimerCard heading='MegaLeaderBoard' popup={isPopupOpen} setPopup={setPopupOpen} resetOrNot={true} task={mega} setFunctionName={setFunctionName} />
            <TimerCard heading='Session LeaderBoard' popup={isPopupOpen} setPopup={setPopupOpen}
              resetOrNot={false} task={session} setFunctionName={setFunctionName} />

          </div>




        </div>




        {/* LeaderBoard */}
        <LeaderBoard lightmode={lightmode} heading={"LeaderBoard"} users={sessionUsers} />

        {isPopupOpen && <Popup onClose={() => { setPopupOpen(false) }}
          functionName={functionName} />}
      </div>
      ) :
      (<div className='w-full h-[100vh] flex flex-row justify-center items-center'>
        <ClipLoader color="#00BFFF" loading={true} size={50} />
      </div>)
  )
}


