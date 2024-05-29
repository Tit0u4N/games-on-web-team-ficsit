import React from 'react';
import { Loader } from './loader/Loader.tsx';

type Props = {
  isLoading: boolean;
};

export const LoadingScreen: React.FC<Props> = ({ isLoading = true }) => {
  if (!isLoading) {
    return null;
  }
  return (
    <div className={'flex justify-center items-center w-full fixed size-full z-[1000000] bg-white'}>
      <Loader />
    </div>
  );
};
