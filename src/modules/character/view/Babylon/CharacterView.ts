import { CharacterPresenter } from '@character/presenter/CharacterPresenter.ts';
import { PawnView } from './PawnView.ts';
import { Animation, Quaternion, Scene, Vector3 } from '@babylonjs/core';
import { ViewInitable } from '@/core/Interfaces.ts';

export class CharacterView implements ViewInitable {
  private readonly characterPresenter: CharacterPresenter;
  private readonly pawnSet: Set<PawnView>;
  private scene: Scene | undefined;

  constructor(characterPresenter: CharacterPresenter) {
    this.characterPresenter = characterPresenter;
    this.pawnSet = new Set<PawnView>();
  }

  async initView(scene: Scene) {
    await this.initPawns(scene);
  }

  async initPawns(scene: Scene): Promise<void> {
    this.scene = scene;
    for (const character of this.characterPresenter.characters) {
      const pawn = new PawnView(character.id, this.scene, this);
      if (character.modelName && character.modelPath) {
        await pawn.importMesh(character.modelName, character.modelPath);
        // log the mesh
        console.log('initPawns', pawn.mesh);
        this.pawnSet.add(pawn);
        pawn.addPointerEvent();
      }
    }
  }

  public givePosition(idCharacter: number, position: Vector3, initial: boolean = false): void {
    const pawn = [...this.pawnSet].find((pawn) => pawn.id === idCharacter);
    if (pawn && pawn.mesh) {
      if (initial) {
        pawn.mesh.position = position;
        return;
      }

      // Calculate the direction vector
      const direction = position.subtract(pawn.mesh.position);
      direction.normalize();

      // Apply the rotation quaternion directly to the mesh
      pawn.mesh.rotationQuaternion = Quaternion.FromLookDirectionRH(direction, Vector3.Up());

      pawn.startAnimations();
      const animationBox = new Animation(
        'deplacementAnimation',
        'position',
        30,
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CYCLE,
      );
      const distance = Vector3.Distance(pawn.mesh.position, position);
      const keys = [];
      keys.push({
        frame: 0,
        value: pawn.mesh.position,
      });
      keys.push({
        frame: distance / 0.1,
        value: position,
      });
      animationBox.setKeys(keys);
      pawn.mesh.animations.push(animationBox);
      const mesh = pawn.mesh;
      this.scene?.beginAnimation(pawn.mesh, 0, 100, false, 2, () => {
        mesh.position = position;
        mesh.animations = [];
        pawn.stopAnimations();
      });
    }
  }

  getSelectedCharacter() {
    return [...this.pawnSet].find((pawn) => pawn.isSelected);
  }

  getOtherPawns(id: number) {
    return [...this.pawnSet].filter((pawn) => pawn.id !== id);
  }

  updateSelectedCharacter() {
    this.characterPresenter.updateSelectedCharacter();
  }

  unscaleCharacters(id?: number) {
    if (id) {
      this.getOtherPawns(id).forEach((otherPawn) => {
        otherPawn.resetScaling();
        otherPawn.isSelected = false;
      });
    } else {
      this.pawnSet.forEach((pawn) => {
        pawn.resetScaling();
        pawn.isSelected = false;
      });
    }
  }

  getCharacterView(id: number) {
    return [...this.pawnSet].find((pawn) => pawn.id === id);
  }

  unMountView() {
    this.pawnSet.forEach((pawn) => {
      pawn.mesh?.dispose();
    });
    this.pawnSet.clear();
  }
}
