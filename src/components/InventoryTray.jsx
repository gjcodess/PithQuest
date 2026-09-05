import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../audio/soundManager';

/**
 * InventoryTray: Horizontal bottom shelf of draggable and clickable tools & ingredients
 * Recreates the beloved tactile cooking simulation experience with items lined up horizontally.
 */
export const InventoryTray = ({
  title = "Station Inventory & Tools",
  hint = "Click an item to hold, then drop or tap into the workstation",
  items = [],
  onItemClick,
}) => {
  const { holdingItem, setHoldingItem } = useGame();

  const handleCardClick = (item) => {
    if (item.isUsed) return;
    if (item.disabled && !item.onClick) return;
    soundManager.playClick();

    if (item.onClick) {
      item.onClick();
      return;
    }

    if (onItemClick) {
      onItemClick(item);
      return;
    }

    if (holdingItem?.id === item.id) {
      setHoldingItem(null);
    } else {
      setHoldingItem({
        id: item.id,
        name: item.name,
        img: item.img,
        icon: item.fallbackIcon || '🥣',
      });
    }
  };

  return (
    <div className="inventory-tray">
      <div className="tray-title-bar">
        <span className="tray-label">🧰 {title}:</span>
        <span className="tray-hint">{hint}</span>
      </div>
      <div className="items-carousel">
        {items.map((item) => {
          const isHeld = holdingItem?.id === item.id;
          const isUsed = item.isUsed;
          const isNext = item.isNext;

          return (
            <div
              key={item.id}
              className={`drag-card ${isHeld ? 'lifted selected-tap' : ''} ${isUsed ? 'used' : ''} ${isNext ? 'guide-pulse' : ''} ${item.disabled ? 'card-disabled' : ''}`}
              onClick={() => handleCardClick(item)}
              draggable={!isUsed && !item.disabled}
              onDragStart={(e) => {
                if (isUsed || item.disabled) return;
                e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, name: item.name }));
              }}
              title={item.tooltip || item.name}
              role="button"
              tabIndex={0}
            >
              <img
                src={item.img}
                alt={item.name}
                className="card-icon-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="card-fallback-icon" style={{ display: 'none', fontSize: '1.8rem' }}>
                {item.fallbackIcon || '🥣'}
              </span>
              <span className="card-title">{item.name}</span>
              {item.measure && <span className="card-measure">{item.measure}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
