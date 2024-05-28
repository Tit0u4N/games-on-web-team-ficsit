import { MapPresenter } from '@map/presenter/MapPresenter.ts';
import { TypesTile } from '@map/model/TileModel.ts';
import { ArenaModel } from './ArenaModel.ts';
import { TrainingCenterModel } from './TrainingCenterModel.ts';
import { ArenaPresenter } from '../presenter/ArenaPresenter.ts';
import { getPosition, PositionTypes } from '@map/core/GamePlacer.ts';
import { TrainingCenterPresenter } from '../presenter/TrainingCenterPresenter.ts';
import { config } from '@core/Interfaces.ts';
import { Sport } from '@core/singleton/Sport.ts';
import { TournamentManagerPresenter } from '@tournament/presenter/TournamentManagerPresenter.ts';
import { BuildingPresenter } from '../presenter/BuildingPresenter.ts';

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
  private static readonly MAX_ATTEMPTS = config.building.model.buildingFactory.maxAttempts;
  private readonly options: BuildingFactoryOptions = {
    arena: {
      number: config.building.model.buildingFactory.arena.numberOfBuildings,
      spacing: config.building.model.buildingFactory.arena.spacing,
    },
    trainingCenter: {
      number: config.building.model.buildingFactory.trainingCenter.numberOfBuildings,
      spacing: config.building.model.buildingFactory.trainingCenter.spacing,
    },
  };
  private mapPresenter: MapPresenter;

  constructor(mapPresenter: MapPresenter, options?: BuildingFactoryOptions) {
    this.mapPresenter = mapPresenter;
    this.options = { ...this.options, ...options };
  }

  /**
   * Create arenas
   * @returns ArenaPresenter[]
   * @public
   */
  public createArenas(
    buildingPresenter: BuildingPresenter,
    tournamentManagerPresenter: TournamentManagerPresenter,
  ): ArenaPresenter[] {
    const springSports = Sport.getBySeason('SPRING');
    const summerSports = Sport.getBySeason('SUMMER');
    const arenas: ArenaPresenter[] = [];
    const notConstructible = [TypesTile.MOUNTAIN, TypesTile.DEEP_WATER, TypesTile.WATER, TypesTile.SNOW];
    let index: number = 0;
    while (
      index < BuildingFactory.MAX_ATTEMPTS &&
      arenas.length < (this.options.arena?.number ?? config.building.model.buildingFactory.arena.numberOfBuildings)
    ) {
      const x = Math.floor(Math.random() * this.mapPresenter.getDisplacementGraph().getSize());
      const z = Math.floor(Math.random() * this.mapPresenter.getDisplacementGraph().getSize());
      const tempTileModel = this.mapPresenter.getDisplacementGraph().getTile(x, z);
      if (tempTileModel && !notConstructible.includes(tempTileModel.type)) {
        const arenaPresenter = new ArenaPresenter(
          buildingPresenter,
          new ArenaModel(
            Math.random() > 0.5 ? summerSports : springSports,
            { x: x, y: z, type: tempTileModel.type },
            'Arena ' + arenas.length,
          ),
          tournamentManagerPresenter,
        );
        arenaPresenter.arena.arenaPresenter = arenaPresenter;
        if (!this.checkHasArenasNeighbors(arenaPresenter, arenas)) arenas.push(arenaPresenter);
      }
      index++;
    }
    return arenas;
  }

  /**
   * Check if the arena has neighbors
   * If the distance between the arena and another arena is less than the spacing, return true
   * @param arena ArenaPresenter
   * @param arenas ArenaPresenter[]
   * @returns boolean - true if the arena has neighbors, false otherwise
   * @private
   */
  private checkHasArenasNeighbors(arena: ArenaPresenter, arenas: ArenaPresenter[]): boolean {
    const newArenaPosition = arena.arena.position;

    // Iterate over existing arenas and check if any are within the specified spacing
    for (const existingArena of arenas) {
      const existingArenaPosition = existingArena.arena.position;

      // Calculate the distance between the new arena and the existing one
      const distance = Math.sqrt(
        Math.pow(existingArenaPosition.x - newArenaPosition.x, 2) +
          Math.pow(existingArenaPosition.y - newArenaPosition.y, 2),
      );

      // Check if the distance is within the specified spacing
      if (distance <= (this.options.arena?.spacing ?? config.building.model.buildingFactory.arena.spacing)) {
        return true; // Neighboring arena found
      }
    }

    return false; // No neighboring arenas found within the specified spacing
  }

  /**
   * Create training centers
   * @returns TrainingCenterPresenter[]
   * @public
   */
  public createTrainingCenters(): TrainingCenterPresenter[] {
    const trainingCenters: TrainingCenterPresenter[] = [];
    const notConstructible = [TypesTile.MOUNTAIN, TypesTile.DEEP_WATER, TypesTile.WATER, TypesTile.SNOW];
    let index: number = 0;
    while (
      index < BuildingFactory.MAX_ATTEMPTS &&
      trainingCenters.length <
        (this.options.trainingCenter?.number ?? config.building.model.buildingFactory.trainingCenter.numberOfBuildings)
    ) {
      const x = Math.floor(Math.random() * this.mapPresenter.getDisplacementGraph().getSize());
      const z = Math.floor(Math.random() * this.mapPresenter.getDisplacementGraph().getSize());
      const tempTileModel = this.mapPresenter.getDisplacementGraph().getTile(x, z);
      if (tempTileModel && !notConstructible.includes(tempTileModel.type)) {
        const trainingCenterPresenter = new TrainingCenterPresenter(
          new TrainingCenterModel(
            this.mapPresenter,
            this.mapPresenter.view.scene,
            x,
            z,
            getPosition({ x, y: z, type: tempTileModel.type }, PositionTypes.BUILDING),
            'Training Center ' + trainingCenters.length,
          ),
        );
        if (!this.checkHasTrainingCentersNeighbors(trainingCenterPresenter, trainingCenters))
          trainingCenters.push(trainingCenterPresenter);
      }
      index++;
    }
    return trainingCenters;
  }

  /**
   * Check if the training center has neighbors
   * If the distance between the training center and another training center is less than the spacing, return true
   * @param trainingCenter TrainingCenterPresenter
   * @param trainingCenters TrainingCenterPresenter[]
   * @returns boolean - true if the training center has neighbors, false otherwise
   * @private
   */
  private checkHasTrainingCentersNeighbors(
    trainingCenter: TrainingCenterPresenter,
    trainingCenters: TrainingCenterPresenter[],
  ): boolean {
    const newTrainingCenterPosition = trainingCenter.trainingCenter.position;

    // Iterate over existing training centers and check if any are within the specified spacing
    for (const existingTrainingCenter of trainingCenters) {
      const existingTrainingCenterPosition = existingTrainingCenter.trainingCenter.position;

      // Calculate the distance between the new training center and the existing one
      const distance = Math.sqrt(
        Math.pow(existingTrainingCenterPosition.x - newTrainingCenterPosition.x, 2) +
          Math.pow(existingTrainingCenterPosition.y - newTrainingCenterPosition.y, 2),
      );

      // Check if the distance is within the specified spacing
      if (
        distance <=
        (this.options.trainingCenter?.spacing ?? config.building.model.buildingFactory.trainingCenter.spacing)
      ) {
        return true; // Neighboring training center found
      }
    }

    return false; // No neighboring training centers found within the specified spacing
  }
}
