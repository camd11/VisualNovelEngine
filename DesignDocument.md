Visual Novel Engine with AI-Driven Browser Testing

(Updated Design & Specification Document)
Table of Contents

    Overview & Goals
    Core Requirements
    Feature Specifications
        Standard Visual Novel UI
        Save/Load & Autosave
        Branching Story Logic & Scripting
        Scene & State Management
        UI/UX & Accessibility
        Built-in Debug Mode & Extensions
        Multi-Platform Export
        Steam Integration & Achievements
    AI-Driven Testing Workflow
    Technical Stack & Architecture
    Implementation Plan
        Phase 1: Basic Engine & CLI Tools
        Phase 2: UI & Testing Integrations
        Phase 3: Localization & Placeholder Assets
        Phase 4: Final Polish (Voice, Art, Achievements)
    Appendices
        Example Data Schema
        Example React Component Structure
        Example Directory Layout

1. Overview & Goals

The purpose of this document is to outline the design, features, and requirements of a React/JavaScript-based Visual Novel Engine that:

    Runs in the web browser to facilitate AI-driven testing.
    Allows late-stage integration of final assets (art, voice-over, music).
    Supports multiple languages (English, Russian, Chinese, Japanese, Korean).
    Provides standard visual novel UI elements as seen in typical commercial games (e.g., auto-advance, skip, backlog, quick save/load).
    Integrates optional Steam achievements toward the end of development.

2. Core Requirements

    Cross-Browser Compatibility & AI Testing
        Runs reliably in Chrome, Firefox, Edge, etc.
        UI elements must be consistent and stable enough for screenshot-based or DOM-based AI testing.

    Modular, Data-Driven Architecture
        Store storyline text, branching, and flags in structured data (e.g., JSON).
        Keep logic separate from visuals to reduce rework when adding assets.

    Placeholder-Friendly Asset Loading
        Must gracefully handle missing or “dummy” art/audio.
        Final art and voice lines can be plugged in at the end without major refactoring.

    Localization
        Straightforward text substitution in external language files.
        Handle multi-byte characters and potential line-break issues.

    Steam Achievements (Late-Stage)
        Plan for game triggers that correspond to achievements.
        Use Steamworks integration or a similar framework at release.

    Standard Visual Novel UI
        Includes a text box with speaker name, quick-access buttons (auto, skip, backlog, save, load, etc.), and a background/character sprite layer.

3. Feature Specifications
3.1 Standard Visual Novel UI

Based on the reference screenshot and typical VN conventions, your engine should include:

    Dialogue Window & Speaker Name
        A box at the bottom of the screen to display text.
        Clear speaker name labeling (e.g., “Nathan,” “Player,” or “Narrator”).

    Character Sprites & Background
        Foreground character sprites that can change expressions.
        Scene-appropriate background images.

    Quick Interaction Menu/Bar (often displayed along the bottom edge):
        Auto: Toggles auto-play of dialogue (text advances on its own).
        Skip: Fast-forwards through dialogue (commonly for previously read text).
        Backlog / Log: Displays recent dialogue history for the player to review.
        Save: Opens or performs a manual save.
        Load: Opens or performs a manual load.
        Q.Save / Q.Load: Single-click quick-save/quick-load slots.
        Options: Displays in-game settings (volume, text speed, display preferences, etc.).
        Quit: Exits to the main menu or closes the game (in browser, it may just return to a start screen).

    Optional Scene/Chapter Title Display
        Helpful for debugging or letting the player know the current scene/chapter.

Why This Matters

    This UI layout is recognized by visual novel fans and ensures no confusion about how to save/load, fast-forward text, or check previous lines.
    Providing these elements also allows your AI testing agent to easily identify UI controls.

3.2 Save/Load & Autosave

    Manual Save
        Accessible via the menu bar or a dedicated button.
        Stores the current scene, flags, and position in the text.

    Autosave
        Trigger upon entering new scenes or selecting major choices.
        Potentially keep a ring buffer of a few autosave slots.

    Quick Save/Load
        One-button solution for short-term save states (very popular in VNs).
        Overwrites a single slot each time.

3.3 Branching Story Logic & Scripting

    Choice Management
        Branches and conditions defined in JSON or a similar data structure.
        Allows multiple next scenes or outcome variations.

    Flags / Variables
        Track states like “foundKey = true” or “relationshipPoints = 5.”
        Persist across saves/loads and remain consistent for each route.

    Conditional Text
        If needed, dynamically show/hide lines based on flags (e.g., “if foundKey, show ‘You already picked up the key.’”).

3.4 Scene & State Management

    Global State
        Manage using React Context, Redux, or Zustand.
        Store progress and variables (flags, relationship points, etc.).

    Transitions & Animations
        Basic fade in/out for backgrounds and character sprites.
        Possibly a brief text transition or slide effect for new text lines.

    Layering
        Distinct layers for backgrounds, sprites, text box, and overlays (menus, notifications).

3.5 UI/UX & Accessibility

    Text Speed & Skipping
        Configurable text reveal speed.
        Skip button for quickly advancing through read content.

    Backlog
        Scrollable list of recent dialogues, so players can review missed lines.
        May also show speaker icons or timestamps if desired.

    Accessibility Options
        Adjustable font size or color contrast.
        Screen-reader compatibility if feasible.

    Mobile-Friendly
        Responsive layout for smaller screens, ensuring buttons remain tap-friendly.

