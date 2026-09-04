/* ==========================================================================
   PITHQUEST UNIFIED DRAG & DROP ENGINE
   Dual Input: Touch + Mouse Dragging + Tap-to-Place Mobile Fallback
   ========================================================================== */

import { soundManager } from '../audio/soundManager.js';

export class DragDropManager {
  constructor() {
    this.activeDragElement = null;
    this.activeDragData = null;
    this.dragGhost = null;
    this.selectedItem = null; // For tap-to-place fallback
    this.dropCallback = null;
    this.dropzones = [];
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isDragging = false;

    this.initGlobalListeners();
  }

  setDropCallback(cb) {
    this.dropCallback = cb;
  }

  registerDropzone(element, id) {
    element.dataset.dropzoneId = id;
    if (!this.dropzones.includes(element)) {
      this.dropzones.push(element);
    }
  }

  clearDropzones() {
    this.dropzones = [];
    this.selectedItem = null;
  }

  attachDraggable(element, itemData) {
    element.classList.add('drag-card');
    element.dataset.itemId = itemData.id;

    // Pointer down handles both mouse & touch
    element.addEventListener('pointerdown', (e) => this.onPointerDown(e, element, itemData));
    
    // Tap-to-place click handler
    element.addEventListener('click', (e) => this.onItemClick(e, element, itemData));
  }

  onItemClick(e, element, itemData) {
    if (this.isDragging) return;
    if (element.classList.contains('used')) return;

    soundManager.playClick();

    // If another item was selected, unselect it
    if (this.selectedItem && this.selectedItem.element !== element) {
      this.selectedItem.element.classList.remove('selected-tap');
    }

    if (this.selectedItem && this.selectedItem.element === element) {
      // Toggle off
      element.classList.remove('selected-tap');
      this.selectedItem = null;
      this.highlightDropzones(false);
    } else {
      // Select for tap-to-place
      element.classList.add('selected-tap');
      this.selectedItem = { element, data: itemData };
      this.highlightDropzones(true);
    }
  }

  onDropzoneClick(dropzone) {
    if (!this.selectedItem) return;
    const itemData = this.selectedItem.data;
    const element = this.selectedItem.element;

    element.classList.remove('selected-tap');
    this.highlightDropzones(false);

    if (this.dropCallback) {
      this.dropCallback(itemData.id, dropzone.dataset.dropzoneId, element);
    }
    this.selectedItem = null;
  }

  onPointerDown(e, element, itemData) {
    if (element.classList.contains('used')) return;
    // Don't drag on right-click
    if (e.button && e.button !== 0) return;

    this.activeDragElement = element;
    this.activeDragData = itemData;
    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
    this.isDragging = false;

    // Create drag ghost
    this.createGhost(element, e.clientX, e.clientY);
  }

  createGhost(element, clientX, clientY) {
    if (this.dragGhost) this.dragGhost.remove();

    this.dragGhost = element.cloneNode(true);
    this.dragGhost.classList.add('drag-ghost');
    this.dragGhost.style.position = 'fixed';
    this.dragGhost.style.pointerEvents = 'none';
    this.dragGhost.style.zIndex = '10000';
    this.dragGhost.style.opacity = '0';
    this.dragGhost.style.transform = 'scale(1.1) rotate(-3deg)';
    this.dragGhost.style.transition = 'opacity 0.15s ease, transform 0.1s ease';
    this.dragGhost.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.4)';
    
    document.body.appendChild(this.dragGhost);
    this.updateGhostPos(clientX, clientY);
  }

  updateGhostPos(clientX, clientY) {
    if (!this.dragGhost) return;
    const w = this.dragGhost.offsetWidth || 80;
    const h = this.dragGhost.offsetHeight || 80;
    this.dragGhost.style.left = `${clientX - w / 2}px`;
    this.dragGhost.style.top = `${clientY - h / 2}px`;
  }

  initGlobalListeners() {
    window.addEventListener('pointermove', (e) => {
      if (!this.activeDragElement) return;

      const dist = Math.hypot(e.clientX - this.touchStartX, e.clientY - this.touchStartY);
      if (dist > 8 && !this.isDragging) {
        this.isDragging = true;
        this.activeDragElement.classList.add('dragging');
        if (this.dragGhost) this.dragGhost.style.opacity = '0.92';
        this.highlightDropzones(true);
      }

      if (this.isDragging) {
        this.updateGhostPos(e.clientX, e.clientY);
        this.checkHoverDropzone(e.clientX, e.clientY);
      }
    });

    window.addEventListener('pointerup', (e) => {
      if (!this.activeDragElement) return;

      if (this.isDragging) {
        const dropzone = this.findDropzoneAt(e.clientX, e.clientY);
        if (dropzone && this.dropCallback) {
          this.dropCallback(this.activeDragData.id, dropzone.dataset.dropzoneId, this.activeDragElement);
        }
      }

      this.cleanupDrag();
    });

    window.addEventListener('pointercancel', () => this.cleanupDrag());
  }

  checkHoverDropzone(clientX, clientY) {
    const target = this.findDropzoneAt(clientX, clientY);
    this.dropzones.forEach(dz => {
      if (dz === target) {
        dz.classList.add('hover-active');
      } else {
        dz.classList.remove('hover-active');
      }
    });
  }

  findDropzoneAt(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    return el.closest('.dropzone');
  }

  highlightDropzones(highlight) {
    this.dropzones.forEach(dz => {
      if (highlight) {
        dz.classList.add('highlight-ready');
      } else {
        dz.classList.remove('highlight-ready', 'hover-active');
      }
    });
  }

  cleanupDrag() {
    if (this.activeDragElement) {
      this.activeDragElement.classList.remove('dragging');
    }
    if (this.dragGhost) {
      this.dragGhost.remove();
      this.dragGhost = null;
    }
    this.highlightDropzones(false);
    this.activeDragElement = null;
    this.activeDragData = null;
    setTimeout(() => { this.isDragging = false; }, 50);
  }
}
