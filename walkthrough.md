# Walkthrough: PITHQUEST (React.js Virtual Laboratory Game)

We have built and launched **PITHQuest** as a modern, responsive React.js web-based gamified educational laboratory simulation for Home Economics (HE) food technology students learning the preparation and processing of **Coconut Pith Crackers** (*Ubod ng Niyog*).

---

## 🚀 Live Access
* **Local Development Server:** `http://localhost:5174/`
* **Local Network (Mobile/Tablet):** `http://192.168.100.8:5174/`

---

## 🎨 Aesthetic & Design Integration
* **Visual Direction:** Cozy 2D Educational Culinary Laboratory aesthetic with warm cream countertops, mint-tiled laboratory walls, and clean tactile cards.
* **Character Assets:** Teacher Mia with 3 emotional states (`neutral` greeting, `thinking` hint/caution, `happy` thumbs-up celebration).
* **Bespoke Food & Tool Graphics:** Illustrated fresh coconut pith, starch canisters, seasonings, stockpot, dehydrator, and golden puffed crackers.
* **Audio Engine:** Zero-dependency Web Audio API procedural synthesizer providing realistic kitchen sound effects (knife chops, water pours, boiling bubbles, hot oil sizzle, crispy crunch, and victory chimes).

---

## 🧩 Architectural Implementation (React + Vite)

### 1. Global State Management (`src/context/GameContext.jsx`)
* Reactive centralized state engine managing:
  * Active scene transitions (`title` ➔ `orientation` ➔ `mission1` ➔ `mission2` ➔ `mission3` ➔ `mission4` ➔ `mission5` ➔ `evaluation`)
  * Score & points accumulation (with `⭐` bounce animations)
  * Star rating (1 to 3 stars based on precision)
  * Badge system (unlocking ribbons for sanitation, formulation, thermal control, and frying)
  * Student name persistence in `localStorage`
  * Dynamic Teacher Mia dialogue with typewriter effects and context-sensitive feedback
  * Floating toast notifications and audio synchronization

### 2. The 3-Phase Educational Sequence

#### Phase 1: Orientation & Pre-Lab
* **Title Scene (`src/scenes/TitleScene.jsx`):** Welcoming cover with student name input, audio initialization, and quick modal links for *Learning Objectives* (Cognitive, Psychomotor, Affective) and the *Standard Recipe*.
* **Orientation & PPE Check (`src/scenes/OrientationScene.jsx`):** Interactive health benefits of coconut pith (high dietary fiber, potassium, zero-waste valorization) followed by a mandatory 3-item PPE check (hairnet, apron, hand sanitizer) that awards the **Sanitation Guardian 🧼** badge (+50 PTS).

#### Phase 2: The 5 Hands-on Laboratory Missions
* **Stage 1: Raw Prep & Slicing (`src/scenes/Mission1Prep.jsx`):** Placing raw coconut pith on the wooden cutting board, slicing tough fibers into uniform cubes with the chef's knife, and transferring into the stainless steel prep bowl.
* **Stage 2: Thermal Softening & Boiling (`src/scenes/Mission2Boiling.jsx`):** Adding water, igniting the burner, boiling the ubod with an interactive tenderness gauge, and pureeing into a smooth paste in the blender.
* **Stage 3: Formulation & Mixing (`src/scenes/Mission3Mixing.jsx`):** Measuring and sequencing tapioca starch (the puffing agent), pureed ubod, and savory seasonings (salt, garlic powder, sugar) into the mixing bowl, kneading with a spatula, with distractor penalty detection.
* **Stage 4: Moisture Removal & Dehydration (`src/scenes/Mission4Dehydration.jsx`):** Loading sliced cracker discs onto perforated stainless mesh trays, setting cabinet temperature to 60°C, and watching product moisture drop from 75% down to 9% to yield glassy raw pellets.
* **Stage 5: Deep Frying & Expansion (`src/scenes/Mission5Frying.jsx`):** Monitoring oil temperature until reaching the green optimal zone (180°C), dropping dried pellets to trigger flash steam expansion (3x puff), and scooping with the wire spider skimmer onto a cooling rack.

#### Phase 3: Mastery & Certification
* **Evaluation Scene (`src/scenes/EvaluationScene.jsx`):** Sensory quality audit (5/5 ratings on color, crunch, puff ratio, and non-greasy texture), final score breakdown, badge ribbons showcase, and an **Official Printable / Downloadable Certificate of Completion** with the student's name, date, and signatures.

---

## 📱 Dual-Input & Responsive Controls
* Supports both **drag-and-drop** and a frictionless **tap-to-place** interaction model (tap item on tray ➔ tap target workstation) for seamless play on smartphones, tablets, and desktop browsers.

---

## ♨️ Stage 5 Overhaul: Starch Steaming & Gelatinization
* **Accurate 5-Step Asset Progression:**
  1. **Step 0:** Open aluminum steamer base pot on stove (`/assets/steamer_base_stove.png`) accepts 1 cup Potable Water from pitcher (`soundManager.playPour()`).
  2. **Step 1:** Molded Ubod Tray loaded into perforated middle steamer tier (`/assets/steamer_tier_with_mold.png`).
  3. **Step 2:** Domed lid sealed in cold standby state (`/assets/steamer_assembled_unlit.png`) with interactive button `♨️ Ignite Burner & Start 10-Min Steam`.
  4. **Step 3:** Active 100°C rolling steam cycle with blue gas flames and billowing steam clouds (`/assets/steamer_assembled_steaming.png`), boiling audio (`soundManager.playBoil()`), live 100°C temp gauge, and animated progress countdown.
  5. **Step 4:** Steamer uncovered showing cooked, glossy, semi-translucent gelatinized crackers (`/assets/steamer_opened_cooked.png`). Requires donning **Silicone Heat Mitts** (Thermal PPE) to transfer hot mold to the cooling rack.
  6. **Step 5:** Mold resting on wire cooling rack (`/assets/steamed_mold_on_cooling_rack.png`), starch matrix set, unlocking badge `steam_artisan` and transitioning to Stage 6 Dehydration.
* **Dual-Console Symmetrical Layout:**
  - Left Console (440px): `<MultiStateContainer>` with 280px viewport height and brushed metal footer.
  - Right Console (360px): `Steaming QC & Gelatinization Monitor` with live 100°C temperature gauge, 10-minute cycle progress bar, before/after texture indicator, and food science principle card.
  - Aligned with `padding-top: 24px` and `align-items: flex-start` to prevent any vertical cut-offs or collisions with Teacher Mia's dialogue box.

