# Testing Guide

## Overview

The Visual Novel Engine is designed for AI-driven browser testing, with consistent DOM structures and comprehensive test selectors. This guide covers testing setup, common scenarios, and best practices.

## AI-Driven Testing Setup

### DOM Structure
The engine maintains a consistent DOM structure with stable selectors for AI testing:

```html
<div data-testid="dialogue-box">
  <div data-testid="speaker">...</div>
  <div data-testid="dialogue-text">...</div>
  <div data-testid="quick-menu">...</div>
  <!-- Additional elements -->
</div>
```

### Key Test Selectors

#### Core Elements
- `dialogue-box`: Main dialogue container
- `speaker`: Character name display
- `dialogue-text`: Current dialogue text
- `quick-menu`: Quick access menu buttons

#### Navigation
- `next-button`: Advance dialogue
- `choice-{index}`: Choice buttons (e.g., choice-0, choice-1)

#### Quick Menu
- `auto-button`: Toggle auto-advance
- `skip-button`: Toggle skip mode
- `backlog-button`: Open dialogue history
- `save-button`: Open save menu
- `options-button`: Open options menu
- `quit-button`: Open quit confirmation

#### Save/Load System
- `save-overlay`: Save/load menu
- `save-slot-{id}`: Individual save slots (1-20)
- `save-description`: Save description input
- `create-save`: Save button
- `load-save-{id}`: Load save button
- `delete-save-{id}`: Delete save button
- `load-auto-save`: Load auto-save button

#### Backlog
- `backlog-overlay`: History viewer
- `scene-{id}`: Scene markers in history
- `jump-to-{timestamp}`: Jump to specific dialogue

#### Debug Console
Debug console is accessed with the tilde key (~)
- `debug-console`: Debug overlay
- `scene-jump`: Scene navigation
- `flag-manager`: Game flag controls

## Common Testing Scenarios

### 1. Basic Navigation
```typescript
// Advance dialogue
click('[data-testid="next-button"]');

// Make a choice
click('[data-testid="choice-0"]');
```

### 2. Save/Load Testing
```typescript
// Open save menu
click('[data-testid="save-button"]');

// Create new save
click('[data-testid="select-slot-1"]');
type('[data-testid="save-description"]', 'Test save');
click('[data-testid="create-save"]');

// Load save
click('[data-testid="load-save-1"]');
```

### 3. Quick Menu Features
```typescript
// Toggle auto mode
click('[data-testid="auto-button"]');

// Open backlog
click('[data-testid="backlog-button"]');

// Jump to previous dialogue
click('[data-testid="jump-to-{timestamp}"]');
```

### 4. Debug Operations
```typescript
// Open debug console (press tilde key)
pressKey('`');

// Jump to specific scene
type('[data-testid="scene-input"]', 'scene-id');
click('[data-testid="jump-button"]');
```

## Best Practices

### 1. State Verification
- Check speaker name and dialogue text after each action
- Verify correct scene transitions
- Confirm save/load operations maintain state
```typescript
expect('[data-testid="speaker"]').toHaveText('Character Name');
expect('[data-testid="dialogue-text"]').toHaveText('Expected dialogue');
```

### 2. UI State Management
- Verify overlay states (open/closed)
- Check button states (enabled/disabled)
- Confirm transitions complete before proceeding
```typescript
expect('[data-testid="save-overlay"]').toBeVisible();
expect('[data-testid="next-button"]').toBeEnabled();
```

### 3. Error Handling
- Test invalid scene jumps
- Verify corrupted save handling
- Check boundary conditions
```typescript
// Example: Try loading non-existent save
click('[data-testid="load-save-999"]');
expect('[data-testid="error-message"]').toBeVisible();
```

### 4. Performance Considerations
- Monitor frame rate during transitions
- Check memory usage with large save files
- Verify smooth auto-advance behavior

## Test Coverage Areas

1. **Core Navigation**
   - Linear dialogue progression
   - Choice-based branching
   - Scene transitions

2. **Save System**
   - Manual saves
   - Auto-saves
   - Save loading
   - Save deletion

3. **History Features**
   - Backlog viewing
   - Scene markers
   - Jump functionality

4. **Quick Menu**
   - Auto mode
   - Skip mode
   - Options menu
   - Quit functionality

5. **Debug Features**
   - Scene jumping
   - Flag manipulation
   - State inspection

## Adding New Tests

When adding new features:

1. Include appropriate data-testid attributes
2. Maintain consistent DOM structure
3. Document new selectors
4. Add test scenarios
5. Verify AI compatibility

## Common Issues and Solutions

1. **Inconsistent Selectors**
   - Always use data-testid for test hooks
   - Follow naming convention: feature-action

2. **Timing Issues**
   - Wait for animations to complete
   - Check for element visibility
   - Use appropriate delays for auto-advance

3. **State Management**
   - Verify global state after operations
   - Check persistence of changes
   - Validate flag updates

4. **Resource Loading**
   - Handle missing assets gracefully
   - Verify placeholder functionality
   - Check error states

## Future Testing Considerations

1. **Localization Testing**
   - Verify text rendering in all supported languages
   - Check UI layout with different text lengths
   - Validate character encoding

2. **Asset Integration**
   - Test with placeholder and final assets
   - Verify loading states
   - Check transition effects

3. **Performance Optimization**
   - Monitor memory usage
   - Track frame rates
   - Optimize asset loading

4. **Accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - High contrast support
