#!/usr/bin/env node
// Draws the static brand files with ImageMagick and the system Arial (macOS):
//   public/og.png (1200 x 630, the Open Graph card), app/icon.svg, app/favicon.ico, app/apple-icon.png
// Run: node scripts/make-brand-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { HUB_DIR } from './sync-projects.mjs';

const FONT = '/System/Library/Fonts/Supplemental/Arial.ttf';
const FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
const C = { paper: '#FBFBF8', ink: '#1A1A1A', muted: '#555B62', rule: '#C9C5BB', blue: '#2F5D8A', orange: '#D9822B' };
const app = (name) => path.join(HUB_DIR, 'app', name);
const magick = (args) => execFileSync('magick', args);

function text(font, size, color, x, y, value) {
  return ['-font', font, '-pointsize', String(size), '-fill', color, '-annotate', `+${x}+${y}`, value];
}

// A pie slice from angle a0 to a1 (degrees, clockwise from 12 o'clock).
function slice(cx, cy, r, a0, a1, color) {
  const pt = (a) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(1)},${(cy + r * Math.sin(rad)).toFixed(1)}`;
  };
  const large = a1 - a0 > 180 ? 1 : 0;
  return ['-fill', color, '-draw', `path 'M ${cx},${cy} L ${pt(a0)} A ${r},${r} 0 ${large},1 ${pt(a1)} Z'`];
}

function card(x0, y0, x1, y1) {
  return ['-fill', '#FFFFFF', '-stroke', C.rule, '-strokewidth', '2', '-draw', `rectangle ${x0},${y0} ${x1},${y1}`, '-stroke', 'none'];
}

function ogImage() {
  const bars = [
    [226, C.blue],
    [168, C.blue],
    [118, C.orange],
    [78, C.blue],
  ];
  magick([
    '-size', '1200x630', `xc:${C.paper}`,
    '-fill', C.ink, '-draw', 'rectangle 72,72 1128,75',
    '-gravity', 'NorthWest',
    ...text(FONT_BOLD, 58, C.ink, 72, 132, 'Logan Ankenbrandt'),
    ...text(FONT, 36, C.blue, 72, 214, 'Slide reconstruction portfolio'),
    ...text(FONT, 27, C.muted, 72, 300, 'Technical slides rebuilt as editable'),
    ...text(FONT, 27, C.muted, 72, 338, 'PowerPoint, with a log for every change.'),
    ...text(FONT, 22, C.muted, 72, 528, 'logan-ankenbrandt.vercel.app'),
    // Before: a pie slide.
    ...text(FONT_BOLD, 15, C.muted, 700, 128, 'BEFORE'),
    ...card(700, 152, 980, 302),
    ...slice(775, 227, 52, 0, 150, '#8E897F'),
    ...slice(775, 227, 52, 150, 250, '#B9B4A9'),
    ...slice(775, 227, 52, 250, 360, '#DAD6CD'),
    '-fill', '#E4E1DA',
    '-draw', 'rectangle 850,190 950,200', '-draw', 'rectangle 850,220 930,230', '-draw', 'rectangle 850,250 940,260',
    // Arrow from before to after.
    '-stroke', C.ink, '-strokewidth', '3', '-fill', 'none', '-draw', 'line 1000,250 1030,250', '-draw', 'line 1030,250 1030,318',
    '-stroke', 'none', '-fill', C.ink, '-draw', 'polygon 1021,314 1039,314 1030,330',
    // After: sorted bars with one highlighted.
    ...text(FONT_BOLD, 15, C.muted, 848, 338, 'AFTER'),
    ...card(848, 362, 1128, 532),
    ...bars.flatMap(([w, color], i) => ['-fill', color, '-draw', `rectangle 872,${386 + i * 34} ${872 + w},${406 + i * 34}`]),
    '-depth', '8', path.join(HUB_DIR, 'public', 'og.png'),
  ]);
}

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${C.blue}"/>
  <rect x="14" y="15" width="36" height="9" rx="2" fill="${C.paper}"/>
  <rect x="14" y="28" width="26" height="9" rx="2" fill="${C.paper}"/>
  <rect x="14" y="41" width="15" height="9" rx="2" fill="#F2A65A"/>
</svg>
`;

// The same mark drawn at 256 px, so the favicon and the apple icon do not depend on an SVG renderer.
function iconArgs(rounded) {
  return [
    '-size', '256x256', rounded ? 'xc:none' : `xc:${C.blue}`,
    ...(rounded ? ['-fill', C.blue, '-draw', 'roundrectangle 0,0 255,255 56,56'] : []),
    '-fill', C.paper, '-draw', 'roundrectangle 56,60 200,96 8,8', '-draw', 'roundrectangle 56,112 160,148 8,8',
    '-fill', '#F2A65A', '-draw', 'roundrectangle 56,164 116,200 8,8',
  ];
}

ogImage();
fs.writeFileSync(app('icon.svg'), ICON_SVG);
magick([...iconArgs(true), '-define', 'icon:auto-resize=48,32,16', app('favicon.ico')]);
magick([...iconArgs(false), '-resize', '180x180', '-depth', '8', app('apple-icon.png')]);
console.log('wrote public/og.png, app/icon.svg, app/favicon.ico, app/apple-icon.png');
