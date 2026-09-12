import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../../context/GameContext';

const SYSTEM_MODULES = [
  {
    icon: '🧪',
    badge: 'Module 1',
    title: 'Diagnostic Pre-Lab Safety & Sanitation',
    desc: '4 interactive preparation assessments covering PPE compliance check, WHO 7-step sanitary handwashing sequencing with friction timer, tool defect hazard inspection, and raw coconut pith quality sorting.',
    tags: ['PPE Attire', 'WHO Handwashing', 'Equipment Safety', 'Ingredient Clearance'],
  },
  {
    icon: '🏭',
    badge: 'Module 2',
    title: '8-Stage Standardized Processing Line',
    desc: 'Fully simulated commercial production stages from raw coconut pith boiling and fiber disintegration to exact 1:1 formulation, molding, steam gelatinization, 90°C convection dehydration, 180°C deep frying, and hermetic packaging.',
    tags: ['Boiling & Wash', 'Pureeing', '1:1 Mixing', 'Silicone Molding', 'Steaming', 'Dehydration', 'Deep Frying', 'Nitrogen Pack'],
  },
  {
    icon: '👩‍🏫',
    badge: 'Module 3',
    title: 'Pedagogical Teacher Companion (Teacher Mia)',
    desc: 'Interactive virtual mentor providing context-aware speech synthesis (TTS), live audio voiceover, step-by-step Standard Operating Procedures (SOPs), Good Manufacturing Practices (GMP) alerts, and scientific explanations.',
    tags: ['Live TTS Voice', 'Contextual SOPs', 'GMP Reminders', 'Food Science Insights'],
  },
  {
    icon: '🧩',
    badge: 'Module 4',
    title: 'Formative Process Mastery & Sequencing',
    desc: 'Hands-on post-lab interactive sequencing challenge where learners arrange the entire 8-stage manufacturing flow chronologically to demonstrate psychomotor and cognitive mastery of the process chain.',
    tags: ['Process Sequencing', 'Chronological Logic', 'Mastery Verification'],
  },
  {
    icon: '📊',
    badge: 'Module 5',
    title: 'Competency Analytics & Formal Diagnostic Report',
    desc: 'Comprehensive diagnostic vs. post-test performance comparison, PPE safety audit, stage pre-check questions review, stage completion breakdown, and printable / downloadable formal Report of Completion with student name.',
    tags: ['Pre/Post Comparison', 'Diagnostic Metrics', 'Formal Report', 'Print / PDF Ready'],
  },
  {
    icon: '⚙️',
    badge: 'Module 6',
    title: 'Accessible & Scalable Virtual Lab System',
    desc: 'Cross-platform web software engineered with dynamic UI zoom scaling (50%–150%), audio synthesizer controls, interactive tactile drag-and-drop inventory rack, and touch/mouse hybrid support.',
    tags: ['Zoom Scaling', 'Drag & Drop Rack', 'Tactile Audio', 'Tablet & Desktop Ready'],
  },
];

const CURRICULUM_COMPETENCIES = [
  {
    category: 'Cognitive Domain (Knowledge)',
    icon: '🧠',
    items: [
      'Identify raw materials, formulation ratios (1:1 rice flour to pith paste), and standard seasoning proportions.',
      'Explain the thermal starch gelatinization and vitrification mechanisms behind crispy cracker puffing.',
      'Recognize potential kitchen hazards, equipment defects, and critical control points (HACCP).',
    ],
  },
  {
    category: 'Psychomotor Domain (Skills)',
    icon: '🛠️',
    items: [
      'Demonstrate proper execution of all 8 production stages in correct chronological sequence.',
      'Perform virtual tool calibration (temperature monitoring at 90°C & 180°C, precise leveling, hermetic sealing).',
      'Execute sanitary 7-step handwashing technique according to international health standards.',
    ],
  },
  {
    category: 'Affective Domain (Values & Safety)',
    icon: '🤝',
    items: [
      'Appreciate the economic and nutritional value of agricultural by-products through coconut pith valorization.',
      'Adhere strictly to personal hygiene and Good Manufacturing Practices (GMP) without skipping safety steps.',
      'Demonstrate discipline and attention to detail in food formulation and quality control.',
    ],
  },
];

