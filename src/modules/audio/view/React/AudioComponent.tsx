import { AudioPresenter } from '../../presenter/AudioPresenter.ts';
import { AudioVolumeSetter } from './AudioVolumeSetter.tsx';
import React from 'react';

export interface AudioComponentProps {
  audioPresenter: AudioPresenter;
}

export const AudioComponent: React.FC<AudioComponentProps> = ({ audioPresenter }) => {
  return (
    <div className={'px-3 mt-2'}>
      <AudioVolumeSetter audioPresenter={audioPresenter} />
    </div>
  );
};
