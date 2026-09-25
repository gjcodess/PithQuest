/**
 * Checkpoint questions in the same order as the client document:
 * Question 1 -> Stage 1 -> Question 2 -> Stage 2 -> ... -> Question 8 -> Stage 8.
 */

export const STAGE_QUESTIONS = {
  mission1: {
    stageNum: 1,
    stageKey: 'mission1',
    stageTitle: 'Question 1: Main Ingredient',
    question: 'What is the main ingredient when making the Ubod Crackers?',
    choices: [
      { id: 'a', text: 'Salt', isCorrect: false, reason: 'Wrong (salt): It just enhances the flavor' },
      { id: 'b', text: 'Water', isCorrect: false, reason: 'Water: helps binding the ingredients' },
      { id: 'c', text: 'Oil', isCorrect: false, reason: 'Oil: Use for frying the food' },
      { id: 'd', text: 'Coconut Palm', isCorrect: true, reason: 'Correct: Coconut palm. It is the main ingredient in making the ubod crackers' },
    ],
    explanation: 'Correct: Coconut palm. It is the main ingredient in making the ubod crackers',
  },

  mission2: {
    stageNum: 2,
    stageKey: 'mission2',
    stageTitle: 'Question 2: Stage 1',
    question: 'Why should the fresh ubod be washed thoroughly?',
    choices: [
      { id: 'a', text: 'To make it sweet', isCorrect: false, reason: 'A. To make it sweet - Incorrect. Washing the ubod does not make it sweet.' },
      { id: 'b', text: 'To make it colorful', isCorrect: false, reason: 'B. To make it colorful - Incorrect. Washing does not change the natural color of the ubod.' },
      { id: 'c', text: 'To remove dirt and impurities', isCorrect: true, reason: 'C. To remove dirt and impurities - Correct. Washing the fresh ubod removes dirt, dust, and other impurities before cooking.' },
      { id: 'd', text: 'To make it bigger', isCorrect: false, reason: 'D. To make it bigger - Incorrect. Washing does not increase the size of the ubod.' },
    ],
    explanation: 'C. To remove dirt and impurities - Correct. Washing the fresh ubod removes dirt, dust, and other impurities before cooking.',
  },

  mission3: {
    stageNum: 3,
    stageKey: 'mission3',
    stageTitle: 'Question 3: Stage 2',
    question: 'What is the main purpose of processing or grinding the ubod?',
    choices: [
      { id: 'a', text: 'To make it colorful', isCorrect: false, reason: 'A. Incorrect - Processing does not make the ubod colorful.' },
      { id: 'b', text: 'To soften it into a smooth paste', isCorrect: true, reason: 'B. Correct - The ubod is processed to soften it and make a smooth paste.' },
      { id: 'c', text: 'To make it sweet', isCorrect: false, reason: 'C. Incorrect - Sugar is not added in this stage.' },
      { id: 'd', text: 'To cool it', isCorrect: false, reason: 'D. Incorrect - Cooling is not the main purpose of processing.' },
    ],
    explanation: 'B. Correct - The ubod is processed to soften it and make a smooth paste.',
  },

  mission4: {
    stageNum: 4,
    stageKey: 'mission4',
    stageTitle: 'Question 4: Stage 3',
    question: 'Which ingredient is placed in the bowl first?',
    choices: [
      { id: 'a', text: 'Rice flour', isCorrect: true, reason: 'A. Correct - Rice flour is the first ingredient added to the bowl.' },
      { id: 'b', text: 'Water', isCorrect: false, reason: 'B. Incorrect - Water is added after the ubod paste.' },
      { id: 'c', text: 'Ubod paste', isCorrect: false, reason: 'C. Incorrect - Ubod paste is added after the salt.' },
      { id: 'd', text: 'Salt', isCorrect: false, reason: 'D. Incorrect - Salt is added after the rice flour.' },
    ],
    explanation: 'A. Correct - Rice flour is the first ingredient added to the bowl.',
  },

  mission5: {
    stageNum: 5,
    stageKey: 'mission5',
    stageTitle: 'Question 5: Stage 4',
    question: 'What is the main purpose of molding and shaping?',
    choices: [
      { id: 'a', text: 'To wash the ubod', isCorrect: false, reason: 'A. Incorrect - Washing was done in Stage 1.' },
      { id: 'b', text: 'To form the ubod mixture into portions', isCorrect: true, reason: 'B. Correct - Molding helps form the mixture into consistent portions.' },
      { id: 'c', text: 'To boil the mixture', isCorrect: false, reason: 'C. Incorrect - Boiling was done earlier.' },
      { id: 'd', text: 'To grind the ubod', isCorrect: false, reason: 'D. Incorrect - Grinding was done in Stage 2.' },
    ],
    explanation: 'B. Correct - Molding helps form the mixture into consistent portions.',
  },

  mission6: {
    stageNum: 6,
    stageKey: 'mission6',
    stageTitle: 'Question 6: Stage 5',
    question: 'What is the main purpose of steaming the mixture?',
    choices: [
      { id: 'a', text: 'To wash the mixture', isCorrect: false, reason: 'A. Incorrect - Washing was done in an earlier stage.' },
      { id: 'b', text: 'To cook the ingredients and bind them together', isCorrect: true, reason: 'B. Correct - Steaming cooks the ingredients and helps bind them together.' },
      { id: 'c', text: 'To make the mixture colorful', isCorrect: false, reason: 'C. Incorrect - Changing the color is not the purpose of steaming.' },
      { id: 'd', text: 'To grind the mixture', isCorrect: false, reason: 'D. Incorrect - Grinding was done during processing.' },
    ],
    explanation: 'B. Correct - Steaming cooks the ingredients and helps bind them together.',
  },

  mission7: {
    stageNum: 7,
    stageKey: 'mission7',
    stageTitle: 'Question 7: Stage 6',
    question: 'What is the main purpose of dehydration?',
    choices: [
      { id: 'a', text: 'To add moisture', isCorrect: false, reason: 'A. Incorrect - Dehydration removes moisture rather than adding it.' },
      { id: 'b', text: 'To remove moisture from the steamed ubod', isCorrect: true, reason: 'B. Correct - Dehydration dries the steamed ubod by removing moisture.' },
      { id: 'c', text: 'To wash the ubod', isCorrect: false, reason: 'C. Incorrect - Washing was done in an earlier stage.' },
      { id: 'd', text: 'To grind the ubod', isCorrect: false, reason: 'D. Incorrect - Grinding was done in Stage 2.' },
    ],
    explanation: 'B. Correct - Dehydration dries the steamed ubod by removing moisture.',
  },

  mission8: {
    stageNum: 8,
    stageKey: 'mission8',
    stageTitle: 'Question 8: Stage 7',
    question: 'What is the main purpose of frying the dried ubod?',
    choices: [
      { id: 'a', text: 'To wash it', isCorrect: false, reason: 'A. Incorrect - Washing was done in an earlier stage.' },
      { id: 'b', text: 'To make it expand and become crispy', isCorrect: true, reason: 'B. Correct - Frying makes the dried products expand and become crispy.' },
      { id: 'c', text: 'To make it wet', isCorrect: false, reason: 'C. Incorrect - Frying does not make the product wet.' },
      { id: 'd', text: 'To remove the salt', isCorrect: false, reason: 'D. Incorrect - Removing salt is not the purpose of frying.' },
    ],
    explanation: 'B. Correct - Frying makes the dried products expand and become crispy.',
  },
};
