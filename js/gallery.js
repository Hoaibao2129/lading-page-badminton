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

    var name = track.getAttribute('aria-label');
    var prev = createButton('prev', name ? 'Ảnh trước – ' + name : 'Ảnh trước', '◀');
    var next = createButton('next', name ? 'Ảnh sau – ' + name : 'Ảnh sau', '▶');

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
