Visual Novel Engine with AI-Driven Browser Testing

(Updated Design & Specification Document, including Gallery)
Table of Contents

    Overview & Goals
    Core Requirements
    Feature Specifications
        Standard Visual Novel UI
        Save/Load & Autosave
        Branching Story Logic & Scripting
        Scene & State Management
        UI/UX & Accessibility
        Gallery / Extras Feature
        Built-in Debug Mode & Extensions
        Multi-Platform Export
        Steam Integration & Achievements
    AI-Driven Testing Workflow
    Technical Stack & Architecture
    Implementation Plan
        Phase 1: Basic Engine & CLI Tools
        Phase 2: Standard VN UI & Testing Integrations
        Phase 3: Core Features Expansion & Debug Tools
        Phase 4: Localization & Placeholder Assets
        Phase 5: Final Polish (Voice, Art, Achievements, Gallery)
        Phase 6: Launch & Post-Launch
    Appendices
        Example Data Schema
        Example React Component Structure
        Example Directory Layout

1. Overview & Goals

This document outlines the design, features, and requirements of a React/JavaScript-based Visual Novel Engine that:

    Runs in the browser for AI-driven testing (AI agents that parse screenshots and click UI elements).
    Supports late-stage art and voice integration (placeholder-friendly).
    Offers multi-language support (English, Russian, Chinese, Japanese, Korean).
    Includes standard visual novel UI elements (auto, skip, backlog, quick save/load).
    Integrates Steam achievements near the end of development.
    Adds a Gallery (CG/Extras) feature, unlocking special images or other content.

2. Core Requirements

    Cross-Browser Compatibility & AI Testing
        The engine must be stable across major browsers (Chrome, Firefox, Edge) and maintain consistent DOM structures for AI-driven testing.

    Modular, Data-Driven Architecture
        Keep narrative content in structured data (e.g., JSON).
        Minimize rewriting of logic when adding or changing assets.

    Placeholder-Friendly Asset Loading
        The game should run with missing art or audio, substituting placeholders to avoid broken flows.
        Only integrate final assets late in development.

    Localization
        External text files (JSON or similar) for multi-language support.
        Runtime language switching is recommended.

    Standard Visual Novel UI
        Familiar UI elements: text box, speaker name, quick menu (auto, skip, backlog, save, load, options, quit).

    Steam Achievements
        Plan achievements linked to story events or flags.
        Late-stage integration with Steamworks (if distributing via Steam).

    Gallery / Extras
        An in-engine menu or “Extras” screen showing unlocked images (CG), music, or special content.
        Unlock logic tied to story events or flags.

3. Feature Specifications
3.1 Standard Visual Novel UI

    Dialogue Window & Speaker Name
        Text box at screen bottom, speaker name display.
    Character Sprites & Backgrounds
        Sprites in the foreground; backgrounds for scene context.
    Quick Menu
        Auto: Automated text progression.
        Skip: Fast-forward dialogue (especially for previously read content).
        Backlog: Scrollable dialog history.
        Save/Load/Q.Save/Q.Load: Manual saves, quick saves, etc.
        Options: Volume, text speed, language switch, etc.
        Quit: Exit or return to main menu.

3.2 Save/Load & Autosave

    Manual Save
        UI button or menu to save current scene, flags, line index.
    Autosave
        Trigger on key events (scene changes, major choices).
    Quick Save/Load
        Single-click slot for fast saving/loading progress.

3.3 Branching Story Logic & Scripting

    Choice Management
        JSON-defined choices lead to different scenes or outcomes.
    Flags & Variables
        Track progress, relationship points, item possession, etc.
    Conditional Text & Scenes
        Show or skip lines/scenes depending on flags.

3.4 Scene & State Management

    Global State
        Redux, Context, or Zustand to store flags and user progress.
    Transitions & Animations
        Simple fade or slide transitions for scene changes.
    Layering
        Manage backgrounds, character sprites, and UI overlays separately.

3.5 UI/UX & Accessibility

    Text Speed & Skipping
        Let the user control text reveal speed.
    Backlog
        Show recent lines and speakers, possibly re-voicing them (optional).
    Accessibility
        Adjustable font size, high-contrast mode, screen-reader friendly (if feasible).
    Mobile-Friendly
        Responsive layout for smaller screens.

