import {
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  Scene,
  StandardMaterial,
  TargetCamera,
  Texture,
  Vector3,
  Vector4,
} from '@babylonjs/core';

type DiceOptions = {
  position: Vector3;
};

const DEFAULT_OPTIONS: DiceOptions = {
  position: new Vector3(0, 0, 0),
};

export class Dice {
  private readonly scene: Scene;
  private mesh: Mesh;
  private physics!: PhysicsAggregate;
  private camera!: TargetCamera;

  constructor(scene: Scene, options: DiceOptions = DEFAULT_OPTIONS) {
    options = { ...DEFAULT_OPTIONS, ...options };
    this.scene = scene;
    this.camera = this.getCamera();
    this.mesh = this.createDiceMesh();
    this.setPos(this.camera.getFrontPosition(5));
    const linearVelocity = this.mesh.position.subtract(this.camera.position).normalize().scale(30);
    this.addPhysics();
    this.physics.body.setAngularVelocity(this.getRandomAngularVelocity());
    this.physics.body.setLinearVelocity(linearVelocity);
  }

  createDiceMesh(): Mesh {
    const faceUV = [];
    for (let i = 0; i < 20; i++) {
      faceUV[i] = new Vector4((i % 4) / 4, Math.floor(i / 4) / 5, ((i % 4) + 1) / 4, (Math.floor(i / 4) + 1) / 5);
      // faceUV[i] = new Vector4(i % 2 / 2, Math.floor(i / 2) / 2, (i % 2 + 1) / 2, (Math.floor(i / 2) + 1) / 2);
    }
    const mesh = MeshBuilder.CreatePolyhedron('dice', { type: 3, size: 2, faceUV: faceUV }, this.scene);
    const material = new StandardMaterial('diceMaterial', this.scene);
    material.diffuseTexture = new Texture('/textures/dice/numbers_4.png', this.scene);
    mesh.material = material;

    return mesh;
  }

  getCamera(): TargetCamera {
    return <TargetCamera>this.scene.activeCamera!;
  }

  addPhysics() {
    this.physics = new PhysicsAggregate(this.mesh, PhysicsShapeType.MESH, { mass: 1 }, this.scene);
  }

  setPos(vector: Vector3) {
    vector = vector.clone();
    this.mesh.position = vector;
  }

  getRandomAngularVelocity() {
    return new Vector3(Math.random() * 7, Math.random() * 7, Math.random() * 7);
  }

  delete() {
    this.mesh.dispose();
  }
}
