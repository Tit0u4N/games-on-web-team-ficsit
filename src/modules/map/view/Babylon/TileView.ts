import { TypesTile } from '@map/model/TileModel.ts';
import { BaseTile } from './TileViewFactory.ts';
import { MapView } from './MapView.ts';
import { InstancedMesh, PhysicsAggregate, PhysicsShapeType, Scene, Vector3 } from '@babylonjs/core';
import { getPosition, PositionTypes } from '@map/core/GamePlacer.ts';
import { config } from '@/core/Interfaces.ts';
import { DecorsSet } from './decor/DecorsSet.ts';
import { GameOptions } from '@/core/GameOptions.ts';

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
    this.type = baseTile.type;
  }

  private createHexagonMesh(x: number, y: number, baseTile: BaseTile): InstancedMesh {
    const mesh = baseTile.baseMesh.createInstance('tileInstance_' + x + '_' + y);
    mesh.metadata = { x, y, type: baseTile.type };

    mesh.position = getPosition({ x, y, type: baseTile.type }, PositionTypes.TILE);

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

  getRandomDecorPosition(): Vector3 {
    const radius = TileView.radius * 1.35;
    const x = Math.random() * radius - radius / 2 + this._mesh.position.x;
    const z = Math.random() * radius - radius / 2 + this._mesh.position.z;
    return new Vector3(x, this._mesh.position.y * 2, z);
  }

  addForest(treeDecor: DecorsSet) {
    let nbTrees = 0;
    let distanceMinBetweenTrees = 0;
    if (this.type === TypesTile.FOREST || this.type === TypesTile.HILL_FOREST) {
      nbTrees = Math.floor((Math.random() + 0.5) * GameOptions.instance.trees.value);
      distanceMinBetweenTrees = 0.6;
    } else if (this.type === TypesTile.GRASS || this.type === TypesTile.HILL_GRASS) {
      nbTrees = Math.floor((Math.random() * GameOptions.instance.trees.value) / 7);
      distanceMinBetweenTrees = 1.5;
    }

    if (nbTrees === 0) return;

    const max_attempts = 50;
    let attempts = 0;
    while (attempts < max_attempts && nbTrees > 0) {
      const vector = this.getRandomDecorPosition();
      if (treeDecor.distanceToNearestDecor(vector) > distanceMinBetweenTrees) {
        treeDecor.addDecorToMount(vector);
        attempts = 0;
        nbTrees--;
      } else {
        attempts++;
      }
    }
  }

  get mesh(): InstancedMesh {
    return this._mesh;
  }

  static get radius(): number {
    return this._radius;
  }
}
