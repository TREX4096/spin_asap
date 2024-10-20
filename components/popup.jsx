'use client'

import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from "next-auth/react";

const PopupGfg = ({
  title = "Get Bonus Spin Points",
  content = "Select a survey to complete."
}) => {
  const router = useRouter();
  const { data: session } = useSession(); // Use useSession to get the user session
  const [formRoutes, setFormRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUncompletedForms = async () => {
      if (!session) {
        setError("User session not found.");
        setLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getuncompletedForms/${session.user.id}`; // Remove colon
        const response = await axios.post(url);
        
        // Assuming the response contains an array of valid form indices
        const validFormRoutes = response.data
          .filter((index) => index > 1) // Ensure the index is a number
          .map((index) => `/api/survey${index}`); // Map to appropriate route

        setFormRoutes(validFormRoutes);
      } catch (error) {
        setError("Error fetching forms. Please try again later.");
        console.error("Error fetching uncompleted forms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUncompletedForms();
  }, [session]); // Add session as a dependency

  const handleNavigation = (route, close) => {
    close();
    router.push(route);
  };

  return (
    <div>
      <Popup 
        trigger={<button className="trigger-button">Click to open popup</button>} 
        position="right center" 
        modal 
        nested
      >
        {(close) => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header">{title}</div>
            <div className="content">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>{error}</div>
              ) : formRoutes.length > 0 ? (
                formRoutes.map((route, index) => (
                  <button 
                    key={index} 
                    className="button" 
                    onClick={() => handleNavigation(route, close)}
                  >
                    Go to {route}
                  </button>
                ))
              ) : (
                <div>No uncompleted forms available.</div>
              )}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupGfg;
