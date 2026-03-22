'use strict';

let cfg = {
  defaultPosition: 'top-right',
  maxCount: 5,
  colors: {
    success: { color: '#00ff99', glow: 'rgba(0,255,153,0.5)'  },
    error:   { color: '#ff4d6d', glow: 'rgba(255,77,109,0.5)' },
    warning: { color: '#ffaa00', glow: 'rgba(255,170,0,0.5)'  },
    info:    { color: '#00f5ff', glow: 'rgba(0,245,255,0.5)'  },
  },
  icons: {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  },
  duration: {
    success: 5000,
    error:   6000,
    warning: 5500,
    info:    5000,
  },
};

const POSITION_STYLES = {
  'top':           { top: '24px',    left: '50%',   transform: 'translateX(-50%)', alignItems: 'center',     flexDirection: 'column'         },
  'top-left':      { top: '24px',    left: '24px',                                 alignItems: 'flex-start', flexDirection: 'column'         },
  'top-right':     { top: '24px',    right: '24px',                                alignItems: 'flex-end',   flexDirection: 'column'         },
  'bottom':        { bottom: '24px', left: '50%',   transform: 'translateX(-50%)', alignItems: 'center',     flexDirection: 'column-reverse' },
  'bottom-left':   { bottom: '24px', left: '24px',                                 alignItems: 'flex-start', flexDirection: 'column-reverse' },
  'bottom-right':  { bottom: '24px', right: '24px',                                alignItems: 'flex-end',   flexDirection: 'column-reverse' },
  'left':          { top: '50%',     left: '24px',  transform: 'translateY(-50%)', alignItems: 'flex-start', flexDirection: 'column'         },
  'right':         { top: '50%',     right: '24px', transform: 'translateY(-50%)', alignItems: 'flex-end',   flexDirection: 'column'         },
};

const SLIDE_FROM = {
  'top':          'translateY(-18px)', 'top-left':     'translateY(-18px)', 'top-right':    'translateY(-18px)',
  'bottom':       'translateY(18px)',  'bottom-left':  'translateY(18px)',  'bottom-right': 'translateY(18px)',
  'left':         'translateX(-18px)',
  'right':        'translateX(18px)',
};
const SLIDE_TO = {
  'top':          'translateY(-14px)', 'top-left':     'translateY(-14px)', 'top-right':    'translateY(-14px)',
  'bottom':       'translateY(14px)',  'bottom-left':  'translateY(14px)',  'bottom-right': 'translateY(14px)',
  'left':         'translateX(-14px)',
  'right':        'translateX(14px)',
};

const zones = {};

function getZone(position) {
  if (zones[position]) return zones[position];

  const posStyle = POSITION_STYLES[position] || POSITION_STYLES['top-right'];

  const el = document.createElement('div');
  el.className = 'notify-container';

  Object.entries(posStyle).forEach(([k, v]) => { el.style[k] = v; });

  el.style.setProperty('--slide-from', SLIDE_FROM[position] || 'translateY(-18px)');
  el.style.setProperty('--slide-to',   SLIDE_TO[position]   || 'translateY(-14px)');

  document.body.appendChild(el);

  zones[position] = { el, toasts: [] };
  return zones[position];
}

let idSeq = 0;

function removeToast(position, id) {
  const zone = zones[position];
  if (!zone) return;

  const idx = zone.toasts.findIndex(t => t.id === id);
  if (idx === -1) return;

  const { el, timerId } = zone.toasts[idx];
  clearTimeout(timerId);
  zone.toasts.splice(idx, 1);

  el.classList.add('removing');
  el.addEventListener('animationend', () => el.remove(), { once: true });
  setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
}

function createToastEl(id, type, message, position, ms) {
  const typeCfg = cfg.colors[type] || cfg.colors.info;
  const icon    = cfg.icons[type]  || cfg.icons.info;

  const el = document.createElement('div');
  el.className = 'notify-toast';
  el.style.setProperty('--accent-color',     typeCfg.color);
  el.style.setProperty('--accent-color-dim', typeCfg.color + '80');
  el.style.setProperty('--border-color',     typeCfg.color + '44');
  el.style.setProperty('--glow-color',       typeCfg.glow);
  el.style.setProperty('--duration',         `${ms}ms`);

  el.innerHTML = `
    <div class="notify-scanline"></div>
    <span class="notify-icon">${icon}</span>
    <span class="notify-message">${escapeHtml(message)}</span>
    <div class="notify-progress"></div>
  `;

  return el;
}

function showNotify(type, message, position, duration) {
  const pos = (position && POSITION_STYLES[position]) ? position : cfg.defaultPosition;
  const ms  = duration || cfg.duration[type] || 5000;

  const zone = getZone(pos);

  while (zone.toasts.length >= cfg.maxCount) {
    removeToast(pos, zone.toasts[0].id);
  }

  const id = ++idSeq;
  const el = createToastEl(id, type, message, pos, ms);

  zone.el.appendChild(el);

  const timerId = setTimeout(() => removeToast(pos, id), ms);
  zone.toasts.push({ id, el, timerId });
}

function init(data) {
  if (data.defaultPosition) cfg.defaultPosition = data.defaultPosition;
  if (data.maxCount)        cfg.maxCount        = data.maxCount;
  if (data.colors)          Object.assign(cfg.colors,   data.colors);
  if (data.icons)           Object.assign(cfg.icons,    data.icons);
  if (data.duration)        Object.assign(cfg.duration, data.duration);


  fetch(`https://${getResourceName()}/nuiReady`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }).catch(() => {});
}

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || !data.action) return;

  switch (data.action) {
    case 'auzzie_notify_init':
      init(data);
      break;

    case 'auzzie_notify':
      showNotify(
        data.type     || 'info',
        data.message  || '',
        data.position || null,
        data.duration,
      );
      break;
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getResourceName() {
  return (typeof window.GetParentResourceName === 'function')
    ? window.GetParentResourceName()
    : 'auzzie_notify';
}
