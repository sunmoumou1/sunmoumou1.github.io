// =============================================================
// site.js — Dark mode, publication filter, toggles, scroll effects,
//           copy bibtex, back-to-top, year badges
// =============================================================

(function () {
  'use strict';

  // ----- Dark Mode Toggle -----

  var toggle = document.getElementById('darkModeToggle');
  var icon = document.getElementById('themeIcon');

  function updateIcon() {
    if (!icon) return;
    var theme = document.documentElement.getAttribute('data-bs-theme');
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-moon';
    } else {
      icon.className = 'fa-solid fa-sun';
    }
  }

  if (toggle) {
    updateIcon();

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-bs-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      localStorage.setItem('theme', next);
      updateIcon();
    });
  }

  // ----- Publication Expand/Collapse -----

  document.addEventListener('click', function (e) {
    var button = e.target.closest('[data-toggle-target]');
    if (!button) return;

    var targetId = button.getAttribute('data-toggle-target');
    var target = document.getElementById(targetId);
    if (!target) return;

    target.classList.toggle('show');
  });

  // ----- Publication Search/Filter -----

  var searchInput = document.getElementById('pubSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var entries = document.querySelectorAll('[data-pub-searchable]');

      entries.forEach(function (entry) {
        if (!query) {
          entry.style.display = '';
          return;
        }
        var text = entry.textContent.toLowerCase();
        entry.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // ----- Copy BibTeX Button -----

  document.querySelectorAll('.pub-collapse').forEach(function (collapse) {
    // Only add copy to bibtex blocks (id starts with "bib-")
    if (!collapse.id || !collapse.id.startsWith('bib-')) return;

    var pre = collapse.querySelector('pre');
    if (!pre) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'copy-wrapper';
    wrapper.style.position = 'relative';

    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    btn.title = 'Copy to clipboard';

    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(pre.textContent.trim()).then(function () {
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(btn);
  });

  // ----- Publication Year Badges -----

  document.querySelectorAll('.pub-entry').forEach(function (entry) {
    var text = entry.textContent;
    // Match a 4-digit year in parentheses, common in citation format
    var match = text.match(/\((\d{4})\)/);
    if (match) {
      var badge = document.createElement('span');
      badge.className = 'year-badge';
      badge.textContent = match[1];
      entry.insertBefore(badge, entry.firstChild);
    }
  });

  // ----- Back to Top Button -----

  var topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  topBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  // ----- Navbar Scroll Shadow -----

  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ----- Fade-in on Scroll -----

  var fadeElements = document.querySelectorAll('.fade-in-section');
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ----- Activities Globe -----

  var globe = document.getElementById('activityGlobe');
  if (globe) {
    initActivityGlobe(globe);
  }

  function initActivityGlobe(globeEl) {
    var canvas = globeEl.querySelector('.activity-globe-canvas');
    var arrows = globeEl.querySelector('.activity-globe-arrows');
    var labels = globeEl.querySelector('.activity-globe-labels');
    var dataEl = document.getElementById('activityGlobeData');
    if (!canvas || !arrows || !labels || !dataEl) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var locations;
    try {
      locations = JSON.parse(dataEl.textContent);
    } catch (error) {
      return;
    }
    if (!locations || !locations.length) return;

    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var dpr = window.devicePixelRatio || 1;
    var width = 0;
    var height = 0;
    var centerX = 0;
    var centerY = 0;
    var radius = 0;
    var focusIndex = Math.min(1, locations.length - 1);
    var lastFocusAt = performance.now();
    var lastInteractionAt = performance.now();
    var velocityLon = 0;
    var velocityLat = 0;
    var drag = null;
    var callouts = [];
    var arrowPaths = [];
    var globeState = {
      lon: locations[focusIndex].lon,
      lat: clamp(locations[focusIndex].lat * 0.72, -54, 58),
      targetLon: locations[focusIndex].lon,
      targetLat: clamp(locations[focusIndex].lat * 0.72, -54, 58)
    };

    var coastlines = [
      [[-166, 67], [-143, 59], [-125, 50], [-121, 38], [-114, 29], [-101, 20], [-87, 21], [-80, 30], [-73, 41], [-61, 50], [-56, 59], [-78, 70], [-105, 73], [-137, 70], [-166, 67]],
      [[-82, 12], [-77, -2], [-79, -18], [-72, -38], [-61, -53], [-49, -49], [-41, -28], [-35, -10], [-49, 5], [-65, 12], [-82, 12]],
      [[-11, 36], [0, 50], [22, 60], [51, 61], [77, 55], [103, 58], [132, 49], [146, 36], [124, 21], [105, 7], [83, 10], [67, 26], [46, 30], [28, 37], [9, 38], [-11, 36]],
      [[-18, 35], [3, 36], [25, 31], [42, 12], [36, -19], [22, -35], [5, -34], [-10, -20], [-16, 2], [-18, 35]],
      [[112, -11], [153, -12], [156, -32], [136, -44], [116, -35], [112, -11]],
      [[-52, 60], [-36, 72], [-45, 82], [-70, 78], [-62, 64], [-52, 60]],
      [[-180, -72], [-130, -69], [-75, -73], [-20, -70], [40, -73], [100, -69], [160, -72]]
    ];

    locations.forEach(function (location, index) {
      var callout = document.createElement('div');
      callout.className = 'activity-globe-callout';
      callout.textContent = location.title;
      labels.appendChild(callout);
      callouts[index] = callout;
    });

    setupArrows();
    resizeGlobe();

    if ('ResizeObserver' in window) {
      new ResizeObserver(resizeGlobe).observe(globeEl);
    } else {
      window.addEventListener('resize', resizeGlobe);
    }

    globeEl.addEventListener('pointerdown', startDrag);
    globeEl.addEventListener('pointermove', moveDrag);
    globeEl.addEventListener('pointerup', endDrag);
    globeEl.addEventListener('pointercancel', endDrag);
    globeEl.addEventListener('lostpointercapture', endDrag);

    requestAnimationFrame(renderGlobe);

    function setupArrows() {
      var ns = 'http://www.w3.org/2000/svg';
      arrows.textContent = '';

      var defs = document.createElementNS(ns, 'defs');
      var marker = document.createElementNS(ns, 'marker');
      marker.setAttribute('id', 'activityArrowHead');
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6');
      marker.setAttribute('markerHeight', '6');
      marker.setAttribute('orient', 'auto-start-reverse');

      var markerPath = document.createElementNS(ns, 'path');
      markerPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      markerPath.setAttribute('fill', '#e33131');
      marker.appendChild(markerPath);
      defs.appendChild(marker);
      arrows.appendChild(defs);

      locations.forEach(function () {
        var path = document.createElementNS(ns, 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#e33131');
        path.setAttribute('stroke-width', '1.6');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('marker-end', 'url(#activityArrowHead)');
        path.style.opacity = '0';
        arrows.appendChild(path);
        arrowPaths.push(path);
      });
    }

    function resizeGlobe() {
      var rect = globeEl.getBoundingClientRect();
      width = Math.max(320, Math.round(rect.width));
      height = Math.max(380, Math.round(rect.height));
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      arrows.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      centerX = width / 2;
      centerY = height * (width < 640 ? 0.44 : 0.51);
      radius = Math.min(
        width * (width < 640 ? 0.31 : 0.32),
        height * (width < 640 ? 0.27 : 0.38)
      );
    }

    function startDrag(event) {
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        lon: globeState.lon,
        lat: globeState.lat,
        previousLon: globeState.lon,
        previousLat: globeState.lat
      };
      velocityLon = 0;
      velocityLat = 0;
      lastInteractionAt = performance.now();
      globeEl.classList.add('is-dragging');
      if (globeEl.setPointerCapture) {
        globeEl.setPointerCapture(event.pointerId);
      }
    }

    function moveDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      event.preventDefault();

      var dx = event.clientX - drag.x;
      var dy = event.clientY - drag.y;
      globeState.lon = normalizeLon(drag.lon - dx * 0.28);
      globeState.lat = clamp(drag.lat + dy * 0.18, -58, 62);
      globeState.targetLon = globeState.lon;
      globeState.targetLat = globeState.lat;
      velocityLon = normalizeDelta(globeState.lon - drag.previousLon) * 0.72;
      velocityLat = (globeState.lat - drag.previousLat) * 0.72;
      drag.previousLon = globeState.lon;
      drag.previousLat = globeState.lat;
      lastInteractionAt = performance.now();
    }

    function endDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      globeEl.classList.remove('is-dragging');
      if (globeEl.releasePointerCapture) {
        globeEl.releasePointerCapture(event.pointerId);
      }
      lastInteractionAt = performance.now();
    }

    function renderGlobe(now) {
      updateGlobeState(now);
      ctx.clearRect(0, 0, width, height);
      drawOrbitLines(now);
      drawSphere(now);

      var projected = locations.map(function (location, index) {
        var point = project(location.lat, location.lon);
        point.index = index;
        point.location = location;
        return point;
      });

      drawMarkers(projected, now);
      layoutCallouts(projected);
      requestAnimationFrame(renderGlobe);
    }

    function updateGlobeState(now) {
      if (!drag) {
        if (!reducedMotion && now - lastInteractionAt > 5200 && now - lastFocusAt > 4600) {
          focusIndex = (focusIndex + 1) % locations.length;
          globeState.targetLon = locations[focusIndex].lon;
          globeState.targetLat = clamp(locations[focusIndex].lat * 0.72, -54, 58);
          lastFocusAt = now;
        }

        if (Math.abs(velocityLon) > 0.002 || Math.abs(velocityLat) > 0.002) {
          globeState.lon = normalizeLon(globeState.lon + velocityLon);
          globeState.lat = clamp(globeState.lat + velocityLat, -58, 62);
          globeState.targetLon = globeState.lon;
          globeState.targetLat = globeState.lat;
          velocityLon *= 0.92;
          velocityLat *= 0.92;
        } else {
          globeState.lon = normalizeLon(
            globeState.lon + normalizeDelta(globeState.targetLon - globeState.lon) * 0.035
          );
          globeState.lat += (globeState.targetLat - globeState.lat) * 0.035;
        }
      }
    }

    function drawOrbitLines(now) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(138, 21, 56, 0.18)';
      ctx.globalAlpha = 0.72;

      var drift = reducedMotion ? 0 : Math.sin(now / 1300) * 0.018;
      ctx.rotate(-0.18 + drift);
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.06, radius * 1.32, radius * 0.23, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(0.42);
      ctx.strokeStyle = 'rgba(32, 116, 102, 0.15)';
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.02, radius * 1.2, radius * 0.18, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawSphere(now) {
      var pulse = reducedMotion ? 0 : (Math.sin(now / 900) + 1) * 0.5;
      var ocean = ctx.createRadialGradient(
        centerX - radius * 0.34,
        centerY - radius * 0.44,
        radius * 0.08,
        centerX,
        centerY,
        radius
      );
      ocean.addColorStop(0, '#e6fbff');
      ocean.addColorStop(0.2, '#85d3df');
      ocean.addColorStop(0.56, '#236b79');
      ocean.addColorStop(1, '#102d36');

      ctx.save();
      ctx.shadowColor = 'rgba(27, 78, 86, 0.32)';
      ctx.shadowBlur = radius * 0.22;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = ocean;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      drawGraticule();
      drawCoastlines();

      var shade = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
      shade.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      shade.addColorStop(0.46, 'rgba(255, 255, 255, 0.02)');
      shade.addColorStop(1, 'rgba(0, 0, 0, 0.26)');
      ctx.fillStyle = shade;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 1.2 + pulse * 0.35;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(133, 211, 223, 0.16)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawGraticule() {
      ctx.save();
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';

      for (var lat = -60; lat <= 60; lat += 15) {
        var latitudeLine = [];
        for (var lon = -180; lon <= 180; lon += 4) {
          latitudeLine.push([lon, lat]);
        }
        drawProjectedLine(latitudeLine);
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      for (var meridian = -180; meridian < 180; meridian += 30) {
        var longitudeLine = [];
        for (var lineLat = -82; lineLat <= 82; lineLat += 4) {
          longitudeLine.push([meridian, lineLat]);
        }
        drawProjectedLine(longitudeLine);
      }
      ctx.restore();
    }

    function drawCoastlines() {
      ctx.save();
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = 'rgba(190, 225, 207, 0.68)';
      coastlines.forEach(function (line) {
        drawProjectedLine(line);
      });
      ctx.restore();
    }

    function drawProjectedLine(points) {
      var drawing = false;
      ctx.beginPath();
      points.forEach(function (point) {
        var projected = project(point[1], point[0]);
        if (projected.depth <= 0.025) {
          drawing = false;
          return;
        }
        if (!drawing) {
          ctx.moveTo(projected.x, projected.y);
          drawing = true;
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      });
      ctx.stroke();
    }

    function drawMarkers(points, now) {
      points.forEach(function (point, index) {
        if (point.depth <= 0.04) return;

        var pulse = reducedMotion ? 0 : (Math.sin(now / 420 + index * 1.9) + 1) * 0.5;
        ctx.save();
        ctx.globalAlpha = Math.min(1, 0.72 + point.depth * 0.28);
        ctx.fillStyle = 'rgba(227, 49, 49, 0.16)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10 + pulse * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e33131';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }

    function layoutCallouts(points) {
      var visible = [];
      points.forEach(function (point) {
        point.visible = point.depth > 0.04;
        point.callout = callouts[point.index];
        point.path = arrowPaths[point.index];
        point.calloutWidth = point.callout.offsetWidth || 180;
        point.calloutHeight = point.callout.offsetHeight || 44;
        point.side = point.x < centerX ? -1 : 1;
        point.targetY = point.y;
        if (point.visible) {
          visible.push(point);
        }
      });

      distribute(visible.filter(function (point) { return point.side < 0; }));
      distribute(visible.filter(function (point) { return point.side >= 0; }));

      points.forEach(function (point) {
        if (!point.visible) {
          point.callout.classList.remove('is-visible');
          point.path.style.opacity = '0';
          return;
        }

        point.callout.style.left = point.labelX + 'px';
        point.callout.style.top = point.labelY + 'px';
        point.callout.classList.add('is-visible');
        drawArrow(point);
      });
    }

    function distribute(items) {
      if (!items.length) return;
      var pad = width < 640 ? 12 : 20;
      var minY = pad;
      var maxY = height - pad;

      items.sort(function (a, b) {
        return a.targetY - b.targetY;
      });

      items.forEach(function (point) {
        var halfWidth = point.calloutWidth / 2;
        var baseX;
        if (point.side > 0) {
          baseX = centerX + radius + halfWidth + (width < 640 ? 10 : 30);
          point.labelX = Math.min(width - halfWidth - pad, baseX);
        } else {
          baseX = centerX - radius - halfWidth - (width < 640 ? 10 : 30);
          point.labelX = Math.max(halfWidth + pad, baseX);
        }
        point.labelY = clamp(point.targetY, minY + point.calloutHeight / 2, maxY - point.calloutHeight / 2);
      });

      for (var i = 1; i < items.length; i += 1) {
        var previous = items[i - 1];
        var current = items[i];
        var gap = previous.calloutHeight / 2 + current.calloutHeight / 2 + 10;
        if (current.labelY - previous.labelY < gap) {
          current.labelY = previous.labelY + gap;
        }
      }

      var last = items[items.length - 1];
      var overflow = last.labelY + last.calloutHeight / 2 - maxY;
      if (overflow > 0) {
        for (var j = items.length - 1; j >= 0; j -= 1) {
          items[j].labelY -= overflow;
        }
      }

      for (var k = items.length - 2; k >= 0; k -= 1) {
        var next = items[k + 1];
        var item = items[k];
        var reverseGap = item.calloutHeight / 2 + next.calloutHeight / 2 + 10;
        if (next.labelY - item.labelY < reverseGap) {
          item.labelY = next.labelY - reverseGap;
        }
      }
    }

    function drawArrow(point) {
      var halfWidth = point.calloutWidth / 2;
      var edgeX = point.labelX - point.side * (halfWidth + 4);
      var edgeY = point.labelY;
      var controlOneX = edgeX - point.side * 34;
      var controlTwoX = point.x + point.side * 24;
      var d = 'M ' + edgeX + ' ' + edgeY +
        ' C ' + controlOneX + ' ' + edgeY + ' ' +
        controlTwoX + ' ' + point.y + ' ' +
        point.x + ' ' + point.y;
      point.path.setAttribute('d', d);
      point.path.style.opacity = Math.min(0.96, 0.32 + point.depth * 0.68).toString();
    }

    function project(lat, lon) {
      var phi = toRadians(lat);
      var lambda = toRadians(lon);
      var phi0 = toRadians(globeState.lat);
      var lambda0 = toRadians(globeState.lon);
      var delta = lambda - lambda0;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var sinPhi0 = Math.sin(phi0);
      var cosPhi0 = Math.cos(phi0);
      var depth = sinPhi0 * sinPhi + cosPhi0 * cosPhi * Math.cos(delta);

      return {
        x: centerX + radius * cosPhi * Math.sin(delta),
        y: centerY - radius * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * Math.cos(delta)),
        depth: depth
      };
    }

    function toRadians(value) {
      return value * Math.PI / 180;
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function normalizeLon(value) {
      return ((value + 540) % 360) - 180;
    }

    function normalizeDelta(value) {
      return ((value + 540) % 360) - 180;
    }
  }

  // ----- Site Search -----

  var searchToggleBtn = document.getElementById('searchToggle');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInputEl = document.getElementById('searchInput');
  var searchResultsEl = document.getElementById('searchResults');
  var searchData = null;

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    setTimeout(function () { searchInputEl.focus(); }, 100);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    searchInputEl.value = '';
    searchResultsEl.innerHTML = '';
  }

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', openSearch);
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) {
      closeSearch();
    }
    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchOverlay && searchOverlay.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  });

  function loadSearchData(callback) {
    if (searchData) { callback(searchData); return; }
    fetch('/assets/search.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        searchData = data;
        callback(data);
      })
      .catch(function () {
        searchResultsEl.innerHTML = '<div class="search-no-results">Could not load search index.</div>';
      });
  }

  function renderResults(query, data) {
    if (!query) {
      searchResultsEl.innerHTML = '';
      return;
    }
    var q = query.toLowerCase();
    var matches = data.filter(function (item) {
      return item.title.toLowerCase().includes(q) ||
             item.content.toLowerCase().includes(q);
    });

    if (matches.length === 0) {
      searchResultsEl.innerHTML = '<div class="search-no-results">No results for "' + query + '"</div>';
      return;
    }

    searchResultsEl.innerHTML = matches.map(function (item) {
      var snippet = item.content.substring(0, 150).trim() + '...';
      return '<a href="' + item.url + '" class="search-result-item">' +
        '<div class="search-result-title">' + item.title + '</div>' +
        '<div class="search-result-snippet">' + snippet + '</div>' +
        '</a>';
    }).join('');
  }

  if (searchInputEl) {
    var debounceTimer;
    searchInputEl.addEventListener('input', function () {
      var query = this.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        loadSearchData(function (data) {
          renderResults(query, data);
        });
      }, 150);
    });
  }

})();
