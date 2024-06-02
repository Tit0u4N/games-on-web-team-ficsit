import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import SpeechBox from "@gamecore/view/React/narrator/SpeechBox.tsx";
import {config} from "@core/Interfaces.ts";

interface HighlightTutorialStep {
    message: string;
    targetSelector: string;
}

interface HighlightTutorialSpeechProps {
    steps: HighlightTutorialStep[];
    onComplete: () => void;
    modalOffset?: { top: number; left: number }; // New prop for modal offset
}

const HighlightTutorialSpeech: React.FC<HighlightTutorialSpeechProps> = ({ steps, onComplete, modalOffset }) => {
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

    // Calculate offsets based on the presence of modalOffset prop
    const modalTopOffset = modalOffset ? modalOffset.top : 0;
    const modalLeftOffset = modalOffset ? modalOffset.left : 0;

    const targetTop = targetRect ? targetRect.top : 0;
    const targetLeft = targetRect ? targetRect.left : 0;
    const targetWidth = targetRect ? targetRect.width : 0;
    const targetHeight = targetRect ? targetRect.height : 0;

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
                className="absolute bg-transparent rounded-lg border-5 border-red-500 z-[49] animate-pulse"
                style={{
                    top: targetTop - modalTopOffset,
                    left: targetLeft - modalLeftOffset,
                    width: targetWidth,
                    height: targetHeight,
                }}
            />
        </div>
    );
};

export default HighlightTutorialSpeech;
