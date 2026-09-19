import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  NumberFormat
} from 'docx';

async function generateDocx() {
  const diagramsDir = path.resolve('docs/diagrams');
  
  // Helper to get image run with proportional scaling to max width
  async function createImageRun(filename, maxWidth = 550) {
    const filePath = path.join(diagramsDir, filename);
    const metadata = await sharp(filePath).metadata();
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = Math.round(height * ratio);
    }
    
    return new ImageRun({
      data: fs.readFileSync(filePath),
      transformation: {
        width,
        height,
      },
    });
  }

  const imgArch = await createImageRun('uml_architecture.png', 540);
  const imgState = await createImageRun('uml_state_navigation.png', 540);
  const imgSysFlow = await createImageRun('figure46_system_flowchart.png', 540);
  const imgGameFlow = await createImageRun('figure47_gameplay_flowchart.png', 480);

  // Table 2 Data
  const modules = [
    { num: '1', title: 'Main Menu', desc: 'This refers to the initial screen and interactive navigation hub presented to users upon launching the application. It hosts system access points including Start, Audio Controls, Recipe SOP Guide, About, and Exit.' },
    { num: '2', title: 'Start / Student Registration', desc: 'Allows learners to register their student identity, initialize a fresh laboratory manufacturing batch, or resume active module progress.' },
    { num: '3', title: 'Volume / Audio Controls', desc: 'Enables users to toggle or mute procedural sound synthesis, audio cues, and Teacher Mia\'s verbal guidance to suit classroom environments.' },
    { num: '4', title: 'Recipe SOP & Food Safety Guide', desc: 'Provides an accessible reference guide detailing standard cracker formulation parameters, raw material ratios, GMP hygiene guidelines, and food safety standards.' },
    { num: '5', title: 'About & Project Documentation', desc: 'Presents academic background information regarding the research study, the valorization of coconut pith (ubod), educational objectives, and developer credits.' },
    { num: '6', title: 'Exit / Batch Reset', desc: 'A system feature enabling students to terminate the current simulation session, clear temporary state, and safely return to the title screen.' },
    { num: '7', title: 'Pre-Test Orientation Module (Sanitary Defense & GMP)', desc: 'A four-part diagnostic safety audit comprising Personal Protective Equipment (PPE) selection, the WHO 7-step handwashing sequence, food-grade tool inspection, and raw ingredient quality control.' },
    { num: '8', title: 'Stage 1: Wash & Hydrothermal Softening', desc: 'Simulates washing raw coconut pith strips and boiling them at 100°C to soften rigid cellulosic cell walls and inactivate polyphenol oxidase (PPO) enzymes.' },
    { num: '9', title: 'Stage 2: High-Shear Pureeing & Homogenization', desc: 'Simulates high-shear mechanical blending of softened coconut pith into a uniform, microscopic fiber pulp free of coarse fibrous lumps.' },
    { num: '10', title: 'Stage 3: 1:1 Dough Formulation & Mixing', desc: 'Focuses on combining boiled ubod puree with pure rice flour at an exact 1:1 mass ratio and 1% iodized salt to achieve balanced viscoelastic dough structure.' },
    { num: '11', title: 'Stage 4: Precision Sheet Molding & Cutting', desc: 'Instructs learners on sheeting dough to a uniform 2mm thickness and cutting uniform 50mm × 25mm rectangular cracker pieces for consistent thermal conductivity.' },
    { num: '12', title: 'Stage 5: Atmospheric Starch Steaming', desc: 'Involves atmospheric steaming of molded cracker blanks for 10 minutes at 100°C to induce complete amylose/amylopectin starch gelatinization.' },
    { num: '13', title: 'Stage 6: Convective Cabinet Dehydration', desc: 'Simulates convective hot-air drying at 60–90°C to reduce cracker moisture content below the critical 10% threshold to prevent mold and prepare for puffing.' },
    { num: '14', title: 'Stage 7: Flash Deep Frying & Steam Expansion', desc: 'Simulates immersion deep frying in clean vegetable oil, triggering rapid steam expansion and crisp cracker formation.' },
    { num: '15', title: 'Stage 8: Nitrogen-Flushed Barrier Packaging', desc: 'Focuses on cooling crackers to ambient temperature and sealing them into nitrogen-flushed, multi-layer aluminum Kraft pouches to prevent lipid oxidation and staling.' },
    { num: '16', title: 'Post-Test Process Sequencing Module', desc: 'A chronological assessment module requiring learners to drag and order all eight authentic unit operations into the correct production pipeline with real-time feedback.' },
    { num: '17', title: 'Master Review & Comprehensive Answer Key', desc: 'A pressure-free instructional study debrief replacing traditional scores with a 6-part navigation directory, full 4-choice question answer keys, scientific explanations, and browser Print-to-PDF export.' },
  ];

  // Helper styles
  const thinBorder = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: 'CCCCCC',
  };
  const cellBorders = {
    top: thinBorder,
    bottom: thinBorder,
    left: thinBorder,
    right: thinBorder,
  };

  // Header row
  const tableRows = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          borders: cellBorders,
          shading: { fill: '1E3A2B' },
          width: { size: 12, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'PROJECT NUMBER', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorders,
          shading: { fill: '1E3A2B' },
          width: { size: 30, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'PROJECT TITLE', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })],
            }),
          ],
        }),
        new TableCell({
          borders: cellBorders,
          shading: { fill: '1E3A2B' },
          width: { size: 58, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'PROJECT DESCRIPTION', bold: true, color: 'FFFFFF', size: 18, font: 'Calibri' })],
            }),
          ],
        }),
      ],
    }),
  ];

  // Module data rows
  modules.forEach((mod, idx) => {
    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : 'F9F6F0';
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            shading: { fill: bgFill },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: mod.num, bold: true, size: 18, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            shading: { fill: bgFill },
            children: [
              new Paragraph({
                children: [new TextRun({ text: mod.title, bold: true, color: '15803D', size: 18, font: 'Calibri' })],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            shading: { fill: bgFill },
            children: [
              new Paragraph({
                children: [new TextRun({ text: mod.desc, size: 18, font: 'Calibri' })],
              }),
            ],
          }),
        ],
      })
    );
  });

  const table2 = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows,
  });

  const doc = new Document({
    creator: 'PithQuest Development Team',
    title: 'PithQuest System Diagrams and Instructional Modules',
    description: 'Academic Manuscript and Capstone Documentation Reference',
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
            color: '222222',
          },
          paragraph: {
            spacing: { line: 280, after: 140 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'PITHQUEST: Academic System Reference & Diagrams', italics: true, size: 16, color: '888888', font: 'Calibri' }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Page ', size: 18, font: 'Calibri' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Calibri' }),
                  new TextRun({ text: ' of ', size: 18, font: 'Calibri' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: 'Calibri' }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Document Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: 'PITHQUEST: System Architecture, UML Maps & Flowcharts',
                bold: true,
                size: 36,
                color: '1E3A2B',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Academic Manuscript & Documentation Reference (Updated Flow & Instructional Model)',
                italics: true,
                size: 22,
                color: '5C3E21',
                font: 'Calibri',
              }),
            ],
          }),

          // Section 1: UML Architecture
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '1. UML Map 1: System Component Architecture', bold: true, color: '15803D' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [imgArch],
          }),
          new Paragraph({
            spacing: { before: 120, after: 200 },
            children: [
              new TextRun({
                text: 'This diagram illustrates the revised component architecture of the PithQuest web application, emphasizing its role as an active instructional material. The presentation layer comprises the primary user interface elements, including the top Header HUD (featuring the REVIEW final stage step), Teacher Mia\'s interactive pedagogical dialogues, recipe reference modals, and instant formative feedback checkpoint modals. These UI elements connect directly to the central Game Manager (GameContext), which governs application state, procedural Web Audio effects (soundManager), and interactive drag-and-drop mechanics. The system coordinates scene routing across the five major architectural phases: the Title Screen, Pre-Test Orientation, eight interactive Manufacturing Workstations, the Post-Test Process Sequencing assessment, and the comprehensive Master Review & Complete Answer Key.',
              }),
            ],
          }),

          // Section 2: UML State Navigation
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '2. UML Map 2: Game State Navigation', bold: true, color: '15803D' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [imgState],
          }),
          new Paragraph({
            spacing: { before: 120, after: 200 },
            children: [
              new TextRun({
                text: 'This state diagram illustrates the operational state transitions of PithQuest under its formative instructional model. Rather than withholding feedback until the end of the session, the application provides immediate right/wrong verification at every milestone: (1) Pre-Test State, dividing safety activities into PPE attire selection, WHO 7-step handwashing, tool safety inspection, and raw ingredient quality control with instant visual and auditory verification; (2) Manufacturing Stages State (Stages 1–8), where each stage begins with an instructional Checkpoint Question Modal employing a 1-click instant reveal of correct procedures and biochemical rationales before unlocking cooking workstations; (3) Post-Test Sequencing State, where learners reconstruct the chronological 8-stage timeline with real-time slot verification; and (4) Master Review State, providing an instructional debrief and complete answer key with print-to-PDF export.',
              }),
            ],
          }),

          // Section 3: System Flowchart
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '3. System Flowchart', bold: true, color: '15803D' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [imgSysFlow],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 140 },
            children: [
              new TextRun({ text: 'Figure 46. System Flowchart', bold: true, size: 22, color: '1E3A2B', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'The flowchart shows the User Interface and operational architecture of the PithQuest educational web application, where the system initiates once the application is opened in a modern web browser. Upon launching the application, an asset initialization and viewport verification check occurs (ensuring a tablet or desktop display width of at least 768px), after which the title screen is displayed, serving as the main menu hub. The main menu features five primary interaction pathways: Start, Sound, Recipe SOP, About, and Exit. Pressing the Start button directs the student to user identification (entering their student name) and initiates the learning sequence via Connector (C), leading into the Pre-Test Orientation module. The Sound button allows users to toggle procedural sound synthesis and instructional audio on or off to accommodate classroom or self-paced environments, returning directly to the main menu hub via Connector (A). The Recipe SOP button opens a reference modal detailing standard operating procedures, raw ingredient ratios (1:1 boiled ubod to rice flour), and processing parameters before returning to the main menu upon closure. The About button presents educational objectives, food technology research on coconut pith (ubod) valorization, Good Manufacturing Practices (GMP) references, and developer information, returning via Connector (A). The Exit button prompts the student with a confirmation dialog ("Are you sure?"); confirming terminates the current session and resets state, while canceling routes the learner back to the title screen via Connector (A). From the Pre-Test Orientation, learners complete four diagnostic safety tasks (PPE selection, WHO 7-step handwashing friction sequence, equipment hygiene inspection, and raw material quality control). Each task provides immediate visual and textual verification. Upon clearance, users advance to the Manufacturing Stage Selection via Connector (B). Each stage displays authentic food science principles and standard operating parameters before opening the interactive cooking simulation. Upon successfully completing a workstation task, the user receives an authentic stage clearance badge and verified milestone. A decision point assesses whether additional stages remain; if yes, the user loops to the next stage via Connector (B). When all eight manufacturing stages are finished, the student is routed to the Post-Test Sequencing puzzle to reconstruct the chronological production pipeline, and finally to the Master Review and Complete Answer Key. From this study space, the user may print a comprehensive study guide PDF or choose to process a new batch via Connector (B) or return to the main menu via Connector (A).',
              }),
            ],
          }),

          // Section 4: Gameplay System Flowchart
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '4. Gameplay System Flowchart', bold: true, color: '15803D' })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [imgGameFlow],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 140 },
            children: [
              new TextRun({ text: 'Figure 47. Gameplay System Flowchart', bold: true, size: 22, color: '1E3A2B', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'The gameplay system flowchart illustrates the repetitive, mastery-based formative instructional loop executed across PithQuest\'s learning workstations. Entry into an active workstation occurs via Connector (B) into the PLAY state (referenced by sub-connector (B1)). In the LEARN State, the player is presented with the instructional foundation of the workstation via Connector (B2). This includes standard operating procedures (SOP), critical temperature and moisture limits, equipment specifications, and underlying food chemistry principles (e.g., polyphenol oxidase denaturation, starch gelatinization, retrogradation, and steam flash expansion). In the TAKE CHECKPOINT & COOKING TASK, the learner engages in a 4-choice conceptual checkpoint question followed by an interactive drag-and-drop or tactile processing simulation (e.g., controlling temperature sliders, assembling formulation ratios, adjusting convective drying time, or frying crackers). At the DECISION (Is the answer / SOP correct?), if NO, the system executes an instant formative feedback intervention. Rather than penalizing the student or terminating the game, the application visually highlights the correct standard, flags hazardous or inaccurate choices, explains the biochemical rationale behind the error, and directs the learner back via Connector (B2) to review the principle and adjust their procedure. If YES, the learner transitions to the reward state (parallelogram), earning an authentic stage clearance badge, auditory confirmation chime, and an updated step progression within the header HUD. In PROCEED TO NEXT STAGE, the learner advances to the next unit operation in the production sequence. A conditional check evaluates whether all eight manufacturing stages and the Post-Test sequencing puzzle have been satisfied: if incomplete (NO), the flow loops back to Connector (B1) to begin the next sequential processing stage; if complete (YES), the system transitions into the Master Review & Comprehensive Answer Key space, unlocking the complete study guide, question-by-question scientific breakdowns, and print-to-PDF capabilities before reaching the terminal END GAME state.',
              }),
            ],
          }),

          // Section 5: Table 2
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [new TextRun({ text: '5. Game Content / Instructional Modules', bold: true, color: '15803D' })],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Table 2', bold: true, size: 24, color: '1E3A2B', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Modules of the PithQuest Educational Web Application', bold: true, size: 22, color: '15803D', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({ text: 'These are the following details on each module of the PithQuest educational web application.', italics: true, size: 20, color: '555555', font: 'Calibri' }),
            ],
          }),
          table2,

          // Section 6: Detailed Module Subsections
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240 },
            children: [new TextRun({ text: '6. Module Architectural Details', bold: true, color: '15803D' })],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Main Menu', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'In web-based educational simulations, the Main Menu serves as the primary visual anchor and centralized interface presented to learners upon accessing the application URL. In PithQuest, this module initializes the application layout, enforces responsive display validation (requiring a minimum viewport width of 768 pixels for optimal tablet/desktop laboratory simulation), preloads graphic assets, and establishes the procedural Web Audio synthesizer. The main menu houses intuitive tactile buttons allowing learners to initiate the simulation, configure audio parameters, examine standardized recipe formulations, review research background documentation, or reset application state.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Start / Student Registration', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Start module initiates the active laboratory journey. Upon clicking the start action button, the system prompts the user to input their full name or student identification code. This identifier is dynamically bound to the application state manager (GameContext) and saved in local browser storage. It personalizes ongoing teacher dialogue prompts throughout all workstations and is stamped onto the final printable Master Study Guide and laboratory debrief document.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Volume / Audio Controls', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Volume control module provides immediate sound management. The application uses procedural Web Audio API synthesis to deliver tactile button clicks, equipment hums, boiling water acoustics, frying sizzle, and pleasant pedagogical chime indicators. Pressing the volume toggle mutes or unmutes all auditory feedback instantly, ensuring the application can operate seamlessly in quiet classrooms, university food laboratories, or noisy computer laboratories without disrupting others.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Recipe SOP & Food Safety Guide', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Recipe SOP Guide is an instructional overlay designed to provide learners with an authentic industrial processing reference before and during manufacturing. It details the exact commercial formulation developed through food technology research: a 1:1 mass ratio of hydrothermal softened coconut pith puree to pure rice flour, paired with 1% iodized salt. It also outlines critical control points (CCPs), target moistures, and hygienic parameters, serving as a ready reference throughout the simulation.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'About & Project Documentation', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The About module provides academic context on the valorization of agricultural coconut by-products—specifically coconut pith (ubod), which is frequently underutilized or discarded during agricultural processing. This section details the research objectives, the integration of Good Manufacturing Practices (GMP) and Hazard Analysis Critical Control Points (HACCP) principles, the curriculum alignment with food technology coursework, and the development team behind PithQuest.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Exit / Batch Reset', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Exit module provides a safe mechanism for terminating the current simulation run. Clicking the exit option invokes a modal confirmation dialog inquiring if the learner wishes to discard current progress. Confirming this action resets all workstation states, clears completed pre-test and post-test data structures, and returns the learner cleanly to the main menu title screen.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Pre-Test Orientation Module (Sanitary Defense & GMP Protocol)', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Pre-Test Orientation module is a foundational four-part diagnostic assessment that must be completed prior to entering the commercial food production environment: (1) Personal Protective Equipment (PPE) Selection, where learners select approved food-grade barriers (hairnet, clean lab gown/apron, fluid-resistant mask, vinyl gloves) while avoiding non-approved contaminants and fire hazards (e.g., loose knitted wool scarves, fashion sunglasses) with immediate visual hazard flags; (2) WHO 7-Step Handwashing Sequence, where learners drag and reorder the seven World Health Organization hand hygiene friction steps with dynamic slot-by-slot validation; (3) Tool & Equipment Safety Inspection, where students evaluate pairs of processing implements, identifying sanitary food-grade stainless steel utensils while rejecting pitted, corroded, or splintered wooden tools that harbor microbial biofilms; and (4) Raw Ingredient Quality Inspection, where learners inspect incoming raw coconut pith, rice flour, frying oil, and salt, screening for physical discoloration, insect infestation, rancidity, and foreign matter contamination.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Manufacturing Stages (Stages 1 to 8)', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The core processing curriculum consists of eight authentic unit operations: Stage 1 (Hydrothermal Softening) teaches washing and boiling ubod; Stage 2 (High-Shear Pureeing) teaches mechanical grinding; Stage 3 (Dough Formulation) combines the ingredients into a uniform dough; Stage 4 (Precision Molding) forms consistent portions; Stage 5 (Steaming) cooks and binds the mixture; Stage 6 (Dehydration) removes moisture; Stage 7 (Deep Frying) expands the dried products until they become crispy; Stage 8 (Packaging) prepares the crackers for storage. Each stage begins with an instructional Checkpoint Question before launching the interactive cooking mini-game.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Post-Test Process Sequencing Module', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Following the completion of all eight workstations, learners engage with the Post-Test Sequencing module. This summative timeline reconstruction task challenges students to place all eight unit operations in their proper chronological order (from washing/softening through packaging). Submitting the arrangement triggers instant slot-by-slot validation, visual confirmation, and an overarching summary lesson on commercial cracker manufacturing flow.',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: 'Master Review & Comprehensive Answer Key Module', bold: true, color: '1E3A2B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The Master Review module serves as the final pedagogical capstone of PithQuest. Designed intentionally as a pressure-free study debrief rather than a punitive grading screen, it features: a 6-part quick-jump navigation directory (PPE Standards, Handwashing Protocol, Tool Inspection, Ingredient Quality, Manufacturing Checkpoints 1–8, and Production Flow Pipeline); full 4-choice checkpoint breakdowns displaying the student\'s selected answer, the correct industry standard, and in-depth scientific rationales; a Native Print-to-PDF Study Guide button allowing students and instructors to generate an official laboratory review sheet; and a Process New Batch button to restart the simulation with a clean slate for continued mastery learning.',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('docs/PITHQUEST_SYSTEM_DIAGRAMS_AND_MODULES.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated DOCX successfully at: ${outputPath} (${buffer.length} bytes)`);
}

generateDocx().catch((err) => {
  console.error(err);
  process.exit(1);
});
