import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const rootBlock = css.match(/:root\s*{([^}]*)}/)?.[1] ?? '';
const outsideRoot = css.replace(/:root\s*{[^}]*}/, '');

test('biến màu và bo góc đúng giá trị trong spec', () => {
  const tokens = {
    '--bg': '#FAFAF7',
    '--bg-alt': '#F0F2EF',
    '--primary': '#0F6B4F',
    '--accent': '#D4F04A',
    '--text': '#1C1F1E',
    '--pro': '#1E8E5A',
    '--con': '#D9534F',
    '--radius': '12px',
    '--container': '1200px',
  };
  for (const [name, value] of Object.entries(tokens)) {
    const found = rootBlock.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();
    assert.equal(found?.toUpperCase(), value.toUpperCase(), `${name} = ${found}`);
  }
});

test('mọi màu chỉ khai báo trong :root (đổi màu ở một chỗ)', () => {
  assert.doesNotMatch(outsideRoot, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(outsideRoot, /rgba?\(/i);
});

test('mobile-first với breakpoint 640px và 1024px', () => {
  assert.match(css, /@media \(min-width: 640px\)/);
  assert.match(css, /@media \(min-width: 1024px\)/);
  assert.doesNotMatch(css, /max-width:\s*\d+px\)/, 'không dùng media max-width');
});

test('gallery: scroll-snap, tỉ lệ 4/3, ảnh cover', () => {
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /scroll-snap-align:\s*start/);
  assert.match(css, /aspect-ratio:\s*4 \/ 3/);
  assert.match(css, /object-fit:\s*cover/);
  assert.match(css, /\.gallery\s*{[^}]*position:\s*relative/);
});

test('nút ◀ ▶ ẩn mặc định, chỉ hiện từ 1024px', () => {
  assert.match(css, /\.gallery__btn\s*{\s*display:\s*none;?\s*}/);
  const desktop = css.split('@media (min-width: 1024px)').slice(1).join('');
  assert.match(desktop, /\.gallery__btn\s*{[^}]*display:\s*grid/);
  assert.match(css, /\.gallery__btn:disabled/);
});

test('khung ảnh hiện nhãn data-label', () => {
  assert.match(css, /\.frame::before\s*{[^}]*content:\s*attr\(data-label\)/);
});

test('font, cỡ chữ co giãn, chống tràn ngang', () => {
  assert.match(css, /"Be Vietnam Pro"/);
  assert.match(css, /clamp\(/);
  assert.match(css, /body\s*{[^}]*overflow-wrap:\s*break-word/);
});

test('header dính, cuộn mượt, chừa chỗ cho header', () => {
  assert.match(css, /\.site-header\s*{[^}]*position:\s*sticky/);
  assert.match(css, /html\s*{[^}]*scroll-behavior:\s*smooth/);
  assert.match(css, /scroll-margin-top:\s*var\(--header-h\)/);
});

test('trợ năng: focus-visible và reduced motion', () => {
  assert.match(css, /:focus-visible/);
  const reduced = css.split('@media (prefers-reduced-motion: reduce)')[1] ?? '';
  assert.match(reduced, /scroll-behavior:\s*auto/);
  assert.match(reduced, /transition:\s*none/);
});

test('section chẵn đổi nền và so le ảnh trên desktop', () => {
  assert.match(css, /\.racket:nth-of-type\(even\)\s*{[^}]*background:\s*var\(--bg-alt\)/);
  assert.match(css, /\.racket:nth-of-type\(even\) \.racket__media\s*{[^}]*order:\s*2/);
});
