import { ITile, TileModel } from '../model/TileModel.ts';

export class TilePresenter {
  private _tileModel: ITile;

  constructor(tileModel: TileModel) {
    this._tileModel = tileModel;
  }

  public getID(): string {
    return TilePresenter.getIDFromTileModel(this._tileModel);
  }

  public static getIDFromTileModel(tile: ITile): string {
    return 'P_' + tile.getID();
  }
}
