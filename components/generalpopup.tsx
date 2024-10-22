// components/Popup.tsx
import React from 'react';

interface PopupProps {
  onClose: () => void; // Define the type for onClose
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold">How to Play</h2>
        <p className="mt-4">
          Here you can explain how to play the game. Provide clear instructions and tips for the players.
        </p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
