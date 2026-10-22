// Generates the TPS theme-bg.svg with halftone dots + wavy ribbon
const fs = require('fs');
const path = require('path');

const W = 1440, H = 900;
const hx = W * 0.72, hy = H * 0.38;
const maxR = Math.min(W, H) * 0.45;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">\n`;
svg += `<defs><radialGradient id="bg" cx="72%" cy="38%" r="65%" fx="72%" fy="38%">`;
svg += `<stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f4f6"/>`;
svg += `</radialGradient></defs>\n`;
svg += `<rect width="${W}" height="${H}" fill="url(#bg)"/>\n`;

// Halftone dots
const spacing = 32;
for (let row = 0; row < Math.ceil(H / spacing); row++) {
  for (let col = 0; col < Math.ceil(W / spacing); col++) {
    const x = col * spacing + (row % 2) * (spacing / 2);
    const y = row * spacing;
    const dist = Math.sqrt((x - hx) ** 2 + (y - hy) ** 2);
    const t = Math.max(0, 1 - dist / maxR);
    if (t <= 0.06) continue;
    const r = t * 3.2;
    if (r < 0.4) continue;
    svg += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#1f2937" opacity="${(t * 0.16).toFixed(3)}"/>\n`;
  }
}

// Wave function
function waveY(px, offsetY) {
  const u = (px / W) * Math.PI * 2;
  const edgeFade = Math.sin((px / W) * Math.PI);
  return H * 0.74 + (Math.sin(u * 1.7) * 115 + Math.cos(u * 2.6) * 35) * edgeFade + offsetY;
}
function wavePath(offsetY) {
  let d = '';
  for (let px = 0; px <= W; px += 6) {
    d += (px === 0 ? 'M' : 'L') + `${px},${waveY(px, offsetY).toFixed(1)}`;
  }
  return d;
}

// White highlight sweeps (underneath)
for (let i = 0; i < 10; i++) {
  const off = (i - 5) * 8;
  svg += `<path d="${wavePath(off)}" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="${(0.06 + (i / 10) * 0.05).toFixed(2)}"/>\n`;
}

// Slate ribbon lines
for (let i = 0; i < 18; i++) {
  const off = (i - 9) * 5.5;
  const t = i / 17;
  const color = t < 0.5 ? '#1f2937' : '#737373';
  svg += `<path d="${wavePath(off)}" fill="none" stroke="${color}" stroke-width="0.7" opacity="${(0.04 + t * 0.11).toFixed(2)}"/>\n`;
}

svg += `</svg>`;

const outPath = path.join(__dirname, '..', 'src', 'assets', 'theme-bg.svg');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, svg);
console.log(`Generated ${outPath} (${(svg.length / 1024).toFixed(1)} KB)`);
