# Landing page review vợt cầu lông — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng landing page tĩnh (HTML/CSS + một file JS nhỏ) review vợt cầu lông. Có 3 section vợt mẫu, gallery cuộn ngang, responsive, deploy được lên Vercel.

**Architecture:** Mọi nội dung nằm trong `index.html`. Mỗi vợt là một khối `<section class="racket">` copy-paste được. `css/style.css` viết mobile-first, toàn bộ màu nằm trong biến `:root`. `js/gallery.js` chỉ thêm nút ◀ ▶ (progressive enhancement). Test là các file `node:test` không cần dependency: kiểm tra cấu trúc HTML/CSS và logic gallery bằng DOM giả. Responsive kiểm tra bằng ảnh chụp Chrome headless.

**Tech Stack:** HTML5, CSS3 (grid, flex, scroll-snap, clamp), JavaScript ES5 thuần (IIFE), Node 22 `node:test` để test, Google Chrome headless để chụp ảnh. Không npm, không build.

**Spec:** `docs/superpowers/specs/2026-10-04-badminton-landing-design.md`

## Global Constraints

- Mở `index.html` trực tiếp (double-click) là chạy. Không build/npm/server. Không có `package.json`.
- Thêm hoặc sửa một vợt chỉ cần copy/sửa một khối HTML, không đụng CSS.
- Trang dùng được đầy đủ khi tắt JS (chỉ mất nút ◀ ▶).
- Ngoài phạm vi: bộ lọc/phân loại, tìm kiếm, so sánh vợt, nhúng video player, dark mode, CMS/file dữ liệu, build tool.
- Ảnh: tên file và folder viết thường, không dấu, nối bằng gạch ngang. Mỗi vợt một folder `images/vot-N/` chứa `1.webp` … `5.webp`. Đường dẫn tương đối. Folder rỗng giữ bằng `.gitkeep`.
- Gallery: 3–5 ảnh, `scroll-snap-type: x mandatory`, `aspect-ratio: 4/3`, `object-fit: cover`, `loading="lazy"`, có `alt`.
- Link mua: `target="_blank" rel="sponsored noopener"`. Link video: `target="_blank" rel="noopener"`.
- Breakpoints: `< 640px` mobile, `640–1023px` tablet, `≥ 1024px` desktop. Container tối đa `1200px`.
- Biến màu: `--bg: #FAFAF7`, `--bg-alt: #F0F2EF`, `--primary: #0F6B4F`, `--accent: #D4F04A`, `--text: #1C1F1E`, `--pro: #1E8E5A`, `--con: #D9534F`, `--radius: 12px`.
- Font: Be Vietnam Pro (Google Fonts), weight 400/600/700, có `preconnect`.
- `<html lang="vi">`. Có meta description, Open Graph (`og:title`, `og:description`, `og:image` = `images/hero.webp`, `og:type=website`), favicon emoji 🏸 dạng inline SVG.
- Cuộn mượt và hiệu ứng tắt khi `prefers-reduced-motion: reduce`. Có style `:focus-visible`.
- Chạy test: `node --test "tests/*.test.mjs"`. Chụp ảnh: `bash tests/screenshot.sh`.

## Review Focus

1. **Tên vợt hoặc giá dài trên màn 375px:** người dùng mong không xuất hiện thanh cuộn ngang ở cấp trang. Ghim bằng `overflow-wrap: break-word` trên `body` (test CSS, Task 2) và ảnh chụp 375px.
2. **Chưa có file ảnh, hoặc sai đường dẫn:** người dùng mong thấy khung xám ghi "Ảnh N", không phải icon ảnh vỡ. Ghim bằng test "mọi img có `onerror="this.remove()"` và nằm trong `.frame` có `data-label`" (Task 1).
3. **Đặt tên ảnh có chữ hoa hoặc khoảng trắng:** chạy ở Mac nhưng mất ảnh trên Vercel. Ghim bằng test "src viết thường, không khoảng trắng, đúng `images/vot-N/k.webp`" (Task 1).
4. **Copy section mà quên đổi id hoặc link menu:** menu nhảy sai chỗ. Ghim bằng test "href trong nav khớp id section, id không trùng, aria-labelledby khớp h2" (Task 1).
5. **Gallery chỉ có 1 ảnh, hoặc ảnh vừa đủ khung:** cả hai nút đều phải disabled. Ghim bằng test `edgeState` khi `scrollWidth === clientWidth` (Task 3).

---

## File Structure

| File | Trách nhiệm | Task |
|---|---|---|
| `index.html` | Toàn bộ nội dung: head/meta, header + nav, hero, 3 section vợt, footer | 1 |
| `images/vot-1/.gitkeep`, `images/vot-2/.gitkeep`, `images/vot-3/.gitkeep` | Giữ các folder ảnh trong git | 1 |
| `README.md` | Hướng dẫn thêm vợt, quy ước ảnh, chạy test, deploy Vercel | 1 |
| `.gitignore` | Thêm `screenshots/`, `.superpowers/` | 1 |
| `tests/html.test.mjs` | Test cấu trúc `index.html` | 1 |
| `css/style.css` | Biến, base, header, hero, khung ảnh, gallery, section vợt, footer, responsive | 2 |
| `tests/css.test.mjs` | Test các ràng buộc trong CSS | 2 |
| `tests/screenshot.sh` | Chụp trang ở 375/768/1280 và bản tắt JS | 2 |
| `js/gallery.js` | Nút ◀ ▶ + trạng thái disabled | 3 |
| `tests/gallery.test.mjs` | Test `gallery.js` bằng DOM giả trong `node:vm` | 3 |

