import { MapPresenter } from '../../map/presenter/MapPresenter.ts';
import { TypesTile } from '../../map/model/TileModel.ts';
import { ArenaModel } from './ArenaModel.ts';
import { SportType } from '../../sport/model/Sport.ts';
import { Tournament } from '../../tournement/model/Tournament.ts';
import { ArenaPresenter } from '../presenter/ArenaPresenter.ts';
import { getPosition, PositionTypes } from '../../map/core/GamePlacer.ts';

type BuildingFactoryOptions = {
  arena?: {
    number?: number;
    spacing?: number;
  };
  trainingCenter?: {
    number?: number;
    spacing?: number;
  };
};

export class BuildingFactory {
  private static readonly MAX_ATTEMPTS = 100;
  private readonly options: BuildingFactoryOptions = {
    arena: {
      number: 5,
      spacing: 10,
    },
    trainingCenter: {
      number: 5,
      spacing: 10,
    },
  };
  private mapPresenter: MapPresenter;

  constructor(mapPresenter: MapPresenter, options?: BuildingFactoryOptions) {
    this.mapPresenter = mapPresenter;
    this.options = { ...this.options, ...options };
  }

  public createArenas(): ArenaPresenter[] {
    const springSports = [SportType.SKI, SportType.SKATING];
    const summerSports = [SportType.ATHLETISM, SportType.ESCALADE, SportType.NATATION];
    const arenas: ArenaPresenter[] = [];
    const notConstructible = [TypesTile.MOUNTAIN, TypesTile.DEEP_WATER, TypesTile.WATER, TypesTile.SNOW];
    let index: number = 0;
    if (this.options.arena?.number == undefined) throw new Error('Options is undefined');
    while (index < BuildingFactory.MAX_ATTEMPTS && arenas.length < this.options.arena.number) {
      const x = Math.floor(Math.random() * this.mapPresenter.getDisplacementGraph().getSize());
      const z = Math.floor(Math.random() * this.mapPresenter.getDisplacementGraph().getSize());
      const tempTileModel = this.mapPresenter.getDisplacementGraph().getTile(x, z);
      if (tempTileModel && !notConstructible.includes(tempTileModel.type)) {
        const arenaPresenter = new ArenaPresenter(
          new ArenaModel(
            Math.random() > 0.5 ? summerSports : springSports,
            getPosition({ x, y: z, type: tempTileModel.type }, PositionTypes.BUILDING),
            'Arena ' + arenas.length,
            new Tournament(),
          ),
        );
        arenas.push(arenaPresenter);
      }
      index++;
    }
    return arenas;
  }
}
