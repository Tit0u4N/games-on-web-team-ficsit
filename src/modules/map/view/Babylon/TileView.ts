import { TypesTile } from '../../model/TileModel.ts';
import { BaseTile } from './TileViewFactory.ts';
import { MapView } from './MapView.ts';
import {
  ActionManager,
  ExecuteCodeAction,
  InstancedMesh,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
} from '@babylonjs/core';
import { getPosition, PositionTypes } from '../../core/GamePlacer.ts';
import { config } from '../../../../core/Interfaces.ts';

/**
 * Tile class for the game
 * Contains a mesh and a position
 */
export class TileView {
  private readonly scene: Scene;
  private readonly _mesh: InstancedMesh;
  private type: TypesTile;
  private x: number;
  private y: number;
  private mapView: MapView;
  private static readonly _radius: number = config.map.view.tileViewFactory.radius;

  constructor(scene: Scene, x: number, y: number, baseTile: BaseTile, mapView: MapView) {
    this.scene = scene;
    this._mesh = this.createHexagonMesh(x, y, baseTile);
    this.x = x;
    this.y = y;
    this.mapView = mapView;
    // this.addActionManger();
    this.type = baseTile.type;
  }

  private createHexagonMesh(x: number, y: number, baseTile: BaseTile): InstancedMesh {
    const mesh = baseTile.baseMesh.createInstance('tileInstance_' + x + '_' + y);

    mesh.position = getPosition({ x, y, type: baseTile.type }, PositionTypes.TILE);

    mesh.actionManager = new ActionManager(this.scene);

    // Add physics to the mesh
    if (baseTile.type !== TypesTile.ACCESSIBLE)
      new PhysicsAggregate(
        mesh,
        PhysicsShapeType.BOX,
        { mass: config.map.view.tileView.createHexagonMesh.mass },
        this.scene,
      );

    return mesh;
  }

  private addActionManger() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const tile = this;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    this._mesh.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
        tile.mapView.mapPresenter.moveCharacterToTile(tile.x, tile.y);
        console.log(tile.mesh.position);
        console.log(tile.x + '_' + tile.y, tile.mapView.mapModel.getTile(tile.x, tile.y).subBiome?.id, tile.type);
      }),
    );
  }

  get mesh(): InstancedMesh {
    return this._mesh;
  }

  static get radius(): number {
    return this._radius;
  }
}
