"use client";
import React, { useEffect, useState,useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Form from '@/components/admin/Form';
import AppModeContext from '@/context/appMode';
import AdminContext from '@/context/adminContext';
import { ClipLoader } from 'react-spinners';


export default function Dashboard() {
  
  
  const modeContext = useContext(AppModeContext);
  if (!modeContext) {throw new Error('AppModeContextProvider is missing');}
  const { lightmode, setLightMode } = modeContext;
  
  const adminContext = useContext(AdminContext);
  if (!adminContext) {throw new Error('AdminContextProvider is missing');}
  const { refresh, setRefresh } = adminContext;


  const [forms, setForms] = useState<any[]>([]); // Store forms
 


useEffect(() => {
  const getForms = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getFormWithId/${process.env.NEXT_PUBLIC_ADMIN_ID}`;
      
      console.log(url);
      
      const response = await axios.get(url);
      const data = response.data;
      console.log(data);
       
      setForms(data);
      
    } catch (error:any) {
      // Axios error objects contain the response inside error.response
      if (error.response) {
        console.error('Error fetching forms:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching forms:', error.message);
      }
    }
  };

  getForms(); // Call the function to fetch forms

}, [refresh]);

  

  return (
    <div className={`flex flex-col gap-5 p-4 ${!lightmode && "bg-darkBg"  }`} >
      {forms.length > 0 ? (
        forms.map((form, formIndex) => (<Form  formIndex={formIndex} form={form}/>))
      ) : (
        <div
        className='w-full h-[100vh] flex flex-row justify-center items-center'
        ><ClipLoader color="#00BFFF" loading={true} size={50}  /></div>
      )}
    </div>
  );
}