3.6 Gallery / Extras Feature

    Purpose
        Allows players to revisit unlocked CG images, event artwork, or music.
    Unlock Logic
        Each CG or special artwork is linked to a specific story event or flag.
        Once the player encounters/unlocks it, it becomes available in the Gallery.
    UI & Navigation
        A main menu or in-game “Extras” section.
        Display thumbnails for unlocked items; locked ones show a placeholder or silhouette.
        Clicking a thumbnail opens a full-size view or plays a music track.
    Data Structure
        A separate JSON (e.g., gallery.json) linking CG IDs to unlock flags:

        {
          "galleryItems": [
            {
              "id": "cg1",
              "name": "Sunset Overlook",
              "imagePath": "/assets/cg/sunset.png",
              "unlockFlag": "sawSunsetScene"
            }
          ]
        }

    Save/Load Integration
        Gallery unlocks persist in global flags or a dedicated gallery state.
        Remains unlocked even if the player loads a previous save.

3.7 Built-in Debug Mode & Extensions

    Dev Console / Overlay
        Jump to scenes, set flags, view logs for debugging.
    Plugin Architecture
        Expose hooks for custom modules or future expansions without rewriting core files.

3.8 Multi-Platform Export

    Web Distribution
        Primary build for easy user/AI testing in browsers.
    Desktop Wrappers
        Electron or similar for Windows/macOS/Linux.
    Mobile Wrappers (Optional)
        Capacitor, Cordova, or React Native for mobile apps.

3.9 Steam Integration & Achievements

    Achievement Triggers
        Map story events or flags to Steam achievements.
    Steamworks SDK
        Integrate once near completion.
        Show achievement pop-ups (in-game or Steam Overlay).

4. AI-Driven Testing Workflow

    Consistent DOM Structure
        Use stable classes/IDs for UI elements (auto, skip, backlog, save, load, etc.).
    Screenshot-Based Validation
        Display scene IDs or speaker names in consistent locations.
        Keep layout stable so the AI can parse screenshot differences.
    Fast-Forward / Dev-Skip Mode
        Greatly expedite text progression, letting the AI test multiple branches quickly.
    Error & Exception Handling
        Show missing assets or script references in a debug overlay or console log.

5. Technical Stack & Architecture

    React
        Component-based UI for dialogue, menus, overlays.
    State Management
        Redux, Context + Reducers, or Zustand for flags and progress.
    Localization
        react-i18next or a similar library for easy multi-language text swapping.
    Data-Driven Scripting
        Scenes and branching stored in JSON.
        A parser/manager interprets the current state, loads dialogue, and transitions accordingly.
    Gallery Data
        A separate JSON or combined with story data, indicating CG unlock conditions.
    Plugin/Extension API
        Hooks for custom code or mini-games, if needed.

6. Implementation Plan
Phase 1: Basic Engine & CLI Tools

    Project Setup: Initialize React project, bundler config, Git repository.
    Data Structures: Define JSON schema for dialogues/choices.
    Minimal Scene Navigation: Basic <DialogueBox> and “next” button for a test scene.

Deliverables

    Base project folder structure
    A sample scenes.json
    Minimal UI to display and advance text

Phase 2: Standard VN UI & Testing Integrations

    Dialogue Box & Quick Menu: Add standard buttons (auto, skip, backlog, save/load, options, quit).
    Branching & State: Implement choice-based navigation and a global store for flags.
    Skeleton Save/Load: Outline how game state is saved/loaded (local storage or memory).
    AI-Friendly Markup: Add data-testid attributes for each UI element.

Deliverables

    Proper dialogue window with speaker name
    Quick menu bar (auto, skip, backlog, etc.)
    Basic branching (choices lead to different scenes)
    DOM consistency for AI testing

Phase 3: Core Features Expansion & Debug Tools

    Full Save/Load: Multi-slot saves, autosave triggers, confirm load overwrites.
    Backlog/History: Modal or panel showing recent text lines.
    Debug/Dev Console: Jump to scenes, set flags, view logs.
    Scene Transitions: Fades or slides for scene/sprite changes.

