import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../audio/soundManager';
import { useGame } from '../context/GameContext';

const CORRECT_ORDER = [
  {
    id: 'boiling',
    stepNum: 1,
    title: 'Washing & Boiling Ubod',
    img: '/assets/card_step_boiling.png',
    desc: 'Wash raw ubod strips and boil in salted water until fork-tender.',
  },
  {
    id: 'grinding',
    stepNum: 2,
    title: 'Pureeing & Grinding',
    img: '/assets/card_step_grinding.png',
    desc: 'Puree boiled ubod with 1 tsp salt in food processor until completely smooth.',
  },
  {
    id: 'mixing',
    stepNum: 3,
    title: 'Paste Formulation',
    img: '/assets/card_step_mixing.png',
    desc: 'Mix 1:1 ubod puree with rice flour, salt, and gradual water into uniform paste.',
  },
  {
    id: 'molding',
    stepNum: 4,
    title: 'Rectangular Molding',
    img: '/assets/card_step_molding.png',
    desc: 'Portion into silicone mold cavities to form uniform 50mm x 25mm wafers.',
  },
  {
    id: 'steaming',
    stepNum: 5,
    title: 'Starch Steaming (10 min)',
    img: '/assets/card_step_steaming.png',
    desc: 'Steam molded pieces to gelatinize starches and lock rectangular shape.',
  },
  {
    id: 'dehydration',
    stepNum: 6,
    title: 'Cabinet Dehydration (90°C)',
    img: '/assets/card_step_dehydration.png',
    desc: 'Dehydrate for 12 hours on wire mesh trays until moisture is under 10%.',
  },
  {
    id: 'frying',
    stepNum: 7,
    title: 'Flash Deep Frying (10 sec)',
    img: '/assets/card_step_frying.png',
    desc: 'Fry dried chips in 180°C hot oil for 10 seconds until puffed 3x and golden.',
  },
  {
    id: 'packaging',
    stepNum: 8,
    title: 'Packaging & Labeling',
    img: '/assets/card_step_packaging.png',
    desc: 'Heat-seal 50g into airtight barrier pouches and pack 8 pouches into retail carton.',
  },
];

