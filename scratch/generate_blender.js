import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const destDir = 'd:/PROJECTS/PithQuest/public/assets';
const outputPath = path.join(destDir, 'icon_blender.png');

const svg = `
<svg width="1024" height="1024" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Base Gradients -->
    <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="25%" stop-color="#64748b" />
      <stop offset="60%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>

    <!-- Chrome Trim -->
    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94a3b8" />
      <stop offset="35%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#64748b" />
    </linearGradient>

    <!-- Glass Pitcher Gradient -->
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.85" />
      <stop offset="20%" stop-color="#e0f2fe" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#f0f9ff" stop-opacity="0.75" />
      <stop offset="85%" stop-color="#7dd3fc" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.95" />
    </linearGradient>

    <!-- Lid Gradient -->
    <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="50%" stop-color="#475569" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <!-- Dial Knob -->
    <radialGradient id="dialGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="70%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#475569" />
    </radialGradient>
  </defs>

  <!-- Ground Shadow -->
  <ellipse cx="256" cy="482" rx="145" ry="18" fill="#0f172a" opacity="0.22" />

  <!-- Blender Pitcher Handle -->
  <path d="M330 145 C395 145 405 275 320 305" fill="none" stroke="#2c3e50" stroke-width="26" stroke-linecap="round" />
  <path d="M330 145 C395 145 405 275 320 305" fill="none" stroke="url(#glassGrad)" stroke-width="16" stroke-linecap="round" />
  <path d="M340 152 C385 152 395 260 326 295" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.8" />

  <!-- Pitcher Jar Body -->
  <path d="M175 110 L195 340 L317 340 L337 110 Z" fill="url(#glassGrad)" stroke="#2c3e50" stroke-width="10" stroke-linejoin="round" />

  <!-- Glass Specular Reflection Curves -->
  <path d="M192 120 L208 330 L222 330 L206 120 Z" fill="#ffffff" opacity="0.65" />
  <path d="M228 125 L238 315 L244 315 L234 125 Z" fill="#ffffff" opacity="0.35" />

  <!-- Measuring Tick Lines on Jar -->
  <line x1="285" y1="165" x2="310" y2="165" stroke="#334155" stroke-width="4" stroke-linecap="round" />
  <line x1="290" y1="195" x2="306" y2="195" stroke="#334155" stroke-width="3" stroke-linecap="round" />
  <line x1="282" y1="225" x2="304" y2="225" stroke="#334155" stroke-width="4" stroke-linecap="round" />
  <line x1="288" y1="255" x2="301" y2="255" stroke="#334155" stroke-width="3" stroke-linecap="round" />
  <line x1="280" y1="285" x2="298" y2="285" stroke="#334155" stroke-width="4" stroke-linecap="round" />

  <!-- Internal Blades -->
  <path d="M242 330 L256 312 L270 330 Z" fill="#64748b" stroke="#1e293b" stroke-width="3" />
  <path d="M256 312 L230 318 L245 328 Z" fill="#94a3b8" stroke="#1e293b" stroke-width="2" />
  <path d="M256 312 L282 318 L267 328 Z" fill="#94a3b8" stroke="#1e293b" stroke-width="2" />

  <!-- Collar / Locking Ring -->
  <rect x="190" y="336" width="132" height="20" rx="4" fill="url(#chromeGrad)" stroke="#2c3e50" stroke-width="8" />

  <!-- Motor Base Body -->
  <path d="M190 354 L165 470 L347 470 L322 354 Z" fill="url(#baseGrad)" stroke="#2c3e50" stroke-width="10" stroke-linejoin="round" />

  <!-- Chrome Trim on Base -->
  <rect x="170" y="460" width="172" height="15" rx="4" fill="url(#chromeGrad)" stroke="#2c3e50" stroke-width="6" />

  <!-- Front Control Panel Plate -->
  <rect x="220" y="380" width="72" height="70" rx="10" fill="#1e293b" stroke="#475569" stroke-width="3" />

  <!-- Rotary Dial Knob -->
  <circle cx="256" cy="414" r="22" fill="url(#dialGrad)" stroke="#0f172a" stroke-width="5" />
  <circle cx="256" cy="414" r="7" fill="#475569" />
  <rect x="254" y="396" width="4" height="12" rx="2" fill="#e2e8f0" />

  <!-- Indicator Light -->
  <circle cx="256" cy="389" r="3.5" fill="#22c55e" stroke="#15803d" stroke-width="1.5" />

  <!-- Pitcher Spout -->
  <path d="M174 110 Q160 102 154 94 Q170 100 182 108 Z" fill="#7dd3fc" stroke="#2c3e50" stroke-width="8" stroke-linejoin="round" />

  <!-- Blender Lid -->
  <path d="M168 110 L344 110 L336 84 L176 84 Z" fill="url(#lidGrad)" stroke="#2c3e50" stroke-width="9" stroke-linejoin="round" />
  <rect x="180" y="86" width="152" height="8" rx="3" fill="#64748b" opacity="0.6" />

  <!-- Center Measuring Cap on Lid -->
  <rect x="234" y="66" width="44" height="20" rx="6" fill="#38bdf8" stroke="#2c3e50" stroke-width="7" />
  <rect x="240" y="70" width="32" height="5" rx="2" fill="#ffffff" opacity="0.7" />
</svg>
`;

async function main() {
  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log('Successfully created high-res 2D cartoon icon_blender.png!');
}

main().catch(console.error);
