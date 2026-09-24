import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('docs/manual-assets');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser via Playwright (msedge/chrome channel)...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch (err) {
    console.log('Chrome launch fallback to Edge:', err.message);
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // Handle Loading Screen if present
  console.log('Checking loading screen...');
  try {
    const enterBtn = page.locator('.btn-enter-lab-pulsing, button:has-text("Enter Laboratory Activity")').first();
    await enterBtn.waitFor({ state: 'visible', timeout: 12000 });
    console.log('Clicking Enter Laboratory button (force: true)...');
    await enterBtn.click({ force: true });
    await page.waitForTimeout(800);
  } catch (e) {
    console.log('Loading screen bypassed or already completed:', e.message);
  }

  // Ensure on title screen
  await page.waitForSelector('.title-scene', { timeout: 10000 });
  console.log('On Title Scene!');

  // Fill student name
  const nameInput = page.locator('#student-name');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Glenn - Lead Food Technologist');
  }

  await page.waitForTimeout(600);

  // 1. Title / Home Screen & Main Menu
  console.log('Capturing step-01-title-main-menu.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-01-title-main-menu.png') });

  // 2. Learning Objectives Modal
  console.log('Opening Learning Objectives modal...');
  const objBtn = page.locator('button:has-text("Learning Objectives")').first();
  if (await objBtn.isVisible()) {
    await objBtn.click({ force: true });
    await page.waitForSelector('.modal-card', { timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('Capturing step-02-learning-objectives.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-02-learning-objectives.png') });
    await page.locator('.modal-header .close-btn, .modal-footer button').first().click({ force: true });
    await page.waitForTimeout(500);
  }

  // 3. Recipe & Standards Modal
  console.log('Opening Recipe & Standards modal...');
  const recipeBtn = page.locator('button:has-text("Recipe & Standards")').first();
  if (await recipeBtn.isVisible()) {
    await recipeBtn.click({ force: true });
    await page.waitForSelector('.modal-card', { timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('Capturing step-03-recipe-standards.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-03-recipe-standards.png') });
    await page.locator('.modal-header .close-btn, .modal-footer button').first().click({ force: true });
    await page.waitForTimeout(500);
  }

  // 4. System Overview Modal
  console.log('Opening System Overview modal...');
  const sysBtn = page.locator('button:has-text("System & Learning Overview")').first();
  if (await sysBtn.isVisible()) {
    await sysBtn.click({ force: true });
    await page.waitForSelector('.modal-card', { timeout: 5000 });
    await page.waitForTimeout(500);
    console.log('Capturing step-04-system-overview.png...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-04-system-overview.png') });
    await page.locator('.modal-header .close-btn, .modal-footer button').first().click({ force: true });
    await page.waitForTimeout(500);
  }

  // Enter Laboratory Activity -> Orientation Scene
  console.log('Entering laboratory to Pre-Test Orientation...');
  const startLabBtn = page.locator('.start-form button.btn-start, button:has-text("Enter Laboratory Activity")').last();
  await startLabBtn.click({ force: true });
  await page.waitForTimeout(1200);

  // 5. Orientation Pre-Test: PPE Selection
  console.log('Capturing step-05-pretest-ppe-attire.png...');
  await page.waitForSelector('.orientation-scene', { timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-05-pretest-ppe-attire.png') });

  // Select approved PPE items to show user interaction
  const ppeCards = page.locator('.ppe-card');
  const count = await ppeCards.count();
  for (let i = 0; i < count; i++) {
    const card = ppeCards.nth(i);
    const text = await card.innerText();
    // Select approved gear, avoid distractors
    if (!text.includes('Scarf') && !text.includes('Sunglasses') && !text.includes('Goggles')) {
      await card.click({ force: true });
      await page.waitForTimeout(120);
    }
  }
  await page.waitForTimeout(500);

  // 6. Orientation Pre-Test: Handwashing Sequence
  console.log('Navigating to Task 2: Handwashing Sequence...');
  const confirmPpeBtn = page.locator('button:has-text("Confirm PPE Selection"), button:has-text("Confirm PPE Attire")').first();
  if (await confirmPpeBtn.isVisible()) {
    await confirmPpeBtn.click({ force: true });
  } else {
    await page.locator('button.subnav-pill:has-text("Handwashing")').first().click({ force: true });
  }
  await page.waitForTimeout(1200);
  console.log('Capturing step-06-pretest-handwashing-sequence.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-06-pretest-handwashing-sequence.png') });

  // 7. Orientation Pre-Test: Tool Safety Inspection
  console.log('Navigating to Task 3: Tool Safety Inspection...');
  const confirmHwBtn = page.locator('button:has-text("Confirm Handwashing Sequence"), button:has-text("Proceed to Tool Safety")').first();
  if (await confirmHwBtn.isVisible()) {
    await confirmHwBtn.click({ force: true });
  } else {
    await page.locator('button.subnav-pill:has-text("Tool Safety")').first().click({ force: true });
  }
  await page.waitForTimeout(1200);
  console.log('Capturing step-07-pretest-tool-inspection.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-07-pretest-tool-inspection.png') });

  // 8. Orientation Pre-Test: Ingredient Quality Inspection
  console.log('Navigating to Task 4: Ingredient Quality Inspection...');
  const confirmToolBtn = page.locator('button:has-text("Proceed to Ingredient Inspection"), button:has-text("Confirm Tool Inspection")').first();
  if (await confirmToolBtn.isVisible()) {
    await confirmToolBtn.click({ force: true });
  } else {
    await page.locator('button.subnav-pill:has-text("Quality Inspection")').first().click({ force: true });
  }
  await page.waitForTimeout(1200);
  console.log('Capturing step-08-pretest-ingredient-inspection.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-08-pretest-ingredient-inspection.png') });

  // Helper to switch scene and proceed through Checkpoint question into interactive workstation
  async function captureSceneWorkstation(sceneName, filename, logMsg) {
    console.log(logMsg);
    await page.evaluate((s) => {
      if (window.__setPalmQuestScene) {
        window.__setPalmQuestScene(s);
      }
    }, sceneName);
    await page.waitForTimeout(800);

    // If CheckpointQuestionModal is open, select choice and proceed to workstation
    try {
      const choiceBtn = page.locator('.checkpoint-choice-btn').first();
      if (await choiceBtn.isVisible({ timeout: 1500 })) {
        await choiceBtn.click({ force: true });
        await page.waitForTimeout(200);
        const proceedBtn = page.locator('.btn-checkpoint-proceed').first();
        if (await proceedBtn.isVisible()) {
          await proceedBtn.click({ force: true });
          await page.waitForTimeout(800);
        }
      }
    } catch (e) {
      // ignore if modal is not present
    }

    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, filename) });
  }

  // Sample checkpoint question screenshot for manual demonstration
  console.log('Capturing checkpoint pre-check question sample...');
  await page.evaluate(() => {
    if (window.__setPalmQuestScene) {
      window.__setPalmQuestScene('mission5');
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'sample-stage-precheck-question.png') });

  // 9. Stage 1: Washing & Boiling Workstation
  await captureSceneWorkstation(
    'mission1',
    'step-09-stage1-washing-boiling.png',
    'Capturing step-09-stage1-washing-boiling.png (Stage 1 Workstation)...'
  );

  // 10. Stage 2: Pureeing & Grinding Workstation
  await captureSceneWorkstation(
    'mission2',
    'step-10-stage2-pureeing-grinding.png',
    'Capturing step-10-stage2-pureeing-grinding.png (Stage 2 Workstation)...'
  );

  // 11. Stage 3: Paste Formulation Workstation
  await captureSceneWorkstation(
    'mission3',
    'step-11-stage3-paste-formulation.png',
    'Capturing step-11-stage3-paste-formulation.png (Stage 3 Workstation)...'
  );

  // 12. Stage 4: Rectangular Molding Workstation
  await captureSceneWorkstation(
    'mission4',
    'step-12-stage4-rectangular-molding.png',
    'Capturing step-12-stage4-rectangular-molding.png (Stage 4 Workstation)...'
  );

  // 13. Stage 5: Starch Steaming Workstation
  await captureSceneWorkstation(
    'mission5',
    'step-13-stage5-starch-steaming.png',
    'Capturing step-13-stage5-starch-steaming.png (Stage 5 Workstation)...'
  );

  // 14. Stage 6: Cabinet Dehydration Workstation
  await captureSceneWorkstation(
    'mission6',
    'step-14-stage6-cabinet-dehydration.png',
    'Capturing step-14-stage6-cabinet-dehydration.png (Stage 6 Workstation)...'
  );

  // 15. Stage 7: Flash Deep Frying Workstation
  await captureSceneWorkstation(
    'mission7',
    'step-15-stage7-deep-frying.png',
    'Capturing step-15-stage7-deep-frying.png (Stage 7 Workstation)...'
  );

  // 16. Stage 8: Sanitary Hermetic Packaging Workstation
  await captureSceneWorkstation(
    'mission8',
    'step-16-stage8-packaging-labeling.png',
    'Capturing step-16-stage8-packaging-labeling.png (Stage 8 Workstation)...'
  );

  // 17. Post-Test: Chronological Sequencing Puzzle
  console.log('Capturing step-17-post-test-sequencing-puzzle.png...');
  await page.evaluate(() => {
    if (window.__setPalmQuestScene) {
      window.__setPalmQuestScene('sequencing');
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-17-post-test-sequencing-puzzle.png') });

  // 18. Results: Diagnostic Audit & Report
  console.log('Capturing step-18-diagnostic-audit-report.png (Results Scene)...');
  await page.evaluate(() => {
    if (window.__setPalmQuestScene) {
      window.__setPalmQuestScene('results');
    }
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-18-diagnostic-audit-report.png') });

  // 19. Results: Scroll down to rubric & food science breakdown
  console.log('Capturing step-19-audit-food-science-rubric.png (Results Breakdown)...');
  await page.evaluate(() => {
    window.scrollTo(0, 1000);
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-19-audit-food-science-rubric.png') });

  // 20. Official Printable Certificate / Evaluation Scene
  console.log('Capturing step-20-official-completion-certificate.png...');
  await page.evaluate(() => {
    if (window.__setPalmQuestScene) {
      window.__setPalmQuestScene('evaluation');
    }
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'step-20-official-completion-certificate.png') });

  console.log('SUCCESS: All manual screenshots captured with live interactive workstations!');
  await browser.close();
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
