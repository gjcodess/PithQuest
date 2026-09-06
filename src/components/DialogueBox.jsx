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
  const { dialogue, scene, isDialogueCollapsed, setIsDialogueCollapsed } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef(null);

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
      setIsDialogueCollapsed(false);
    }
  }, [dialogue.btnText, setIsDialogueCollapsed]);

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
    finishTyping();
    soundManager.playClick();
    if (typeof dialogue.onNext === 'function') {
      dialogue.onNext();
    } else {
      setIsDialogueCollapsed(true);
    }
  };

  const handleBoxClick = () => {
    if (isTyping) {
      finishTyping();
    }
  };

  const avatarSrc = AVATARS[dialogue.avatar] || AVATARS.neutral;

  // Render Collapsed Slim Vertical Tab (Left Edge)
  if (isDialogueCollapsed) {
    return (
      <div
        className="left-assistant-panel collapsed"
        onClick={() => {
          soundManager.playClick();
          setIsDialogueCollapsed(false);
        }}
        title="Click to open Teacher Mia's guidance (▶)"
        role="button"
        tabIndex={0}
      >
        <div className="assistant-tab-avatar-wrapper">
          <img src={avatarSrc} alt="Teacher Mia" className="assistant-tab-avatar" />
          <span className="assistant-tab-beacon" />
        </div>
        <div className="assistant-tab-label-stack">
          <span className="assistant-tab-name">MIA</span>
          <span className="assistant-tab-sub">GUIDE</span>
        </div>
        <div className="assistant-tab-chevron-box">
          <span className="assistant-tab-chevron">▶</span>
        </div>
      </div>
    );
  }

  // Render Full Expanded Left Assistant Sidebar
  return (
    <div
      className={`left-assistant-panel expanded ${isTyping ? 'is-typing' : ''}`}
      onClick={handleBoxClick}
      title={isTyping ? 'Click speech bubble to reveal text instantly' : undefined}
    >
      {/* Header Bar */}
      <div className="assistant-header">
        <div className="assistant-avatar-container">
          <img src={avatarSrc} alt="Teacher Mia" className="assistant-avatar-img" />
          <span className={`assistant-mood-indicator ${dialogue.avatar || 'neutral'}`} />
        </div>
        <div className="assistant-title-group">
          <span className="assistant-name">Teacher Mia</span>
          <span className="assistant-status-badge">{dialogue.badge || 'Laboratory Mentor'}</span>
        </div>
        <button
          className="assistant-collapse-btn"
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            setIsDialogueCollapsed(true);
          }}
          title="Minimize Teacher Mia guidance (◀)"
          aria-label="Minimize Dialogue"
        >
          <span>◀</span>
        </button>
      </div>
      <div className="assistant-header-divider" />

      {/* Speech Content */}
      <div className="assistant-speech-body">
        <p className="assistant-dialogue-text">
          {displayedText}
          {isTyping && <span className="dialogue-typing-cursor">▌</span>}
        </p>

        {dialogue.note && (
          <div className="assistant-note-callout">
            <div className="note-callout-header">
              <span className="note-icon">📝</span>
              <span className="note-title">{dialogue.noteTitle || "Teacher Mia's Note"}</span>
            </div>
            <p className="note-text">{dialogue.note}</p>
          </div>
        )}

        {dialogue.hint && (
          <div className="assistant-hint-callout">
            <span className="hint-icon">💡</span>
            <span className="hint-text">{dialogue.hint}</span>
          </div>
        )}
      </div>

      {/* Footer / Transition Button */}
      {!dialogue.hideButton && Boolean(dialogue.btnText) && (
        <div className="assistant-footer">
          <button
            className="assistant-action-btn ready"
            onClick={handleNextClick}
            title={dialogue.btnText}
          >
            <span>{dialogue.btnText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
