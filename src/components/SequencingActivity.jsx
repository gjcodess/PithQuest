import React, { useState, useEffect, useRef } from 'react';
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

  // Live Dynamic Drag Displacement Handlers (Desktop Mouse)
  const handleDragStart = (e, index) => {
    if (isSolved) return;
    setSelectedCardIndex(null);
    setDraggedIndex(index);
    setDragOverIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, targetIndex) => {
    if (isSolved || draggedIndex === null || draggedIndex === targetIndex) return;
    e.preventDefault();
    
    // Live Dynamic Shift: instantly reorder items as cursor hovers over slots
    const newItems = [...items];
    const [movedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    setItems(newItems);
    setDraggedIndex(targetIndex);
    setDragOverIndex(targetIndex);
    soundManager.playClick();
  };

  const handleDragOver = (e) => {
    if (isSolved) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    if (isSolved) return;
    e.preventDefault();
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
      const currentIndex = draggedIndex !== null ? draggedIndex : touchOriginRef.current.index;
      if (!isNaN(targetIndex) && targetIndex !== currentIndex && targetIndex >= 0 && targetIndex < items.length) {
        const newItems = [...items];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.splice(targetIndex, 0, movedItem);
        setItems(newItems);
        setDraggedIndex(targetIndex);
        setDragOverIndex(targetIndex);
        touchOriginRef.current.index = targetIndex;
        soundManager.playClick();
      }
    }
  };

  const handleTouchEnd = (index) => {
    if (touchOriginRef.current && !touchOriginRef.current.hasMoved) {
      // It was a tap!
      handleCardClick(index);
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
    <div
      className="sequencing-activity-card"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
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
                onDrop={handleDrop}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
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
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }}
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

                  <div
                    className="seq-card-illustration"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="seq-card-img"
                      draggable={false}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }}
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
