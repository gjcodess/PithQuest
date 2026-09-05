import React, { useState, useEffect, useRef } from 'react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const timerRef = useRef(null);

  const hasTray = ['mission1', 'mission2', 'mission3', 'mission4', 'mission5'].includes(scene);

  const finishTyping = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayedText(dialogue.text || '');
    setIsTyping(false);
  };

  // Auto-expand when a primary mission transition button appears
  useEffect(() => {
    if (dialogue.btnText) {
      setIsCollapsed(false);
    }
  }, [dialogue.btnText]);

  useEffect(() => {
    if (!dialogue.visible || !dialogue.text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let i = 0;
    const fullText = dialogue.text;
    setDisplayedText('');
    setIsTyping(true);

    timerRef.current = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsTyping(false);
      }
    }, 14);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dialogue.text, dialogue.visible]);

  if (!dialogue.visible || scene === 'title') return null;

  const handleNextClick = (e) => {
    e.stopPropagation();
    if (isTyping) return; // Prevent proceeding while typing
    soundManager.playClick();
    if (dialogue.onNext) {
      dialogue.onNext();
    }
  };

  const handleBoxClick = () => {
    if (isTyping) {
      finishTyping();
    }
  };

  const avatarSrc = AVATARS[dialogue.avatar] || AVATARS.neutral;

  // Render Collapsed Mini-Pill Bar
  if (isCollapsed) {
    return (
      <div
        className={`dialogue-box collapsed ${hasTray ? 'has-tray' : 'no-tray'}`}
        onClick={() => {
          soundManager.playClick();
          setIsCollapsed(false);
        }}
        title="Click anywhere to expand Teacher Mia's speech"
        role="button"
        tabIndex={0}
      >
        <div className="dialogue-mini-avatar-wrapper">
          <img src={avatarSrc} alt="Teacher Mia" className="dialogue-mini-avatar" />
        </div>
        <div className="dialogue-collapsed-info">
          <span className="dialogue-mini-name">Teacher Mia:</span>
          <span className="dialogue-mini-snippet">
            {displayedText || dialogue.text}
          </span>
        </div>
        <button
          className="dialogue-toggle-btn expand"
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            setIsCollapsed(false);
          }}
          title="Expand Teacher Mia Dialogue"
          aria-label="Expand Teacher Mia Dialogue"
        >
          <span>▲ Expand</span>
        </button>
      </div>
    );
  }

  // Render Full Expanded Dialogue Box
  return (
    <div
      className={`dialogue-box ${hasTray ? 'has-tray' : 'no-tray'} ${isTyping ? 'is-typing' : ''}`}
      onClick={handleBoxClick}
      title={isTyping ? 'Click speech bubble to reveal text instantly' : undefined}
    >
      <div className="dialogue-avatar-wrapper">
        <img src={avatarSrc} alt="Teacher Mia" className="dialogue-avatar" />
      </div>
      <div className="dialogue-content">
        <div className="dialogue-header">
          <div className="dialogue-header-left">
            <span className="dialogue-name">Teacher Mia</span>
            {dialogue.badge && <span className="dialogue-status-badge">{dialogue.badge}</span>}
          </div>
          <button
            className="dialogue-toggle-btn collapse"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              setIsCollapsed(true);
            }}
            title="Minimize speech bubble"
            aria-label="Minimize Dialogue"
          >
            <span>▼ Minimize</span>
          </button>
        </div>
        <p className="dialogue-text">
          {displayedText}
          {isTyping && <span className="dialogue-typing-cursor">▌</span>}
        </p>
        <div className="dialogue-footer">
          <span className="hint-tag">{dialogue.hint ? `💡 ${dialogue.hint}` : ''}</span>
          {!dialogue.hideButton && (
            <button
              className={`dialogue-btn ${isTyping ? 'disabled' : 'ready'}`}
              onClick={handleNextClick}
              disabled={isTyping}
              title={isTyping ? 'Please wait for Teacher Mia to finish speaking' : ''}
            >
              {dialogue.btnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

