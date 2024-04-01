import { TypesTile } from '../../model/TileModel.ts';
import { BaseTile } from './TileViewFactory.ts';
import { MapView } from './MapView.ts';
import { ActionManager, InstancedMesh, Vector3, ExecuteCodeAction, Scene } from '@babylonjs/core';

/**
 * Tile class for the game
 * Contains a mesh and a position
 */
export class TileView {
  private scene: Scene;
  private _mesh: InstancedMesh;
  private type: TypesTile;
  private x: number;
  private y: number;
  private mapView: MapView;
  private static readonly _radius: number = 2;

  constructor(scene: Scene, x: number, y: number, baseTile: BaseTile, mapView: MapView) {
    this.scene = scene;
    this._mesh = this.createHexagonMesh(x, y, baseTile);
    this.x = x;
    this.y = y;
    this.mapView = mapView;
    this.addActionManger();
    this.type = baseTile.type;
  }

  private createHexagonMesh(x: number, y: number, baseTile: BaseTile): InstancedMesh {
    const mesh = baseTile.baseMesh.createInstance('tileInstance_' + x + '_' + y);

    const modifierX = 1;
    const modifierY = 1.41;

    if (x % 2 === 0) {
      mesh.position = new Vector3(x * (TileView.radius + modifierX), 0, y * (TileView.radius + modifierY));
    } else {
      mesh.position = new Vector3(
        x * (TileView.radius + modifierX),
        0,
        y * (TileView.radius + modifierY) + TileView.radius - 0.27,
      );
    }

    mesh.actionManager = new ActionManager(this.scene);

    return mesh;
  }

  private addActionManger() {
    const tile = this;

    //@ts-ignore
    this._mesh.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, function (evt) {
        // Ce code sera exécuté lorsque l'objet est cliqué
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
