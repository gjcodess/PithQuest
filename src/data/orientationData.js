// Orientation Data: Scientific Concepts, PPE Equipment, and Handwashing Protocol

export const LECTURE_CONCEPTS = [
  {
    id: "ubod",
    title: "Coconut Pith (Ubod ng Niyog)",
    tag: "Core Raw Material",
    icon: "🥥",
    summary: "The edible tender apical bud harvested from the crown of coconut palms (Cocos nucifera).",
    details: "Historically consumed as fresh lumpia filling, ubod is rich in soluble dietary fibers, potassium, and antioxidants. Valorizing it into shelf-stable snack crackers reduces post-harvest agricultural losses."
  },
  {
    id: "rice_flour",
    title: "Rice Flour Starch Matrix",
    tag: "Structural Binder",
    icon: "🌾",
    summary: "Finely ground white rice flour acts as the starch framework that binds the boiled ubod paste.",
    details: "Unlike all-purpose wheat flour, rice flour contains no gluten, producing a lighter, delicate snap. Its amylose-to-amylopectin ratio is specifically calibrated to expand rapidly upon frying."
  },
  {
    id: "gelatinization",
    title: "Starch Gelatinization (Steaming)",
    tag: "Thermal Biochemical Phase",
    icon: "♨️",
    summary: "Heating raw starch with water past 65°C disrupts crystalline granules, forming an elastic irreversible gel.",
    details: "Steaming the molded rectangular pieces for 10 minutes sets their shape and hydrates the starches completely. Without steaming, the crackers would crumble into powder inside the dehydrator."
  },
  {
    id: "dehydration",
    title: "Cabinet Dehydration (90°C / 12h)",
    tag: "Preservation & Vitrification",
    icon: "💨",
    summary: "Continuous convective dry airflow evaporates water until moisture content drops below 10%.",
    details: "Low moisture inhibits bacterial growth and mold, creating glassy, translucent, shelf-stable 'half-products' or cracker pellets ready for instant frying on demand."
  },
  {
    id: "flash_puffing",
    title: "Thermal Flash Expansion (Deep Frying)",
    tag: "Rapid Aeration Physics",
    icon: "🍳",
    summary: "180°C oil transfers intense thermal energy, flash-boiling residual trapped water into high-pressure steam.",
    details: "In just 10 seconds, expanding steam inflates millions of microscopic cells inside the gelatinized starch matrix, transforming the hard glassy chip into an airy, crispy Ubod Crunch cracker!"
  }
];

export const PPE_ITEMS = [
  {
    id: "hairnet",
    name: "Sanitary Hairnet",
    icon: "🧢",
    img: "/assets/ppe_hairnet.png",
    role: "Restrains stray hair strands from falling into food products.",
    isCorrect: true,
    critical: true
  },
  {
    id: "apron",
    name: "Clean Lab Gown / Apron",
    icon: "🥼",
    img: "/assets/ppe_clean_apron.png",
    role: "Shields clothing fibers and outdoor dust from contaminating sanitized prep surfaces.",
    isCorrect: true,
    critical: true
  },
  {
    id: "distractor_scarf",
    name: "Knitted Wool Scarf",
    icon: "🧣",
    img: "/assets/distractor_scarf.png",
    role: "Loose knitted cloth that traps dust, sheds loose fibers into food, and poses a burn risk near stoves.",
    isCorrect: false,
    reason: "Loose scarves shed fibers into food mixtures and create a dangerous entanglement or fire hazard near open burners.",
    critical: false
  },
  {
    id: "mask",
    name: "Clear Spit Guard / Mask",
    icon: "😷",
    img: "/assets/ppe_spit_guard.png",
    role: "Prevents oral droplet dispersal while speaking near open food vessels.",
    isCorrect: true,
    critical: true
  },
  {
    id: "distractor_goggles",
    name: "Heavy Chemical Goggles",
    icon: "🥽",
    img: "/assets/distractor_goggles.png",
    role: "Enclosed chemical lab goggles that fog up from hot cooking steam and obstruct culinary visibility.",
    isCorrect: false,
    reason: "Sealed chemical goggles are meant for corrosive acid labs, not food preparation. They fog up rapidly near boiling steam and obstruct vision.",
    critical: false
  },
  {
    id: "gloves",
    name: "Food-Grade Vinyl Gloves",
    icon: "🧤",
    img: "/assets/ppe_food_gloves.png",
    role: "Maintains sterile contact with ingredients and ready-to-eat crackers.",
    isCorrect: true,
    critical: true
  },
  {
    id: "heat_gloves",
    name: "Thermal Heat Mitts",
    icon: "🧤",
    img: "/assets/ppe_heat_gloves.png",
    role: "Protects hands from burns during high-heat steaming and deep frying operations.",
    isCorrect: true,
    critical: true
  },
  {
    id: "shoes",
    name: "Non-Slip Safety Shoes",
    icon: "👟",
    img: "/assets/ppe_shoes.png",
    role: "Closed-toe non-skid footwear prevents slips and protects from hot liquid spills.",
    isCorrect: true,
    critical: true
  }
];

