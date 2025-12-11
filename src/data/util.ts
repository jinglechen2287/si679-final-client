import { v4 as uuidv4 } from "uuid";
import { cameraStore, useEditorStore, useSceneStore } from "~/routes/Editor/stores";

export const clientId = uuidv4();

export function pickDBFields() {
  const scene = useSceneStore.getState();
  const editor = useEditorStore.getState();
  const camera = cameraStore.getState();
  return {
    lightPosition: scene.lightPosition,
    content: scene.content,

    mode: editor.mode,
    selectedObjId: editor.selectedObjId,
    objStateIdxMap: editor.objStateIdxMap,

    distance: camera.distance,
    origin: camera.origin,
    yaw: camera.yaw,
    pitch: camera.pitch,
  };
}

export function stringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}
