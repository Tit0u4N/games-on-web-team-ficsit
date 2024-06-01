import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { config } from '@core/Interfaces.ts';
import SpeechBox from "@gamecore/view/React/narrator/SpeechBox.tsx";

interface HighlightTutorialStep {
    message: string;
    targetSelector: string;
}

interface HighlightTutorialSpeechProps {
    steps: HighlightTutorialStep[];
    onComplete: () => void;
}

const HighlightTutorialSpeech: React.FC<HighlightTutorialSpeechProps> = ({ steps, onComplete }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentStepIndex < steps.length) {
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText(steps[currentStepIndex].message.substring(0, index));
                if (index >= steps[currentStepIndex].message.length) {
                    clearInterval(interval);
                    setIsComplete(true);
                } else {
                    index++;
                }
            }, config.narratorBox.speed);

            return () => clearInterval(interval);
        } else {
            onComplete();
        }
    }, [currentStepIndex, steps, onComplete]);

    const handleClick = () => {
        if (isComplete) {
            setIsComplete(false);
            setDisplayedText('');
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
        }
    };

    if (currentStepIndex >= steps.length) return null;

    const { targetSelector } = steps[currentStepIndex];
    const targetElement = document.querySelector(targetSelector);
    const targetRect = targetElement?.getBoundingClientRect();

    return (
        <div className="">
            <SpeechBox>
                <div className={"bg-white rounded-lg flex-1 py-2"}>
                    <p className={'ml-6 px-6'}>{displayedText}</p>
                    {isComplete && (
                        <div className="w-full flex justify-end">
                            <Button className="mt-4" onClick={handleClick}>
                                {currentStepIndex === steps.length - 1 ? 'Close' : 'Next'}
                            </Button>
                        </div>
                    )}
                </div>
            </SpeechBox>
            <div
                className="absolute bg-transparent rounded-lg border-5 border-red-500 z-50 animate-pulse"
                style={{
                    top: targetRect?.top,
                    left: targetRect?.left,
                    width: targetRect?.width,
                    height: targetRect?.height,
                }}
            />
        </div>
    );
};

export default HighlightTutorialSpeech;
