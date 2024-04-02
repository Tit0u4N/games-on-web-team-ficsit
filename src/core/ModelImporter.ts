import { Mesh, Scene, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

export async function importModel(
  meshNameList: string[] | string,
  path: string,
  fileName: string,
  scene: Scene,
  multiMaterial: boolean = false,
): Promise<Mesh> {
  const promise = await SceneLoader.ImportMeshAsync(meshNameList, './models/' + path, fileName, scene).then(
    (result) => {
      const meshes = result.meshes.filter((mesh) => mesh !== undefined && mesh.name !== '__root__');
      return Mesh.MergeMeshes(meshes as Mesh[], true, true, undefined, false, multiMaterial);
    },
  );
  return <Mesh>promise;
}