export const SystemOverviewModal = () => {
  const { activeModal, closeModal } = useGame();
  const [activeTab, setActiveTab] = useState('overview');

  if (activeModal !== 'system' && activeModal !== 'overview') return null;

  return createPortal(
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card system-overview-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-badge">
            <span className="modal-top-pill">🌐 System & Instructional Overview</span>
            <h2>About PithQuest & Learning Materials</h2>
          </div>
          <button className="close-btn" onClick={closeModal} title="Close Modal">&times;</button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="system-modal-nav">
          <button
            className={`system-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🏛️ System Overview
          </button>
          <button
            className={`system-nav-btn ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            📚 Instructional Modules
          </button>
          <button
            className={`system-nav-btn ${activeTab === 'competencies' ? 'active' : ''}`}
            onClick={() => setActiveTab('competencies')}
          >
            🎯 Competencies
          </button>
        </div>

        <div className="modal-body system-overview-modal-body">
          {/* TAB 1: SYSTEM OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="system-tab-content">
              {/* Hero Banner */}
              <div className="system-hero-card">
                <div className="system-hero-tag">🥥 Virtual Food Processing Laboratory</div>
                <h3 className="system-hero-title">What is PithQuest?</h3>
                <p className="system-hero-desc">
                  <strong>PithQuest</strong> is an interactive web-based Virtual Food Processing Laboratory simulation
                  and instructional software designed for <strong>Home Economics (HE)</strong> and <strong>Food Technology</strong> students.
                  It transforms traditional food processing curriculum into a high-engagement, gamified digital laboratory experience.
                </p>
                <div className="system-highlight-pills">
                  <span className="highlight-pill">✨ Interactive Simulation</span>
                  <span className="highlight-pill">🔬 Science-Backed Ratios</span>
                  <span className="highlight-pill">🛡️ GMP & Safety Aligned</span>
                  <span className="highlight-pill">🎓 Academic Research Based</span>
                </div>
              </div>

              {/* Core Pillars Grid */}
              <div className="system-pillars-grid">
                <div className="system-pillar-card">
                  <div className="pillar-icon">🌴</div>
                  <h4>Agricultural Valorization</h4>
                  <p>
                    Showcases how agricultural coconut by-products (<em>ubod ng niyog</em> or coconut pith) can be upcycled
                    into high-fiber, shelf-stable, commercial-grade crispy crackers.
                  </p>
                </div>

                <div className="system-pillar-card">
                  <div className="pillar-icon">🧪</div>
                  <h4>Safe Experimental Learning</h4>
                  <p>
                    Allows students to practice high-heat boiling, dehydration at 90°C, and 180°C deep frying in a risk-free,
                    zero-waste virtual kitchen with infinite repeatability.
                  </p>
                </div>

                <div className="system-pillar-card">
                  <div className="pillar-icon">👩‍🏫</div>
                  <h4>Pedagogical Support</h4>
                  <p>
                    Features virtual instructor <strong>Teacher Mia</strong> who guides learners with spoken dialogue,
                    real-time corrective feedback, and scientific explanations behind each step.
                  </p>
                </div>

                <div className="system-pillar-card">
                  <div className="pillar-icon">📜</div>
                  <h4>Evidence-Based Certification</h4>
                  <p>
                    Tracks student diagnostics, calculates skill improvement percentages, and issues an official verifiable
                    Certificate of Completion upon successful graduation.
                  </p>
                </div>
              </div>

              {/* Research Affiliation Footer Callout */}
              <div className="system-affiliation-box">
                <span className="affil-icon">🎓</span>
                <div className="affil-text">
                  <strong>Academic Research Affiliation:</strong>
                  <p>
                    Developed as an undergraduate thesis instructional material by <strong>BSIE-HE-4A</strong> (Bachelor of Science in Industrial Education - Major in Home Economics) at the <strong>Technological University of the Philippines (TUP Manila)</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTRUCTIONAL MATERIALS */}
          {activeTab === 'materials' && (
            <div className="system-tab-content">
              <div className="materials-intro-banner">
                <h4>📦 Instructional & Learning Materials Provided</h4>
                <p>
                  PithQuest delivers a complete end-to-end learning package that integrates diagnostic testing, experiential workstation practice, and summative evaluation.
                </p>
              </div>

              <div className="modules-list-grid">
                {SYSTEM_MODULES.map((mod, idx) => (
                  <div key={idx} className="module-item-card">
                    <div className="module-item-header">
                      <div className="module-icon-wrap">{mod.icon}</div>
                      <div className="module-title-wrap">
                        <span className="module-badge">{mod.badge}</span>
                        <h5 className="module-title">{mod.title}</h5>
                      </div>
                    </div>
                    <p className="module-desc">{mod.desc}</p>
                    <div className="module-tags-row">
                      {mod.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="module-tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMPETENCIES */}
          {activeTab === 'competencies' && (
            <div className="system-tab-content">
              <div className="competencies-intro-banner">
                <h4>🎯 Curriculum & Learning Competencies Addressed</h4>
                <p>
                  Aligned with standard Food Processing and Home Economics curriculum competencies across three core domains of learning:
                </p>
              </div>

              <div className="competencies-stack">
                {CURRICULUM_COMPETENCIES.map((comp, idx) => (
                  <div key={idx} className="competency-group-card">
                    <div className="competency-group-header">
                      <span className="comp-icon">{comp.icon}</span>
                      <h5>{comp.category}</h5>
                    </div>
                    <ul className="competency-items-list">
                      {comp.items.map((item, iIdx) => (
                        <li key={iIdx}>
                          <span className="check-bullet">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer system-modal-footer">
          <div className="footer-left-info">
            <span>🌿 PithQuest • Interactive Food Technology Learning System</span>
          </div>
          <button className="btn-primary" onClick={closeModal}>
            Return to Title Screen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
