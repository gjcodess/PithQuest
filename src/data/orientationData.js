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
    critical: true
  },
  {
    id: "apron",
    name: "Clean Lab Gown / Apron",
    icon: "🥼",
    img: "/assets/ppe_clean_apron.png",
    role: "Shields clothing fibers and outdoor dust from contaminating sanitized prep surfaces.",
    critical: true
  },
  {
    id: "mask",
    name: "Clear Spit Guard / Mask",
    icon: "😷",
    img: "/assets/ppe_spit_guard.png",
    role: "Prevents oral droplet dispersal while speaking near open food vessels.",
    critical: true
  },
  {
    id: "gloves",
    name: "Food-Grade Vinyl Gloves",
    icon: "🧤",
    img: "/assets/ppe_food_gloves.png",
    role: "Maintains sterile contact with ingredients and ready-to-eat crackers.",
    critical: true
  },
  {
    id: "heat_gloves",
    name: "Thermal Heat Mitts",
    icon: "🧤",
    img: "/assets/ppe_heat_gloves.png",
    role: "Protects hands from burns during high-heat steaming and deep frying operations.",
    critical: true
  },
  {
    id: "shoes",
    name: "Non-Slip Safety Shoes",
    icon: "👟",
    img: "/assets/ppe_shoes.png",
    role: "Closed-toe non-skid footwear prevents slips and protects from hot liquid spills.",
    critical: true
  }
];

export const HANDWASHING_STEPS = [
  { step: 1, action: "Wet Hands", desc: "Wet hands with clean running potable water.", icon: "🚰" },
  { step: 2, action: "Apply Antibacterial Soap", desc: "Dispense enough soap to cover all hand surfaces.", icon: "🧼", img: "/assets/sanitation_handwash_soap.png" },
  { step: 3, action: "Rub Palms & Interlace Fingers", desc: "Rub palm to palm and scrub between webbed fingers.", icon: "👐" },
  { step: 4, action: "Scrub Backs of Hands & Thumbs", desc: "Clean dorsal surfaces and rotational rubbing of thumbs.", icon: "✋" },
  { step: 5, action: "Scrub Nails & Fingertips", desc: "Rub fingertips into opposite palms to clean under nail beds.", icon: "💅" },
  { step: 6, action: "Rinse for 20 Seconds", desc: "Thoroughly rinse all soap lather away under flowing water.", icon: "💧" },
  { step: 7, action: "Dry with Clean Towel", desc: "Dry with single-use paper towel and turn off faucet with elbow.", icon: "🧻", img: "/assets/sanitation_spray_cloth.png" }
];
