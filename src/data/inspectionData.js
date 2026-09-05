// Inspection Minigame Data: Tool Safety & Ingredient Quality
// Mapped to authentic 2D assets generated in public/assets/

export const TOOL_INSPECTION_ITEMS = [
  {
    id: "knife",
    name: "Chef Knife",
    toolType: "Cutting Tool",
    safe: {
      name: "Sanitized Stainless Chef Knife",
      description: "Pristine stainless steel blade, razor-sharp edge, tight solid rivets on clean handle.",
      img: "/assets/tool_knife_safe.png",
      fallbackIcon: "🔪",
      reason: "Safe and hygienic! A sharp, undamaged knife reduces slippage and ensures precise uniform cuts."
    },
    damaged: {
      name: "Chipped Rusted Knife",
      description: "Dull metal with jagged edge notches, rust spots, and loose cracked wooden handle.",
      img: "/assets/tool_knife_damaged.png",
      fallbackIcon: "🗡️",
      reason: "Hazardous! Jagged chipped blades easily slip causing severe cuts, and rust contaminates fresh food."
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
      reason: "Safe to use! Flat, clean cutting boards provide stable footing for safe knife work."
    },
    damaged: {
      name: "Cracked Moldy Board",
      description: "Deep knife gouges, split wood fissure, dark moldy bacterial colonies in cracks.",
      img: "/assets/tool_cutting_board_damaged.png",
      fallbackIcon: "🪓",
      reason: "Hazardous! Bacteria, fungi, and mold embed deeply inside cracked wood and cross-contaminate food."
    }
  },
  {
    id: "food_processor",
    name: "Electric Food Processor",
    toolType: "Electrical Grinding Appliance",
    safe: {
      name: "Inspected Food Processor",
      description: "Clean motor base, intact safety interlock lid, and pristine insulated power cord.",
      img: "/assets/equip_food_processor_safe.png",
      fallbackIcon: "⚙️",
      reason: "Safe to use! The safety interlock prevents the blade from spinning when the lid is removed."
    },
    damaged: {
      name: "Frayed Cord Food Processor",
      description: "Exposed bare copper wires on electrical cord, cracked safety interlock tabs.",
      img: "/assets/equip_food_processor_damaged.png",
      fallbackIcon: "⚡",
      reason: "Electrical Hazard! Exposed wires cause electric shocks or laboratory fires. Always inspect cords before plugging in."
    }
  },
  {
    id: "colander",
    name: "Stainless Colander",
    toolType: "Draining Cookware",
    safe: {
      name: "Pristine Mesh Colander",
      description: "Polished stainless perforated mesh, sturdy stable foot ring, clean sanitary handles.",
      img: "/assets/tool_colander_safe.png",
      fallbackIcon: "🥣",
      reason: "Safe to use! Sturdy handles and intact mesh allow scalding boiling water to drain cleanly."
    },
    damaged: {
      name: "Dented Cracked Colander",
      description: "Cracked broken handles, warped rim with jagged metal burrs, corroded drainage holes.",
      img: "/assets/tool_colander_damaged.png",
      fallbackIcon: "💥",
      reason: "Burn & Cut Hazard! Broken handles cause boiling water to spill onto hands, and sharp metal tears skin."
    }
  },
  {
    id: "dehydrator",
    name: "Cabinet Dehydrator",
    toolType: "Convection Drying Appliance",
    safe: {
      name: "Clean Electric Dehydrator",
      description: "Sanitized wire mesh trays, clean exhaust vents, intact 3-prong grounded plug.",
      img: "/assets/equip_dehydrator_safe.png",
      fallbackIcon: "💨",
      reason: "Safe to use! Clean ventilation ensures constant 90°C hot airflow for safe, even moisture reduction."
    },
    damaged: {
      name: "Burnt-Plug Dehydrator",
      description: "Scorched black burn marks on power plug, blocked lint in rear fan intake.",
      img: "/assets/equip_dehydrator_damaged.png",
      fallbackIcon: "🔥",
      reason: "Fire Hazard! Scorched plugs indicate past electrical shorting, and clogged vents will overheat the unit."
    }
  }
];

export const INGREDIENT_INSPECTION_ITEMS = [
  {
    id: "ubod",
    name: "Coconut Pith (Ubod)",
    safe: {
      name: "Fresh Crisp Ubod",
      description: "Bright ivory-white color, crisp firm snap, mild pleasant coconut aroma.",
      img: "/assets/ing_ubod_fresh.png",
      fallbackIcon: "🥥",
      reason: "Grade-A Fresh! Fresh ubod contains peak moisture and dietary fibers without sour fermentation."
    },
    damaged: {
      name: "Spoiled Rotten Ubod",
      description: "Brownish-black discoloration, slimy surface film, sour pungent fermented odor.",
      img: "/assets/ing_ubod_rotten.png",
      fallbackIcon: "🤢",
      reason: "Spoiled! Blackened slimy ubod has undergone enzymatic browning and bacterial decomposition."
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
      reason: "Prime Quality! Dry, bug-free rice flour creates an elastic dough matrix that puffs evenly in hot oil."
    },
    damaged: {
      name: "Pest-Infested Flour",
      description: "Visible dark weevils crawling inside, moisture clumps, webbed threads.",
      img: "/assets/ing_rice_flour_pest.png",
      fallbackIcon: "🐛",
      reason: "Contaminated! Flour beetles/weevils excrete metabolic waste that ruins food safety and taste."
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
      reason: "Excellent Oil Quality! Fresh oil produces light, golden crackers without rancid aftertaste."
    },
    damaged: {
      name: "Overused Burnt Oil",
      description: "Dark cloudy blackish-brown oil with charred sediment flakes, acrid smoky odor.",
      img: "/assets/ing_oil_used.png",
      fallbackIcon: "🛢️",
      reason: "Degraded Oil! Reused dark oil contains harmful free radicals, polymers, and carcinogenic aldehydes."
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
      reason: "Safe and Potable! Pure water hydrates rice starches cleanly without off-flavors."
    },
    damaged: {
      name: "Turbid Dirty Water",
      description: "Cloudy yellowish tint with floating rust flakes and suspended dirt particles.",
      img: "/assets/ing_water_dirty.png",
      fallbackIcon: "🟤",
      reason: "Contaminated Water! Turbid water carries microbial pathogens, silt, and dissolved contaminants."
    }
  },
  {
    id: "salt",
    name: "Pure Sea Salt",
    safe: {
      name: "Dry Pure White Salt",
      description: "Clean sparkling white crystals, completely dry and non-clumpy, food-grade mineral.",
      img: "/assets/ing_salt_fresh.png",
      fallbackIcon: "🧂",
      reason: "Proper Salt! Dissolves completely into the boiling ubod and pureed paste for uniform seasoning."
    },
    damaged: {
      name: "Defective Dirty Salt",
      description: "Gray discolored clumps with moisture pooling and embedded dirt specs.",
      img: "/assets/ing_salt_defective.png",
      fallbackIcon: "🌑",
      reason: "Contaminated! Damp, soiled salt alters measured salinity and introduces grit into the cracker dough."
    }
  }
];
