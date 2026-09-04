import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

const AVATARS = {
  neutral: '/images/teacher_mia_neutral.png',
  happy: '/images/teacher_mia_happy.png',
  thinking: '/images/teacher_mia_thinking.png',
  sad: '/images/teacher_mia_sad.png',
};

export const DialogueBox = () => {
  const { dialogue, scene } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const hasTray = ['mission1', 'mission2', 'mission3', 'mission4', 'mission5'].includes(scene);


  useEffect(() => {
    if (!dialogue.visible || !dialogue.text) {
      setDisplayedText('');
      return;
    }

    let i = 0;
    const fullText = dialogue.text;
    setDisplayedText('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 14);

    return () => clearInterval(timer);
  }, [dialogue.text, dialogue.visible]);

  if (!dialogue.visible || scene === 'title') return null;

  const handleNextClick = () => {
    soundManager.playClick();
    if (isTyping) {
      // Instant reveal on click if still typing
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else if (dialogue.onNext) {
      dialogue.onNext();
    }
  };

  const avatarSrc = AVATARS[dialogue.avatar] || AVATARS.neutral;

  return (
    <div className={`dialogue-box ${hasTray ? 'has-tray' : 'no-tray'}`}>
      <div className="dialogue-avatar-wrapper">
        <img src={avatarSrc} alt="Teacher Mia" className="dialogue-avatar" />
        <span className="avatar-tag">Teacher Mia</span>
      </div>
      <div className="dialogue-content">
        <div className="dialogue-header">
          <span className="dialogue-name">👩‍🏫 Teacher Mia</span>
          <span className="dialogue-status-badge">{dialogue.badge}</span>
        </div>
        <p className="dialogue-text">{displayedText}</p>
        <div className="dialogue-footer">
          <span className="hint-tag">{dialogue.hint ? `💡 ${dialogue.hint}` : ''}</span>
          {!dialogue.hideButton && (
            <button className="dialogue-btn" onClick={handleNextClick}>
              {dialogue.btnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
