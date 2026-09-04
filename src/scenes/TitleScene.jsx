import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

export const TitleScene = () => {
  const { studentName, saveStudentName, setScene, openModal, speak } = useGame();
  const [nameInput, setNameInput] = useState(studentName);

  const handleStart = (e) => {
    e.preventDefault();
    soundManager.init();
    soundManager.playSuccess();

    const finalName = nameInput.trim() || 'Food Tech Student';
    saveStudentName(finalName);
    setScene('orientation');
  };

  return (
    <div className="title-scene">
      <div className="title-backdrop" />
      <div className="title-container">
        {/* Main Banner Card */}
        <div className="title-card">
          <div className="title-badge">🥥 Home Economics Food Processing Simulation</div>
          <h1 className="game-logo">PITH<span>QUEST</span></h1>
          <p className="game-subtitle">The Coconut Pith Crackers Virtual Laboratory Challenge</p>
          <div className="title-divider" />

          {/* Hero Artwork Preview */}
          <div className="title-hero-grid">
            <div className="hero-avatar-box">
              <img src="/images/teacher_mia_neutral.png" alt="Teacher Mia" className="hero-avatar" />
              <span className="hero-name">Teacher Mia</span>
            </div>
            <div className="hero-speech-bubble">
              <p>“Welcome to our virtual kitchen! Learn how to transform nutritious <strong>Ubod ng Niyog</strong> into delicious, crispy crackers through boiling, dehydration, and frying!”</p>
            </div>
            <div className="hero-snack-box">
              <img src="/images/icon_puffed_crackers.png" alt="Coconut Pith Crackers" className="hero-snack" />
              <span className="snack-tag">✨ Golden Crisp Target</span>
            </div>
          </div>

          {/* Student Name Form */}
          <form onSubmit={handleStart} className="start-form">
            <div className="input-group">
              <label htmlFor="student-name">Student Full Name:</label>
              <input
                id="student-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name for the laboratory certificate..."
                required
              />
            </div>

            <div className="title-actions">
              <button type="submit" className="btn-primary btn-start">
                <span className="btn-icon">▶</span>
                <span>Enter Laboratory Activity</span>
              </button>
            </div>
          </form>

          {/* Secondary Quick Links */}
          <div className="title-quick-links">
            <button className="btn-secondary link-btn" onClick={() => openModal('objectives')}>
              🎯 Learning Objectives
            </button>
            <button className="btn-secondary link-btn" onClick={() => openModal('recipe')}>
              📖 Recipe & Science
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
