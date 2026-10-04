import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

const html = read('index.html');

// Mỗi phần tử là nội dung một <section class="racket" ...> ... </section>
const sections = html
  .split('<section class="racket"')
  .slice(1)
  .map((chunk) => chunk.split('</section>')[0]);

const idOf = (section) => section.match(/^\s+id="([^"]+)"/)?.[1];
const tags = (source, name) => source.match(new RegExp(`<${name}\\b[^>]*>`, 'g')) ?? [];
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

test('head có lang, meta, Open Graph, font và tài nguyên', () => {
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="vi">/);
  assert.match(html, /<meta charset="utf-8">/i);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta property="og:title" content="[^"]+">/);
  assert.match(html, /<meta property="og:description" content="[^"]+">/);
  assert.match(html, /<meta property="og:image" content="images\/hero\.webp">/);
  assert.match(html, /<link rel="icon" href="data:image\/svg\+xml,[^"]*🏸[^"]*">/);
  assert.match(html, /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/);
  assert.match(html, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/);
  assert.match(html, /family=Be\+Vietnam\+Pro:wght@400;600;700/);
  assert.match(html, /<link rel="stylesheet" href="css\/style\.css">/);
  assert.match(html, /<script src="js\/gallery\.js" defer><\/script>/);
});

test('có 7 section vợt với id vot-1..vot-7, không trùng', () => {
  const ids = sections.map(idOf);
  assert.deepEqual(ids, ['vot-1', 'vot-2', 'vot-3', 'vot-4', 'vot-5', 'vot-6', 'vot-7']);
  assert.equal(new Set(ids).size, ids.length);
});

test('menu trỏ đúng tới từng section', () => {
  const nav = html.match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav, 'thiếu <nav class="site-nav">');
  const hrefs = tags(nav, 'a').map((a) => attr(a, 'href'));
  assert.deepEqual(hrefs, sections.map((s) => `#${idOf(s)}`));
});

for (const section of sections) {
  const id = idOf(section);

  test(`${id}: tiêu đề h2 khớp aria-labelledby`, () => {
    assert.match(section, new RegExp(`^\\s+id="${id}" aria-labelledby="${id}-title"`));
    assert.match(section, new RegExp(`<h2 class="racket__name" id="${id}-title">[^<]+</h2>`));
    assert.match(section, /<p class="racket__tagline">[^<]+<\/p>/);
  });

  test(`${id}: gallery có 3–5 ảnh trong khung có nhãn`, () => {
    assert.match(section, /<div class="gallery">/);
    assert.match(section, /<div class="gallery__track" role="region" tabindex="0" aria-label="[^"]+">/);
    const slides = tags(section, 'figure').filter((f) => attr(f, 'class') === 'slide frame');
    assert.ok(slides.length >= 3 && slides.length <= 5, `có ${slides.length} slide`);
    slides.forEach((f, i) => assert.equal(attr(f, 'data-label'), `Ảnh ${i + 1}`));
    const imgs = tags(section, 'img');
    assert.equal(imgs.length, slides.length);
    imgs.forEach((img, i) => {
      assert.equal(attr(img, 'src'), `images/${id}/${i + 1}.webp`);
      assert.ok(attr(img, 'alt')?.trim(), 'img thiếu alt');
      assert.equal(attr(img, 'loading'), 'lazy');
      assert.equal(attr(img, 'onerror'), 'this.remove()');
    });
  });

  test(`${id}: có giá, thông số, ưu điểm, nhược điểm`, () => {
    assert.match(section, /<span class="price__value">[^<]+<\/span>/);
    assert.match(section, /<span class="price__note">giá tham khảo<\/span>/);
    assert.match(section, /<dl class="specs">/);
    const specs = section.match(/<div class="spec"><dt>[^<]+<\/dt><dd>[^<]+<\/dd><\/div>/g) ?? [];
    assert.equal(specs.length, 4);
    for (const kind of ['pro', 'con']) {
      const box = section.match(
        new RegExp(`<div class="proscons__box proscons__box--${kind}">([\\s\\S]*?)</ul>`),
      )?.[1];
      assert.ok(box, `thiếu hộp ${kind}`);
      assert.ok(tags(box, 'li').length >= 1, `hộp ${kind} trống`);
    }
  });

  test(`${id}: nút mua (sponsored) và nút video mở tab mới`, () => {
    const links = tags(section, 'a');
    const buy = links.find((a) => attr(a, 'class') === 'btn btn--primary');
    const video = links.find((a) => attr(a, 'class') === 'btn btn--secondary');
    assert.ok(buy && video, 'thiếu nút mua hoặc nút video');
    assert.equal(attr(buy, 'target'), '_blank');
    assert.equal(attr(buy, 'rel'), 'sponsored noopener');
    assert.equal(attr(video, 'target'), '_blank');
    assert.equal(attr(video, 'rel'), 'noopener');
  });
}

test('mọi ảnh: đường dẫn tương đối, viết thường, không khoảng trắng, nằm trong .frame', () => {
  const imgs = tags(html, 'img');
  assert.ok(imgs.length > 0);
  for (const img of imgs) {
    const src = attr(img, 'src');
    assert.match(src, /^images\/[a-z0-9\-/]+\.(webp|jpg)$/, `src không hợp lệ: ${src}`);
    assert.ok(attr(img, 'alt')?.trim(), `thiếu alt: ${src}`);
    assert.equal(attr(img, 'onerror'), 'this.remove()', `thiếu onerror: ${src}`);
  }
  const frames = html.match(/class="[^"]*\bframe\b[^"]*" data-label="[^"]+"/g) ?? [];
  assert.equal(frames.length, imgs.length);
});

test('hero và footer', () => {
  assert.match(html, /<section class="hero" id="top">/);
  assert.match(html, /<h1 class="hero__title">/);
  assert.match(html, /<div class="hero__media frame" data-label="Ảnh bìa">/);
  assert.match(html, /<footer class="site-footer">[\s\S]*giá tham khảo[\s\S]*affiliate[\s\S]*<\/footer>/i);
});

test('folder ảnh và README tồn tại', () => {
  for (const n of [1, 2, 3, 4, 5, 6, 7]) {
    assert.ok(existsSync(new URL(`images/vot-${n}/.gitkeep`, root)), `thiếu images/vot-${n}/.gitkeep`);
  }
  const readme = read('README.md');
  assert.match(readme, /Vercel/);
  assert.match(readme, /viết thường/);
});
