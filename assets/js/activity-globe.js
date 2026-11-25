/*!
 * Activity globe — a premium orthographic "blue marble" rendered on canvas.
 *
 * Uses Natural Earth country geometry (vendored TopoJSON) projected through
 * d3-geo so coastlines and borders are smooth and clip cleanly at the limb.
 * Locations are annotated with on-globe bilingual place names and italic, dated
 * callout cards that are tethered to each marker with curved arrows.
 *
 * Loaded only on the Activities page. Depends on d3-array, d3-geo and
 * topojson-client (loaded just before this file). Degrades gracefully: if the
 * libraries or the world data fail to load, the panel simply stays decorative.
 */
(function () {
  'use strict';

  var root = document.getElementById('activityAtlas');
  if (!root) return;

  var canvas = root.querySelector('.activity-globe-canvas');
  var arrowsSvg = root.querySelector('.activity-globe-arrows');
  var labelsLayer = root.querySelector('.activity-globe-labels');
  var dataEl = document.getElementById('activityGlobeData');
  if (!canvas || !arrowsSvg || !labelsLayer || !dataEl) return;
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var locations;
  try {
    locations = JSON.parse(dataEl.textContent);
  } catch (error) {
    return;
  }
  if (!locations || !locations.length) return;

  var worldUrl = root.getAttribute('data-world');
  if (!worldUrl) return;

  fetch(worldUrl)
    .then(function (response) {
      if (!response.ok) throw new Error('world data ' + response.status);
      return response.json();
    })
    .then(function (world) {
      try {
        start(world);
      } catch (error) {
        /* leave the panel decorative on any rendering failure */
      }
    })
    .catch(function () {});

  function start(world) {
    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ----- Geography -----------------------------------------------------
    var countries = world.objects.countries;
    var sphere = { type: 'Sphere' };
    var graticule = d3.geoGraticule().step([20, 20])();
    var land = topojson.merge(world, countries.geometries);
    var coast = topojson.mesh(world, countries, function (a, b) { return a === b; });
    var borders = topojson.mesh(world, countries, function (a, b) { return a !== b; });

    var projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
    var path = d3.geoPath(projection, ctx);

    // ----- Layout state --------------------------------------------------
    var dpr = window.devicePixelRatio || 1;
    var width = 0;
    var height = 0;
    var centerX = 0;
    var centerY = 0;
    var radius = 0;
    // Narrow panels (phones) show one card at a time, under the globe. The
    // breakpoint lives in the stylesheet as --globe-layout.
    var compact = false;
    var oceanCache = null;

    // ----- Rotation state ------------------------------------------------
    // Open framed on the East-Asia cluster (Beijing / Seoul / Hong Kong), then
    // let the auto-tour carry on from there.
    var focusIndex = pickAsianFocus();
    var target = { lon: 116, lat: 30 };
    var view = reducedMotion
      ? { lon: target.lon, lat: target.lat }
      : { lon: 70, lat: 14 };
    var velLon = 0;
    var velLat = 0;
    var drag = null;
    var hovering = false;
    var lastInteraction = performance.now() - 3000;
    var lastFocus = performance.now() + 1400;
    // Compact layout: the card follows the tour until the reader drags.
    var followTour = true;
    var featuredIndex = -1;
    // Wide layout: the column each card was last shown in, and the cards that
    // were just put in place without sliding (see layoutAnnotations).
    var cardSides = [];
    var placing = [];
    // The spot each place name used in the last frame (-1: none).
    var labelSpots = [];

    // ----- Annotation DOM ------------------------------------------------
    var callouts = [];
    var places = [];
    var arrowPaths = [];

    locations.forEach(function (location, index) {
      var callout = document.createElement('div');
      callout.className = 'activity-globe-callout';
      var title = document.createElement('span');
      title.className = 'activity-globe-callout__title';
      title.textContent = location.title;
      callout.appendChild(title);
      // Optional Chinese title / date / city (title_zh, date_zh, city_zh).
      if (location.title_zh) {
        var titleZh = document.createElement('span');
        titleZh.className = 'activity-globe-callout__title-zh';
        titleZh.lang = 'zh-CN';
        titleZh.textContent = location.title_zh;
        callout.appendChild(titleZh);
      }
      if (location.date) {
        var date = document.createElement('span');
        date.className = 'activity-globe-callout__date';
        // Each language stays on one line; a narrow card breaks at the dot.
        var dateEn = document.createElement('span');
        dateEn.textContent = location.date;
        date.appendChild(dateEn);
        if (location.date_zh) {
          date.appendChild(document.createTextNode(' · '));
          var dateZh = document.createElement('span');
          dateZh.lang = 'zh-CN';
          dateZh.textContent = location.date_zh;
          date.appendChild(dateZh);
        }
        callout.appendChild(date);
      }
      labelsLayer.appendChild(callout);
      callouts[index] = callout;

      var place = document.createElement('span');
      place.className = 'activity-globe-place';
      place.textContent = location.city || location.title;
      if (location.city_zh) {
        var placeZh = document.createElement('span');
        placeZh.className = 'activity-globe-place__zh';
        placeZh.lang = 'zh-CN';
        placeZh.textContent = location.city_zh;
        place.appendChild(placeZh);
      }
      labelsLayer.appendChild(place);
      places[index] = place;
    });

    setupArrows();
    resize();

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(root);
    } else {
      window.addEventListener('resize', resize);
    }

    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerup', onPointerUp);
    root.addEventListener('pointercancel', onPointerUp);
    root.addEventListener('lostpointercapture', onPointerUp);
    root.addEventListener('pointerenter', function () { hovering = true; });
    root.addEventListener('pointerleave', function () {
      hovering = false;
      lastInteraction = performance.now();
    });

    requestAnimationFrame(render);

    // ----- Setup helpers -------------------------------------------------
    function pickAsianFocus() {
      for (var i = 0; i < locations.length; i += 1) {
        if (locations[i].lon > 90) return i;
      }
      return 0;
    }

    function targetLat(index) {
      return clamp(locations[index].lat * 0.74, -52, 56);
    }

    function setupArrows() {
      var ns = 'http://www.w3.org/2000/svg';
      arrowsSvg.textContent = '';

      var defs = document.createElementNS(ns, 'defs');
      var marker = document.createElementNS(ns, 'marker');
      marker.setAttribute('id', 'activityArrowHead');
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6.5');
      marker.setAttribute('markerHeight', '6.5');
      marker.setAttribute('orient', 'auto-start-reverse');
      var head = document.createElementNS(ns, 'path');
      head.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      head.setAttribute('fill', '#8a1538');
      marker.appendChild(head);
      defs.appendChild(marker);
      arrowsSvg.appendChild(defs);

      locations.forEach(function () {
        var p = document.createElementNS(ns, 'path');
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', '#8a1538');
        p.setAttribute('stroke-width', '1.5');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('marker-end', 'url(#activityArrowHead)');
        p.style.opacity = '0';
        arrowsSvg.appendChild(p);
        arrowPaths.push(p);
      });
    }

    function resize() {
      var rect = root.getBoundingClientRect();
      width = Math.max(240, Math.round(rect.width));
      height = Math.max(380, Math.round(rect.height));
      dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      arrowsSvg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      compact = window.getComputedStyle(root).getPropertyValue('--globe-layout').trim() === 'compact';
      centerX = width / 2;
      if (compact) {
        // Globe at the top; the lower part of the panel holds the card.
        radius = Math.min(width * 0.36, (height - 190) / 2.32);
        centerY = radius * 1.16 + 16;
      } else {
        centerY = height * (width < 640 ? 0.46 : 0.52);
        radius = Math.min(
          width * (width < 640 ? 0.34 : 0.33),
          height * (width < 640 ? 0.3 : 0.4)
        );
      }

      projection.scale(radius).translate([centerX, centerY]);
      oceanCache = null;
    }

    // ----- Pointer / inertia --------------------------------------------
    function onPointerDown(event) {
      followTour = false;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        lon: view.lon,
        lat: view.lat,
        prevLon: view.lon,
        prevLat: view.lat
      };
      velLon = 0;
      velLat = 0;
      lastInteraction = performance.now();
      root.classList.add('is-dragging');
      if (root.setPointerCapture) root.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event) {
      if (!drag || event.pointerId !== drag.id) return;
      event.preventDefault();
      var dx = event.clientX - drag.x;
      var dy = event.clientY - drag.y;
      var speed = 0.36 * (radius ? 240 / radius : 1);
      view.lon = normalizeLon(drag.lon - dx * speed);
      view.lat = clamp(drag.lat + dy * speed * 0.62, -78, 78);
      target.lon = view.lon;
      target.lat = view.lat;
      velLon = shortestLon(drag.prevLon, view.lon) * 0.6;
      velLat = (view.lat - drag.prevLat) * 0.6;
      drag.prevLon = view.lon;
      drag.prevLat = view.lat;
      lastInteraction = performance.now();
    }

    function onPointerUp(event) {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      root.classList.remove('is-dragging');
      if (root.releasePointerCapture) {
        try { root.releasePointerCapture(event.pointerId); } catch (e) {}
      }
      lastInteraction = performance.now();
    }

    // ----- Frame loop ----------------------------------------------------
    function render(now) {
      step(now);
      projection.rotate([-view.lon, -view.lat]);

      ctx.clearRect(0, 0, width, height);
      drawGlobe(now);

      var points = locations.map(function (location, index) {
        var p = project(location.lat, location.lon);
        p.index = index;
        p.location = location;
        return p;
      });

      drawMarkers(points, now);
      layoutAnnotations(points);
      requestAnimationFrame(render);
    }

    function step(now) {
      if (drag) return;

      var idle = now - lastInteraction;
      var settled = Math.abs(velLon) < 0.0025 && Math.abs(velLat) < 0.0025;

      // Auto-tour: once settled and idle, glide to the next location.
      if (!reducedMotion && !hovering && settled && idle > 1400 &&
          now - lastFocus > 4800) {
        focusIndex = (focusIndex + 1) % locations.length;
        target.lon = locations[focusIndex].lon;
        target.lat = targetLat(focusIndex);
        lastFocus = now;
        followTour = true;
      }

      if (!settled) {
        view.lon = normalizeLon(view.lon + velLon);
        view.lat = clamp(view.lat + velLat, -78, 78);
        target.lon = view.lon;
        target.lat = view.lat;
        velLon *= 0.93;
        velLat *= 0.93;
      } else {
        view.lon = normalizeLon(view.lon + shortestLon(view.lon, target.lon) * 0.046);
        view.lat += (target.lat - view.lat) * 0.046;
      }
    }

    // ----- Drawing -------------------------------------------------------
    function drawGlobe(now) {
      // Soft atmospheric halo behind the disc.
      var halo = ctx.createRadialGradient(
        centerX, centerY, radius * 0.92,
        centerX, centerY, radius * 1.16
      );
      halo.addColorStop(0, 'rgba(138, 21, 56, 0.32)');
      halo.addColorStop(1, 'rgba(138, 21, 56, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.16, 0, Math.PI * 2);
      ctx.fill();

      // Ocean sphere — a luminous deep-blue marble lit from the upper-left.
      if (!oceanCache) {
        oceanCache = ctx.createRadialGradient(
          centerX - radius * 0.36, centerY - radius * 0.42, radius * 0.08,
          centerX, centerY, radius
        );
        oceanCache.addColorStop(0, '#7fc4e8');
        oceanCache.addColorStop(0.32, '#3f8fcb');
        oceanCache.addColorStop(0.7, '#1c548c');
        oceanCache.addColorStop(1, '#0a2547');
      }
      ctx.save();
      ctx.shadowColor = 'rgba(42, 29, 32, 0.4)';
      ctx.shadowBlur = radius * 0.18;
      ctx.shadowOffsetY = radius * 0.05;
      ctx.beginPath();
      path(sphere);
      ctx.fillStyle = oceanCache;
      ctx.fill();
      ctx.restore();

      // Clip everything else to the disc.
      ctx.save();
      ctx.beginPath();
      path(sphere);
      ctx.clip();

      // Graticule — faint structural lattice.
      ctx.beginPath();
      path(graticule);
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(226, 244, 255, 0.16)';
      ctx.stroke();

      // Continents — a muted teal-green so land reads clearly on blue ocean.
      ctx.beginPath();
      path(land);
      var landFill = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius);
      landFill.addColorStop(0, '#7bbaa3');
      landFill.addColorStop(0.55, '#4f9a86');
      landFill.addColorStop(1, '#2f6f63');
      ctx.fillStyle = landFill;
      ctx.fill();

      // Country borders — delicate seams within the land.
      ctx.beginPath();
      path(borders);
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
      ctx.stroke();

      // Crisp bright coastline.
      ctx.beginPath();
      path(coast);
      ctx.lineWidth = 0.95;
      ctx.strokeStyle = 'rgba(245, 252, 255, 0.78)';
      ctx.stroke();

      // Directional shading for a rounded, 3-D feel.
      var shade = ctx.createLinearGradient(
        centerX - radius, centerY - radius,
        centerX + radius, centerY + radius
      );
      shade.addColorStop(0, 'rgba(255, 255, 255, 0.26)');
      shade.addColorStop(0.45, 'rgba(255, 255, 255, 0.02)');
      shade.addColorStop(1, 'rgba(42, 29, 32, 0.34)');
      ctx.fillStyle = shade;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      // Upper-left specular sheen.
      var sheen = ctx.createRadialGradient(
        centerX - radius * 0.34, centerY - radius * 0.4, radius * 0.02,
        centerX - radius * 0.34, centerY - radius * 0.4, radius * 0.78
      );
      sheen.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      sheen.addColorStop(0.4, 'rgba(255, 255, 255, 0.06)');
      sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      ctx.restore();

      // Rim light.
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 0.5, 0, Math.PI * 2);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = 'rgba(243, 220, 225, 0.55)';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 3.5, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(138, 21, 56, 0.12)';
      ctx.stroke();
      ctx.restore();
    }

    function drawMarkers(points, now) {
      points.forEach(function (point, index) {
        if (!point.visible || point.depth <= 0.05) return;
        var pulse = reducedMotion ? 0.4 : (Math.sin(now / 460 + index * 1.7) + 1) * 0.5;
        ctx.save();
        ctx.globalAlpha = Math.min(1, 0.55 + point.depth * 0.45);
        ctx.fillStyle = 'rgba(138, 21, 56, 0.18)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 9 + pulse * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#8a1538';
        ctx.strokeStyle = 'rgba(255, 250, 250, 0.95)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }

    // ----- Annotation layout (place names + callouts + arrows) -----------
    function layoutAnnotations(points) {
      placing.forEach(function (el) { el.classList.remove('is-placing'); });
      placing = [];

      var visible = [];
      points.forEach(function (point) {
        point.visible = point.visible && point.depth > 0.05;
        point.callout = callouts[point.index];
        point.place = places[point.index];
        point.path = arrowPaths[point.index];
        point.calloutWidth = point.callout.offsetWidth || 180;
        point.calloutHeight = point.callout.offsetHeight || 48;
        point.side = point.x < centerX ? -1 : 1;
        // A marker near the middle keeps its card where it was, so the card
        // doesn't swap columns back and forth.
        if (cardSides[point.index] && Math.abs(point.x - centerX) < radius * 0.12) {
          point.side = cardSides[point.index];
        }
        point.targetY = point.y;
        if (point.visible) visible.push(point);
      });

      var shown = visible;
      if (compact) {
        var featured = pickFeatured(visible);
        shown = featured ? [featured] : [];
        if (featured) placeBelow(featured);
      } else {
        balanceSides(visible);
        distribute(visible.filter(function (p) { return p.side < 0; }));
        distribute(visible.filter(function (p) { return p.side >= 0; }));
      }

      placeLabels(shown, visible, compact);

      points.forEach(function (point) {
        if (shown.indexOf(point) < 0) {
          point.callout.classList.remove('is-visible');
          point.place.classList.remove('is-visible');
          // The label's opacity is set inline while shown, so clear it too.
          point.place.style.opacity = '0';
          point.path.style.opacity = '0';
          return;
        }

        // On-globe bilingual place name beside the marker.
        if (point.labelSpot) {
          point.place.style.left = r1(point.labelSpot.x) + 'px';
          point.place.style.top = r1(point.labelSpot.y) + 'px';
          point.place.classList.add('is-visible');
          point.place.style.opacity = Math.min(1, 0.25 + point.depth).toString();
        } else {
          point.place.classList.remove('is-visible');
          point.place.style.opacity = '0';
        }

        // Tethered callout card.
        point.callout.style.left = point.labelX + 'px';
        point.callout.style.top = point.labelY + 'px';
        // A card that appears or changes columns fades in at its new place
        // instead of sliding across the globe.
        var changedSide = !compact && cardSides[point.index] !== point.side;
        if (!point.callout.classList.contains('is-visible') || changedSide) {
          point.callout.classList.add('is-placing');
          placing.push(point.callout);
        }
        cardSides[point.index] = point.side;
        point.callout.classList.add('is-visible');
        drawArrow(point);
      });
    }

    // Place names sit above their marker, or beside / below / diagonally off
    // it when that spot would cover another name, a marker or a card. With no free spot a name
    // is left out (its card still says where), unless it is the only one
    // shown. A city shared by two events is named once. Earlier locations in
    // the list choose first, and a name keeps its spot until that spot is
    // clearly covered, so names don't hop or flicker as the globe turns.
    function placeLabels(items, visible, alwaysShow) {
      var taken = visible.map(function (p) {
        return { left: p.x - 7, top: p.y - 7, right: p.x + 7, bottom: p.y + 7, owner: p };
      });
      items.forEach(function (p) {
        taken.push({
          left: p.labelX - p.calloutWidth / 2,
          top: p.labelY - p.calloutHeight / 2,
          right: p.labelX + p.calloutWidth / 2,
          bottom: p.labelY + p.calloutHeight / 2
        });
      });
      var named = {};
      items.slice().sort(function (a, b) { return a.index - b.index; }).forEach(function (point) {
        point.labelSpot = null;
        var last = labelSpots[point.index];
        labelSpots[point.index] = -1;
        var key = point.location.lat + ',' + point.location.lon;
        if (named[key]) return;
        var w = point.place.offsetWidth;
        var h = point.place.offsetHeight;
        // Above, right, left, the four diagonals, then below.
        var spots = [
          { x: point.x - w / 2, y: point.y - 14 - h },
          { x: point.x + 12, y: point.y - h / 2 },
          { x: point.x - 12 - w, y: point.y - h / 2 },
          { x: point.x + 6, y: point.y - 6 - h },
          { x: point.x - 6 - w, y: point.y - 6 - h },
          { x: point.x + 6, y: point.y + 6 },
          { x: point.x - 6 - w, y: point.y + 6 },
          { x: point.x - w / 2, y: point.y + 12 }
        ];
        // Above when it is free, else wherever the name already is, else the
        // first free spot in the list.
        var order = [0, 1, 2, 3, 4, 5, 6, 7];
        if (last > 0) order = [0, last].concat(order.filter(function (k) { return k !== 0 && k !== last; }));
        var fallback = null;
        for (var i = 0; i < order.length; i += 1) {
          var spot = spots[order[i]];
          var box = {
            left: spot.x - 2,
            top: spot.y - 1,
            right: spot.x + w + 2,
            bottom: spot.y + h + 1
          };
          if (box.left < 0 || box.top < 0 || box.right > width || box.bottom > height) continue;
          if (!fallback) fallback = spot;
          // The current spot only counts as covered past a few pixels, and a
          // name only moves back above once there is a little room to spare.
          var slack = 0;
          if (order[i] === last) slack = 4;
          else if (order[i] === 0 && last > 0) slack = -4;
          var probe = {
            left: box.left + slack,
            top: box.top + slack,
            right: box.right - slack,
            bottom: box.bottom - slack
          };
          if (taken.some(function (t) { return t.owner !== point && overlaps(t, probe); })) continue;
          taken.push(box);
          point.labelSpot = spot;
          labelSpots[point.index] = order[i];
          named[key] = true;
          return;
        }
        if (alwaysShow) point.labelSpot = fallback;
      });
    }

    function overlaps(a, b) {
      return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    }

    // Compact layout: the tour's current stop while the tour runs, otherwise
    // the marker nearest the middle of the globe.
    function pickFeatured(visible) {
      var focus = null;
      var current = null;
      var nearest = null;
      visible.forEach(function (point) {
        if (point.index === focusIndex) focus = point;
        if (point.index === featuredIndex) current = point;
        if (!nearest || point.depth > nearest.depth) nearest = point;
      });
      var pick = nearest;
      if (followTour && focus) {
        pick = focus;
      } else if (current && nearest && nearest.depth - current.depth < 0.02) {
        // Keep the current card until another marker is clearly nearer, so
        // it doesn't flicker between neighbouring cities.
        pick = current;
      }
      featuredIndex = pick ? pick.index : -1;
      return pick;
    }

    // Compact layout: centre the card under the globe, clear of the hint.
    function placeBelow(point) {
      var hint = root.querySelector('.activity-globe-hint');
      var floor = hint ? hint.offsetTop - 10 : height - 16;
      var top = Math.min(centerY + radius * 1.16 + 12, floor - point.calloutHeight);
      point.labelX = centerX;
      point.labelY = Math.max(8, top) + point.calloutHeight / 2;
    }

    // Wide layout: when one column holds more cards than the panel can fit,
    // move the cards whose markers sit nearest the other side across.
    function balanceSides(items) {
      var room = height - 2 * (width < 640 ? 12 : 22);
      function columnHeight(side) {
        var total = 0;
        var count = 0;
        items.forEach(function (p) {
          if (p.side === side) {
            total += p.calloutHeight;
            count += 1;
          }
        });
        return total + Math.max(0, count - 1) * 12;
      }
      for (var guard = 0; guard < items.length; guard += 1) {
        var left = columnHeight(-1);
        var right = columnHeight(1);
        var from = 0;
        if (left > room && left > right) from = -1;
        else if (right > room && right > left) from = 1;
        if (!from) return;
        var mover = null;
        items.forEach(function (p) {
          if (p.side === from && (!mover || from * (p.x - mover.x) < 0)) mover = p;
        });
        if (!mover || columnHeight(-from) + mover.calloutHeight + 12 >= Math.max(left, right)) return;
        mover.side = -from;
      }
    }

    function distribute(items) {
      if (!items.length) return;
      var pad = width < 640 ? 12 : 22;
      var minY = pad;
      var maxY = height - pad;

      items.sort(function (a, b) { return a.targetY - b.targetY; });

      items.forEach(function (point) {
        var half = point.calloutWidth / 2;
        var gap = width < 640 ? 12 : 34;
        if (point.side > 0) {
          point.labelX = Math.min(width - half - pad, centerX + radius + half + gap);
        } else {
          point.labelX = Math.max(half + pad, centerX - radius - half - gap);
        }
        point.labelY = clamp(point.targetY, minY + point.calloutHeight / 2, maxY - point.calloutHeight / 2);
      });

      for (var i = 1; i < items.length; i += 1) {
        var prev = items[i - 1];
        var cur = items[i];
        var need = prev.calloutHeight / 2 + cur.calloutHeight / 2 + 12;
        if (cur.labelY - prev.labelY < need) cur.labelY = prev.labelY + need;
      }

      var last = items[items.length - 1];
      var overflow = last.labelY + last.calloutHeight / 2 - maxY;
      if (overflow > 0) {
        for (var j = items.length - 1; j >= 0; j -= 1) items[j].labelY -= overflow;
      }

      for (var k = items.length - 2; k >= 0; k -= 1) {
        var next = items[k + 1];
        var item = items[k];
        var rev = item.calloutHeight / 2 + next.calloutHeight / 2 + 12;
        if (next.labelY - item.labelY < rev) item.labelY = next.labelY - rev;
      }
    }

    function drawArrow(point) {
      var half = point.calloutWidth / 2;
      var d;
      if (compact) {
        // From the top edge of the card up to the marker.
        var startX = clamp(point.x, point.labelX - half + 16, point.labelX + half - 16);
        var startY = point.labelY - point.calloutHeight / 2 - 5;
        var bend = clamp((startY - point.y) * 0.45, 12, 34);
        d = 'M ' + r1(startX) + ' ' + r1(startY) +
          ' C ' + r1(startX) + ' ' + r1(startY - bend) + ' ' +
          r1(point.x) + ' ' + r1(point.y + bend) + ' ' +
          r1(point.x) + ' ' + r1(point.y);
      } else {
        var edgeX = point.labelX - point.side * (half + 5);
        var edgeY = point.labelY;
        var c1x = edgeX - point.side * 38;
        var c2x = point.x + point.side * 26;
        d = 'M ' + r1(edgeX) + ' ' + r1(edgeY) +
          ' C ' + r1(c1x) + ' ' + r1(edgeY) + ' ' +
          r1(c2x) + ' ' + r1(point.y) + ' ' +
          r1(point.x) + ' ' + r1(point.y);
      }
      point.path.setAttribute('d', d);
      point.path.style.opacity = Math.min(0.95, 0.35 + point.depth * 0.6).toString();
    }

    // ----- Math ----------------------------------------------------------
    function project(lat, lon) {
      var xy = projection([lon, lat]);
      if (!xy) return { visible: false, depth: 0, x: 0, y: 0 };
      var dist = d3.geoDistance([lon, lat], [view.lon, view.lat]);
      return { visible: true, x: xy[0], y: xy[1], depth: Math.cos(dist) };
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function normalizeLon(value) {
      return ((value + 540) % 360) - 180;
    }

    function shortestLon(from, to) {
      return ((to - from + 540) % 360) - 180;
    }

    function r1(value) {
      return Math.round(value * 10) / 10;
    }
  }
})();
