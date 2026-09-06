import React from 'react';
import { useGame } from './context/GameContext';
import { HeaderHUD } from './components/HeaderHUD';
import { DialogueBox } from './components/DialogueBox';
import { Toast } from './components/Toast';
import { RecipeModal } from './components/Modals/RecipeModal';
import { ObjectivesModal } from './components/Modals/ObjectivesModal';
import { ConfirmModal } from './components/Modals/ConfirmModal';
import { FloatingItemCursor } from './components/FloatingItemCursor';

// Scenes
import { TitleScene } from './scenes/TitleScene';
import { OrientationScene } from './scenes/OrientationScene';
import { Mission1Prep } from './scenes/Mission1Prep';
import { Mission2Grinding } from './scenes/Mission2Grinding';
import { Mission3Mixing } from './scenes/Mission3Mixing';
import { Mission4Molding } from './scenes/Mission4Molding';
import { Mission5Steaming } from './scenes/Mission5Steaming';
import { Mission6Dehydration } from './scenes/Mission6Dehydration';
import { Mission7Frying } from './scenes/Mission7Frying';
import { Mission8Packaging } from './scenes/Mission8Packaging';
import { EvaluationScene } from './scenes/EvaluationScene';

export const App = () => {
  const { scene, stageKey, isDialogueCollapsed, isInventoryCollapsed } = useGame();

  const renderScene = () => {
    switch (scene) {
      case 'title':
        return <TitleScene />;
      case 'orientation':
        return <OrientationScene key={`orientation-${stageKey}`} />;
      case 'mission1':
        return <Mission1Prep key={`mission1-${stageKey}`} />;
      case 'mission2':
        return <Mission2Grinding key={`mission2-${stageKey}`} />;
      case 'mission3':
        return <Mission3Mixing key={`mission3-${stageKey}`} />;
      case 'mission4':
        return <Mission4Molding key={`mission4-${stageKey}`} />;
      case 'mission5':
        return <Mission5Steaming key={`mission5-${stageKey}`} />;
      case 'mission6':
        return <Mission6Dehydration key={`mission6-${stageKey}`} />;
      case 'mission7':
        return <Mission7Frying key={`mission7-${stageKey}`} />;
      case 'mission8':
        return <Mission8Packaging key={`mission8-${stageKey}`} />;
      case 'evaluation':
        return <EvaluationScene />;
      default:
        return <TitleScene />;
    }
  };

  return (
    <div className="game-app">
      <HeaderHUD />
      <main
        className={`game-viewport ${
          isDialogueCollapsed ? 'dialogue-collapsed' : 'dialogue-expanded'
        } ${
          isInventoryCollapsed ? 'inventory-collapsed' : 'inventory-expanded'
        }`}
      >
        <div className="scene-container">
          {renderScene()}
        </div>
        {scene !== 'title' && <DialogueBox />}
      </main>
      <Toast />
      <RecipeModal />
      <ObjectivesModal />
      <ConfirmModal />
      <FloatingItemCursor />
    </div>
  );
};
