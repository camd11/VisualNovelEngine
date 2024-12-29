import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import styles from './DebugConsole.module.css';

interface DebugConsoleProps {
  onClose: () => void;
  onJumpToScene: (sceneId: string) => void;
}

export function DebugConsole({ onClose, onJumpToScene }: DebugConsoleProps) {
  const gameStore = useGameStore();
  const [newFlag, setNewFlag] = useState('');
  const [newValue, setNewValue] = useState('');
  const [sceneId, setSceneId] = useState('');

  const handleSetFlag = () => {
    if (newFlag) {
      // Try to parse as number or boolean first
      let value: string | number | boolean = newValue;
      if (value.toLowerCase() === 'true') value = true;
      else if (value.toLowerCase() === 'false') value = false;
      else if (!isNaN(Number(value))) value = Number(value);
      
      gameStore.setFlag(newFlag, value);
      setNewFlag('');
      setNewValue('');
    }
  };

  const handleJumpToScene = () => {
    if (sceneId) {
      onJumpToScene(sceneId);
      setSceneId('');
    }
  };

  const handleDeleteFlag = (key: string) => {
    gameStore.setFlag(key, undefined);
  };

  return (
    <div className={styles.debugOverlay} data-testid="debug-console">
      <div className={styles.debugContent}>
        <div className={styles.debugHeader}>
          <h2>Debug Console</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            data-testid="close-debug"
          >
            Close
          </button>
        </div>

        <div className={styles.debugSection}>
          <h3>Scene Control</h3>
          <div className={styles.debugRow}>
            <input
              type="text"
              value={sceneId}
              onChange={(e) => setSceneId(e.target.value)}
              placeholder="Scene ID"
              className={styles.debugInput}
              data-testid="scene-input"
            />
            <button
              onClick={handleJumpToScene}
              className={styles.debugButton}
              data-testid="jump-button"
            >
              Jump to Scene
            </button>
          </div>
        </div>

        <div className={styles.debugSection}>
          <h3>Flag Management</h3>
          <div className={styles.debugRow}>
            <input
              type="text"
              value={newFlag}
              onChange={(e) => setNewFlag(e.target.value)}
              placeholder="Flag name"
              className={styles.debugInput}
              data-testid="flag-name-input"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value"
              className={styles.debugInput}
              data-testid="flag-value-input"
            />
            <button
              onClick={handleSetFlag}
              className={styles.debugButton}
              data-testid="set-flag-button"
            >
              Set Flag
            </button>
          </div>
        </div>

        <div className={styles.debugSection}>
          <h3>Current State</h3>
          <div className={styles.stateInfo}>
            <div className={styles.stateSection}>
              <h4>Current Scene</h4>
              <div className={styles.stateValue} data-testid="current-scene">
                {gameStore.sceneState.currentSceneId}
              </div>
            </div>

            <div className={styles.stateSection}>
              <h4>Dialogue Index</h4>
              <div className={styles.stateValue} data-testid="dialogue-index">
                {gameStore.sceneState.dialogueIndex}
              </div>
            </div>

            <div className={styles.stateSection}>
              <h4>Active Flags</h4>
              <div className={styles.flagList}>
                {Object.entries(gameStore.flags).map(([key, value]) => (
                  <div key={key} className={styles.flagEntry}>
                    <span className={styles.flagName}>{key}:</span>
                    <span className={styles.flagValue}>
                      {JSON.stringify(value)}
                    </span>
                    <button
                      onClick={() => handleDeleteFlag(key)}
                      className={styles.deleteFlag}
                      data-testid={`delete-flag-${key}`}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
