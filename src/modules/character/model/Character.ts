import { Statistics } from './Statistics';
import { Inventory } from './Inventory';
import { Attributes } from './Attributes';

export class Character {
  private _id: number;
  private _name: string;
  private _nationality: string;
  private _age: number;
  private _statistics: Statistics;
  private _inventory: Inventory;
  private _attributes: Attributes;

  public constructor(id: number, name: string, nationality: string, age: number) {
    this._id = id;
    this._name = name;
    this._nationality = nationality;
    this._age = age;
    this._inventory = new Inventory();
    // TODO: see when we give the statistics
    this._statistics = new Statistics();
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get nationality(): string {
    return this._nationality;
  }

  set nationality(value: string) {
    this._nationality = value;
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    this._age = value;
  }

  get statistics(): Statistics {
    return this._statistics;
  }

  set statistics(value: Statistics) {
    this._statistics = value;
  }

  get inventory(): Inventory {
    return this._inventory;
  }

  set inventory(value: Inventory) {
    this._inventory = value;
  }
}
