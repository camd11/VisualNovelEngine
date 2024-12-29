# Component Architecture Documentation

## Overview

The Visual Novel Engine uses a React/TypeScript architecture with modular components, global state management via Zustand, and CSS modules for styling. The architecture focuses on maintainability, testability, and clear separation of concerns.

## Component Hierarchy

```
App
├── TitleScreen
└── DialogueBox
    ├── QuickMenu
    │   ├── Auto/Skip Controls
    │   ├── Backlog
    │   ├── Save/Load
    │   ├── Options
    │   └── Quit
    ├── DebugConsole
    └── Overlays
        ├── BacklogOverlay
        ├── SaveOverlay
        ├── OptionsOverlay
        └── QuitOverlay
```

## Core Components

### App (App.tsx)
- Root component managing game state
- Handles scene transitions
- Switches between title screen and game view
```typescript
interface Scene {
  id: string;
  dialogues: Array<{ speaker: string; text: string; }>;
  choices: Array<{ text: string; nextScene: string; }>;
}

type GameState = 'title' | 'game';
```

### TitleScreen (TitleScreen.tsx)
- Entry point for the game
- Provides game start functionality
- Handles initial game setup

### DialogueBox (DialogueBox.tsx)
- Core game interface
- Manages dialogue progression
- Handles choice-based branching
- Contains quick menu and overlay controls

### DebugConsole (DebugConsole.tsx)
- Development tools and debugging interface
- Scene jumping functionality
- Flag management
- State inspection

## State Management

### Game Store (gameStore.ts)
Central state management using Zustand:

```typescript
interface GameState {
  // Game progression
  flags: GameFlags;
  sceneState: SceneState;
  
  // Settings
  settings: GameSettings;
  
  // Save system
  saveSlots: SaveSlot[];
  
  // Actions
  setFlag: (key: string, value: any) => void;
  updateSceneState: (state: Partial<SceneState>) => void;
  createSave: (slotId: number, description?: string) => void;
  loadSave: (slotId: number) => void;
  // ... other actions
}
```

### State Categories

1. **Game Progression**
   - Current scene
   - Dialogue index
   - Game flags
   - Dialogue history

2. **User Settings**
   - Text speed
   - Auto-advance delay
   - Window opacity

3. **Save Data**
   - Save slots
   - Auto-saves
   - Save metadata

## Component Communication

### Props Flow
```typescript
// DialogueBox props
interface DialogueBoxProps {
  scene: Scene;
  onSceneChange: (sceneId: string) => void;
  onQuit: () => void;
  autoAdvanceDelay?: number;
}

// TitleScreen props
interface TitleScreenProps {
  onStartGame: () => void;
}
```

### Event Handling
- Scene transitions via onSceneChange
- Game state changes via setGameState
- Save/load operations via gameStore
- Overlay toggles via local state

## Styling Architecture

### CSS Modules
- Component-specific styles
- Scoped class names
- Consistent naming conventions

### Transition System
```typescript
// Transition configurations
const DURATION = {
  NORMAL: 300,
  FAST: 150,
  SLOW: 500
};

const EASING = {
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)'
};
```

### Styled Components
- Emotion for dynamic styling
- Transition animations
- Overlay management

## Data Flow

### Scene Data
- JSON-based scene definitions
- Structured dialogue and choices
- Clear scene transitions

```typescript
{
  "scenes": [
    {
      "id": "scene_id",
      "dialogues": [
        {
          "speaker": "Character",
          "text": "Dialogue text"
        }
      ],
      "choices": [
        {
          "text": "Choice text",
          "nextScene": "next_scene_id"
        }
      ]
    }
  ]
}
```

### State Updates
1. User interaction triggers event
2. Component handles local state if needed
3. Global state updates via gameStore
4. Components react to state changes

## Best Practices

### Component Design
1. **Single Responsibility**
   - Each component has a focused purpose
   - Clear separation of concerns
   - Modular and reusable

2. **Props Interface**
   - Well-defined prop types
   - Optional props with defaults
   - Clear documentation

3. **State Management**
   - Local state for UI-only concerns
   - Global state for shared data
   - Careful state updates

### Code Organization
1. **File Structure**
   ```
   src/
   ├── components/    # React components
   ├── store/        # State management
   ├── utils/        # Helper functions
   ├── data/         # Game data/assets
   └── styles/       # Global styles
   ```

2. **Naming Conventions**
   - PascalCase for components
   - camelCase for functions/variables
   - kebab-case for CSS classes

3. **Code Style**
   - Consistent formatting
   - Clear comments
   - TypeScript types

## Testing Considerations

1. **Component Testing**
   - Consistent data-testid attributes
   - Predictable DOM structure
   - Isolated component tests

2. **State Testing**
   - Verify state updates
   - Test state persistence
   - Check error handling

3. **Integration Testing**
   - Test component interactions
   - Verify data flow
   - Check transitions

## Performance Optimization

1. **Component Updates**
   - Memoization where beneficial
   - Efficient re-renders
   - State update batching

2. **Asset Loading**
   - Lazy loading for overlays
   - Image optimization
   - Code splitting

3. **Animation Performance**
   - Hardware acceleration
   - RAF for animations
   - Transition optimizations

## Future Considerations

1. **Extensibility**
   - Plugin system
   - Custom event handlers
   - Theming support

2. **Accessibility**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader support

3. **Internationalization**
   - Text externalization
   - RTL support
   - Character encoding
