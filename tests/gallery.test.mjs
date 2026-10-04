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

function fakeGallery({ scrollWidth = 1048, clientWidth = 250, slideOffsets = [0, 262, 524, 786], label = 'Ảnh Vợt A' } = {}) {
  const scrollCalls = [];
  const track = fakeElement({
    scrollLeft: 0,
    scrollWidth,
    clientWidth,
    scrollCalls,
    getAttribute: (name) => (name === 'aria-label' ? label : null),
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
  assert.equal(prev.attributes['aria-label'], 'Ảnh trước – Ảnh Vợt A');
  assert.equal(prev.textContent, '◀');
  assert.equal(next.type, 'button');
  assert.equal(next.className, 'gallery__btn gallery__btn--next');
  assert.equal(next.attributes['aria-label'], 'Ảnh sau – Ảnh Vợt A');
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

test('track không có aria-label thì nhãn nút chỉ là "Ảnh trước"/"Ảnh sau"', () => {
  const { gallery } = fakeGallery({ label: null });
  load([gallery]);
  assert.equal(prevOf(gallery).attributes['aria-label'], 'Ảnh trước');
  assert.equal(nextOf(gallery).attributes['aria-label'], 'Ảnh sau');
});
