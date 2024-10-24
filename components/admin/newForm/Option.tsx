"use client"
import React,{useContext,useState}from 'react'
import AdminContext from '@/context/adminContext';


interface option{
    idx:number,
    lightmode:boolean,
    setOption:(value:string)=>void,
    disabled:boolean
}

const Option = ({idx,lightmode,setOption,disabled}:option) => {


    
    const adminContext = useContext(AdminContext);
    if (!adminContext) {throw new Error('AdminContextProvider is missing');}
    const { refresh, setRefresh } = adminContext;

  
  return (
    <div className={`w-full flex items-center gap-2 p-2 rounded-lg m-1 
    ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>
      <span>{idx}. </span>
      
        <input
          type="text"
          disabled={disabled}
          placeholder={`Enter option No. ${idx} here`}
        //   value={editedOption}
        //   onChange={(e) => setEditedOption(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none"
          onChange={(e)=>{setOption(e.target.value)}}
        />
      
    </div>
  )
}

export default Option
