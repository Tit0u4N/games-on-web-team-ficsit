import { DiceModel } from '@dice/model/DiceModel.ts';
import { Dice3D } from '@dice/view/Babylon/Dice3D.ts';
import { Scene } from '@babylonjs/core';
import { DiceComponent, DiceComponentProps } from '@dice/view/React/DiceComponent.tsx';
import { Reactable, ViewInitable } from '@/core/Interfaces.ts';
import React from 'react';
import { ModalManager } from '@/core/singleton/ModalManager.ts';

export interface DiceHandler {
  handleRollDice(diceValue: number): void;
}

export class DicePresenter implements Reactable, ViewInitable {
  private model: DiceModel;
  private diceHandler: DiceHandler;
  private viewBabylon!: Dice3D;
  private viewReact!: typeof DiceComponent;
  private _is3DMod: boolean = true;
  private _on3DModChange: ((is3DMod: boolean) => void)[] = [];

  private _onRoll3DStart: () => void = () => {};
  private _onRoll3DEnd: () => void = () => {};

  private _rollDiceFunc2D!: (finalValue: number, nbRolls?: number) => Promise<void>;
  private _rollDiceFunc3D!: () => Promise<number>;

  private _handleDiceValue!: (value: number) => void;

  private state: 'idle' | 'rolling' | 'rolled' = 'idle';

  constructor(scene: Scene, diceHandler: DiceHandler) {
    this.model = new DiceModel();
    this.diceHandler = diceHandler;
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
    this._on3DModChange.forEach((func) => {
      func(this._is3DMod);
    });
  }

  async rollDice(): Promise<void> {
    this.state = 'rolling';
    ModalManager.getInstance().lock();
    if (this._is3DMod) {
      this._onRoll3DStart();
      const value = await this._rollDiceFunc3D();
      if (value === -1) {
        this.model.getRandDiceValue();
      } else {
        this.model.finalValue = value;
      }
      this._onRoll3DEnd();
    } else {
      await this._rollDiceFunc2D(this.model.getRandDiceValue());
    }
    ModalManager.getInstance().unlock();
    this.state = 'rolled';
    if (this._handleDiceValue) this._handleDiceValue(this.model.finalValue);
    this.diceHandler.handleRollDice(this.model.finalValue);
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

  get is3DMod(): boolean {
    return this._is3DMod;
  }

  get on3DModChange(): ((is3DMod: boolean) => void)[] {
    return this._on3DModChange;
  }

  set on3DModChange(func: (is3DMod: boolean) => void) {
    this._on3DModChange.push(func);
  }

  set handleDiceValue(func: (value: number) => void) {
    this._handleDiceValue = func;
  }

  resetIs3DMod() {
    this._is3DMod = true;
  }
}
