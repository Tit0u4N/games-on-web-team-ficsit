import { TypesTile } from '../../model/TileModel.ts';
import { TileView } from './TileView.ts';
import { MapView } from './MapView.ts';
import { Color3, Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';

export type BaseTile = {
  type: TypesTile;
  color: string;
  radius: number;
  baseMesh: Mesh;
  baseMaterial: StandardMaterial;
};

export class TileViewFactory {
  private scene: Scene;
  private radius: number = 2;
  private parentMesh!: Mesh;
  private baseTiles: BaseTile[] = [];

  constructor(scene: Scene, radius?: number) {
    this.scene = scene;
    this.radius = radius || this.radius;
    this.baseTiles = this.createBaseTiles();
  }

  private createBaseTiles(): BaseTile[] {
    const tempBaseTiles: BaseTile[] = [];
    this.parentMesh = new Mesh('base_tile_group', this.scene);
    console.log();
    for (let typeTileKey in TypesTile) {
      if (!isNaN(Number(typeTileKey))) continue;
      const type = TypesTile[typeTileKey as keyof typeof TypesTile];
      tempBaseTiles.push(this.createBaseTile(type));
    }

    return tempBaseTiles;
  }

  private createBaseTile(type: TypesTile): BaseTile {
    const mesh = MeshBuilder.CreateCylinder(
      'base_tile_' + type,
      {
        tessellation: 6,
        height: this.getHeight(type),
        diameter: 2 * this.radius,
      },
      this.scene,
    );

    mesh.isVisible = false; // The base mesh should not be visible
    this.parentMesh.addChild(mesh);

    const color = this.getColor(type);
    const material = new StandardMaterial('material_tile_ ' + type, this.scene);
    material.diffuseColor = Color3.FromHexString(color);
    mesh.material = material;

    return {
      type: type,
      color: color,
      baseMesh: mesh,
      radius: this.radius,
      baseMaterial: material,
    };
  }

  public getHeight(type: TypesTile): number {
    let modifierHeight: number = 0.7;
    switch (type) {
      case TypesTile.SNOW:
        modifierHeight = 3;
        break;
      case TypesTile.MOUNTAIN:
        modifierHeight = 2;
        break;
      case TypesTile.FOREST:
        modifierHeight = 1.2;
        break;
      case TypesTile.GRASS:
        modifierHeight = 1;
        break;
      case TypesTile.HILL_GRASS:
        modifierHeight = 1.3;
        break;
      case TypesTile.HILL_FOREST:
        modifierHeight = 1.5;
        break;
      case TypesTile.SAND:
        modifierHeight = 0.8;
        break;
      case TypesTile.WATER:
      case TypesTile.DEEP_WATER:
        modifierHeight = 0.5;
        break;
    }

    return modifierHeight * 5;
  }

  public getColor(type: TypesTile): string {
    switch (type) {
      case TypesTile.SNOW:
        return '#ffffff';
      case TypesTile.MOUNTAIN:
        return '#aaaaaa';
      case TypesTile.FOREST:
        return '#a7c987';
      case TypesTile.GRASS:
        return '#cff187';
      case TypesTile.SAND:
        return '#edc9af';
      case TypesTile.WATER:
        return '#9696ff';
      case TypesTile.DEEP_WATER:
        return '#7878e1';
      case TypesTile.HILL_GRASS:
        return '#cff187';
      case TypesTile.HILL_SAND:
        return '#edc9af';
      case TypesTile.HILL_FOREST:
        return '#a7c987';

      // For debug
      case TypesTile.DEFAULT:
        return '#ff0000';
      case TypesTile.DEFAULT2:
        return '#00ff00';
      case TypesTile.DEFAULT3:
        return '#0000ff';
      case TypesTile.DEFAULT4:
        return '#ffFF00';
      case TypesTile.DEFAULT5:
        return '#00FFFF';
      case TypesTile.DEFAULT6:
        return '#FF00FF';
      case TypesTile.DEFAULT7:
        return '#FFFFFF';
      case TypesTile.DEFAULT8:
        return '#000000';
      case TypesTile.DEFAULT9:
        return '#F00FF0';
    }
  }

  public createTile(x: number, y: number, type: TypesTile, mapView: MapView): TileView {
    const baseTile = this.baseTiles[type];
    return new TileView(this.scene, x, y, baseTile, mapView);
  }

  // Create a cube above the tile
  public createCubeOnTile(tile: TileView): Vector3 {
    // add red color
    const cube = MeshBuilder.CreateBox('cube_tile', { size: 2,
      faceColors: [
        new Color4(1, 0, 0, 1),
        new Color4(1, 0, 0, 1),
        new Color4(1, 0, 0, 1),
        new Color4(1, 0, 0, 1),
        new Color4(1, 0, 0, 1),
        new Color4(1, 0, 0, 1)
      ]
    }, this.scene);
    cube.position = tile.mesh.position.add(new Vector3(0, tile.mesh.getBoundingInfo().boundingBox.extendSize.y + 0.5, 0));
    cube.material =  new StandardMaterial('material_cube', this.scene);
    return cube.position;
  }
}
