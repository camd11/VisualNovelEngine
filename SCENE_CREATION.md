# Scene Creation Guide

## Overview
This guide explains how to create scenes for the Visual Novel Engine. Scenes are defined in JSON format and stored in `src/data/scenes.json`.

## Scene Structure
Each scene follows this structure:
```json
{
  "id": "unique_scene_id",
  "dialogues": [
    {
      "speaker": "Character Name",
      "text": "The dialogue text goes here."
    }
  ],
  "choices": [
    {
      "text": "Choice button text",
      "nextScene": "target_scene_id"
    }
  ]
}
```

## Required Fields

### Scene Level
- `id` (string): Unique identifier for the scene
- `dialogues` (array): List of dialogue entries
- `choices` (array): List of choices (can be empty for linear scenes)

### Dialogue Level
- `speaker` (string): Name of the character speaking
- `text` (string): The actual dialogue text

### Choice Level
- `text` (string): Text shown on the choice button
- `nextScene` (string): ID of the scene to transition to when this choice is selected

## Example Scene
```json
{
  "scenes": [
    {
      "id": "start",
      "dialogues": [
        {
          "speaker": "Narrator",
          "text": "It was a dark and stormy night..."
        },
        {
          "speaker": "???",
          "text": "Hello? Is anyone there?"
        }
      ],
      "choices": [
        {
          "text": "Call out",
          "nextScene": "respond_scene"
        },
        {
          "text": "Stay quiet",
          "nextScene": "hide_scene"
        }
      ]
    }
  ]
}
```

## Best Practices

1. Scene IDs
   - Use descriptive, lowercase names with underscores
   - Example: `beach_intro`, `cafe_meeting`, `final_choice`

2. Dialogue
   - Keep text concise and clear
   - Use "???" for unknown speakers
   - Use "Narrator" for narrative text

3. Choices
   - Make choices meaningful and distinct
   - Ensure all scene IDs referenced in `nextScene` exist
   - Empty choices array `[]` for linear scenes

4. Testing
   - Test all branching paths
   - Verify scene transitions
   - Check for typos in scene IDs

## Adding New Scenes

1. Open `src/data/scenes.json`
2. Add your new scene to the `scenes` array
3. Ensure it follows the structure above
4. Test all paths leading to and from the new scene

## Common Issues

1. Missing Scene ID
   ```json
   // Wrong
   {
     "dialogues": [], // Missing id field
     "choices": []
   }

   // Correct
   {
     "id": "scene_name",
     "dialogues": [],
     "choices": []
   }
   ```

2. Invalid Choice Reference
   ```json
   // Wrong
   {
     "choices": [
       {
         "text": "Go forward",
         "nextScene": "non_existent_scene" // Scene doesn't exist
       }
     ]
   }

   // Correct
   {
     "choices": [
       {
         "text": "Go forward",
         "nextScene": "existing_scene_id" // Make sure this scene exists
       }
     ]
   }
   ```

3. Empty Dialogue Array
   ```json
   // Wrong
   {
     "id": "scene_name",
     "dialogues": [], // Must have at least one dialogue entry
     "choices": []
   }

   // Correct
   {
     "id": "scene_name",
     "dialogues": [
       {
         "speaker": "Narrator",
         "text": "Scene description or dialogue"
       }
     ],
     "choices": []
   }