**Hợp đồng class dùng chung giữa các task** (HTML ở Task 1, CSS ở Task 2, JS ở Task 3):

- Bố cục: `.container`, `.site-header`, `.site-header__inner`, `.logo`, `.site-nav`, `.hero`, `.hero__inner`, `.hero__text`, `.hero__eyebrow`, `.hero__title`, `.highlight`, `.hero__lead`, `.hero__media`, `.site-footer`
- Khung ảnh: `.frame[data-label]` chứa `<img>`
- Vợt: `.racket`, `.racket__inner`, `.racket__media`, `.racket__info`, `.racket__name`, `.racket__tagline`
- Gallery: `.gallery` > `.gallery__track` > `.slide.frame`. JS chèn thêm `button.gallery__btn.gallery__btn--prev` và `button.gallery__btn.gallery__btn--next` vào `.gallery`
- Giá: `.price`, `.price__value`, `.price__note`
- Thông số: `dl.specs` > `div.spec` > `dt` + `dd`
- Ưu/nhược: `.proscons` > `.proscons__box.proscons__box--pro` / `.proscons__box.proscons__box--con` (mỗi box có `h3` + `ul`)
- Nút: `.actions`, `.btn`, `.btn--primary`, `.btn--secondary`

---

### Task 1: Nội dung HTML, thư mục ảnh, README

**Files:**
- Create: `tests/html.test.mjs`
- Create: `index.html`
- Create: `images/vot-1/.gitkeep`, `images/vot-2/.gitkeep`, `images/vot-3/.gitkeep`
- Create: `README.md`
- Modify: `.gitignore` (hiện có 2 dòng: `.DS_Store`, `.vercel`)

**Interfaces:**
- Consumes: không có
- Produces: các class trong "Hợp đồng class dùng chung" ở trên. `index.html` link tới `css/style.css` và `js/gallery.js` (có `defer`). Hai file này do Task 2 và 3 tạo.

- [ ] **Step 1: Viết test (sẽ fail)**

Tạo `tests/html.test.mjs`:

