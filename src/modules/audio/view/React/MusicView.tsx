import { AudioPresenter } from '../../presenter/AudioPresenter.ts';
import { FC } from 'react';

export type MusicViewProps = {
  audioPresenter: AudioPresenter;
};

export const MusicView: FC<MusicViewProps> = ({ audioPresenter }) => {
  const musicPlayer = audioPresenter.music;
  const atmospherePlayer = audioPresenter.atmosphere;
  const effectPlayer = audioPresenter.effects;

  return (
    <div className={'hidden'}>
      {musicPlayer.id}
      {atmospherePlayer.id}
      {effectPlayer.id}
    </div>
  );
};
