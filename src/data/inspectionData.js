// Inspection Minigame Data: Tool Safety & Ingredient Quality
// Mapped to authentic 2D assets generated in public/assets/

export const TOOL_INSPECTION_ITEMS = [
  {
    id: "knife",
    name: "Knife",
    toolType: "Cutting Tool",
    safe: {
      name: "Sanitized Stainless Chef Knife",
      description: "Pristine stainless steel blade, razor-sharp edge, tight solid rivets on clean handle.",
      img: "/assets/tool_knife_safe.png",
      fallbackIcon: "🔪",
      reason: "Correct: safe and hygienic."
    },
    damaged: {
      name: "Chipped Rusted Knife",
      description: "Dull metal with jagged edge notches, rust spots, and loose cracked wooden handle.",
      img: "/assets/tool_knife_damaged.png",
      fallbackIcon: "🗡️",
      reason: "Wrong: Hazard! It can cause severe cuts and contaminate fresh food!"
    }
  },
  {
    id: "cutting_board",
    name: "Cutting Board",
    toolType: "Food Prep Surface",
    safe: {
      name: "Smooth Bamboo Cutting Board",
      description: "Smooth flat surface, natural antibacterial bamboo grain, sanitized without fissures.",
      img: "/assets/tool_cutting_board_safe.png",
      fallbackIcon: "🪵",
      reason: "Correct: Clean cutting board"
    },
    damaged: {
      name: "Cracked Moldy Board",
      description: "Deep knife gouges, split wood fissure, dark moldy bacterial colonies in cracks.",
      img: "/assets/tool_cutting_board_damaged.png",
      fallbackIcon: "🪓",
      reason: "Wrong: Hazardous. It has multiple stains and cracks. It can contaminate the food."
    }
  },
  {
    id: "food_processor",
    name: "Food processor",
    toolType: "Electrical Grinding Appliance",
    safe: {
      name: "Inspected Food Processor",
      description: "Clean motor base, intact safety interlock lid, and pristine insulated power cord.",
      img: "/assets/equip_food_processor_safe.png",
      fallbackIcon: "⚙️",
      reason: "Correct: It is clean and wirings are safe."
    },
    damaged: {
      name: "Frayed Cord Food Processor",
      description: "Exposed bare copper wires on electrical cord, cracked safety interlock tabs.",
      img: "/assets/equip_food_processor_damaged.png",
      fallbackIcon: "⚡",
      reason: "Wrong: Critical Hazard! Exposed wires can cause fires. Always check the cords before using them."
    }
  },
  {
    id: "colander",
    name: "Colander",
    toolType: "Draining Cookware",
    safe: {
      name: "Pristine Mesh Colander",
      description: "Polished stainless perforated mesh, sturdy stable foot ring, clean sanitary handles.",
      img: "/assets/tool_colander_safe.png",
      fallbackIcon: "🥣",
      reason: "Correct: safe to use. Clean and no damage"
    },
    damaged: {
      name: "Dented Cracked Colander",
      description: "Cracked broken handles, warped rim with jagged metal burrs, corroded drainage holes.",
      img: "/assets/tool_colander_damaged.png",
      fallbackIcon: "💥",
      reason: "Wrong: Hazardous! Can cause physical hazard because of broken handles. Can also contaminate."
    }
  },
  {
    id: "dehydrator",
    name: "Dehydrator",
    toolType: "Convection Drying Appliance",
    safe: {
      name: "Clean Electric Dehydrator",
      description: "Sanitized wire mesh trays, clean exhaust vents, intact 3-prong grounded plug.",
      img: "/assets/equip_dehydrator_safe.png",
      fallbackIcon: "💨",
      reason: "Correct: Safe to use! It is clean and wirings are in good condition."
    },
    damaged: {
      name: "Burnt-Plug Dehydrator",
      description: "Scorched black burn marks on power plug, blocked lint in rear fan intake.",
      img: "/assets/equip_dehydrator_damaged.png",
      fallbackIcon: "🔥",
      reason: "Wrong: Critical Hazard! Exposed wires can cause fires. Always check the cords before using them."
    }
  },
  {
    id: "bowl",
    name: "Preparation Bowl",
    toolType: "Food Preparation Vessel",
    safe: {
      name: "Clean Stainless Preparation Bowl",
      description: "Deep polished stainless steel bowl with a smooth rim, intact walls, and spotless food-contact surface.",
      img: "/assets/tool_bowl_stainless.png",
      fallbackIcon: "🥣",
      reason: "Correct: safe to use! Clean and stainless that prevents contamination"
    },
    damaged: {
      name: "Dented Contaminated Bowl",
      description: "Deep dents, scratched interior, dark residue, and visibly damaged food-contact surface.",
      img: "/assets/tool_bowl_stainless_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Hazardous! Have a deep damage and dents. Not safe to use when mixing ingredients."
    }
  },
  {
    id: "tongs",
    name: "Kitchen Tongs",
    toolType: "Food Handling Tool",
    safe: {
      name: "Clean Heat-Resistant Kitchen Tongs",
      description: "Intact stainless steel tongs with secure scalloped tips, clean silicone grips, and working lock ring.",
      img: "/assets/tool_tongs_kitchen.png",
      fallbackIcon: "🥢",
      reason: "Correct: safe to use. Clean and not damaged."
    },
    damaged: {
      name: "Damaged Kitchen Tongs",
      description: "Bent gripping ends, torn silicone grip, loose locking mechanism, and visible grime.",
      img: "/assets/tool_tongs_kitchen_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Hazardous! Not clean and loose tongs can cause physical hazard specifically in your hands and can contaminate the food because it is not cleaned."
    }
  },
  {
    id: "spatula",
    name: "Silicone Spatula",
    toolType: "Mixing and Scraping Tool",
    safe: {
      name: "Clean Silicone Spatula",
      description: "Smooth red food-grade silicone head, intact beveled edge, and secure clear handle.",
      img: "/assets/tool_spatula_kitchen.png",
      fallbackIcon: "🟥",
      reason: "Correct: Safe to use! Clean and intact spatula are ready for mixing and scraping."
    },
    damaged: {
      name: "Cracked Silicone Spatula",
      description: "Split silicone head, torn edge, loose handle, and dark residue trapped in the damaged seam.",
      img: "/assets/tool_spatula_kitchen_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Hazardous! Cracks spatula can damage the food. The shed silicon pieces might be mixed with the mixture."
    }
  },
  {
    id: "measuring_glass",
    name: "Measuring Glass",
    toolType: "Liquid Measuring Tool",
    safe: {
      name: "Clear Graduated Measuring Glass",
      description: "Spotless transparent glass with intact handle, pour spout, and readable red volume markings.",
      img: "/assets/tool_measuring_glass.png",
      fallbackIcon: "🥛",
      reason: "Correct: safe to use! The markings are visible and has no damage or cracked"
    },
    damaged: {
      name: "Cracked Measuring Glass",
      description: "Cracked glass body, chipped rim, faded measurement markings, and unsafe sharp edges.",
      img: "/assets/tool_measuring_glass_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Hazardous! Markings aren’t visible. Cracks can cause physical hazard like cuts. The piece of broken glass can also be put in the mixture."
    }
  },
  {
    id: "cooking_pots",
    name: "Pots",
    toolType: "Heating Cookware",
    safe: {
      name: "Clean Stainless Cooking Pots",
      description: "Three intact stainless steel pots with secure handles, matching lids, and clean polished interiors.",
      img: "/assets/equip_cooking_pots.png",
      fallbackIcon: "🍲",
      reason: "Correct: Safe to use! Clean and stable pots"
    },
    damaged: {
      name: "Damaged Cooking Pots",
      description: "Warped pot bodies, loose handles, cracked lids, burnt residue, and unstable bases.",
      img: "/assets/equip_cooking_pots_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Critical hazard! The pots is dirty and covered in rust. It might affect the food inside. Can also cause physical hazards!"
    }
  },
  {
    id: "steamer",
    name: "Food Steamer",
    toolType: "Steam Cooking Equipment",
    safe: {
      name: "Clean Multi-Tier Food Steamer",
      description: "Polished multi-tier steamer with intact perforated tiers, secure handles, and fitted domed lid.",
      img: "/assets/equip_steamer_safe.png",
      fallbackIcon: "♨️",
      reason: "Correct: Safe to use! Well cleaned and intact"
    },
    damaged: {
      name: "Damaged Multi-Tier Food Steamer",
      description: "Dented tiers, loose handles, warped lid, blocked vents, and corroded metal surfaces.",
      img: "/assets/equip_steamer_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Critical Hazard! Can affect the mixture inside if used. Can release scalding steam unpredictably."
    }
  },
  {
    id: "stove",
    name: "Countertop Stove",
    toolType: "Heating Appliance",
    safe: {
      name: "Inspected Countertop Stove",
      description: "Clean stainless two-burner stove with intact grates, burner heads, control knobs, and stable base.",
      img: "/assets/equip_stove_countertop.png",
      fallbackIcon: "🔥",
      reason: "Correct: Safe to use! Well cleaned and intact burners."
    },
    damaged: {
      name: "Damaged Countertop Stove",
      description: "Cracked cooktop, bent burner grate, damaged control knob, and visible scorching near the burner.",
      img: "/assets/equip_stove_countertop_bad.png",
      fallbackIcon: "⚠️",
      reason: "Wrong: Critical hazard. It can cause burns I not properly checked."
    }
  }
];