```js
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

test('có 3 section vợt mẫu với id vot-1..vot-3, không trùng', () => {
  const ids = sections.map(idOf);
  assert.deepEqual(ids, ['vot-1', 'vot-2', 'vot-3']);
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
  for (const n of [1, 2, 3]) {
    assert.ok(existsSync(new URL(`images/vot-${n}/.gitkeep`, root)), `thiếu images/vot-${n}/.gitkeep`);
  }
  const readme = read('README.md');
  assert.match(readme, /Vercel/);
  assert.match(readme, /viết thường/);
});
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `node --test "tests/*.test.mjs"`
Expected: FAIL với `ENOENT: no such file or directory, open '.../index.html'`

- [ ] **Step 3: Tạo `index.html`**

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Review vợt cầu lông</title>
  <meta name="description" content="Review các cây vợt cầu lông tui đã dùng: hình ảnh, giá, thông số, ưu nhược điểm, link mua và video.">

  <!-- Open Graph: hiện ảnh + tiêu đề khi chia sẻ link lên Facebook/Zalo.
       Sau khi deploy, đổi og:image thành URL tuyệt đối, ví dụ https://ten-mien.vercel.app/images/hero.webp -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Review vợt cầu lông">
  <meta property="og:description" content="Review thật, dùng thật: giá, thông số, ưu nhược điểm từng cây vợt.">
  <meta property="og:image" content="images/hero.webp">

  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E🏸%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/gallery.js" defer></script>
</head>
<body>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="logo" href="#top">🏸 Vợt Review</a>
      <nav class="site-nav" aria-label="Danh sách vợt">
        <!-- Mỗi vợt một dòng. href phải khớp id của section vợt -->
        <a href="#vot-1">[Tên vợt 1]</a>
        <a href="#vot-2">[Tên vợt 2]</a>
        <a href="#vot-3">[Tên vợt 3]</a>
      </nav>
    </div>
  </header>

  <section class="hero" id="top">
    <div class="container hero__inner">
      <div class="hero__text">
        <p class="hero__eyebrow">Review thật, dùng thật</p>
        <h1 class="hero__title">Review vợt cầu lông <span class="highlight">tui đã dùng</span></h1>
        <p class="hero__lead">[1–2 câu giới thiệu: bạn chơi cầu lông bao lâu, lối đánh thế nào, vì sao viết trang này.]</p>
        <a class="btn btn--primary" href="#vot-1">Xem các cây vợt ↓</a>
      </div>
      <div class="hero__media frame" data-label="Ảnh bìa">
        <img src="images/hero.webp" alt="[Mô tả ảnh bìa]" onerror="this.remove()">
      </div>
    </div>
  </section>

  <main>
    <!-- ================= VỢT 1: copy từ dòng này =================
         Khi thêm vợt mới, đổi "vot-1" thành "vot-N" ở: id, aria-labelledby, id của h2, đường dẫn ảnh.
         Nhớ thêm link "#vot-N" vào menu ở header. -->
    <section class="racket" id="vot-1" aria-labelledby="vot-1-title">
      <div class="container racket__inner">
        <div class="racket__media">
          <div class="gallery">
            <div class="gallery__track" role="region" tabindex="0" aria-label="Ảnh [Tên vợt 1]">
              <!-- 3–5 ảnh: images/vot-1/1.webp … 5.webp. Ít ảnh hơn thì xoá bớt <figure> -->
              <figure class="slide frame" data-label="Ảnh 1"><img src="images/vot-1/1.webp" alt="[Tên vợt 1], ảnh 1" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 2"><img src="images/vot-1/2.webp" alt="[Tên vợt 1], ảnh 2" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 3"><img src="images/vot-1/3.webp" alt="[Tên vợt 1], ảnh 3" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 4"><img src="images/vot-1/4.webp" alt="[Tên vợt 1], ảnh 4" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 5"><img src="images/vot-1/5.webp" alt="[Tên vợt 1], ảnh 5" loading="lazy" onerror="this.remove()"></figure>
            </div>
          </div>
        </div>
        <div class="racket__info">
          <h2 class="racket__name" id="vot-1-title">[Tên vợt 1]</h2>
          <p class="racket__tagline">[Một dòng mô tả, ví dụ: Vợt thiên công, hợp người đánh đơn]</p>
          <p class="price"><span class="price__value">x.xxx.000₫</span> <span class="price__note">giá tham khảo</span></p>
          <!-- Thông số nào không dùng thì xoá cả dòng <div class="spec"> -->
          <dl class="specs">
            <div class="spec"><dt>Trọng lượng</dt><dd>[4U]</dd></div>
            <div class="spec"><dt>Điểm cân bằng</dt><dd>[Nặng đầu]</dd></div>
            <div class="spec"><dt>Độ cứng thân</dt><dd>[Cứng]</dd></div>
            <div class="spec"><dt>Sức căng tối đa</dt><dd>[28 lbs]</dd></div>
          </dl>
          <div class="proscons">
            <div class="proscons__box proscons__box--pro">
              <h3>Ưu điểm</h3>
              <ul>
                <li>[Ưu điểm 1]</li>
                <li>[Ưu điểm 2]</li>
                <li>[Ưu điểm 3]</li>
              </ul>
            </div>
            <div class="proscons__box proscons__box--con">
              <h3>Nhược điểm</h3>
              <ul>
                <li>[Nhược điểm 1]</li>
                <li>[Nhược điểm 2]</li>
              </ul>
            </div>
          </div>
          <div class="actions">
            <!-- Thay "#" bằng link mua (Shopee, Lazada, shop…) và link video (YouTube, TikTok…) -->
            <a class="btn btn--primary" href="#" target="_blank" rel="sponsored noopener">🛒 Xem giá / Mua</a>
            <a class="btn btn--secondary" href="#" target="_blank" rel="noopener">▶ Xem video review</a>
          </div>
        </div>
      </div>
    </section>
    <!-- ================= VỢT 1: copy tới dòng này ================= -->

    <section class="racket" id="vot-2" aria-labelledby="vot-2-title">
      <div class="container racket__inner">
        <div class="racket__media">
          <div class="gallery">
            <div class="gallery__track" role="region" tabindex="0" aria-label="Ảnh [Tên vợt 2]">
              <figure class="slide frame" data-label="Ảnh 1"><img src="images/vot-2/1.webp" alt="[Tên vợt 2], ảnh 1" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 2"><img src="images/vot-2/2.webp" alt="[Tên vợt 2], ảnh 2" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 3"><img src="images/vot-2/3.webp" alt="[Tên vợt 2], ảnh 3" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 4"><img src="images/vot-2/4.webp" alt="[Tên vợt 2], ảnh 4" loading="lazy" onerror="this.remove()"></figure>
            </div>
          </div>
        </div>
        <div class="racket__info">
          <h2 class="racket__name" id="vot-2-title">[Tên vợt 2]</h2>
          <p class="racket__tagline">[Một dòng mô tả, ví dụ: Vợt thiên thủ, phản tạt nhanh, hợp đánh đôi]</p>
          <p class="price"><span class="price__value">x.xxx.000₫</span> <span class="price__note">giá tham khảo</span></p>
          <dl class="specs">
            <div class="spec"><dt>Trọng lượng</dt><dd>[4U]</dd></div>
            <div class="spec"><dt>Điểm cân bằng</dt><dd>[Nhẹ đầu]</dd></div>
            <div class="spec"><dt>Độ cứng thân</dt><dd>[Trung bình]</dd></div>
            <div class="spec"><dt>Sức căng tối đa</dt><dd>[27 lbs]</dd></div>
          </dl>
          <div class="proscons">
            <div class="proscons__box proscons__box--pro">
              <h3>Ưu điểm</h3>
              <ul>
                <li>[Ưu điểm 1]</li>
                <li>[Ưu điểm 2]</li>
                <li>[Ưu điểm 3]</li>
              </ul>
            </div>
            <div class="proscons__box proscons__box--con">
              <h3>Nhược điểm</h3>
              <ul>
                <li>[Nhược điểm 1]</li>
                <li>[Nhược điểm 2]</li>
              </ul>
            </div>
          </div>
          <div class="actions">
            <a class="btn btn--primary" href="#" target="_blank" rel="sponsored noopener">🛒 Xem giá / Mua</a>
            <a class="btn btn--secondary" href="#" target="_blank" rel="noopener">▶ Xem video review</a>
          </div>
        </div>
      </div>
    </section>

    <section class="racket" id="vot-3" aria-labelledby="vot-3-title">
      <div class="container racket__inner">
        <div class="racket__media">
          <div class="gallery">
            <div class="gallery__track" role="region" tabindex="0" aria-label="Ảnh [Tên vợt 3]">
              <figure class="slide frame" data-label="Ảnh 1"><img src="images/vot-3/1.webp" alt="[Tên vợt 3], ảnh 1" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 2"><img src="images/vot-3/2.webp" alt="[Tên vợt 3], ảnh 2" loading="lazy" onerror="this.remove()"></figure>
              <figure class="slide frame" data-label="Ảnh 3"><img src="images/vot-3/3.webp" alt="[Tên vợt 3], ảnh 3" loading="lazy" onerror="this.remove()"></figure>
            </div>
          </div>
        </div>
        <div class="racket__info">
          <h2 class="racket__name" id="vot-3-title">[Tên vợt 3]</h2>
          <p class="racket__tagline">[Một dòng mô tả, ví dụ: Vợt cân bằng, dễ đánh cho người mới]</p>
          <p class="price"><span class="price__value">x.xxx.000₫</span> <span class="price__note">giá tham khảo</span></p>
          <dl class="specs">
            <div class="spec"><dt>Trọng lượng</dt><dd>[5U]</dd></div>
            <div class="spec"><dt>Điểm cân bằng</dt><dd>[Cân bằng]</dd></div>
            <div class="spec"><dt>Độ cứng thân</dt><dd>[Dẻo]</dd></div>
            <div class="spec"><dt>Sức căng tối đa</dt><dd>[26 lbs]</dd></div>
          </dl>
          <div class="proscons">
            <div class="proscons__box proscons__box--pro">
              <h3>Ưu điểm</h3>
              <ul>
                <li>[Ưu điểm 1]</li>
                <li>[Ưu điểm 2]</li>
                <li>[Ưu điểm 3]</li>
              </ul>
            </div>
            <div class="proscons__box proscons__box--con">
              <h3>Nhược điểm</h3>
              <ul>
                <li>[Nhược điểm 1]</li>
                <li>[Nhược điểm 2]</li>
              </ul>
            </div>
          </div>
          <div class="actions">
            <a class="btn btn--primary" href="#" target="_blank" rel="sponsored noopener">🛒 Xem giá / Mua</a>
            <a class="btn btn--secondary" href="#" target="_blank" rel="noopener">▶ Xem video review</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>Giá trong trang là giá tham khảo tại thời điểm viết, có thể đã thay đổi.</p>
      <p>Một số link mua là link affiliate: bạn mua qua link thì tui nhận một khoản hoa hồng nhỏ, giá bạn trả không đổi.</p>
      <p>© 2026 Vợt Review</p>
    </div>
  </footer>
</body>
</html>
```

