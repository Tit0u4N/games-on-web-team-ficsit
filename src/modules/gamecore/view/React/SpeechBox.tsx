import React, {useState, useEffect} from 'react';
import {Button} from '@nextui-org/react';

interface SpeechBoxProps {
    speeches: string[];
    onComplete: () => void;
}

const SpeechBox: React.FC<SpeechBoxProps> = ({speeches, onComplete}) => {
    const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentSpeechIndex < speeches.length) {
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText(speeches[currentSpeechIndex].substring(0, index));
                if (index >= speeches[currentSpeechIndex].length) {
                    clearInterval(interval);
                    setIsComplete(true);
                } else {
                    index++;
                }
            }, 40);

            return () => clearInterval(interval);
        } else {
            onComplete();
        }
    }, [currentSpeechIndex, speeches, onComplete]);

    const handleClick = () => {
        if (isComplete) {
            setIsComplete(false);
            setDisplayedText('');
            setCurrentSpeechIndex((prevIndex) => prevIndex + 1);
        }
    };

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
          <div className="bg-white rounded-lg flex-1 py-2">
              <p className={'ml-6 px-6'}>{displayedText}</p>
              {isComplete && (
                  <div className={"w-full flex justify-end"}>
                      <Button className="mt-4" onClick={handleClick}>
                          {currentSpeechIndex === speeches.length - 1 ? 'Close' : 'Next'}
                      </Button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default SpeechBox;
