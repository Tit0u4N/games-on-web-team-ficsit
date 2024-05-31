import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";

interface IntroductionSpeechProps {
    speeches: string[];
    onComplete: () => void;
}

export const IntroductionSpeech: React.FC<IntroductionSpeechProps> = ({speeches, onComplete}) => {
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
            }, 10);

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
        <div className="bg-white rounded-lg flex-1 py-2">
            <p className={'ml-6 px-6'}>{displayedText}</p>
            {isComplete && (
                <div className={'w-full flex justify-end'}>
                    <Button className="mt-4" onClick={handleClick}>
                        {currentSpeechIndex === speeches.length - 1 ? 'Close' : 'Next'}
                    </Button>
                </div>
            )}
        </div>
    )
}