(Ba section mẫu cố ý có số ảnh khác nhau: 5, 4, 3, để thấy gallery chạy đúng ở mọi số lượng.)

- [ ] **Step 4: Tạo folder ảnh và cập nhật `.gitignore`**

```bash
mkdir -p images/vot-1 images/vot-2 images/vot-3
touch images/vot-1/.gitkeep images/vot-2/.gitkeep images/vot-3/.gitkeep
printf 'screenshots/\n.superpowers/\n' >> .gitignore
```

`.gitignore` sau bước này có đúng 4 dòng: `.DS_Store`, `.vercel`, `screenshots/`, `.superpowers/`.

- [ ] **Step 5: Tạo `README.md`**

````markdown
# 🏸 Vợt Review

Landing page tĩnh review vợt cầu lông. HTML/CSS thuần, không cần cài đặt hay build.

## Chạy thử

Double-click `index.html` là xong.

## Cấu trúc

```
index.html        # toàn bộ nội dung
css/style.css     # giao diện; đổi màu ở các biến trong :root
js/gallery.js     # nút ◀ ▶ của gallery (không có cũng chạy)
images/           # hero.webp + mỗi vợt một folder vot-N/
tests/            # test tự động + script chụp màn hình
```

## Thêm một cây vợt

1. Trong `index.html`, copy khối từ `VỢT 1: copy từ dòng này` tới `VỢT 1: copy tới dòng này`, dán ngay sau section cuối.
2. Đổi `vot-1` thành `vot-N` (N là số tiếp theo) ở 4 chỗ: `id`, `aria-labelledby`, `id` của thẻ `h2`, đường dẫn ảnh.
3. Thêm `<a href="#vot-N">Tên vợt</a>` vào menu `site-nav` ở đầu trang.
4. Tạo folder `images/vot-N/` rồi bỏ ảnh vào.
5. Sửa tên, mô tả, giá, thông số, ưu/nhược, link mua, link video.

Xoá vợt: xoá section và dòng menu tương ứng.

## Quy ước ảnh

- Tên file và folder **viết thường, không dấu, nối bằng gạch ngang**. Vercel phân biệt hoa/thường, macOS thì không: `Anh1.webp` chạy trên máy nhưng mất trên web.
- Mỗi vợt 3–5 ảnh, đặt tên `1.webp` … `5.webp`. Ít ảnh hơn thì xoá bớt thẻ `<figure>`.
- Ưu tiên `.webp` (hoặc `.jpg`), rộng khoảng 1200px, tỉ lệ 4:3, dưới 300KB mỗi ảnh. Có thể nén tại https://squoosh.app
- Ảnh bìa: `images/hero.webp`.
- Chưa có ảnh thì trang hiện khung xám ghi "Ảnh 1", "Ảnh 2"…

## Kiểm tra

```bash
node --test "tests/*.test.mjs"   # test cấu trúc HTML/CSS/JS (cần Node 18+)
bash tests/screenshot.sh         # chụp trang ở 375/768/1280px vào ./screenshots
```

