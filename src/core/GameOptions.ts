import { config } from './Interfaces.ts';

export type OptionLevel = 'low' | 'medium' | 'high' | 'ultra';

export class GameOptions {
  private _shadow: boolean = true;
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
      case 'shadow':
        this._shadow = value;
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
    console.log(option);
    switch (option) {
      case 'shadow':
        return this.shadow;
      case 'trees':
        return this.trees;
      case 'rocks':
        return this.rocks;
    }
  }

  get shadow(): boolean {
    return this._shadow;
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
