import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { config } from '@core/Interfaces.ts';

interface SimpleMessageSpeechBoxProps {
  message: string;
  onComplete: () => void;
}

const SimpleMessageSpeechBox: React.FC<SimpleMessageSpeechBoxProps> = ({ message, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(message.substring(0, index));
      if (index >= message.length) {
        clearInterval(interval);
        setIsComplete(true);
      } else {
        index++;
      }
    }, config.narratorBox.speed); // Adjust the speed from config as needed

    return () => clearInterval(interval);
  }, [message]);

  const handleClick = () => {
    if (isComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-white rounded-lg flex-1 py-2">
      <p className={'ml-6 px-6'}>{displayedText}</p>
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