## Deploy lên Vercel

1. Đẩy project lên một repo GitHub.
2. Trên https://vercel.com → **Add New… → Project** → chọn repo.
3. **Framework Preset: Other**. Để trống Build Command, Output Directory là thư mục gốc.
4. **Deploy**. Mỗi lần push lên GitHub, Vercel tự deploy lại.
5. Sau khi có tên miền, sửa `og:image` trong `index.html` thành URL đầy đủ (ví dụ `https://ten-mien.vercel.app/images/hero.webp`) để ảnh hiện khi chia sẻ link.
````

- [ ] **Step 6: Chạy test, xác nhận pass**

Run: `node --test "tests/*.test.mjs"`
Expected: PASS hết, `# fail 0`.

- [ ] **Step 7: Validate HTML bằng W3C validator**

Run: `curl -s -H "Content-Type: text/html; charset=utf-8" --data-binary @index.html "https://validator.w3.org/nu/?out=gnu"`
Expected: không có dòng nào chứa `error`. Dòng `info`/`warning` thì ghi vào report, không bắt buộc sửa. Nếu không có mạng thì ghi rõ "chưa validate được" trong report.

- [ ] **Step 8: Commit**

```bash
git add index.html images README.md .gitignore tests/html.test.mjs
git commit -m "feat: add landing page HTML, image folders and README"
```

---

### Task 2: CSS giao diện & responsive

**Files:**
- Create: `tests/css.test.mjs`
- Create: `css/style.css`
- Create: `tests/screenshot.sh`

**Interfaces:**
- Consumes: các class trong "Hợp đồng class dùng chung" (do `index.html` của Task 1 tạo). JS của Task 3 sẽ chèn `button.gallery__btn.gallery__btn--prev|--next` vào `.gallery` và bật/tắt thuộc tính `disabled`.
- Produces: style cho `.gallery__btn`, `.gallery__btn--prev`, `.gallery__btn--next`, `.gallery__btn:disabled` (ẩn dưới 1024px). `.gallery` có `position: relative` để định vị nút.

- [ ] **Step 1: Viết test (sẽ fail)**

Tạo `tests/css.test.mjs`:

```js
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
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `node --test "tests/*.test.mjs"`
Expected: FAIL ở `tests/css.test.mjs` với `ENOENT: no such file or directory, open '.../css/style.css'`. Test HTML vẫn pass.

- [ ] **Step 3: Tạo `css/style.css`**

```css
/* ==========================================================================
   Vợt Review: style.css
   Mobile-first. Đổi màu/bo góc: chỉ sửa các biến trong :root
   ========================================================================== */

:root {
  --bg: #FAFAF7;
  --bg-alt: #F0F2EF;
  --primary: #0F6B4F;
  --accent: #D4F04A;
  --text: #1C1F1E;
  --pro: #1E8E5A;
  --con: #D9534F;
  --radius: 12px;

  --surface: #FFFFFF;
  --muted: #5B6360;
  --placeholder: #D9DDD9;
  --on-dark: #E7EAE8;
  --header-bg: rgba(250, 250, 247, 0.92);
  --shadow: 0 4px 16px rgba(28, 31, 30, 0.08);

  --container: 1200px;
  --gutter: 16px;
  --header-h: 104px;
  --font: "Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

@media (min-width: 640px) {
  :root { --gutter: 24px; }
}

@media (min-width: 1024px) {
  :root { --gutter: 32px; --header-h: 72px; }
}

/* ---------- Base ---------- */

*,
*::before,
*::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);
  line-height: 1.6;
  overflow-wrap: break-word;
  -webkit-font-smoothing: antialiased;
}

img { display: block; max-width: 100%; }

h1, h2, h3 { margin: 0; line-height: 1.2; }

a { color: var(--primary); }

:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 3px;
}

.container {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

/* ---------- Header ---------- */

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--header-bg);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--bg-alt);
}

.site-header__inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-block: 10px;
}

.logo {
  color: var(--text);
  font-size: 1.125rem;
  font-weight: 700;
  text-decoration: none;
}

/* Mobile: menu là một dải cuộn ngang tràn sát mép màn hình */
.site-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-inline: calc(-1 * var(--gutter));
  padding: 4px var(--gutter);
}

.site-nav::-webkit-scrollbar { display: none; }

.site-nav a {
  flex: none;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--bg-alt);
  color: var(--text);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.site-nav a:hover { background: var(--accent); }

/* ---------- Hero ---------- */

.hero { padding-block: clamp(40px, 8vw, 96px); }

.hero__inner {
  display: grid;
  gap: 32px;
  align-items: center;
}

.hero__eyebrow {
  margin: 0 0 8px;
  color: var(--primary);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero__title {
  font-size: clamp(2rem, 1.4rem + 3vw, 3.5rem);
  font-weight: 700;
}

.highlight { background: linear-gradient(transparent 62%, var(--accent) 62%); }

.hero__lead {
  max-width: 52ch;
  margin: 16px 0 24px;
  color: var(--muted);
}

.hero__media {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
}

/* ---------- Khung ảnh: nền xám + nhãn, ảnh thật nằm đè lên ---------- */

.frame {
  position: relative;
  overflow: hidden;
  background: var(--placeholder);
}

.frame::before {
  content: attr(data-label);
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--muted);
  font-weight: 600;
}

.frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---------- Section vợt ---------- */

