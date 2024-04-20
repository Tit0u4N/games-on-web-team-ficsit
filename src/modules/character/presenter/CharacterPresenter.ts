import { CharacterFactory } from '../BuilderFactory/CharacterFactory';
import { Character } from '../model/Character';
import { CharacterView } from '../view/Babylon/CharacterView.ts';
import { Scene } from '@babylonjs/core';
import { GameCorePresenter } from '../../gamecore/presenter/GameCorePresenter.ts';

export class CharacterPresenter {
  private readonly _characters: Set<Character>;
  private readonly _characterView: CharacterView;
  private readonly _gameCorePresenter: GameCorePresenter;

  constructor(gameCorePresenter: GameCorePresenter) {
    this._characters = CharacterPresenter.getDefaultCharacters();
    this._characterView = new CharacterView(this);
    this._gameCorePresenter = gameCorePresenter;
  }

  get characters(): Set<Character> {
    return this._characters;
  }

  async initView(scene: Scene): Promise<void> {
    await this._characterView.initView(scene);
  }

  getCharacterById(id: number): Character | undefined {
    return [...this._characters].find((character) => character.id === id);
  }

  get characterView(): CharacterView {
    return this._characterView;
  }

  static getDefaultCharacters(): Set<Character> {
    const characters = new Set<Character>();
    characters.add(CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, './character_1.png'));
    characters.add(CharacterFactory.createDefaultCharacter(2, 'John Doe', 'US', 25, './character_2.png'));
    characters.add(CharacterFactory.createDefaultCharacter(3, 'John Doe', 'US', 25, './character_3.png'));
    return characters;
  }

  public getSelectedCharacter(): Character | undefined {
    return this._characterView.getSelectedCharacter()?.id
      ? this.getCharacterById(this._characterView.getSelectedCharacter()!.id)
      : undefined;
  }

  updateSelectedCharacter() {
    this._gameCorePresenter.mapPresenter.updateSelectedCharacter();
  }

  unselectCharacter() {
    const selectedCharacter = this._characterView.getSelectedCharacter();
    if (selectedCharacter) selectedCharacter.isSelected = false;
    this._characterView.unscaleCharacters();
  }

  getCharacterView(id: number) {
    return this._characterView.getCharacterView(id);
  }

  resetMovements() {
    this._characters.forEach((character) => {
      character.resetMovementPoints();
    });
  }
}
