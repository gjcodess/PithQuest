import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';
import { HANDWASHING_STEPS } from '../data/orientationData';

export const HandwashingSequenceActivity = ({
  initialSlots = null,
  initialPool = null,
  onSequenceChange,
  onComplete,
  isLocked = false,
}) => {
  const { speak, setIsDialogueCollapsed } = useGame();
  const lockedClicksRef = useRef(0);

  const handleLockedInteraction = () => {
    soundManager.playError();
    lockedClicksRef.current += 1;
    if (lockedClicksRef.current >= 2) {
      speak(
        "You've already completed the Pre-Test! Your submitted handwashing sequence is locked in your assessment records and cannot be reorganized.",
        'thinking',
        {
          badge: 'Pre-Test Completed',
          note: 'Handwashing benchmark results are saved for your final score audit.',
          hint: 'Click "Proceed to Tool Safety Inspection" below or choose a section from the subnav above.',
        }
      );
      setIsDialogueCollapsed(false);
      lockedClicksRef.current = 0;
    }
  };

  // 10 Total Cards (7 correct steps + 3 distractors)
  const [pool, setPool] = useState(() => {
    if (initialPool && Array.isArray(initialPool)) return initialPool;
    if (initialSlots && Array.isArray(initialSlots)) {
      const placedIds = new Set(initialSlots.filter(Boolean).map((s) => s.id));
      return HANDWASHING_STEPS.filter((s) => !placedIds.has(s.id)).sort(() => Math.random() - 0.5);
    }
    return [...HANDWASHING_STEPS].sort(() => Math.random() - 0.5);
  });

  // 7 Sequence Slots (null or step object)
  const [slots, setSlots] = useState(() => {
    if (initialSlots && Array.isArray(initialSlots) && initialSlots.length === 7) {
      return initialSlots;
    }
    return Array(7).fill(null);
  });

  // Selection states for click-to-place / tap-to-swap
  const [selectedPoolId, setSelectedPoolId] = useState(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  // Live Dynamic Drag States
  const [draggedSlotIndex, setDraggedSlotIndex] = useState(null);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState(null);
  const [draggedPoolItem, setDraggedPoolItem] = useState(null);
  const [isDragOverPool, setIsDragOverPool] = useState(false);
  const touchOriginRef = useRef(null);

  // Notify parent of updates
  const notifyChange = (newSlots, newPool) => {
    if (onSequenceChange) {
      const submittedSteps = newSlots.filter(Boolean);
      const correctSteps = HANDWASHING_STEPS.filter((s) => s.isCorrect);
      const distractorsIncluded = submittedSteps.filter((s) => !s.isCorrect);
      const isAllCorrect =
        submittedSteps.length === 7 &&
        submittedSteps.every((step, idx) => step.isCorrect && step.step === idx + 1);

      onSequenceChange({
        submittedSteps,
        correctSequence: correctSteps,
        distractorsIncluded,
        isAllCorrect,
        slots: newSlots,
        pool: newPool,
      });
    }
  };

  // Assign an item from pool to a slot
  const placeItemInSlot = (item, targetSlotIndex) => {
    if (isLocked) {
      handleLockedInteraction();
      return;
    }
    soundManager.playClick();
    const newSlots = [...slots];
    const newPool = pool.filter((p) => p.id !== item.id);

    // If target slot already has an item, return that item to pool
    if (newSlots[targetSlotIndex]) {
      newPool.push(newSlots[targetSlotIndex]);
    }

    newSlots[targetSlotIndex] = item;
    setSlots(newSlots);
    setPool(newPool);
    setSelectedPoolId(null);
    setSelectedSlotIndex(null);
    notifyChange(newSlots, newPool);
  };

  // Remove item from slot back to pool
  const removeItemFromSlot = (slotIndex) => {
    if (isLocked) {
      handleLockedInteraction();
      return;
    }
    soundManager.playClick();
    const item = slots[slotIndex];
    if (!item) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    const newPool = [...pool, item];
    setSlots(newSlots);
    setPool(newPool);
    setSelectedSlotIndex(null);
    notifyChange(newSlots, newPool);
  };

  // Handle pool card click
  const handlePoolCardClick = (item) => {
    if (isLocked) {
      handleLockedInteraction();
      return;
    }
    if (selectedSlotIndex !== null) {
      placeItemInSlot(item, selectedSlotIndex);
      return;
    }

    if (selectedPoolId === item.id) {
      setSelectedPoolId(null);
      return;
    }

    // Auto-place in first empty slot if available
    const firstEmptyIndex = slots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      placeItemInSlot(item, firstEmptyIndex);
    } else {
      setSelectedPoolId(item.id);
      soundManager.playClick();
    }
  };

  // Handle slot click (Tap-to-Swap / Tap-to-Place)
  const handleSlotClick = (slotIndex) => {
    if (isLocked) {
      handleLockedInteraction();
      return;
    }
    if (selectedPoolId) {
      const item = pool.find((p) => p.id === selectedPoolId);
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
      // Instant Tap-to-Swap between two slots
      soundManager.playClick();
      const newSlots = [...slots];
      const temp = newSlots[selectedSlotIndex];
      newSlots[selectedSlotIndex] = newSlots[slotIndex];
      newSlots[slotIndex] = temp;
      setSlots(newSlots);
      setSelectedSlotIndex(null);
      notifyChange(newSlots, pool);
    }
  };

  // ==========================================
  // Desktop Drag Handlers (Live Dynamic Shift)
  // ==========================================
  const handleSlotDragStart = (e, index) => {
    if (isLocked || !slots[index]) return;
    setSelectedSlotIndex(null);
    setSelectedPoolId(null);
    setDraggedSlotIndex(index);
    setDragOverSlotIndex(index);
    e.dataTransfer.setData('text/plain', `slot:${index}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePoolDragStart = (e, item) => {
    if (isLocked) return;
    setSelectedSlotIndex(null);
    setSelectedPoolId(null);
    setDraggedPoolItem(item);
    e.dataTransfer.setData('text/plain', `pool:${item.id}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSlotDragEnter = (e, targetIndex) => {
    if (isLocked) return;
    e.preventDefault();

    // If dragging a slot across other slots: LIVE DYNAMIC SHIFT
    if (draggedSlotIndex !== null && draggedSlotIndex !== targetIndex) {
      const newSlots = [...slots];
      const [movedItem] = newSlots.splice(draggedSlotIndex, 1);
      newSlots.splice(targetIndex, 0, movedItem);
      setSlots(newSlots);
      setDraggedSlotIndex(targetIndex);
      setDragOverSlotIndex(targetIndex);
      soundManager.playClick();
      notifyChange(newSlots, pool);
    } else if (draggedPoolItem !== null) {
      setDragOverSlotIndex(targetIndex);
    }
  };

  const handleSlotDragOver = (e, targetIndex) => {
    if (isLocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSlotIndex !== targetIndex) {
      setDragOverSlotIndex(targetIndex);
    }
  };

  const handleSlotDrop = (e, targetIndex) => {
    if (isLocked) return;
    e.preventDefault();
    setDragOverSlotIndex(null);

    // If dropped from pool into slot
    if (draggedPoolItem) {
      placeItemInSlot(draggedPoolItem, targetIndex);
    }

    setDraggedSlotIndex(null);
    setDraggedPoolItem(null);
  };

  const handleDragEnd = () => {
    setDraggedSlotIndex(null);
    setDragOverSlotIndex(null);
    setDraggedPoolItem(null);
    setIsDragOverPool(false);
  };

  // Drag over pool to remove
  const handlePoolDragOver = (e) => {
    if (isLocked || draggedSlotIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOverPool) setIsDragOverPool(true);
  };

  const handlePoolDragLeave = () => {
    setIsDragOverPool(false);
  };

  const handlePoolDrop = (e) => {
    if (isLocked) return;
    e.preventDefault();
    setIsDragOverPool(false);
    if (draggedSlotIndex !== null) {
      removeItemFromSlot(draggedSlotIndex);
      setDraggedSlotIndex(null);
    }
  };

  // ==========================================
  // Tablet Touch Drag Handlers (Dynamic Reorder)
  // ==========================================
  const handleTouchStart = (e, index) => {
    if (isLocked || !slots[index]) return;
    const touch = e.touches[0];
    touchOriginRef.current = { index, startX: touch.clientX, startY: touch.clientY, hasMoved: false };
  };

  const handleTouchMove = (e) => {
    if (isLocked || !touchOriginRef.current) return;
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchOriginRef.current.startX);
    const deltaY = Math.abs(touch.clientY - touchOriginRef.current.startY);

    if (deltaX > 8 || deltaY > 8) {
      touchOriginRef.current.hasMoved = true;
      if (e.cancelable) e.preventDefault();
    }

    if (!touchOriginRef.current.hasMoved) return;

    if (draggedSlotIndex === null) {
      setDraggedSlotIndex(touchOriginRef.current.index);
    }

    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!targetElement) return;

    const wrapper = targetElement.closest('.hw-slot-box');
    if (wrapper && wrapper.dataset.slotIndex !== undefined) {
      const targetIndex = parseInt(wrapper.dataset.slotIndex, 10);
      const currentIndex = draggedSlotIndex !== null ? draggedSlotIndex : touchOriginRef.current.index;
      if (!isNaN(targetIndex) && targetIndex !== currentIndex && targetIndex >= 0 && targetIndex < slots.length) {
        const newSlots = [...slots];
        const [movedItem] = newSlots.splice(currentIndex, 1);
        newSlots.splice(targetIndex, 0, movedItem);
        setSlots(newSlots);
        setDraggedSlotIndex(targetIndex);
        setDragOverSlotIndex(targetIndex);
        touchOriginRef.current.index = targetIndex;
        soundManager.playClick();
        notifyChange(newSlots, pool);
      }
    }
  };

  const handleTouchEnd = (index) => {
    if (touchOriginRef.current && !touchOriginRef.current.hasMoved) {
      // Tap-to-swap
      handleSlotClick(index);
    }
    touchOriginRef.current = null;
    setDraggedSlotIndex(null);
    setDragOverSlotIndex(null);
  };

  const handleReset = () => {
    if (isLocked) {
      handleLockedInteraction();
      return;
    }
    soundManager.playClick();
    const newPool = [...HANDWASHING_STEPS].sort(() => Math.random() - 0.5);
    const newSlots = Array(7).fill(null);
    setPool(newPool);
    setSlots(newSlots);
    setSelectedPoolId(null);
    setSelectedSlotIndex(null);
    notifyChange(newSlots, newPool);
  };

  const handleSubmit = () => {
    if (!isLocked && filledCount < 7) {
      soundManager.playError();
      return;
    }

    soundManager.playSuccess();
    const submittedSteps = slots.filter(Boolean);
    const correctSteps = HANDWASHING_STEPS.filter((s) => s.isCorrect);
    const distractorsIncluded = submittedSteps.filter((s) => !s.isCorrect);
    const isAllCorrect =
      submittedSteps.length === 7 &&
      submittedSteps.every((step, idx) => step.isCorrect && step.step === idx + 1);

    const payload = {
      submittedSteps,
      correctSequence: correctSteps,
      distractorsIncluded,
      isAllCorrect,
      slots,
      pool,
    };

    if (onComplete) {
      onComplete(payload);
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
            {isLocked
              ? '🔒 Pre-Test Completed: Review your submitted handwashing sequence below.'
              : 'Drag steps between slots to reorder live, or tap to swap! Beware of 3 hazardous distractor practices.'}
          </p>
        </div>
        <div className="hw-count-badge">
          <span>{isLocked ? '🔒 Submitted' : `${filledCount}/7 Steps Assigned`}</span>
        </div>
      </div>

      {/* Target Slots (1 to 7) with Live Interactive Reordering */}
      <div className="hw-slots-grid">
        {slots.map((item, idx) => {
          const isSelected = selectedSlotIndex === idx;
          const isDragging = draggedSlotIndex === idx;
          const isHoverTarget = dragOverSlotIndex === idx && !isDragging;

          return (
            <div
              key={idx}
              data-slot-index={idx}
              className={`hw-slot-box ${item ? 'filled' : 'empty'} ${isSelected ? 'selected' : ''} ${
                isDragging ? 'is-dragging-slot is-drag-origin' : ''
              } ${isHoverTarget ? 'drag-over-target' : ''} ${isLocked ? 'is-locked' : ''}`}
              onClick={() => handleSlotClick(idx)}
              onDragOver={(e) => handleSlotDragOver(e, idx)}
              onDragEnter={(e) => handleSlotDragEnter(e, idx)}
              onDrop={(e) => handleSlotDrop(e, idx)}
              draggable={!isLocked && Boolean(item)}
              onDragStart={(e) => handleSlotDragStart(e, idx)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, idx)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(idx)}
            >
              <div className="slot-top-row">
                <div className="slot-number-tag">Step {idx + 1}</div>
                {item && !isLocked && (
                  <button
                    className="slot-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromSlot(idx);
                    }}
                    title="Remove back to pool"
                    aria-label="Remove step"
                  >
                    ✕
                  </button>
                )}
              </div>

              {item ? (
                <div className={`slot-card-content ${isDragging ? 'is-dragging' : ''}`}>
                  <div className="slot-card-text">
                    <h5 className="slot-card-action">{item.action}</h5>
                    <p className="slot-card-desc">{item.desc}</p>
                  </div>
                  {!isLocked && (
                    <div className="slot-drag-handle-hint">
                      <span className="drag-dots">⋮⋮</span>
                      <span>{isSelected ? 'Selected' : 'Drag / Tap'}</span>
                    </div>
                  )}
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
      {!isLocked && (
        <div
          className={`hw-pool-section ${isDragOverPool ? 'pool-drop-target' : ''}`}
          onDragOver={handlePoolDragOver}
          onDragLeave={handlePoolDragLeave}
          onDrop={handlePoolDrop}
        >
          <div className="hw-pool-header">
            <h4 className="hw-pool-title">
              {isDragOverPool
                ? '⬇ Drop here to remove card back to pool'
                : `Available Technique Cards Pool (${pool.length} remaining)`}
            </h4>
            {filledCount > 0 && (
              <button className="btn-secondary hw-reset-btn" onClick={handleReset}>
                ↺ Reset All Slots
              </button>
            )}
          </div>

          {pool.length === 0 ? (
            <div className="hw-pool-empty-message">
              <span>All 7 handwashing sequence slots have been assigned! Drag cards between slots to reorder live, or click Submit below.</span>
            </div>
          ) : (
            <div className="hw-pool-grid">
              {pool.map((item) => {
                const isSelected = selectedPoolId === item.id;
                const isBeingDragged = draggedPoolItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`hw-pool-card ${isSelected ? 'selected' : ''} ${isBeingDragged ? 'is-dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handlePoolDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handlePoolCardClick(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="pool-card-top">
                      <h5 className="pool-card-action">{item.action}</h5>
                    </div>
                    <p className="pool-card-desc">{item.desc}</p>
                    <div className="pool-card-hint">
                      {selectedSlotIndex !== null
                        ? '👉 Tap to assign to Step ' + (selectedSlotIndex + 1)
                        : '👆 Tap or Drag to place'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="hw-sequence-footer">
        <button
          className="btn-primary btn-submit-sequence"
          onClick={handleSubmit}
          disabled={!isLocked && filledCount < 7}
        >
          {isLocked
            ? 'Proceed to Tool Safety Inspection ➔'
            : 'Submit Handwashing Sequence & Proceed to Tool Safety ➔'}
        </button>
      </div>
    </div>
  );
};
