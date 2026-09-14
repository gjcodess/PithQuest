import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { MENTOR_KNOWLEDGE } from '../data/mentorKnowledgeData';

const AVATARS = {
  neutral: '/images/teacher_mia_neutral.png',
  happy: '/images/teacher_mia_happy.png',
  thinking: '/images/teacher_mia_thinking.png',
  sad: '/images/teacher_mia_sad.png',
};

const TAB_CONFIG = [
  { id: 'guide', label: 'Guide', icon: '🗣️', shortLabel: 'Guide' },
  { id: 'science', label: 'Food Science', icon: '🔬', shortLabel: 'Science' },
  { id: 'tips', label: 'Pro Tips', icon: '💡', shortLabel: 'Tips' },
  { id: 'safety', label: 'Safety Rules', icon: '🛡️', shortLabel: 'Safety' },
  { id: 'recipe', label: 'Recipe Ratio', icon: '🥥', shortLabel: 'Recipe' },
];

export const TeacherMiaSidebar = () => {
  const {
    dialogue,
    scene,
    isDialogueCollapsed,
    setIsDialogueCollapsed,
  } = useGame();

  const [activeTab, setActiveTab] = useState('guide');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const timerRef = useRef(null);
  const lastReadTextRef = useRef('');

  const stageKnowledge = MENTOR_KNOWLEDGE[scene] || MENTOR_KNOWLEDGE.mission1;

  const finishTyping = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayedText(dialogue.text || '');
    setIsTyping(false);
  };

  // Switch back to 'guide' tab automatically when new speech text arrives
  useEffect(() => {
    if (dialogue.text && dialogue.text !== lastReadTextRef.current) {
      setActiveTab('guide');
      if (isDialogueCollapsed) {
        setHasUnread(true);
      } else {
        lastReadTextRef.current = dialogue.text;
        setHasUnread(false);
      }
    }
  }, [dialogue.text, isDialogueCollapsed]);

  // Typing effect when dialogue text changes
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
    }, 9);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dialogue.text, dialogue.visible]);

  if (scene === 'title') return null;

  const avatarSrc = AVATARS[dialogue.avatar] || AVATARS.neutral;

  const handleToggleExpand = () => {
    soundManager.playClick();
    const willOpen = isDialogueCollapsed;
    setIsDialogueCollapsed(!willOpen);
    if (willOpen) {
      lastReadTextRef.current = dialogue.text || '';
      setHasUnread(false);
    }
  };

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

  // 1. COLLAPSED SLIM VERTICAL TAB (Pinned to Left Edge)
  if (isDialogueCollapsed) {
    return (
      <div
        className="left-mentor-sidebar collapsed"
        onClick={handleToggleExpand}
        title={hasUnread ? 'Teacher Mia has new guidance for you! (Click to open)' : 'Open Teacher Mia Mentor Guide (▶)'}
        role="button"
        tabIndex={0}
        aria-label="Open Teacher Mia Mentor Guide"
      >
        <div className="mentor-tab-avatar-wrapper">
          <img src={avatarSrc} alt="Teacher Mia" className="mentor-tab-avatar-img" />
          <span className={`mentor-mood-indicator ${dialogue.avatar || 'neutral'}`} />
          {hasUnread ? (
            <div className="mentor-tab-badge-pill unread" title="New guidance available">
              <span>💡</span>
            </div>
          ) : (
            <div className="mentor-tab-badge-pill" title="Teacher Mia">
              <span>M</span>
            </div>
          )}
        </div>

        <div className="mentor-tab-label-stack">
          <span className="mentor-tab-name">TEACHER</span>
          <span className="mentor-tab-sub">MIA</span>
        </div>

        <div className="mentor-tab-chevron-box">
          <span className="mentor-tab-chevron">▶</span>
        </div>
      </div>
    );
  }

  // 2. FULL EXPANDED LEFT SIDEBAR
  return (
    <aside
      className="left-mentor-sidebar expanded"
      role="region"
      aria-label="Teacher Mia Mentor Guide"
    >
      {/* Header Bar */}
      <div className="mentor-sidebar-header">
        <div className="mentor-identity-row">
          <div className="mentor-avatar-box">
            <img src={avatarSrc} alt="Teacher Mia" className="mentor-header-avatar" />
            <span className={`mentor-avatar-mood-dot ${dialogue.avatar || 'neutral'}`} />
          </div>

          <div className="mentor-titles-group">
            <div className="mentor-title-line">
              <span className="mentor-name-text">Teacher Mia</span>
              <span className="mentor-badge-pill">Instructor</span>
            </div>
            <span className="mentor-role-text">Food Technology & Science Mentor</span>
          </div>

          <button
            type="button"
            className="mentor-collapse-btn"
            onClick={handleToggleExpand}
            title="Minimize Mentor Guide (◀)"
            aria-label="Minimize Mentor Guide"
          >
            <span>◀</span>
          </button>
        </div>

        {/* Current Protocol Step Badge */}
        <div className="mentor-stage-badge-strip">
          <span className="badge-pin-icon">📍</span>
          <span className="badge-stage-text">
            {dialogue.badge || stageKnowledge.title}
          </span>
        </div>

        {/* Tab Navigation Selector */}
        <nav className="mentor-tab-bar" role="tablist" aria-label="Mentor Guide Sections">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`mentor-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id);
              }}
              title={tab.label}
            >
              <span className="nav-tab-icon">{tab.icon}</span>
              <span className="nav-tab-label">{tab.shortLabel}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mentor-header-divider" />

      {/* Main Tab Content Viewport */}
      <div className="mentor-content-viewport">
        {/* TAB 1: LIVE SPEECH & INSTRUCTION */}
        {activeTab === 'guide' && (
          <div className="mentor-tab-panel guide-panel">
            <div
              className="mentor-speech-card"
              onClick={() => {
                if (isTyping) finishTyping();
              }}
              title={isTyping ? 'Click to reveal full lesson instantly' : undefined}
            >
              <div className="speech-quote-header">
                <span className="quote-icon">💬</span>
                <span className="speech-status-tag">
                  {isTyping ? 'Teacher Mia Speaking...' : 'Mentor Lesson'}
                </span>
                <button
                  type="button"
                  className="speech-replay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    finishTyping();
                  }}
                  title="Replay Voice Chime"
                >
                  🔊
                </button>
              </div>

              <div className="mentor-speech-body">
                {((displayedText || dialogue.text || '').split('\n\n')).map((para, idx, arr) => (
                  <p key={idx} className="mentor-speech-paragraph">
                    {para}
                    {isTyping && idx === arr.length - 1 && (
                      <span className="mentor-typing-cursor">▌</span>
                    )}
                  </p>
                ))}
              </div>

              {stageKnowledge?.subtitle && (
                <div className="speech-focus-strip">
                  <span className="speech-focus-icon">🎯</span>
                  <span className="speech-focus-text">
                    <strong>Objective:</strong> {stageKnowledge.subtitle}
                  </span>
                </div>
              )}
            </div>

            {/* Note & Hint Callouts */}
            {(dialogue.note || dialogue.hint) && (
              <div className="mentor-callouts-box">
                {dialogue.note && (
                  <div className="mentor-callout-item note-item">
                    <span className="callout-icon">📝</span>
                    <div className="callout-content">
                      <strong className="callout-title">
                        {dialogue.noteTitle || 'Standard Note'}:
                      </strong>
                      <p className="callout-desc">{dialogue.note}</p>
                    </div>
                  </div>
                )}
                {dialogue.hint && (
                  <div className="mentor-callout-item hint-item">
                    <span className="callout-icon">💡</span>
                    <div className="callout-content">
                      <strong className="callout-title">Laboratory Hint:</strong>
                      <p className="callout-desc">{dialogue.hint}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stage Progression Action Button */}
            {!dialogue.hideButton && Boolean(dialogue.btnText) && (
              <div className="mentor-stage-action-row">
                <button
                  type="button"
                  className="btn-primary mentor-stage-btn"
                  onClick={handleNextClick}
                >
                  <span>{dialogue.btnText}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FOOD SCIENCE PRINCIPLES */}
        {activeTab === 'science' && (
          <div className="mentor-tab-panel science-panel">
            <div className="panel-intro-bar">
              <span className="intro-icon">🔬</span>
              <span className="intro-text">
                Core biochemistry and food physics governing {stageKnowledge.title}:
              </span>
            </div>

            <div className="science-cards-stack">
              {stageKnowledge.science.map((concept, idx) => (
                <div key={idx} className="mentor-info-card science-card">
                  <div className="info-card-header">
                    <span className="info-card-icon">{concept.icon}</span>
                    <h5 className="info-card-title">{concept.title}</h5>
                  </div>
                  <p className="info-card-summary">{concept.summary}</p>
                  <div className="info-card-deepdive">
                    <span className="deepdive-label">Science Insight:</span>
                    <p className="deepdive-text">{concept.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PRO CULINARY TIPS */}
        {activeTab === 'tips' && (
          <div className="mentor-tab-panel tips-panel">
            <div className="panel-intro-bar">
              <span className="intro-icon">💡</span>
              <span className="intro-text">
                Pro tips and culinary techniques to avoid errors and ensure perfect texture:
              </span>
            </div>

            <div className="tips-cards-stack">
              {stageKnowledge.tips.map((tip, idx) => (
                <div key={idx} className="mentor-info-card tip-card">
                  <div className="info-card-header">
                    <span className="info-card-icon">{tip.icon}</span>
                    <h5 className="info-card-title">{tip.title}</h5>
                  </div>
                  <p className="info-card-text">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY & HYGIENE PROTOCOLS */}
        {activeTab === 'safety' && (
          <div className="mentor-tab-panel safety-panel">
            <div className="panel-intro-bar safety-alert-bar">
              <span className="intro-icon">🛡️</span>
              <span className="intro-text">
                Safety precautions and mandatory hygiene standards for this stage:
              </span>
            </div>

            <div className="safety-cards-stack">
              {stageKnowledge.safety.map((rule, idx) => (
                <div key={idx} className="mentor-info-card safety-card">
                  <div className="info-card-header">
                    <span className="info-card-icon">{rule.icon}</span>
                    <h5 className="info-card-title">{rule.title}</h5>
                  </div>
                  <p className="info-card-text">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STANDARD RECIPE RATIOS */}
        {activeTab === 'recipe' && (
          <div className="mentor-tab-panel recipe-panel">
            <div className="panel-intro-bar">
              <span className="intro-icon">🥥</span>
              <span className="intro-text">
                Standard recipe measurements and targets for {stageKnowledge.title}:
              </span>
            </div>

            <div className="recipe-items-grid">
              {stageKnowledge.recipe.map((item, idx) => (
                <div key={idx} className="mentor-recipe-pill">
                  <span className="recipe-pill-emoji">{item.icon}</span>
                  <div className="recipe-pill-info">
                    <span className="recipe-pill-name">{item.name}</span>
                    <strong className="recipe-pill-measure">{item.measure}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
