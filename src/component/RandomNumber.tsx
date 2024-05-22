import './RandomNumber.scss';
import React from 'react';

type RandomNumberProps = {
  finalValue: number;
};

export const RandomNumber: React.FC<RandomNumberProps> = ({ finalValue }) => {
  const [rolling, setRolling] = React.useState(true);
  setTimeout(() => {
    setRolling(false);
  }, 4000);
  let randomNumbers: string = '';
  for (let i = 0; i < 300; i++) {
    randomNumbers += Math.floor(Math.random() * 10);
  }
  return (
    <>
      <div className="rollContainer">
        {rolling ? <div className="rolling">{randomNumbers}</div> : <div className="finalValue">{finalValue}</div>}
      </div>
    </>
  );
};
