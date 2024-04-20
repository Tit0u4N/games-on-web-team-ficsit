import {
  Mesh,
  MeshBuilder,
  Observer,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
  StandardMaterial,
  TargetCamera,
  Texture,
  Vector3,
  Vector4,
} from '@babylonjs/core';
import { DicePresenter } from '../../presenter/DicePresenter.ts';
import { ViewInitable } from '../../../../core/Interfaces.ts';

export class Dice3D implements ViewInitable {
  private readonly scene: Scene;
  private mesh!: Mesh;
  private physics!: PhysicsAggregate;
  private camera!: TargetCamera;
  private observer!: Observer<Scene>;
  private state: 'idle' | 'rolling' | 'rolled' = 'idle';

  constructor(scene: Scene, dicePresenter: DicePresenter) {
    this.scene = scene;
    this.camera = this.getCamera();
    dicePresenter.RollDiceFunc3D = () => this.rollDice();
  }

  initView(scene: Scene): void {
    this.mesh = this.createMesh();
    this.setPos(this.camera.getFrontPosition(5));
    const linearVelocity = this.mesh.position.subtract(this.camera.position).normalize().scale(30);
    this.addPhysics();
    this.physics.body.setAngularVelocity(this.getRandomAngularVelocity());
    this.physics.body.setLinearVelocity(linearVelocity);

    this.createObserver();
  }

  private createMesh(): Mesh {
    const faceUV = [];
    for (let i = 0; i < 20; i++) {
      faceUV[i] = new Vector4((i % 4) / 4, Math.floor(i / 4) / 5, ((i % 4) + 1) / 4, (Math.floor(i / 4) + 1) / 5);
    }
    const mesh = MeshBuilder.CreatePolyhedron('dice', { type: 3, size: 2, faceUV: faceUV }, this.scene);
    const material = new StandardMaterial('diceMaterial', this.scene);
    material.diffuseTexture = new Texture('/textures/dice/numbers_4.png', this.scene);
    mesh.material = material;

    return mesh;
  }

  private createObserver() {
    this.observer = this.scene.onBeforeRenderObservable.add(() => {
      if (
        this.physics.body.getLinearVelocity().length() < 0.1 &&
        this.physics.body.getAngularVelocity().length() < 0.1
      ) {
        this.state = 'rolled';
        this.scene.onBeforeRenderObservable.remove(this.observer);
      }
    });
  }

  private getCamera(): TargetCamera {
    return <TargetCamera>this.scene.activeCamera!;
  }

  private addPhysics() {
    this.physics = new PhysicsAggregate(
      this.mesh,
      PhysicsShapeType.MESH,
      { mass: 1, friction: 200, restitution: 0.01 },
      this.scene,
    );
  }

  private setPos(vector: Vector3) {
    vector = vector.clone();
    this.mesh.position = vector;
  }

  private getRandomAngularVelocity() {
    return new Vector3(Math.random() * 7, Math.random() * 7, Math.random() * 7);
  }

  unMountView() {
    this.mesh.dispose();
  }

  getDiceValue() {
    const nbFaces = this.mesh.getTotalVertices() / 3;
    const topFace = {
      index: -1,
      position: new Vector3(0, 0, 0),
      maxHeight: -Infinity,
    };
    for (let i = 0; i < nbFaces; i++) {
      const face = this.mesh.getFacetPosition(i);
      if (face.y > topFace.maxHeight) {
        topFace.maxHeight = face.y;
        topFace.position = face;
        topFace.index = i;
      }
    }

    return this.getValueFromFaceIndex(topFace.index);
  }

  getValueFromFaceIndex(faceIndex: number) {
    switch (faceIndex) {
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 3;
      case 3:
        return 4;
      case 4:
        return 17;
      case 5:
        return 18;
      case 6:
        return 16;
      case 7:
        return 20;
      case 8:
        return 13;
      case 9:
        return 14;
      case 10:
        return 15;
      case 11:
        return 16;
      case 12:
        return 6;
      case 13:
        return 10;
      case 14:
        return 11;
      case 15:
        return 12;
      case 16:
        return 5;
      case 17:
        return 9;
      case 18:
        return 7;
      case 19:
        return 8;
      default:
        return -1;
    }
  }

  async waitForDiceToRoll() {
    return new Promise((resolve) => {
      const checkDiceState = () => {
        if (this.state === 'rolled') {
          resolve(null);
        } else {
          setTimeout(checkDiceState, 100); // Vérifie l'état toutes les 100 millisecondes
        }
      };
      checkDiceState();
    });
  }

  async rollDice(): Promise<number> {
    this.initView(this.scene);
    this.state = 'rolling';

    await this.waitForDiceToRoll();
    return this.getDiceValue();
  }
}
