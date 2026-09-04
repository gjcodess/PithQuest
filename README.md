# 🥥 PITHQuest: Coconut Pith Crackers Virtual Laboratory

A gamified, interactive educational web simulation designed for **Home Economics (HE) Food Technology & Processing** students. Learn the scientific process of valorizing coconut pith (*Ubod ng Niyog*) into nutritious, high-expansion crispy crackers.

---

## 📖 Overview

**PITHQuest** bridges theoretical food processing principles and hands-on laboratory practice. Guided by **Teacher Mia**, learners step through the end-to-end culinary processing pipeline—from sanitation and cell-wall softening to starch retrogradation, dehydration, and hot-oil thermal flash-expansion.

### 🔬 The 5 Processing Stages

1. **Stage 1: Raw Prep & Slicing** — Wash, measure (200g), and dice fresh fibrous coconut pith into uniform pieces on the prep board.
2. **Stage 2: Boiling & Softening** — Hydrolyze tough cellulose and lignin fibers at 100°C to achieve optimal puree consistency in the blender.
3. **Stage 3: Formulation & Mixing** — Accurately balance the dough using tapioca starch (binder/puffing agent), water, and savory seasonings.
4. **Stage 4: Dehydration** — Monitor moisture content as pellets dry from ~75% to under 9% in the cabinet dehydrator, creating a stable glassy starch matrix.
5. **Stage 5: Deep Frying & Expansion** — Flash-steam residual moisture at 180°C in cooking oil to achieve 3.5× volume puffing and golden crispness.
6. **Mastery: Sensory Evaluation & Certificate** — Complete a 4-metric sensory evaluation audit and generate a printable, personalized Certificate of Lab Mastery.

---

## ✨ Key Features

- **Cozy 2D Vector Culinary Aesthetic:** Warm honey wood, cream parchment, and palm green palettes with tactile 3D interactive buttons.
- **Zero-Dependency Sound Synthesizer:** Built-in procedural audio engine using the native Web Audio API (realistic knife chops, boiling water, blender whirs, oil sizzles, and victory chimes).
- **Teacher Mia Dialogue System:** Contextual instruction bubbles with typewriter animation, hints, and dynamic tray clearance.
- **Interactive PPE Safety Check:** Enforces kitchen laboratory standards (hairnet, apron, handwashing) before food prep begins.
- **Custom In-Game Dialogs:** Fully-styled confirmation modals, recipe reference guides, and learning objective cards.
- **Printable Certificate:** Dynamic print-ready layout for student portfolio submission.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** Vanilla CSS with custom Design Tokens (`theme.css`, `game.css`, `responsive.css`)
- **Typography:** [Fredoka](https://fonts.google.com/specimen/Fredoka) & [Quicksand](https://fonts.google.com/specimen/Quicksand) via Google Fonts
- **Audio:** Web Audio API (`soundManager.js`)
- **Asset Pipeline:** Custom alpha processing with `sharp`

---

## 📂 Project Structure

```text
PithQuest/
├── public/
│   └── assets/              # Illustrated backgrounds, icons & character art
├── scratch/
│   └── process_transparent.js # Sharp-based asset transparency pipeline
├── src/
│   ├── audio/
│   │   └── soundManager.js   # Procedural Web Audio synthesizer
│   ├── components/
│   │   ├── Modals/
│   │   │   ├── ConfirmModal.jsx    # Custom return-to-menu confirmation modal
│   │   │   ├── ObjectivesModal.jsx # Cognitive, psychomotor & affective goals
│   │   │   └── RecipeModal.jsx     # Standard recipe & processing pillars
│   │   ├── DialogueBox.jsx         # Teacher Mia dialogue bubble
│   │   ├── HeaderHUD.jsx           # Top progress stepper, score & menu controls
│   │   └── Toast.jsx               # Audio-visual feedback toasts
│   ├── context/
│   │   └── GameContext.jsx         # Global state (scores, badges, modals, scenes)
│   ├── engine/
│   │   ├── dragDropManager.js      # Pointer/touch drag-and-drop mechanics
│   │   └── stateManager.js         # Lab progression engine
│   ├── scenes/
│   │   ├── TitleScene.jsx          # Welcome screen & student registration
│   │   ├── OrientationScene.jsx    # Nutritional benefits & PPE sanitation check
│   │   ├── Mission1Prep.jsx        # Cutting board & raw slicing
│   │   ├── Mission2Boiling.jsx     # Softening gauge & pureeing
│   │   ├── Mission3Mixing.jsx      # Tapioca dough formulation
│   │   ├── Mission4Dehydration.jsx # Moisture reduction gauge
│   │   ├── Mission5Frying.jsx      # 180°C oil thermal expansion
│   │   └── EvaluationScene.jsx     # Sensory audit & printable certificate
│   ├── styles/
│   │   ├── theme.css               # Color tokens, typography & button styles
│   │   ├── game.css                # Workstation layouts & scene animations
│   │   └── responsive.css          # Mobile & tablet adaptations
│   ├── App.jsx                     # Root application container
│   └── main.jsx                    # Vite React entrypoint
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. Clone or download the repository:
   ```bash
   git clone <your-repository-url>
   cd PithQuest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the displayed local port (typically `http://localhost:5173/` or `http://localhost:5174/`).

---

## 📦 Production Build

To create an optimized production bundle:

```bash
npm run build
```

To preview the built production site locally:

```bash
npm run preview
```

---

## 📜 Educational Curriculum Alignment

- **Course:** Home Economics (HE) - Food Processing & Technology
- **Topic:** Utilization and valorization of agricultural by-products (*Coconut Ubod*)
- **Core Competencies:**
  - Strict adherence to personal protective equipment (PPE) and food hygiene.
  - Understanding gelatinization, retrogradation, and thermal puffing in snack processing.
  - Moisture control standards for shelf-stable dehydrated food products.