export const INGREDIENT_INSPECTION_ITEMS = [
  {
    id: "ubod",
    name: "Coconut Palm (Ubod)",
    safe: {
      name: "Fresh Crisp Ubod",
      description: "Bright ivory-white color, crisp firm snap, mild pleasant coconut aroma.",
      img: "/assets/ing_ubod_fresh.png",
      fallbackIcon: "🥥",
      reason: "Correct: Fresh and clean"
    },
    damaged: {
      name: "Spoiled Rotten Ubod",
      description: "Brownish-black discoloration, slimy surface film, sour pungent fermented odor.",
      img: "/assets/ing_ubod_rotten.png",
      fallbackIcon: "🤢",
      reason: "Wrong: Spoiled! Ubod already has discoloration."
    }
  },
  {
    id: "rice_flour",
    name: "Rice Flour",
    safe: {
      name: "Erawan Finest Rice Flour",
      description: "Fine silky white powder, dry free-flowing, clean sealed bag, neutral aroma.",
      img: "/assets/ing_rice_flour_clean.png",
      fallbackIcon: "🌾",
      reason: "Correct: Good quality! Clean and sealed."
    },
    damaged: {
      name: "Pest-Infested Flour",
      description: "Visible dark weevils crawling inside, moisture clumps, webbed threads.",
      img: "/assets/ing_rice_flour_pest.png",
      fallbackIcon: "🐛",
      reason: "Wrong: Contaminated! It has visible pests."
    }
  },
  {
    id: "oil",
    name: "Vegetable Cooking Oil",
    safe: {
      name: "Fresh Vegetable Oil",
      description: "Clear luminous pale golden hue, no sediment, clean neutral odor, high smoke point.",
      img: "/assets/ing_oil_fresh.png",
      fallbackIcon: "🫗",
      reason: "Correct: good quality! Fresh oil. You must use fresh oil when deep frying crackers to avoid transferring flavors from previously cooked food."
    },
    damaged: {
      name: "Overused Burnt Oil",
      description: "Dark cloudy blackish-brown oil with charred sediment flakes, acrid smoky odor.",
      img: "/assets/ing_oil_used.png",
      fallbackIcon: "🛢️",
      reason: "Wrong: degraded oil! Reused darked oil contains harmful compounds that may affect the food."
    }
  },
  {
    id: "water",
    name: "Drinking Water",
    safe: {
      name: "Clear Potable Water",
      description: "100% transparent and clear, no suspended particles, odorless and pure.",
      img: "/assets/ing_water_clean.png",
      fallbackIcon: "💧",
      reason: "Correct: Safe and clean. When cooking and putting water in your mixture you must use clean water because it might still affect the quality of the food and health of the consumer."
    },
    damaged: {
      name: "Turbid Dirty Water",
      description: "Cloudy yellowish tint with floating rust flakes and suspended dirt particles.",
      img: "/assets/ing_water_dirty.png",
      fallbackIcon: "🟤",
      reason: "Wrong: Contaminated water! Can affect the consumers health and the quality of the food."
    }
  },
  {
    id: "salt",
    name: "Pure Sea Salt",
    safe: {
      name: "White Salt",
      description: "Clean sparkling white crystals, completely dry and non-clumpy, food-grade mineral.",
      img: "/assets/ing_salt_fresh.png",
      fallbackIcon: "🧂",
      reason: "Correct: Proper salt! Must be completely dry and non clumpy."
    },
    damaged: {
      name: "Defective Dirty Salt",
      description: "Gray discolored clumps with moisture pooling and embedded dirt specs.",
      img: "/assets/ing_salt_defective.png",
      fallbackIcon: "🌑",
      reason: "Wrong: Contaminated! Discolored salt and has dirt."
    }
  }
];
