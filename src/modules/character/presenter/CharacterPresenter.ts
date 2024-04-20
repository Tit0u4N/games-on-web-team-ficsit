import { CharacterFactory } from '../BuilderFactory/CharacterFactory';
import { Character } from '../model/Character';

export class CharacterPresenter {
  getDefaultCharacters(): Character[] {
    const defaultCharacter1 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_1.png');
    const defaultCharacter2 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_2.png');
    const defaultCharacter3 = CharacterFactory.createDefaultCharacter(1, 'John Doe', 'US', 25, '/character_3.png');
    return [defaultCharacter1, defaultCharacter2, defaultCharacter3];
  }
}
