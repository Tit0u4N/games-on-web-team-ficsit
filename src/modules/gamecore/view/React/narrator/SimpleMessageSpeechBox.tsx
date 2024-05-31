import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';

interface SimpleMessageSpeechBoxProps {
  message: string;
  onComplete: () => void;
}

const SimpleMessageSpeechBox: React.FC<SimpleMessageSpeechBoxProps> = ({ message, onComplete }) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, 2500); // Adjust the delay duration as needed

    return () => clearTimeout(delay);
  }, [onComplete]);

  const handleClick = () => {
    if (isComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-white rounded-lg flex-1 py-2">
      <p className={'ml-6 px-6'}>{message}</p>
      {isComplete && (
        <div className={'w-full flex justify-end'}>
          <Button className="mt-4" onClick={handleClick}>
            Proceed
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleMessageSpeechBox;
