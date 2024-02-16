import {TileModel} from "../TileModel.ts";
import {VertexKey} from "data-structure-typed";
import {TypesBiome} from "./BiomeAbstractModel.ts";

export type CoupleTileIndex = { tile : TileModel, index : number };

export class SubBiomeTilesIdentifier {

    private tileStart: TileModel | null = null;
    private tiles: Readonly<TileModel[]> = [];

    private tilesIdentified: VertexKey[] = [];
    private iteration = 0;

    private _biomeType: TypesBiome | null = null;

    private static readonly MAX_RECURSIVE_ITERATION = 1000;

    constructor(typeBiome: TypesBiome) {
        this._biomeType = typeBiome;
    }

    public identifySubBiomeTiles(tiles : Readonly<TileModel[]>): CoupleTileIndex[] {
        this.tiles = tiles;
        if (this.tiles.length === 0) throw new Error('Tiles array is empty');
        if (this.tiles.length === 1) return [{ tile : tiles[0], index : 0}];

        this.tileStart = tiles[0];

        this.reset();
        this.iteration++;
        this.tilesIdentified.push(this.tileStart.getID());
        this.recursiveIdentifyTiles(this.tileStart);

        const tilesArrays : CoupleTileIndex[] = [];
        this.tilesIdentified.forEach(id => {
            const tileIndex = this.tiles.findIndex(tile => tile.getID() === id);
            if (tileIndex !== -1) tilesArrays.push({ tile : this.tiles[tileIndex], index : tileIndex});
        });

        return tilesArrays;
    }

    private recursiveIdentifyTiles(tile : TileModel){
        if (this.iteration > SubBiomeTilesIdentifier.MAX_RECURSIVE_ITERATION) throw new Error('Max recursive iteration reached');
        const neighbors = tile.getAdjacentTiles().filter(neighbor => this.isTypeBiome(neighbor) && !this.tilesIdentified.includes(neighbor.getID()));
        this.tilesIdentified.push(...neighbors.map(tile => tile.getID() as VertexKey));
        this.iteration++;
        for (let tile of neighbors) this.recursiveIdentifyTiles(tile);
    }

    private reset() {
        this.tilesIdentified = [];
        this.iteration = 0;
    }

    isTypeBiome(tile: TileModel): boolean {
        return tile.typeBiome === this._biomeType;
    }

    get biomeType(): TypesBiome | null {
        return this._biomeType;
    }

    set biomeType(value: TypesBiome) {
        this._biomeType = value;
    }
}