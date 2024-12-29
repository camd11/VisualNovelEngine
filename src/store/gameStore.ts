import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameFlags {
  [key: string]: boolean | number | string | undefined;
}

interface GameSettings {
  textSpeed: 'slow' | 'normal' | 'fast';
  autoAdvanceDelay: number;
  windowOpacity: number;
  language: 'en' | 'ru' | 'zh' | 'ja' | 'ko';
}

interface HistoryEntry {
  speaker: string;
  text: string;
  sceneId: string;
  index: number;
  timestamp: number;
}

interface SceneState {
  currentSceneId: string;
  dialogueIndex: number;
  dialogueHistory: HistoryEntry[];
}

interface SaveSlot {
  id: number;
  timestamp: number;
  sceneState: SceneState;
  flags: GameFlags;
  description?: string;
}

interface GameState {
  // Game progression
  flags: GameFlags;
  setFlag: (key: string, value: boolean | number | string | undefined) => void;
  getFlag: (key: string) => boolean | number | string | undefined;
  resetFlags: () => void;

  // Scene state
  sceneState: SceneState;
  updateSceneState: (state: Partial<SceneState>) => void;
  resetSceneState: () => void;

  // Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetSettings: () => void;

  // Save system
  saveSlots: SaveSlot[];
  createSave: (slotId: number, description?: string) => void;
  loadSave: (slotId: number) => void;
  deleteSave: (slotId: number) => void;
  getAutoSave: () => SaveSlot | undefined;
  createAutoSave: () => void;

  // History management
  addToHistory: (entry: Omit<HistoryEntry, 'timestamp'>) => void;
  jumpToHistory: (entry: HistoryEntry) => void;

  // Global state management
  resetAll: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  textSpeed: 'normal',
  autoAdvanceDelay: 3000,
  windowOpacity: 0.8,
  language: 'en',
};

const DEFAULT_SCENE_STATE: SceneState = {
  currentSceneId: 'prologue',
  dialogueIndex: 0,
  dialogueHistory: [],
};

const MAX_HISTORY_SIZE = 100; // Maximum number of dialogue entries to keep in history

const MAX_SAVE_SLOTS = 20;
const AUTO_SAVE_ID = 0;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      saveSlots: [],
      // Game progression
      flags: {},
      setFlag: (key: string, value: boolean | number | string | undefined) => 
        set((state) => {
          const newFlags = { ...state.flags };
          if (value === undefined) {
            delete newFlags[key];
          } else {
            newFlags[key] = value;
          }
          return {
            ...state,
            flags: newFlags,
          };
        }),
      getFlag: (key: string) => get().flags[key],
      resetFlags: () => set((state) => ({ ...state, flags: {} })),

      // Scene state
      sceneState: DEFAULT_SCENE_STATE,
      updateSceneState: (state: Partial<SceneState>) =>
        set((current) => ({
          ...current,
          sceneState: { ...current.sceneState, ...state },
        })),
      resetSceneState: () => set((state) => ({ ...state, sceneState: DEFAULT_SCENE_STATE })),
      
      // History management
      addToHistory: (entry: Omit<HistoryEntry, 'timestamp'>) =>
        set((state) => {
          const newEntry = { ...entry, timestamp: Date.now() };
          const history = [...state.sceneState.dialogueHistory, newEntry];
          // Keep only the last MAX_HISTORY_SIZE entries
          const trimmedHistory = history.slice(-MAX_HISTORY_SIZE);
          return {
            ...state,
            sceneState: {
              ...state.sceneState,
              dialogueHistory: trimmedHistory,
            },
          };
        }),
      
      jumpToHistory: (entry: HistoryEntry) =>
        set((state) => ({
          ...state,
          sceneState: {
            ...state.sceneState,
            currentSceneId: entry.sceneId,
            dialogueIndex: entry.index,
            // Keep history up to the selected entry
            dialogueHistory: state.sceneState.dialogueHistory.slice(
              0,
              state.sceneState.dialogueHistory.findIndex(
                (e) => e.timestamp === entry.timestamp
              ) + 1
            ),
          },
        })),

      // Settings
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings: Partial<GameSettings>) =>
        set((state) => ({
          ...state,
          settings: { ...state.settings, ...settings },
        })),
      resetSettings: () => set((state) => ({ ...state, settings: DEFAULT_SETTINGS })),

      // Save system
      createSave: (slotId: number, description?: string) => {
        const state = get();
        const newSave: SaveSlot = {
          id: slotId,
          timestamp: Date.now(),
          sceneState: state.sceneState,
          flags: state.flags,
          description
        };
        
        set(state => ({
          saveSlots: [
            ...state.saveSlots.filter(slot => slot.id !== slotId),
            newSave
          ].sort((a, b) => a.id - b.id)
        }));
      },

      loadSave: (slotId: number) => {
        const state = get();
        const saveSlot = state.saveSlots.find(slot => slot.id === slotId);
        
        if (saveSlot) {
          set({
            sceneState: saveSlot.sceneState,
            flags: saveSlot.flags
          });
        }
      },

      deleteSave: (slotId: number) => {
        set(state => ({
          saveSlots: state.saveSlots.filter(slot => slot.id !== slotId)
        }));
      },

      getAutoSave: () => {
        return get().saveSlots.find(slot => slot.id === AUTO_SAVE_ID);
      },

      createAutoSave: () => {
        get().createSave(AUTO_SAVE_ID, 'Auto Save');
      },

      // Global state management
      resetAll: () =>
        set({
          flags: {},
          sceneState: DEFAULT_SCENE_STATE,
          settings: DEFAULT_SETTINGS,
          saveSlots: []
        }),
    }),
    {
      name: 'visual-novel-storage',
      partialize: (state) => ({
        flags: state.flags,
        settings: state.settings,
        sceneState: state.sceneState,
      }),
    }
  )
);
