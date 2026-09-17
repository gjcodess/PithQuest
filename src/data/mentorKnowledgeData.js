/**
 * Centralized Educational Knowledge Base for Teacher Mia's Mentor Sidebar
 * Provides rich food technology principles, culinary pro-tips, safety protocols,
 * and standard recipe measurements for each stage in the Ubod Cracker process.
 */

export const MENTOR_KNOWLEDGE = {
  orientation: {
    title: 'Stage 0: Lab Orientation & Hygiene',
    subtitle: 'Personal Protective Equipment & Aseptic Protocol',
    science: [
      {
        title: 'Microbial Barrier Defense',
        icon: '🔬',
        summary: 'Physical barriers prevent human shedding from contaminating food contact surfaces.',
        details: 'Humans continuously shed 30,000–40,000 dead skin cells per minute and disperse oral aerosols containing Staphylococcus aureus and microflora during normal speech. PPE creates an impervious barrier.'
      },
      {
        title: 'Transient vs. Resident Microflora',
        icon: '🧼',
        summary: '20-second friction handwashing removes transient pathogens from environmental contact.',
        details: 'Soaps and detergents act as surfactants that emulsify surface oils and mechanically dislodge transient bacteria, which are then rinsed away under running potable water.'
      }
    ],
    tips: [
      {
        title: 'Tuck All Stray Hair',
        icon: '🧢',
        tip: 'Ensure the sanitary hairnet fully encapsulates the ears and hairline to prevent physical contamination.'
      },
      {
        title: 'Spit Guard Positioning',
        icon: '😷',
        tip: 'Adjust the clear plastic spit guard chin rest snugly so breath is directed downward away from open ingredient bowls.'
      }
    ],
    safety: [
      {
        title: 'Forbidden Clothing',
        icon: '🚫',
        desc: 'Never wear loose scarves, dangling jewelry, or open-toed sandals in a food processing laboratory.'
      },
      {
        title: 'Thermal PPE Rule',
        icon: '🧤',
        desc: 'Disposable plastic/vinyl gloves melt instantly upon touching hot equipment. Always switch to silicone heat mitts for thermal steps.'
      }
    ],
    recipe: [
      { name: 'Sanitary Hairnet', measure: '1 Unit', icon: '🧢' },
      { name: 'Spit Guard Mask', measure: '1 Unit', icon: '😷' },
      { name: 'Clean Apron', measure: '1 Unit', icon: '🥼' },
      { name: 'Food-Grade Gloves', measure: '1 Pair', icon: '🧤' }
    ]
  },

  mission1: {
    title: 'Stage 1: Washing & Boiling',
    subtitle: 'Thermal Fiber Softening & Osmotic Tenderization',
    science: [
      {
        title: 'Thermal Hemicellulose Degradation',
        icon: '♨️',
        summary: '100°C boiling water softens tough plant cell wall matrices.',
        details: 'Coconut pith (apical meristem) contains dense structural cellulose, hemicellulose, and pectin fibrils. A 10–15 minute rolling boil hydrolyzes pectin and relaxes cellulose polymers, making the tissue fork-tender for fine pureeing in Stage 2.'
      },
      {
        title: 'Sodium Chloride Osmotic Tenderization',
        icon: '🧂',
        summary: 'Sea salt enhances hydration and ionically balances plant proteins.',
        details: 'Dissolved Na+ and Cl- ions penetrate cell membranes via osmotic diffusion, breaking ionic bonds between cell wall polymers and accelerating thermal tenderization while pre-seasoning the tissue.'
      },
      {
        title: 'Carryover Cooking & Starch Wash',
        icon: '🌊',
        summary: 'Cold running water rinse immediately halts carryover thermal cooking.',
        details: 'Rinsing hot boiled ubod in a stainless colander drops its core temperature below 60°C instantly, preventing over-softening (mushiness) and washing away surface leaching starches.'
      }
    ],
    tips: [
      {
        title: 'Fork-Tender Test',
        icon: '🍴',
        tip: 'When cooked properly, a fork tines or chopstick should slide effortlessly through the center of the ubod strip with zero rubbery resistance.'
      },
      {
        title: 'Double Colander Technique',
        icon: '🥣',
        tip: 'Always wash before boiling to remove soil and sand debris, and drain thoroughly in the colander after boiling so excess water does not dilute the puree.'
      }
    ],
    safety: [
      {
        title: 'Burner Ignition Inspection',
        icon: '🔥',
        desc: 'Check the stove, smell for gas leaks, inspect the rubber hose and regulator, and clear nearby flammable materials before lighting.'
      },
      {
        title: 'Hot Pot Steam Hazard',
        icon: '🧤',
        desc: 'Steam causes severe thermal burns faster than boiling water. Always wear heat-resistant mitts when draining hot cookware.'
      }
    ],
    recipe: [
      { name: 'Raw Ubod Strips', measure: '1 Cup (Fresh Cut)', icon: '🥥' },
      { name: 'Potable Water', measure: '1 Cup (To Submerge)', icon: '💧' },
      { name: 'Pure Sea Salt', measure: '1 tsp (Pinch)', icon: '🧂' },
      { name: 'Target Boiling Time', measure: '10–15 Minutes', icon: '⏱️' }
    ]
  },

  mission2: {
    title: 'Stage 2: Grinding & Pureeing',
    subtitle: 'Mechanical Shear & Colloidal Dispersion',
    science: [
      {
        title: 'High-Shear Cell Wall Disruption',
        icon: '⚡',
        summary: '12,000 RPM stainless steel blades homogenize plant fibers into microscopic particles.',
        details: 'Mechanical shear forces physically rupture remaining intact plant cells, releasing trapped cellular water and creating a uniform, lump-free colloidal paste essential for smooth dough binding.'
      },
      {
        title: 'Paste Homogeneity & Starch Intercalation',
        icon: '🥣',
        summary: 'Smooth paste allows complete starch binding in Stage 3.',
        details: 'If fibrous lumps remain, rice flour cannot coat the particles evenly. Any large fiber strands would cause cracking and uneven expansion during the puffing process in hot oil.'
      }
    ],
    tips: [
      {
        title: 'Bowl Wall Scraping',
        icon: '🥄',
        tip: 'Stop the machine and scrape down the internal walls with a rubber spatula so unblended fragments are pulled back into the central cutting vortex.'
      },
      {
        title: 'Silky Texture Benchmark',
        icon: '✨',
        tip: 'Rub a drop between your fingers. It should feel completely velvety and smooth, like fine custard, with no coarse gritty fiber particles.'
      }
    ],
    safety: [
      {
        title: 'Mechanical Blade Safety Interlock',
        icon: '🔒',
        desc: 'Never bypass the container safety lid lock. The high-speed rotor must come to a dead stop before opening the lid.'
      },
      {
        title: 'Never Insert Metal Utensils While Running',
        icon: '⚠️',
        desc: 'Only scrape the bowl when the motor is fully powered off and unplugged or switch disengaged.'
      }
    ],
    recipe: [
      { name: 'Tender Boiled Ubod', measure: '1 Cup (Drained)', icon: '🥥' },
      { name: 'Measured Sea Salt', measure: '1 tsp (Seasoning)', icon: '🧂' },
      { name: 'Target Yield', measure: '1 Cup Puree', icon: '🥣' }
    ]
  },

  mission3: {
    title: 'Stage 3: Mixing & Kneading',
    subtitle: 'Non-Gluten Starch Dough Formulation',
    science: [
      {
        title: 'Rice Starch vs. Wheat Gluten',
        icon: '🌾',
        summary: 'Rice flour provides a gluten-free starch matrix for crisp, brittle cracker snap.',
        details: 'Wheat flour contains glutenin and gliadin which form an elastic, chewy bread-like gluten web. Rice flour relies strictly on amylose and amylopectin granules, producing a delicate, crisp puff when fried.'
      },
      {
        title: 'Starch Hydration & Hydrocolloid Swelling',
        icon: '💧',
        summary: 'Water from the pureed ubod hydrates dry starch granules.',
        details: 'Thorough folding and kneading forces moisture from the wet ubod paste into the interior of rice starch granules, preparing them for thermal gelatinization in Stage 5.'
      }
    ],
    tips: [
      {
        title: 'Gradual Dough Incorporation',
        icon: '🥣',
        tip: 'Add rice flour incrementally while folding to prevent dry pocket formation and achieve uniform moisture distribution.'
      },
      {
        title: 'Non-Sticky Dough Test',
        icon: '🖐️',
        tip: 'Properly kneaded dough pulls clean from the stainless mixing bowl walls and leaves no sticky paste on your gloved hands.'
      }
    ],
    safety: [
      {
        title: 'Aerosolized Starch Dust Inhalation',
        icon: '😷',
        desc: 'Keep spit guard/mask on when pouring fine rice flour to avoid inhaling fine airborne particulate dust.'
      },
      {
        title: 'Clean Countertop Sanitization',
        icon: '🧼',
        desc: 'Sanitize all mixing tools and countertops with 70% food-grade alcohol before folding dough.'
      }
    ],
    recipe: [
      { name: 'Smooth Ubod Paste', measure: '1 Cup', icon: '🥥' },
      { name: 'White Rice Flour', measure: '1 Cup', icon: '🌾' },
      { name: 'Target Dough Weight', measure: '2 Cups Total', icon: '🥟' }
    ]
  },

  mission4: {
    title: 'Stage 4: Molding & Shaping',
    subtitle: 'Dimensional Standardization & Heat Transfer Geometry',
    science: [
      {
        title: 'Uniform Surface Area to Volume Ratio',
        icon: '📐',
        summary: 'Identical 24-cavity dimensions ensure synchronous steam penetration and drying.',
        details: 'In thermodynamics, heat transfer rate is inversely proportional to thickness. If pieces vary in thickness, thin wafers will over-dry into brittle dust while thick ones remain soggy inside.'
      },
      {
        title: 'Calibrated Thickness (2–3mm)',
        icon: '📏',
        summary: '2–3mm thickness optimizes steam heating and moisture migration.',
        details: 'A thickness of 2–3mm allows saturated steam to reach the core within 10 minutes and permits moisture to escape evenly during 12-hour cabinet dehydration.'
      }
    ],
    tips: [
      {
        title: 'Bench Scraper Leveling',
        icon: '🪚',
        tip: 'Draw the silicone bench scraper firmly across the mold surface in a single smooth sweep to level all 24 portions perfectly flush.'
      },
      {
        title: 'Eliminate Internal Air Pockets',
        icon: '✨',
        tip: 'Press firmly into cavity corners. Trapped air pockets cause crackers to crack and break in half during dehydration.'
      }
    ],
    safety: [
      {
        title: 'Food-Grade Silicone Certification',
        icon: '🛡️',
        desc: 'Use FDA-approved platinum cured silicone molds rated up to 230°C to prevent chemical migration during steaming.'
      },
      {
        title: 'Finger Blade Clearance',
        icon: '🧤',
        desc: 'Keep fingers behind the guide spine when handling rigid acrylic bench scrapers.'
      }
    ],
    recipe: [
      { name: 'Kneaded Ubod Dough', measure: '2 Cups', icon: '🥟' },
      { name: 'Silicone Mold Cavities', measure: '24 Pieces', icon: '🧈' },
      { name: 'Target Thickness', measure: '2–3 mm', icon: '📐' }
    ]
  },

  mission5: {
    title: 'Stage 5: Steaming & Gelatinization',
    subtitle: 'Thermal Starch Gelatinization Phase',
    science: [
      {
        title: 'Irreversible Starch Gelatinization (>65°C)',
        icon: '♨️',
        summary: 'Heat and steam melt starch crystalline granules into an elastic polymeric gel.',
        details: 'At 65°C–85°C, water diffuses into amylose and amylopectin granules, causing them to swell irreversibly. The starches dissolve and intertwine, locking the cracker shape into a translucent, firm matrix.'
      },
      {
        title: 'Why Steaming is Indispensable',
        icon: '🧬',
        summary: 'Without gelatinization, crackers crumble into loose powder inside the dehydrator.',
        details: 'Raw starch granules have no structural cohesion. Gelatinization creates the continuous 3D polymer film required to trap steam and puff during deep frying.'
      }
    ],
    tips: [
      {
        title: 'Translucent Amber Indicator',
        icon: '👀',
        tip: 'Properly steamed crackers lose their opaque white chalky color and become glassy and slightly translucent.'
      },
      {
        title: 'Level Steamer Rack',
        icon: '⚖️',
        tip: 'Ensure the perforated steam tier sits completely horizontal so condensate runs off without pooling on the crackers.'
      }
    ],
    safety: [
      {
        title: '100°C Steam Expansion Hazard',
        icon: '🧤',
        desc: 'Wear heavy silicone thermal heat mitts. Never reach into the steam column with bare hands or thin vinyl gloves.'
      },
      {
        title: 'Lid Angle Rule',
        icon: '🛡️',
        desc: 'When removing the steamer lid, always tilt the open face AWAY from your body to direct the burst of hot steam outward.'
      }
    ],
    recipe: [
      { name: 'Potable Base Water', measure: '1 Cup (Base Tier)', icon: '💧' },
      { name: 'Molded Pieces', measure: '24 Cavities', icon: '🧈' },
      { name: 'Steaming Temperature', measure: '100°C Convection', icon: '🌡️' },
      { name: 'Cycle Duration', measure: '10 Minutes', icon: '⏱️' }
    ]
  },

  mission6: {
    title: 'Stage 6: Cabinet Dehydration',
    subtitle: 'Convective Moisture Removal & Vitrification',
    science: [
      {
        title: 'Vitrification & Glass Transition',
        icon: '💨',
        summary: 'Moisture reduction below 10% converts the gelatinized starch gel into a brittle glass.',
        details: 'Continuous 90°C heated airflow evaporates capillary and bound moisture. Below 10% water content, starch enters a glassy solid state (vitrification), arresting microbial growth and conferring years of shelf stability.'
      },
      {
        title: 'Equilibrium Moisture Target (<10%)',
        icon: '📉',
        summary: 'Low water activity (Aw < 0.6) prevents microbial proliferation.',
        details: 'Bacteria and molds require free water to reproduce. Dehydration starves microorganisms, producing glassy "half-products" (cracker pellets) that can be stored at room temperature.'
      }
    ],
    tips: [
      {
        title: 'Single Layer Separation',
        icon: '📏',
        tip: 'Space pieces at least 1cm apart on the stainless mesh tray. Overlapping wafers trap moisture and dry unevenly.'
      },
      {
        title: 'Audible Snap Test',
        icon: '👂',
        tip: 'When fully dried, a cooled test pellet should snap sharply in half like brittle glass with no bend or flex.'
      }
    ],
    safety: [
      {
        title: 'Appliance Ventilation Clearance',
        icon: '💨',
        desc: 'Maintain at least 15cm of rear clearance around the dehydrator fan vents to prevent motor overheating during the 12-hour run.'
      },
      {
        title: 'Clean Stainless Mesh Trays',
        icon: '🧼',
        desc: 'Ensure dehydration trays are thoroughly degreased to prevent foreign odor absorption into dry pellets.'
      }
    ],
    recipe: [
      { name: 'Gelatinized Ubod Pieces', measure: '24 Pieces', icon: '🧈' },
      { name: 'Convective Heat', measure: '90°C (194°F)', icon: '🌡️' },
      { name: 'Continuous Run Time', measure: '12 Hours', icon: '⏱️' },
      { name: 'Target Moisture Content', measure: '< 10% (Vitrified)', icon: '📉' }
    ]
  },

  mission7: {
    title: 'Stage 7: Deep Frying & Expansion',
    subtitle: 'Superheated Flash Steam Expansion Physics',
    science: [
      {
        title: 'Flash Steam Aeration Physics',
        icon: '💥',
        summary: '180°C hot oil flash-vaporizes residual bound water, expanding the matrix 300%.',
        details: 'When a vitrified pellet enters 180°C oil, trapped residual moisture instantly boils into high-pressure steam. Because the starch matrix is plasticized by heat, it inflates like millions of micro-balloons before setting into a light, crispy foam.'
      },
      {
        title: 'Oil Absorption Kinetics & Temperature Control',
        icon: '🌡️',
        summary: 'Frying at exactly 180°C minimizes oil uptake.',
        details: 'If oil drops below 160°C, expansion fails and oil soaks deep into the core, producing greasy crackers. Above 190°C, starches char and burn before expansion is complete.'
      }
    ],
    tips: [
      {
        title: '10-Second Golden Rule',
        icon: '⏱️',
        tip: 'Watch closely! Ubod crackers puff to full volume in just 8–10 seconds. Scoop immediately before browning occurs.'
      },
      {
        title: 'Wire Skimmer Agitation',
        icon: '🍳',
        tip: 'Submerge the pellet gently with the wire mesh skimmer to ensure both top and bottom puff symmetrically.'
      }
    ],
    safety: [
      {
        title: '180°C Hot Oil Splatter Hazard',
        icon: '🔥',
        desc: 'Never drop wet items into hot oil. Wear heat-resistant gloves and face guard. Keep flammable items 1 meter away.'
      },
      {
        title: 'Dry Wire Skimmer Protocol',
        icon: '🥄',
        desc: 'Ensure the stainless wire skimmer is 100% bone-dry before touching the hot oil to avoid violent steam spitting.'
      }
    ],
    recipe: [
      { name: 'Vitrified Cracker Pellets', measure: '24 Pieces', icon: '💎' },
      { name: 'Pure Vegetable Cooking Oil', measure: '2 Cups (Deep Fry)', icon: '🫗' },
      { name: 'Target Oil Temperature', measure: '180°C (356°F)', icon: '🌡️' },
      { name: 'Flash Puffing Time', measure: '8–10 Seconds', icon: '⏱️' }
    ]
  },

  mission8: {
    title: 'Stage 8: Packaging & Quality Assurance',
    subtitle: 'Hermetic Sealing & Shelf-Life Extension',
    science: [
      {
        title: 'Lipid Auto-Oxidation Prevention',
        icon: '🛡️',
        summary: 'Hermetic barrier pouches prevent atmospheric oxygen from turning fried oils rancid.',
        details: 'Fried crackers contain unsaturated vegetable fatty acids. Exposure to oxygen and light triggers free radical peroxidation, creating stale off-flavors (hexanal). Hermetic foil pouches shield against light, oxygen, and humidity.'
      },
      {
        title: 'Moisture Barrier & Crispness Preservation',
        icon: '💧',
        summary: 'Moisture ingress causes starches to lose their glassy crispness (hygroscopic softening).',
        details: 'Dry crackers are highly hygroscopic (sponge-like for ambient water vapor). Metalized barrier films maintain cracker crispness for 6–12 months at room temperature.'
      }
    ],
    tips: [
      {
        title: 'Cool Completely Before Sealing',
        icon: '❄️',
        tip: 'Always let freshly fried crackers cool to room temperature (25°C). Sealing warm crackers creates internal condensation that makes them soggy.'
      },
      {
        title: 'Continuous Heat Seam Inspection',
        icon: '🔍',
        tip: 'Inspect the heat-sealed pouch seam. It should be continuous, flat, and bubble-free across the entire top edge.'
      }
    ],
    safety: [
      {
        title: 'Impulse Heat Sealer Safety',
        icon: '⚡',
        desc: 'Do not touch the Teflon-covered heating element wire. Allow 5 seconds between seals to prevent element burnout.'
      },
      {
        title: 'Food-Grade Tongs Protocol',
        icon: '🥢',
        desc: 'Always use sanitized stainless tongs to transfer finished crackers into packaging pouches.'
      }
    ],
    recipe: [
      { name: 'Crispy Ubod Crackers', measure: '24 Puffed Pieces', icon: '🍘' },
      { name: 'Moisture-Barrier Pouch', measure: '1 Standup Pouch', icon: '📦' },
      { name: 'Hermetic Heat Seal Width', measure: '5–10 mm Continuous', icon: '🔒' }
    ]
  },

  sequencing: {
    title: 'Post-Test: Process Sequencing',
    subtitle: 'Chronological Unit Operations & Manufacturing Logic',
  },

  evaluation: {
    title: 'Review: Laboratory Mastery & Certification',
    subtitle: 'Sensory Audit & Quality Verification',
  },

  results: {
    title: 'Review: Master Answer Key & Debrief',
    subtitle: 'Comprehensive Scientific Explanations & Audit',
  }
};
