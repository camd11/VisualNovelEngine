import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { useGameStore } from '../store/gameStore';

export type Language = 'en' | 'ru' | 'zh' | 'ja' | 'ko';

// Initialize i18next
i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    supportedLngs: ['en', 'ru', 'zh', 'ja', 'ko'],
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    defaultNS: 'common',
    ns: ['common', 'menu', 'dialogue']
  });

// Language service class
class LanguageService {
  private static instance: LanguageService;
  private currentLanguage: Language;

  private constructor() {
    // Get initial language from game settings
    const settings = useGameStore.getState().settings;
    this.currentLanguage = settings.language;
    
    // Initialize i18next with the current language
    i18next.changeLanguage(this.currentLanguage);
  }

  public static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService();
    }
    return LanguageService.instance;
  }

  public async changeLanguage(language: Language): Promise<void> {
    try {
      // Update game settings
      useGameStore.getState().updateSettings({ language });
      
      // Update i18next
      await i18next.changeLanguage(language);
      
      // Update current language
      this.currentLanguage = language;
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    }
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }
}

// Export singleton instance
export const languageService = LanguageService.getInstance();

// Export i18next instance
export default i18next;
