"use client"
import React, { useState, useContext } from 'react'
import Question from './question'
import AppModeContext from '@/context/appMode';



interface FormProps {
  form: {
    questions: {
      question: string;
      options: string[];
    }[];
  };
  formIndex: number;
}

const Form: React.FC<FormProps> = ({ form, formIndex }) => {
  const [editForm, setEditForm] = useState(false);

  const modeContext = useContext(AppModeContext);
  if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
  const { lightmode } = modeContext;





  return (
    <div
      key={formIndex}
      className={`rounded-lg p-4 ${lightmode ? "border-gray-200 bg-white shadow-lg border-[1px] " : "text-darkText bg-darkBg border-[1px] border-darkBorder"}`}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-center font-bold">Form {formIndex + 1}</h1>
        <div className="flex flex-row justify-between items-center gap-3">
          <button className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText"} text-dark rounded-lg`}>
            Add Question
          </button>
          <button
            className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText"} ${editForm && "bg-red-600 text-white"} text-dark rounded-lg`}
            onClick={() => {
              setEditForm(!editForm);
            }}
          >{
              editForm ? "Cancel" : "Edit Form"
            }

          </button>
        </div>
      </div>

      {form.questions.map((question: any, questionIndex: any) => (
        <Question
          key={questionIndex}
          id={question.questionId} // Assuming question ID is based on form index
          index={questionIndex + 1}
          question={question.question}
          options={question.options}
          edit={editForm}

        />
      ))}
    </div>
  );
};

export default Form
