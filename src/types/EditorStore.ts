import type { CoreEditorData, TriggerType } from "./ProjectData";

export type EditorStore = CoreEditorData & {
  toggleMode: () => void;
  setSelectedObjId: (value: string | undefined) => void;
  setObjStateIdxMap: (value: number) => void;

  // Connect-mode for creating transitions between states in canvas
  isConnecting: boolean;
  connectingFromObjId?: string;
  connectingFromStateId?: string;
  connectingTrigger: TriggerType;
  setConnectingFrom: (objId: string, stateId: string) => void;
  cycleConnectingTrigger: () => void;
  setConnectingTrigger: (trigger: TriggerType) => void;
  cancelConnecting: () => void;
};
