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

  // Render Collapsed Floating Pill Tab
  if (isDialogueCollapsed) {
    return (
      <aside
        className="floating-dialogue-dock collapsed"
        onClick={() => {
          soundManager.playClick();
          setIsDialogueCollapsed(false);
        }}
        title="Click to open Teacher Mia's guidance (▲)"
        role="button"
        tabIndex={0}
      >
        <div className="dock-pill-avatar-wrap">
          <img src={avatarSrc} alt="Teacher Mia" className="dock-pill-avatar" />
          <span className={`dock-pill-mood ${dialogue.avatar || 'neutral'}`} />
        </div>
        <div className="dock-pill-info">
          <span className="dock-pill-name">TEACHER MIA</span>
          <span className="dock-pill-teaser">
            {dialogue.text ? `💬 ${dialogue.text.slice(0, 75)}${dialogue.text.length > 75 ? '...' : ''}` : 'Guidance Available'}
          </span>
        </div>
        <div className="dock-pill-action">
          <span>▲ Open Guide</span>
        </div>
      </aside>
    );
  }

  // Render Full Expanded Floating Dialogue Card
  return (
    <aside
      className={`floating-dialogue-dock expanded ${isTyping ? 'is-typing' : ''}`}
      onClick={handleBoxClick}
      title={isTyping ? 'Click speech bubble to reveal text instantly' : undefined}
    >
      {/* Top Header Bar: Character Identity + Minimize Button */}
      <div className="card-top-bar">
        <div className="card-character-group">
          <div className="card-avatar-box">
            <img src={avatarSrc} alt="Teacher Mia" className="card-avatar-img" />
            <span className={`card-mood-dot ${dialogue.avatar || 'neutral'}`} />
          </div>
          <div className="card-character-info">
            <div className="card-title-row">
              <span className="card-character-name">Teacher Mia</span>
              <span className="card-role-pill">Food Science Mentor</span>
            </div>
            {dialogue.badge && (
              <span className="card-stage-badge">{dialogue.badge}</span>
            )}
          </div>
        </div>

        <button
          className="card-minimize-btn"
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            setIsDialogueCollapsed(true);
          }}
          title="Minimize Teacher Mia guidance (▼)"
          aria-label="Minimize Dialogue"
        >
          <span>▼</span>
        </button>
      </div>

      {/* Main Dialogue Speech Body */}
      <div className="card-speech-body">
        <p className="card-speech-text">
          {displayedText}
          {isTyping && <span className="dialogue-typing-cursor">▌</span>}
        </p>
      </div>

      {/* Bottom Footer Row: Note/Hint Callouts & Next Stage Action Button */}
      {((dialogue.note || dialogue.hint) || (!dialogue.hideButton && Boolean(dialogue.btnText))) && (
        <div className="card-footer-row">
          <div className="card-callouts-col">
            {dialogue.note && (
              <div className="card-note-pill">
                <span className="callout-icon">📝</span>
                <span className="callout-content">
                  <strong>{dialogue.noteTitle || 'Note'}:</strong> {dialogue.note}
                </span>
              </div>
            )}
            {dialogue.hint && (
              <div className="card-hint-pill">
                <span className="callout-icon">💡</span>
                <span className="callout-content">
                  <strong>Hint:</strong> {dialogue.hint}
                </span>
              </div>
            )}
          </div>

          {!dialogue.hideButton && Boolean(dialogue.btnText) && (
            <button
              className="card-action-btn ready"
              onClick={handleNextClick}
              title={dialogue.btnText}
            >
              <span>{dialogue.btnText}</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
