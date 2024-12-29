# Save/Load System Documentation

## Overview

The Visual Novel Engine implements a comprehensive save/load system using Zustand with persistence middleware. The system supports multiple save slots, auto-saves, and maintains game state including:

- Current scene and dialogue position
- Game flags and variables
- Dialogue history
- User settings

## Save Slot Management

### Save Slots

- Maximum of 20 save slots available (configurable via `MAX_SAVE_SLOTS`)
- Each save slot contains:
  - Unique ID (0-19)
  - Timestamp
  - Scene state (current scene, dialogue index, history)
  - Game flags
  - Optional description

### Auto-Save

- Auto-save uses slot ID 0 (`AUTO_SAVE_ID`)
- Automatically triggered on key events (scene changes, major choices)
- Can be manually accessed like regular save slots
- Always labeled as "Auto Save"

## Data Structure

### Save Slot Structure
```typescript
interface SaveSlot {
  id: number;          // Slot ID (0-19)
  timestamp: number;   // Save creation time
  sceneState: {
    currentSceneId: string;
    dialogueIndex: number;
    dialogueHistory: HistoryEntry[];
  };
  flags: GameFlags;    // Game progression flags
  description?: string; // Optional save description
}
```

### History Entry Structure
```typescript
interface HistoryEntry {
  speaker: string;
  text: string;
  sceneId: string;
  index: number;
  timestamp: number;
}
```

## Usage Examples

### Creating a Save

```typescript
// Create a manual save in slot 1
gameStore.createSave(1, "Before important choice");

// Create an auto-save
gameStore.createAutoSave();
```

### Loading a Save

```typescript
// Load from slot 1
gameStore.loadSave(1);

// Load auto-save
const autoSave = gameStore.getAutoSave();
if (autoSave) {
  gameStore.loadSave(autoSave.id);
}
```

### Deleting a Save

```typescript
// Delete save in slot 1
gameStore.deleteSave(1);
```

## Storage and Persistence

- Save data is automatically persisted to localStorage
- Storage key: 'visual-novel-storage'
- Persisted data includes:
  - Game flags
  - Scene state
  - User settings

## Best Practices

1. **Auto-save Triggers**
   - Create auto-saves before major choices
   - Create auto-saves when entering new scenes
   - Limit auto-save frequency to prevent storage bloat

2. **Save Descriptions**
   - Use descriptive names for manual saves
   - Include scene or choice context in descriptions
   - Auto-saves are automatically labeled

3. **Save Management**
   - Implement save slot rotation if needed
   - Allow users to overwrite existing saves
   - Provide clear timestamps and descriptions

4. **Error Handling**
   - Validate save data before loading
   - Handle missing or corrupted save data gracefully
   - Provide feedback for save/load operations

## Implementation Details

The save system is implemented using Zustand store with the following key functions:

```typescript
// Create a new save
createSave: (slotId: number, description?: string) => void;

// Load from a save slot
loadSave: (slotId: number) => void;

// Delete a save slot
deleteSave: (slotId: number) => void;

// Get the auto-save
getAutoSave: () => SaveSlot | undefined;

// Create an auto-save
createAutoSave: () => void;
```

## Limitations

1. Save size is limited by localStorage capacity
2. Maximum of 20 save slots (configurable)
3. History limited to last 100 entries
4. Auto-save uses fixed slot ID 0

## Future Improvements

1. Cloud save support
2. Save compression
3. Save import/export
4. Save screenshots
5. Multiple auto-save slots
