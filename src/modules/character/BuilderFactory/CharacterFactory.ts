// CharacterFactory.ts
import { Attributes } from '@character/model/Attributes';
import { Character } from '@character/model/Character';
import { Statistics } from '@character/model/Statistics';
import { CharacterBuilder } from './CharacterBuilder';

export class CharacterFactory {
  public static createDefaultCharacter(
    id: number,
    name: string,
    nationality: string,
    age: number,
    image: string,
    modelName?: string,
    modelPath?: string,
  ): Character {
    const defaultStatistics = new Statistics();
    const defaultAttributes = new Attributes(5, 0, false);

    return new CharacterBuilder(id, name, nationality, age, image, modelName, modelPath)
      .setStatistics(defaultStatistics)
      .setAttributes(defaultAttributes)
      .build();
  }
}
