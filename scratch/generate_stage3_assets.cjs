const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 1. Cane Vinegar Bottle SVG (512x512)
const vinegarSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.2"/>
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#e0f2fe" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#fef08a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="corkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309"/>
      <stop offset="40%" stop-color="#d97706"/>
      <stop offset="80%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <linearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb"/>
      <stop offset="100%" stop-color="#fef3c7"/>
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Base Ground Shadow -->
  <ellipse cx="256" cy="460" rx="130" ry="24" fill="#0f172a" opacity="0.2"/>

  <!-- Bottle Body Outer -->
  <g filter="url(#dropShadow)">
    <!-- Cork Stopper -->
    <polygon points="230,70 282,70 274,115 238,115" fill="url(#corkGrad)" stroke="#78350f" stroke-width="4" stroke-linejoin="round"/>
    <!-- Bottle Lip & Neck -->
    <rect x="232" y="112" width="48" height="18" rx="8" fill="#e2e8f0" stroke="#334155" stroke-width="4"/>
    <path d="M236,128 L236,190 C236,220 160,235 160,285 L160,425 C160,445 180,455 256,455 C332,455 352,445 352,425 L352,285 C352,235 276,220 276,190 L276,128 Z"
          fill="#f8fafc" stroke="#1e293b" stroke-width="6" stroke-linejoin="round"/>
    
    <!-- Vinegar Liquid Inside -->
    <path d="M166,305 C200,312 310,298 346,305 L346,420 C346,438 328,449 256,449 C184,449 166,438 166,420 Z"
          fill="url(#liquidGrad)" stroke="#ca8a04" stroke-width="2"/>
    
    <!-- Bubbles in liquid -->
    <circle cx="210" cy="380" r="8" fill="#ffffff" opacity="0.6"/>
    <circle cx="280" cy="410" r="6" fill="#ffffff" opacity="0.5"/>
    <circle cx="310" cy="360" r="10" fill="#ffffff" opacity="0.4"/>
    <circle cx="225" cy="340" r="5" fill="#ffffff" opacity="0.7"/>

    <!-- Paper Label -->
    <rect x="180" y="320" width="152" height="90" rx="10" fill="url(#labelGrad)" stroke="#d97706" stroke-width="3"/>
    <rect x="186" y="326" width="140" height="78" rx="6" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
    
    <!-- Label Text & Illustration -->
    <text x="256" y="352" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="15" fill="#92400e" text-anchor="middle" letter-spacing="1">CANE VINEGAR</text>
    <line x1="205" y1="360" x2="307" y2="360" stroke="#d97706" stroke-width="1.5"/>
    <text x="256" y="378" font-family="'Inter', system-ui, sans-serif" font-weight="700" font-size="11" fill="#b45309" text-anchor="middle">SUKANG ILOKO</text>
    <text x="256" y="393" font-family="'Inter', system-ui, sans-serif" font-weight="600" font-size="9" fill="#dc2626" text-anchor="middle">⚠️ ACID DISTRACTOR</text>

    <!-- Glass Highlights / Specular Glare -->
    <path d="M174,295 L174,420 C174,430 185,438 200,442 L200,290 C185,290 174,292 174,295 Z"
          fill="#ffffff" opacity="0.55"/>
    <path d="M242,140 L242,195 L247,195 L247,140 Z" fill="#ffffff" opacity="0.75"/>
  </g>
