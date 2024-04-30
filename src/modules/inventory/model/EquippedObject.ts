import { UsableObject } from '../../object/model/UsableObject';

export class EquippedObject {
  private _head: UsableObject | null = null;
  private _chest: UsableObject | null = null;
  private _legs: UsableObject | null = null;
  private _feet: UsableObject | null = null;

  constructor() {}

  /**
   * Replace an object in the given slot by the new object and return the replaced object
   * Throw an error if the slot is unknown, or impossible to replace the object
   * @param object the object to replace
   * @param slot the slot to replace
   * @returns the replaced object
   */
  public equip(object: UsableObject, slot: EquippedObjectSlot): UsableObject | null {
    if (!this.canBePlacedInSlot(slot, object))
      throw new Error(`The object slot is not the same as the slot to replace: ${object.slot} !== ${slot}`);
    return this.setObject(slot, object);
  }

  /**
   * Unequip the object in the given slot and return it
   * @param slot The slot to unequip
   * @returns the unequipped object
   */
  public unequip(slot: EquippedObjectSlot): UsableObject | null {
    return this.setObject(slot, null);
  }

  /**
   * Check if the object can be placed in the slot
   * @param slot The slot to check
   * @param object The object to check
   * @returns true if the object can be placed in the slot, false otherwise
   */
  private setObject(slot: EquippedObjectSlot, object: UsableObject | null) {
    let replacedObject: UsableObject | null = null;
    switch (slot) {
      case EquippedObjectSlot.HEAD:
        replacedObject = this._head;
        this._head = object;
        break;
      case EquippedObjectSlot.CHEST:
        replacedObject = this._chest;
        this._chest = object;
        break;
      case EquippedObjectSlot.LEGS:
        replacedObject = this._legs;
        this._legs = object;
        break;
      case EquippedObjectSlot.FEET:
        replacedObject = this._feet;
        this._feet = object;
        break;
      default:
        throw new Error(`Unknown slot: ${slot}`);
    }
    return replacedObject;
  }

  /**
   * Return all equipped objects
   */
  get all(): UsableObject[] {
    return [this._head, this._chest, this._legs, this._feet].filter((object) => object !== null) as UsableObject[];
  }

  get head(): UsableObject | null {
    return this._head;
  }

  get chest(): UsableObject | null {
    return this._chest;
  }

  get legs(): UsableObject | null {
    return this._legs;
  }

  get feet(): UsableObject | null {
    return this._feet;
  }

  public canBePlacedInSlot(slot: EquippedObjectSlot, usableObject: UsableObject): boolean {
    return usableObject.slot === slot;
  }
}

export enum EquippedObjectSlot {
  HEAD = 'head',
  CHEST = 'chest',
  LEGS = 'legs',
  FEET = 'feet',
}
