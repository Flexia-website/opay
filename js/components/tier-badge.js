/*
 * TierBadge(tier, size)
 * Returns an inline SVG badge:
 *   Tier 1 = bronze medal
 *   Tier 2 = silver medal
 *   Tier 3 = gold medal
 */
function TierBadge(tier, size) {
  size = size || 28;
  const configs = {
    1: { outer: '#cd7f32', inner: '#e8a855', shine: '#f5c98a', label: '#7a4500' },
    2: { outer: '#a8a9ad', inner: '#c8c9cc', shine: '#e8e9ec', label: '#4a4a4a' },
    3: { outer: '#c9a227', inner: '#e8c547', shine: '#f5dc7a', label: '#7a5900' },
  };
  const c = configs[tier] || configs[1];
  const r = size / 2;
  return `<svg width="${size}" height="${size+6}" viewBox="0 0 ${size} ${size+6}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- ribbon top -->
    <rect x="${r-5}" y="0" width="4" height="8" rx="1" fill="${c.outer}" transform="rotate(-15 ${r} 4)"/>
    <rect x="${r+1}" y="0" width="4" height="8" rx="1" fill="${c.outer}" transform="rotate(15 ${r} 4)"/>
    <!-- circle -->
    <circle cx="${r}" cy="${r+6}" r="${r-1}" fill="${c.outer}"/>
    <circle cx="${r}" cy="${r+6}" r="${r-3}" fill="${c.inner}"/>
    <!-- shine arc -->
    <path d="M ${r-5} ${r} A ${r-3} ${r-3} 0 0 1 ${r+5} ${r}" stroke="${c.shine}" stroke-width="2" stroke-linecap="round"/>
    <!-- number -->
    <text x="${r}" y="${r+11}" text-anchor="middle" font-size="${size*0.38}" font-weight="900" fill="${c.label}" font-family="Arial">${tier}</text>
    <!-- "Tier" label -->
    <text x="${r}" y="${r+18}" text-anchor="middle" font-size="${size*0.22}" font-weight="700" fill="${c.label}" font-family="Arial">Tier</text>
  </svg>`;
}

window.TierBadge = TierBadge;
