import {
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsHelper,
  PhysicsShapeType,
  Scene,
  StandardMaterial,
  TargetCamera,
  Texture,
  Vector3,
  Vector4,
} from '@babylonjs/core';
import { DicePresenter } from '../../presenter/DicePresenter.ts';

export class Dice3D {
  private readonly scene: Scene;
  private mesh!: Mesh;
  private physics!: PhysicsAggregate;
  private camera!: TargetCamera;

  constructor(scene: Scene, dicePresenter: DicePresenter) {
    this.scene = scene;
    this.camera = this.getCamera();
    dicePresenter.RollDiceFunc3D = () => this.rollDice();
    new PhysicsHelper(this.scene);
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

  private getCamera(): TargetCamera {
    return <TargetCamera>this.scene.activeCamera!;
  }

  private addPhysics() {
    this.physics = new PhysicsAggregate(this.mesh, PhysicsShapeType.MESH, { mass: 1, friction: 20 }, this.scene);
  }

  private setPos(vector: Vector3) {
    vector = vector.clone();
    this.mesh.position = vector;
  }

  private getRandomAngularVelocity() {
    return new Vector3(Math.random() * 7, Math.random() * 7, Math.random() * 7);
  }

  delete() {
    this.mesh.dispose();
  }

  getDiceValue() {
    return 1000;
  }

  async rollDice(): Promise<number> {
    this.mesh = this.createMesh();
    this.setPos(this.camera.getFrontPosition(5));
    const linearVelocity = this.mesh.position.subtract(this.camera.position).normalize().scale(30);
    this.addPhysics();
    this.physics.body.setAngularVelocity(this.getRandomAngularVelocity());
    this.physics.body.setLinearVelocity(linearVelocity);

    await setTimeout(() => {}, 1000);
    return this.getDiceValue();
  }
}
