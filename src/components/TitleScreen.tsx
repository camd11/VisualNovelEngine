import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { languageService, Language } from '../services/languageService';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  onStartGame: () => void;
}

export function TitleScreen({ onStartGame }: TitleScreenProps) {
  const { t } = useTranslation(['common', 'menu']);
  const [isStarting, setIsStarting] = useState(false);
  const { settings } = useGameStore();

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(onStartGame, 500); // Small delay for transition
  };

  const handleLanguageChange = async (language: Language) => {
    try {
      await languageService.changeLanguage(language);
      // Force reload to ensure all components update
      window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className={`${styles.titleScreen} ${isStarting ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('common:title')}</h1>
        <div className={styles.menu}>
          <button
            onClick={handleStart}
            className={styles.menuButton}
            data-testid="start-button"
          >
            {t('menu:title_screen.start')}
          </button>
          <button
            className={styles.menuButton}
            data-testid="continue-button"
            disabled
          >
            {t('menu:title_screen.continue')}
          </button>
          <button
            className={styles.menuButton}
            data-testid="extras-button"
            disabled
          >
            {t('menu:title_screen.gallery')}
          </button>
        </div>
        <div className={styles.languageButtons}>
          <button
            onClick={() => handleLanguageChange('en')}
            className={`${styles.languageButton} ${settings.language === 'en' ? styles.active : ''}`}
            data-testid="lang-en"
          >
            {t('menu:options.languages.en')}
          </button>
          <button
            onClick={() => handleLanguageChange('ru')}
            className={`${styles.languageButton} ${settings.language === 'ru' ? styles.active : ''}`}
            data-testid="lang-ru"
          >
            {t('menu:options.languages.ru')}
          </button>
          <button
            onClick={() => handleLanguageChange('zh')}
            className={`${styles.languageButton} ${settings.language === 'zh' ? styles.active : ''}`}
            data-testid="lang-zh"
          >
            {t('menu:options.languages.zh')}
          </button>
          <button
            onClick={() => handleLanguageChange('ja')}
            className={`${styles.languageButton} ${settings.language === 'ja' ? styles.active : ''}`}
            data-testid="lang-ja"
          >
            {t('menu:options.languages.ja')}
          </button>
          <button
            onClick={() => handleLanguageChange('ko')}
            className={`${styles.languageButton} ${settings.language === 'ko' ? styles.active : ''}`}
            data-testid="lang-ko"
          >
            {t('menu:options.languages.ko')}
          </button>
        </div>
        <div className={styles.version}>v0.1.0</div>
      </div>
    </div>
  );
}
