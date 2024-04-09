import { CharacterPresenter } from '../../presenter/CharacterPresenter.ts';
import { PawnView } from './PawnView.ts';
import { Scene, Vector3 } from '@babylonjs/core';

export class CharacterView {
  private readonly characterPresenter: CharacterPresenter;
  private readonly pawnSet: Set<PawnView>;
  private readonly scene: Scene;

  constructor(characterPresenter: CharacterPresenter, scene: Scene) {
    this.characterPresenter = characterPresenter;
    this.pawnSet = new Set<PawnView>();
    this.scene = scene;
  }

  async initPawns(): Promise<void> {
    for (const character of this.characterPresenter.characters) {
      const pawn = new PawnView(character.id, this.scene, this.getColorById(character.id));
      await pawn.importMesh();
      this.pawnSet.add(pawn);
    }
  }

  public givePosition(idCharacter: number, position: Vector3): void {
    const pawn = [...this.pawnSet].find((pawn) => pawn.id === idCharacter);
    if (pawn && pawn.mesh) {
      pawn.mesh.position = position;
    }
  }

  private getColorById(id: number): string {
    switch (id) {
      case 1:
        return '#ff0000';
      case 2:
        return '#00ff00';
      case 3:
        return '#0000ff';
      default:
        return '#1d0038';
    }
  }
}
