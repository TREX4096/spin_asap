"use client";
import React, { useContext, useState, useEffect } from 'react';
import Option from './Option';
import { CircleX,Pencil, Save } from "lucide-react";
import AdminContext from '@/context/adminContext';

interface prop {
  index: number;
}

const Question = ({ index }: prop) => {
  const adminContext = useContext(AdminContext);
  if (!adminContext) {
    throw new Error('AdminContextProvider is missing');
  }

  const { noOfQuestion, setNoofQuestion, Form, refresh,setForm,setRefresh } = adminContext;

  // State for the question and its options
  const [multipe, setMultiple] = useState(false);
  const [question, setQuestion] = useState<string>("");
  const [option1, setOption1] = useState<string>("");
  const [option2, setOption2] = useState<string>("");
  const [option3, setOption3] = useState<string>("");
  const [option4, setOption4] = useState<string>("");

  // New state for editing mode
  const [isEditing, setIsEditing] = useState<boolean>(true);

  // Helper function to check if all fields are filled
  const areFieldsFilled = () => {
    return (
      question.trim() !== "" &&
      option1.trim() !== "" &&
      option2.trim() !== "" &&
      option3.trim() !== "" &&
      option4.trim() !== ""
    );
  };

  // Question body to be stored in FormId
  const body = {
    question: question,
    options: [option1, option2, option3, option4],
    multi: multipe,
  };

  // useEffect to sync FormId updates as the user types in the fields
  useEffect(() => {
    if (areFieldsFilled()) {
      const updatedFormId = [...Form];
      updatedFormId[index] = body; // Replace or add the question at the given index
      setRefresh(!refresh); // Trigger re-render (optional, depending on your usage)
    }
  }, [question, option1, option2, option3, option4, multipe]);

  return (
    <div className={`my-5 p-5 ${true ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}>
      <div className='mb-3 flex flex-row justify-between items-center'>
        <div className="flex flex-row items-center space-x-2">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Is this question MultiCorrect?
          </label>
          <input type="checkbox" className='cursor-pointer'
            onChange={() => { setMultiple(!multipe); }} 
            disabled={!isEditing}  // Disable checkbox in "Edit" mode
          />
        </div>
          
        <div className='flex flex-row gap-2 items-center'>
        <button
          className={`text-black`}
          onClick={() => {
            if (isEditing) {
              if (areFieldsFilled()) {
                // Add or update the question in FormId
                const updatedFormId = [...Form];
                updatedFormId[index] = body; // Replace or add the question at the given index
                
                // Update FormId in the context
                setForm(updatedFormId);
          
                console.log(Form);
                setIsEditing(false); // Switch to "Edit" mode after saving
              } else {
                alert("All fields are required");
              }
            } else {
              setIsEditing(true); // Switch back to "Save" mode to allow editing
            }
          }}
          
        >
          {isEditing ? <Save size={18}/> : <Pencil size={18}/>}
        </button>
        <CircleX
          className='hover:cursor-pointer hover:text-red-600 opacity-45 hover:opacity-100'
          size={"19px"}
          onClick={() => {
            if (noOfQuestion >= 2) {
              setNoofQuestion(noOfQuestion - 1);
            }
          }} />
      </div>
      
      </div>

      {/* Question */}
      <div>
        <input
          type="text"
          placeholder='Enter Your Question Here'
          className='w-full border border-gray-300 rounded px-2 py-1 focus:outline-none'
          onChange={(e) => { setQuestion(e.target.value); }}
          value={question}
          disabled={!isEditing} // Disable input in "Edit" mode
        />
      </div>

      {/* Options */}
      <div className='grid grid-cols-1 md:grid-cols-2 items-baseline gap-2'>
        <Option idx={1} lightmode={true} setOption={setOption1}  disabled={!isEditing} />
        <Option idx={2} lightmode={true} setOption={setOption2} disabled={!isEditing} />
        <Option idx={3} lightmode={true} setOption={setOption3} disabled={!isEditing} />
        <Option idx={4} lightmode={true} setOption={setOption4} disabled={!isEditing} />
      </div>

    
    </div>
  );
}

export default Question;