.racket {
  padding-block: clamp(48px, 7vw, 88px);
  scroll-margin-top: var(--header-h);
}

.racket:nth-of-type(even) { background: var(--bg-alt); }

.racket__inner {
  display: grid;
  gap: 28px;
}

.racket__media { min-width: 0; }

.racket__name {
  font-size: clamp(1.75rem, 1.3rem + 2vw, 2.5rem);
  font-weight: 700;
}

.racket__tagline {
  margin: 8px 0 0;
  color: var(--muted);
}

/* ---------- Gallery ---------- */

.gallery { position: relative; }

.gallery__track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
  border-radius: var(--radius);
  padding-bottom: 4px;
}

/* Mobile: slide 85% để ló ảnh kế tiếp, gợi ý vuốt ngang */
.slide {
  flex: 0 0 85%;
  margin: 0;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  scroll-snap-align: start;
}

.gallery__btn { display: none; }

/* ---------- Giá ---------- */

.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  margin: 20px 0 0;
}

.price__value {
  color: var(--primary);
  font-size: clamp(1.75rem, 1.4rem + 1.5vw, 2.25rem);
  font-weight: 700;
}

.price__note {
  color: var(--muted);
  font-size: 0.875rem;
}

/* ---------- Thông số ---------- */

.specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px 0 0;
}

