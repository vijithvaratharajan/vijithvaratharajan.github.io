/**
 * theme.js — color theme system for vijithvaratharajan.github.io
 * Handles: 5 color themes × dark/light mode, CSS var injection,
 * particle reload hook, localStorage persistence.
 * Does NOT touch the light/dark toggle (that stays in each page).
 */

(function () {

  /* ── theme definitions ─────────────────────────────────────── */
  var THEMES = {
    nebula: {
      accent:          '#e100ff',
      accentSecondary: '#7a00ff',
      accentGlow:      'rgba(225,0,255,0.4)',
      particle:        '#ff4dff',
      bg:              '#0d001a',
      bgGrad:          'linear-gradient(135deg,#1a002e 0%,#3c0055 40%,#000 100%)',
      bgLight:         '#f5f2ff',
      nav:             'linear-gradient(135deg,#2a0050,#4c0080,#2a0050)',
      navLight:        'linear-gradient(135deg,#ffffff,#f3e8ff)'
    },
    ocean: {
      accent:          '#00d2ff',
      accentSecondary: '#0066cc',
      accentGlow:      'rgba(0,210,255,0.4)',
      particle:        '#00b8e0',
      bg:              '#001a28',
      bgGrad:          'linear-gradient(135deg,#000f1a 0%,#001f38 40%,#000 100%)',
      bgLight:         '#f0f8ff',
      nav:             'linear-gradient(135deg,#001a38,#002855,#001a38)',
      navLight:        'linear-gradient(135deg,#e8f8ff,#f0faff)'
    },
    ember: {
      accent:          '#ff6b2b',
      accentSecondary: '#cc4400',
      accentGlow:      'rgba(255,107,43,0.4)',
      particle:        '#ff8c42',
      bg:              '#1a0800',
      bgGrad:          'linear-gradient(135deg,#100500 0%,#2a1000 40%,#000 100%)',
      bgLight:         '#fff5f0',
      nav:             'linear-gradient(135deg,#200800,#3a1500,#200800)',
      navLight:        'linear-gradient(135deg,#fff8f5,#fff0e8)'
    },
    forest: {
      accent:          '#00e676',
      accentSecondary: '#00884d',
      accentGlow:      'rgba(0,200,83,0.4)',
      particle:        '#00c853',
      bg:              '#001a0d',
      bgGrad:          'linear-gradient(135deg,#000f08 0%,#002015 40%,#000 100%)',
      bgLight:         '#f0fff4',
      nav:             'linear-gradient(135deg,#001a0a,#002815,#001a0a)',
      navLight:        'linear-gradient(135deg,#f0fff5,#e8ffef)'
    },
    crimson: {
      accent:          '#ff1744',
      accentSecondary: '#aa0030',
      accentGlow:      'rgba(255,23,68,0.4)',
      particle:        '#ff4465',
      bg:              '#1a0008',
      bgGrad:          'linear-gradient(135deg,#0f0003 0%,#250010 40%,#000 100%)',
      bgLight:         '#fff0f2',
      nav:             'linear-gradient(135deg,#200008,#350015,#200008)',
      navLight:        'linear-gradient(135deg,#fff5f7,#ffecef)'
    }
  };

  /* ── inject dot styles once ────────────────────────────────── */
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '.color-theme-picker{display:flex;gap:6px;align-items:center;}',
    '.color-theme-dot{width:14px;height:14px;border-radius:50%;border:2px solid transparent;',
    'padding:0;cursor:pointer;transition:transform .15s ease,border-color .15s ease;flex-shrink:0;}',
    '.color-theme-dot:hover{transform:scale(1.25);}',
    '.color-theme-dot.active{border-color:rgba(255,255,255,0.9);box-shadow:0 0 0 1px rgba(255,255,255,0.3);}',
    ':root.light-mode .color-theme-dot.active{border-color:rgba(0,0,0,0.5);box-shadow:0 0 0 1px rgba(0,0,0,0.15);}'
  ].join('');
  document.head.appendChild(styleEl);

  /* ── apply CSS vars ────────────────────────────────────────── */
  function applyVars(name) {
    var t = THEMES[name] || THEMES.nebula;
    var r = document.documentElement;
    var light = r.classList.contains('light-mode');

    r.style.setProperty('--accent',           t.accent);
    r.style.setProperty('--accent-secondary', t.accentSecondary);
    r.style.setProperty('--accent-glow',      t.accentGlow);
    r.style.setProperty('--particle-color',   t.particle);
    r.style.setProperty('--bg-color',        light ? t.bgLight  : t.bg);
    r.style.setProperty('--bg',              light ? t.bgLight  : t.bgGrad);
    r.style.setProperty('--navbar-bg',       light ? t.navLight : t.nav);
    r.style.setProperty('--navbar-gradient', light ? t.navLight : t.nav);

    window._colorThemeName = name;
    window._colorThemeData = t;
  }

  /* ── apply immediately (sync) so page renders with right vars ─ */
  var saved = localStorage.getItem('color-theme') || 'nebula';
  applyVars(saved);

  /* ── public hook: pages call this after light/dark toggle ───── */
  window.reapplyColorTheme = function () {
    applyVars(window._colorThemeName || 'nebula');
    if (typeof window.reloadParticles === 'function') {
      window.reloadParticles((window._colorThemeData || THEMES.nebula).particle);
    }
  };

  /* ── wire dots after DOM is ready ──────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    function updateDots(name) {
      document.querySelectorAll('.color-theme-dot').forEach(function (d) {
        d.classList.toggle('active', d.dataset.theme === name);
      });
    }

    updateDots(window._colorThemeName || 'nebula');

    document.querySelectorAll('.color-theme-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        var name = dot.dataset.theme;
        localStorage.setItem('color-theme', name);
        applyVars(name);
        updateDots(name);
        if (typeof window.reloadParticles === 'function') {
          window.reloadParticles((window._colorThemeData || THEMES.nebula).particle);
        }
      });
    });

  });

})();
