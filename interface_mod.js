(function() {
  'use strict';
  if (window.__hz_interface_v4) return;
  window.__hz_interface_v4 = true;
  var VERSION = '4.4.0';
  var COMPONENT = 'inmod_settings';
  function svg(body) {
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' + 'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  var ICONS = {
    palette: svg('<path d="M12 3.2c-4.9 0-8.8 3.8-8.8 8.6 0 4.9 3.9 9 8.6 9 1.2 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1c2.6 0 4.6-2.1 4.6-4.6C21.2 6.6 17.1 3.2 12 3.2z"/>' + '<circle cx="7.6" cy="11.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="9.7" cy="7.6" r="1.15" fill="currentColor" stroke="none"/>' + '<circle cx="14.3" cy="7.2" r="1.15" fill="currentColor" stroke="none"/><circle cx="17.2" cy="10.4" r="1.15" fill="currentColor" stroke="none"/>'),
    collections: svg('<rect x="3.5" y="8.5" width="17" height="12" rx="2.6"/><path d="M6 5.5h12M8.5 2.8h7"/>'),
    star: svg('<path d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
    dock: svg('<rect x="3" y="3.5" width="18" height="17" rx="3.6"/><rect x="6.5" y="14" width="11" height="3.4" rx="1.7"/>'),
    skip: svg('<path d="M4.5 6.8v10.4L11 12zM11.5 6.8v10.4L18 12z"/><path d="M20 6.5v11"/>'),
    stack: svg('<rect x="8" y="8" width="12.5" height="12.5" rx="2.6"/><path d="M4 15.5V6.1A2.6 2.6 0 0 1 6.6 3.5H16"/>'),
    tv: svg('<rect x="2.8" y="4.5" width="18.4" height="12.6" rx="2.4"/><path d="M8.5 20.3h7"/>'),
    bell: svg('<path d="M6.2 16.6v-5.3a5.8 5.8 0 0 1 11.6 0v5.3l1.6 1.9H4.6z"/><path d="M10 21a2.3 2.3 0 0 0 4 0"/>'),
    update: svg('<path d="M19.4 9.2A7.8 7.8 0 0 0 5.4 7.6L4 9.2"/><path d="M4 4.6v4.6h4.6"/><path d="M4.6 14.8a7.8 7.8 0 0 0 14 1.6l1.4-1.6"/><path d="M20 19.4v-4.6h-4.6"/>'),
    download: svg('<circle cx="12" cy="12" r="8.8"/><path d="M12 7.4v8.6M8.3 12.5 12 16.2l3.7-3.7"/>'),
    log: svg('<path d="M6.6 3h7.1l4.8 4.8V19a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M13.5 3.2V8h4.8M8.4 12.6h7.2M8.4 16.2h4.8"/>'),
    b_play: svg('<path d="M8 5.6v12.8c0 .8.9 1.3 1.6.8l9.6-6.4c.6-.4.6-1.2 0-1.6L9.6 4.8C8.9 4.3 8 4.8 8 5.6z" fill="currentColor"/>'),
    b_magnet: svg('<path d="M5.5 4.5h4v7a2.5 2.5 0 0 0 5 0v-7h4v7a6.5 6.5 0 0 1-13 0z"/><path d="M5.5 8.6h4M14.5 8.6h4"/>'),
    b_film: svg('<rect x="3" y="4.5" width="18" height="15" rx="2.8"/><path d="M7.5 4.8v14.4M16.5 4.8v14.4M3.2 9.6h4.3M3.2 14.4h4.3M16.5 9.6h4.3M16.5 14.4h4.3"/>'),
    b_bookmark: svg('<path d="M7 3.6h10a1.2 1.2 0 0 1 1.2 1.2v15.6L12 16.4l-6.2 4V4.8A1.2 1.2 0 0 1 7 3.6z"/>'),
    b_smile: svg('<circle cx="12" cy="12" r="8.6"/><path d="M8.6 14.1a4 4 0 0 0 6.8 0"/><path d="M9.4 9.7v.4M14.6 9.7v.4" stroke-width="2.4"/>'),
    b_bell: svg('<path d="M6.2 16.6v-5.3a5.8 5.8 0 0 1 11.6 0v5.3l1.6 1.9H4.6z"/><path d="M10 21a2.3 2.3 0 0 0 4 0"/>'),
    b_more: svg('<circle cx="5.5" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor" stroke="none"/>'),
    b_download: svg('<path d="M12 3.8v11M7.4 10.6 12 15.2l4.6-4.6"/><path d="M4.5 16.5v1.7a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1.7"/>'),
    b_star: svg('<path d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
    b_online: svg('<rect x="3" y="4.5" width="18" height="15" rx="4"/><path d="M10.3 9.3v5.4l4.5-2.7z" fill="currentColor"/>')
  };
  var ICON_RULES = [ [ /оформлен|appearance/i, 'palette' ], [ /подборк|collections?\b/i, 'collections' ], [ /оценк|рейтинг|ratings?\b/i, 'star' ], [ /бар кнопок|панель кнопок|navigation bar/i, 'dock' ], [ /пропуск|заставк|skip|intro/i, 'skip' ], [ /франшиз|franchise/i, 'stack' ], [ /netflix/i, 'tv' ], [ /уведомлен|notif/i, 'bell' ], [ /обновлен|updates?\b/i, 'update' ], [ /загрузк|скачанн|downloads?\b/i, 'download' ], [ /журнал|^логи?$|^logs?$/i, 'log' ] ];
  var ICON_SKIP = /кинопоиск|kinopoisk/i;
  function iconFor(name) {
    name = ((name || '') + '').trim();
    if (!name || ICON_SKIP.test(name)) return '';
    for (var i = 0; i < ICON_RULES.length; i++) if (ICON_RULES[i][0].test(name)) return ICON_RULES[i][1];
    return '';
  }
  var ACCENTS = {
    white: {
      name: 'Белый (tvOS)',
      accent: '#ffffff',
      on: '#0b0b0c',
      ring: '#ffffff',
      dark: true,
      neutral: true
    },
    blue: {
      name: 'Синий',
      accent: '#0a84ff',
      on: '#ffffff',
      ring: '#409cff'
    },
    teal: {
      name: 'Бирюзовый',
      accent: '#2bb5a5',
      on: '#ffffff',
      ring: '#43cea2'
    },
    indigo: {
      name: 'Индиго',
      accent: '#5e5ce6',
      on: '#ffffff',
      ring: '#7d7aff'
    },
    purple: {
      name: 'Фиолетовый',
      accent: '#bf5af2',
      on: '#ffffff',
      ring: '#cf7cf5'
    },
    pink: {
      name: 'Розовый',
      accent: '#ff375f',
      on: '#ffffff',
      ring: '#ff6482'
    },
    orange: {
      name: 'Оранжевый',
      accent: '#ff9f0a',
      on: '#1c1c1e',
      ring: '#ffb340',
      dark: true
    },
    graphite: {
      name: 'Графит',
      accent: '#636366',
      on: '#ffffff',
      ring: '#aeaeb2',
      neutral: true
    }
  };
  var BACKGROUNDS = {
    graphite: {
      name: 'Графит',
      bg: 'radial-gradient(120% 85% at 50% -15%, #343438 0%, #1c1c1e 48%, #0c0c0d 100%)',
      solid: '#1c1c1e',
      surface: '#1c1c1e',
      surface2: '#2c2c2e'
    },
    black: {
      name: 'Чёрный (OLED)',
      bg: '#000000',
      solid: '#000000',
      surface: '#121214',
      surface2: '#1c1c1e'
    },
    midnight: {
      name: 'Полночь',
      bg: 'radial-gradient(110% 90% at 15% -10%, #23345a 0%, #111a2e 45%, #060910 100%)',
      solid: '#0e1526',
      surface: '#131b2c',
      surface2: '#1d2740'
    },
    ocean: {
      name: 'Глубокий синий',
      bg: 'linear-gradient(165deg, #0b2a4a 0%, #071a30 50%, #030b16 100%)',
      solid: '#071a30',
      surface: '#0c2036',
      surface2: '#132c47'
    },
    teal: {
      name: 'Бирюзовый',
      bg: 'radial-gradient(120% 90% at 85% -10%, #12514d 0%, #0b2f34 45%, #051416 100%)',
      solid: '#0b2a2e',
      surface: '#0f2b2f',
      surface2: '#173b40'
    },
    aurora: {
      name: 'Аврора',
      bg: 'radial-gradient(55% 45% at 12% 8%, rgba(94,92,230,.38) 0%, rgba(94,92,230,0) 70%),' + 'radial-gradient(50% 42% at 88% 14%, rgba(48,176,199,.30) 0%, rgba(48,176,199,0) 70%),' + 'radial-gradient(70% 55% at 55% 115%, rgba(191,90,242,.26) 0%, rgba(191,90,242,0) 70%),' + 'linear-gradient(180deg, #0d0d16 0%, #08080d 100%)',
      solid: '#0b0b12',
      surface: '#15151f',
      surface2: '#20202d'
    },
    dusk: {
      name: 'Закат',
      bg: 'radial-gradient(90% 70% at 85% 0%, rgba(255,120,80,.22) 0%, rgba(255,120,80,0) 65%),' + 'radial-gradient(120% 90% at 10% 10%, #3a1838 0%, #1b0d1d 50%, #0b060c 100%)',
      solid: '#1b0d1d',
      surface: '#211326',
      surface2: '#2f1d36'
    },
    lampa: {
      name: 'Стандартный Lampa',
      bg: '',
      solid: '#1d1f20',
      surface: '#262829',
      surface2: '#353535'
    },
    color: {
      name: 'Свой цвет',
      custom: true
    },
    image: {
      name: 'Своя картинка',
      custom: true
    }
  };
  var DEFAULTS = {
    inmod_enabled: true,
    inmod_accent: 'white',
    inmod_font: true,
    inmod_blur: false,
    inmod_animations: true,
    inmod_bg: 'graphite',
    inmod_bg_color: '#101820',
    inmod_bg_image: '',
    inmod_bg_remember: true,
    inmod_bg_poster: '100',
    inmod_badge_scale: 'auto',
    inmod_rating_size: '115',
    inmod_badge_type: 'all',
    inmod_star: 'gold',
    inmod_pos_rating: 'bl',
    inmod_pos_quality: 'br',
    inmod_pos_type: 'tl',
    inmod_pos_year: 'tr',
    inmod_pos_marker: 'tr',
    inmod_marker_text: false,
    inmod_chip: 'frost',
    inmod_pos_icons: 'tr',
    inmod_title_year: false,
    inmod_scrim: 'normal',
    inmod_navbar: 'panel',
    inmod_btn_shape: 'squircle',
    inmod_btn_fill: 'glass',
    inmod_btn_shadow: 'none',
    inmod_btn_icons: true,
    inmod_mobile_full: 'center',
    inmod_icons: true,
    inmod_show_online_buttons: true,
    inmod_patch_online_icons: true,
    inmod_show_logos: true,
    inmod_seasons_info_mode: 'aired',
    inmod_label_position: 'top-right',
    inmod_torrent_styles: true
  };
  var cfg = {};
  function storeGet(key) {
    var def = DEFAULTS[key];
    var v;
    try {
      v = Lampa.Storage.get(key, def);
    } catch (e) {
      v = def;
    }
    if (v === undefined || v === null || v === '') v = def === '' ? '' : def;
    if (typeof def === 'boolean' && typeof v === 'string') return v !== 'false' && v !== '0';
    return v;
  }
  function loadConfig() {
    for (var k in DEFAULTS) if (DEFAULTS.hasOwnProperty(k)) cfg[k] = storeGet(k);
    if (!ACCENTS[cfg.inmod_accent]) cfg.inmod_accent = 'white';
    if (!BACKGROUNDS[cfg.inmod_bg]) cfg.inmod_bg = 'graphite';
  }
  function addStyle(id, css) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }
  function removeStyle(id) {
    var el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
  function bodyClass(name, on) {
    if (document.body) document.body.classList.toggle(name, !!on);
  }
  function tr(key) {
    try {
      return Lampa.Lang.translate(key);
    } catch (e) {
      return key;
    }
  }
  function plural(n, one, two, five) {
    var a = Math.abs(n) % 100;
    if (a >= 5 && a <= 20) return five;
    a %= 10;
    if (a === 1) return one;
    if (a >= 2 && a <= 4) return two;
    return five;
  }
  function hexToRgb(hex) {
    var h = (hex || '').replace('#', '').trim();
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return [ parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16) ];
  }
  function mix(rgb, target, t) {
    return 'rgb(' + rgb.map(function(c, i) {
      return Math.round(c + (target[i] - c) * t);
    }).join(',') + ')';
  }
  function isActive() {
    return !!cfg.inmod_enabled;
  }
  function idle(fn, timeout) {
    if (window.requestIdleCallback) window.requestIdleCallback(fn, {
      timeout: timeout || 4e3
    }); else setTimeout(fn, 250);
  }
  function registerTranslations() {
    Lampa.Lang.add({
      hz_movie: {
        ru: 'Фильм',
        en: 'Movie',
        uk: 'Фільм'
      },
      hz_serial: {
        ru: 'Сериал',
        en: 'Series',
        uk: 'Серіал'
      },
      inmod_status_ended: {
        ru: 'Завершён',
        en: 'Ended',
        uk: 'Завершений'
      },
      inmod_status_canceled: {
        ru: 'Отменён',
        en: 'Canceled',
        uk: 'Скасовано'
      },
      inmod_status_returning: {
        ru: 'Выходит',
        en: 'Returning',
        uk: 'Виходить'
      },
      inmod_status_production: {
        ru: 'В производстве',
        en: 'In Production',
        uk: 'У виробництві'
      },
      inmod_status_planned: {
        ru: 'Запланирован',
        en: 'Planned',
        uk: 'Заплановано'
      },
      inmod_status_released: {
        ru: 'Вышел',
        en: 'Released',
        uk: 'Вийшов'
      },
      inmod_status_post: {
        ru: 'Скоро',
        en: 'Post Production',
        uk: 'Скоро'
      },
      inmod_status_unknown: {
        ru: 'Неизвестно',
        en: 'Unknown',
        uk: 'Невідомо'
      },
      inmod_season_1: {
        ru: 'сезон',
        en: 'season',
        uk: 'сезон'
      },
      inmod_season_2: {
        ru: 'сезона',
        en: 'seasons',
        uk: 'сезони'
      },
      inmod_season_5: {
        ru: 'сезонов',
        en: 'seasons',
        uk: 'сезонів'
      },
      inmod_episode_1: {
        ru: 'серия',
        en: 'episode',
        uk: 'серія'
      },
      inmod_episode_2: {
        ru: 'серии',
        en: 'episodes',
        uk: 'серії'
      },
      inmod_episode_5: {
        ru: 'серий',
        en: 'episodes',
        uk: 'серій'
      },
      inmod_out_of: {
        ru: 'из',
        en: 'of',
        uk: 'із'
      }
    });
    Lampa.Lang.add({
      tv_status_returning_series: {
        ru: tr('inmod_status_returning')
      },
      tv_status_planned: {
        ru: tr('inmod_status_planned')
      },
      tv_status_in_production: {
        ru: tr('inmod_status_production')
      },
      tv_status_ended: {
        ru: tr('inmod_status_ended')
      },
      tv_status_canceled: {
        ru: tr('inmod_status_canceled')
      },
      tv_status_pilot: {
        ru: 'Пилот'
      },
      tv_status_released: {
        ru: tr('inmod_status_released')
      },
      tv_status_rumored: {
        ru: 'По слухам'
      },
      tv_status_post_production: {
        ru: tr('inmod_status_post')
      }
    });
  }
  var Theme = {
    _css: null,
    scale: function() {
      var s = cfg.inmod_badge_scale;
      if (s === 'auto') return null;
      var n = parseInt(s, 10);
      return n >= 60 && n <= 200 ? n / 100 : 1;
    },
    rgb: function(c) {
      var m = /rgb\((\d+),(\d+),(\d+)\)/.exec(c);
      return m ? [ +m[1], +m[2], +m[3] ] : hexToRgb(c) || [ 28, 28, 30 ];
    },
    panel: function(accentKey, surface) {
      var a = ACCENTS[accentKey] || ACCENTS.white;
      var su = Theme.rgb(surface);
      if (a.neutral) return su;
      var ac = hexToRgb(a.accent) || [ 255, 255, 255 ];
      var p = [ 0, 1, 2 ].map(function(i) {
        return Math.round(su[i] + (ac[i] - su[i]) * .2);
      });
      return p;
    },
    chip: function() {
      var st = {
        clear: [ 'transparent', '#fff', 'none', '0 1px 3px rgba(0,0,0,.8), 0 0 10px rgba(0,0,0,.45)' ],
        frost: [ 'rgba(255,255,255,.22)', '#fff', 'inset 0 0 0 1px rgba(255,255,255,.22)', '0 1px 2px rgba(0,0,0,.35)' ],
        glass: [ 'rgba(30,30,32,.34)', '#fff', 'inset 0 0 0 1px rgba(255,255,255,.16)', 'none' ],
        dark: [ 'rgba(10,10,12,.66)', '#fff', 'none', 'none' ],
        light: [ 'rgba(255,255,255,.92)', '#111', 'none', 'none' ]
      }[cfg.inmod_chip] || null;
      if (!st) st = [ 'rgba(255,255,255,.22)', '#fff', 'inset 0 0 0 1px rgba(255,255,255,.22)', '0 1px 2px rgba(0,0,0,.35)' ];
      return '--hz-chip-bg:' + st[0] + ';--hz-chip-fg:' + st[1] + ';--hz-chip-sh:' + st[2] + ';--hz-chip-ts:' + st[3] + ';';
    },
    vars: function() {
      var a = ACCENTS[cfg.inmod_accent] || ACCENTS.white;
      var b = BACKGROUNDS[cfg.inmod_bg] || BACKGROUNDS.graphite;
      var bg = b.bg, solid = b.solid, surface = b.surface, surface2 = b.surface2;
      if (cfg.inmod_bg === 'color') {
        var rgb = hexToRgb(cfg.inmod_bg_color) || [ 16, 24, 32 ];
        bg = 'radial-gradient(120% 90% at 50% -15%, ' + mix(rgb, [ 255, 255, 255 ], .12) + ' 0%, ' + mix(rgb, [ 0, 0, 0 ], 0) + ' 45%, ' + mix(rgb, [ 0, 0, 0 ], .65) + ' 100%)';
        solid = mix(rgb, [ 0, 0, 0 ], .2);
        surface = mix(rgb, [ 20, 20, 22 ], .6);
        surface2 = mix(rgb, [ 44, 44, 46 ], .55);
      }
      if (cfg.inmod_bg === 'image') {
        var url = (cfg.inmod_bg_image + '').trim();
        if (/^(https?:)?\/\//i.test(url) || /^data:image\//i.test(url)) {
          url = url.replace(/["\\\n\r]/g, '');
          bg = 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.62) 100%), url("' + url + '") center / cover no-repeat, #0c0c0d';
        } else {
          bg = BACKGROUNDS.graphite.bg;
        }
        solid = '#0c0c0d';
        surface = '#1c1c1e';
        surface2 = '#2c2c2e';
      }
      var poster = parseInt(cfg.inmod_bg_poster, 10);
      if (!(poster > 0 && poster <= 100)) poster = 100;
      var sc = Theme.scale();
      var panel = Theme.panel(cfg.inmod_accent, surface);
      var radius = {
        native: '',
        rounded: '.9em',
        squircle: '1.15em',
        circle: '999px',
        square: '.45em'
      }[cfg.inmod_btn_shape] || '1.15em';
      return [ ':root{', '--hz-accent:' + a.accent + ';', '--hz-on-accent:' + a.on + ';', '--hz-ring:' + a.ring + ';', '--hz-bg:' + (bg || 'none') + ';', '--hz-bg-solid:' + solid + ';', '--hz-surface:' + surface + ';', '--hz-surface-2:' + surface2 + ';', '--hz-poster-opacity:' + poster / 100 + ';', '--hz-bs:' + (sc || 1) + ';', '--hz-btn-r:' + (radius || '1em') + ';', '--hz-panel:rgba(' + panel.join(',') + ',.98);', '--hz-panel-glass:rgba(' + panel.join(',') + ',.72);', '--hz-icon:' + (a.neutral ? '#ffffff' : a.accent) + ';', '--hz-rs:' + (parseInt(cfg.inmod_rating_size, 10) || 100) / 100 + ';', Theme.chip(), '}', sc ? '' : '@media screen and (max-width:580px){:root{--hz-bs:1.32;}}' ].join('\n');
    },
    css: function() {
      if (Theme._css) return Theme._css;
      var spinner = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g>' + function() {
        var s = '';
        for (var i = 0; i < 12; i++) {
          s += '<rect x="29.5" y="6" width="5" height="15" rx="2.5" fill="#fff" opacity="' + (.15 + i * .07).toFixed(2) + '" transform="rotate(' + i * 30 + ' 32 32)"/>';
        }
        return s;
      }() + '<animateTransform attributeName="transform" type="rotate" calcMode="discrete" dur="1s" repeatCount="indefinite" ' + 'values="0 32 32;30 32 32;60 32 32;90 32 32;120 32 32;150 32 32;180 32 32;210 32 32;240 32 32;270 32 32;300 32 32;330 32 32"/>' + '</g></svg>');
      function mask(path) {
        return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>') + '")';
      }
      function maskFill(path) {
        return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000" d="' + path + '"/></svg>') + '")';
      }
      var MARK = {
        look: mask('<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>'),
        viewed: mask('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
        scheduled: mask('<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 3.5v3M15.5 3.5v3"/>'),
        continued: maskFill('M7.5 5.2v13.6c0 .8.9 1.3 1.6.9l10.6-6.8c.6-.4.6-1.4 0-1.8L9.1 4.3c-.7-.4-1.6.1-1.6.9z'),
        thrown: mask('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>')
      };
      function star(color) {
        return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="' + color + '" d="M12 2.4l2.95 6 6.6.95-4.78 4.66 1.13 6.57L12 17.47l-5.9 3.1 1.13-6.57L2.45 9.35l6.6-.95z"/></svg>');
      }
      var STAR_GOLD = star('#ffd60a'), STAR_WHITE = star('#ffffff');
      var B = 'body.hz-on';
      var FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Roboto, "Segoe UI", SegoeUI, Arial, sans-serif';
      var BS = 'var(--hz-bs)';
      var focusSel = [ '.menu__item.focus', '.menu__item.traverse', '.menu__item.hover', '.head__action.focus', '.head__action.hover', '.full-start__button.focus', '.simple-button.focus', '.selectbox-item.focus', '.settings-folder.focus', '.settings-param.focus', '.full-descr__tag.focus', '.tag-count.focus', '.search-source.focus', '.player-panel .button.focus', '.watched-history.focus', '.full-person.selector.focus', '.navigation-bar__item.focus' ].map(function(s) {
        return B + ' ' + s;
      }).join(',\n');
      var ringSel = [ '.card.focus .card__view::after', '.card.hover .card__view::after', '.card-more.focus .card-more__box::after', '.full-episode.focus::after', '.card-episode.focus .full-episode::after', '.torrent-item.focus::after', '.extensions__item.focus::after', '.extensions__block-add.focus::after', '.full-review-add.focus::after', '.explorer-card__head-img.selector.focus::after' ].map(function(s) {
        return B + ' ' + s;
      }).join(',\n');
      var BTN = B + ' .full-start-new .full-start__button';
      var css = [ 'html{background:var(--hz-bg-solid);}', B + '.hz-bg-set{background:var(--hz-bg-solid) !important;}', '#hz-bg{position:fixed;left:0;top:0;right:0;bottom:0;z-index:-1;pointer-events:none;display:none;' + '-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-backface-visibility:hidden;backface-visibility:hidden;}', '#hz-bg{background:var(--hz-bg);}', B + '.hz-bg-set #hz-bg,' + B + '.hz-snap #hz-bg{display:block;}', B + ' .background__fade{opacity:var(--hz-poster-opacity) !important;}', B + ' .background__one.visible,' + B + ' .background__two.visible{opacity:var(--hz-poster-opacity);}', B + '.hz-font{font-family:' + FONT + ';letter-spacing:-0.005em;}', B + '.hz-font .items-line__title{font-weight:600;letter-spacing:-0.015em;}', B + ' .card__age{color:rgba(235,235,245,.55);}', focusSel + '{background:var(--hz-accent) !important;color:var(--hz-on-accent) !important;}', B + ' .simple-button{border-radius:.9em;}', B + ' .selectbox-item,' + B + ' .settings-folder,' + B + ' .settings-param{border-radius:.8em;}', B + ' .settings-folder.focus .settings-folder__icon,' + B + ' .selectbox-item.focus .selectbox-item__checkbox,' + B + ' .settings-param.focus .selectbox-item__checkbox{-webkit-filter:none !important;filter:none !important;}', B + '.hz-on-dark .settings-folder.focus .settings-folder__icon:not(.hz-ico),' + B + '.hz-on-dark .selectbox-item.focus .selectbox-item__checkbox{-webkit-filter:invert(1) !important;filter:invert(1) !important;}', B + ':not(.hz-on-dark) .menu__item.focus .menu__ico > img,' + B + ':not(.hz-on-dark) .menu__item.traverse .menu__ico > img,' + B + ':not(.hz-on-dark) .menu__item.hover .menu__ico > img{-webkit-filter:none;filter:none;}', B + ' .menu__item.focus .menu__ico [stroke],' + B + ' .menu__item.traverse .menu__ico [stroke],' + B + ' .menu__item.hover .menu__ico [stroke]{stroke:var(--hz-on-accent);}', B + ' .menu__item.focus .menu__ico path[fill]:not([fill="none"]),' + B + ' .menu__item.focus .menu__ico rect[fill]:not([fill="none"]),' + B + ' .menu__item.focus .menu__ico circle[fill]:not([fill="none"]),' + B + ' .menu__item.traverse .menu__ico path[fill]:not([fill="none"]),' + B + ' .menu__item.hover .menu__ico path[fill]:not([fill="none"]){fill:var(--hz-on-accent);}', B + ' .menu__ico .hz-svg,' + B + ' .settings-folder__icon.hz-ico svg{width:100%;height:100%;}', ringSel + '{border-color:var(--hz-ring) !important;border-width:.22em !important;border-radius:1.3em;}', B + ' .card.hover .card__view::after{opacity:.55;}', B + ' .settings__content,' + B + ' .selectbox__content,' + B + ' .modal__content,' + B + ' .settings-input__content,' + B + ' .settings-input--free,' + B + ' .discuss-rules,' + B + ' .bell__item,' + B + ' .settings-input,' + B + ' .extensions{background-color:var(--hz-panel) !important;}', B + ' .modal__content{border-radius:1.4em;}', B + ' .settings-param-title > span{color:rgba(235,235,245,.6);text-transform:uppercase;font-size:.8em;letter-spacing:.06em;font-weight:600;}', B + ' .settings-param__descr{color:rgba(235,235,245,.6);}', B + ' .settings-param.focus .settings-param__descr,' + B + ' .settings-folder.focus .settings-param__descr{color:var(--hz-on-accent) !important;opacity:.62;}', B + ' .settings-param.focus .settings-param__value,' + B + ' .settings-param.focus .settings-param__name{color:var(--hz-on-accent) !important;}', B + ' .selectbox-item.focus .selectbox-item__subtitle{color:var(--hz-on-accent) !important;opacity:.62;}', B + ' .card__img,' + B + ' .card-more__box,' + B + ' .extensions__item,' + B + ' .extensions__block-add{background-color:var(--hz-surface-2);}', B + ' .torrent-serial{background-color:var(--hz-surface);}', B + ' .torrent-serial__size,' + B + ' .torrent-file__size{background-color:var(--hz-surface-2);}', B + '.hz-blur .settings__content,' + B + '.hz-blur .selectbox__content,' + B + '.hz-blur .modal__content,' + B + '.hz-blur .settings-input__content,' + B + '.hz-blur .navigation-bar__body{' + 'background-color:var(--hz-panel-glass) !important;-webkit-backdrop-filter:blur(28px) saturate(170%);backdrop-filter:blur(28px) saturate(170%);}', B + ' .activity__loader,' + B + ' .screensaver__preload{background:url("' + spinner + '") no-repeat 50% 50% !important;background-size:3.2em 3.2em !important;}', B + ' .card__view > .card__vote,' + B + ' .card__view > .card__quality,' + B + ' .card__view > .card__type,' + B + ' .full-start-new__poster > .card__type{display:none !important;}', B + ' .hz-row-t,' + B + ' .hz-row-b{position:absolute;left:0;right:0;z-index:2;pointer-events:none;box-sizing:border-box;' + 'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-justify-content:space-between;justify-content:space-between;' + 'padding:.5em;font-size:calc(1em * ' + BS + ');}', B + ' .hz-row-t{top:0;-webkit-align-items:flex-start;align-items:flex-start;}', B + ' .hz-row-b{bottom:0;-webkit-align-items:flex-end;align-items:flex-end;padding-top:1.9em;' + 'border-radius:0 0 calc(1em / ' + BS + ') calc(1em / ' + BS + ');background:linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0));}', B + ' .hz-row-b.hz-empty{display:none;}', B + ' .hz-l,' + B + ' .hz-r{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;}', B + ' .hz-l{-webkit-align-items:flex-start;align-items:flex-start;min-width:0;-webkit-flex:1 1 auto;flex:1 1 auto;}', B + ' .hz-r{-webkit-align-items:flex-end;align-items:flex-end;-webkit-flex:0 0 auto;flex:0 0 auto;margin-left:auto;padding-left:.35em;}', B + ' .hz-l > * + *,' + B + ' .hz-r > * + *{margin-top:.3em;}', B + ' .hz-it{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1;color:#fff;box-sizing:border-box;}', B + ' .hz-vote{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;font-weight:700;letter-spacing:-.02em;' + 'font-variant-numeric:tabular-nums;font-size:calc(1.05em * var(--hz-rs));}', B + ' .hz-vote i{display:inline-block;-webkit-flex-shrink:0;flex-shrink:0;width:.74em;height:.74em;margin-right:.2em;background:url("' + STAR_GOLD + '") center / contain no-repeat;}', B + '.hz-star-mono .hz-vote i{background-image:url("' + STAR_WHITE + '");}', B + ' .hz-kind,' + B + ' .hz-year{font-size:.62em;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-variant-numeric:tabular-nums;}', B + ' .hz-q{font-size:.58em;font-weight:700;letter-spacing:.05em;padding:.28em .38em .26em;border-radius:.32em;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.8);}', B + ' .hz-q--4k{background:#fff;color:#0b0b0c;box-shadow:none;}', B + ' .hz-row-t .hz-kind,' + B + ' .hz-row-t .hz-year,' + B + ' .hz-row-t .hz-vote{padding:.5em .62em .46em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-row-t .hz-vote{font-size:calc(.86em * var(--hz-rs));padding:.36em .5em .34em .42em;}', B + ' .hz-row-b .hz-kind,' + B + ' .hz-row-b .hz-year{color:rgba(255,255,255,.8);}', B + '.hz-scrim-light .hz-row-b{background:linear-gradient(to top, rgba(0,0,0,.5), rgba(0,0,0,0));}', B + '.hz-scrim-none .hz-row-b{background:none;}', B + '.hz-scrim-none .hz-row-b .hz-kind,' + B + '.hz-scrim-none .hz-row-b .hz-year,' + B + '.hz-scrim-none .hz-row-b .hz-vote{padding:.45em .58em .42em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-row-t .card__marker,' + B + ' .hz-row-b .card__marker{position:static !important;max-width:100%;box-sizing:border-box;' + 'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;' + 'font-size:.8em;font-weight:600;line-height:1;white-space:nowrap;padding:.42em .55em .42em .45em;border-radius:.6em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-row-t .card__marker > span,' + B + ' .hz-row-b .card__marker > span{font-size:1em;max-width:none;min-width:0;overflow:hidden;text-overflow:ellipsis;}', B + ' .card__marker::before{width:1em !important;height:1em !important;margin-right:.36em !important;border-radius:0 !important;background-color:currentColor !important;-webkit-flex-shrink:0;flex-shrink:0;}', B + ' .card__marker--look::before{-webkit-mask:' + MARK.look + ' center / contain no-repeat;mask:' + MARK.look + ' center / contain no-repeat;}', B + ' .card__marker--viewed::before{-webkit-mask:' + MARK.viewed + ' center / contain no-repeat;mask:' + MARK.viewed + ' center / contain no-repeat;}', B + ' .card__marker--scheduled::before{-webkit-mask:' + MARK.scheduled + ' center / contain no-repeat;mask:' + MARK.scheduled + ' center / contain no-repeat;}', B + ' .card__marker--continued::before{-webkit-mask:' + MARK.continued + ' center / contain no-repeat;mask:' + MARK.continued + ' center / contain no-repeat;}', B + ' .card__marker--thrown::before{-webkit-mask:' + MARK.thrown + ' center / contain no-repeat;mask:' + MARK.thrown + ' center / contain no-repeat;}', B + ' .hz-row-t .card__icons,' + B + ' .hz-row-b .card__icons{position:static !important;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;}', B + ' .hz-row-t .card__icons > .card__marker,' + B + ' .hz-row-b .card__icons > .card__marker{margin-right:.3em;}', B + ' .hz-row-t .card__icons-inner,' + B + ' .hz-row-b .card__icons-inner{display:-webkit-box;display:-webkit-flex;display:flex;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);border-radius:1em;padding:0;}', B + ' .hz-row-t .card__icons-inner:empty,' + B + ' .hz-row-b .card__icons-inner:empty{display:none;}', B + ' .hz-row-t .card__icon,' + B + ' .hz-row-b .card__icon{width:1.5em;height:1.5em;margin:.06em;background-size:54%;}', B + '.hz-hide-marker .card__marker{display:none !important;}', B + '.hz-chip-glass .hz-row-t .hz-kind,' + B + '.hz-chip-glass .hz-row-t .hz-year,' + B + '.hz-chip-glass .hz-row-t .hz-vote,' + B + '.hz-chip-glass .hz-row-t .card__marker,' + B + '.hz-chip-glass .hz-row-b .card__marker,' + B + '.hz-chip-glass .card__icons-inner,' + B + '.hz-chip-glass.hz-scrim-none .hz-row-b .hz-it,' + B + '.hz-chip-glass .hz-badge,' + B + '.hz-chip-glass .hz-season{' + '-webkit-backdrop-filter:blur(12px) saturate(180%);backdrop-filter:blur(12px) saturate(180%);}', B + '.hz-chip-light .card__icon{-webkit-filter:invert(1);filter:invert(1);}', B + '.hz-chip-clear .card__icons-inner,' + B + '.hz-chip-clear.hz-mark-icon .card__icons > .card__marker{' + 'background:radial-gradient(closest-side, rgba(0,0,0,.42), rgba(0,0,0,0)) !important;}', B + '.hz-chip-clear .card__icon{opacity:.94;}', B + ' .card__icons > .card__marker{margin-right:.15em;}', B + '.hz-mark-icon .hz-row-t .card__marker,' + B + '.hz-mark-icon .hz-row-b .card__marker{width:1.86em;height:1.86em;padding:0;border-radius:50%;' + '-webkit-justify-content:center;justify-content:center;font-size:.8em;}', B + '.hz-mark-icon .card__marker > span{display:none !important;}', B + '.hz-mark-icon .card__marker::before{margin-right:0 !important;width:.95em !important;height:.95em !important;}', B + '.hz-hide-icons .card__view .card__icons{display:none !important;}', B + ' .card__new-episode > div{background:#fff;color:#0b0b0c;font-weight:600;}', B + '.hz-no-age .card__age{display:none;}', B + '.hz-nav-panel .navigation-bar .navigation-bar__body{background:var(--hz-panel) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}', B + '.hz-nav-glass .navigation-bar .navigation-bar__body{background:var(--hz-panel-glass) !important;-webkit-backdrop-filter:blur(24px) saturate(170%);backdrop-filter:blur(24px) saturate(170%);}', B + ' .settings-folder__icon.hz-ico{color:var(--hz-icon);}', B + ' .settings-folder.focus .settings-folder__icon.hz-ico{color:var(--hz-on-accent);}', B + ' .full-start__pg,' + B + ' .full-start__status{border:1px solid rgba(255,255,255,.38) !important;border-radius:.45em !important;' + 'padding:.28em .5em !important;color:rgba(255,255,255,.88) !important;background:transparent !important;font-weight:500;}', B + ' .full-start__rate{border-radius:.55em;background:rgba(10,10,12,.45);}', B + ' .full-start-new__poster{position:relative;}', B + ' .hz-badge{position:absolute;z-index:3;top:.6em;left:.6em;font-size:calc(.64em * ' + BS + ');font-weight:600;text-transform:uppercase;letter-spacing:.09em;line-height:1;' + 'padding:.55em .7em .5em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-season{position:absolute;z-index:3;font-size:calc(.72em * ' + BS + ');font-weight:600;line-height:1;white-space:nowrap;' + 'padding:.55em .7em .5em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);letter-spacing:.01em;font-variant-numeric:tabular-nums;}', B + ' .hz-season b{font-weight:600;opacity:.6;margin:0 .35em;}', B + '.hz-btn-shape ' + '.full-start-new .full-start__button{border-radius:var(--hz-btn-r) !important;}', B + '.hz-btn-circle .full-start-new .full-start__button:not(.focus){padding-left:.65em !important;padding-right:.65em !important;}', B + '.hz-btnf-glass ' + '.full-start-new .full-start__button:not(.focus){background:rgba(255,255,255,.13) !important;}', B + '.hz-btnf-dark ' + '.full-start-new .full-start__button:not(.focus){background:rgba(0,0,0,.38) !important;}', B + '.hz-btnf-clear ' + '.full-start-new .full-start__button:not(.focus){background:transparent !important;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28) !important;}', B + '.hz-btns-none ' + '.full-start-new .full-start__button{box-shadow:none !important;-webkit-filter:none !important;filter:none !important;text-shadow:none !important;}', B + '.hz-btns-none.hz-btnf-clear .full-start-new .full-start__button:not(.focus){box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28) !important;}', B + '.hz-btns-soft ' + '.full-start-new .full-start__button{box-shadow:0 .2em .7em rgba(0,0,0,.22) !important;}', B + ' .full-start-new .full-start__button > svg.hz-bi{width:1.42em;height:1.42em;}', '@media screen and (max-width:480px){' + B + '.hz-mcenter .full-start-new__right{background:transparent !important;}' + B + '.hz-mcenter .full-start-new__head,' + B + '.hz-mcenter .full-start-new__title,' + B + '.hz-mcenter .full-start__title-original,' + B + '.hz-mcenter .full-start__rate,' + B + '.hz-mcenter .full-start-new__reactions,' + B + '.hz-mcenter .full-start-new__rate-line,' + B + '.hz-mcenter .full-start-new__buttons,' + B + '.hz-mcenter .full-start-new__details,' + B + '.hz-mcenter .full-start-new__tagline{' + '-webkit-justify-content:center;justify-content:center;text-align:center;max-width:100%;}' + B + '.hz-mcenter .full-start-new__buttons{overflow:auto;}' + B + ' .full-start-new__poster .hz-badge{display:none;}' + '}', '@media screen and (min-width:581px){' + B + ' .full-start-new__left{width:21em;}}', B + ' .full-start-new__buttons{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:.5em;}', B + ' .full-start-new__buttons .inmod-source-btn.inmod-torrent-btn{-webkit-order:-30;order:-30;}', B + ' .full-start-new__buttons .button--priority{-webkit-order:-20;order:-20;}', B + ' .full-start-new__buttons .inmod-source-btn:not(.inmod-torrent-btn){-webkit-order:-10;order:-10;}', B + ' .full-start-new.inmod-sources-ready .button--play:not(.button--priority){display:none !important;}', B + ' .full-start__button.view--online[data-inmod-online] svg{width:1.35em;height:1.35em;}', B + ' .inmod-logo-container{display:flex;justify-content:flex-start;align-items:flex-end;width:100%;min-height:90px;}', B + ' .inmod-logo-container img{max-height:120px;max-width:80%;opacity:0;transition:opacity .4s ease;object-fit:contain;object-position:left bottom;}', B + ' .inmod-logo-container img.inmod-logo-visible{opacity:1;}', '@media screen and (max-width:580px){' + B + ' .inmod-logo-container{justify-content:center;align-items:center;min-height:70px;}' + B + ' .inmod-logo-container img{max-height:80px;max-width:90%;object-position:center;}}', B + '.hz-torrents .ts-pill{display:inline-flex;align-items:center;justify-content:center;min-height:1.7em;padding:.15em .5em;border-radius:.5em;' + 'font-weight:600;font-size:.9em;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums;background:rgba(255,255,255,.1);color:rgba(255,255,255,.92);}', B + '.hz-torrents .torrent-item__bitrate,' + B + '.hz-torrents .torrent-item__grabs,' + B + '.hz-torrents .torrent-item__seeds{margin-right:.55em;}', B + '.hz-torrents .ts-pill.ts-low{opacity:.45;}', B + '.hz-torrents .ts-pill.ts-top{background:#fff;color:#0b0b0c;}', B + '.hz-torrents .ts-pill.ts-big{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6);}', B + '.hz-anim:not(.touch-device) .card .card__view{transition:transform .28s cubic-bezier(.2,.8,.2,1);}', B + '.hz-anim .card.focus .card__view{-webkit-transform:scale(1.045);transform:scale(1.045);}', B + '.hz-anim .items-cards .card.selector,' + B + '.hz-anim .items-cards .card.selector.focus{transform:none !important;}', B + '.hz-anim .full-start__button.focus,' + B + '.hz-anim .simple-button.focus{-webkit-transform:scale(1.04);transform:scale(1.04);transition:transform .2s ease;}' ];
      Theme._css = css.join('\n');
      return Theme._css;
    },
    layers: function() {
      if (!document.body) return;
      if (!document.getElementById('hz-bg')) {
        var a = document.createElement('div');
        a.id = 'hz-bg';
        document.body.insertBefore(a, document.body.firstChild);
      }
    },
    apply: function() {
      if (!isActive()) return Theme.disable();
      var a = ACCENTS[cfg.inmod_accent] || ACCENTS.white;
      Theme.layers();
      addStyle('hz_vars', Theme.vars());
      addStyle('hz_theme', Theme.css());
      var on = {
        'hz-on': true,
        'hz-on-dark': !!a.dark,
        'hz-bg-set': cfg.inmod_bg !== 'lampa',
        'hz-font': cfg.inmod_font,
        'hz-blur': cfg.inmod_blur,
        'hz-anim': cfg.inmod_animations,
        'hz-torrents': cfg.inmod_torrent_styles,
        'hz-star-mono': cfg.inmod_star === 'mono',
        'hz-no-age': !cfg.inmod_title_year,
        'hz-scrim-light': cfg.inmod_scrim === 'light',
        'hz-scrim-none': cfg.inmod_scrim === 'none',
        'hz-nav-panel': cfg.inmod_navbar === 'panel' && !cfg.inmod_blur,
        'hz-nav-glass': cfg.inmod_navbar === 'glass' || cfg.inmod_blur && cfg.inmod_navbar !== 'native',
        'hz-hide-marker': cfg.inmod_pos_marker === 'off',
        'hz-mark-icon': !cfg.inmod_marker_text,
        'hz-chip-clear': cfg.inmod_chip === 'clear',
        'hz-chip-glass': cfg.inmod_chip === 'glass',
        'hz-chip-light': cfg.inmod_chip === 'light',
        'hz-hide-icons': cfg.inmod_pos_icons === 'off',
        'hz-btn-shape': cfg.inmod_btn_shape !== 'native',
        'hz-btn-circle': cfg.inmod_btn_shape === 'circle',
        'hz-btnf-glass': cfg.inmod_btn_fill === 'glass',
        'hz-btnf-dark': cfg.inmod_btn_fill === 'dark',
        'hz-btnf-clear': cfg.inmod_btn_fill === 'clear',
        'hz-btns-none': cfg.inmod_btn_shadow === 'none',
        'hz-btns-soft': cfg.inmod_btn_shadow === 'soft',
        'hz-mcenter': cfg.inmod_mobile_full === 'center',
        'hz-snap': cfg.inmod_bg_remember && Backdrop.hasSnap()
      };
      for (var c in on) if (on.hasOwnProperty(c)) bodyClass(c, on[c]);
      Backdrop.paintSnap();
      try {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta && cfg.inmod_bg !== 'lampa') meta.setAttribute('content', (BACKGROUNDS[cfg.inmod_bg] || {}).solid || '#1c1c1e');
      } catch (e) {}
    },
    disable: function() {
      removeStyle('hz_vars');
      removeStyle('hz_theme');
      if (document.body) {
        var cls = (document.body.className || '').split(/\s+/);
        for (var i = 0; i < cls.length; i++) if (/^hz-/.test(cls[i])) document.body.classList.remove(cls[i]);
      }
    }
  };
  var Backdrop = {
    KEY: 'inmod_bg_last',
    SNAP: 'inmod_bg_snap',
    timer: null,
    _snap: undefined,
    getSnap: function() {
      if (Backdrop._snap === undefined) {
        try {
          Backdrop._snap = localStorage.getItem(Backdrop.SNAP) || '';
        } catch (e) {
          Backdrop._snap = '';
        }
      }
      return Backdrop._snap;
    },
    hasSnap: function() {
      return !!Backdrop.getSnap();
    },
    paintSnap: function() {
      var url = Backdrop.getSnap();
      var on = !!(url && isActive() && cfg.inmod_bg_remember);
      var el = document.getElementById('hz-bg');
      if (el) {
        var key = on ? url.length + '|' + cfg.inmod_bg_poster + '|' + cfg.inmod_bg + cfg.inmod_bg_color : '';
        if (el.__hz_key !== key) {
          el.__hz_key = key;
          if (on) {
            var op = parseInt(cfg.inmod_bg_poster, 10) || 100;
            var dim = Math.max(0, Math.min(1, 1 - op / 100)).toFixed(2);
            var solid = hexToRgb((BACKGROUNDS[cfg.inmod_bg] || {}).solid || '#1c1c1e') || [ 28, 28, 30 ];
            var veil = 'rgba(' + solid.join(',') + ',' + dim + ')';
            el.style.background = 'linear-gradient(' + veil + ',' + veil + '), url("' + url + '") center / cover no-repeat, var(--hz-bg-solid)';
          } else el.style.background = '';
        }
      }
      bodyClass('hz-snap', on);
    },
    capture: function(id) {
      if (id && id === Backdrop.lastId) return;
      clearTimeout(Backdrop.timer);
      Backdrop.timer = setTimeout(function() {
        idle(function() {
          if (!isActive() || !cfg.inmod_bg_remember) return;
          try {
            var c = document.querySelector('.background__one.visible, .background__two.visible') || document.querySelector('.background__fade');
            if (!c || !c.width || !c.height) return;
            var ctx = c.getContext('2d');
            var px = ctx.getImageData(Math.floor(c.width / 2), Math.floor(c.height * .6), 1, 1).data;
            if (!px[3]) return;
            var w = 240, h = Math.max(1, Math.round(w * c.height / c.width));
            var t = document.createElement('canvas');
            t.width = w;
            t.height = h;
            t.getContext('2d').drawImage(c, 0, 0, w, h);
            var url = t.toDataURL('image/webp', .72);
            if (url.indexOf('data:image/webp') !== 0) url = t.toDataURL('image/png');
            if (url.length > 4e5) return;
            localStorage.setItem(Backdrop.SNAP, url);
            Backdrop._snap = url;
            Backdrop.lastId = id || '';
            Backdrop.paintSnap();
          } catch (e) {}
        }, 3e3);
      }, 2600);
    },
    remember: function(movie) {
      if (!isActive() || !cfg.inmod_bg_remember || !movie) return;
      if (!movie.backdrop_path && !movie.poster_path && !movie.img && !movie.poster) return;
      try {
        Lampa.Storage.set(Backdrop.KEY, {
          backdrop_path: movie.backdrop_path || '',
          poster_path: movie.poster_path || '',
          img: movie.img || '',
          poster: movie.poster || '',
          title: movie.title || movie.name || ''
        });
      } catch (e) {}
      Backdrop.capture((movie.id || '') + (movie.backdrop_path || movie.poster_path || ''));
    },
    restore: function() {
      if (!isActive() || !cfg.inmod_bg_remember) return;
      if (Backdrop.hasSnap()) return Backdrop.paintSnap();
      var saved;
      try {
        saved = Lampa.Storage.get(Backdrop.KEY, '{}');
      } catch (e) {
        return;
      }
      if (typeof saved === 'string') {
        try {
          saved = JSON.parse(saved);
        } catch (e) {
          saved = null;
        }
      }
      if (!saved || !saved.backdrop_path && !saved.poster_path && !saved.img && !saved.poster) return;
      if (!Lampa.Background || !Lampa.Utils || typeof Lampa.Utils.cardImgBackgroundBlur !== 'function') return;
      var url = '';
      try {
        url = Lampa.Utils.cardImgBackgroundBlur(saved);
      } catch (e) {}
      if (!url) return;
      try {
        Lampa.Background.immediately(url);
      } catch (e) {}
      Backdrop.capture();
    },
    clear: function() {
      try {
        Lampa.Storage.set(Backdrop.KEY, {});
        localStorage.removeItem(Backdrop.SNAP);
      } catch (e) {}
      Backdrop._snap = '';
      var el = document.getElementById('hz-bg');
      if (el) {
        el.style.background = '';
        el.__hz_key = '';
      }
      bodyClass('hz-snap', false);
      try {
        var list = document.querySelectorAll('.background canvas');
        for (var i = 0; i < list.length; i++) list[i].getContext('2d').clearRect(0, 0, list[i].width, list[i].height);
      } catch (e) {}
    }
  };
  var Badges = {
    tpl: {},
    tplCount: 0,
    isTv: function(d, el) {
      return !!(d.original_name || d.first_air_date || d.number_of_seasons || d.media_type === 'tv' || el && el.classList.contains('card--tv'));
    },
    isMedia: function(d) {
      if (!d) return false;
      var style = d.params && d.params.style && d.params.style.name;
      if (style && style !== 'default') return false;
      if ((d.profile_path || d.known_for_department) && !d.poster_path) return false;
      return !!(d.poster_path || d.poster || d.img || d.title || d.name);
    },
    quality: function(q) {
      q = ((q || '') + '').toUpperCase().replace(/[\s_-]/g, '');
      if (!q) return '';
      if (/2160|UHD|4K/.test(q)) return '4K';
      if (/1080|FHD|FULLHD/.test(q)) return 'FHD';
      if (/720|^HD/.test(q)) return 'HD';
      if (/WEB/.test(q)) return 'WEB';
      if (/BD|BLU|REMUX/.test(q)) return 'BD';
      if (/CAM|^TS|TELESYNC|^TC/.test(q)) return 'CAM';
      if (/DVD/.test(q)) return 'DVD';
      return q.length <= 4 ? q : '';
    },
    vote: function(d) {
      var v = parseFloat((d.cub_hundred_rating || d.vote_average || 0) + '');
      if (!(v > 0)) return '';
      return (v >= 10 ? 10 : v).toFixed(1);
    },
    POS: [ 'tl', 'tr', 'bl', 'br' ],
    build: function(vote, kind, q, year) {
      var items = {
        tl: [],
        tr: [],
        bl: [],
        br: []
      };
      function put(pos, html) {
        if (html && items[pos]) items[pos].push(html);
      }
      var py = cfg.inmod_pos_year, pk = cfg.inmod_pos_type;
      if (year && kind && py === pk) put(pk, '<span class="hz-it hz-kind">' + year + ' · ' + kind + '</span>'); else {
        if (kind) put(pk, '<span class="hz-it hz-kind">' + kind + '</span>');
        if (year) put(py, '<span class="hz-it hz-year">' + year + '</span>');
      }
      if (vote) put(cfg.inmod_pos_rating, '<span class="hz-it hz-vote"><i></i>' + vote + '</span>');
      if (q) put(cfg.inmod_pos_quality, '<span class="hz-it hz-q' + (q === '4K' ? ' hz-q--4k' : '') + '">' + q + '</span>');
      return items;
    },
    node: function(vote, kind, q, year) {
      var key = vote + '|' + kind + '|' + q + '|' + year;
      var t = Badges.tpl[key];
      if (!t) {
        var it = Badges.build(vote, kind, q, year);
        var mk = cfg.inmod_pos_marker, ic = cfg.inmod_pos_icons;
        var grp = function(p, cls) {
          return it[p].length || mk === p || ic === p ? '<div class="' + cls + '" data-p="' + p + '">' + it[p].join('') + '</div>' : '';
        };
        var t1 = grp('tl', 'hz-l') + grp('tr', 'hz-r'), b1 = grp('bl', 'hz-l') + grp('br', 'hz-r');
        var html = '';
        if (t1) html += '<div class="hz-row-t">' + t1 + '</div>';
        if (b1) html += '<div class="hz-row-b' + (it.bl.length || it.br.length ? '' : ' hz-empty') + '">' + b1 + '</div>';
        t = document.createElement('div');
        t.innerHTML = html;
        if (Badges.tplCount++ > 600) {
          Badges.tpl = {};
          Badges.tplCount = 0;
        }
        Badges.tpl[key] = t;
      }
      var frag = document.createDocumentFragment();
      for (var c = t.firstChild; c; c = c.nextSibling) frag.appendChild(c.cloneNode(true));
      return frag;
    },
    slot: function(view, pos) {
      if (!pos || pos === 'off') return null;
      var rows = view.children;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (r.className.indexOf('hz-row-') !== 0) continue;
        var g = r.children;
        for (var j = 0; j < g.length; j++) if (g[j].getAttribute('data-p') === pos) return g[j];
      }
      return null;
    },
    adopt: function(node) {
      var view = node.parentNode;
      if (!view || !view.classList || !view.classList.contains('card__view')) return;
      var isMarker = node.classList.contains('card__marker');
      var slot = Badges.slot(view, isMarker ? cfg.inmod_pos_marker : cfg.inmod_pos_icons);
      if (!slot) return;
      var icons = null;
      for (var c = slot.firstElementChild; c; c = c.nextElementSibling) if (c.classList.contains('card__icons')) icons = c;
      if (isMarker) {
        if (icons) icons.insertBefore(node, icons.firstChild); else if (slot.getAttribute('data-p').charAt(1) === 'r') slot.appendChild(node); else slot.insertBefore(node, slot.firstChild);
      } else {
        slot.appendChild(node);
        var mk = slot.querySelector('.card__marker');
        if (mk && mk.parentNode === slot) node.insertBefore(mk, node.firstChild);
      }
      var row = slot.parentNode;
      if (row.classList.contains('hz-empty') && isMarker) row.classList.remove('hz-empty');
    },
    processCard: function(el) {
      if (el.__hz_badge) return;
      el.__hz_badge = true;
      if (!isActive()) return;
      var d = el.card_data;
      if (!Badges.isMedia(d)) return;
      var view = el.firstElementChild && el.firstElementChild.classList.contains('card__view') ? el.firstElementChild : el.querySelector('.card__view');
      if (!view) return;
      var tv = Badges.isTv(d, el);
      var mode = cfg.inmod_badge_type;
      var on = function(k) {
        return cfg[k] && cfg[k] !== 'off';
      };
      var kind = !on('inmod_pos_type') || mode === 'off' || mode === 'tv' && !tv ? '' : tv ? Badges.kindTv : Badges.kindMovie;
      var vote = on('inmod_pos_rating') ? Badges.vote(d) : '';
      var q = on('inmod_pos_quality') && !tv ? Badges.quality(d.quality || d.release_quality) : '';
      var year = on('inmod_pos_year') ? ((d.release_date || d.first_air_date || '') + '').slice(0, 4) : '';
      if (!/^\d{4}$/.test(year)) year = '';
      view.appendChild(Badges.node(vote, kind, q, year));
      var kids = view.children;
      for (var i = kids.length - 1; i >= 0; i--) {
        var k = kids[i];
        if (k.classList.contains('card__icons') || k.classList.contains('card__marker')) Badges.adopt(k);
      }
    },
    full: function(movie, root) {
      try {
        var poster = $(root).find('.full-start-new__poster').first();
        if (!poster.length) return;
        poster.find('.hz-badge').remove();
        if (!isActive() || cfg.inmod_badge_type === 'off') return;
        var tv = !!(movie.number_of_seasons || movie.seasons || movie.original_name || movie.first_air_date);
        if (cfg.inmod_badge_type === 'tv' && !tv) return;
        poster.append($('<div class="hz-badge"></div>').text(tv ? Badges.kindTv : Badges.kindMovie));
      } catch (e) {}
    },
    reset: function() {
      var rows = document.querySelectorAll('.hz-row-t, .hz-row-b, .hz-badge');
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i], view = r.parentNode;
        var nat = r.querySelectorAll('.card__marker, .card__icons');
        for (var n = 0; n < nat.length; n++) view.appendChild(nat[n]);
        view.removeChild(r);
      }
      var cards = document.getElementsByClassName('card');
      for (var j = 0; j < cards.length; j++) cards[j].__hz_badge = false;
    },
    refreshAll: function() {
      Badges.tpl = {};
      Badges.tplCount = 0;
      Badges.reset();
      if (!isActive()) return;
      var cards = document.getElementsByClassName('card');
      for (var i = 0; i < cards.length; i++) Badges.processCard(cards[i]);
    }
  };
  var Icons = {
    setMenu: function(li, name) {
      if (!li || li.__hz_icon === name) return;
      var ico = li.querySelector('.menu__ico');
      if (!ico) return;
      if (!li.__hz_orig_icon) li.__hz_orig_icon = ico.innerHTML;
      ico.innerHTML = ICONS[name];
      ico.firstChild && ico.firstChild.setAttribute && ico.firstChild.setAttribute('class', 'hz-svg');
      li.__hz_icon = name;
    },
    applyMenu: function(root) {
      if (!isActive() || !cfg.inmod_icons) return;
      root = root || document;
      var list = root.classList && root.classList.contains('menu__item') ? [ root ] : root.getElementsByClassName ? root.getElementsByClassName('menu__item') : [];
      for (var i = 0; i < list.length; i++) {
        var li = list[i];
        if (li.__hz_icon) continue;
        var t = li.querySelector('.menu__text');
        var name = iconFor(t && t.textContent);
        if (name) Icons.setMenu(li, name);
      }
    },
    restoreMenu: function() {
      var list = document.querySelectorAll('.menu__item');
      for (var i = 0; i < list.length; i++) {
        var li = list[i];
        if (li.__hz_icon && li.__hz_orig_icon) {
          var ico = li.querySelector('.menu__ico');
          if (ico) ico.innerHTML = li.__hz_orig_icon;
        }
        li.__hz_icon = null;
      }
    },
    applySettings: function(body) {
      if (!isActive() || !cfg.inmod_icons || !Lampa.SettingsApi.getComponent) return;
      var $body = body && body.jquery ? body : $(body || document.body);
      $body.find('.settings-folder[data-component]').each(function() {
        var comp = this.getAttribute('data-component');
        var c = null;
        try {
          c = Lampa.SettingsApi.getComponent(comp);
        } catch (e) {}
        if (!c) return;
        var name = comp === COMPONENT ? 'palette' : iconFor(c.name);
        if (!name) return;
        if (!c.__hz_orig_icon) {
          c.__hz_orig_icon = c.icon;
          c.icon = ICONS[name];
          Icons.patched.push(c);
        }
        var f = this.querySelector('.settings-folder__icon');
        if (f && !f.classList.contains('hz-ico')) {
          f.classList.add('hz-ico');
          f.innerHTML = ICONS[name];
        }
      });
    },
    patched: [],
    restoreSettings: function() {
      Icons.patched.forEach(function(c) {
        if (c.__hz_orig_icon !== undefined) {
          c.icon = c.__hz_orig_icon;
          delete c.__hz_orig_icon;
        }
      });
      Icons.patched = [];
    }
  };
  var OnlineIcons = {
    titles: {
      bwarc: 'BwaRC',
      dso: 'DSO',
      lampac: 'Lampac'
    },
    icons: {
      bwarc: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11.783 10.094c-1.699.998-3.766 1.684-5.678 1.95a1.66 1.66 0 0 1-.684.934c.512 1.093 1.249 2.087 2.139 2.987a7.98 7.98 0 0 0 6.702-3.074l.083-.119c-.244-.914-.648-1.784-1.145-2.644q-.134.038-.261.062c-.143.04-.291.068-.446.068a1.7 1.7 0 0 1-.71-.164M9.051 5.492a18 18 0 0 0-2.004-1.256 1.67 1.67 0 0 1-1.907.985c-.407 1.535-.624 3.162-.511 4.694a1.67 1.67 0 0 1 1.52 1.354c1.695-.279 3.47-.879 4.967-1.738a1.67 1.67 0 0 1-.297-.949c0-.413.156-.786.403-1.078-.654-.736-1.389-1.443-2.171-2.012M4 9.989c-.137-1.634.104-3.392.541-5.032a1.67 1.67 0 0 1-.713-1.369c0-.197.039-.386.104-.562a18 18 0 0 0-1.974-.247c-.089.104-.185.204-.269.314a7.98 7.98 0 0 0-1.23 7.547 9.5 9.5 0 0 0 2.397.666A1.67 1.67 0 0 1 4 9.989m9.928-.3c-.029.037-.064.067-.096.1.433.736.799 1.482 1.053 2.268a7.98 7.98 0 0 0 .832-6.122c-.09.133-.176.267-.271.396-.436.601-.875 1.217-1.354 1.772.045.152.076.311.076.479v.004c.084.374.013.779-.24 1.103M7.164 3.447c.799.414 1.584.898 2.33 1.44.84.611 1.627 1.373 2.324 2.164.207-.092.434-.145.676-.145.5 0 .945.225 1.252.572.404-.492.783-1.022 1.161-1.54.194-.268.372-.543.544-.82A7.96 7.96 0 0 0 7.701.012q-.173.217-.339.439c-.401.552-.739 1.08-1.04 1.637.039.029.064.066.1.1.417.276.697.734.742 1.259m-4.285 8.518a10 10 0 0 1-2.07-.487 7.95 7.95 0 0 0 5.806 4.397 11 11 0 0 1-1.753-2.66 1.675 1.675 0 0 1-1.983-1.25m1.635-9.723a1.32 1.32 0 0 1 1.199-.416C6.025 1.24 6.377.683 6.794.104a7.97 7.97 0 0 0-4.247 2.062c.59.066 1.176.14 1.761.252q.096-.095.206-.176" fill="currentColor"></path></svg>',
      lampac: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="9" r="2.2" stroke="currentColor" stroke-width="2.4"></circle><circle cx="6.5" cy="15" r="2.2" stroke="currentColor" stroke-width="2.4"></circle><rect x="9.4" y="8" width="7.8" height="8" rx="2.2" stroke="currentColor" stroke-width="2.4"></rect><circle cx="17.8" cy="12" r="1.6" stroke="currentColor" stroke-width="2.2"></circle><path d="M19.7 10.9L22.3 9.8V14.2L19.7 13.1" stroke="currentColor" stroke-width="2.0" stroke-linejoin="round"></path><path d="M8.2 19.8H18.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path><path d="M10.2 16V19.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path><path d="M16.2 16V19.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>',
      dso: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 24"><path fill="currentColor" d="M0 13.75C0 19.411 4.589 24 10.25 24S20.5 19.411 20.5 13.75a12.063 12.063 0 0 0-1.531-5.501L19 8.31a3.781 3.781 0 0 1-.781-2.309V6c0-1.75 1.846-3.5 3.78-3.5h.247a1.251 1.251 0 0 0 .002-2.5h-.252c-3.075 0-5.706 1.64-6.33 5a9.12 9.12 0 0 0-5.438-1.499l.019-.001C4.588 3.503.002 8.09.001 13.749zm9 0a1.25 1.25 0 1 1 1.25 1.251h-.003a1.25 1.25 0 0 1-1.246-1.25v-.001zm-6.5 0a2.247 2.247 0 1 1 0 .003v-.003zm11 0a2.247 2.247 0 1 1 0 .003v-.003zM8 19.25a2.25 2.25 0 1 1 2.25 2.25h-.004A2.25 2.25 0 0 1 8 19.25zm0-11a2.247 2.247 0 1 1 4.494.002a2.247 2.247 0 0 1-4.494 0v-.003z"/></svg>'
    },
    parse: function(raw) {
      var token = ((raw || '') + '').trim().split(/\s+/)[0].toLowerCase();
      if (token === 'bwarc' || token === 'bwa') return 'bwarc';
      if (token === 'dso') return 'dso';
      if (token === 'lampac') return 'lampac';
      return '';
    },
    patch: function(btn) {
      var $btn = $(btn);
      if (!$btn.is('.full-start__button.view--online')) return;
      var provider = OnlineIcons.parse($btn.attr('data-subtitle') || $btn.data('subtitle'));
      if (!provider || $btn.attr('data-inmod-online') === provider) return;
      if (!$btn.attr('data-inmod-orig')) $btn.attr('data-inmod-orig', encodeURIComponent($btn.html() || ''));
      $btn.attr('data-inmod-online', provider);
      $btn.empty().append(OnlineIcons.icons[provider] + '<span>' + OnlineIcons.titles[provider] + '</span>');
    },
    scan: function(root) {
      if (!isActive() || !cfg.inmod_patch_online_icons || !root) return;
      if (root.matches && root.matches('.full-start__button.view--online')) OnlineIcons.patch(root);
      if (root.querySelectorAll) {
        var list = root.querySelectorAll('.full-start__button.view--online');
        for (var i = 0; i < list.length; i++) OnlineIcons.patch(list[i]);
      }
    },
    restore: function() {
      $('.full-start__button.view--online[data-inmod-online]').each(function() {
        var $b = $(this), orig = $b.attr('data-inmod-orig');
        try {
          if (orig) $b.html(decodeURIComponent(orig));
        } catch (e) {}
        $b.removeAttr('data-inmod-online').removeAttr('data-inmod-orig');
      });
    }
  };
  var LogoCache = {
    KEY: 'inmod_logo_cache',
    MAX: 400,
    mem: null,
    saveTimer: null,
    load: function() {
      if (LogoCache.mem) return LogoCache.mem;
      var m = null;
      try {
        m = JSON.parse(localStorage.getItem(LogoCache.KEY) || '{}');
      } catch (e) {}
      LogoCache.mem = m && typeof m === 'object' ? m : {};
      return LogoCache.mem;
    },
    get: function(k) {
      var e = LogoCache.load()[k];
      if (!e) return undefined;
      var age = Date.now() - e.t;
      if (!e.p && age > 3 * 864e5) return undefined;
      if (age > 30 * 864e5) return undefined;
      return e.p;
    },
    set: function(k, p) {
      var m = LogoCache.load();
      m[k] = {
        p: p || '',
        t: Date.now()
      };
      var keys = Object.keys(m);
      if (keys.length > LogoCache.MAX) {
        keys.sort(function(a, b) {
          return m[a].t - m[b].t;
        });
        for (var i = 0; i < keys.length - LogoCache.MAX; i++) delete m[keys[i]];
      }
      clearTimeout(LogoCache.saveTimer);
      LogoCache.saveTimer = setTimeout(function() {
        try {
          localStorage.setItem(LogoCache.KEY, JSON.stringify(m));
        } catch (e) {}
      }, 1500);
    }
  };
  var LogoStore = {
    db: null,
    state: 0,
    waiters: [],
    mem: {},
    memKeys: [],
    puts: 0,
    open: function(cb) {
      if (LogoStore.state === 2) return cb(LogoStore.db);
      if (LogoStore.state === 3 || !window.indexedDB) return cb(null);
      LogoStore.waiters.push(cb);
      if (LogoStore.state === 1) return;
      LogoStore.state = 1;
      function done(db) {
        LogoStore.db = db;
        LogoStore.state = db ? 2 : 3;
        var w = LogoStore.waiters;
        LogoStore.waiters = [];
        for (var i = 0; i < w.length; i++) w[i](db);
      }
      try {
        var r = indexedDB.open('inmod_cache', 1);
        r.onupgradeneeded = function() {
          try {
            r.result.createObjectStore('logos');
          } catch (e) {}
        };
        r.onsuccess = function() {
          done(r.result);
        };
        r.onerror = function() {
          done(null);
        };
        r.onblocked = function() {
          done(null);
        };
      } catch (e) {
        done(null);
      }
    },
    remember: function(key, data) {
      if (!LogoStore.mem[key]) LogoStore.memKeys.push(key);
      LogoStore.mem[key] = data;
      if (LogoStore.memKeys.length > 40) delete LogoStore.mem[LogoStore.memKeys.shift()];
    },
    get: function(key, cb) {
      if (LogoStore.mem[key]) return cb(LogoStore.mem[key]);
      LogoStore.open(function(db) {
        if (!db) return cb('');
        try {
          var q = db.transaction('logos', 'readonly').objectStore('logos').get(key);
          q.onsuccess = function() {
            var v = q.result;
            if (v && v.d) {
              LogoStore.remember(key, v.d);
              cb(v.d);
            } else cb('');
          };
          q.onerror = function() {
            cb('');
          };
        } catch (e) {
          cb('');
        }
      });
    },
    save: function(key, img) {
      try {
        var w = Math.min(img.naturalWidth || img.width, 500);
        var h = Math.round(w * (img.naturalHeight || img.height) / (img.naturalWidth || img.width));
        if (!w || !h) return;
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        var data = c.toDataURL('image/webp', .86);
        if (data.indexOf('data:image/webp') !== 0) data = c.toDataURL('image/png');
        if (data.length > 3e5) return;
        LogoStore.remember(key, data);
        LogoStore.open(function(db) {
          if (!db) return;
          try {
            var st = db.transaction('logos', 'readwrite').objectStore('logos');
            st.put({
              d: data,
              t: Date.now()
            }, key);
            if (++LogoStore.puts % 25 === 0) LogoStore.trim(db);
          } catch (e) {}
        });
      } catch (e) {}
    },
    trim: function(db) {
      try {
        var st = db.transaction('logos', 'readwrite').objectStore('logos');
        var r = st.count();
        r.onsuccess = function() {
          var extra = r.result - 300;
          if (extra <= 0) return;
          var cur = st.openCursor();
          cur.onsuccess = function() {
            var c = cur.result;
            if (!c || extra-- <= 0) return;
            c.delete();
            c.continue();
          };
        };
      } catch (e) {}
    },
    clear: function() {
      LogoStore.mem = {};
      LogoStore.memKeys = [];
      try {
        localStorage.removeItem(LogoCache.KEY);
      } catch (e) {}
      LogoCache.mem = {};
      LogoStore.open(function(db) {
        if (!db) return;
        try {
          db.transaction('logos', 'readwrite').objectStore('logos').clear();
        } catch (e) {}
      });
    }
  };
  var Logo = {
    load: function(e) {
      if (!isActive() || !cfg.inmod_show_logos) return;
      var movie = e.data && e.data.movie;
      if (!movie || !movie.id || movie.source && movie.source !== 'tmdb' && movie.source !== 'cub') return;
      var $render = $(e.object.activity.render());
      var type = movie.name ? 'tv' : 'movie';
      var lang = Lampa.Storage.get('language') || 'ru';
      var key = type + movie.id + lang;
      function show(src, fromNet) {
        if ($render.find('.applecation__logo img, .inmod-logo-container').length) return;
        var $title = $render.find('.full-start-new__title').first();
        if (!$title.length) return;
        var orig = $title.text();
        var img = new Image;
        var retried = false;
        if (fromNet) img.crossOrigin = 'anonymous';
        img.onload = function() {
          if ($render.find('.applecation__logo img, .inmod-logo-container').length) return;
          img.alt = '';
          var $img = $(img);
          $title.attr('data-inmod-orig-title', orig).empty().append($('<div class="inmod-logo-container"></div>').append($img));
          setTimeout(function() {
            $img.addClass('inmod-logo-visible');
          }, 20);
          if (fromNet && !retried) setTimeout(function() {
            idle(function() {
              LogoStore.save(key, img);
            });
          }, 1500);
        };
        img.onerror = function() {
          if (fromNet && !retried) {
            retried = true;
            img.removeAttribute('crossorigin');
            img.src = src + '';
          }
        };
        img.src = src;
      }
      function apply(path) {
        if (!path) return;
        LogoStore.get(key, function(data) {
          setTimeout(function() {
            if (data) show(data, false); else show(Lampa.TMDB.image('t/p/w500' + path.replace('.svg', '.png')), true);
          }, data ? 120 : 350);
        });
      }
      var cached = LogoCache.get(key);
      if (cached !== undefined) return apply(cached);
      function pick(r) {
        return r && r.logos && r.logos.length ? r.logos[0].file_path : '';
      }
      var net = new Lampa.Reguest;
      try {
        net.silent(Lampa.TMDB.api(type + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + lang), function(r) {
          var p = pick(r);
          if (p) {
            LogoCache.set(key, p);
            return apply(p);
          }
          net.silent(Lampa.TMDB.api(type + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key()), function(r2) {
            var p2 = pick(r2);
            LogoCache.set(key, p2);
            apply(p2);
          }, function() {});
        }, function() {});
      } catch (err) {}
    }
  };
  var SeasonInfo = {
    add: function(e) {
      if (!isActive() || cfg.inmod_seasons_info_mode === 'none') return;
      var movie = e.data && e.data.movie;
      if (!movie || !movie.number_of_seasons) return;
      var mode = cfg.inmod_seasons_info_mode;
      var totalS = movie.number_of_seasons || 0, totalE = movie.number_of_episodes || 0;
      var airedS = 0, airedE = 0, now = new Date;
      if (movie.seasons) {
        movie.seasons.forEach(function(s) {
          if (s.season_number === 0) return;
          var aired = s.air_date && new Date(s.air_date) <= now;
          if (aired) airedS++;
          if (s.episodes) s.episodes.forEach(function(ep) {
            if (ep.air_date && new Date(ep.air_date) <= now) airedE++;
          }); else if (aired && s.episode_count) airedE += s.episode_count;
        });
      } else if (movie.last_episode_to_air) {
        airedS = movie.last_episode_to_air.season_number || 0;
        airedE = movie.last_episode_to_air.episode_number || 0;
      }
      if (!airedS) airedS = totalS;
      if (!airedE) airedE = totalE;
      if (totalE > 0 && airedE > totalE) airedE = totalE;
      var S = mode === 'aired' ? airedS : totalS;
      var E = mode === 'aired' ? airedE : totalE;
      var sTxt = S + ' ' + plural(S, tr('inmod_season_1'), tr('inmod_season_2'), tr('inmod_season_5'));
      var partial = mode === 'aired' && totalE > 0 && airedE < totalE;
      var eN = partial ? totalE : E;
      var eTxt = (partial ? airedE + '/' + totalE : E) + ' ' + plural(eN, tr('inmod_episode_1'), tr('inmod_episode_2'), tr('inmod_episode_5'));
      var $info = $('<div class="hz-season"></div>').text(sTxt).append('<b>·</b>').append(document.createTextNode(eTxt));
      var pos = {
        'top-right': {
          top: '.6em',
          right: '.6em'
        },
        'top-left': {
          top: '2.6em',
          left: '.6em'
        },
        'bottom-right': {
          bottom: '.6em',
          right: '.6em'
        },
        'bottom-left': {
          bottom: '.6em',
          left: '.6em'
        }
      }[cfg.inmod_label_position] || {
        top: '.6em',
        right: '.6em'
      };
      $info.css(pos);
      setTimeout(function() {
        var $poster = $(e.object.activity.render()).find('.full-start-new__poster').first();
        if ($poster.length) {
          $poster.find('.hz-season').remove();
          $poster.append($info);
        }
      }, 100);
    }
  };
  var BtnIcons = {
    map: [ [ 'button--play', 'b_play' ], [ 'view--torrent', 'b_magnet' ], [ 'view--trailer', 'b_film' ], [ 'button--book', 'b_bookmark' ], [ 'button--reaction', 'b_smile' ], [ 'button--subscribe', 'b_bell' ], [ 'button--options', 'b_more' ], [ 'view--sd_download', 'b_download' ], [ 'view--online', 'b_online' ] ],
    patch: function(btn) {
      if (btn.__hz_bi || btn.getAttribute('data-inmod-online') || /kinopoisk/i.test(btn.className)) return;
      var name = '';
      for (var i = 0; i < BtnIcons.map.length; i++) if (btn.classList.contains(BtnIcons.map[i][0])) {
        name = BtnIcons.map[i][1];
        break;
      }
      if (!name) return;
      var old = null;
      for (var c = btn.firstElementChild; c; c = c.nextElementSibling) if (c.tagName && c.tagName.toLowerCase() === 'svg') {
        old = c;
        break;
      }
      if (!old) return;
      var filled = false;
      var op = old.querySelector('path[fill]');
      if (op) {
        var f = (op.getAttribute('fill') || '').toLowerCase();
        filled = f && f !== 'none' && f !== 'transparent';
      }
      var wrap = document.createElement('div');
      wrap.innerHTML = ICONS[name];
      var ns = wrap.firstChild;
      ns.setAttribute('class', 'hz-bi');
      if (filled && (name === 'b_bookmark' || name === 'b_bell')) {
        var p = ns.querySelector('path');
        if (p) p.setAttribute('fill', 'currentColor');
      }
      btn.__hz_bi_orig = old;
      btn.replaceChild(ns, old);
      btn.__hz_bi = true;
    },
    scan: function(root) {
      if (!isActive() || !cfg.inmod_btn_icons || !root) return;
      var list = root.getElementsByClassName ? root.getElementsByClassName('full-start__button') : [];
      for (var i = 0; i < list.length; i++) BtnIcons.patch(list[i]);
    },
    restore: function() {
      var list = document.querySelectorAll('.full-start__button');
      for (var i = 0; i < list.length; i++) {
        var b = list[i];
        if (b.__hz_bi && b.__hz_bi_orig) {
          var cur = b.querySelector('svg.hz-bi');
          if (cur) b.replaceChild(b.__hz_bi_orig, cur);
        }
        b.__hz_bi = false;
      }
    }
  };
  var Torrents = {
    timer: null,
    num: function(t) {
      var m = ((t || '') + '').match(/(\d+(?:[.,]\d+)?)/);
      return m ? parseFloat(m[1].replace(',', '.')) || 0 : 0;
    },
    gb: function(t) {
      var m = ((t || '') + '').replace(/ /g, ' ').match(/(\d+(?:[.,]\d+)?)\s*(kb|mb|gb|tb|кб|мб|гб|тб)/i);
      if (!m) return null;
      var n = parseFloat(m[1].replace(',', '.')) || 0, u = m[2].toLowerCase();
      if (u === 'tb' || u === 'тб') return n * 1024;
      if (u === 'mb' || u === 'мб') return n / 1024;
      if (u === 'kb' || u === 'кб') return n / 1048576;
      return n;
    },
    set: function(el, cls) {
      el.classList.add('ts-pill');
      el.classList.remove('ts-low', 'ts-top', 'ts-big');
      if (cls) el.classList.add(cls);
    },
    update: function() {
      if (!isActive() || !cfg.inmod_torrent_styles) return;
      try {
        var i, list;
        list = document.querySelectorAll('.torrent-item__seeds span');
        for (i = 0; i < list.length; i++) {
          var s = Torrents.num(list[i].textContent);
          Torrents.set(list[i], s < 5 ? 'ts-low' : s >= 20 ? 'ts-top' : '');
        }
        list = document.querySelectorAll('.torrent-item__grabs span, .torrent-item__bitrate span');
        for (i = 0; i < list.length; i++) Torrents.set(list[i], '');
        list = document.querySelectorAll('.torrent-item__size');
        for (i = 0; i < list.length; i++) {
          var g = Torrents.gb(list[i].textContent);
          Torrents.set(list[i], g !== null && g >= 50 ? 'ts-big' : '');
        }
      } catch (e) {}
    },
    schedule: function() {
      clearTimeout(Torrents.timer);
      Torrents.timer = setTimeout(Torrents.update, 80);
    }
  };
  var Buttons = {
    mo: null,
    id: function($btn) {
      var t = ($btn.find('span').first().text() || '').trim().toLowerCase();
      return t || ($btn.attr('data-subtitle') || '').trim().toLowerCase() || null;
    },
    hash: function($btn) {
      try {
        return Lampa.Utils.hash($btn.clone().removeClass('focus hover traverse').prop('outerHTML'));
      } catch (e) {
        return '';
      }
    },
    findFull: function() {
      try {
        var a = Lampa.Activity.active();
        if (!a || !a.activity || !a.activity.render) return $();
        var $r = $(a.activity.render());
        var $f = $r.find('.full-start-new');
        return $f.length ? $f : $r.filter('.full-start-new');
      } catch (e) {
        return $();
      }
    },
    process: function($full) {
      if (!$full || !$full.length || !isActive() || !cfg.inmod_show_online_buttons) return;
      var $main = $full.find('.full-start-new__buttons').first();
      if (!$main.length) return;
      var $sources = $full.find('.buttons--container > .full-start__button').filter(function() {
        var $b = $(this);
        if ($b.hasClass('hide')) return false;
        return $b.hasClass('selector') || $b.hasClass('view--torrent') || $b.hasClass('view--trailer') || $b.hasClass('view--online');
      });
      var prHash = (Lampa.Storage.get('full_btn_priority', '') + '').trim();
      var $priority = $main.find('.button--priority');
      var ours = {}, existing = {}, seen = {}, toAdd = [];
      $main.find('.inmod-source-btn').each(function() {
        var id = $(this).attr('data-inmod-id');
        if (id) ours[id] = $(this);
      });
      $main.find('.full-start__button').each(function() {
        var $b = $(this);
        if ($b.hasClass('inmod-source-btn')) return;
        var id = Buttons.id($b);
        if (id) existing[id] = true;
      });
      if ($priority.length) {
        var pid = Buttons.id($priority);
        if (pid) existing[pid] = true;
      }
      $sources.each(function() {
        var $src = $(this), id = Buttons.id($src);
        if (!id || seen[id]) return;
        seen[id] = true;
        if (prHash && Buttons.hash($src) === prHash) return;
        if (existing[id]) return;
        if (ours[id]) {
          delete ours[id];
          return;
        }
        var $clone = $src.clone().addClass('selector inmod-source-btn').removeClass('hide focus hover traverse').attr('data-inmod-id', id);
        if ($src.hasClass('view--torrent')) $clone.addClass('inmod-torrent-btn');
        $clone.on('hover:enter', function() {
          $src.trigger('hover:enter');
        }).on('hover:long', function() {
          $src.trigger('hover:long');
        });
        toAdd.push($clone);
      });
      for (var old in ours) ours[old].remove();
      if (toAdd.length) {
        var torrents = [], others = [];
        toAdd.forEach(function($c) {
          ($c.hasClass('inmod-torrent-btn') ? torrents : others).push($c);
        });
        torrents.forEach(function($t) {
          $main.prepend($t);
        });
        var $after = $priority.length ? $priority : torrents.length ? torrents[torrents.length - 1] : null;
        others.forEach(function($o) {
          if ($after) $o.insertAfter($after); else $main.prepend($o);
          $after = $o;
        });
      }
      $full.toggleClass('inmod-sources-ready', $main.find('.inmod-source-btn').length > 0 || $priority.length > 0);
      if (toAdd.length) Buttons.refreshNav($full, false);
      OnlineIcons.scan($main[0]);
      BtnIcons.scan($full[0]);
    },
    refreshNav: function($full, focusTorrents) {
      try {
        var c = Lampa.Controller.enabled();
        if (!c || c.name !== 'full_start') return;
        Lampa.Controller.collectionSet($full);
        if (!focusTorrents) return;
        var $t = $full.find('.full-start-new__buttons .inmod-torrent-btn.selector:visible').first();
        if ($t.length) setTimeout(function() {
          try {
            Lampa.Controller.collectionSet($full);
            Lampa.Controller.collectionFocus($t[0], $full);
          } catch (e) {}
        }, 20);
      } catch (e) {}
    },
    watch: function($full) {
      Buttons.unwatch();
      if (!$full.length || !window.MutationObserver) return;
      var timer = null;
      Buttons.mo = new MutationObserver(function(muts) {
        if (!isActive()) return;
        for (var i = 0; i < muts.length; i++) {
          var m = muts[i], t = m.target;
          var hit = false;
          if (m.type === 'attributes') {
            hit = t.classList && (t.classList.contains('view--torrent') || t.classList.contains('view--online') || t.classList.contains('full-start__button')) && !t.classList.contains('inmod-source-btn');
          } else if (m.addedNodes.length) {
            for (var j = 0; j < m.addedNodes.length; j++) {
              var n = m.addedNodes[j];
              if (n.nodeType === 1 && !(n.classList && n.classList.contains('inmod-source-btn'))) {
                hit = true;
                break;
              }
            }
          }
          if (hit) {
            clearTimeout(timer);
            timer = setTimeout(function() {
              Buttons.process($full);
              BtnIcons.scan($full[0]);
            }, 10);
            return;
          }
        }
      });
      Buttons.mo.observe($full[0], {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [ 'class' ]
      });
    },
    unwatch: function() {
      if (Buttons.mo) {
        try {
          Buttons.mo.disconnect();
        } catch (e) {}
      }
      Buttons.mo = null;
    },
    reset: function() {
      $('.inmod-source-btn').remove();
      $('.full-start-new').removeClass('inmod-sources-ready');
    }
  };
  var Nav = {
    key: 'main',
    fromActivity: function(o) {
      if (!o) return '';
      var c = o.component, t = o.type;
      if (c === 'main') return 'main';
      if (c === 'bookmarks') return 'favorite';
      if (c === 'favorite') return t === 'history' ? 'history' : 'favorite';
      if ((c === 'category' || c === 'category_full') && typeof o.url === 'string' && /^[a-z]+$/.test(o.url)) return o.url;
      return c || '';
    },
    mark: function() {
      var items = document.querySelectorAll('.navigation-bar__item[data-action]');
      for (var i = 0; i < items.length; i++) items[i].classList.toggle('hz-nav-active', items[i].getAttribute('data-action') === Nav.key);
    },
    set: function(key) {
      if (!key || key === 'back' || key === 'search') return;
      Nav.key = key;
      Nav.mark();
    }
  };
  var Watcher = {
    mo: null,
    queue: [],
    pending: false,
    raf: window.requestAnimationFrame ? function(f) {
      window.requestAnimationFrame(f);
    } : function(f) {
      setTimeout(f, 16);
    },
    flush: function() {
      Watcher.pending = false;
      var list = Watcher.queue;
      Watcher.queue = [];
      if (!isActive()) return;
      var torrents = false, buttons = false;
      for (var i = 0; i < list.length; i++) {
        var node = list[i];
        if (!node.parentNode) continue;
        var cl = node.classList;
        if (!cl) continue;
        var deep = !!node.firstElementChild;
        if (cl.contains('card__marker')) Badges.adopt(node);
        if (cl.contains('card')) Badges.processCard(node); else if (deep) {
          var cards = node.getElementsByClassName('card');
          for (var j = 0; j < cards.length; j++) Badges.processCard(cards[j]);
        }
        if (cl.contains('menu__item')) Icons.applyMenu(node);
        if (cl.contains('navigation-bar__item') || deep && cl.contains('navigation-bar__body')) Nav.mark();
        if (cl.contains('full-start__button') || deep && node.getElementsByClassName('full-start__button').length) buttons = true;
        if (cfg.inmod_torrent_styles && (cl.contains('torrent-item') || deep && node.getElementsByClassName('torrent-item').length)) torrents = true;
      }
      if (buttons) {
        var $f = Buttons.findFull();
        var root = $f[0] || document.body;
        OnlineIcons.scan(root);
        BtnIcons.scan(root);
      }
      if (torrents) Torrents.schedule();
    },
    start: function() {
      if (Watcher.mo || !window.MutationObserver) return;
      Watcher.mo = new MutationObserver(function(muts) {
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) if (added[j].nodeType === 1) Watcher.queue.push(added[j]);
        }
        if (Watcher.queue.length) Watcher.flush();
      });
      Watcher.mo.observe(document.body, {
        childList: true,
        subtree: true
      });
    },
    stop: function() {
      if (Watcher.mo) {
        try {
          Watcher.mo.disconnect();
        } catch (e) {}
      }
      Watcher.mo = null;
      Watcher.queue = [];
    }
  };
  function enableAll() {
    Theme.apply();
    Backdrop.paintSnap();
    Watcher.start();
    Badges.refreshAll();
    Icons.applyMenu(document);
    Icons.applySettings(document.body);
    OnlineIcons.scan(document.body);
    BtnIcons.scan(document.body);
    Torrents.update();
    Buttons.process(Buttons.findFull());
  }
  function disableAll() {
    Watcher.stop();
    Buttons.unwatch();
    Buttons.reset();
    Badges.reset();
    OnlineIcons.restore();
    BtnIcons.restore();
    Icons.restoreMenu();
    Icons.restoreSettings();
    $('.hz-season').remove();
    Theme.disable();
  }
  function opt(obj) {
    var out = {};
    for (var k in obj) if (obj.hasOwnProperty(k)) out[k] = obj[k].name;
    return out;
  }
  function add(p) {
    try {
      Lampa.SettingsApi.addParam(p);
    } catch (e) {
      console.log('[HZ-UI] addParam', p.param && p.param.name, e);
    }
  }
  function title(name, text) {
    add({
      component: COMPONENT,
      param: {
        name: name,
        type: 'title'
      },
      field: {
        name: text
      }
    });
  }
  function setAndApply(key, v, after) {
    if (typeof DEFAULTS[key] === 'boolean' && typeof v === 'string') v = v === 'true';
    cfg[key] = v;
    if (after) after(v);
  }
  function registerSettings() {
    Lampa.SettingsApi.addComponent({
      component: COMPONENT,
      name: 'Оформление',
      icon: ICONS.palette,
      after: 'interface'
    });
    title('hz_t_theme', 'Тема');
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_enabled',
        type: 'trigger',
        default: DEFAULTS.inmod_enabled
      },
      field: {
        name: 'Включить оформление',
        description: 'Выключите, чтобы вернуть стандартный вид Lampa'
      },
      onChange: function(v) {
        setAndApply('inmod_enabled', v);
        if (cfg.inmod_enabled) {
          enableAll();
          Backdrop.restore();
        } else disableAll();
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_accent',
        type: 'select',
        values: opt(ACCENTS),
        default: DEFAULTS.inmod_accent
      },
      field: {
        name: 'Акцент',
        description: 'Окрашивает фон панелей Lampa (настройки, меню выбора, окна, нижний бар) и выделение пультом. Цвет текста не меняется'
      },
      onChange: function(v) {
        setAndApply('inmod_accent', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_font',
        type: 'trigger',
        default: DEFAULTS.inmod_font
      },
      field: {
        name: 'Системный шрифт',
        description: 'SF Pro на Apple, Roboto на Android — вместо Segoe UI'
      },
      onChange: function(v) {
        setAndApply('inmod_font', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_blur',
        type: 'trigger',
        default: DEFAULTS.inmod_blur
      },
      field: {
        name: 'Матовое стекло',
        description: 'Размытие под панелями и нижним баром. Красиво на телефоне, но может тормозить на слабых ТВ-приставках'
      },
      onChange: function(v) {
        setAndApply('inmod_blur', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_animations',
        type: 'trigger',
        default: DEFAULTS.inmod_animations
      },
      field: {
        name: 'Анимация фокуса',
        description: 'Плавное увеличение постера и кнопок'
      },
      onChange: function(v) {
        setAndApply('inmod_animations', v, Theme.apply);
      }
    });
    title('hz_t_bg', 'Фон');
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_bg',
        type: 'select',
        values: opt(BACKGROUNDS),
        default: DEFAULTS.inmod_bg
      },
      field: {
        name: 'Фон приложения',
        description: 'Виден, пока не открыт тайтл. Размытый постер при открытии карточки работает как раньше'
      },
      onChange: function(v) {
        setAndApply('inmod_bg', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_bg_color',
        type: 'input',
        values: '',
        default: DEFAULTS.inmod_bg_color,
        placeholder: '#101820'
      },
      field: {
        name: 'Свой цвет',
        description: 'HEX, например #101820. Работает при фоне «Свой цвет»'
      },
      onChange: function(v) {
        setAndApply('inmod_bg_color', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_bg_image',
        type: 'input',
        values: '',
        default: '',
        placeholder: 'https://…/wallpaper.jpg'
      },
      field: {
        name: 'Своя картинка',
        description: 'Ссылка на изображение. Работает при фоне «Своя картинка»'
      },
      onChange: function(v) {
        setAndApply('inmod_bg_image', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_bg_remember',
        type: 'trigger',
        default: DEFAULTS.inmod_bg_remember
      },
      field: {
        name: 'Запоминать фон тайтла',
        description: 'Размытый постер последнего открытого фильма или сериала остаётся фоном — и после перезапуска Lampa'
      },
      onChange: function(v) {
        setAndApply('inmod_bg_remember', v, function(on) {
          Theme.apply();
          if (on) Backdrop.restore();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_bg_poster',
        type: 'select',
        values: {
          100: '100% — как в Lampa',
          80: '80%',
          60: '60%',
          40: '40%'
        },
        default: DEFAULTS.inmod_bg_poster
      },
      field: {
        name: 'Яркость постера на фоне',
        description: 'Меньше — сильнее проступает фон темы'
      },
      onChange: function(v) {
        setAndApply('inmod_bg_poster', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_bg_reset',
        type: 'button'
      },
      field: {
        name: 'Сбросить запомненный фон'
      },
      onChange: function() {
        Backdrop.clear();
        Lampa.Noty.show('Фон сброшен — снова виден фон темы');
      }
    });
    title('hz_t_badges', 'Плашки на постерах');
    var POS_VALUES = {
      tl: 'Слева сверху',
      tr: 'Справа сверху',
      bl: 'Слева снизу',
      br: 'Справа снизу',
      off: 'Не показывать'
    };
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_badge_scale',
        type: 'select',
        values: {
          auto: 'Авто (крупнее на телефоне)',
          80: '80%',
          100: '100%',
          120: '120%',
          140: '140%',
          160: '160%'
        },
        default: DEFAULTS.inmod_badge_scale
      },
      field: {
        name: 'Размер всех надписей'
      },
      onChange: function(v) {
        setAndApply('inmod_badge_scale', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_rating_size',
        type: 'select',
        values: {
          90: 'Меньше',
          100: 'Как остальные',
          115: 'Крупнее',
          135: 'Крупный',
          160: 'Очень крупный'
        },
        default: DEFAULTS.inmod_rating_size
      },
      field: {
        name: 'Размер рейтинга'
      },
      onChange: function(v) {
        setAndApply('inmod_rating_size', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_pos_rating',
        type: 'select',
        values: POS_VALUES,
        default: DEFAULTS.inmod_pos_rating
      },
      field: {
        name: 'Рейтинг'
      },
      onChange: function(v) {
        setAndApply('inmod_pos_rating', v, function() {
          Theme.apply();
          Badges.refreshAll();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_pos_year',
        type: 'select',
        values: POS_VALUES,
        default: DEFAULTS.inmod_pos_year
      },
      field: {
        name: 'Год выпуска',
        description: 'В одном углу с типом объединяется: «2026 · Фильм»'
      },
      onChange: function(v) {
        setAndApply('inmod_pos_year', v, function() {
          Theme.apply();
          Badges.refreshAll();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_pos_type',
        type: 'select',
        values: POS_VALUES,
        default: DEFAULTS.inmod_pos_type
      },
      field: {
        name: 'Тип (фильм / сериал)'
      },
      onChange: function(v) {
        setAndApply('inmod_pos_type', v, function() {
          Theme.apply();
          Badges.refreshAll();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_pos_quality',
        type: 'select',
        values: POS_VALUES,
        default: DEFAULTS.inmod_pos_quality
      },
      field: {
        name: 'Качество (4K, FHD, WEB…)'
      },
      onChange: function(v) {
        setAndApply('inmod_pos_quality', v, function() {
          Theme.apply();
          Badges.refreshAll();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_pos_marker',
        type: 'select',
        values: POS_VALUES,
        default: DEFAULTS.inmod_pos_marker
      },
      field: {
        name: 'Метка «Смотрю», «Запланировано»…'
      },
      onChange: function(v) {
        setAndApply('inmod_pos_marker', v, function() {
          Theme.apply();
          Badges.refreshAll();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_pos_icons',
        type: 'select',
        values: POS_VALUES,
        default: DEFAULTS.inmod_pos_icons
      },
      field: {
        name: 'Значки истории и закладок'
      },
      onChange: function(v) {
        setAndApply('inmod_pos_icons', v, function() {
          Theme.apply();
          Badges.refreshAll();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_chip',
        type: 'select',
        values: {
          frost: 'Светлое стекло',
          glass: 'Матовое стекло',
          clear: 'Без подложки',
          dark: 'Тёмные',
          light: 'Светлые'
        },
        default: DEFAULTS.inmod_chip
      },
      field: {
        name: 'Стиль плашек',
        description: 'Один стиль для всего на постере: тип, год, рейтинг, метки, значки, а также сезоны на странице тайтла. «Матовое стекло» размывает постер под плашкой — красиво, но тяжелее для слабых устройств'
      },
      onChange: function(v) {
        setAndApply('inmod_chip', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_marker_text',
        type: 'trigger',
        default: DEFAULTS.inmod_marker_text
      },
      field: {
        name: 'Подпись у метки',
        description: 'Выключено — только значок: глаз «Смотрю», галочка «Просмотрено», календарь «Запланировано», play «Продолжено», крестик «Брошено»'
      },
      onChange: function(v) {
        setAndApply('inmod_marker_text', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_badge_type',
        type: 'select',
        values: {
          all: 'Фильм и сериал',
          tv: 'Только сериалы',
          off: 'Не показывать'
        },
        default: DEFAULTS.inmod_badge_type
      },
      field: {
        name: 'Для какого контента показывать тип'
      },
      onChange: function(v) {
        setAndApply('inmod_badge_type', v, Badges.refreshAll);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_star',
        type: 'select',
        values: {
          gold: 'Золотая',
          mono: 'Белая'
        },
        default: DEFAULTS.inmod_star
      },
      field: {
        name: 'Звезда у рейтинга'
      },
      onChange: function(v) {
        setAndApply('inmod_star', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_scrim',
        type: 'select',
        values: {
          normal: 'Обычное',
          light: 'Лёгкое',
          none: 'Без затемнения'
        },
        default: DEFAULTS.inmod_scrim
      },
      field: {
        name: 'Затемнение низа постера',
        description: 'Без затемнения нижние надписи получают тёмную подложку'
      },
      onChange: function(v) {
        setAndApply('inmod_scrim', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_title_year',
        type: 'trigger',
        default: DEFAULTS.inmod_title_year
      },
      field: {
        name: 'Год под названием',
        description: 'Строка с годом под постером, как в стандартной Lampa'
      },
      onChange: function(v) {
        setAndApply('inmod_title_year', v, Theme.apply);
      }
    });
    title('hz_t_btn', 'Кнопки карточки');
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_btn_shape',
        type: 'select',
        values: {
          squircle: 'Мягкий квадрат',
          rounded: 'Скруглённые',
          square: 'Почти квадратные',
          circle: 'Круглые',
          native: 'Как в Lampa'
        },
        default: DEFAULTS.inmod_btn_shape
      },
      field: {
        name: 'Форма'
      },
      onChange: function(v) {
        setAndApply('inmod_btn_shape', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_btn_fill',
        type: 'select',
        values: {
          glass: 'Светлое стекло',
          dark: 'Тёмная',
          clear: 'Только контур',
          native: 'Как в Lampa'
        },
        default: DEFAULTS.inmod_btn_fill
      },
      field: {
        name: 'Подложка'
      },
      onChange: function(v) {
        setAndApply('inmod_btn_fill', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_btn_shadow',
        type: 'select',
        values: {
          none: 'Без тени',
          soft: 'Мягкая',
          native: 'Как есть'
        },
        default: DEFAULTS.inmod_btn_shadow
      },
      field: {
        name: 'Тень'
      },
      onChange: function(v) {
        setAndApply('inmod_btn_shadow', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_btn_icons',
        type: 'trigger',
        default: DEFAULTS.inmod_btn_icons
      },
      field: {
        name: 'Иконки кнопок в едином стиле',
        description: 'Торренты, трейлер, закладка, скачать, оценка и др. Логотипы онлайн-провайдеров не трогаются'
      },
      onChange: function(v) {
        setAndApply('inmod_btn_icons', v, function(on) {
          if (on) BtnIcons.scan(document.body); else BtnIcons.restore();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_mobile_full',
        type: 'select',
        values: {
          center: 'Прозрачная, по центру',
          lampa: 'Как в Lampa'
        },
        default: DEFAULTS.inmod_mobile_full
      },
      field: {
        name: 'Карточка на телефоне',
        description: 'Без тёмной подложки под названием, всё по центру'
      },
      onChange: function(v) {
        setAndApply('inmod_mobile_full', v, Theme.apply);
      }
    });
    title('hz_t_mobile', 'Телефон');
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_navbar',
        type: 'select',
        values: {
          panel: 'Цвет панелей (от акцента)',
          glass: 'Матовое стекло',
          native: 'Как в Lampa'
        },
        default: DEFAULTS.inmod_navbar
      },
      field: {
        name: 'Нижний бар',
        description: 'Фон бара окрашивается как панели настроек; надписи и иконки остаются белыми. «Матовое стекло» тяжелее для слабых телефонов'
      },
      onChange: function(v) {
        setAndApply('inmod_navbar', v, Theme.apply);
      }
    });
    title('hz_t_full', 'Карточка тайтла');
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_show_online_buttons',
        type: 'trigger',
        default: DEFAULTS.inmod_show_online_buttons
      },
      field: {
        name: 'Все источники отдельно',
        description: 'Торренты, трейлеры и онлайн — отдельными кнопками вместо меню «Смотреть»'
      },
      onChange: function(v) {
        setAndApply('inmod_show_online_buttons', v);
        if (v && isActive()) Buttons.process(Buttons.findFull()); else Buttons.reset();
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_patch_online_icons',
        type: 'trigger',
        default: DEFAULTS.inmod_patch_online_icons
      },
      field: {
        name: 'Иконки онлайн-провайдеров',
        description: 'BwaRC / DSO / Lampac'
      },
      onChange: function(v) {
        setAndApply('inmod_patch_online_icons', v, function(on) {
          if (on) OnlineIcons.scan(document.body); else OnlineIcons.restore();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_show_logos',
        type: 'trigger',
        default: DEFAULTS.inmod_show_logos
      },
      field: {
        name: 'Логотип вместо названия',
        description: 'Из TMDB. Если логотип уже ставит «Карточка фильма» (applecation) — не дублируется'
      },
      onChange: function(v) {
        setAndApply('inmod_show_logos', v);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_seasons_info_mode',
        type: 'select',
        values: {
          none: 'Не показывать',
          aired: 'Вышедшие серии',
          total: 'Всего серий'
        },
        default: DEFAULTS.inmod_seasons_info_mode
      },
      field: {
        name: 'Сезоны и серии на постере'
      },
      onChange: function(v) {
        setAndApply('inmod_seasons_info_mode', v, function(m) {
          if (m === 'none') $('.hz-season').remove();
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_label_position',
        type: 'select',
        values: {
          'top-right': 'Справа сверху',
          'top-left': 'Слева сверху',
          'bottom-right': 'Справа снизу',
          'bottom-left': 'Слева снизу'
        },
        default: DEFAULTS.inmod_label_position
      },
      field: {
        name: 'Где показывать сезоны'
      },
      onChange: function(v) {
        setAndApply('inmod_label_position', v);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_torrent_styles',
        type: 'trigger',
        default: DEFAULTS.inmod_torrent_styles
      },
      field: {
        name: 'Стиль списка торрентов',
        description: 'Сиды, размер и битрейт — аккуратными капсулами'
      },
      onChange: function(v) {
        setAndApply('inmod_torrent_styles', v, function() {
          Theme.apply();
          Torrents.update();
        });
      }
    });
    title('hz_t_icons', 'Иконки');
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_icons',
        type: 'trigger',
        default: DEFAULTS.inmod_icons
      },
      field: {
        name: 'Единые иконки плагинов',
        description: 'Иконки пунктов меню и разделов настроек, добавленных плагинами (Подборки, Оценки, Загрузки, Уведомления и др.), в одном стиле'
      },
      onChange: function(v) {
        setAndApply('inmod_icons', v, function(on) {
          if (on) {
            Icons.applyMenu(document);
            Icons.applySettings(document.body);
          } else {
            Icons.restoreMenu();
            Icons.restoreSettings();
            Lampa.Noty.show('Иконки в настройках вернутся после перезапуска');
          }
        });
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_cache_clear',
        type: 'button'
      },
      field: {
        name: 'Очистить кеш логотипов',
        description: 'Логотипы сохраняются на устройстве и при повторном открытии берутся без сети'
      },
      onChange: function() {
        LogoStore.clear();
        Lampa.Noty.show('Кеш логотипов очищен');
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'hz_version',
        type: 'static'
      },
      field: {
        name: '<span style="opacity:.55">Оформление v' + VERSION + '</span>'
      }
    });
    Lampa.Settings.listener.follow('open', function(e) {
      if (!e || e.name !== 'main') return;
      setTimeout(function() {
        try {
          var body = e.body || $('.settings__body');
          Icons.applySettings(body);
          var $f = body.find('.settings-folder[data-component="' + COMPONENT + '"]');
          var $i = body.find('.settings-folder[data-component="interface"]');
          if ($f.length && $i.length && $i.next()[0] !== $f[0]) $f.insertAfter($i);
        } catch (err) {}
      }, 0);
    });
  }
  function listen() {
    Lampa.Listener.follow('activity', function(e) {
      if (e.type === 'start' && isActive()) Nav.set(Nav.fromActivity(e.object));
    });
    document.addEventListener('click', function(ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest('.navigation-bar__item[data-action]') : null;
      if (t) Nav.set(t.getAttribute('data-action'));
    }, true);
    Lampa.Listener.follow('full', function(e) {
      if (!isActive()) return;
      if (e.type === 'start') Buttons.reset();
      if (e.type === 'complite' && e.data && e.data.movie) {
        var movie = e.data.movie;
        var root = e.object.activity.render();
        var $full = $(root).find('.full-start-new');
        if (!$full.length) $full = $(root).filter('.full-start-new');
        Backdrop.remember(movie);
        Badges.full(movie, root);
        SeasonInfo.add(e);
        Logo.load(e);
        if ($full.length) {
          Buttons.watch($full);
          BtnIcons.scan($full[0]);
          if (cfg.inmod_show_online_buttons) {
            Buttons.process($full);
            setTimeout(function() {
              Buttons.refreshNav($full, true);
            }, 50);
          }
        }
      }
      if (e.type === 'destroy') Buttons.unwatch();
    });
    Lampa.Controller.listener.follow('toggle', function(e) {
      if (!isActive() || !cfg.inmod_show_online_buttons || e.name !== 'full_start') return;
      setTimeout(function() {
        try {
          var $full = Buttons.findFull();
          if (!$full.length) return;
          Buttons.process($full);
          if (!$full.hasClass('inmod-sources-ready')) return;
          var $btns = $full.find('.full-start-new__buttons');
          var $t = $btns.find('.inmod-torrent-btn.selector:visible').first();
          if ($t.length) {
            Lampa.Controller.collectionSet($full);
            Lampa.Controller.collectionFocus($t[0], $full);
          } else if ($full.find('.button--play.focus:not(.button--priority)').length) {
            var $first = $btns.find('.button--priority.selector:visible').first();
            if (!$first.length) $first = $btns.find('.inmod-source-btn.selector:visible').first();
            if (!$first.length) $first = $btns.find('.selector:not(.hide):visible').first();
            if ($first.length) {
              Lampa.Controller.collectionSet($full);
              Lampa.Controller.collectionFocus($first[0], $full);
            }
          }
        } catch (err) {}
      }, 15);
    });
  }
  function start() {
    if (window.__hz_interface_started) return;
    window.__hz_interface_started = true;
    try {
      registerTranslations();
    } catch (e) {}
    loadConfig();
    Badges.kindTv = tr('hz_serial');
    Badges.kindMovie = tr('hz_movie');
    try {
      registerSettings();
    } catch (e) {
      console.log('[HZ-UI] settings', e);
    }
    listen();
    if (isActive()) {
      enableAll();
      setTimeout(function() {
        Icons.applyMenu(document);
      }, 2500);
      setTimeout(function() {
        Icons.applyMenu(document);
      }, 7e3);
      if (Backdrop.hasSnap()) Backdrop.restore(); else setTimeout(function() {
        Backdrop.restore();
      }, 1300);
    }
  }
  try {
    if (window.Lampa && Lampa.Storage && document.body) {
      loadConfig();
      if (isActive()) {
        Theme.apply();
        Backdrop.paintSnap();
      }
    }
  } catch (e) {}
  if (window.Lampa && Lampa.Manifest) {
    try {
      Lampa.Manifest.plugins = {
        type: 'interface',
        version: VERSION,
        name: 'Оформление',
        description: 'Темы в стиле Apple, нейтральные плашки, фон приложения, единые иконки',
        author: 'на основе Interface Mod @pavelpikta',
        icon: ICONS.palette
      };
    } catch (e) {}
  }
  if (window.appready) start(); else Lampa.Listener.follow('app', function(e) {
    if (e.type === 'ready') start();
  });
})();