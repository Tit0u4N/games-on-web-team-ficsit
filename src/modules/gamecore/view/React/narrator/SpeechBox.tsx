import React from 'react';

interface SpeechBoxProps {
  children: React.ReactNode;
}

const SpeechBox: React.FC<SpeechBoxProps> = ({ children }) => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start">
        <div className="w-20 h-20 bg-white rounded-full overflow-hidden mr-4 z-50 top-[-20px] left-[-20px] absolute">
          <img
            src="./images/narrator/narrator.png" // Replace with your character image URL
            alt="Character"
            className="w-full h-full object-cover"
          />
        </div>
        {React.cloneElement(children as React.ReactElement)}
      </div>
    </div>
  );
};

export default SpeechBox;
