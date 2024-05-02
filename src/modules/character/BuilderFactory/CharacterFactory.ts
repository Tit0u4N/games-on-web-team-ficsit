// CharacterFactory.ts
import { Attributes } from '../model/Attributes';
import { Character } from '../model/Character';
import { Statistics } from '../model/Statistics';
import { CharacterBuilder } from './CharacterBuilder';
import { Inventory } from '../../inventory/model/Inventory.ts';
import { countries, names, uniqueNamesGenerator } from 'unique-names-generator';

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

  public static createNPC(totalStats: number, minStats: number): Character {
    const id = Math.floor(Math.random() * 1000000) + 5;
    const name = uniqueNamesGenerator({ dictionaries: [names] });
    const nationality = uniqueNamesGenerator({ dictionaries: [countries] });
    const age = Math.floor(Math.random() * 21) + 16; // Between 16 and 36
    const image = './character_1.png'; //TODO: Add random image
    const defaultStatistics = new Statistics(Statistics.initRandomStats(totalStats, minStats));
    const defaultInventory = new Inventory();
    const defaultAttributes = new Attributes(0, 0, false);
    return new CharacterBuilder(id, name, nationality, age, image)
      .setStatistics(defaultStatistics)
      .setInventory(defaultInventory)
      .setAttributes(defaultAttributes)
      .build();
  }
}
