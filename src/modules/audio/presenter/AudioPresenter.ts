import { Reactable } from '../../../core/Interfaces.ts';
import React from 'react';
import { MusicView, MusicViewProps } from '../view/React/MusicView.tsx';

export class AudioPresenter implements Reactable {
  private readonly _music: HTMLAudioElement;
  private readonly _atmosphere: HTMLAudioElement;
  private _effects: HTMLAudioElement[];

  constructor() {
    this._music = new Audio();
    this._music.loop = true;
    this._music.volume = 0.45;
    this._atmosphere = new Audio();
    this._atmosphere.loop = true;
    this._atmosphere.volume = 0.5;
    this._effects = [];
  }

  get music(): HTMLAudioElement {
    return this._music;
  }

  get atmosphere(): HTMLAudioElement {
    return this._atmosphere;
  }

  get effects(): HTMLAudioElement[] {
    return this._effects;
  }

  public playMusic(musicType: MusicType): void {
    this._music.src = this.getMusicPath(musicType);
    this._music.play();
  }

  public playAtmosphere(atmosphereType: AtmosphereType): void {
    this._atmosphere.src = this.getAtmospherePath(atmosphereType);
    this._atmosphere.play();
  }

  public playEffect(effectType: EffectType): void {
    const effect = new Audio();
    effect.src = this.getEffectPath(effectType);
    effect.volume = 0.5;
    this._effects.push(effect);
    //play and remove effect after it ends
    effect.play();
    effect.onended = () => {
      this._effects = this._effects.filter((e) => e !== effect);
    };
  }

  private getMusicPath(musicType: MusicType) {
    switch (musicType) {
      case MusicType.OPENING:
        this._music.volume = 0.3;
        return './sounds/musics/openingMusic.mp3';
      case MusicType.MAIN:
        this._music.volume = 0.45;
        return './sounds/musics/main1.mp3';
    }
  }

  private getAtmospherePath(atmosphereType: AtmosphereType) {
    switch (atmosphereType) {
      case AtmosphereType.MAIN:
        return './sounds/atmosphere/nature.wav'; //TODO: change to correct path
    }
  }

  private getEffectPath(effectType: EffectType) {
    switch (effectType) {
      case EffectType.CLICK:
        return './sounds/effects/defaultClick.wav';
    }
  }

  getReactView(): { type: React.ElementType; props: MusicViewProps } {
    return {
      props: {
        audioPresenter: this,
      },
      type: MusicView,
    };
  }
}

export enum MusicType {
  OPENING,
  MAIN,
}

export enum AtmosphereType {
  MAIN,
}

export enum EffectType {
  CLICK,
}
