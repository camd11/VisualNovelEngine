# Language System Documentation

## Overview
The Visual Novel Engine uses a singleton language service to manage internationalization (i18n) across the application. The system supports multiple languages (English, Russian, Chinese, Japanese, Korean) and persists language preferences between sessions.

## Architecture

### Language Service (`src/services/languageService.ts`)
- Singleton pattern ensures consistent state management
- Handles i18n initialization and configuration
- Manages language changes
- Syncs with game settings
- Provides type-safe language operations

```typescript
// Example usage
import { languageService, Language } from '../services/languageService';

// Change language
await languageService.changeLanguage('ja');

// Get current language
const currentLang = languageService.getCurrentLanguage();
```

### Translation Files
Located in `public/locales/{language_code}/{namespace}.json`

Supported languages:
- English (en)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)

Namespaces:
- common: General UI strings
- menu: Menu-related strings
- dialogue: In-game dialogue strings

Example structure:
```
public/locales/
├── en/
│   ├── common.json
│   ├── menu.json
│   └── dialogue.json
├── ru/
│   ├── common.json
│   ├── menu.json
│   └── dialogue.json
...
```

## Implementation Details

### Language Selection UI (`src/components/TitleScreen.tsx`)
- Button-based language selection interface
- Visual feedback for active language
- Automatic persistence of language preference

### Integration with Game Settings
The language service automatically syncs with the game's settings store:
```typescript
// Language change automatically updates game settings
updateSettings({ language: newLang });
```

## Adding New Languages

1. Create translation files:
   ```
   public/locales/new_lang/
   ├── common.json
   ├── menu.json
   └── dialogue.json
   ```

2. Add language to supported languages list in `languageService.ts`:
   ```typescript
   export type Language = 'en' | 'ru' | 'zh' | 'ja' | 'ko' | 'new_lang';
   ```

3. Add language button to `TitleScreen.tsx`

## Best Practices

1. Always use translation keys:
   ```typescript
   // Good
   {t('common:title')}
   
   // Bad
   <div>Hard-coded text</div>
   ```

2. Use namespaces to organize translations:
   ```typescript
   const { t } = useTranslation(['common', 'menu']);
   ```

3. Handle loading states:
   ```typescript
   const { t, ready } = useTranslation();
   if (!ready) return <LoadingSpinner />;
   ```

## Testing Language Changes

1. Language switching should:
   - Update UI text immediately
   - Persist through page reloads
   - Update game settings
   - Highlight the active language button

2. Test all supported languages in sequence:
   ```typescript
   // Test sequence
   ['en', 'ru', 'zh', 'ja', 'ko'].forEach(async (lang) => {
     await languageService.changeLanguage(lang);
     // Verify translations
   });
   ```

## Troubleshooting

1. Missing translations:
   - Check if translation key exists in all language files
   - Verify namespace is correctly imported
   - Check for typos in translation keys

2. Language not persisting:
   - Verify localStorage is available
   - Check game settings store updates
   - Ensure language code is supported

3. UI not updating:
   - Verify i18next is properly initialized
   - Check component re-rendering on language change
   - Confirm translation files are being loaded
