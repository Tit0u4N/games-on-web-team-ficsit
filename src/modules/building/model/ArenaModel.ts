import { ArenaPresenter } from '../presenter/ArenaPresenter.ts';
import { TypesTile } from '@map/model/TileModel.ts';
import { Sport } from '@core/singleton/Sport.ts';
import { config } from '@core/Interfaces.ts';
import { MapPresenter } from '@map/presenter/MapPresenter.ts';

export class ArenaModel {
  private static readonly MIN_ROTATION: number = config.building.model.arenaModel.minRotation;
  private static readonly MAX_ROTATION: number = config.building.model.arenaModel.maxRotation;
  private _sport!: Sport;
  private rotation: number;
  private _position: { x: number; y: number; type: TypesTile };
  private _roundWaiting: number;
  private _name: string;
  private _arenaPresenter!: ArenaPresenter;
  private mapPresenter: MapPresenter;

  constructor(mapPresenter: MapPresenter, position: { x: number; y: number; type: TypesTile }, name: string) {
    this.mapPresenter = mapPresenter;
    this._position = position;
    this._roundWaiting = 0;
    this.rotation = 0;
    this._name = name;
  }

  public updateSport(): void {
    if (this.rotation > 0) {
      this.rotation--;
    } else {
      console.log('updateSport', this.position.x, this.position.y);
      this.rotation = Math.floor(Math.random() * (ArenaModel.MAX_ROTATION - ArenaModel.MIN_ROTATION + 1)) + ArenaModel.MIN_ROTATION;
      this._sport = this.getSport();
      this._arenaPresenter.updateTournament(this._sport);
    }
  }

  private getSport(): Sport {
    const season = this.mapPresenter.gameCorePresenter.getCurrentSeason();
    const sportsBySeason: Sport[] = [];
    sportsBySeason.push(...Sport.getBySeason(season));
    console.log('getSport', sportsBySeason);
    return sportsBySeason[Math.floor(Math.random() * sportsBySeason.length)];
  }

  get position(): { x: number; y: number; type: TypesTile } {
    return this._position;
  }

  set position(position: { x: number; y: number; type: TypesTile }) {
    this._position = position;
  }

  get roundWaiting(): number {
    return this._roundWaiting;
  }

  set roundWaiting(roundWaiting: number) {
    this._roundWaiting = roundWaiting;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get arenaPresenter(): ArenaPresenter {
    return this._arenaPresenter;
  }

  set arenaPresenter(arenaPresenter: ArenaPresenter) {
    this._arenaPresenter = arenaPresenter;
  }
}
