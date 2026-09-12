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
    question: 'Why is the raw coconut pith (ubod) boiled in water with a pinch of salt for 10–15 minutes before pureeing?',
    choices: [
      {
        id: 'a',
        text: 'To soften tough cellulosic fibers for smooth pureeing and inactivate polyphenol oxidase (browning enzymes).',
        isCorrect: true,
        reason: 'Thermal blanching hydrothermally solubilizes cell walls for fine milling and denatures polyphenol oxidase enzymes, preventing enzymatic browning.',
      },
      {
        id: 'b',
        text: 'To evaporate 100% of the water from the fresh pith before milling.',
        isCorrect: false,
        reason: 'Boiling in water hydrates and softens the plant material rather than dehydrating it.',
      },
      {
        id: 'c',
        text: 'To fry the exterior surface into an instant crunchy cracker.',
        isCorrect: false,
        reason: 'Boiling in 100°C water softens fibers for pureeing; frying occurs later in hot oil at 180°C.',
      },
      {
        id: 'd',
        text: 'To convert natural starches into dark caramelized sugars.',
        isCorrect: false,
        reason: 'Boiling at 100°C in water tenderizes fibers without reaching caramelization temperatures.',
      },
    ],
    explanation: 'Hydrothermal boiling (10–15 min) breaks down stubborn cellulosic fibers in coconut pith, solubilizing cellular walls for optimal pureeing while inactivating polyphenol oxidase to prevent enzymatic discoloration.',
  },

  mission2: {
    stageNum: 2,
    stageKey: 'mission2',
    stageTitle: 'Stage 2: Pureeing & Grinding',
    question: 'What is the primary food processing objective of high-speed pureeing the boiled ubod with salt into a fine paste?',
    choices: [
      {
        id: 'a',
        text: 'To rupture cell walls and create a homogenous, lump-free micro-matrix for uniform hydration with rice flour.',
        isCorrect: true,
        reason: 'High-shear mechanical pureeing homogenizes fibers into a smooth paste that easily hydrates and blends with rice starch polymers without coarse grittiness.',
      },
      {
        id: 'b',
        text: 'To separate the liquid juice from the pulp and discard all the solid fibers.',
        isCorrect: false,
        reason: 'All coconut pith fibers and natural pulp are retained to form the cracker matrix.',
      },
      {
        id: 'c',
        text: 'To freeze the pureed mixture into solid ice blocks.',
        isCorrect: false,
        reason: 'Pureeing is a mechanical homogenization process, not a freezing preservation step.',
      },
      {
        id: 'd',
        text: 'To ferment the coconut pith with probiotic bacterial cultures.',
        isCorrect: false,
        reason: 'Ubod CRUNCH manufacturing does not involve microbial fermentation.',
      },
    ],
    explanation: 'High-shear mechanical processing homogenizes boiled pith fibers into a uniform microscopic matrix, preventing grittiness and ensuring consistent hydration with starch polymers.',
  },

  mission3: {
    stageNum: 3,
    stageKey: 'mission3',
    stageTitle: 'Stage 3: Paste Formulation',
    question: 'Why is a calibrated 1:1 ratio (by volume/weight) of ubod paste to rice flour used during paste formulation?',
    choices: [
      {
        id: 'a',
        text: 'It provides balanced amylose and amylopectin starches with ubod moisture for cohesive dough viscoelasticity.',
        isCorrect: true,
        reason: 'The 1:1 ratio establishes the optimal starch-to-fiber balance, creating an extensible dough matrix capable of trapping steam bubbles for flash expansion.',
      },
      {
        id: 'b',
        text: 'To make the mixture runny and watery like a thin crepe batter.',
        isCorrect: false,
        reason: 'The dough must be cohesive and pliable, not liquid, to hold its shape in calibrated molds.',
      },
      {
        id: 'c',
        text: 'Because adding rice flour is optional and only used for color.',
        isCorrect: false,
        reason: 'Rice flour is the critical source of starch polymers needed for gelatinization and puffing.',
      },
      {
        id: 'd',
        text: 'To completely mask and eliminate the natural coconut pith flavor.',
        isCorrect: false,
        reason: 'The formulation highlights authentic ubod flavor while providing optimal physical texture.',
      },
    ],
    explanation: 'The 1:1 ratio of ubod puree to rice flour provides balanced amylose/amylopectin starch chains, creating the ideal cohesive dough viscoelasticity needed for structural puffing.',
  },

  mission4: {
    stageNum: 4,
    stageKey: 'mission4',
    stageTitle: 'Stage 4: Portioning & Molding',
    question: 'Why is the dough portioned uniformly (3 tsp per cavity) and leveled across all 24 mold cavities?',
    choices: [
      {
        id: 'a',
        text: 'Uniform thickness and dimensions ensure consistent heat penetration during steaming and even moisture diffusion during dehydration.',
        isCorrect: true,
        reason: 'Calibrated dimensions ensure uniform thermal conductivity and mass transfer, preventing uneven cooking, blistering, or raw cores.',
      },
      {
        id: 'b',
        text: 'To make the crackers take longer to dry inside the convection dehydrator.',
        isCorrect: false,
        reason: 'Level, uniform thickness optimizes and shortens the drying process rather than delaying it.',
      },
      {
        id: 'c',
        text: 'To create random, uneven cracker thicknesses for varied crunchiness.',
        isCorrect: false,
        reason: 'Commercial food manufacturing requires strict dimensional standardization for quality control.',
      },
      {
        id: 'd',
        text: 'To trap large air pockets and voids inside the molded dough.',
        isCorrect: false,
        reason: 'Leveling presses out excess air voids to ensure a dense, solid wafer structure.',
      },
    ],
    explanation: 'Standardized dimensions ensure uniform thermal conductivity and moisture diffusion during steaming and dehydration, preventing uneven core drying or blistering.',
  },

  mission5: {
    stageNum: 5,
    stageKey: 'mission5',
    stageTitle: 'Stage 5: Starch Steaming',
    question: 'What biochemical change occurs in the molded rice-ubod dough during the 10-minute steaming process at 100°C?',
    choices: [
      {
        id: 'a',
        text: 'Moist heat ruptures starch granules, causing irreversible gelatinization into a cohesive, extensible gel matrix.',
        isCorrect: true,
        reason: 'Thermal steaming gelatinizes the amylose and amylopectin starches, locking the molded shape into a continuous gel matrix capable of holding steam.',
      },
      {
        id: 'b',
        text: 'The starches burn and turn into dry carbon ash.',
        isCorrect: false,
        reason: 'Steaming at 100°C cooks with moist vapor without burning.',
      },
      {
        id: 'c',
        text: 'All moisture is completely removed from the dough immediately.',
        isCorrect: false,
        reason: 'Steaming adds moisture to gelatinize starches; moisture removal takes place during dehydration in Stage 6.',
      },
      {
        id: 'd',
        text: 'The dough dissolves completely into liquid water.',
        isCorrect: false,
        reason: 'Gelatinization sets the dough into a firm, translucent solid wafer.',
      },
    ],
    explanation: 'Moist heat at 100°C ruptures starch granules, causing irreversible gelatinization that locks the wafer shape into an extensible viscoelastic gel matrix capable of holding steam bubbles.',
  },

  mission6: {
    stageNum: 6,
    stageKey: 'mission6',
    stageTitle: 'Stage 6: Cabinet Dehydration',
    question: 'Why must the steamed crackers be dehydrated at 90°C for 12 hours until moisture content drops below 10%?',
    choices: [
      {
        id: 'a',
        text: 'Removing free water transitions the gelatinized starch into a glassy, brittle state essential for rapid steam expansion upon frying.',
        isCorrect: true,
        reason: 'Reducing moisture below 10% creates a glassy amorphous matrix that traps residual bound water, creating internal pressure for puffing during frying.',
      },
      {
        id: 'b',
        text: 'To fry the crackers in vegetable oil inside the dehydrator cabinet.',
        isCorrect: false,
        reason: 'A dehydrator circulates warm convective air to remove moisture, not cooking oil.',
      },
      {
        id: 'c',
        text: 'To rehydrate the crackers with added moisture from ambient air.',
        isCorrect: false,
        reason: 'Dehydration removes moisture rather than adding it.',
      },
      {
        id: 'd',
        text: 'To make the crackers soft, chewy, and spongy like bread.',
        isCorrect: false,
        reason: 'Dehydrated pellets must be hard and brittle (glassy state) to puff properly.',
      },
    ],
    explanation: 'Controlled convective drying evaporates free water below 10% critical moisture, setting the glassy amorphous starch state essential for rapid steam expansion upon frying.',
  },

  mission7: {
    stageNum: 7,
    stageKey: 'mission7',
    stageTitle: 'Stage 7: Flash Deep Frying',
    question: 'What physical phenomenon causes the dry ubod pellets to expand 3x their original size during 10-second flash frying at 180°C?',
    choices: [
      {
        id: 'a',
        text: 'Residual bound moisture instantaneously flashes into superheated steam, inflating the softened starch matrix into an airy, crispy honeycomb.',
        isCorrect: true,
        reason: 'At 180°C, the trace bound moisture flashes into steam vapor, creating high internal pressure that inflates the starch walls 3x before setting.',
      },
      {
        id: 'b',
        text: 'The crackers absorb all the cooking oil and swell like a sponge.',
        isCorrect: false,
        reason: 'Proper flash frying vaporizes steam outward, preventing excessive oil absorption.',
      },
      {
        id: 'c',
        text: 'Chemical leavening agents like baking powder release carbon dioxide.',
        isCorrect: false,
        reason: 'Ubod CRUNCH uses physical steam expansion from gelatinized starches, not chemical leaveners.',
      },
      {
        id: 'd',
        text: 'The crackers shrink and dissolve into the cooking oil.',
        isCorrect: false,
        reason: 'The crackers rapidly puff and expand 3x into crispy snacks.',
      },
    ],
    explanation: 'Submerged in 180°C oil, residual bound water instantaneously flashes into superheated steam. The rapid vapor pressure inflates the gelatinized matrix 3x before setting into an airy, brittle crunch.',
  },

  mission8: {
    stageNum: 8,
    stageKey: 'mission8',
    stageTitle: 'Stage 8: Packaging & Labeling',
    question: 'Why are the cooled ubod crackers portioned into 50g pouches and hermetically heat-sealed with barrier packaging?',
    choices: [
      {
        id: 'a',
        text: 'Hermetic barrier packaging prevents moisture vapor ingress (preventing loss of crispness) and shields against lipid photo-oxidation.',
        isCorrect: true,
        reason: 'Moisture ingress causes starch retrogradation and loss of crunch, while oxygen/light exposure causes oil rancidity. Barrier packaging ensures a 6-month shelf life.',
      },
      {
        id: 'b',
        text: 'To allow ambient humidity and air to circulate freely into the crackers.',
        isCorrect: false,
        reason: 'Air and humidity circulation causes crackers to become stale and soggy.',
      },
      {
        id: 'c',
        text: 'To soften the fried crackers into a chewy snack over time.',
        isCorrect: false,
        reason: 'The objective of barrier packaging is to preserve crispness and shelf life.',
      },
      {
        id: 'd',
        text: 'To expose the crackers to direct sunlight and high temperatures.',
        isCorrect: false,
        reason: 'Sunlight and heat accelerate lipid oxidation and must be shielded.',
      },
    ],
    explanation: 'High-barrier sealed foil pouches prevent water vapor ingress (preventing starch retrogradation and staleness) and shield against lipid photo-oxidation, securing a 6-month shelf life.',
  },
};
