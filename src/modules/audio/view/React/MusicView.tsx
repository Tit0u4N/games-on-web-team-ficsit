import {AudioPresenter, EffectType} from '../../presenter/AudioPresenter.ts';
import {FC} from 'react';

export type MusicViewProps = {
    audioPresenter: AudioPresenter;
};

export const MusicView: FC<MusicViewProps> = ({audioPresenter}) => {
    const musicPlayer = audioPresenter.music;
    const atmospherePlayer = audioPresenter.atmosphere;
    const effectPlayers = audioPresenter.effects;

    // add event listeners to window
    window.addEventListener('click', (e) => {
        audioPresenter.playEffect(EffectType.CLICK);
    });

    return (
        <div className={'hidden'}>
            {musicPlayer.id}
            {atmospherePlayer.id}
            {effectPlayers.map((value) => value.id)}
        </div>
    );
};