3.6 Built-in Debug Mode & Extensions

    Dev Console / Overlay
        Enable jumping to specific scenes, toggling flags, or simulating events.
        Display log messages or errors for quick debugging.

    Plugin Architecture
        Hooks for adding custom features or mini-games without rewriting core code.

3.7 Multi-Platform Export

    Web Distribution
        Primary target for AI-driven testing (runs in a standard browser).
    Desktop Wrappers (Optional)
        Electron or similar, for Windows/macOS/Linux distribution.
    Steam Integration
        If packaging with Electron, integrate Steamworks SDK for achievements or overlay.

3.8 Steam Integration & Achievements

    Achievement Triggers
        Maintain a config mapping story events to achievements.
    Steamworks SDK
        Connect achievements after key scenes/choices.
        Possible in an Electron build or via native bindings.

4. AI-Driven Testing Workflow

    Consistent DOM Structure & Selectors
        Use data-testid or consistent classes to label the quick menu buttons (auto, skip, backlog, save, load, etc.).
        Keep the layout stable for screenshot-based AI.

    Screenshot Markers
        Display scene IDs or speaker names in a consistent location to help the AI confirm it’s in the correct place.

    Fast-Forward / Dev-Skip Mode
        Greatly accelerates text display to let the AI traverse full routes quickly.

    Error & Exception Reporting
        Clear console logs or debug overlay messages for missing assets or script references.

5. Technical Stack & Architecture

    React for UI
        Component-based approach for dialogue boxes, menus, overlays.

    State Management
        Redux, Context + Reducers, or Zustand to track game flags and route progress.

    Localization
        Utilize react-i18next or a similar library for multi-language text.
        Keep text in external JSON files (e.g., en.json, ru.json, zh.json, ja.json, ko.json).

    Data-Driven Scripting
        Scenes, dialogues, and choices in JSON or YAML.
        A manager interprets that data to render the right text and transition logic.

    Plugins & Extensions
        Expose a small API for future expansions (custom UI elements, additional scenes, minigames).

6. Implementation Plan
Phase 1: Basic Engine & CLI Tools

    Project Setup with React, bundler (Webpack/Vite), etc.
    Define JSON schema for dialogues, scenes, and branching.
    Create a minimal text display and “next” button to confirm data loading.

Phase 2: UI & Testing Integrations

    Implement the main VN UI (dialogue box, quick menu with placeholders for auto, skip, backlog, save, load, options).
    Introduce state management (Redux/Context) for flags.
    Enable AI-driven smoke tests for basic navigation.

Phase 3: Localization & Placeholder Assets

    Integrate react-i18next or similar.
    Provide placeholder images/voice references for testing, verifying they load or fall back gracefully.
    Allow runtime language switching (English, Russian, Chinese, Japanese, Korean).

Phase 4: Final Polish (Voice, Art, Achievements)

    Replace placeholders with final art and voice assets.
    Steam achievements: Hook achievements into key story events if distributing on Steam.
    Debugging & Performance: Final pass to optimize loading times, memory usage, and fix any lingering issues.

7. Appendices
7.1 Example Data Schema

{
  "scenes": [
    {
      "id": "class_intro",
      "dialogues": [
        {
          "speaker": "Nathan",
          "text": "That was a wild guess, I admit."
        }
      ],
      "choices": [
        {
          "text": "Continue",
          "nextScene": "hallway"
        }
      ]
    }
  ]
}

7.2 Example React Component Structure

src/
 ┣ components/
 ┃ ┣ DialogueBox.js
 ┃ ┣ QuickMenu.js  // auto, skip, backlog, etc.
 ┃ ┣ Backlog.js
 ┃ ┣ SaveLoadMenu.js
 ┃ ┣ OptionsMenu.js
 ┃ ┣ SceneManager.js
 ┃ ┗ DebugConsole.js
 ┣ data/
 ┃ ┣ scenes.json
 ┣ locales/
 ┃ ┣ en.json
 ┃ ┣ ru.json
 ┃ ┣ zh.json
 ┃ ┣ ja.json
 ┃ ┗ ko.json
 ┣ store/
 ┃ ┣ index.js
 ┃ ┣ actions.js
 ┃ ┗ reducers.js
 ┗ App.js

7.3 Example Directory Layout

    /components: All UI elements—dialogue windows, quick menu, backlog, etc.
    /data: Contains scene scripts and branching logic.
    /locales: Translation files.
    /store: State management (Redux, etc.).
    /assets: (Eventually) holds final images, audio, voice lines, music.

Conclusion

By integrating the standard visual novel UI elements (auto, skip, backlog, save/load, quick save/load, options, quit) as outlined above, your engine will:

    Meet player expectations for a polished, accessible visual novel.
    Ensure compatibility with AI-driven browser testing, thanks to consistent DOM structures for each button/control.
    Remain flexible for late-stage asset integration and multi-language support.
    Provide a solid foundation for optional Steam achievements or platform-specific features.