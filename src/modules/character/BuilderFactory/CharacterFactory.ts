// CharacterFactory.ts
import { Attributes } from '@character/model/Attributes';
import { Character } from '@character/model/Character';
import { Statistics } from '@character/model/Statistics';
import { CharacterBuilder } from './CharacterBuilder';
import { Inventory } from '@inventory/model/Inventory.ts';

export class CharacterFactory {
  public static createDefaultCharacter(
    id: number,
    name: string,
    nationality: string,
    age: number,
    image: string,
  ): Character {
    const defaultStatistics = new Statistics();
    const defaultInventory = new Inventory();
    const defaultAttributes = new Attributes(5, 0, false);

    return new CharacterBuilder(id, name, nationality, age, image)
      .setStatistics(defaultStatistics)
      .setInventory(defaultInventory)
      .setAttributes(defaultAttributes)
      .build();
  }
}