export const HANDWASHING_STEPS = [
  {
    id: "wet_hands",
    step: 1,
    action: "Wet Hands with Clean Water",
    desc: "Wet hands thoroughly under clean, warm running potable water before applying cleanser.",
    icon: "🚰",
    isCorrect: true,
    reason: "Water wets skin and creates the emulsion base needed for soap lathering."
  },
  {
    id: "apply_soap",
    step: 2,
    action: "Apply Antibacterial Soap",
    desc: "Dispense enough antibacterial soap to cover all hand and palm surfaces.",
    icon: "🧼",
    img: "/assets/sanitation_handwash_soap.png",
    isCorrect: true,
    reason: "Soap surfactants emulsify surface oils and trap food residues and microbes."
  },
  {
    id: "distractor_quick_rinse",
    step: null,
    action: "Quick Water-Only Splash (No Soap)",
    desc: "Rinse hands quickly under cold water for 3 seconds without dispensing soap.",
    icon: "🌊",
    isCorrect: false,
    reason: "Water alone cannot dissolve grease or break down lipophilic bacterial cell membranes."
  },
  {
    id: "rub_palms",
    step: 3,
    action: "Rub Palms & Interlace Fingers",
    desc: "Rub palm to palm and interlace fingers to clean webbing between digits.",
    icon: "👐",
    isCorrect: true,
    reason: "Mechanical friction dislodges bacteria hidden between webbed fingers."
  },
  {
    id: "scrub_backs",
    step: 4,
    action: "Scrub Backs of Hands & Thumbs",
    desc: "Rub right palm over left dorsum with interlaced fingers, rotate around both thumbs.",
    icon: "✋",
    isCorrect: true,
    reason: "Dorsal skin and thumbs are the most frequently missed areas during hand hygiene."
  },
  {
    id: "distractor_sanitizer_grease",
    step: null,
    action: "Apply Alcohol Gel on Greasy Hands",
    desc: "Squirt alcohol hand rub directly onto oily, visibly soiled hands instead of washing.",
    icon: "🧴",
    isCorrect: false,
    reason: "Alcohol gel is inactivated by organic grease and food soil; soap and water is mandatory for soiled hands."
  },
  {
    id: "scrub_nails",
    step: 5,
    action: "Scrub Nails & Fingertips",
    desc: "Rub rotational fingertips back and forth in opposite palms to scrub subungual areas.",
    icon: "💅",
    isCorrect: true,
    reason: "Nail beds harbor high densities of bacteria and food soil that require direct friction."
  },
  {
    id: "rinse_hands",
    step: 6,
    action: "Rinse Thoroughly for 20 Seconds",
    desc: "Rinse all lather and suspended dirt away completely under continuous flowing water.",
    icon: "💧",
    isCorrect: true,
    reason: "Flowing water carries away emulsified soil, dead skin cells, and dislodged pathogens."
  },
  {
    id: "distractor_wipe_apron",
    step: null,
    action: "Wipe Hands on Cooking Apron",
    desc: "Dry damp hands on work apron fabric to save time during food preparation.",
    icon: "🥼",
    isCorrect: false,
    reason: "Aprons collect grease and airborne contaminants; wiping on clothing instantly re-contaminates clean hands."
  },
  {
    id: "dry_towel",
    step: 7,
    action: "Dry with Single-Use Towel",
    desc: "Pat dry thoroughly with clean disposable paper towel; use towel to shut off faucet.",
    icon: "🧻",
    img: "/assets/sanitation_spray_cloth.png",
    isCorrect: true,
    reason: "Single-use paper towels dry hands without recontamination and prevent bare-hand faucet contact."
  }
];

