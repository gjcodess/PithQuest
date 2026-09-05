// Recipe data and scientific standards for Coconut Pith Crackers (Ubod Crunch)
// Aligned with client curriculum and authentic home economics laboratory standards

export const RECIPE_DATA = {
  title: "Coconut Pith Crackers (Ubod Crunch)",
  subtitle: "Valorized Agricultural Delicacy by Nudazar Honore",
  servingSize: "24 Rectangular Crackers",
  totalTime: "13 Hours (includes 12-hr cabinet dehydration)",
  
  ingredients: [
    {
      id: "ubod",
      name: "Fresh Coconut Pith (Ubod)",
      portion: "2 Cups (approx. 300g)",
      purpose: "Core fiber, moisture, and delicate sweet coconut flavor base",
      prepNote: "Harvested from coconut apical meristem, washed, sliced uniformly",
      img: "/assets/icon_sliced_ubod.png",
      fallbackIcon: "🥥"
    },
    {
      id: "rice_flour",
      name: "Erawan Finest Rice Flour",
      portion: "2 Cups (approx. 250g)",
      portionRatio: "1:1 Ratio with Boiled Ubod Paste",
      purpose: "Primary starch binder that gelatinizes during steaming and puffs into crispy wafers during frying",
      prepNote: "Finely milled white rice flour (Elephant brand / Erawan)",
      img: "/assets/icon_tapioca_starch.png",
      fallbackIcon: "🌾"
    },
    {
      id: "salt",
      name: "Pure Sea Salt",
      portion: "1 Teaspoon per 1 Cup of Ubod (2 tsp total)",
      purpose: "Flavor enhancement, electrolyte balance, and moisture regulator",
      prepNote: "Fine white mineral crystals, measured and leveled",
      img: "/assets/icon_seasonings.png",
      fallbackIcon: "🧂"
    },
    {
      id: "water",
      name: "Clean Potable Water",
      portion: "4 Cups for boiling + 1/4 Cup gradual hydration",
      purpose: "Medium for thermal boiling and starch gluten/dough hydration",
      prepNote: "Crystal clear drinking-grade water",
      img: "/assets/icon_water_pitcher.png",
      fallbackIcon: "💧"
    },
    {
      id: "oil",
      name: "Baguio Orchids Vegetable Oil",
      portion: "5 Cups (approx. 1.2 Liters)",
      purpose: "Deep-frying medium providing rapid heat transfer for flash-puffing",
      prepNote: "Pure refined vegetable cooking oil with high smoke point",
      img: "/assets/icon_cooking_oil.png",
      fallbackIcon: "🫗"
    }
  ],

  parameters: {
    boiling: {
      heat: "High Heat",
      targetState: "Fork-tender, softened fibers, translucent white",
      duration: "15-20 Minutes",
    },
    grinding: {
      equipment: "Retro Sanyo Food Processor with Stainless S-Blade",
      ratio: "1 tsp salt per cup of boiled ubod",
      targetState: "Uniform silky puree, no stringy unground fibers",
    },
    molding: {
      equipment: "24-Cavity Rectangular Silicone Mold (Pink)",
      portionPerSlot: "3 Teaspoons per cavity",
      targetState: "Firmly pressed, level top edge, uniform thickness",
    },
    steaming: {
      equipment: "3-Tier Aluminum Steamer on Gas Range",
      temperature: "100°C (Rolling steam)",
      duration: "10 Minutes",
      targetState: "Gelatinized starch matrix, glossy surface, non-sticky",
    },
    dehydration: {
      equipment: "Cabinet Electric Food Dehydrator with Blue Lid",
      temperature: "90°C Convection Airflow",
      duration: "12 Hours",
      spacing: "1-Inch gap between pieces on stainless wire mesh tray",
      targetState: "Hard, brittle, translucent glass-like cracker pellets (<10% moisture)",
    },
    frying: {
      equipment: "Deep Heavy Bottom Wok",
      temperature: "175°C - 180°C Medium Heat",
      duration: "10 Seconds per batch",
      action: "Turn once with tongs, transfer immediately to colander to drain oil",
      targetState: "Puffed, pale golden, ultra-crisp with delicate snap",
    },
    packaging: {
      container: "Stand-Up Brown Kraft Pouch with Clear Oval Window",
      sealer: "Impulse Heat Sealer",
      label: "NUDAZAR HONORE - Ubod CRUNCH",
      netWeight: "50g",
    }
  }
};
