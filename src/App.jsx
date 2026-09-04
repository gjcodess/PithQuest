import React from 'react';
import { useGame } from './context/GameContext';
import { HeaderHUD } from './components/HeaderHUD';
import { DialogueBox } from './components/DialogueBox';
import { Toast } from './components/Toast';
import { RecipeModal } from './components/Modals/RecipeModal';
import { ObjectivesModal } from './components/Modals/ObjectivesModal';
import { ConfirmModal } from './components/Modals/ConfirmModal';

// Scenes
import { TitleScene } from './scenes/TitleScene';
import { OrientationScene } from './scenes/OrientationScene';
import { Mission1Prep } from './scenes/Mission1Prep';
import { Mission2Boiling } from './scenes/Mission2Boiling';
import { Mission3Mixing } from './scenes/Mission3Mixing';
import { Mission4Dehydration } from './scenes/Mission4Dehydration';
import { Mission5Frying } from './scenes/Mission5Frying';
import { EvaluationScene } from './scenes/EvaluationScene';

export const App = () => {
  const { scene } = useGame();

  const renderScene = () => {
    switch (scene) {
      case 'title':
        return <TitleScene />;
      case 'orientation':
        return <OrientationScene />;
      case 'mission1':
        return <Mission1Prep />;
      case 'mission2':
        return <Mission2Boiling />;
      case 'mission3':
        return <Mission3Mixing />;
      case 'mission4':
        return <Mission4Dehydration />;
      case 'mission5':
        return <Mission5Frying />;
      case 'evaluation':
        return <EvaluationScene />;
      default:
        return <TitleScene />;
    }
  };

  return (
    <div className="game-app">
      <HeaderHUD />
      <main className="game-viewport">
        <div className="scene-container">
          {renderScene()}
        </div>
        {scene !== 'title' && <DialogueBox />}
      </main>
      <Toast />
      <RecipeModal />
      <ObjectivesModal />
      <ConfirmModal />
    </div>
  );
};
