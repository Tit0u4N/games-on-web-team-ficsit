import { TypesTile } from '../../model/TileModel.ts';
import { TileView } from './TileView.ts';
import { MapView } from './MapView.ts';
import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial } from '@babylonjs/core';
import { config } from '../../../../core/Interfaces.ts';

export type BaseTile = {
  type: TypesTile;
  color: string;
  radius: number;
  baseMesh: Mesh;
  baseMaterial: StandardMaterial;
};

export class TileViewFactory {
  private scene: Scene;
  private radius: number;
  private parentMesh!: Mesh;
  private baseTiles: BaseTile[] = [];

  constructor(scene: Scene, radius?: number) {
    this.scene = scene;
    this.radius = radius || config.map.view.tileViewFactory.radius;
    this.baseTiles = this.createBaseTiles();
  }

  private createBaseTiles(): BaseTile[] {
    const tempBaseTiles: BaseTile[] = [];
    this.parentMesh = new Mesh('base_tile_group', this.scene);
    for (const typeTileKey in TypesTile) {
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
        tessellation: config.map.view.tileViewFactory.createBaseTile.tessellation,
        height: TileViewFactory.getHeight(type),
        diameter: this.getDiameter(type),
      },
      this.scene,
    );

    mesh.isVisible = false; // The base mesh should not be visible
    this.parentMesh.addChild(mesh);

    const color = this.getColor(type);
    const material = new StandardMaterial('material_tile_ ' + type, this.scene);
    material.diffuseColor = Color3.FromHexString(color);
    if (type === TypesTile.ACCESSIBLE) {
      material.alpha = config.map.view.tileViewFactory.createBaseTile.alphaTypeTileAccessible;
    }
    mesh.material = material;

    return {
      type: type,
      color: color,
      baseMesh: mesh,
      radius: this.radius,
      baseMaterial: material,
    };
  }

  public getDiameter(type: TypesTile): number {
    const diameter = 2 * this.radius;
    if (type === TypesTile.ACCESSIBLE) {
      return diameter - config.map.view.tileViewFactory.getDiameter.diameterTypeTileAccessible;
    }
    return diameter;
  }

  public static getHeight(type: TypesTile): number {
    let modifierHeight: number = config.map.view.tileViewFactory.getHeight.defaultModifierHeight;
    switch (type) {
      case TypesTile.SNOW:
        modifierHeight = config.map.view.tileViewFactory.getHeight.snow;
        break;
      case TypesTile.MOUNTAIN:
        modifierHeight = config.map.view.tileViewFactory.getHeight.mountain;
        break;
      case TypesTile.FOREST:
        modifierHeight = config.map.view.tileViewFactory.getHeight.forest;
        break;
      case TypesTile.GRASS:
        modifierHeight = config.map.view.tileViewFactory.getHeight.grass;
        break;
      case TypesTile.HILL_GRASS:
        modifierHeight = config.map.view.tileViewFactory.getHeight.hillGrass;
        break;
      case TypesTile.HILL_FOREST:
        modifierHeight = config.map.view.tileViewFactory.getHeight.hillForest;
        break;
      case TypesTile.SAND:
        modifierHeight = config.map.view.tileViewFactory.getHeight.sand;
        break;
      case TypesTile.WATER:
        modifierHeight = config.map.view.tileViewFactory.getHeight.water;
        break;
      case TypesTile.DEEP_WATER:
        modifierHeight = config.map.view.tileViewFactory.getHeight.deepWater;
        break;
      case TypesTile.ACCESSIBLE:
        modifierHeight = config.map.view.tileViewFactory.getHeight.accessible;
        break;
    }

    return modifierHeight * 2;
  }

  public getColor(type: TypesTile): string {
    switch (type) {
      case TypesTile.SNOW:
        return config.map.view.tileViewFactory.getColor.gameColors.snow;
      case TypesTile.MOUNTAIN:
        return config.map.view.tileViewFactory.getColor.gameColors.mountain;
      case TypesTile.FOREST:
        return config.map.view.tileViewFactory.getColor.gameColors.forest;
      case TypesTile.GRASS:
        return config.map.view.tileViewFactory.getColor.gameColors.grass;
      case TypesTile.SAND:
        return config.map.view.tileViewFactory.getColor.gameColors.sand;
      case TypesTile.WATER:
        return config.map.view.tileViewFactory.getColor.gameColors.water;
      case TypesTile.DEEP_WATER:
        return config.map.view.tileViewFactory.getColor.gameColors.deepWater;
      case TypesTile.HILL_GRASS:
        return config.map.view.tileViewFactory.getColor.gameColors.hillGrass;
      case TypesTile.HILL_SAND:
        return config.map.view.tileViewFactory.getColor.gameColors.hillSand;
      case TypesTile.HILL_FOREST:
        return config.map.view.tileViewFactory.getColor.gameColors.hillForest;

      // For debug
      case TypesTile.ACCESSIBLE:
        return config.map.view.tileViewFactory.getColor.gameColors.accessible;

      // For debug
      case TypesTile.DEFAULT:
        return config.map.view.tileViewFactory.getColor.debugColors.default;
      case TypesTile.DEFAULT2:
        return config.map.view.tileViewFactory.getColor.debugColors.default2;
      case TypesTile.DEFAULT3:
        return config.map.view.tileViewFactory.getColor.debugColors.default3;
      case TypesTile.DEFAULT4:
        return config.map.view.tileViewFactory.getColor.debugColors.default4;
      case TypesTile.DEFAULT5:
        return config.map.view.tileViewFactory.getColor.debugColors.default5;
      case TypesTile.DEFAULT6:
        return config.map.view.tileViewFactory.getColor.debugColors.default6;
      case TypesTile.DEFAULT7:
        return config.map.view.tileViewFactory.getColor.debugColors.default7;
      case TypesTile.DEFAULT8:
        return config.map.view.tileViewFactory.getColor.debugColors.default8;
      case TypesTile.DEFAULT9:
        return config.map.view.tileViewFactory.getColor.debugColors.default9;
    }
  }

  public createTile(x: number, y: number, type: TypesTile, mapView: MapView): TileView {
    const baseTile = this.baseTiles[type];
    return new TileView(this.scene, x, y, baseTile, mapView);
  }
}
