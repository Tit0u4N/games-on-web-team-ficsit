import { DiceModel } from '../model/DiceModel.ts';
import { Dice3D } from '../view/Babylon/Dice3D.ts';
import { Scene } from '@babylonjs/core';
import { DiceComponent, DiceComponentProps } from '../view/React/DiceComponent.tsx';
import { Reactable, ViewInitable } from '../../../core/Interfaces.ts';
import React from 'react';
import { ModalManager } from '../../../core/ModalManager.ts';

export class DicePresenter implements Reactable, ViewInitable {
  private model: DiceModel;
  private viewBabylon!: Dice3D;
  private viewReact!: typeof DiceComponent;
  private _is3DMod: boolean = true;

  private _onRoll3DStart: () => void = () => {};
  private _onRoll3DEnd: () => void = () => {};

  private _rollDiceFunc2D!: (finalValue: number, nbRolls?: number) => Promise<void>;
  private _rollDiceFunc3D!: () => Promise<number>;
  private state: 'idle' | 'rolling' | 'rolled' = 'idle';

  constructor(scene: Scene) {
    this.model = new DiceModel();
    this.initView(scene);
  }

  getReactView(): { type: React.ElementType; props: DiceComponentProps } {
    this.viewReact = DiceComponent;
    return {
      type: this.viewReact,
      props: {
        dicePresenter: this,
      },
    };
  }

  toggle3DMod() {
    this._is3DMod = !this._is3DMod;
  }

  async rollDice(): Promise<number> {
    this.state = 'rolling';
    ModalManager.getInstance().lock();
    if (this._is3DMod) {
      this._onRoll3DStart();
      this.model.finalValue = await this._rollDiceFunc3D();
      this._onRoll3DEnd();
    } else {
      await this._rollDiceFunc2D(this.model.getRandDiceValue());
    }
    ModalManager.getInstance().unlock();
    this.state = 'rolled';
    console.log('Dice ' + this.state + ' with value : ' + this.model.finalValue);
    return this.model.finalValue;
  }

  initView(scene: Scene): void {
    this.viewBabylon = new Dice3D(scene, this);
  }

  unMountView(): void {
    this.viewBabylon.unMountView();
  }

  // Accessors

  set RollDiceFunc2D(func: (finalValue: number, nbRolls?: number) => Promise<void>) {
    this._rollDiceFunc2D = func;
  }

  set RollDiceFunc3D(func: () => Promise<number>) {
    this._rollDiceFunc3D = func;
  }

  set onRoll3DStart(func: () => void) {
    this._onRoll3DStart = func;
  }

  set onRoll3DEnd(func: () => void) {
    this._onRoll3DEnd = func;
  }
}
