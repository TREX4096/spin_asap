"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useContext } from 'react';
import AppModeContext from '../../context/appMode';
import {MoonStar,Sun} from 'lucide-react'


export default function Layout({ children }: { children: React.ReactNode }) {


  const context = useContext(AppModeContext);

  

  if (!context) {
    throw new Error('AppModeContextProvider is missing');
  }

  const { lightmode, setLightMode } = context;

  return (
    <div className={`${lightmode ? "bg-lightBg" : "bg-darkBg"} z-[10000]`}>

      <div className={`px-3 h-[55px] flex flex-row justify-between items-center sticky top-0
         ${lightmode ?  'text-gray-500' : ' text-darkText border-b-[1px] border-darkBorder'} backdrop-blur-md`}
>


        <div className='flex flex-row gap-5'>

          <Link href={"dashboard"}>Dashboard</Link>
          <Link href={"form"}>Form</Link>
          <Link href={"results"}>Result</Link>
          <Link href={"createform"}>Add</Link>
        </div>
          
          <div className= 'flex flex-row items-center gap-2 cursor-pointer' onClick={() => setLightMode(!lightmode)}>
        
        {
          lightmode ? <Sun/> :  <MoonStar/>
        }
      

          </div>

      </div>

      {children}
    </div>
  );
}
