import React, {useState, useEffect} from 'react';
import {IArcRotateCameraKeyboardInputsKeysConfig} from "@core/Interfaces.ts";
import {Kbd} from "@nextui-org/react";

interface TutorialSpeechProps {
    onComplete: () => void;
    tutorialControlsSpeech: string[];
    keys: IArcRotateCameraKeyboardInputsKeysConfig;
}

const TutorialSpeech: React.FC<TutorialSpeechProps> = ({onComplete, tutorialControlsSpeech, keys}) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const getMessageWithKey = (): React.ReactNode => {
        let key: string | undefined;
        switch (currentMessageIndex) {
            case 0:
                key = keys.keysUp[0];
                break;
            case 1:
                key = keys.keysDown[0];
                break;
            case 2:
                key = keys.keysLeft[0];
                break;
            case 3:
                key = keys.keysRight[0];
                break;
            case 4:
                key = keys.keysZoomIn[0];
                break;
            case 5:
                key = keys.keysZoomOut[0];
                break;
            case 6:
                key = keys.resetPosition[0];
                break;
            default:
                break;
        }
        if (key) {
            return (
                <span className={"px-2 py-1 rounded-md bg-gray-200"}>
                    {displayedText}
                    <Kbd keys={[]}>{key.toUpperCase()}</Kbd>
                </span>
            );
        }
        return null;
    };

    useEffect(() => {
        if (currentMessageIndex < tutorialControlsSpeech.length) {
            let index = 0;
            const interval = setInterval(() => {
                setDisplayedText(tutorialControlsSpeech[currentMessageIndex].substring(0, index));
                if (index >= tutorialControlsSpeech[currentMessageIndex].length) {
                    clearInterval(interval);
                } else {
                    index++;
                }
            }, 10);

            return () => clearInterval(interval);
        }
    }, [currentMessageIndex, tutorialControlsSpeech]);

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (currentMessageIndex) {
            case 0: // Move forward
                if (event.key === keys.keysUp[0]) {
                    proceedToNextMessage();
                }
                break;
            case 1: // Move backward
                if (event.key === keys.keysDown[0]) {
                    proceedToNextMessage();
                }
                break;
            case 2: // Rotate left
                if (event.key === keys.keysLeft[0]) {
                    proceedToNextMessage();
                }
                break;
            case 3: // Rotate right
                if (event.key === keys.keysRight[0]) {
                    proceedToNextMessage();
                }
                break;
            case 4: // Zoom in
                if (event.key === keys.keysZoomIn[0]) {
                    proceedToNextMessage();
                }
                break;
            case 5: // Zoom out
                if (event.key === keys.keysZoomOut[0]) {
                    proceedToNextMessage();
                }
                break;
            case 6: // Reset position
                if (event.key === keys.resetPosition[0]) {
                    proceedToNextMessage();
                }
                break;
            default:
                break;
        }
    };

    const handleWheel = (event: WheelEvent) => {
        if (event.deltaY < 0) {
            // Wheel up
            if (currentMessageIndex === 4) {
                proceedToNextMessage();
            }
        } else {
            // Wheel down
            if (currentMessageIndex === 5) {
                proceedToNextMessage();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('wheel', handleWheel);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('wheel', handleWheel);
        };
    }, [currentMessageIndex, keys]);

    const proceedToNextMessage = () => {
        if (currentMessageIndex === tutorialControlsSpeech.length - 1) {
            setIsComplete(true);
        } else {
            setCurrentMessageIndex((prevIndex) => prevIndex + 1);
        }
    };

    useEffect(() => {
        if (isComplete) {
            onComplete();
        }
    }, [isComplete, onComplete]);

    return (
        <div className="bg-white rounded-lg flex-1 py-2">
            <p className={'ml-6 px-6'}>{getMessageWithKey()}</p>
        </div>
    );
};

export default TutorialSpeech;
