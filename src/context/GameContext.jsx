import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../audio/soundManager.js';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [scene, setScene] = useState('title');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('pithquest_name') || '');
  const [stageScores, setStageScores] = useState({
    orientation: 0,
    mission1: 0,
    mission2: 0,
    mission3: 0,
    mission4: 0,
    mission5: 0,
    mission6: 0,
    mission7: 0,
    mission8: 0,
    sequencing: 0,
  });

  const [stageMistakes, setStageMistakes] = useState({
    orientation: 0,
    mission1: 0,
    mission2: 0,
    mission3: 0,
    mission4: 0,
    mission5: 0,
    mission6: 0,
    mission7: 0,
    mission8: 0,
    sequencing: 0,
  });

  // Dynamically computed total score & stars based on non-duplicated stage scores
  const score = Object.values(stageScores).reduce((sum, val) => sum + (val || 0), 0);
  const mistakes = Object.values(stageMistakes).reduce((sum, val) => sum + (val || 0), 0);
  const stars = mistakes <= 3 ? 3 : mistakes <= 7 ? 2 : 1;

  const [badges, setBadges] = useState([]);
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted);

  const [dialogue, setDialogue] = useState({
    visible: false,
    text: '',
    avatar: 'neutral', // 'neutral', 'happy', 'thinking'
    badge: 'Instructor',
    hint: '',
    note: '',
    noteTitle: '',
    btnText: 'Next ➔',
    onNext: null,
    hideButton: false,
  });

  const [toast, setToast] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success', // 'success', 'danger', 'warning'
  });

  const [activeModal, setActiveModal] = useState(null); // 'recipe', 'objectives', null
  const [holdingItem, setHoldingItem] = useState(null); // { id, name, img, ... }

  // Sidebar collapse states for 3-zone panoramic layout
  const [isDialogueCollapsed, setIsDialogueCollapsed] = useState(false);
  const [isInventoryCollapsed, setIsInventoryCollapsed] = useState(false);

  const [stageKey, setStageKey] = useState(0);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(0);

  // Zoom level state (default 1.0 = 100%, mapped to 0.8 baseline scale)
  const [zoomLevel, setZoomLevel] = useState(1);
  const effectiveZoom = Math.round(zoomLevel * 0.8 * 1000) / 1000;

  useEffect(() => {
    try {
      localStorage.removeItem('pithquest_zoom');
    } catch {}
  }, []);

  const updateZoom = (val) => {
    const clamped = Math.min(Math.max(val, 0.5), 1.6);
    const rounded = Math.round(clamped * 100) / 100;
    setZoomLevel(rounded);
  };

  const zoomIn = () => updateZoom(zoomLevel + 0.05);
  const zoomOut = () => updateZoom(zoomLevel - 0.05);
  const resetZoom = () => {
    try {
      localStorage.removeItem('pithquest_zoom');
    } catch {}
    setZoomLevel(1.0);
  };

  useEffect(() => {
    // Reset any held cursor item when changing scenes
    setHoldingItem(null);
    if (typeof window !== 'undefined') {
      window.__setPithQuestScene = setScene;
    }
  }, [scene]);

  const resetStageScore = (targetScene = scene) => {
    setMissionsCompleted(prev => ({ ...prev, [targetScene]: false }));
    setStageScores(prev => ({ ...prev, [targetScene]: 0 }));
    setStageMistakes(prev => ({ ...prev, [targetScene]: 0 }));
  };

  const restartStage = (targetScene = scene) => {
    soundManager.playClick();
    setHoldingItem(null);
    resetStageScore(targetScene);
    setStageKey(prev => prev + 1);
    showToast('Stage Reset', 'Points and progress for this workstation have been reset. Replay to earn points!', 'info');
  };

  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    title: 'Return to Main Menu?',
    message: 'Your progress in this session will be preserved.',
    confirmText: 'Yes, Return to Menu',
    cancelText: 'Stay in Lab',
    icon: '🏠',
    onConfirm: null,
  });

  const [missionsCompleted, setMissionsCompleted] = useState({
    orientation: false,
    mission1: false,
    mission2: false,
    mission3: false,
    mission4: false,
    mission5: false,
    mission6: false,
    mission7: false,
    mission8: false,
    sequencing: false,
    evaluation: false,
  });

  // Sound Mute Toggle
  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const addScore = (points) => {
    setStageScores(prev => ({
      ...prev,
      [scene]: (prev[scene] || 0) + points,
    }));
  };

  const recordMistake = () => {
    setStageMistakes(prev => ({
      ...prev,
      [scene]: (prev[scene] || 0) + 1,
    }));
  };

  const unlockBadge = (badgeId, badgeTitle, icon = '🎖️') => {
    setBadges(prev => {
      if (prev.some(b => b.id === badgeId)) return prev;
      soundManager.playFanfare();
      showToast('Badge Unlocked!', `${badgeTitle}`, 'success');
      return [...prev, { id: badgeId, title: badgeTitle, icon }];
    });
  };

  const completeMission = (missionKey) => {
    setMissionsCompleted(prev => ({ ...prev, [missionKey]: true }));
    const NEXT_STAGE_UNLOCKED = {
      orientation: 1,
      mission1: 2,
      mission2: 3,
      mission3: 4,
      mission4: 5,
      mission5: 6,
      mission6: 7,
      mission7: 8,
      mission8: 9,
      sequencing: 10,
      evaluation: 10,
    };
    if (NEXT_STAGE_UNLOCKED[missionKey] !== undefined) {
      setMaxUnlockedStage(prev => Math.max(prev, NEXT_STAGE_UNLOCKED[missionKey]));
    }
  };

  const speak = (text, avatar = 'neutral', options = {}) => {
    const hasNext = typeof options.onNext === 'function';
    const hasExplicitBtn = Boolean(options.btnText);
    setDialogue({
      visible: true,
      text,
      avatar,
      badge: options.badge || 'Instructor',
      hint: options.hint || '',
      note: options.note || '',
      noteTitle: options.noteTitle || '',
      btnText: options.btnText || (hasNext ? 'Next ➔' : ''),
      onNext: options.onNext || null,
      hideButton: options.hideButton !== undefined ? options.hideButton : (!hasNext && !hasExplicitBtn),
    });
  };

  const hideDialogue = () => {
    setDialogue(prev => ({ ...prev, visible: false }));
  };

  // Automatically dismiss floating dialogue whenever on title scene
  useEffect(() => {
    if (scene === 'title') {
      hideDialogue();
    }
  }, [scene]);

  const showToast = (title, message, type = 'success') => {
    if (type === 'success') soundManager.playSuccess();
    else if (type === 'danger') soundManager.playError();
    else soundManager.playClick();

    setToast({ visible: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2800);
  };

  const openModal = (modalName) => {
    soundManager.playClick();
    setActiveModal(modalName);
  };

  const closeModal = () => {
    soundManager.playClick();
    setActiveModal(null);
  };

  const requestConfirm = ({
    title = 'Return to Main Menu?',
    message = 'Your progress in this session will be preserved. Would you like to return to the title screen?',
    confirmText = 'Return to Menu',
    cancelText = 'Stay in Lab',
    icon = '🏠',
    onConfirm = null,
  }) => {
    soundManager.playClick();
    setConfirmDialog({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      icon,
      onConfirm,
    });
  };

  const closeConfirm = () => {
    soundManager.playClick();
    setConfirmDialog(prev => ({ ...prev, visible: false }));
  };

  const saveStudentName = (name) => {
    setStudentName(name);
    localStorage.setItem('pithquest_name', name);
  };

  const resetGame = () => {
    setStageScores({
      orientation: 0,
      mission1: 0,
      mission2: 0,
      mission3: 0,
      mission4: 0,
      mission5: 0,
      mission6: 0,
      mission7: 0,
      mission8: 0,
      sequencing: 0,
    });
    setStageMistakes({
      orientation: 0,
      mission1: 0,
      mission2: 0,
      mission3: 0,
      mission4: 0,
      mission5: 0,
      mission6: 0,
      mission7: 0,
      mission8: 0,
      sequencing: 0,
    });
    setBadges([]);
    setMaxUnlockedStage(0);
    setMissionsCompleted({
      orientation: false,
      mission1: false,
      mission2: false,
      mission3: false,
      mission4: false,
      mission5: false,
      mission6: false,
      mission7: false,
      mission8: false,
      sequencing: false,
      evaluation: false,
    });
    setHoldingItem(null);
    setStageKey(prev => prev + 1);
    hideDialogue();
    setScene('title');
  };

  return (
    <GameContext.Provider
      value={{
        scene,
        setScene,
        studentName,
        saveStudentName,
        score,
        addScore,
        mistakes,
        recordMistake,
        stars,
        badges,
        unlockBadge,
        missionsCompleted,
        completeMission,
        dialogue,
        speak,
        hideDialogue,
        toast,
        showToast,
        activeModal,
        openModal,
        closeModal,
        confirmDialog,
        requestConfirm,
        closeConfirm,
        holdingItem,
        setHoldingItem,
        isDialogueCollapsed,
        setIsDialogueCollapsed,
        isInventoryCollapsed,
        setIsInventoryCollapsed,
        isMuted,
        toggleSound,
        resetGame,
        stageKey,
        restartStage,
        resetStageScore,
        stageScores,
        stageMistakes,
        maxUnlockedStage,
        setMaxUnlockedStage,
        zoomLevel,
        effectiveZoom,
        setZoomLevel: updateZoom,
        zoomIn,
        zoomOut,
        resetZoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
