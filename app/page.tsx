"use client"
import { useState } from 'react';
import Popup from "@/components/generalpopup";
import { FaQuestionCircle } from 'react-icons/fa';

export default function Home() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Game!</h1>
      <button 
        onClick={() => alert("Game Started!")} 
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Start Game
      </button>

      <FaQuestionCircle 
        size={50} 
        className="absolute bottom-10 right-10 cursor-pointer"
        onClick={handlePopupOpen} 
      />

      {isPopupOpen && <Popup onClose={handlePopupClose} />}
    </div>
  );
}
