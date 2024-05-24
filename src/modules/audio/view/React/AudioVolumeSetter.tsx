import { AudioPresenter } from '../../presenter/AudioPresenter.ts';
import { FC } from 'react';
import { Slider } from '@nextui-org/react';

export type AudioVolumeSetterProps = {
  audioPresenter: AudioPresenter;
};

export const AudioVolumeSetter: FC<AudioVolumeSetterProps> = ({ audioPresenter }) => {
  return (
    <div className={'w-[100%] flex flex-col'}>
      <Slider
        label="Music Volume"
        showTooltip={true}
        hideValue={true}
        step={0.01}
        formatOptions={{ style: 'percent' }}
        maxValue={1}
        minValue={0}
        marks={[
          {
            value: 0,
            label: '0%',
          },
          {
            value: 0.5,
            label: '50%',
          },
          {
            value: 1,
            label: '100%',
          },
        ]}
        defaultValue={audioPresenter.music.volume}
        className="max-w-md"
        onChange={(value) => {
          if (Array.isArray(value)) {
            value = value[0];
          }
          audioPresenter.music.volume = value;
        }}
      />
      <Slider
        label="Atmosphere Volume"
        showTooltip={true}
        hideValue={true}
        step={0.01}
        formatOptions={{ style: 'percent' }}
        maxValue={1}
        minValue={0}
        marks={[
          {
            value: 0,
            label: '0%',
          },
          {
            value: 0.5,
            label: '50%',
          },
          {
            value: 1,
            label: '100%',
          },
        ]}
        defaultValue={audioPresenter.atmosphere.volume}
        className="max-w-md"
        onChange={(value) => {
          if (Array.isArray(value)) {
            value = value[0];
          }
          audioPresenter.atmosphere.volume = value;
        }}
      />
      <Slider
        label="Effect Volume"
        showTooltip={true}
        hideValue={true}
        step={0.01}
        formatOptions={{ style: 'percent' }}
        maxValue={1}
        minValue={0}
        marks={[
          {
            value: 0,
            label: '0%',
          },
          {
            value: 0.5,
            label: '50%',
          },
          {
            value: 1,
            label: '100%',
          },
        ]}
        defaultValue={audioPresenter.effectsVolume}
        className="max-w-md"
        onChange={(value) => {
          if (Array.isArray(value)) {
            value = value[0];
          }
          audioPresenter.effectsVolume = value;
        }}
      />
    </div>
  );
};
