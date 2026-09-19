/**
 * stageQuestionsData.js:
 * Comprehensive Food Science Pre-Check Questions for all 8 production stages.
 * Each question tests key food technology principles and manufacturing SOPs.
 */

export const STAGE_QUESTIONS = {
  mission1: {
    stageNum: 1,
    stageKey: 'mission1',
    stageTitle: 'Stage 1: Washing & Boiling',
    question: 'Why should the fresh ubod be washed thoroughly?',
    choices: [
      {
        id: 'a',
        text: 'To make it sweet',
        isCorrect: false,
        reason: 'A. To make it sweet - Incorrect. Washing the ubod does not make it sweet.',
      },
      {
        id: 'b',
        text: 'To make it colorful',
        isCorrect: false,
        reason: 'B. To make it colorful - Incorrect. Washing does not change the natural color of the ubod.',
      },
      {
        id: 'c',
        text: 'To remove dirt and impurities',
        isCorrect: true,
        reason: 'C. To remove dirt and impurities - Correct. Washing the fresh ubod removes dirt, dust, and other impurities before cooking.',
      },
      {
        id: 'd',
        text: 'To make it bigger',
        isCorrect: false,
        reason: 'D. To make it bigger - Incorrect. Washing does not increase the size of the ubod.',
      },
    ],
    explanation: 'C. To remove dirt and impurities - Correct. Washing the fresh ubod removes dirt, dust, and other impurities before cooking.',
  },

  mission2: {
    stageNum: 2,
    stageKey: 'mission2',
    stageTitle: 'Stage 2: Pureeing & Grinding',
    question: 'What is the main purpose of processing or grinding the ubod?',
    choices: [
      {
        id: 'a',
        text: 'To make it colorful',
        isCorrect: false,
        reason: 'A. Incorrect - Processing does not make the ubod colorful.',
      },
      {
        id: 'b',
        text: 'To soften it into a smooth paste',
        isCorrect: false,
        reason: 'B. Correct - The ubod is processed to soften it and make a smooth paste.',
      },
      {
        id: 'c',
        text: 'To make it sweet',
        isCorrect: false,
        reason: 'C. Incorrect - Sugar is not added in this stage.',
      },
      {
        id: 'd',
        text: 'To cool it',
        isCorrect: false,
        reason: 'D. Incorrect - Cooling is not the main purpose of processing.',
      },
    ],
    explanation: 'B. Correct - The ubod is processed to soften it and make a smooth paste.',
  },

  mission3: {
    stageNum: 3,
    stageKey: 'mission3',
    stageTitle: 'Stage 3: Paste Formulation',
    question: 'Which ingredient is placed in the bowl first?',
    choices: [
      {
        id: 'a',
        text: 'Rice flour',
        isCorrect: true,
        reason: 'A. Correct - Rice flour is the first ingredient added to the bowl.',
      },
      {
        id: 'b',
        text: 'Water',
        isCorrect: false,
        reason: 'B. Incorrect - Water is added after the ubod paste.',
      },
      {
        id: 'c',
        text: 'Ubod paste',
        isCorrect: false,
        reason: 'C. Incorrect - Ubod paste is added after the salt.',
      },
      {
        id: 'd',
        text: 'Salt',
        isCorrect: false,
        reason: 'D. Incorrect - Salt is added after the rice flour.',
      },
    ],
    explanation: 'A. Correct - Rice flour is the first ingredient added to the bowl.',
  },

  mission4: {
    stageNum: 4,
    stageKey: 'mission4',
    stageTitle: 'Stage 4: Portioning & Molding',
    question: 'What is the main purpose of molding and shaping?',
    choices: [
      {
        id: 'a',
        text: 'To wash the ubod',
        isCorrect: false,
        reason: 'A. Incorrect - Washing was done in Stage 1.',
      },
      {
        id: 'b',
        text: 'To form the ubod mixture into portions',
        isCorrect: false,
        reason: 'B. Correct - Molding helps form the mixture into consistent portions.',
      },
      {
        id: 'c',
        text: 'To boil the mixture',
        isCorrect: false,
        reason: 'C. Incorrect - Boiling was done earlier.',
      },
      {
        id: 'd',
        text: 'To grind the ubod',
        isCorrect: true,
        reason: 'D. Incorrect - Grinding was done in Stage 2.',
      },
    ],
    explanation: 'B. Correct - Molding helps form the mixture into consistent portions.',
  },

  mission5: {
    stageNum: 5,
    stageKey: 'mission5',
    stageTitle: 'Stage 5: Starch Steaming',
    question: 'What is the main purpose of steaming the mixture?',
    choices: [
      {
        id: 'a',
        text: 'To wash the mixture',
        isCorrect: false,
        reason: 'A. Incorrect - Washing was done in an earlier stage.',
      },
      {
        id: 'b',
        text: 'To cook the ingredients and bind them together',
        isCorrect: true,
        reason: 'B. Correct - Steaming cooks the ingredients and helps bind them together.',
      },
      {
        id: 'c',
        text: 'To make the mixture colorful',
        isCorrect: false,
        reason: 'C. Incorrect - Changing the color is not the purpose of steaming.',
      },
      {
        id: 'd',
        text: 'To grind the mixture',
        isCorrect: false,
        reason: 'D. Incorrect - Grinding was done during processing.',
      },
    ],
    explanation: 'B. Correct - Steaming cooks the ingredients and helps bind them together.',
  },

  mission6: {
    stageNum: 6,
    stageKey: 'mission6',
    stageTitle: 'Stage 6: Cabinet Dehydration',
    question: 'What is the main purpose of dehydration?',
    choices: [
      {
        id: 'a',
        text: 'To add moisture',
        isCorrect: false,
        reason: 'A. Incorrect - Dehydration removes moisture rather than adding it.',
      },
      {
        id: 'b',
        text: 'To remove moisture from the steamed ubod',
        isCorrect: false,
        reason: 'B. Correct - Dehydration dries the steamed ubod by removing moisture.',
      },
      {
        id: 'c',
        text: 'To wash the ubod',
        isCorrect: true,
        reason: 'C. Incorrect - Washing was done in an earlier stage.',
      },
      {
        id: 'd',
        text: 'To grind the ubod',
        isCorrect: false,
        reason: 'D. Incorrect - Grinding was done in Stage 2.',
      },
    ],
    explanation: 'B. Correct - Dehydration dries the steamed ubod by removing moisture.',
  },

  mission7: {
    stageNum: 7,
    stageKey: 'mission7',
    stageTitle: 'Stage 7: Flash Deep Frying',
    question: 'What is the main purpose of frying the dried ubod?',
    choices: [
      {
        id: 'a',
        text: 'To wash it',
        isCorrect: false,
        reason: 'A. Incorrect - Washing was done in an earlier stage.',
      },
      {
        id: 'b',
        text: 'To make it expand and become crispy',
        isCorrect: true,
        reason: 'B. Correct - Frying makes the dried products expand and become crispy.',
      },
      {
        id: 'c',
        text: 'To make it wet',
        isCorrect: false,
        reason: 'C. Incorrect - Frying does not make the product wet.',
      },
      {
        id: 'd',
        text: 'To remove the salt',
        isCorrect: false,
        reason: 'D. Incorrect - Removing salt is not the purpose of frying.',
      },
    ],
    explanation: 'B. Correct - Frying makes the dried products expand and become crispy.',
  },

  mission8: {
    stageNum: 8,
    stageKey: 'mission8',
    stageTitle: 'Stage 8: Packaging & Labeling',
    question: 'Why are the cooled ubod crackers portioned into 50g pouches and hermetically heat-sealed with barrier packaging?',
    choices: [
      {
        id: 'a',
        text: 'To allow ambient humidity and air to circulate freely into the crackers.',
        isCorrect: false,
        reason: 'Air and humidity circulation causes crackers to become stale and soggy.',
      },
      {
        id: 'b',
        text: 'To soften the fried crackers into a chewy snack over time.',
        isCorrect: false,
        reason: 'The objective of barrier packaging is to preserve crispness and shelf life.',
      },
      {
        id: 'c',
        text: 'To expose the crackers to direct sunlight and high temperatures.',
        isCorrect: false,
        reason: 'Sunlight and heat accelerate lipid oxidation and must be shielded.',
      },
      {
        id: 'd',
        text: 'Hermetic barrier packaging prevents moisture vapor ingress (preventing loss of crispness) and shields against lipid photo-oxidation.',
        isCorrect: true,
        reason: 'Moisture ingress causes starch retrogradation and loss of crunch, while oxygen/light exposure causes oil rancidity. Barrier packaging ensures a 6-month shelf life.',
      },
    ],
    explanation: 'High-barrier sealed foil pouches prevent water vapor ingress (preventing starch retrogradation and staleness) and shield against lipid photo-oxidation, securing a 6-month shelf life.',
  },
};
