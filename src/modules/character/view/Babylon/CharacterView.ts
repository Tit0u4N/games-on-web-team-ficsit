import { CharacterPresenter } from '../../presenter/CharacterPresenter.ts';
import { PawnView } from './PawnView.ts';
import { Scene, Vector3 } from '@babylonjs/core';

export class CharacterView {
  private readonly characterPresenter: CharacterPresenter;
  private readonly pawnSet: Set<PawnView>;
  private scene: Scene | undefined;

  constructor(characterPresenter: CharacterPresenter) {
    this.characterPresenter = characterPresenter;
    this.pawnSet = new Set<PawnView>();
  }

  async initPawns(scene: Scene): Promise<void> {
    this.scene = scene;
    for (const character of this.characterPresenter.characters) {
      const pawn = new PawnView(character.id, this.scene, this.getColorById(character.id), this);
      await pawn.importMesh();
      this.pawnSet.add(pawn);
      pawn.addPointerEvent();
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

  getSelectedCharacter() {
    return [...this.pawnSet].find((pawn) => pawn.isSelected);
  }

  getOtherPawns(id: number) {
    return [...this.pawnSet].filter((pawn) => pawn.id !== id);
  }
}
