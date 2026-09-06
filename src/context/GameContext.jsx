import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../audio/soundManager.js';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [scene, setScene] = useState('title');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('pithquest_name') || '');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [badges, setBadges] = useState([]);
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted);

  const [dialogue, setDialogue] = useState({
    visible: false,
    text: '',
    avatar: 'neutral', // 'neutral', 'happy', 'thinking'
    badge: 'Instructor',
    hint: '',
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

  const [stageKey, setStageKey] = useState(0);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1);

  useEffect(() => {
    // Reset any held cursor item when changing scenes
    setHoldingItem(null);
    if (typeof window !== 'undefined') {
      window.__setPithQuestScene = setScene;
    }

    // Auto-expand highest unlocked stage as player progresses
    const STAGE_STEPS = {
      orientation: 0,
      mission1: 1,
      mission2: 2,
      mission3: 3,
      mission4: 4,
      mission5: 5,
      mission6: 6,
      mission7: 7,
      mission8: 8,
      evaluation: 9,
    };
    const currentStep = STAGE_STEPS[scene];
    if (currentStep !== undefined && currentStep >= 1) {
      setMaxUnlockedStage(prev => Math.max(prev, currentStep));
    }
  }, [scene]);

  const restartStage = () => {
    soundManager.playClick();
    setHoldingItem(null);
    setMissionsCompleted(prev => ({ ...prev, [scene]: false }));
    setStageKey(prev => prev + 1);
    showToast('Station Reset', 'Workstation reset to beginning. Give it another try!', 'info');
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
  });

  // Sound Mute Toggle
  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const addScore = (points) => {
    setScore(prev => prev + points);
  };

  const recordMistake = () => {
    setMistakes(prev => {
      const next = prev + 1;
      if (next > 4 && stars > 1) setStars(2);
      if (next > 8) setStars(1);
      return next;
    });
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
  };

  const speak = (text, avatar = 'neutral', options = {}) => {
    setDialogue({
      visible: true,
      text,
      avatar,
      badge: options.badge || 'Instructor',
      hint: options.hint || '',
      btnText: options.btnText || 'Next ➔',
      onNext: options.onNext || null,
      hideButton: options.hideButton || false,
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
    setScore(0);
    setMistakes(0);
    setStars(3);
    setBadges([]);
    setMaxUnlockedStage(1);
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
    });
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
        isMuted,
        toggleSound,
        resetGame,
        stageKey,
        restartStage,
        maxUnlockedStage,
        setMaxUnlockedStage,
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