.spec {
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.spec dt {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.spec dd {
  margin: 2px 0 0;
  font-weight: 600;
}

/* ---------- Ưu / nhược ---------- */

.proscons {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.proscons__box {
  padding: 16px;
  border-top: 4px solid;
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.proscons__box--pro { border-top-color: var(--pro); }
.proscons__box--con { border-top-color: var(--con); }

.proscons__box h3 {
  margin-bottom: 8px;
  font-size: 1rem;
}

.proscons ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.proscons li {
  position: relative;
  padding-left: 26px;
}

.proscons li::before {
  position: absolute;
  top: 0;
  left: 0;
  font-weight: 700;
}

.proscons__box--pro li::before { content: "✓"; color: var(--pro); }
.proscons__box--con li::before { content: "✕"; color: var(--con); }

/* ---------- Nút ---------- */

/* Mobile: nút rộng hết hàng */
.actions {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s, background-color 0.15s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn--primary {
  background: var(--primary);
  color: var(--surface);
}

.btn--secondary {
  border: 2px solid var(--primary);
  background: transparent;
  color: var(--primary);
}

.btn--secondary:hover { background: var(--accent); }

/* ---------- Footer ---------- */

.site-footer {
  padding-block: 40px;
  background: var(--text);
  color: var(--on-dark);
  font-size: 0.875rem;
}

.site-footer p { margin: 0 0 8px; }

/* ---------- Tablet (≥ 640px) ---------- */

@media (min-width: 640px) {
  .specs { grid-template-columns: repeat(4, 1fr); }
  .proscons { grid-template-columns: 1fr 1fr; }
  .actions { display: flex; flex-wrap: wrap; }
}

/* ---------- Desktop (≥ 1024px) ---------- */

@media (min-width: 1024px) {
  .site-header__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .site-nav {
    margin-inline: 0;
    padding-inline: 0;
  }

  .hero__inner { grid-template-columns: 1fr 1fr; }

  /* Ảnh ~55%, thông tin ~45%; section chẵn đảo chiều cho so le */
  .racket__inner {
    grid-template-columns: minmax(0, 11fr) minmax(0, 9fr);
    gap: 48px;
    align-items: start;
  }

  .racket:nth-of-type(even) .racket__media { order: 2; }

  .slide { flex-basis: 100%; }

  .gallery__btn {
    position: absolute;
    top: 50%;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: var(--accent);
    color: var(--text);
    font-size: 1.125rem;
    cursor: pointer;
    box-shadow: var(--shadow);
    transform: translateY(-50%);
    transition: opacity 0.2s;
  }

  .gallery__btn--prev { left: 12px; }
  .gallery__btn--next { right: 12px; }

  .gallery__btn:disabled {
    opacity: 0.35;
    cursor: default;
  }
}

/* ---------- Giảm chuyển động ---------- */

@media (prefers-reduced-motion: reduce) {
  html,
  .gallery__track { scroll-behavior: auto; }

  .btn,
  .gallery__btn { transition: none; }

  .btn:hover { transform: none; }
}
```

- [ ] **Step 4: Chạy test, xác nhận pass**

Run: `node --test "tests/*.test.mjs"`
Expected: PASS hết, `# fail 0`.

- [ ] **Step 5: Tạo `tests/screenshot.sh`**

```bash
#!/usr/bin/env bash
# Chụp trang ở 3 kích thước màn hình (và một bản tắt JS) để kiểm tra responsive bằng mắt.
# Dùng: bash tests/screenshot.sh [thư-mục-xuất]   (mặc định ./screenshots, đã gitignore)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/screenshots}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
URL="file://${ROOT// /%20}/index.html"

mkdir -p "$OUT"

shoot() { # $1 = tên file, $2 = rộng,cao, các tham số còn lại truyền thẳng cho Chrome
  local name="$1" size="$2"
  shift 2
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="$size" --screenshot="$OUT/$name.png" "$@" "$URL" >/dev/null 2>&1
  echo "$OUT/$name.png"
}

shoot page-375 375,6000
shoot page-768 768,5000
shoot page-1280 1280,3600
shoot page-1280-nojs 1280,3600 --blink-settings=scriptEnabled=false
```

- [ ] **Step 6: Chụp và kiểm tra bằng mắt**

Run: `bash tests/screenshot.sh`
Expected: in ra 4 đường dẫn PNG. Mở từng ảnh (Read tool) và xác nhận:
- `page-375.png`: header 2 hàng (logo trên, menu dạng pill bên dưới). Mỗi section xếp dọc: gallery có ảnh kế tiếp ló ra bên phải → tên → giá → thông số 2 ô/hàng → ưu/nhược xếp dọc → 2 nút rộng hết hàng. Không có gì tràn ra ngoài mép phải.
- `page-768.png`: thông số 4 ô/hàng, ưu/nhược 2 cột cạnh nhau, 2 nút nằm cùng hàng.
- `page-1280.png`: header 1 hàng. Hero 2 cột. Section 2 cột: vot-1 và vot-3 ảnh bên trái, vot-2 ảnh bên phải và nền xám nhạt. Mỗi gallery chỉ thấy đúng 1 khung ảnh, khung có nhãn "Ảnh 1". Chưa có nút ◀ ▶ (Task 3 mới thêm).
- `page-1280-nojs.png`: giống `page-1280.png`.

Nếu sai thì sửa `css/style.css`, chạy lại test và chụp lại.

- [ ] **Step 7: Commit**

```bash
git add css/style.css tests/css.test.mjs tests/screenshot.sh
git commit -m "feat: add responsive styles and screenshot script"
```

---

### Task 3: Nút ◀ ▶ cho gallery

**Files:**
- Create: `tests/gallery.test.mjs`
- Create: `js/gallery.js`

**Interfaces:**
- Consumes: markup `.gallery` > `.gallery__track` > `.slide` (Task 1). Style `.gallery__btn`, `.gallery__btn--prev`, `.gallery__btn--next`, `:disabled` (Task 2).
- Produces: `window.Gallery = { edgeState(scrollLeft, scrollWidth, clientWidth) → { atStart: boolean, atEnd: boolean }, initGallery(galleryElement) → void }`. Tự chạy `initGallery` cho mọi `.gallery` khi nạp.

- [ ] **Step 1: Viết test (sẽ fail)**

Tạo `tests/gallery.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/gallery.js', import.meta.url), 'utf8');

// DOM giả tối thiểu, chỉ đủ cho những gì gallery.js dùng
function fakeElement(props = {}) {
  const listeners = {};
  return {
    children: [],
    attributes: {},
    ...props,
    appendChild(child) { this.children.push(child); return child; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
    dispatch(type) { (listeners[type] || []).forEach((fn) => fn()); },
  };
}

function fakeGallery({ scrollWidth = 1048, clientWidth = 250, slideOffsets = [0, 262, 524, 786] } = {}) {
  const scrollCalls = [];
  const track = fakeElement({
    scrollLeft: 0,
    scrollWidth,
    clientWidth,
    scrollCalls,
    scrollBy(options) { scrollCalls.push(options.left); },
    querySelectorAll: (sel) => (sel === '.slide' ? slideOffsets.map((offsetLeft) => ({ offsetLeft })) : []),
  });
  const gallery = fakeElement({
    querySelector: (sel) => (sel === '.gallery__track' ? track : null),
  });
  return { gallery, track };
}

function load(galleries = []) {
  const window = fakeElement();
  const document = {
    createElement: () => fakeElement(),
    querySelectorAll: (sel) => (sel === '.gallery' ? galleries : []),
  };
  vm.runInNewContext(source, { window, document });
  return window;
}

const [prevOf, nextOf] = [(g) => g.children[0], (g) => g.children[1]];

test('edgeState: đầu, giữa, cuối', () => {
  const { edgeState } = load().Gallery;
  assert.equal(edgeState(0, 1000, 250).atStart, true);
  assert.equal(edgeState(0, 1000, 250).atEnd, false);
  assert.equal(edgeState(400, 1000, 250).atStart, false);
  assert.equal(edgeState(400, 1000, 250).atEnd, false);
  assert.equal(edgeState(750, 1000, 250).atEnd, true);
});

test('edgeState: chấp nhận sai số vài px do scrollLeft lẻ', () => {
  const { edgeState } = load().Gallery;
  assert.equal(edgeState(1.5, 1000, 250).atStart, true);
  assert.equal(edgeState(748.6, 1000, 250).atEnd, true);
});

test('edgeState: gallery vừa khít (1 ảnh) thì cả hai đầu đều đúng', () => {
  const { edgeState } = load().Gallery;
  const state = edgeState(0, 250, 250);
  assert.equal(state.atStart, true);
  assert.equal(state.atEnd, true);
});

test('tự khởi tạo mọi .gallery khi nạp script', () => {
  const a = fakeGallery();
  const b = fakeGallery();
  load([a.gallery, b.gallery]);
  assert.equal(a.gallery.children.length, 2);
  assert.equal(b.gallery.children.length, 2);
});

test('chèn nút ◀ ▶ đúng class, type, aria-label', () => {
  const { gallery } = fakeGallery();
  load([gallery]);
  const prev = prevOf(gallery);
  const next = nextOf(gallery);
  assert.equal(prev.type, 'button');
  assert.equal(prev.className, 'gallery__btn gallery__btn--prev');
  assert.equal(prev.attributes['aria-label'], 'Ảnh trước');
  assert.equal(prev.textContent, '◀');
  assert.equal(next.type, 'button');
  assert.equal(next.className, 'gallery__btn gallery__btn--next');
  assert.equal(next.attributes['aria-label'], 'Ảnh sau');
  assert.equal(next.textContent, '▶');
});

test('ở đầu: ◀ disabled, ▶ bật', () => {
  const { gallery } = fakeGallery();
  load([gallery]);
  assert.equal(prevOf(gallery).disabled, true);
  assert.equal(nextOf(gallery).disabled, false);
});

test('bấm ▶/◀ cuộn đúng một bước = khoảng cách giữa 2 slide (gồm gap)', () => {
  const { gallery, track } = fakeGallery();
  load([gallery]);
  nextOf(gallery).dispatch('click');
  prevOf(gallery).dispatch('click');
  assert.deepEqual([...track.scrollCalls], [262, -262]);
});

test('chỉ có 1 slide thì bước cuộn = bề rộng track', () => {
  const { gallery, track } = fakeGallery({ scrollWidth: 250, slideOffsets: [0] });
  load([gallery]);
  nextOf(gallery).dispatch('click');
  assert.deepEqual([...track.scrollCalls], [250]);
});

test('cuộn tới cuối: ▶ disabled, ◀ bật', () => {
  const { gallery, track } = fakeGallery();
  load([gallery]);
  track.scrollLeft = 798;
  track.dispatch('scroll');
  assert.equal(prevOf(gallery).disabled, false);
  assert.equal(nextOf(gallery).disabled, true);
});

test('resize cập nhật lại trạng thái nút', () => {
  const { gallery, track } = fakeGallery();
  const window = load([gallery]);
  track.clientWidth = 1048;
  window.dispatch('resize');
  assert.equal(nextOf(gallery).disabled, true);
});

test('gallery vừa khít: cả hai nút disabled', () => {
  const { gallery } = fakeGallery({ scrollWidth: 250, slideOffsets: [0] });
  load([gallery]);
  assert.equal(prevOf(gallery).disabled, true);
  assert.equal(nextOf(gallery).disabled, true);
});

test('.gallery không có track thì bỏ qua, không lỗi', () => {
  const gallery = fakeElement({ querySelector: () => null });
  assert.doesNotThrow(() => load([gallery]));
  assert.equal(gallery.children.length, 0);
});
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `node --test "tests/*.test.mjs"`
Expected: FAIL ở `tests/gallery.test.mjs` với `ENOENT: no such file or directory, open '.../js/gallery.js'`. Test HTML và CSS vẫn pass.

- [ ] **Step 3: Tạo `js/gallery.js`**

```js
/*
 * gallery.js: thêm nút ◀ ▶ cho mỗi .gallery (CSS chỉ hiện nút ở desktop ≥ 1024px).
 * Không có file này thì gallery vẫn cuộn/vuốt bình thường.
 */
(function () {
  'use strict';

  // Sai số (px) khi so vị trí cuộn với hai đầu, vì scrollLeft có thể là số lẻ
  var EDGE_TOLERANCE = 2;

  function edgeState(scrollLeft, scrollWidth, clientWidth) {
    return {
      atStart: scrollLeft <= EDGE_TOLERANCE,
      atEnd: scrollLeft + clientWidth >= scrollWidth - EDGE_TOLERANCE
    };
  }

  // Một bước cuộn = khoảng cách giữa 2 slide liền nhau (bề rộng slide + gap)
  function stepSize(track) {
    var slides = track.querySelectorAll('.slide');
    if (slides.length >= 2) return slides[1].offsetLeft - slides[0].offsetLeft;
    return track.clientWidth;
  }

  function createButton(modifier, label, text) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery__btn gallery__btn--' + modifier;
    button.setAttribute('aria-label', label);
    button.textContent = text;
    return button;
  }

  function initGallery(gallery) {
    var track = gallery.querySelector('.gallery__track');
    if (!track) return;

    var prev = createButton('prev', 'Ảnh trước', '◀');
    var next = createButton('next', 'Ảnh sau', '▶');

    function update() {
      var state = edgeState(track.scrollLeft, track.scrollWidth, track.clientWidth);
      prev.disabled = state.atStart;
      next.disabled = state.atEnd;
    }

    // Không truyền behavior: trình duyệt dùng scroll-behavior trong CSS (tự tắt khi reduced motion)
    prev.addEventListener('click', function () { track.scrollBy({ left: -stepSize(track) }); });
    next.addEventListener('click', function () { track.scrollBy({ left: stepSize(track) }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    gallery.appendChild(prev);
    gallery.appendChild(next);
    update();
  }

  window.Gallery = { edgeState: edgeState, initGallery: initGallery };
  document.querySelectorAll('.gallery').forEach(initGallery);
})();
```

- [ ] **Step 4: Chạy test, xác nhận pass**

Run: `node --test "tests/*.test.mjs"`
Expected: PASS hết, `# fail 0`.

- [ ] **Step 5: Chụp và kiểm tra bằng mắt**

Run: `bash tests/screenshot.sh`
Expected:
- `page-1280.png`: mỗi gallery có nút tròn màu vàng chanh ▶ ở mép phải giữa ảnh, và nút ◀ mờ ở mép trái (đang ở ảnh đầu).
- `page-1280-nojs.png`: không có nút ◀ ▶, bố cục còn lại giống bản có JS.
- `page-375.png`, `page-768.png`: không có nút ◀ ▶.

- [ ] **Step 6: Commit**

```bash
git add js/gallery.js tests/gallery.test.mjs
git commit -m "feat: add gallery prev/next buttons"
```
