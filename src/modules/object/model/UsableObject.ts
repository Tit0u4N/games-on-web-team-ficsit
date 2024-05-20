import { Statistics } from '../../character/model/Statistics.ts';
import { Character } from '../../character/model/Character.ts';
import { Season } from '../../../core/singleton/Season.ts';
import gameObjectsData from './gameObjects.json';
import gearsCombinaisons from './completeGearKeys.json';
import { Sport } from '../../../core/singleton/Sport.ts';
import { config } from '../../../core/Interfaces.ts';
import { EquippedObjectSlot } from '../../inventory/model/EquippedObjects.ts';

export class UsableObject {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _image: string;
  private readonly _statsIncrease: Statistics;
  private readonly _conditions: Condition[];
  private readonly _slot: EquippedObjectSlot;

  constructor(
    id: number,
    name: string,
    image: string,
    statsIncrease: Statistics,
    conditions: Condition[] = [],
    slot: EquippedObjectSlot,
  ) {
    this._id = id;
    this._name = name;
    this._image = config.usableObject.basePath + image;
    this._statsIncrease = statsIncrease;
    this._conditions = conditions;
    this._slot = slot;
  }

  get statsIncrease(): Statistics {
    return this._statsIncrease;
  }

  getEffect(character: Character, season: Season): Statistics | null {
    // Copy the current stats
    const modifiedStats: Statistics = new Statistics(this._statsIncrease);

    // Get complete gear bonus
    const completeGearBonus = this.getCompleteGearBonus(character, gears);
    if (completeGearBonus) {
      modifiedStats.addStat(completeGearBonus);
    }

    for (const condition of this._conditions) {
      if (this.conditionMatches(condition, character, season)) {
        for (const statBonus of condition.statsIncrease) {
          const sport = Sport.getByName(statBonus.sport);
          if (sport) {
            modifiedStats.set(sport, modifiedStats.get(sport) + statBonus.bonus);
          } else {
            console.error(`Sport not found: ${statBonus.sport}`);
          }
        }
      }

      return modifiedStats;
    }
    return null;
  }

  private getCompleteGearBonus(character: Character, gears: IGears[]): Statistics | null {
    for (const gear of gears) {
      if (gear.allEquipments.every((id) => character.inventory.equippedItemsIds.includes(id))) {
        const bonus = Statistics.createFromJsObject(gear.statsIncrease);
        return bonus;
      }
    }
    return null;
  }

  private conditionMatches(condition: Condition, character: Character, season: Season) {
    switch (condition.type) {
      case 'terrain':
        return character.tile?.subBiome === condition.terrain && season.name === condition.season;
      // Here, we can add more condition types
      default:
        return false;
    }
  }

  get id(): number {
    return this._id;
  }

  get slot(): EquippedObjectSlot {
    return this._slot;
  }

  get name(): string {
    return this._name;
  }

  get image(): string {
    return this._image;
  }
}

enum ConditionType {
  Terrain = 'terrain',
  // Here, we can add more condition types
}

interface GameObjectData {
  id: number;
  name: string;
  sport: string;
  image: string;
  slot: string;
  statsIncrease: IStatIncrease[];
  conditions?: Condition[];
}

export interface IStatIncrease {
  sport: string;
  bonus: number;
}

interface Condition {
  type: string;
  season?: string;
  terrain?: string;
  // Here, we can add more condition properties
  statsIncrease: IStatIncrease[];
}

interface IGears {
  gearId: string;
  allEquipments: number[];
  statsIncrease: IStatIncrease[];
}

function parseGameObjects(data: GameObjectData[]): UsableObject[] {
  return data.map((obj) => {
    const conditions = obj.conditions ? obj.conditions.map(parseCondition) : [];
    const statsIncrease = Statistics.createFromJsObject(obj.statsIncrease);
    const slot = EquippedObjectSlot[obj.slot.toUpperCase() as keyof typeof EquippedObjectSlot];
    return new UsableObject(obj.id, obj.name, obj.image, statsIncrease, conditions, slot);
  });
}

function parseCondition(conditionData: Condition): Condition {
  switch (conditionData.type) {
    case ConditionType.Terrain:
      return conditionData;
    // Here, we can add more condition types
    default:
      throw new Error(`Unknown condition type: ${conditionData.type}`);
  }
}

export const gameObjects: UsableObject[] = parseGameObjects(gameObjectsData);
export const gears: IGears[] = gearsCombinaisons;
