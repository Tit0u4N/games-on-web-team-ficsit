import { TileModel } from '../model/TileModel.ts';
import { MapPresenter } from './MapPresenter.ts';

export class TilePresenter {
  private _tileModel: TileModel;
  private _mapPresenter: MapPresenter;

  constructor(tileModel: TileModel, mapPresenter: MapPresenter) {
    this._tileModel = tileModel;
    this._mapPresenter = mapPresenter;
  }

  public getID(): string {
    return TilePresenter.getIDFromTileModel(this._tileModel);
  }

  public static getIDFromTileModel(tile: TileModel): string {
    return 'P_' + tile.getID();
  }
}