</svg>
`;

// 2. Uniform Cracker Dough SVG (512x512)
const doughSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="doughGrad" cx="38%" cy="32%" r="65%">
      <stop offset="0%" stop-color="#fffef7"/>
      <stop offset="25%" stop-color="#fef3c7"/>
      <stop offset="65%" stop-color="#fde68a"/>
      <stop offset="90%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </radialGradient>
    <filter id="doughShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#78350f" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Ambient shadow on counter -->
  <ellipse cx="256" cy="400" rx="190" ry="42" fill="#0f172a" opacity="0.2"/>

  <!-- Main Dough Mound -->
  <g filter="url(#doughShadow)">
    <!-- Dough Base Ball -->
    <path d="M90,320 C80,240 140,140 256,130 C370,140 435,230 422,320 C410,390 350,410 256,410 C160,410 100,385 90,320 Z"
          fill="url(#doughGrad)" stroke="#b45309" stroke-width="7" stroke-linejoin="round"/>
    
    <!-- Kneaded folds / texture lines -->
    <path d="M140,290 C180,330 310,340 370,290" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <path d="M170,250 C220,285 300,285 345,245" fill="none" stroke="#d97706" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
    <path d="M210,210 C250,230 280,230 310,205" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" opacity="0.5"/>

    <!-- Subtle Ubod / seasoning flecks in dough -->
    <ellipse cx="220" cy="270" rx="4" ry="2" fill="#78350f" opacity="0.4" transform="rotate(-15 220 270)"/>
    <ellipse cx="320" cy="300" rx="5" ry="3" fill="#78350f" opacity="0.35" transform="rotate(25 320 300)"/>
    <ellipse cx="180" cy="320" rx="4" ry="2" fill="#78350f" opacity="0.3" transform="rotate(10 180 320)"/>
    <ellipse cx="280" cy="350" rx="5" ry="2.5" fill="#78350f" opacity="0.4"/>
    <ellipse cx="360" cy="260" rx="3" ry="2" fill="#78350f" opacity="0.35"/>

    <!-- Glossy Highlight / Moisture shine -->
    <path d="M160,175 C190,145 240,145 270,150 C240,165 190,175 160,175 Z" fill="#ffffff" opacity="0.75"/>
    <ellipse cx="180" cy="195" rx="20" ry="10" fill="#ffffff" opacity="0.6" transform="rotate(-20 180 195)"/>
  </g>
</svg>
`;

// 3. Wooden Kitchen Spatula SVG (512x512)
const spatulaSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="25%" stop-color="#fde68a"/>
      <stop offset="60%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <filter id="spatulaShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="4" dy="10" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g filter="url(#spatulaShadow)" transform="rotate(-25 256 256)">
    <!-- Spatula Handle -->
    <rect x="238" y="180" width="36" height="270" rx="16" fill="url(#woodGrad)" stroke="#78350f" stroke-width="5"/>
    <!-- Handle Hanging Hole -->
    <circle cx="256" cy="420" r="8" fill="#451a03" stroke="#78350f" stroke-width="2"/>
    
    <!-- Spatula Head Paddle -->
    <path d="M210,80 C210,70 220,60 256,60 C292,60 302,70 302,80 L310,195 C310,215 285,225 256,225 C227,225 202,215 202,195 Z"
          fill="url(#woodGrad)" stroke="#78350f" stroke-width="5" stroke-linejoin="round"/>
    
    <!-- Slits in spatula head -->
    <rect x="232" y="90" width="8" height="60" rx="4" fill="#78350f" opacity="0.6"/>
    <rect x="248" y="85" width="8" height="70" rx="4" fill="#78350f" opacity="0.6"/>
    <rect x="264" y="90" width="8" height="60" rx="4" fill="#78350f" opacity="0.6"/>

    <!-- Wood grain highlight -->
    <path d="M218,85 L218,190" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    <path d="M244,200 L244,390" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
  </g>
</svg>
`;

async function main() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');

  await sharp(Buffer.from(vinegarSvg))
    .png()
    .toFile(path.join(assetsDir, 'icon_vinegar.png'));
  console.log('Generated icon_vinegar.png');

  await sharp(Buffer.from(doughSvg))
    .png()
    .toFile(path.join(assetsDir, 'icon_dough.png'));
  console.log('Generated icon_dough.png');

  await sharp(Buffer.from(spatulaSvg))
    .png()
    .toFile(path.join(assetsDir, 'icon_spatula.png'));
  console.log('Generated icon_spatula.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
