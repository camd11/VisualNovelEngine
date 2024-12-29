/** @jsxImportSource @emotion/react */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { DebugConsole } from './DebugConsole';
import { useInterval } from '../hooks/useInterval';
import { 
  StyledDialogueBox,
  StyledBacklog,
  StyledBacklogClose,
  StyledSave,
  StyledSaveClose,
  StyledOptions,
  StyledOptionsClose,
  StyledQuit,
  StyledQuitClose,
  DURATION,
  EASING 
} from '../utils/transitions';
import styles from './DialogueBox.module.css';

interface Dialogue {
  speaker: string;
  text: string;
}

interface Choice {
  text: string;
  nextScene: string;
}

interface Scene {
  id: string;
  dialogues: Dialogue[];
  choices: Choice[];
}


interface DialogueBoxProps {
  scene: Scene;
  onSceneChange: (sceneId: string) => void;
  onQuit: () => void;
  autoAdvanceDelay?: number; // Time in milliseconds between auto-advances
}

export function DialogueBox({ scene, onSceneChange, onQuit, autoAdvanceDelay = 3000 }: DialogueBoxProps) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isSkipMode, setIsSkipMode] = useState(false);
  const [overlayStates, setOverlayStates] = useState({
    backlog: { isOpen: false, state: 'entering' as const },
    save: { isOpen: false, state: 'entering' as const },
    options: { isOpen: false, state: 'entering' as const },
    quit: { isOpen: false, state: 'entering' as const }
  });
  const [dialogueHistory, setDialogueHistory] = useState<Dialogue[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Derived state
  const isBacklogOpen = overlayStates.backlog.isOpen;
  const isSaveMenuOpen = overlayStates.save.isOpen;
  const isOptionsMenuOpen = overlayStates.options.isOpen;
  const isQuitConfirmOpen = overlayStates.quit.isOpen;
  const gameStore = useGameStore();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [saveDescription, setSaveDescription] = useState('');
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const currentDialogue = scene.dialogues[currentDialogueIndex];
  const isLastDialogue = currentDialogueIndex === scene.dialogues.length - 1;
  const hasChoices = scene.choices.length > 0;

  const handleNext = useCallback(() => {
    if (currentDialogueIndex < scene.dialogues.length - 1) {
      gameStore.addToHistory({
        speaker: currentDialogue.speaker,
        text: currentDialogue.text,
        sceneId: scene.id,
        index: currentDialogueIndex
      });
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    }
  }, [currentDialogue, currentDialogueIndex, scene.dialogues.length, scene.id, gameStore]);

  // Animation helpers
  const handleOverlayClose = async (overlay: keyof typeof overlayStates) => {
    setOverlayStates(prev => ({
      ...prev,
      [overlay]: { ...prev[overlay], state: 'exiting' }
    }));

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, DURATION.NORMAL));

    setOverlayStates(prev => ({
      ...prev,
      [overlay]: { isOpen: false, state: 'entering' }
    }));
  };

  const handleOverlayOpen = (overlay: keyof typeof overlayStates) => {
    // Close all other overlays
    setOverlayStates(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => {
        if (key !== overlay) {
          newState[key as keyof typeof overlayStates] = { isOpen: false, state: 'entering' };
        }
      });
      return {
        ...newState,
        [overlay]: { isOpen: true, state: 'entering' }
      };
    });
    
    // Disable auto/skip modes
    setIsAutoMode(false);
    setIsSkipMode(false);
  };

  const toggleBacklog = () => {
    if (isBacklogOpen) {
      handleOverlayClose('backlog');
    } else {
      handleOverlayOpen('backlog');
    }
  };

  const toggleSaveMenu = () => {
    if (isSaveMenuOpen) {
      handleOverlayClose('save');
    } else {
      handleOverlayOpen('save');
    }
  };

  const toggleOptionsMenu = () => {
    if (isOptionsMenuOpen) {
      handleOverlayClose('options');
    } else {
      handleOverlayOpen('options');
    }
  };

  const handleQuitClick = () => {
    handleOverlayOpen('quit');
  };

  const handleQuitCancel = () => {
    handleOverlayClose('quit');
  };

  const handleQuitConfirm = () => {
    handleOverlayClose('quit').then(() => {
      onQuit();
    });
  };

  // Auto-save on scene changes and choices
  useEffect(() => {
    gameStore.createAutoSave();
  }, [scene.id]);

  const handleSave = () => {
    if (selectedSlot !== null) {
      gameStore.createSave(selectedSlot, saveDescription || undefined);
      setSelectedSlot(null);
      setSaveDescription('');
    }
  };

  const handleLoad = (slotId: number) => {
    const saveSlot = gameStore.saveSlots.find(slot => slot.id === slotId);
    if (saveSlot) {
      handleOverlayClose('save').then(() => {
        gameStore.loadSave(slotId);
        onSceneChange(saveSlot.sceneState.currentSceneId);
        setCurrentDialogueIndex(saveSlot.sceneState.dialogueIndex);
        setDialogueHistory(saveSlot.sceneState.dialogueHistory);
      });
    }
  };

  const handleDelete = (slotId: number) => {
    gameStore.deleteSave(slotId);
    if (selectedSlot === slotId) {
      setSelectedSlot(null);
      setSaveDescription('');
    }
  };

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
    setSaveDescription('');
    if (descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  };

  // Auto-advance effect
  useEffect(() => {
    let lastTime = 0;
    let rafId: number | null = null;
    let delay = isSkipMode ? 300 : autoAdvanceDelay;

    const advance = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      
      const elapsed = timestamp - lastTime;
      
      if (elapsed >= delay) {
        if (!isLastDialogue && !hasChoices) {
          handleNext();
          lastTime = timestamp;
        }
      }

      if ((isAutoMode || isSkipMode) && !isLastDialogue && !hasChoices) {
        rafId = requestAnimationFrame(advance);
      }
    };

    if (isAutoMode || isSkipMode) {
      if (!isLastDialogue && !hasChoices) {
        handleNext(); // Initial advance
        rafId = requestAnimationFrame(advance);
      }
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [isAutoMode, isSkipMode, isLastDialogue, hasChoices, handleNext, autoAdvanceDelay]);

  // Disable auto/skip mode when reaching choices
  useEffect(() => {
    if (isLastDialogue && hasChoices) {
      setIsAutoMode(false);
      setIsSkipMode(false);
    }
  }, [isLastDialogue, hasChoices]);

  // Debug console keyboard shortcut (tilde key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsDebugOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleAutoMode = useCallback(() => {
    const newAutoMode = !isAutoMode;
    setIsAutoMode(newAutoMode);
    if (newAutoMode) {
      setIsSkipMode(false);
      handleNext();
    }
  }, [isAutoMode, handleNext]);

  const toggleSkipMode = useCallback(() => {
    const newSkipMode = !isSkipMode;
    setIsSkipMode(newSkipMode);
    if (newSkipMode) {
      setIsAutoMode(false);
      handleNext();
    }
  }, [isSkipMode, handleNext]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const dialogueBoxRef = useRef<HTMLDivElement>(null);

  const handleChoice = async (nextScene: string) => {
    if (dialogueBoxRef.current) {
      setIsTransitioning(true);
      
      // Add exit transition class
      dialogueBoxRef.current.classList.add('transitioning-exit');
      dialogueBoxRef.current.classList.add('transitioning-exit-active');
      
      // Wait for transition
      await new Promise(resolve => setTimeout(resolve, DURATION.NORMAL));
      
      // Change scene
      setCurrentDialogueIndex(0);
      onSceneChange(nextScene);
      
      // Remove exit classes and add enter classes
      dialogueBoxRef.current.classList.remove('transitioning-exit');
      dialogueBoxRef.current.classList.remove('transitioning-exit-active');
      dialogueBoxRef.current.classList.add('transitioning-enter');
      dialogueBoxRef.current.classList.add('transitioning-enter-active');
      
      // Wait for enter transition
      await new Promise(resolve => setTimeout(resolve, DURATION.NORMAL));
      
      // Cleanup
      dialogueBoxRef.current.classList.remove('transitioning-enter');
      dialogueBoxRef.current.classList.remove('transitioning-enter-active');
      setIsTransitioning(false);
    }
  };

  return (
    <StyledDialogueBox 
      ref={dialogueBoxRef}
      className={styles.dialogueBox} 
      data-testid="dialogue-box"
      isTransitioning={isTransitioning}
    >
      <div className={styles.speaker} data-testid="speaker">
        {currentDialogue.speaker}
      </div>
      <div className={styles.text} data-testid="dialogue-text">
        {currentDialogue.text}
      </div>
      
      <div className={styles.quickMenu} data-testid="quick-menu">
        <button
          onClick={toggleAutoMode}
          className={`${styles.autoButton} ${isAutoMode ? styles.active : ''}`}
          data-testid="auto-button"
        >
          {isAutoMode ? 'Auto: ON' : 'Auto'}
        </button>
        <button
          onClick={toggleSkipMode}
          className={`${styles.skipButton} ${isSkipMode ? styles.active : ''}`}
          data-testid="skip-button"
        >
          {isSkipMode ? 'Skip: ON' : 'Skip'}
        </button>
        <button
          onClick={toggleBacklog}
          className={`${styles.backlogButton} ${isBacklogOpen ? styles.active : ''}`}
          data-testid="backlog-button"
        >
          {isBacklogOpen ? 'Backlog: ON' : 'Backlog'}
        </button>
        <button
          onClick={toggleSaveMenu}
          className={`${styles.saveButton} ${isSaveMenuOpen ? styles.active : ''}`}
          data-testid="save-button"
        >
          {isSaveMenuOpen ? 'Save: ON' : 'Save'}
        </button>
        <button
          onClick={toggleOptionsMenu}
          className={`${styles.optionsButton} ${isOptionsMenuOpen ? styles.active : ''}`}
          data-testid="options-button"
        >
          {isOptionsMenuOpen ? 'Options: ON' : 'Options'}
        </button>
        <button
          onClick={handleQuitClick}
          className={styles.quitButton}
          data-testid="quit-button"
        >
          Quit
        </button>
      </div>

      {overlayStates.backlog.isOpen && (
        <StyledBacklog 
          className={styles.backlogOverlay} 
          data-testid="backlog-overlay"
          state={overlayStates.backlog.state}
        >
          <StyledBacklogClose onClick={toggleBacklog}>
            Close
          </StyledBacklogClose>
          <div className={styles.backlogContent}>
            <div className={styles.backlogHeader}>
              <h2>Dialogue History</h2>
              <button
                onClick={toggleBacklog}
                className={styles.closeButton}
                data-testid="close-backlog"
              >
                Close
              </button>
            </div>
            <div className={styles.backlogScroll}>
              {gameStore.sceneState.dialogueHistory.map((entry, index) => {
                const isNewScene = index === 0 || 
                  entry.sceneId !== gameStore.sceneState.dialogueHistory[index - 1].sceneId;
                
                return (
                  <div key={entry.timestamp}>
                    {isNewScene && (
                      <div className={styles.sceneMarker} data-testid={`scene-${entry.sceneId}`}>
                        Scene: {entry.sceneId}
                      </div>
                    )}
                    <div className={styles.backlogEntry}>
                      <div className={styles.backlogSpeaker}>{entry.speaker}</div>
                      <div className={styles.backlogText}>{entry.text}</div>
                      <button
                        onClick={() => {
                          handleOverlayClose('backlog').then(() => {
                            gameStore.jumpToHistory(entry);
                            onSceneChange(entry.sceneId);
                            setCurrentDialogueIndex(entry.index);
                          });
                        }}
                        className={styles.jumpButton}
                        data-testid={`jump-to-${entry.timestamp}`}
                      >
                        Jump
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* Current dialogue */}
              {currentDialogue && (
                <div className={styles.backlogEntry}>
                  <div className={styles.backlogSpeaker}>{currentDialogue.speaker}</div>
                  <div className={styles.backlogText}>{currentDialogue.text}</div>
                  <div className={styles.currentMarker}>Current</div>
                </div>
              )}
            </div>
          </div>
        </StyledBacklog>
      )}

      {overlayStates.save.isOpen && (
        <StyledSave 
          className={styles.saveOverlay} 
          data-testid="save-overlay"
          state={overlayStates.save.state}
        >
          <StyledSaveClose onClick={toggleSaveMenu}>
            Close
          </StyledSaveClose>
          <div className={styles.saveContent}>
            <div className={styles.saveActions}>
              {selectedSlot !== null && (
                <div className={styles.saveForm}>
                  <input
                    ref={descriptionInputRef}
                    type="text"
                    value={saveDescription}
                    onChange={(e) => setSaveDescription(e.target.value)}
                    placeholder="Save description (optional)"
                    className={styles.saveDescription}
                    data-testid="save-description"
                  />
                  <button
                    onClick={handleSave}
                    className={styles.saveActionButton}
                    data-testid="create-save"
                  >
                    Save to Slot {selectedSlot}
                  </button>
                </div>
              )}
            </div>
            <div className={styles.saveList}>
              {/* Auto-save slot */}
              {gameStore.getAutoSave() && (
                <div className={styles.saveEntry}>
                  <div className={styles.saveInfo}>
                    <div>Auto Save</div>
                    <div>{new Date(gameStore.getAutoSave()!.timestamp).toLocaleString()}</div>
                    <div className={styles.saveDescription}>
                      {gameStore.getAutoSave()!.description}
                    </div>
                  </div>
                  <div className={styles.saveActions}>
                    <button
                      onClick={() => handleLoad(0)}
                      className={styles.loadButton}
                      data-testid="load-auto-save"
                    >
                      Load
                    </button>
                  </div>
                </div>
              )}
              
              {/* Regular save slots */}
              {Array.from({ length: 20 }, (_, i) => i + 1).map(slotId => {
                const save = gameStore.saveSlots.find(s => s.id === slotId);
                return (
                  <div 
                    key={slotId} 
                    className={`${styles.saveEntry} ${selectedSlot === slotId ? styles.selected : ''}`}
                    data-testid={`save-slot-${slotId}`}
                  >
                    <div className={styles.saveInfo}>
                      <div>Slot {slotId}</div>
                      {save ? (
                        <>
                          <div>{new Date(save.timestamp).toLocaleString()}</div>
                          <div className={styles.saveDescription}>
                            {save.description}
                          </div>
                        </>
                      ) : (
                        <div className={styles.emptySlot}>Empty Slot</div>
                      )}
                    </div>
                    <div className={styles.saveActions}>
                      {save ? (
                        <>
                          <button
                            onClick={() => handleLoad(slotId)}
                            className={styles.loadButton}
                            data-testid={`load-save-${slotId}`}
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDelete(slotId)}
                            className={styles.deleteButton}
                            data-testid={`delete-save-${slotId}`}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleSlotSelect(slotId)}
                          className={styles.selectButton}
                          data-testid={`select-slot-${slotId}`}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </StyledSave>
      )}

      {overlayStates.options.isOpen && (
        <StyledOptions 
          className={styles.optionsOverlay} 
          data-testid="options-overlay"
          state={overlayStates.options.state}
        >
          <StyledOptionsClose onClick={toggleOptionsMenu}>
            Close
          </StyledOptionsClose>
          <div className={styles.optionsContent}>
            <h2 className={styles.optionsTitle}>Options</h2>
            <div className={styles.optionsSection}>
              <h3>Text Settings</h3>
              <div className={styles.optionItem}>
                <label>Text Speed</label>
                <select disabled>
                  <option>Normal</option>
                  <option>Fast</option>
                  <option>Slow</option>
                </select>
              </div>
              <div className={styles.optionItem}>
                <label>Auto-Advance Delay</label>
                <select disabled>
                  <option>3 seconds</option>
                  <option>5 seconds</option>
                  <option>7 seconds</option>
                </select>
              </div>
            </div>
            <div className={styles.optionsSection}>
              <h3>Display Settings</h3>
              <div className={styles.optionItem}>
                <label>Window Opacity</label>
                <select disabled>
                  <option>100%</option>
                  <option>80%</option>
                  <option>60%</option>
                </select>
              </div>
            </div>
            <div className={styles.optionsNote}>
              Settings will be implemented in a future update
            </div>
          </div>
        </StyledOptions>
      )}

      {isDebugOpen && (
        <DebugConsole
          onClose={() => setIsDebugOpen(false)}
          onJumpToScene={(sceneId) => {
            onSceneChange(sceneId);
            setCurrentDialogueIndex(0);
            setIsDebugOpen(false);
          }}
        />
      )}

      {overlayStates.quit.isOpen && (
        <StyledQuit 
          className={styles.quitOverlay} 
          data-testid="quit-overlay"
          state={overlayStates.quit.state}
        >
          <StyledQuitClose onClick={handleQuitCancel}>
            Close
          </StyledQuitClose>
          <div className={styles.quitContent}>
            <h2 className={styles.quitTitle}>Quit to Title?</h2>
            <p className={styles.quitMessage}>
              Any unsaved progress will be lost.
            </p>
            <div className={styles.quitActions}>
            <button
              onClick={handleQuitConfirm}
              className={styles.quitConfirmButton}
              data-testid="quit-confirm"
            >
              Quit
            </button>
            <button
              onClick={handleQuitCancel}
              className={styles.quitCancelButton}
              data-testid="quit-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </StyledQuit>
      )}

      {isLastDialogue && hasChoices ? (
        <div className={styles.choices} data-testid="choices">
          {scene.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice.nextScene)}
              data-testid={`choice-${index}`}
            >
              {choice.text}
            </button>
          ))}
        </div>
      ) : (
        <button 
          onClick={handleNext} 
          disabled={isLastDialogue && !hasChoices}
          data-testid="next-button"
          className={styles.nextButton}
        >
          Next
        </button>
      )}
    </StyledDialogueBox>
  );
}
