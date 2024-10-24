"use client"
import React, { useContext, useState } from 'react'
import AppModeContext from '@/context/appMode';
import Question from './Question';
import AdminContext from '@/context/adminContext';
import axios from 'axios';

const Newform = () => {

    const modeContext = useContext(AppModeContext);
    if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
    const { lightmode } = modeContext;

    const adminContext = useContext(AdminContext);
    if (!adminContext) { throw new Error('AdminContextProvider is missing'); }

    const [formName,setFormName]=useState<string>("")
    const { noOfQuestion, setNoofQuestion, Form } = adminContext;

    const handleSubmit = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/addForm/${process.env.NEXT_PUBLIC_ADMIN_ID}`;
      
        // Validate the Form object if necessary
        if (!Form || Object.keys(Form).length === 0) {
          alert("Please fill out the form completely");
          return;
        }
      
        try {
      
          
          // Add a loading state here if necessary
          const response = await axios.post(url, {
            formName,
            formData:Form
          });
      
          if (response.status === 201) {
            alert("Form added successfully");
            // Optionally reset the form fields
            // setForm({});
          } else {
            alert("Form not added, please try again");
          }
        } catch (error) {
          // Extract error details for better debugging
          const errorMessage = error?.response?.data?.message || "Error while adding form";
          alert(errorMessage);
        }
      };
      





    return (
        <div className={`gap-5 p-4 ${!lightmode && "bg-darkBg"}`}>

             <div className='flex flex-row justify-center my-3'>

            <button
                className={`w-[100px] border-[1px] text-center px-3 py-2 bg-[#0077ED] text-white rounded-md`}
                onClick={handleSubmit}
                >
                Submit
            </button>
                </div>


            <div className={`rounded-lg p-4 ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>

                <div className='my-2'>
                    <input type="text"
                        placeholder='Enter Form Name Here'
                        className='w-full  border border-gray-300 rounded px-2 py-1 focus:outline-none' 
                        onChange={(e)=>{setFormName(e.target.value)}}
                        />
                </div>

                <div>
                    {Array.from({ length: noOfQuestion }, (_, index) => (
                        <Question index={index} />
                    ))}

                </div>


                <div className='my-4 flex flex-row w-full justify-center items-center'>
                    <button
                        className={`w-[130px] border-[1px] text-center px-3 py-2 bg-[#0077ED] text-white rounded-md`}
                        onClick={() => {
                            setNoofQuestion(noOfQuestion + 1)
                        }}
                    >
                        Add Question
                    </button>
                </div>









            </div>



        </div>
    )
}

export default Newform
