import {AudioPresenter, EffectType} from '../../presenter/AudioPresenter.ts';
import {FC, useEffect} from 'react';

export type MusicViewProps = {
    audioPresenter: AudioPresenter;
};

export const MusicView: FC<MusicViewProps> = ({audioPresenter}) => {
    const musicPlayer = audioPresenter.music;
    const atmospherePlayer = audioPresenter.atmosphere;
    const effectPlayers = audioPresenter.effects;

    // add event listeners to window
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            audioPresenter.playEffect(EffectType.CLICK);
        };

        window.addEventListener('click', handleClick);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [audioPresenter]);

    return (
        <div className={'hidden'}>
            {musicPlayer.id}
            {atmospherePlayer.id}
            {effectPlayers.map((value) => value.id)}
        </div>
    );
};
