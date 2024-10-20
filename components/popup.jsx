'use client'

import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/navigation';

const PopupGfg = ({
  title = "GeeksforGeeks",
  content = "This is a simple popup example.",
  button1Text = "Go to Page 1",
  button1Route = "/api/survey1",
  button2Text = "Go to Page 2",
  button2Route = "/api/survey2"
}) => {
  const router = useRouter();

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
              {content}
            </div>
            <div className="actions">
              
              <button 
                className="button" 
                onClick={() => handleNavigation(button1Route, close)}
              >
                {button1Text}
              </button>
              <button 
                className="button" 
                onClick={() => handleNavigation(button2Route, close)}
              >
                {button2Text}
              </button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupGfg;