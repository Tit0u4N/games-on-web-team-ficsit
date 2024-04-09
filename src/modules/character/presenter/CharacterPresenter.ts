import { CharacterFactory } from '../BuilderFactory/CharacterFactory';
import { Character } from '../model/Character';
import { CharacterView } from '../view/Babylon/CharacterView.ts';
import { Scene } from '@babylonjs/core';

export class CharacterPresenter {
  private readonly _characters: Set<Character>;
  private readonly _characterView: CharacterView;
  //private readonly gameCorePresenter: GameCorePresenter;

  constructor() {
    this._characters = CharacterPresenter.getDefaultCharacters();
    this._characterView = new CharacterView(this);
  }

  get characters(): Set<Character> {
    return this._characters;
  }

  async initView(scene: Scene): Promise<void> {
    await this._characterView.initPawns(scene);
  }

  getCharacterById(id: number): Character | undefined {
    return [...this._characters].find((character) => character.id === id);
  }

  get characterView(): CharacterView {
    return this._characterView;
  }

  static getDefaultCharacters(): Set<Character> {
    const characters = new Set<Character>();
    characters.add(CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_1.png'));
    characters.add(CharacterFactory.createDefaultCharacter(2, 'John Doe', 'US', 25, '/character_2.png'));
    characters.add(CharacterFactory.createDefaultCharacter(3, 'John Doe', 'US', 25, '/character_3.png'));
    return characters;
  }
}