Deliverables

    Fully functional save/load system
    Backlog with scrollable text history
    Developer overlay for QA
    Basic animations for UI/scene transitions

Phase 4: Localization & Placeholder Assets

    Localization: Integrate react-i18next (or similar) with external locale files (en.json, ru.json, etc.).
    Runtime Language Switching: A dropdown or menu option to switch languages mid-game.
    Placeholder Handling: Confirm that missing images/audio use default placeholders.
    Refine AI-Testing Hooks: Ensure stable DOM for multi-language tests.

Deliverables

    Multi-language UI & dialogue with live switching
    Robust placeholder logic for images and audio
    Polished AI-friendly environment with stable selectors

Phase 5: Final Polish (Voice, Art, Achievements, Gallery)

    Asset Integration: Replace placeholders with final backgrounds, sprites, CGs, music, voice lines.
    Steam Achievements (Optional):
        Integrate Steamworks in Electron or native wrapper.
        Map flags/events to achievements, show pop-ups.
    Gallery / Extras Menu:
        Add main menu or in-game menu for CG Gallery.
        Implement unlock logic (flags) for each CG/music track.
        Display locked/unlocked states.
    Advanced AI/QA Testing:
        Ensure the AI can systematically unlock and check items in the Gallery.
        Validate all achievements trigger correctly.

Deliverables

    Complete visual and audio assets integrated
    Steam achievements (if distributing on Steam)
    Functional CG Gallery with locked/unlocked states
    Thorough AI testing coverage on final content

Phase 6: Launch & Post-Launch

    Production Build: Optimize, minify, and bundle for web or Electron.
    Final QA & Bug Fixes: Last pass for narrative consistency and technical stability.
    Release & Post-Launch Support:
        Deploy to web or Steam.
        Address any post-launch bugs or feedback.
        Plan expansions or DLC (if relevant).

Deliverables

    Official release candidate build
    Documentation on how to add new content, localize more languages, or patch bugs
    Post-launch roadmap or DLC plan (if any)

7. Appendices
7.1 Example Data Schema

{
  "scenes": [
    {
      "id": "prologue",
      "dialogues": [
        {
          "speaker": "Narrator",
          "text": "A new day dawns..."
        }
      ],
      "choices": [
        {
          "text": "Open your eyes",
          "nextScene": "intro_scene"
        }
      ]
    }
  ]
}

{
  "galleryItems": [
    {
      "id": "cg1",
      "name": "Sunset Overlook",
      "imagePath": "/assets/cg/sunset.png",
      "unlockFlag": "sawSunsetScene"
    }
  ]
}

7.2 Example React Component Structure

src/
 ┣ components/
 ┃ ┣ DialogueBox.js
 ┃ ┣ QuickMenu.js        // auto, skip, backlog, etc.
 ┃ ┣ Backlog.js
 ┃ ┣ SaveLoadMenu.js
 ┃ ┣ OptionsMenu.js
 ┃ ┣ Gallery.js          // For viewing CGs
 ┃ ┣ SceneManager.js
 ┃ ┗ DebugConsole.js
 ┣ data/
 ┃ ┣ scenes.json
 ┃ ┗ gallery.json
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

    /components: All UI elements (dialogue windows, quick menu, backlog, gallery, debug tools).
    /data: Scene scripts (scenes.json), plus gallery.json for CG references.
    /locales: Translation files for each supported language.
    /store: State management code.
    /assets: Placeholder or final images, audio, music.

Conclusion

This updated design document ensures your React-based Visual Novel Engine:

    Implements a familiar VN UI (auto, skip, backlog, etc.) right from the early phases.
    Supports multi-language content with placeholders for late-stage art or audio.
    Includes a Gallery/Extras feature so players can unlock and revisit CG images (and potentially music) they’ve discovered.
    Facilitates AI-driven browser testing by providing stable, labeled UI elements and consistent layouts.
    Lays groundwork for optional Steam achievements and multi-platform builds (web, desktop, mobile).

By following the phased Implementation Plan, you’ll deliver a robust, testable, and expandable visual novel engine with all the classic features that players expect—from the opening lines of dialogue to the final CG unlock in the Gallery.