import debounce from "lodash.debounce";
import io from "socket.io-client";
import { clientId, pickDBFields, stringify } from "~/data/util";
import { cameraStore, useEditorStore, useSceneStore } from "~/routes/Editor/stores";
import type {
  CameraData,
  CoreEditorData,
  SceneData,
} from "~/types/ProjectData";
import type { Project } from "~/types/Projects";
import { API_URL } from "./api";
import { getProject, updateProject } from "./projects";

// Prevent feedback loops: when applying remote data to the store, ignore store->DB sync
let isApplyingRemoteUpdate = false;

const getAndSetProjectData = async (projectId: string) => {
  const project: Project = await getProject(projectId);
  isApplyingRemoteUpdate = true;
  try {
    setProjectData(project);
  } finally {
    setTimeout(() => {
      isApplyingRemoteUpdate = false;
    }, 0);
  }
};

const setProjectData = (update: Partial<Project>) => {
  if (update.edited_by_client === clientId) {
    return;
  }
  if (update.editor?.mode && update.editor?.objStateIdxMap) {
    useEditorStore.setState((prev: CoreEditorData) => ({
        mode: update.editor?.mode ?? prev.mode,
        selectedObjId: update.editor?.selectedObjId,
        objStateIdxMap: update.editor?.objStateIdxMap ?? prev.objStateIdxMap,
      }));
  }
  useSceneStore.setState((prev: SceneData) => ({
    lightPosition: update.scene?.lightPosition ?? prev.lightPosition,
    content: update.scene?.content ?? prev.content,
  }));
  cameraStore.setState((prev: CameraData) => ({
    distance: update.camera?.distance ?? prev.distance,
    origin: update.camera?.origin ?? prev.origin,
    yaw: update.camera?.yaw ?? prev.yaw,
    pitch: update.camera?.pitch ?? prev.pitch,
  }));
};

export function startProjectSync(projectId: string) {
  getAndSetProjectData(projectId);

  const socket = io(API_URL);

  socket.on(
    "updateProject",
    (updatedProjectId: string, update: Partial<Project>) => {
      if (updatedProjectId === projectId) {
        isApplyingRemoteUpdate = true;
        try {
          setProjectData(update);
        } finally {
          setTimeout(() => {
            isApplyingRemoteUpdate = false;
          }, 0);
        }
      }
    },
  );

  let lastSnapshotString = stringify(pickDBFields());

  const postUpdate = async () => {
    const current = pickDBFields();
    const currentString = stringify(current);
    if (lastSnapshotString === currentString) {
      return;
    }
    const scene: SceneData = {
      lightPosition: current.lightPosition,
      content: current.content,
    };
    const editor: CoreEditorData = {
      mode: current.mode,
      selectedObjId: current.selectedObjId,
      objStateIdxMap: current.objStateIdxMap,
    };
    const camera: CameraData = {
      distance: current.distance,
      origin: current.origin,
      yaw: current.yaw,
      pitch: current.pitch,
    };
    const update = {
      scene,
      editor,
      camera,
      edited_by_client: clientId,
      edited_at: new Date(),
    };
    await updateProject(projectId, update);
    lastSnapshotString = currentString;
  };

  const debouncedPostUpdate = debounce(postUpdate, 10, { maxWait: 50 });

  const handleStoreChange = () => {
    const next = pickDBFields();
    const nextString = stringify(next);
    if (isApplyingRemoteUpdate) return;
    if (nextString === lastSnapshotString) return;
    debouncedPostUpdate();
  };

  const unsubscribeSceneStore = useSceneStore.subscribe(handleStoreChange);
  const unsubscribeEditorStore = useEditorStore.subscribe(handleStoreChange);
  const unsubscribeCameraStore = cameraStore.subscribe(handleStoreChange);

  return () => {
    socket.disconnect();
    unsubscribeSceneStore();
    unsubscribeEditorStore();
    unsubscribeCameraStore();
  };
}
