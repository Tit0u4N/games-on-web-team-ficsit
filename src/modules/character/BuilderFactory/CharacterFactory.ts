// CharacterFactory.ts
import { Attributes } from '../model/Attributes';
import { Character } from '../model/Character';
import { Statistics } from '../model/Statistics';
import { Inventory } from '../model/Inventory';
import { CharacterBuilder } from './CharacterBuilder';

export class CharacterFactory {
  public static createDefaultCharacter(id: number, name: string, nationality: string, age: number, image: string): Character {
    const defaultStatistics = new Statistics();
    const defaultInventory = new Inventory();
    const defaultAttributes = new Attributes(10, 0, false);

    return new CharacterBuilder(id, name, nationality, age, image)
      .setStatistics(defaultStatistics)
      .setInventory(defaultInventory)
      .setAttributes(defaultAttributes)
      .build();
  }
}
