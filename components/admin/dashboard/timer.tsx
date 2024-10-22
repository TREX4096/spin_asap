import React, { useContext } from 'react'
import AppModeContext from '@/context/appMode';

interface timerProp {
    heading:string,
    popup:boolean
    setPopup:(value: boolean) => void;
}

const TimerCard = ({heading,popup,setPopup}:timerProp) => {

    const modeContext = useContext(AppModeContext);
    if (!modeContext) { throw new Error('AppModeContextProvider is missing'); }
    const { lightmode, setLightMode } = modeContext;


    return (
        <div className={`my-4 w-full h-fit rounded-xl p-4 flex flex-col  gap-3 ${lightmode ? "text-black shadow-lg" : "text-darkText bg-darkBg  border-[1px] border-darkBorder"}`}
        >
            <h3 className='text-center'>{`Set Reset Timer for ${heading}`}</h3>
            <div className='flex flex-col md:flex-row justify-between'>
                <div className='flex flex-col b-r-[1px] '>
                    <span>Last Updated at:- 12/10/2024</span>
                    <span>Time Left:- 3 days</span>
                </div>
                <div className='flex flex-row gap-2'>

                
                <button
                    className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText hover:bg-gray-800"} text-dark rounded-lg`}
                    onClick={() => { setPopup(!popup)}}
                >Update

                </button>
                <button
                    className={`px-3 py-2  ${lightmode ? "bg-blue-400 text-white" : "bg-darkBg border-[1px] border-darkBorder text-darkText hover:bg-gray-800"} text-dark rounded-lg`}
                    onClick={() => { console.log("Hello");
                     }}
                >Reset Now

                </button>
                </div>
            </div>

        </div>

    )
}

export default TimerCard
