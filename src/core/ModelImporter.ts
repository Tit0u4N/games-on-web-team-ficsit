import { Mesh, Scene, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

type ImportModelOptions = {
  meshNameList?: string;
  path?: string;
  scene?: Scene | null;
  multiMaterial?: boolean;
};

export async function importModel(fileName: string, options?: ImportModelOptions): Promise<Mesh> {
  const defaultOptions: ImportModelOptions = {
    meshNameList: '',
    path: '',
    scene: null,
    multiMaterial: false,
  };
  options = { ...defaultOptions, ...options };
  const result = await SceneLoader.ImportMeshAsync(
    options.meshNameList,
    './models/' + options.path,
    fileName,
    options.scene,
  );
  const meshes = result.meshes.filter((mesh) => mesh !== undefined && mesh.name !== '__root__');
  const mesh = Mesh.MergeMeshes(meshes as Mesh[], true, true, undefined, false, options.multiMaterial);
  if (!mesh) throw new Error('No mesh found');
  return mesh;
}
