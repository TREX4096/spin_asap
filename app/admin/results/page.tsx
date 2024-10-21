"use client";
import React, { useEffect, useState, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { Barchart } from '@/components/admin/dashboard/barChart';
import AppModeContext from '@/context/appMode';
import AdminContext from '@/context/adminContext';
import { ClipLoader } from 'react-spinners';

interface Option {
    option: string;
    markedCount: number;
}

interface Question {
    question: string;
    options: Option[];
}

interface QuestionSet {
    questions: Question[];
}

export default function Dashboard() {
    const modeContext = useContext(AppModeContext);
    if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
    const { lightmode } = modeContext;

    const adminContext = useContext(AdminContext);
    if (!adminContext) { throw new Error('AdminContextProvider is missing'); }
    const { refresh } = adminContext;

    const [forms, setForms] = useState<QuestionSet[]>([]); // Store forms

    useEffect(() => {
        const getForms = async () => {
            try {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/getForm/${process.env.NEXT_PUBLIC_ADMIN_ID}`;
                const response = await axios.get(url);
                const data = response.data;
                setForms(data);
            } catch (error: any) {
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
        <div className={`flex flex-col gap-5 md:p-4 ${!lightmode && "bg-darkBg"}`}>
            {forms.length > 0 ? (
                forms.map((form, formIndex) => (
                    <div key={formIndex} className={`p-5 flex flex-col mb-4 ${lightmode ? "shadow-lg bg-white" : ""}`}>
                        <div className='mb-2'>
                            <h1 className={`font-bold text-2xl ${lightmode ? "text-black" : "text-darkText"}`}>Form {formIndex + 1}</h1>
                        </div>
                        <div className='flex flex-col md:flex-row w-full overflow-x-auto gap-5 scrollbar-hide'>
                            {form.questions.map((question, questionIndex) => (
                                <div key={questionIndex} className='flex flex-row'>
                                    <Barchart chartData={question} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className='w-full h-[100vh] flex flex-row justify-center items-center'>
                    <ClipLoader color="#00BFFF" loading={true} size={50} />
                </div>
            )}
        </div>
    );
}
