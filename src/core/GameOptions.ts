import { config } from './Interfaces.ts';

export type OptionLevel = 'low' | 'medium' | 'high' | 'ultra';

export class GameOptions {
  private _shadows: boolean = false;
  private _trees: OptionLevel = 'medium';
  private _rocks: OptionLevel = 'medium';

  private static _instance: GameOptions;

  static get instance(): GameOptions {
    if (!GameOptions._instance) {
      GameOptions._instance = new GameOptions();
    }
    return GameOptions._instance;
  }

  set(option: string, value: any) {
    switch (option) {
      case 'shadows':
        this._shadows = value;
        break;
      case 'trees':
        this._trees = value;
        break;
      case 'rocks':
        this._rocks = value;
        break;
    }
  }

  get(option: string) {
    switch (option) {
      case 'shadows':
        return this.shadows;
      case 'trees':
        return this.trees;
      case 'rocks':
        return this.rocks;
    }
  }

  get shadows(): boolean {
    return this._shadows;
  }

  get trees(): { level: OptionLevel; value: number } {
    const value = config.modifiableOptions.decorations.trees[this._trees];
    return { level: this._trees, value };
  }

  get rocks(): { level: OptionLevel; value: number } {
    const value = config.modifiableOptions.decorations.rocks[this._rocks];
    return { level: this._rocks, value };
  }
}
