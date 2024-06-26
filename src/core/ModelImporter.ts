import { AnimationGroup, Mesh, Scene, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

export type ImportModelOptions = {
  meshNameList?: string;
  path?: string;
  scene?: Scene | null;
  multiMaterial?: boolean;
};

export async function importModel(
  fileName: string,
  options?: ImportModelOptions,
): Promise<{ mesh: Mesh; animations: AnimationGroup[] }> {
  const defaultOptions: ImportModelOptions = {
    meshNameList: '',
    path: '',
    scene: null,
    multiMaterial: false,
  };
  options = { ...defaultOptions, ...options };
  try {
    const result = await SceneLoader.ImportMeshAsync(
      options.meshNameList,
      './models/' + options.path,
      fileName,
      options.scene,
    );
    const meshes = result.meshes.filter((mesh) => mesh !== undefined && mesh.name !== '__root__');
    const mesh = Mesh.MergeMeshes(meshes as Mesh[], true, true, undefined, false, options.multiMaterial);
    if (!mesh) throw new Error('No mesh found');
    mesh.name = fileName.split('.')[0];
    return { mesh, animations: result.animationGroups };
  } catch (error) {
    console.error('Error importing mesh:', error);
    throw error;
  }
}