export const SequencingActivity = ({ onComplete }) => {
  const { unlockBadge, showToast, missionsCompleted, recordPostTestSequence, assessmentResults } = useGame();
  const isAlreadyDone = Boolean(missionsCompleted?.sequencing);

  const [items, setItems] = useState(() => {
    // If previously submitted in this session, restore submitted items
    if (assessmentResults?.postTest?.sequencing?.submittedItems) {
      return [...assessmentResults.postTest.sequencing.submittedItems];
    }
    let shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    while (shuffled.every((item, idx) => item.id === CORRECT_ORDER[idx].id)) {
      shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    }
    return shuffled;
  });

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isSolved, setIsSolved] = useState(() => isAlreadyDone);
  const touchOriginRef = useRef(null);
  // Ref to track the source index throughout the entire drag operation (avoids stale closure issues)
  const dragSourceRef = useRef(null);
  // Ref to prevent rapid re-entry into dragEnter
  const lastDragEnterRef = useRef(null);

  // Re-sync if completion state changes
  useEffect(() => {
    if (isAlreadyDone) {
      if (assessmentResults?.postTest?.sequencing?.submittedItems) {
        setItems([...assessmentResults.postTest.sequencing.submittedItems]);
      }
      setIsSolved(true);
      setSelectedCardIndex(null);
    }
  }, [isAlreadyDone, assessmentResults]);

  // Global dragend safety net: ensures state is cleaned up even if dragend fires outside component
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      if (dragSourceRef.current !== null) {
        dragSourceRef.current = null;
        lastDragEnterRef.current = null;
        setDraggedIndex(null);
        setDragOverIndex(null);
      }
    };
    window.addEventListener('dragend', handleGlobalDragEnd);
    return () => window.removeEventListener('dragend', handleGlobalDragEnd);
  }, []);

  // Initialize with a randomized order
  const shuffleItems = () => {
    let shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    while (shuffled.every((item, idx) => item.id === CORRECT_ORDER[idx].id)) {
      shuffled = [...CORRECT_ORDER].sort(() => Math.random() - 0.5);
    }
    setItems(shuffled);
    setIsSolved(false);
    setSelectedCardIndex(null);
  };

  // Tap-to-Swap / Tap-to-Move Handler (Tablet Friendly)
  const handleCardClick = (index) => {
    if (isSolved) return;

    if (selectedCardIndex === null) {
      soundManager.playClick();
      setSelectedCardIndex(index);
    } else if (selectedCardIndex === index) {
      soundManager.playClick();
      setSelectedCardIndex(null);
    } else {
      soundManager.playSuccess();
      const newItems = [...items];
      const temp = newItems[selectedCardIndex];
      newItems[selectedCardIndex] = newItems[index];
      newItems[index] = temp;
      setItems(newItems);
      setSelectedCardIndex(null);
    }
  };

  // Swap-on-drop Drag Handlers (Desktop Mouse)
  // Instead of live-reordering on every dragEnter (which causes rapid re-renders and freeze),
  // we only highlight the drop target and perform the swap on drop.
  const handleDragStart = (e, index) => {
    if (isSolved) return;
    setSelectedCardIndex(null);
    dragSourceRef.current = index;
    lastDragEnterRef.current = null;
    setDraggedIndex(index);
    setDragOverIndex(null);
    try {
      e.dataTransfer.setData('text/plain', index.toString());
    } catch {
      // Some browsers may restrict setData in certain contexts
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = useCallback((e, targetIndex) => {
    if (isSolved || dragSourceRef.current === null) return;
    e.preventDefault();
    // Guard: skip if we already processed this target
    if (lastDragEnterRef.current === targetIndex) return;
    lastDragEnterRef.current = targetIndex;
    setDragOverIndex(targetIndex);
  }, [isSolved]);

  const handleDragOver = useCallback((e) => {
    if (isSolved) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [isSolved]);

  const handleDragLeave = useCallback((e, targetIndex) => {
    // Only clear if we're actually leaving this element (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (lastDragEnterRef.current === targetIndex) {
      lastDragEnterRef.current = null;
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback((e, targetIndex) => {
    if (isSolved) return;
    e.preventDefault();

    const sourceIndex = dragSourceRef.current;
    if (sourceIndex !== null && sourceIndex !== targetIndex && sourceIndex >= 0 && sourceIndex < items.length) {
      soundManager.playClick();
      const newItems = [...items];
      // Swap the source and target items
      const temp = newItems[sourceIndex];
      newItems[sourceIndex] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setItems(newItems);
    }

    // Clean up
    dragSourceRef.current = null;
    lastDragEnterRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [isSolved, items]);

  const handleDragEnd = useCallback(() => {
    dragSourceRef.current = null;
    lastDragEnterRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Touch Drag Handlers (Tablet / Mobile Touch Screens)
  const handleTouchStart = (e, index) => {
    if (isSolved) return;
    const touch = e.touches[0];
    touchOriginRef.current = { index, startX: touch.clientX, startY: touch.clientY, hasMoved: false };
  };

  const handleTouchMove = (e) => {
    if (isSolved || !touchOriginRef.current) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchOriginRef.current.startX);
    const deltaY = Math.abs(touch.clientY - touchOriginRef.current.startY);

    if (deltaX > 8 || deltaY > 8) {
      touchOriginRef.current.hasMoved = true;
      if (e.cancelable) e.preventDefault();
    }

    if (!touchOriginRef.current.hasMoved) return;

    if (draggedIndex === null) {
      setDraggedIndex(touchOriginRef.current.index);
    }

    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!targetElement) return;

    const wrapper = targetElement.closest('.sequencing-card-wrapper');
    if (wrapper && wrapper.dataset.slotIndex !== undefined) {
      const targetIndex = parseInt(wrapper.dataset.slotIndex, 10);
      if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < items.length) {
        setDragOverIndex(targetIndex);
      }
    } else {
      setDragOverIndex(null);
    }
  };

  const handleTouchEnd = (index) => {
    if (touchOriginRef.current) {
      if (!touchOriginRef.current.hasMoved) {
        // It was a tap!
        handleCardClick(index);
      } else if (dragOverIndex !== null && dragOverIndex !== touchOriginRef.current.index) {
        // Perform swap on touch end (like drop)
        const sourceIndex = touchOriginRef.current.index;
        const targetIndex = dragOverIndex;
        soundManager.playClick();
        const newItems = [...items];
        const temp = newItems[sourceIndex];
        newItems[sourceIndex] = newItems[targetIndex];
        newItems[targetIndex] = temp;
        setItems(newItems);
      }
    }
    touchOriginRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmitSequence = () => {
    const isCorrect = items.every((item, idx) => item.id === CORRECT_ORDER[idx].id);
    const correctCount = items.filter((item, idx) => item.id === CORRECT_ORDER[idx].id).length;
    const correctMap = items.map((item, idx) => item.id === CORRECT_ORDER[idx].id);

    // Record in diagnostic assessment state for the Results report
    recordPostTestSequence({
      submittedOrder: items.map((i) => i.id),
      submittedItems: items,
      correctOrder: CORRECT_ORDER.map((i) => i.id),
      correctItems: CORRECT_ORDER,
      correctCount,
      isCorrect,
      correctMap,
    });

    if (isCorrect) {
      unlockBadge('master_sequencer', 'Master Food Technologist');
    }

    setIsSolved(true);
    soundManager.playSuccess();
    showToast('Post-Test Submitted', 'Sequence recorded. Proceed to view your full diagnostic results report.', 'success');

    if (onComplete) {
      onComplete({ isCorrect, correctCount, submittedItems: items });
    }
  };

  return (
    <div className="sequencing-activity-card">
      <div className="sequencing-header">
        <div className="sec-tag">Food Processing Pipeline Validation</div>
        <h3>Chronological Step Sequencing Puzzle</h3>
        <p className="sec-subtitle">
          Arrange all 8 manufacturing stages in their authentic chronological order (from <strong>Stage 1</strong> on the left to <strong>Stage 8</strong> on the right).
          <br />
          <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
            💡 <em>Tablet Friendly: Drag cards OR tap a card then tap another to swap positions!</em>
          </span>
        </p>
      </div>

      {/* Drag & Drop Timeline Grid */}
      <div className="sequencing-timeline-container">
        <div className="sequencing-slots-grid">
          {items.map((item, index) => {
            const isDragging = draggedIndex === index;
            const isDragTarget = dragOverIndex === index && draggedIndex !== index;
            const isSelected = selectedCardIndex === index;

            return (
              <div
                key={item.id}
                data-slot-index={index}
                className={`sequencing-card-wrapper ${isDragging ? 'is-drag-origin' : ''} ${isDragTarget ? 'drag-over-target' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={(e) => handleDragLeave(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Timeline Position Header */}
                <div className="seq-timeline-header">
                  <span className="seq-pos-num">#{index + 1}</span>
                  <span className="seq-pos-label">Stage {index + 1}</span>
                </div>

                <div
                  className={`sequencing-card ${
                    isSelected ? 'selected-tap-card' : ''
                  } ${isDragging ? 'is-dragging' : ''} ${isSolved ? 'card-submitted' : ''}`}
                  draggable={!isSolved}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(index)}
                  onClick={() => handleCardClick(index)}
                  title={!isSolved ? (isSelected ? 'Tap another card to swap' : 'Tap or drag to swap') : 'Sequence submitted'}
                >
                  {/* Status Indicator Badge */}
                  {!isSolved && isSelected && (
                    <div className="seq-status-badge badge-selected">🔄 Selected • Tap swap</div>
                  )}

                  {/* Grip Handle Indicator */}
                  {!isSolved && (
                    <div className="seq-drag-handle">
                      <span className="grip-dots">⋮⋮</span>
                      <span className="grip-text">{isSelected ? 'Selected' : 'Drag / Tap'}</span>
                    </div>
                  )}

                  <div className="seq-card-illustration">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="seq-card-img"
                      draggable={false}
                    />
                  </div>

                  <div className="seq-info">
                    <h4 className="seq-title">{item.title}</h4>
                    <p className="seq-desc">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sequencing-actions">
        {!isSolved ? (
          <div className="actions-button-row">
            <button className="btn-primary btn-check-sequence" onClick={handleSubmitSequence}>
              <span>Submit Chronological Sequence & View Results ➔</span>
            </button>
            <button
              className="btn-secondary btn-reshuffle"
              onClick={() => {
                soundManager.playClick();
                shuffleItems();
              }}
              title="Reset order"
            >
              <span>Reset Order</span>
            </button>
          </div>
        ) : (
          <div className="submitted-sequence-notice">
            <span>✓ Post-Test response recorded and locked. Click <strong>"View Diagnostic Assessment Results ➔"</strong> to view your full performance report.</span>
          </div>
        )}
      </div>
    </div>
  );
};
