import React, { useState, useRef } from 'react';
import { soundManager } from '../audio/soundManager';
import { HANDWASHING_STEPS } from '../data/orientationData';

export const HandwashingSequenceActivity = ({ onComplete }) => {
  // 10 Total Cards (7 correct steps + 3 distractors), initially in available pool
  const [pool, setPool] = useState(() => {
    return [...HANDWASHING_STEPS].sort(() => Math.random() - 0.5);
  });

  // 7 Sequence Slots (null or step object)
  const [slots, setSlots] = useState(() => Array(7).fill(null));

  // Selection states for click-to-place / tap-to-swap
  const [selectedPoolId, setSelectedPoolId] = useState(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null); // { source: 'pool'|'slot', index: number, item: object }
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // Assign an item from pool to a slot
  const placeItemInSlot = (item, targetSlotIndex) => {
    soundManager.playClick();
    const newSlots = [...slots];
    const newPool = pool.filter(p => p.id !== item.id);

    // If target slot already has an item, return that item to pool
    if (newSlots[targetSlotIndex]) {
      newPool.push(newSlots[targetSlotIndex]);
    }

    newSlots[targetSlotIndex] = item;
    setSlots(newSlots);
    setPool(newPool);
    setSelectedPoolId(null);
    setSelectedSlotIndex(null);
  };

  // Remove item from slot back to pool
  const removeItemFromSlot = (slotIndex) => {
    soundManager.playClick();
    const item = slots[slotIndex];
    if (!item) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setPool(prev => [...prev, item]);
    setSelectedSlotIndex(null);
  };

  // Handle pool card click
  const handlePoolCardClick = (item) => {
    if (selectedSlotIndex !== null) {
      // If a slot was previously selected, place this pool item in that slot
      placeItemInSlot(item, selectedSlotIndex);
      return;
    }

    if (selectedPoolId === item.id) {
      setSelectedPoolId(null);
      return;
    }

    // Auto-place in first empty slot if available
    const firstEmptyIndex = slots.findIndex(s => s === null);
    if (firstEmptyIndex !== -1) {
      placeItemInSlot(item, firstEmptyIndex);
    } else {
      setSelectedPoolId(item.id);
      soundManager.playClick();
    }
  };

  // Handle slot click
  const handleSlotClick = (slotIndex) => {
    if (selectedPoolId) {
      const item = pool.find(p => p.id === selectedPoolId);
      if (item) {
        placeItemInSlot(item, slotIndex);
      }
      return;
    }

    if (selectedSlotIndex === null) {
      if (slots[slotIndex]) {
        soundManager.playClick();
        setSelectedSlotIndex(slotIndex);
      }
    } else if (selectedSlotIndex === slotIndex) {
      setSelectedSlotIndex(null);
    } else {
      // Swap two slots
      soundManager.playClick();
      const newSlots = [...slots];
      const temp = newSlots[selectedSlotIndex];
      newSlots[selectedSlotIndex] = newSlots[slotIndex];
      newSlots[slotIndex] = temp;
      setSlots(newSlots);
      setSelectedSlotIndex(null);
    }
  };

  // Drag and drop handlers
  const handleDragStartFromPool = (e, item) => {
    setDraggedItem({ source: 'pool', item });
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'pool', id: item.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragStartFromSlot = (e, slotIndex, item) => {
    setDraggedItem({ source: 'slot', index: slotIndex, item });
    e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'slot', index: slotIndex, id: item.id }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverSlot = (e, slotIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlot !== slotIndex) {
      setDragOverSlot(slotIndex);
    }
  };

  const handleDropOnSlot = (e, targetSlotIndex) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!draggedItem) return;

    if (draggedItem.source === 'pool') {
      placeItemInSlot(draggedItem.item, targetSlotIndex);
    } else if (draggedItem.source === 'slot') {
      const sourceSlotIndex = draggedItem.index;
      if (sourceSlotIndex === targetSlotIndex) return;

      soundManager.playClick();
      const newSlots = [...slots];
      const temp = newSlots[targetSlotIndex];
      newSlots[targetSlotIndex] = newSlots[sourceSlotIndex];
      newSlots[sourceSlotIndex] = temp;
      setSlots(newSlots);
    }
    setDraggedItem(null);
  };

  const handleReset = () => {
    soundManager.playClick();
    setPool([...HANDWASHING_STEPS].sort(() => Math.random() - 0.5));
    setSlots(Array(7).fill(null));
    setSelectedPoolId(null);
    setSelectedSlotIndex(null);
  };

  const handleSubmit = () => {
    soundManager.playSuccess();
    const submittedSteps = slots.filter(Boolean);
    const correctSteps = HANDWASHING_STEPS.filter(s => s.isCorrect);
    
    // Evaluate correctness for report
    const distractorsIncluded = submittedSteps.filter(s => !s.isCorrect);
    const isAllCorrect = submittedSteps.length === 7 && submittedSteps.every((step, idx) => step.step === idx + 1);

    if (onComplete) {
      onComplete({
        submittedSteps,
        correctSequence: correctSteps,
        distractorsIncluded,
        isAllCorrect,
        slots,
      });
    }
  };

  const filledCount = slots.filter(Boolean).length;

  return (
    <div className="handwash-sequence-container">
      {/* Header Info & Progress */}
      <div className="hw-sequence-header">
        <div className="hw-sequence-titles">
          <h3 className="hw-title">Arrange the 7 Sanitary Handwashing Steps in Order</h3>
          <p className="hw-subtitle">
            Drag or tap steps into the correct chronological slots (1 to 7). Beware of <strong>3 hazardous distractor practices</strong>!
          </p>
        </div>
        <div className="hw-count-badge">
          <span>{filledCount}/7 Steps Assigned</span>
        </div>
      </div>

      {/* Target Slots (1 to 7) */}
      <div className="hw-slots-grid">
        {slots.map((item, idx) => {
          const isSelected = selectedSlotIndex === idx;
          const isHovered = dragOverSlot === idx;

          return (
            <div
              key={idx}
              className={`hw-slot-box ${item ? 'filled' : 'empty'} ${isSelected ? 'selected' : ''} ${isHovered ? 'drag-target' : ''}`}
              onClick={() => handleSlotClick(idx)}
              onDragOver={(e) => handleDragOverSlot(e, idx)}
              onDrop={(e) => handleDropOnSlot(e, idx)}
            >
              <div className="slot-number-tag">Step {idx + 1}</div>

              {item ? (
                <div
                  className="slot-card-content"
                  draggable
                  onDragStart={(e) => handleDragStartFromSlot(e, idx, item)}
                >
                  <div className="slot-card-icon">{item.icon}</div>
                  <div className="slot-card-text">
                    <h5 className="slot-card-action">{item.action}</h5>
                    <p className="slot-card-desc">{item.desc}</p>
                  </div>
                  <button
                    className="slot-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromSlot(idx);
                    }}
                    title="Remove back to pool"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="slot-placeholder">
                  <span className="placeholder-icon">⬇</span>
                  <span className="placeholder-label">
                    {selectedPoolId ? 'Tap to Place' : 'Empty Step Slot'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Cards Pool */}
      <div className="hw-pool-section">
        <div className="hw-pool-header">
          <h4 className="hw-pool-title">Available Technique Cards Pool ({pool.length} remaining)</h4>
          {filledCount > 0 && (
            <button className="btn-secondary hw-reset-btn" onClick={handleReset}>
              ↺ Reset All Slots
            </button>
          )}
        </div>

        {pool.length === 0 ? (
          <div className="hw-pool-empty-message">
            <span>All 7 handwashing sequence slots have been assigned! Review your order above or click Submit.</span>
          </div>
        ) : (
          <div className="hw-pool-grid">
            {pool.map((item) => {
              const isSelected = selectedPoolId === item.id;
              return (
                <div
                  key={item.id}
                  className={`hw-pool-card ${isSelected ? 'selected' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStartFromPool(e, item)}
                  onClick={() => handlePoolCardClick(item)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="pool-card-top">
                    <span className="pool-card-icon">{item.icon}</span>
                    <span className="pool-card-action">{item.action}</span>
                  </div>
                  <p className="pool-card-desc">{item.desc}</p>
                  <div className="pool-card-hint">
                    {selectedSlotIndex !== null ? '👉 Tap to assign to Step ' + (selectedSlotIndex + 1) : '👆 Tap or Drag to place'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="hw-sequence-footer">
        <button
          className="btn-primary btn-submit-sequence"
          onClick={handleSubmit}
          disabled={filledCount === 0}
          style={{ opacity: filledCount === 0 ? 0.5 : 1 }}
        >
          Submit Handwashing Sequence & Proceed to Tool Safety ➔
        </button>
      </div>
    </div>
  );
};
