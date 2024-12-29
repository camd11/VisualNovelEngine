import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogueBox } from './components/DialogueBox';
import { TitleScreen } from './components/TitleScreen';
import { useGameStore } from './store/gameStore';
import scenesData from './data/scenes.json';
import './App.css';

type GameState = 'title' | 'game';

interface Scene {
  id: string;
  dialogues: Array<{
    speaker: string;
    text: string;
  }>;
  choices: Array<{
    text: string;
    nextScene: string;
  }>;
}

function App() {
  const { t } = useTranslation(['common', 'menu']);
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentSceneId, setCurrentSceneId] = useState<string>('prologue');
  
  const currentScene = scenesData.scenes.find(
    (scene: Scene) => scene.id === currentSceneId
  );

  if (!currentScene) {
    return <div data-testid="error-state">{t('common:error.scene_not_found')}</div>;
  }

  const handleSceneChange = (nextSceneId: string) => {
    setCurrentSceneId(nextSceneId);
  };

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleQuit = () => {
    setGameState('title');
    setCurrentSceneId('prologue');
  };

  return (
    <div className="game-container" data-testid="game-container">
      {gameState === 'title' ? (
        <TitleScreen onStartGame={handleStartGame} />
      ) : (
        <DialogueBox 
          scene={currentScene} 
          onSceneChange={handleSceneChange}
          onQuit={handleQuit}
        />
      )}
    </div>
  );
}

export default App;
