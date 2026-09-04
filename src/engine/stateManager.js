/* ==========================================================================
   PITHQUEST STATE MANAGER
   Reactive State Engine & LocalStorage Persistence
   ========================================================================== */

class StateManager {
  constructor() {
    this.listeners = new Map();
    this.reset();
  }

  reset() {
    this.state = {
      studentName: localStorage.getItem('pithquest_name') || 'HE Student',
      currentScene: 'title', // 'title', 'orientation', 'mission1', 'mission2', 'mission3', 'mission4', 'mission5', 'evaluation'
      score: 0,
      mistakes: 0,
      stars: 3,
      badges: new Set(),
      missionsCompleted: {
        orientation: false,
        mission1: false,
        mission2: false,
        mission3: false,
        mission4: false,
        mission5: false,
      },
      currentStepIndex: 1
    };
  }

  getState() {
    return this.state;
  }

  setStudentName(name) {
    this.state.studentName = name || 'HE Student';
    localStorage.setItem('pithquest_name', this.state.studentName);
    this.emit('nameChange', this.state.studentName);
  }

  setScene(sceneName) {
    this.state.currentScene = sceneName;
    this.emit('sceneChange', sceneName);
  }

  addScore(points) {
    this.state.score += points;
    this.emit('scoreChange', this.state.score);
  }

  recordMistake() {
    this.state.mistakes += 1;
    if (this.state.mistakes > 4 && this.state.stars > 1) {
      this.state.stars = 2;
    } else if (this.state.mistakes > 8) {
      this.state.stars = 1;
    }
    this.emit('mistake', { mistakes: this.state.mistakes, stars: this.state.stars });
  }

  unlockBadge(badgeId, badgeTitle) {
    if (!this.state.badges.has(badgeId)) {
      this.state.badges.add(badgeId);
      this.emit('badgeUnlocked', { id: badgeId, title: badgeTitle });
    }
  }

  completeMission(missionKey) {
    if (this.state.missionsCompleted.hasOwnProperty(missionKey)) {
      this.state.missionsCompleted[missionKey] = true;
      this.emit('missionComplete', missionKey);
    }
  }

  // Event Subscription
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }
}

export const stateManager = new StateManager();
