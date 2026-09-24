/**
 * Generates the raster assets that ship in public/: the Open Graph share image,
 * the Apple touch icon and the legacy .ico favicon.
 *
 * Run with: npm run assets
 *
 * The output files are committed, so this only needs to run when the branding
 * changes. Text is rendered with locally installed fonts, so regenerate on a
 * machine that has them rather than in CI.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const INK = '#0b0f14';
const BONE = '#f4f1ea';
const COPPER = '#c97b4a';
const MUTED = '#9aa6b2';

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="0%" r="70%">
      <stop offset="0%" stop-color="${COPPER}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${COPPER}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool" cx="8%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#2b4a6b" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#2b4a6b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#cool)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <text x="88" y="150" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="20" letter-spacing="6" font-weight="500" fill="${COPPER}">
    FELIPE PLETS
  </text>

  <text x="88" y="286" font-family="Georgia, Times New Roman, serif" font-size="74" fill="${BONE}">
    More code than ever.
  </text>
  <text x="88" y="374" font-family="Georgia, Times New Roman, serif" font-size="74" fill="${COPPER}">
    The bar stays where it was.
  </text>

  <text x="88" y="452" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="26" fill="${MUTED}">
    Engineering leadership for the agentic era
  </text>

  <rect x="88" y="524" width="72" height="2" fill="${COPPER}"/>
  <text x="88" y="574" font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="22" fill="${MUTED}">
    felipeplets.com
  </text>
</svg>
`;

/** The monogram, sized so the F still reads at 16px. */
const MONOGRAM = 'M19 14H46V22.5H29V27.5H42V36H29V50H19Z';

const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${INK}"/>
  <path d="${MONOGRAM}" fill="${COPPER}"/>
</svg>
`;

await mkdir(publicDir, { recursive: true });

// The vector favicon is written from the same monogram so the two never drift.
await writeFile(
  join(publicDir, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Felipe Plets">
  <rect width="64" height="64" rx="14" fill="${INK}"/>
  <path d="${MONOGRAM}" fill="${COPPER}"/>
</svg>
`,
);

await sharp(Buffer.from(ogSvg)).png().toFile(join(publicDir, 'og-image.png'));
await sharp(Buffer.from(iconSvg(180))).png().toFile(join(publicDir, 'apple-touch-icon.png'));

// A minimal .ico wrapping a single 32x32 PNG frame, for older crawlers and browsers.
const icoPng = await sharp(Buffer.from(iconSvg(32))).png().toBuffer();

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);
entry.writeUInt8(32, 1);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(icoPng.length, 8);
entry.writeUInt32LE(header.length + entry.length, 12);

await writeFile(join(publicDir, 'favicon.ico'), Buffer.concat([header, entry, icoPng]));

console.log('Generated favicon.svg, og-image.png, apple-touch-icon.png and favicon.ico');
