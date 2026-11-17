/* =============================================================================
   深蓝来信 · 交互逻辑
   所有内容来自 config.js。画布场景与音效均为本地生成，不依赖任何外部资源。
   ========================================================================== */

(function () {
  'use strict';

  const C = window.SITE_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const reduceMotion = !!(C.motion && C.motion.respectReducedMotion &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  function rgb(hex) {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  }
  function mix(a, b, t) {
    const x = rgb(a), y = rgb(b);
    return `rgb(${Math.round(lerp(x[0], y[0], t))},${Math.round(lerp(x[1], y[1], t))},${Math.round(lerp(x[2], y[2], t))})`;
  }
  function fitCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const o = { ctx, w: 0, h: 0, dpr: 1 };
    function resize() {
      const r = canvas.getBoundingClientRect();
      o.dpr = Math.min(window.devicePixelRatio || 1, 2);
      o.w = Math.max(1, r.width); o.h = Math.max(1, r.height);
      canvas.width = Math.round(o.w * o.dpr); canvas.height = Math.round(o.h * o.dpr);
      ctx.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    o.resize = resize;
    return o;
  }
  function makeParticles(n, w, h) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 1 + Math.random() * 3.2, v: 8 + Math.random() * 34,
      ph: Math.random() * Math.PI * 2, a: .12 + Math.random() * .4
    }));
  }
  function revealInView() {
    document.querySelectorAll('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * .96 && r.bottom > 0) el.classList.add('is-visible');
    });
  }
  function gotoHash() {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) setTimeout(() => {
      const root = document.documentElement;
      const prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
      root.style.scrollBehavior = prev;
      setTimeout(revealInView, 220);
    }, 90);
  }
  function drawBubbles(ctx, w, h, parts, dt, tint) {
    for (const p of parts) {
      p.y -= p.v * dt;
      p.x += Math.sin(p.ph + p.y * .012) * 8 * dt;
      if (p.y < -12) { p.y = h + 12; p.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${tint || '207,247,242'},${p.a})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x - p.r * .3, p.y - p.r * .3, Math.max(.5, p.r * .22), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a * .8})`;
      ctx.fill();
    }
  }

  /* ---------------------- 配置注入 ---------------------- */
  function applyConfig() {
    const root = document.documentElement;
    const t = C.theme || {}, m = C.motion || {};
    const vars = {
      '--deep': t.colors && t.colors.deep, '--ocean': t.colors && t.colors.ocean,
      '--aqua': t.colors && t.colors.aqua, '--sand': t.colors && t.colors.sand,
      '--ink': t.colors && t.colors.ink, '--mute': t.colors && t.colors.mute,
      '--accent': t.accent, '--display': t.fonts && t.fonts.display,
      '--body': t.fonts && t.fonts.body, '--mono': t.fonts && t.fonts.mono,
      '--maxw': t.maxWidth ? t.maxWidth + 'px' : null,
      '--dive': C.hero && C.hero.diveDuration ? C.hero.diveDuration + 'ms' : null,
      '--flip': C.gallery && C.gallery.flipDuration ? C.gallery.flipDuration + 'ms' : null,
      '--section': m.sectionDuration ? m.sectionDuration + 'ms' : null,
      '--ease': m.sectionEase,
      '--row1': C.gallery && C.gallery.rowDuration ? C.gallery.rowDuration[0] + 's' : null,
      '--row2': C.gallery && C.gallery.rowDuration ? C.gallery.rowDuration[1] + 's' : null,
      '--cardw': C.gallery && C.gallery.cardWidth ? C.gallery.cardWidth + 'px' : null,
      '--video-ratio': C.video && C.video.videoRatio ? C.video.videoRatio + '%' : null
    };
    Object.keys(vars).forEach(k => { if (vars[k]) root.style.setProperty(k, vars[k]); });

    const set = (id, val) => { const el = $(id); if (el && val != null) el.textContent = val; };
    const src = (id, val) => { const el = $(id); if (el && val) el.src = val; };

    const I = C.intro || {}, H = C.hero || {}, G = C.gallery || {}, V = C.video || {}, D = C.danmaku || {}, K = C.contact || {};
    set('introSkipText', I.skipText); set('introHint', I.hint);
    set('heroEyebrow', H.eyebrow); set('heroTitle', H.title); set('heroSub', H.subtitle);
    set('heroScrollHint', H.scrollHint); set('heroMeta', 'ANNIVERSARY  ·  ONE YEAR TOGETHER');
    src('heroSurface', H.surfaceImage); src('heroDeep', H.underwaterImage);
    set('galleryEyebrow', G.eyebrow); set('galleryTitle', G.title); set('gallerySub', G.subtitle);
    set('focusCloseText', G.closeText); set('focusHint', G.flipHint);
    set('videoEyebrow', V.eyebrow); set('videoTitle', V.title); set('videoDesc', V.description);
    set('playLabel', V.playText);
    set('pickerLabel', V.pickerLabel); set('pickerHint', V.pickerHint);
    set('danmakuEyebrow', D.eyebrow); set('danmakuTitle', D.title); set('danmakuSub', D.subtitle);
    set('danmakuSendText', D.inputButtonText);
    if ($('danmakuInput') && D.inputPlaceholder) $('danmakuInput').placeholder = D.inputPlaceholder;
    set('contactEyebrow', K.eyebrow); set('contactTitle', K.title); set('contactDesc', K.description);
    set('mailText', K.email); set('contactButtonText', K.buttonText); set('siteFooter', K.footer);
    if ($('mailLink') && K.email) $('mailLink').href = 'mailto:' + K.email;
    if ($('focus') && G.focusBlur != null) $('focus').style.setProperty('--blur', G.focusBlur + 'px');

    const vItems = V.items || [];
    if (vItems.length && $('realVideo') && $('pickerList')) {
      const picker = $('pickerList');
      picker.innerHTML = '';
      vItems.forEach((item, i) => {
        const btn = document.createElement('button');
        btn.className = 'picker-item' + (i === 0 ? ' is-active' : '');
        btn.type = 'button'; btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.dataset.index = i;
        btn.innerHTML = `<span class="picker-thumb"><img src="${item.poster}" alt="${(item.title || '').replace(/"/g, '')}" loading="lazy"></span>
          <span class="picker-index">${String(i + 1).padStart(2, '0')}</span>
          <span class="picker-name">${item.title || ''}</span>`;
        picker.appendChild(btn);
      });
      $('realVideo').src = vItems[0].src;
      src('videoPoster', vItems[0].poster);
      $('videoShell').classList.add('has-video');
      set('uiIndex', '01 / ' + String(vItems.length).padStart(2, '0'));
      set('uiTitle', vItems[0].title); set('uiTag', vItems[0].tag);
    }
    if (m.waveDivider === false) document.querySelectorAll('[data-wave]').forEach(el => el.style.display = 'none');
    if (!D.allowInput && $('danmakuForm')) $('danmakuForm').style.display = 'none';
  }

  /* ---------------------- 开场动画 ---------------------- */
  function initIntro(done) {
    const intro = $('intro'), I = C.intro || {};
    if (!I.enabled || (I.showOncePerSession && sessionStorage.getItem('deep-intro-seen') === '1')) {
      intro.remove(); document.body.classList.remove('is-locked'); done && done(); gotoHash(); return;
    }

    if (I.src) {
      const video = $('introVideo'), skip = $('introSkip');
      let ended = false, guard = 0;
      const end = () => {
        if (ended) return; ended = true;
        clearTimeout(guard);
        try { video.pause(); } catch (e) {}
        if (I.showOncePerSession) { try { sessionStorage.setItem('deep-intro-seen', '1'); } catch (e) {} }
        intro.classList.add('is-out');
        document.body.classList.remove('is-locked');
        gotoHash();
        setTimeout(() => { intro.remove(); done && done(); }, 950);
      };
      video.src = I.src;
      video.classList.add('is-active');
      video.play().catch(() => {});
      video.addEventListener('ended', end);
      video.addEventListener('error', end);
      video.addEventListener('loadedmetadata', () => {
        const max = I.maxPlayMs || 6000;
        const total = isFinite(video.duration) ? video.duration * 1000 : (I.duration || 6500);
        clearTimeout(guard);
        guard = setTimeout(end, Math.min(total, max) + 300);
      });
      guard = setTimeout(end, (I.maxPlayMs || 6000) + 500);
      setTimeout(() => skip && skip.classList.add('is-ready'), I.skipDelay || 900);
      skip && skip.addEventListener('click', e => { e.stopPropagation(); end(); });
      intro.addEventListener('click', end);
      return;
    }

    const cv = $('introCanvas'), view = fitCanvas(cv), parts = makeParticles(70, view.w, view.h);
    const duration = I.duration || 6500;
    let start = 0, raf = 0, finished = false, last = 0;

    function render(ts) {
      if (!start) start = ts;
      const elapsed = ts - start, p = clamp(elapsed / duration, 0, 1);
      const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts;
      const t = elapsed / 1000;
      const { ctx, w, h } = view;
      ctx.clearRect(0, 0, w, h);

      const dive = smooth(clamp((p - .1) / .62, 0, 1));
      const under = smooth(clamp((p - .38) / .5, 0, 1));
      const horizon = h * .5 - dive * h * 1.12;

      if (horizon > 0) {
        const sky = ctx.createLinearGradient(0, 0, 0, horizon);
        sky.addColorStop(0, mix('#031725', '#021820', under));
        sky.addColorStop(1, mix('#e0b98b', '#0b556c', under));
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, horizon);
      }
      const top = Math.max(0, horizon);
      const sea = ctx.createLinearGradient(0, top, 0, h);
      sea.addColorStop(0, mix('#2e6c7e', '#1b94a6', under));
      sea.addColorStop(1, mix('#021522', '#01131f', under));
      ctx.fillStyle = sea; ctx.fillRect(0, top, w, h - top);

      if (horizon > 10 && under < .95) {
        const glow = ctx.createRadialGradient(w / 2, horizon, 0, w / 2, horizon, h * .46);
        glow.addColorStop(0, `rgba(255,225,180,${.85 * (1 - under)})`);
        glow.addColorStop(.4, `rgba(255,200,150,${.28 * (1 - under)})`);
        glow.addColorStop(1, 'rgba(255,200,150,0)');
        ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
        ctx.beginPath(); ctx.arc(w / 2, horizon, 30 * (1 - under * .5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,238,205,${.9 * (1 - under)})`; ctx.fill();
      }

      if (horizon < h) {
        for (let i = 0; i < 6; i++) {
          const y = horizon + (i + 1) * h * .105;
          if (y < 0 || y > h + 20) continue;
          ctx.beginPath(); ctx.moveTo(0, y);
          const amp = 6 + i * 3, speed = .7 + i * .18;
          for (let x = 0; x <= w; x += 18) {
            ctx.lineTo(x, y + Math.sin(x * .012 + t * speed + i) * amp);
          }
          ctx.strokeStyle = `rgba(190,235,235,${.18 - i * .018})`;
          ctx.lineWidth = 1.4; ctx.stroke();
        }
      }

      if (under > .02) {
        ctx.save(); ctx.globalAlpha = under * .7;
        for (let i = 0; i < 5; i++) {
          const x = w * (i + .6) / 5 + Math.sin(t * .3 + i) * w * .04;
          ctx.beginPath(); ctx.moveTo(x - w * .04, 0); ctx.lineTo(x + w * .04, 0);
          ctx.lineTo(x + w * .16, h); ctx.lineTo(x + w * .03, h); ctx.closePath();
          const ray = ctx.createLinearGradient(0, 0, 0, h);
          ray.addColorStop(0, 'rgba(210,250,255,.16)'); ray.addColorStop(1, 'rgba(210,250,255,0)');
          ctx.fillStyle = ray; ctx.fill();
        }
        ctx.restore();
        drawBubbles(ctx, w, h, parts, dt * (0.5 + under));
      }

      const fade = clamp((p - .9) / .1, 0, 1);
      if (fade > 0) { ctx.fillStyle = `rgba(3,23,37,${fade})`; ctx.fillRect(0, 0, w, h); }

      if (!finished) raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    const skip = $('introSkip');
    setTimeout(() => skip && skip.classList.add('is-ready'), I.skipDelay || 900);
    const finish = () => {
      if (finished) return; finished = true;
      cancelAnimationFrame(raf);
      if (I.showOncePerSession) { try { sessionStorage.setItem('deep-intro-seen', '1'); } catch (e) {} }
      intro.classList.add('is-out');
      document.body.classList.remove('is-locked');
      gotoHash();
      setTimeout(() => { intro.remove(); done && done(); }, 950);
    };
    skip && skip.addEventListener('click', e => { e.stopPropagation(); finish(); });
    intro.addEventListener('click', finish);
    setTimeout(finish, duration + 120);
  }

  /* ---------------------- 海报下潜 ---------------------- */
  function initHero() {
    const H = C.hero || {}, hero = $('hero'), bubbles = $('heroBubbles');
    const view = fitCanvas(bubbles);
    const parts = makeParticles(H.bubbles || 46, view.w, view.h);
    let running = false, last = 0, raf = 0;

    function loop(ts) {
      if (!running) return;
      const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts;
      view.ctx.clearRect(0, 0, view.w, view.h);
      drawBubbles(view.ctx, view.w, view.h, parts, dt);
      raf = requestAnimationFrame(loop);
    }
    function setDeep(on) {
      hero.classList.toggle('is-deep', on);
      if (reduceMotion) return;
      if (on && !running) { running = true; last = 0; raf = requestAnimationFrame(loop); }
      if (!on && running) { running = false; cancelAnimationFrame(raf); view.ctx.clearRect(0, 0, view.w, view.h); }
    }
    if (H.trigger === 'click' || coarse) {
      hero.addEventListener('click', () => setDeep(!hero.classList.contains('is-deep')));
    } else {
      hero.addEventListener('mouseenter', () => setDeep(true));
      hero.addEventListener('mouseleave', () => { if (H.reverseOnLeave !== false) setTimeout(() => setDeep(false), 220); });
    }
    setTimeout(() => { const el = document.querySelector('.hero-content'); if (el) el.classList.add('is-ready'); }, 2600);
  }

  /* ---------------------- 图片展示 ---------------------- */
  function initGallery() {
    const G = C.gallery || {}, items = G.items || [];
    const top = $('trackTop'), bottom = $('trackBottom');
    function card(item, index, order) {
      const el = document.createElement('figure');
      el.className = 'gallery-card'; el.tabIndex = 0; el.setAttribute('role', 'button');
      el.setAttribute('aria-label', item.title || ('照片 ' + (index + 1)));
      el.innerHTML = `<img src="${item.image}" alt="${(item.title || '').replace(/"/g, '')}" loading="lazy">
        <span class="card-no">${String(order + 1).padStart(2, '0')}</span>
        <span class="card-label">${item.tag || ''}</span>`;
      el.addEventListener('click', () => open(item, el));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item, el); } });
      return el;
    }
    const even = [], odd = [];
    items.forEach((it, i) => (i % 2 === 0 ? even : odd).push(it));
    function fill(track, arr, offset) {
      for (let rep = 0; rep < 2; rep++) arr.forEach((it, i) => {
        const realIdx = items.indexOf(it);
        track.appendChild(card(it, realIdx, offset + i));
      });
    }
    fill(top, even, 0); fill(bottom, odd, even.length);

    const focus = $('focus'), stage = document.querySelector('.focus-stage'),
      flipCard = $('focusCard'), shade = $('focusShade'), closeBtn = $('focusClose');
    let opener = null, openFlag = false;

    function open(item, el) {
      opener = el;
      $('focusImg').src = item.image;
      $('focusImg').alt = item.title || '';
      $('focusTag').textContent = item.tag || '';
      $('focusTitle').textContent = item.title || '';
      $('focusText').textContent = item.text || '';
      $('focusHint').textContent = G.flipHint || '';
      flipCard.classList.remove('is-flipped');

      const r = el.getBoundingClientRect();
      const sw = stage.offsetWidth || Math.min(window.innerWidth * .78, 880);
      const sh = stage.offsetHeight || sw * .7;
      const dx = (r.left + r.width / 2) - (window.innerWidth / 2);
      const dy = (r.top + r.height / 2) - (window.innerHeight / 2);
      const sc = clamp(r.width / sw, .12, 1);
      stage.style.setProperty('--fx', dx + 'px');
      stage.style.setProperty('--fy', dy + 'px');
      stage.style.setProperty('--fs', sc);
      focus.setAttribute('aria-hidden', 'false');
      void stage.offsetWidth;
      openFlag = true;
      requestAnimationFrame(() => focus.classList.add('is-open'));
      top.classList.add('paused'); bottom.classList.add('paused');
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => closeBtn && closeBtn.focus({ preventScroll: true }), 420);
    }
    function close() {
      if (!openFlag) return;
      openFlag = false;
      focus.classList.remove('is-open');
      focus.setAttribute('aria-hidden', 'true');
      top.classList.remove('paused'); bottom.classList.remove('paused');
      document.documentElement.style.overflow = '';
      setTimeout(() => { flipCard.classList.remove('is-flipped'); opener = null; }, 620);
    }
    function flip() {
      if (!openFlag) return;
      flipCard.classList.toggle('is-flipped');
      $('focusHint').textContent = flipCard.classList.contains('is-flipped')
        ? (G.backHint || '再点一次 · 回到画面') : (G.flipHint || '再次点击图片 · 翻到背面读一封信');
    }
    flipCard.addEventListener('click', flip);
    flipCard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    closeBtn.addEventListener('click', close);
    shade.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && openFlag) close(); });
  }

  /* ---------------------- 视频展示 ---------------------- */
  function initVideo() {
    const V = C.video || {}, shell = $('videoShell'), cv = $('videoCanvas');
    const view = fitCanvas(cv), real = $('realVideo');
    const parts = makeParticles(58, view.w, view.h);
    const fishes = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * view.w, y: view.h * (.18 + Math.random() * .62),
      s: .5 + Math.random() * 1.1, sp: 12 + Math.random() * 26, dir: i % 2 ? 1 : -1
    }));
    const loopSec = V.loopSeconds || 24;
    let playing = false, raf = 0, last = 0, elapsed = 0, audio = null, master = null;

    function drawScene(t) {
      const { ctx, w, h } = view;
      const cycle = (t % loopSec) / loopSec;
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, mix('#1d92a3', '#0d6d86', Math.sin(cycle * Math.PI * 2) * .5 + .5));
      g.addColorStop(.55, '#0a4b66'); g.addColorStop(1, '#021a2a');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      ctx.save();
      for (let i = 0; i < 6; i++) {
        const x = w * (i + .5) / 6 + Math.sin(t * .22 + i * 1.7) * w * .05;
        ctx.beginPath(); ctx.moveTo(x - w * .035, 0); ctx.lineTo(x + w * .035, 0);
        ctx.lineTo(x + w * .15, h); ctx.lineTo(x + w * .02, h); ctx.closePath();
        const ray = ctx.createLinearGradient(0, 0, 0, h);
        ray.addColorStop(0, 'rgba(215,252,255,.15)'); ray.addColorStop(1, 'rgba(215,252,255,0)');
        ctx.fillStyle = ray; ctx.fill();
      }
      ctx.restore();

      ctx.strokeStyle = 'rgba(190,240,238,.08)'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const y = h * (.2 + i * .18) + Math.sin(t * .5 + i) * 14;
        ctx.beginPath(); ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 20) ctx.lineTo(x, y + Math.sin(x * .011 + t * .8 + i) * 12);
        ctx.stroke();
      }

      for (const f of fishes) {
        f.x += f.sp * f.dir * .016;
        if (f.x > w + 40) f.x = -40; if (f.x < -40) f.x = w + 40;
        const y = f.y + Math.sin(t + f.x * .01) * 8;
        ctx.save(); ctx.translate(f.x, y); ctx.scale(f.s * f.dir, f.s);
        ctx.beginPath(); ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,42,59,.72)'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(13, 0); ctx.lineTo(25, -8); ctx.lineTo(25, 8); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      drawBubbles(ctx, w, h, parts, .016);

      const vg = ctx.createRadialGradient(w / 2, h / 2, h * .2, w / 2, h / 2, h * .9);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(1,12,22,.5)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    }

    function initAudio() {
      if (!V.ambientSound || audio) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        audio = new AC();
        const len = audio.sampleRate * 3;
        const buf = audio.createBuffer(1, len, audio.sampleRate);
        const data = buf.getChannelData(0);
        let lastV = 0;
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1;
          lastV = (lastV + .02 * white) / 1.02;
          data[i] = lastV * 3.2;
        }
        const src = audio.createBufferSource(); src.buffer = buf; src.loop = true;
        const lp = audio.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 620;
        const hp = audio.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 60;
        master = audio.createGain(); master.gain.value = 0;
        const lfo = audio.createOscillator(); lfo.frequency.value = .11;
        const lfoGain = audio.createGain(); lfoGain.gain.value = .22;
        lfo.connect(lfoGain); lfoGain.connect(master.gain);
        src.connect(hp); hp.connect(lp); lp.connect(master); master.connect(audio.destination);
        src.start(); lfo.start();
      } catch (e) { audio = null; master = null; }
    }
    function rampAudio(on) {
      if (!audio || !master) return;
      const now = audio.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      const vol = parseFloat($('volumeRange').value);
      master.gain.linearRampToValueAtTime(on ? vol * .78 : 0, now + .7);
    }

    function tick(ts) {
      if (!playing) return;
      const dt = Math.min(.06, (ts - (last || ts)) / 1000); last = ts;
      elapsed += dt;
      if (!shell.classList.contains('has-video')) drawScene(elapsed);
      const dur = shell.classList.contains('has-video') && isFinite(real.duration) ? real.duration : loopSec;
      const cur = shell.classList.contains('has-video') ? real.currentTime : (elapsed % dur);
      $('videoProgress').style.width = (cur / dur * 100) + '%';
      const fmt = s => String(Math.floor(s)).padStart(2, '0');
      $('videoTime').textContent = `00:${fmt(cur)} / 00:${fmt(dur)}`;
      raf = requestAnimationFrame(tick);
    }
    function play() {
      if (playing) return;
      playing = true; shell.classList.add('is-playing');
      $('playLabel').textContent = V.pauseText || '暂停';
      $('videoStatus').innerHTML = '<i></i> PLAYING';
      initAudio(); if (audio && audio.state === 'suspended') audio.resume();
      rampAudio(true);
      if (shell.classList.contains('has-video')) { last = 0; real.play().catch(() => {}); }
      else { last = 0; raf = requestAnimationFrame(tick); }
    }
    function pause() {
      if (!playing) return;
      playing = false; shell.classList.remove('is-playing');
      $('playLabel').textContent = V.playText || '播放';
      $('videoStatus').innerHTML = '<i></i> STANDBY';
      rampAudio(false);
      if (shell.classList.contains('has-video')) real.pause();
      cancelAnimationFrame(raf);
    }
    $('playToggle').addEventListener('click', () => playing ? pause() : play());
    $('videoBigPlay').addEventListener('click', play);
    $('volumeRange').value = V.volume != null ? V.volume : .35;
    $('volumeRange').addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      real.volume = v;
      if (master && audio) master.gain.setTargetAtTime(playing ? v * .78 : 0, audio.currentTime, .08);
    });
    real.volume = parseFloat($('volumeRange').value);
    let prevVol = real.volume;
    $('muteToggle').addEventListener('click', () => {
      const r = $('volumeRange');
      if (parseFloat(r.value) > 0) { prevVol = parseFloat(r.value); r.value = 0; }
      else r.value = prevVol || .35;
      r.dispatchEvent(new Event('input'));
    });
    real.addEventListener('ended', () => { if (!real.loop) pause(); });

    const vItems = V.items || [];
    const picker = $('pickerList');
    picker && picker.addEventListener('click', e => {
      const btn = e.target.closest('.picker-item');
      if (!btn || !vItems.length) return;
      const i = Number(btn.dataset.index), item = vItems[i];
      if (!item) return;
      picker.querySelectorAll('.picker-item').forEach((el, j) => {
        el.classList.toggle('is-active', j === i);
        el.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      const wasPlaying = playing;
      if (wasPlaying) pause();
      real.src = item.src;
      $('videoPoster').src = item.poster || '';
      $('videoProgress').style.width = '0%';
      $('videoTime').textContent = '00:00 / 00:00';
      $('uiIndex').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(vItems.length).padStart(2, '0');
      $('uiTitle').textContent = item.title || ''; $('uiTag').textContent = item.tag || '';
      real.load();
      if (wasPlaying) play();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(en => { if (!en.isIntersecting && playing) pause(); });
      }, { threshold: .18 }).observe($('videoSection'));
    }
  }

  /* ---------------------- 弹幕留言墙 ---------------------- */
  function initDanmaku() {
    const D = C.danmaku || {}, stage = $('danmakuStage'), form = $('danmakuForm');
    const input = $('danmakuInput');
    const laneCount = coarse ? Math.max(3, Math.floor((D.lanes || 5) * .7)) : (D.lanes || 5);
    const lanes = Array.from({ length: laneCount }, () => ({ top: 0, busy: 0, el: null }));
    const msgs = D.messages || [], colors = D.colors || ['#eaf5f6'];
    const styles = D.styleCycle || ['solid'];
    let idx = 0, timer = 0, active = false;

    function layout() {
      const h = stage.clientHeight || 420;
      lanes.forEach((l, i) => { l.top = (i + .5) * (h / laneCount); });
    }
    layout(); window.addEventListener('resize', layout, { passive: true });

    function spawn(text, mine) {
      if (!text) return;
      const now = performance.now();
      let lane = lanes.reduce((a, b) => a.busy <= b.busy ? a : b);
      if (lane.busy > now) {
        const free = lanes.filter(l => l.busy <= now);
        if (!free.length) return;
        lane = free[Math.floor(Math.random() * free.length)];
      }
      const el = document.createElement('div');
      const cycle = idx++;
      const style = mine ? 'mine' : styles[cycle % styles.length];
      el.className = 'danmaku-item ' + style;
      el.textContent = text;
      const wave = (Math.sin(cycle * .6) + 1) / 2;
      const size = lerp(D.sizeRange ? D.sizeRange[0] : 14, D.sizeRange ? D.sizeRange[1] : 34, wave);
      const op = lerp(D.opacityRange ? D.opacityRange[0] : .42, D.opacityRange ? D.opacityRange[1] : 1, Math.random());
      el.style.color = mine ? (D.colors && D.colors[1] || '#6fe3d2') : colors[cycle % colors.length];
      el.style.fontSize = (mine ? Math.max(size, 20) : size) + 'px';
      el.style.opacity = mine ? 1 : op;
      el.style.top = lane.top + 'px';
      stage.appendChild(el);
      const dist = stage.offsetWidth + el.offsetWidth + 60;
      const dur = mine ? 12000 : lerp(D.duration ? D.duration[0] : 11000, D.duration ? D.duration[1] : 19000, Math.random());
      lane.busy = now + dur * clamp(el.offsetWidth / dist, .15, .7);
      const anim = el.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(-${dist}px)` }],
        { duration: reduceMotion ? 1 : dur, easing: 'linear', fill: 'forwards' }
      );
      anim.onfinish = () => el.remove();
    }

    function schedule() {
      clearTimeout(timer);
      if (!active) return;
      const range = D.spawnInterval || [900, 1800];
      timer = setTimeout(() => {
        spawn(msgs[Math.floor(Math.random() * msgs.length)], false);
        schedule();
      }, lerp(range[0], range[1], Math.random()));
    }

    if (reduceMotion) {
      msgs.forEach(m => { const el = document.createElement('span'); el.className = 'danmaku-item solid'; el.textContent = m + '　'; stage.appendChild(el); });
      stage.style.display = 'flex'; stage.style.flexWrap = 'wrap'; stage.style.alignContent = 'center'; stage.style.padding = '30px';
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting && !active) { active = true; schedule(); }
          else if (!en.isIntersecting) { active = false; clearTimeout(timer); }
        });
      }, { threshold: .1 }).observe(stage);
    } else { active = true; schedule(); }
    setTimeout(() => { if (!active && !reduceMotion) { active = true; schedule(); } }, 2600);

    form && form.addEventListener('submit', e => {
      e.preventDefault();
      const v = input.value.trim();
      if (v) { spawn(v, true); input.value = ''; active = true; schedule(); }
    });
  }

  /* ---------------------- 滚动衔接 ---------------------- */
  function initScrollUI() {
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
      const ob = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); ob.unobserve(en.target); }
        });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(el => ob.observe(el));
    } else revealEls.forEach(el => el.classList.add('is-visible'));
    setTimeout(revealInView, 1400);

    if (C.motion && C.motion.scrollProgress !== false) {
      const bar = $('scrollProgress').firstElementChild;
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
          ticking = false;
        });
      }, { passive: true });
    }
  }

  /* ---------------------- 启动 ---------------------- */
  applyConfig();
  initScrollUI();
  initHero();
  initGallery();
  initVideo();
  initDanmaku();
  initIntro();
})();
