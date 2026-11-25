/**
 * Posts page — two ways to browse the same posts.
 *
 *   Flip · 翻阅  A pile of paper cards. Click the card (left part = back,
 *               the rest = forward), swipe it, use the arrow buttons or
 *               press ← → to turn the page. The pile wraps around.
 *   Desk · 平铺  Every card laid out on the desk; click one to read it.
 *
 * Without JavaScript only the desk view is shown. It is a plain list of
 * links, so every post stays reachable. The chosen view is remembered.
 * Loaded by _pages/blogs.md only.
 */
(function () {
  'use strict';

  var shelf = document.getElementById('posts-shelf');
  if (!shelf) return;

  var flipView = document.getElementById('posts-flip');
  var deskView = document.getElementById('posts-desk');
  var deck = shelf.querySelector('.posts-deck');
  var toggle = shelf.querySelector('.posts-view-toggle');
  if (!flipView || !deskView || !deck || !toggle) return;

  var cards = Array.prototype.slice.call(deck.querySelectorAll('.post-card'));
  var total = cards.length;
  if (!total) return;

  var viewButtons = Array.prototype.slice.call(toggle.querySelectorAll('[data-view-target]'));
  var stepButtons = Array.prototype.slice.call(flipView.querySelectorAll('[data-step]'));
  var progress = flipView.querySelector('.posts-progress');
  var counter = flipView.querySelector('.posts-counter-current');
  var live = flipView.querySelector('.posts-live');
  var reducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  var STORAGE_KEY = 'posts-view';
  var VISIBLE_DEPTH = 3;    // cards drawn underneath the top one
  var BACK_ZONE = 0.35;     // left share of the card that turns back
  var RIFFLE_STEP = 70;     // ms between cards when several turn at once
  var LIFT_DELAY = 90;      // ms before the next card rises into place
  var TURN_MS = 850;        // keep in sync with $turn-duration in _posts.scss

  var current = 0;
  var segments = [];
  var settleTimer = null;
  var enterTimer = null;
  var suppressClickUntil = 0;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  // ---- Covers: a missing image falls back to a typographic cover ---------
  Array.prototype.forEach.call(shelf.querySelectorAll('.post-card-media img, .desk-photo img'), function (img) {
    var markMissing = function () {
      img.parentNode.classList.add('is-missing');
    };
    if (img.complete && img.naturalWidth === 0) markMissing(); // failed before this script ran
    img.addEventListener('error', markMissing);
  });

  // ---- Flip view: the pile ------------------------------------------------
  function render(delays) {
    cards.forEach(function (card, i) {
      var depth = i - current; // 0 = top of the pile, negative = turned away
      var turned = depth < 0;

      card.classList.toggle('is-turned', turned);
      card.classList.toggle('is-top', depth === 0);
      card.classList.toggle('is-buried', depth > VISIBLE_DEPTH);
      card.setAttribute('data-depth', turned ? 'turned' : String(Math.min(depth, VISIBLE_DEPTH)));
      // Turned cards sit above the pile (the most recently turned on top);
      // the pile itself is ordered from the top card down.
      card.style.zIndex = turned ? String(1000 - i) : String(500 - depth);
      card.style.setProperty('--delay', ((delays && delays[i]) || 0) + 'ms');

      if (depth === 0) {
        card.removeAttribute('aria-hidden');
        card.removeAttribute('inert');
      } else {
        card.setAttribute('aria-hidden', 'true');
        card.setAttribute('inert', '');
      }
    });

    segments.forEach(function (seg, i) {
      seg.classList.toggle('is-past', i < current);
      seg.classList.toggle('is-current', i === current);
      if (i === current) seg.setAttribute('aria-current', 'step');
      else seg.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = pad(current + 1);
  }

  function announce() {
    if (!live) return;
    var n = current + 1;
    live.textContent = 'Post ' + n + ' of ' + total + ': ' +
      (cards[current].getAttribute('data-title') || '') +
      ' · 第 ' + n + ' 条，共 ' + total + ' 条';
  }

  function go(target) {
    if (total < 2) return;
    var next = ((target % total) + total) % total; // wrap around both ends
    if (next === current) return;

    var from = current;
    var forward = next > from;
    var delays = {};
    var turning = [];
    var i;

    // Cards whose turned state changes, in the order they move: turning
    // forward the top card goes first; turning back, the nearest one returns
    // first so the target card lands last, on top.
    if (forward) {
      for (i = from; i < next; i++) turning.push(i);
    } else {
      for (i = from - 1; i >= next; i--) turning.push(i);
    }

    var stagger = reducedMotion.matches ? 0 : RIFFLE_STEP;
    turning.forEach(function (index, k) {
      delays[index] = k * stagger;
    });
    // The rest of the pile shifts once the last page has started to lift.
    if (forward && !reducedMotion.matches) {
      for (i = next; i < total; i++) {
        delays[i] = (turning.length - 1) * stagger + LIFT_DELAY;
      }
    }

    // Keep keyboard focus from vanishing into a card that becomes inert.
    var refocus = cards[from].contains(document.activeElement);

    current = next;
    render(delays);
    announce();
    if (refocus) deck.focus({ preventScroll: true });

    // Once everything has landed, drop the per-card delays so later hover
    // effects respond immediately.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(function () {
      cards.forEach(function (card) {
        card.style.setProperty('--delay', '0ms');
      });
    }, TURN_MS + turning.length * stagger + LIFT_DELAY + 50);
  }

  function step(delta) {
    go(current + delta);
  }

  // Progress segments double as "go to post n" buttons.
  if (progress) {
    cards.forEach(function (card, i) {
      var seg = document.createElement('button');
      seg.type = 'button';
      seg.className = 'posts-progress-seg';
      seg.setAttribute('data-index', String(i));
      seg.setAttribute('aria-label', 'Go to post ' + (i + 1) + ' · 前往第 ' + (i + 1) + ' 条');
      progress.appendChild(seg);
      segments.push(seg);
    });
    progress.addEventListener('click', function (event) {
      var seg = event.target.closest('.posts-progress-seg');
      if (seg) go(Number(seg.getAttribute('data-index')));
    });
  }

  stepButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      step(Number(button.getAttribute('data-step')));
    });
  });

  function isBackZone(clientX) {
    var rect = cards[current].getBoundingClientRect();
    return clientX < rect.left + rect.width * BACK_ZONE;
  }

  // Clicking the card itself turns the page; its links still open the post.
  deck.addEventListener('click', function (event) {
    if (Date.now() < suppressClickUntil) return;
    if (event.target.closest('a, button')) return;
    var selection = window.getSelection ? window.getSelection() : null;
    if (selection && !selection.isCollapsed && deck.contains(selection.anchorNode)) return;
    step(isBackZone(event.clientX) ? -1 : 1);
  });

  // Hover shows which way a click will turn (and lifts the page corner).
  function setZone(zone) {
    if (zone) deck.setAttribute('data-zone', zone);
    else deck.removeAttribute('data-zone');
  }
  deck.addEventListener('pointermove', function (event) {
    if (event.pointerType !== 'mouse') return;
    if (event.target.closest('a, button')) {
      setZone('');
      return;
    }
    setZone(isBackZone(event.clientX) ? 'prev' : 'next');
  });
  deck.addEventListener('pointerleave', function () {
    setZone('');
  });

  // Touch and pen: swipe left for the next card, right for the previous.
  var swipe = null;
  deck.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse') return;
    swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  deck.addEventListener('pointerup', function (event) {
    if (!swipe || event.pointerId !== swipe.id) return;
    var dx = event.clientX - swipe.x;
    var dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClickUntil = Date.now() + 500;
      step(dx < 0 ? 1 : -1);
    }
  });
  deck.addEventListener('pointercancel', function () {
    swipe = null;
  });

  // ← → turn the page whenever the pile is on screen; Home / End jump to
  // the first / last card while the pile has focus.
  document.addEventListener('keydown', function (event) {
    if (flipView.hidden || event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    var target = event.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (document.querySelector('.search-overlay.open')) return;
    var rect = deck.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    var inDeck = deck.contains(document.activeElement);
    if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'ArrowLeft') step(-1);
    else if (event.key === 'Home' && inDeck) go(0);
    else if (event.key === 'End' && inDeck) go(total - 1);
    else return;
    event.preventDefault();
  });

  // ---- Switching between the two views ------------------------------------
  function readSavedView() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveView(view) {
    try {
      window.localStorage.setItem(STORAGE_KEY, view);
    } catch (e) {
      /* private mode: the choice simply is not remembered */
    }
  }

  function setView(view, animate) {
    var isFlip = view === 'flip';
    shelf.setAttribute('data-view', view);
    flipView.hidden = !isFlip;
    deskView.hidden = isFlip;
    viewButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-view-target') === view ? 'true' : 'false');
    });

    flipView.classList.remove('is-entering');
    deskView.classList.remove('is-entering');
    clearTimeout(enterTimer);
    if (!animate || reducedMotion.matches) return;

    // Restart the entrance: the pile rises, or the cards are dealt out.
    var entering = isFlip ? flipView : deskView;
    void entering.offsetWidth;
    entering.classList.add('is-entering');
    enterTimer = setTimeout(function () {
      entering.classList.remove('is-entering');
    }, isFlip ? 700 : 750 + total * 60);
  }

  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var view = button.getAttribute('data-view-target');
      if (view === shelf.getAttribute('data-view')) return;
      setView(view, true);
      saveView(view);
    });
  });

  // Lay out the pile while it is still hidden (no transitions run), then
  // show the remembered view — the flip view unless the reader chose Desk.
  render();
  toggle.hidden = false;
  setView(readSavedView() === 'desk' ? 'desk' : 'flip', false);
})();
