
(function() {
  'use strict';
  if (window.__hz_interface_v4) return;
  window.__hz_interface_v4 = true;
  var VERSION = '5.3.0';
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
  for (var ik in ICONS) if (ICONS.hasOwnProperty(ik)) ICONS[ik] = ICONS[ik].replace('<svg', '<svg data-hz="1"');
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
    inmod_icon_size: '100',
    inmod_icon_opacity: '100',
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
    inmod_headbar: 'glass',
    inmod_btn_shape: 'squircle',
    inmod_btn_fill: 'glass',
    inmod_btn_shadow: 'none',
    inmod_btn_icons: true,
    inmod_mobile_full: 'center',
    inmod_icons: true,
    inmod_show_online_buttons: true,
    inmod_patch_online_icons: true,
    inmod_show_logos: true,
    inmod_poster_cache: true,
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
      var tile = panel.map(function(c) {
        return Math.round(c + (255 - c) * .07);
      });
      var radius = {
        native: '',
        rounded: '.9em',
        squircle: '1.15em',
        circle: '999px',
        square: '.45em'
      }[cfg.inmod_btn_shape] || '1.15em';
      return [ ':root{', '--hz-accent:' + a.accent + ';', '--hz-on-accent:' + a.on + ';', '--hz-ring:' + a.ring + ';', '--hz-bg:' + (bg || 'none') + ';', '--hz-bg-solid:' + solid + ';', '--hz-surface:' + surface + ';', '--hz-surface-2:' + surface2 + ';', '--hz-poster-opacity:' + poster / 100 + ';', '--hz-bs:' + (sc || 1) + ';', '--hz-btn-r:' + (radius || '1em') + ';', '--hz-panel:rgb(' + panel.join(',') + ');', '--hz-panel-glass:rgba(' + panel.join(',') + ',.72);', '--hz-icon:' + (a.neutral ? '#ffffff' : a.accent) + ';', '--hz-rs:' + (parseInt(cfg.inmod_rating_size, 10) || 100) / 100 + ';', '--hz-is:' + (parseInt(cfg.inmod_icon_size, 10) || 100) / 100 + ';', '--hz-io:' + Math.min(100, Math.max(20, parseInt(cfg.inmod_icon_opacity, 10) || 100)) / 100 + ';', '--hz-tile:rgb(' + tile.join(',') + ');', Theme.chip(), '}', sc ? '' : '@media screen and (max-width:580px){:root{--hz-bs:1.32;}}' ].join('\n');
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
      var css = [ B + '.hz-bg-set{background:var(--hz-bg-solid) !important;}', '#hz-bg{position:fixed;left:0;top:0;right:0;bottom:0;z-index:-1;pointer-events:none;display:none;' + '-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-backface-visibility:hidden;backface-visibility:hidden;}', '#hz-bg{background:var(--hz-bg);}', B + '.hz-bg-set #hz-bg,' + B + '.hz-snap #hz-bg{display:block;}', B + ' .background__fade{opacity:var(--hz-poster-opacity) !important;}', B + ' .background__one.visible,' + B + ' .background__two.visible{opacity:var(--hz-poster-opacity);}', B + '.hz-font{font-family:' + FONT + ';letter-spacing:-0.005em;}', B + '.hz-font .items-line__title{font-weight:600;letter-spacing:-0.015em;}', B + ' .card__age{color:rgba(235,235,245,.55);}', focusSel + '{background:var(--hz-accent) !important;color:var(--hz-on-accent) !important;}', B + ' .simple-button{border-radius:.9em;}', B + ' .selectbox-item,' + B + ' .settings-folder,' + B + ' .settings-param{border-radius:.8em;}', B + ' .settings-folder.focus .settings-folder__icon,' + B + ' .selectbox-item.focus .selectbox-item__checkbox,' + B + ' .settings-param.focus .selectbox-item__checkbox{-webkit-filter:none !important;filter:none !important;}', B + '.hz-on-dark .settings-folder.focus .settings-folder__icon:not(.hz-ico),' + B + '.hz-on-dark .selectbox-item.focus .selectbox-item__checkbox{-webkit-filter:invert(1) !important;filter:invert(1) !important;}', B + ':not(.hz-on-dark) .menu__item.focus .menu__ico > img,' + B + ':not(.hz-on-dark) .menu__item.traverse .menu__ico > img,' + B + ':not(.hz-on-dark) .menu__item.hover .menu__ico > img{-webkit-filter:none;filter:none;}', B + ' .menu__item.focus .menu__ico [stroke],' + B + ' .menu__item.traverse .menu__ico [stroke],' + B + ' .menu__item.hover .menu__ico [stroke]{stroke:var(--hz-on-accent);}', B + ' .menu__item.focus .menu__ico path[fill]:not([fill="none"]),' + B + ' .menu__item.focus .menu__ico rect[fill]:not([fill="none"]),' + B + ' .menu__item.focus .menu__ico circle[fill]:not([fill="none"]),' + B + ' .menu__item.traverse .menu__ico path[fill]:not([fill="none"]),' + B + ' .menu__item.hover .menu__ico path[fill]:not([fill="none"]){fill:var(--hz-on-accent);}', B + ' .menu__ico .hz-svg,' + B + ' .settings-folder__icon.hz-ico svg{width:100%;height:100%;}', ringSel + '{border-color:var(--hz-ring) !important;border-width:.22em !important;border-radius:1.3em;}', B + ' .card.hover .card__view::after{opacity:.55;}', B + ' .settings__content,' + B + ' .selectbox__content,' + B + ' .modal__content,' + B + ' .settings-input__content,' + B + ' .settings-input--free,' + B + ' .discuss-rules,' + B + ' .bell__item,' + B + ' .settings-input,' + B + ' .extensions{background-color:var(--hz-panel) !important;}', B + ' .modal__content{border-radius:1.4em;}', B + ' .settings-param-title > span{color:rgba(235,235,245,.6);text-transform:uppercase;font-size:.8em;letter-spacing:.06em;font-weight:600;}', B + ' .settings-param__descr{color:rgba(235,235,245,.6);}', B + ' .settings-param.focus .settings-param__descr,' + B + ' .settings-folder.focus .settings-param__descr{color:var(--hz-on-accent) !important;opacity:.62;}', B + ' .settings-param.focus .settings-param__value,' + B + ' .settings-param.focus .settings-param__name{color:var(--hz-on-accent) !important;}', B + ' .selectbox-item.focus .selectbox-item__subtitle{color:var(--hz-on-accent) !important;opacity:.62;}', B + ' .card__img,' + B + ' .card-more__box{background-color:var(--hz-surface-2);}', B + ' .extensions__item,' + B + ' .extensions__block-add{background-color:var(--hz-tile) !important;}', B + ' .extensions__item.focus,' + B + ' .extensions__block-add.focus{background-color:var(--hz-accent) !important;}', B + ' .torrent-serial{background-color:var(--hz-surface);}', B + ' .torrent-serial__size,' + B + ' .torrent-file__size{background-color:var(--hz-surface-2);}', B + '.hz-blur .settings__content,' + B + '.hz-blur .selectbox__content,' + B + '.hz-blur .modal__content,' + B + '.hz-blur .settings-input__content,' + B + '.hz-blur .navigation-bar__body{' + 'background-color:var(--hz-panel-glass) !important;-webkit-backdrop-filter:blur(28px) saturate(170%);backdrop-filter:blur(28px) saturate(170%);}', B + ' .activity__loader,' + B + ' .screensaver__preload{background:url("' + spinner + '") no-repeat 50% 50% !important;background-size:3.2em 3.2em !important;}', B + ' .card__view > .card__vote,' + B + ' .card__view > .card__quality,' + B + ' .card__view > .card__type,' + B + ' .full-start-new__poster > .card__type{display:none !important;}', B + ' .hz-row-t,' + B + ' .hz-row-b{position:absolute;left:0;right:0;z-index:2;pointer-events:none;box-sizing:border-box;contain:layout style;' + 'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-justify-content:space-between;justify-content:space-between;' + 'padding:.5em;font-size:calc(1em * ' + BS + ');}', B + ' .hz-row-t{top:0;-webkit-align-items:flex-start;align-items:flex-start;}', B + ' .hz-row-b{bottom:0;-webkit-align-items:flex-end;align-items:flex-end;padding-top:1.9em;' + 'border-radius:0 0 calc(1em / ' + BS + ') calc(1em / ' + BS + ');background:linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0));}', B + ' .hz-row-b.hz-empty{display:none;}', B + ' .hz-l,' + B + ' .hz-r{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-direction:column;flex-direction:column;}', B + ' .hz-l{-webkit-align-items:flex-start;align-items:flex-start;min-width:-webkit-min-content;min-width:min-content;-webkit-flex:0 1 auto;flex:0 1 auto;}', B + ' .hz-r{-webkit-align-items:flex-end;align-items:flex-end;-webkit-flex:0 0 auto;flex:0 0 auto;margin-left:auto;padding-left:.35em;}', B + ' .hz-l,' + B + ' .hz-r{margin-top:-.3em;}', B + ' .hz-l > .hz-it,' + B + ' .hz-r > .hz-it,' + B + ' .hz-l > .card__marker,' + B + ' .hz-r > .card__marker,' + B + ' .hz-l > .card__icons,' + B + ' .hz-r > .card__icons{margin-top:.3em;}', B + ' .hz-it{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1;color:#fff;box-sizing:border-box;}', B + ' .hz-vote{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;font-weight:700;letter-spacing:-.02em;' + 'font-variant-numeric:tabular-nums;font-size:calc(1.05em * var(--hz-rs));}', B + ' .hz-vote i{display:inline-block;-webkit-flex-shrink:0;flex-shrink:0;width:.74em;height:.74em;margin-right:.2em;background:url("' + STAR_GOLD + '") center / contain no-repeat;}', B + '.hz-star-mono .hz-vote i{background-image:url("' + STAR_WHITE + '");}', B + ' .hz-kind,' + B + ' .hz-year{max-width:none;overflow:visible;text-overflow:clip;-webkit-flex-shrink:0;flex-shrink:0;font-size:.62em;font-weight:600;text-transform:uppercase;letter-spacing:.08em;font-variant-numeric:tabular-nums;}', B + ' .hz-q{font-size:.58em;font-weight:700;letter-spacing:.05em;padding:.28em .38em .26em;border-radius:.32em;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.8);}', B + ' .hz-q--4k{background:#fff;color:#0b0b0c;box-shadow:none;}', B + ' .hz-row-t .hz-kind,' + B + ' .hz-row-t .hz-year,' + B + ' .hz-row-t .hz-vote{padding:.5em .62em .46em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-row-t .hz-vote{font-size:calc(.86em * var(--hz-rs));padding:.36em .5em .34em .42em;}', B + ' .hz-row-b .hz-kind,' + B + ' .hz-row-b .hz-year{color:rgba(255,255,255,.8);}', B + '.hz-scrim-light .hz-row-b{background:linear-gradient(to top, rgba(0,0,0,.5), rgba(0,0,0,0));}', B + '.hz-scrim-none .hz-row-b{background:none;}', B + '.hz-scrim-none .hz-row-b .hz-kind,' + B + '.hz-scrim-none .hz-row-b .hz-year,' + B + '.hz-scrim-none .hz-row-b .hz-vote{padding:.45em .58em .42em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-row-t .card__marker,' + B + ' .hz-row-b .card__marker{position:static !important;max-width:100%;box-sizing:border-box;' + 'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;' + 'font-size:calc(.8em * var(--hz-is));opacity:var(--hz-io);font-weight:600;line-height:1;white-space:nowrap;padding:.42em .55em .42em .45em;border-radius:.6em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-row-t .card__marker > span,' + B + ' .hz-row-b .card__marker > span{font-size:1em;max-width:none;min-width:0;overflow:hidden;text-overflow:ellipsis;}', B + ' .card__marker::before{width:1em !important;height:1em !important;margin-right:.36em !important;border-radius:0 !important;background-color:currentColor !important;-webkit-flex-shrink:0;flex-shrink:0;}', B + ' .card__marker--look::before{-webkit-mask:' + MARK.look + ' center / contain no-repeat;mask:' + MARK.look + ' center / contain no-repeat;}', B + ' .card__marker--viewed::before{-webkit-mask:' + MARK.viewed + ' center / contain no-repeat;mask:' + MARK.viewed + ' center / contain no-repeat;}', B + ' .card__marker--scheduled::before{-webkit-mask:' + MARK.scheduled + ' center / contain no-repeat;mask:' + MARK.scheduled + ' center / contain no-repeat;}', B + ' .card__marker--continued::before{-webkit-mask:' + MARK.continued + ' center / contain no-repeat;mask:' + MARK.continued + ' center / contain no-repeat;}', B + ' .card__marker--thrown::before{-webkit-mask:' + MARK.thrown + ' center / contain no-repeat;mask:' + MARK.thrown + ' center / contain no-repeat;}', B + ' .hz-row-t .card__icons,' + B + ' .hz-row-b .card__icons{font-size:calc(1em * var(--hz-is));opacity:var(--hz-io);position:static !important;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;}', B + ' .hz-row-t .card__icons > .card__marker,' + B + ' .hz-row-b .card__icons > .card__marker{margin-right:.3em;}', B + ' .hz-row-t .card__icons-inner,' + B + ' .hz-row-b .card__icons-inner{display:-webkit-box;display:-webkit-flex;display:flex;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);border-radius:1em;padding:0;}', B + ' .hz-row-t .card__icons-inner:empty,' + B + ' .hz-row-b .card__icons-inner:empty{display:none;}', B + ' .hz-row-t .card__icon,' + B + ' .hz-row-b .card__icon{width:1.5em;height:1.5em;margin:.06em;background-size:54%;}', B + '.hz-hide-marker .card__marker{display:none !important;}', B + '.hz-chip-glass .hz-row-t .hz-kind,' + B + '.hz-chip-glass .hz-row-t .hz-year,' + B + '.hz-chip-glass .hz-row-t .hz-vote,' + B + '.hz-chip-glass .hz-row-t .card__marker,' + B + '.hz-chip-glass .hz-row-b .card__marker,' + B + '.hz-chip-glass .card__icons-inner,' + B + '.hz-chip-glass.hz-scrim-none .hz-row-b .hz-it,' + B + '.hz-chip-glass .hz-badge,' + B + '.hz-chip-glass .hz-season{' + '-webkit-backdrop-filter:blur(12px) saturate(180%);backdrop-filter:blur(12px) saturate(180%);}', B + '.hz-chip-light .card__icon{-webkit-filter:invert(1);filter:invert(1);}', B + '.hz-chip-clear .card__icons-inner,' + B + '.hz-chip-clear.hz-mark-icon .card__icons > .card__marker{' + 'background:radial-gradient(closest-side, rgba(0,0,0,.42), rgba(0,0,0,0)) !important;}', B + '.hz-chip-clear .card__icon{opacity:.94;}', B + ' .card__icons > .card__marker{margin-right:.15em;}', B + '.hz-mark-icon .hz-row-t .card__marker,' + B + '.hz-mark-icon .hz-row-b .card__marker{width:1.86em;height:1.86em;padding:0;border-radius:50%;' + '-webkit-justify-content:center;justify-content:center;font-size:calc(.8em * var(--hz-is));}', B + '.hz-mark-icon .card__marker > span{display:none !important;}', B + '.hz-mark-icon .card__marker::before{margin-right:0 !important;width:.95em !important;height:.95em !important;}', B + '.hz-hide-icons .card__view .card__icons{display:none !important;}', B + ' .card__new-episode > div{background:#fff;color:#0b0b0c;font-weight:600;}', B + '.hz-no-age .card__age{display:none;}', B + '.hz-head-glass .head__body{margin:calc(.5em + env(safe-area-inset-top, 0px)) 9em 0;padding:.42em .9em;border-radius:999px;font-size:.88em;background:rgba(0,0,0,.3);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.14), 0 .5em 1.6em rgba(0,0,0,.16);}', B + '.hz-head-glass.touch-device .head__body{background:rgba(0,0,0,.2);-webkit-backdrop-filter:blur(26px) saturate(160%) brightness(.82);backdrop-filter:blur(26px) saturate(160%) brightness(.82);}', B + '.hz-head-glass .head__action{margin-left:.15em;margin-right:.15em;}', '@media screen and (max-width:580px){' + B + '.hz-head-glass .head__body{margin-left:3.6em;margin-right:3.6em;font-size:.8em;padding:.38em .8em;}}', B + '.hz-nav-panel .navigation-bar .navigation-bar__body{background:var(--hz-panel) !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}', B + '.hz-nav-glass .navigation-bar .navigation-bar__body{background:var(--hz-panel-glass) !important;-webkit-backdrop-filter:blur(24px) saturate(170%);backdrop-filter:blur(24px) saturate(170%);}', B + ' .settings-folder__icon.hz-ico{color:var(--hz-icon);}', B + ' .settings-folder.focus .settings-folder__icon.hz-ico{color:var(--hz-on-accent);}', B + ' .full-start__pg,' + B + ' .full-start__status{border:1px solid rgba(255,255,255,.38) !important;border-radius:.45em !important;' + 'padding:.28em .5em !important;color:rgba(255,255,255,.88) !important;background:transparent !important;font-weight:500;}', B + ' .full-start__rate{border-radius:.55em;background:rgba(10,10,12,.45);}', B + ' .full-start-new__poster{position:relative;}', B + ' .hz-badge{position:absolute;z-index:3;top:.6em;left:.6em;font-size:calc(.64em * ' + BS + ');font-weight:600;text-transform:uppercase;letter-spacing:.09em;line-height:1;' + 'padding:.55em .7em .5em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);}', B + ' .hz-season{position:absolute;z-index:3;font-size:calc(.72em * ' + BS + ');font-weight:600;line-height:1;white-space:nowrap;' + 'padding:.55em .7em .5em;border-radius:.55em;background:var(--hz-chip-bg);color:var(--hz-chip-fg);box-shadow:var(--hz-chip-sh);text-shadow:var(--hz-chip-ts);letter-spacing:.01em;font-variant-numeric:tabular-nums;}', B + ' .hz-season b{font-weight:600;opacity:.6;margin:0 .35em;}', '@media screen and (min-width:481px){' + B + ' .full-start-new__poster .hz-badge,' + B + ' .full-start-new__poster .hz-season{display:none !important;}}', B + '.hz-btn-shape ' + '.full-start-new .full-start__button{border-radius:var(--hz-btn-r) !important;}', B + '.hz-btn-circle .full-start-new .full-start__button:not(.focus){padding-left:.65em !important;padding-right:.65em !important;}', B + '.hz-btnf-glass ' + '.full-start-new .full-start__button:not(.focus){background:rgba(255,255,255,.13) !important;}', B + '.hz-btnf-dark ' + '.full-start-new .full-start__button:not(.focus){background:rgba(0,0,0,.38) !important;}', B + '.hz-btnf-clear ' + '.full-start-new .full-start__button:not(.focus){background:transparent !important;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28) !important;}', B + '.hz-btns-none ' + '.full-start-new .full-start__button{box-shadow:none !important;-webkit-filter:none !important;filter:none !important;text-shadow:none !important;}', B + '.hz-btns-none.hz-btnf-clear .full-start-new .full-start__button:not(.focus){box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28) !important;}', B + '.hz-btns-soft ' + '.full-start-new .full-start__button{box-shadow:0 .2em .7em rgba(0,0,0,.22) !important;}', B + ' .full-start-new .full-start__button > svg.hz-bi{width:1.42em;height:1.42em;}', '@media screen and (max-width:480px){' + B + '.hz-mcenter .full-start-new__right{background:transparent !important;}' + B + '.hz-mcenter .full-start-new__head,' + B + '.hz-mcenter .full-start-new__title,' + B + '.hz-mcenter .full-start__title-original,' + B + '.hz-mcenter .full-start__rate,' + B + '.hz-mcenter .full-start-new__reactions,' + B + '.hz-mcenter .full-start-new__rate-line,' + B + '.hz-mcenter .full-start-new__buttons,' + B + '.hz-mcenter .full-start-new__details,' + B + '.hz-mcenter .full-start-new__tagline{' + '-webkit-justify-content:center;justify-content:center;text-align:center;max-width:100%;}' + B + '.hz-mcenter .full-start-new__buttons{overflow:auto;}' + B + ' .full-start-new__poster .hz-badge{display:none;}' + '}', '@media screen and (min-width:581px){' + B + ' .full-start-new__left{width:21em;}}', B + ' .full-start-new__buttons{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:.5em;}', B + ' .full-start-new__buttons .inmod-source-btn.inmod-torrent-btn{-webkit-order:-30;order:-30;}', B + ' .full-start-new__buttons .button--priority{-webkit-order:-20;order:-20;}', B + ' .full-start-new__buttons .inmod-source-btn:not(.inmod-torrent-btn){-webkit-order:-10;order:-10;}', B + ' .full-start-new.inmod-sources-ready .button--play:not(.button--priority){display:none !important;}', B + ' .full-start__button.view--online[data-inmod-online] svg{width:1.35em;height:1.35em;}', B + ' .inmod-logo-container{display:flex;justify-content:flex-start;align-items:flex-end;width:100%;min-height:90px;}', B + ' .inmod-logo-container img{max-height:120px;max-width:80%;opacity:0;transition:opacity .35s ease;object-fit:contain;object-position:left bottom;}', B + ' .inmod-logo-container img.inmod-logo-visible{opacity:1;}', B + ' .inmod-logo-container img.inmod-logo-instant{transition:none;}', '@keyframes hz-in{from{opacity:0;-webkit-transform:translate3d(0,.3em,0);transform:translate3d(0,.3em,0);}to{opacity:1;-webkit-transform:none;transform:none;}}', B + '.hz-anim .full-start-new__rate-line > :not(.hz-seen){-webkit-animation:hz-in .4s ease both;animation:hz-in .4s ease both;}', B + ' .hz-season[data-p="tr"]{top:.6em;right:.6em;}', B + ' .hz-season[data-p="tl"]{top:2.6em;left:.6em;}', B + ' .hz-season[data-p="br"]{bottom:.6em;right:.6em;}', B + ' .hz-season[data-p="bl"]{bottom:.6em;left:.6em;}', '@media screen and (max-width:580px){' + B + ' .inmod-logo-container{justify-content:center;align-items:center;min-height:70px;}' + B + ' .inmod-logo-container img{max-height:80px;max-width:90%;object-position:center;}}', B + '.hz-torrents .ts-pill{display:inline-flex;align-items:center;justify-content:center;min-height:1.7em;padding:.15em .5em;border-radius:.5em;' + 'font-weight:600;font-size:.9em;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums;background:rgba(255,255,255,.1);color:rgba(255,255,255,.92);}', B + '.hz-torrents .torrent-item__bitrate,' + B + '.hz-torrents .torrent-item__grabs,' + B + '.hz-torrents .torrent-item__seeds{margin-right:.55em;}', B + '.hz-torrents .ts-pill.ts-low{opacity:.45;}', B + '.hz-torrents .ts-pill.ts-top{background:#fff;color:#0b0b0c;}', B + '.hz-torrents .ts-pill.ts-big{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6);}', B + '.hz-anim:not(.touch-device) .card__view{transition:transform .2s cubic-bezier(.2,.8,.2,1);}', B + '.hz-anim .card.focus .card__view{-webkit-transform:scale(1.045);transform:scale(1.045);}', B + '.hz-anim .items-cards .card.selector,' + B + '.hz-anim .items-cards .card.selector.focus{transform:none !important;}', '@media screen and (min-width:481px){' + B + '.hz-anim .settings__content,' + B + '.hz-anim .selectbox__content{-webkit-transition:-webkit-transform .26s cubic-bezier(.32,.72,0,1);transition:transform .26s cubic-bezier(.32,.72,0,1);}}', B + '.hz-anim .full-start__button.focus,' + B + '.hz-anim .simple-button.focus{-webkit-transform:scale(1.04);transform:scale(1.04);transition:transform .2s ease;}' ];
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
        'hz-head-glass': cfg.inmod_headbar === 'glass',
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
    lastId: '',
    pendingId: '',
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
    source: function(movie) {
      try {
        if (Lampa.Utils && typeof Lampa.Utils.cardImgBackgroundBlur === 'function') return Lampa.Utils.cardImgBackgroundBlur(movie) || '';
      } catch (e) {}
      return '';
    },
    capture: function(movie, now) {
      var id = movie ? (movie.id || '') + '|' + (movie.backdrop_path || movie.poster_path || movie.img || '') : '';
      if (!id || id === Backdrop.lastId || id === Backdrop.pendingId) return;
      var src = '';
      try {
        if (movie.backdrop_path) src = Lampa.TMDB.image('t/p/w300/' + (movie.backdrop_path + '').replace(/^\//, ''));
      } catch (e) {}
      if (!src) src = Backdrop.source(movie);
      if (!src || src.indexOf('data:') === 0) return;
      Backdrop.pendingId = id;
      clearTimeout(Backdrop.timer);
      function render(img) {
        if (Backdrop.pendingId !== id) return;
        Backdrop.pendingId = '';
        if (!isActive() || !cfg.inmod_bg_remember) return;
        try {
          var w = 40, h = Math.max(1, Math.round(w * img.naturalHeight / img.naturalWidth)) || 22;
          var c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          var ctx = c.getContext('2d');
          if ('filter' in ctx) ctx.filter = 'blur(1.6px)';
          ctx.drawImage(img, -3, -3, w + 6, h + 6);
          ctx.filter = 'none';
          ctx.fillStyle = 'rgba(0,0,0,.3)';
          ctx.fillRect(0, 0, w, h);
          var url = c.toDataURL('image/png');
          if (url.length > 2e4) return;
          localStorage.setItem(Backdrop.SNAP, url);
          Backdrop._snap = url;
          Backdrop.lastId = id;
          Backdrop.paintSnap();
        } catch (e) {}
      }
      function load(u) {
        var img = new Image();
        if (u.indexOf('blob:') !== 0) img.crossOrigin = 'anonymous';
        img.onload = function() {
          if (now) render(img); else idle(function() {
            render(img);
          }, 3e3);
        };
        img.onerror = function() {
          if (Backdrop.pendingId === id) Backdrop.pendingId = '';
        };
        img.src = u;
      }
      Backdrop.timer = setTimeout(function() {
        if (Media.on()) Media.get(src, function(obj) {
          load(obj || src);
        }); else load(src);
      }, now ? 0 : 1800);
    },
    remember: function(movie) {
      if (!isActive() || !cfg.inmod_bg_remember || !movie) return;
      if (!movie.backdrop_path && !movie.poster_path && !movie.img && !movie.poster) return;
      try {
        localStorage.setItem(Backdrop.KEY, JSON.stringify({
          id: movie.id || '',
          backdrop_path: movie.backdrop_path || '',
          poster_path: movie.poster_path || '',
          img: movie.img || '',
          poster: movie.poster || ''
        }));
      } catch (e) {}
      Backdrop.capture(movie);
    },
    restore: function() {
      if (!isActive() || !cfg.inmod_bg_remember) return;
      if (Backdrop.hasSnap()) return Backdrop.paintSnap();
      var saved;
      try {
        saved = JSON.parse(localStorage.getItem(Backdrop.KEY) || '{}');
      } catch (e) {
        saved = null;
      }
      if (!saved || !saved.backdrop_path && !saved.poster_path && !saved.img && !saved.poster) return;
      var url = Backdrop.source(saved);
      if (!url || !Lampa.Background) return;
      try {
        Lampa.Background.immediately(url);
      } catch (e) {}
      Backdrop.capture(saved);
    },
    clear: function() {
      try {
        localStorage.removeItem(Backdrop.KEY);
        localStorage.removeItem(Backdrop.SNAP);
      } catch (e) {}
      Backdrop._snap = '';
      Backdrop.lastId = '';
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
      var view = el.firstElementChild && el.firstElementChild.classList.contains('card__view') ? el.firstElementChild : el.querySelector('.card__view');
      if (!view) return;
      var im = view.firstElementChild;
      if (im && im.tagName === 'IMG') {
        if (Media.on()) Media.hook(im);
        im.decoding = 'async';
      }
      var d = el.card_data;
      if (!Badges.isMedia(d)) return;
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
    prepatch: function() {
      if (!isActive() || !cfg.inmod_icons || !Lampa.SettingsApi.allComponents) return;
      var all = Lampa.SettingsApi.allComponents() || {};
      for (var comp in all) {
        var c = all[comp];
        if (!c || c.__hz_orig_icon !== undefined) continue;
        var name = comp === COMPONENT ? 'palette' : iconFor(c.name);
        if (!name) continue;
        c.__hz_orig_icon = c.icon;
        c.icon = ICONS[name];
        Icons.patched.push(c);
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
          var svg = f.firstElementChild;
          if (!svg || !svg.getAttribute('data-hz')) f.innerHTML = ICONS[name];
          f.classList.add('hz-ico');
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
      if (!$btn.is('.full-start__button.view--online') || $btn.parent().hasClass('buttons--container')) return;
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
  function noop() {}
  var CacheBox = {
    kind: '',
    cs: null,
    db: null,
    dbState: 0,
    dbWait: [],
    detect: function() {
      if (CacheBox.kind) return CacheBox.kind;
      var k = 'none';
      try {
        if (window.fetch && window.URL && URL.createObjectURL && window.Promise) {
          if (window.caches && window.isSecureContext !== false) k = 'cs'; else if (window.indexedDB) k = 'idb';
        }
      } catch (e) {}
      CacheBox.kind = k;
      return k;
    },
    idb: function(cb) {
      if (CacheBox.dbState === 2) return cb(CacheBox.db);
      if (CacheBox.dbState === 3) return cb(null);
      CacheBox.dbWait.push(cb);
      if (CacheBox.dbState === 1) return;
      CacheBox.dbState = 1;
      function done(db) {
        CacheBox.db = db;
        CacheBox.dbState = db ? 2 : 3;
        if (!db) CacheBox.kind = 'none';
        var w = CacheBox.dbWait;
        CacheBox.dbWait = [];
        for (var i = 0; i < w.length; i++) w[i](db);
      }
      try {
        var r = indexedDB.open('hz_media', 1);
        r.onupgradeneeded = function() {
          try {
            var st = r.result.createObjectStore('m');
            st.createIndex('t', 't');
          } catch (e) {}
        };
        r.onsuccess = function() {
          done(r.result);
        };
        r.onerror = r.onblocked = function() {
          done(null);
        };
      } catch (e) {
        done(null);
      }
    },
    open: function() {
      if (!CacheBox.cs) CacheBox.cs = caches.open('hz-media-v1');
      return CacheBox.cs;
    },
    match: function(url, cb) {
      var k = CacheBox.detect();
      if (k === 'cs') {
        CacheBox.open().then(function(c) {
          return c.match(url);
        }).then(function(r) {
          return r ? r.blob() : null;
        }).then(function(b) {
          cb(b || null);
        }, function() {
          cb(null);
        });
      } else if (k === 'idb') {
        CacheBox.idb(function(db) {
          if (!db) return cb(null);
          try {
            var q = db.transaction('m', 'readonly').objectStore('m').get(url);
            q.onsuccess = function() {
              cb(q.result && q.result.b || null);
            };
            q.onerror = function() {
              cb(null);
            };
          } catch (e) {
            cb(null);
          }
        });
      } else cb(null);
    },
    puts: 0,
    put: function(url, blob) {
      var k = CacheBox.detect();
      if (k === 'cs') {
        CacheBox.open().then(function(c) {
          return c.put(url, new Response(blob, {
            headers: {
              'content-type': blob.type || 'image/jpeg'
            }
          }));
        }).then(CacheBox.counted, noop);
      } else if (k === 'idb') {
        CacheBox.idb(function(db) {
          if (!db) return;
          try {
            db.transaction('m', 'readwrite').objectStore('m').put({
              b: blob,
              t: Date.now()
            }, url);
            CacheBox.counted();
          } catch (e) {}
        });
      }
    },
    remove: function(url) {
      var k = CacheBox.detect();
      if (k === 'cs') CacheBox.open().then(function(c) {
        return c['delete'](url);
      }).then(noop, noop); else if (k === 'idb') CacheBox.idb(function(db) {
        try {
          db && db.transaction('m', 'readwrite').objectStore('m')['delete'](url);
        } catch (e) {}
      });
    },
    counted: function() {
      if (++CacheBox.puts % 40 === 0) idle(CacheBox.trim, 8e3);
    },
    MAX: 1500,
    trim: function() {
      var k = CacheBox.detect();
      if (k === 'cs') {
        CacheBox.open().then(function(c) {
          return c.keys().then(function(keys) {
            var extra = keys.length - CacheBox.MAX;
            for (var i = 0; i < extra; i++) c['delete'](keys[i]);
          });
        }).then(noop, noop);
      } else if (k === 'idb') {
        CacheBox.idb(function(db) {
          if (!db) return;
          try {
            var st = db.transaction('m', 'readwrite').objectStore('m');
            var r = st.count();
            r.onsuccess = function() {
              var extra = r.result - CacheBox.MAX;
              if (extra <= 0) return;
              var cur = st.index('t').openCursor();
              cur.onsuccess = function() {
                var c = cur.result;
                if (!c || extra-- <= 0) return;
                st['delete'](c.primaryKey);
                c['continue']();
              };
            };
          } catch (e) {}
        });
      }
    },
    clear: function() {
      var k = CacheBox.detect();
      if (k === 'cs') {
        CacheBox.cs = null;
        caches['delete']('hz-media-v1').then(noop, noop);
      } else if (k === 'idb') CacheBox.idb(function(db) {
        try {
          db && db.transaction('m', 'readwrite').objectStore('m').clear();
        } catch (e) {}
      });
    }
  };
  var Media = {
    mem: {},
    keys: [],
    MEM: 180,
    wait: {},
    bad: {},
    on: function() {
      return isActive() && cfg.inmod_poster_cache && CacheBox.detect() !== 'none';
    },
    host: function(url) {
      var m = /^https?:\/\/([^\/?#]+)/i.exec(url);
      return m ? m[1] : '';
    },
    keep: function(url, obj) {
      if (!Media.mem[url]) Media.keys.push(url);
      Media.mem[url] = obj;
      while (Media.keys.length > Media.MEM) {
        var old = Media.keys.shift();
        var o = Media.mem[old];
        delete Media.mem[old];
        if (o) setTimeout(function() {
          try {
            URL.revokeObjectURL(o);
          } catch (e) {}
        }, 3e4);
      }
    },
    drop: function(url) {
      if (Media.mem[url]) {
        delete Media.mem[url];
        var i = Media.keys.indexOf(url);
        if (i >= 0) Media.keys.splice(i, 1);
      }
      CacheBox.remove(url);
    },
    get: function(url, cb) {
      var m = Media.mem[url];
      if (m) return cb(m);
      if (Media.wait[url]) return Media.wait[url].push(cb);
      Media.wait[url] = [ cb ];
      function done(blob, fresh) {
        var obj = '';
        if (blob && blob.size > 100) {
          try {
            obj = URL.createObjectURL(blob);
            Media.keep(url, obj);
          } catch (e) {
            obj = '';
          }
          if (obj && fresh) idle(function() {
            CacheBox.put(url, blob);
          }, 5e3);
        }
        var list = Media.wait[url] || [];
        delete Media.wait[url];
        for (var i = 0; i < list.length; i++) list[i](obj);
      }
      CacheBox.match(url, function(blob) {
        if (blob) return done(blob, false);
        var host = Media.host(url);
        var st = Media.bad[host];
        if (st === 'probe' || st >= 3 || navigator.onLine === false) return done(null);
        if (st === undefined) Media.bad[host] = 'probe';
        var ctl = window.AbortController ? new AbortController() : null;
        var timer = setTimeout(function() {
          if (ctl) ctl.abort();
        }, 9e3);
        fetch(url, {
          mode: 'cors',
          credentials: 'omit',
          signal: ctl ? ctl.signal : undefined
        }).then(function(res) {
          return res.ok ? res.blob() : null;
        }).then(function(blob) {
          clearTimeout(timer);
          Media.bad[host] = 0;
          done(blob && (/^image\//.test(blob.type) || !blob.type) ? blob : null, true);
        }, function() {
          clearTimeout(timer);
          Media.bad[host] = Media.bad[host] === 'probe' ? 3 : (Media.bad[host] || 0) + 1;
          done(null);
        });
      });
    },
    peek: function(url, cb) {
      if (Media.mem[url]) return cb(Media.mem[url]);
      CacheBox.match(url, function(blob) {
        var obj = '';
        if (blob && blob.size > 100) {
          try {
            obj = Media.mem[url] || URL.createObjectURL(blob);
            Media.keep(url, obj);
          } catch (e) {
            obj = '';
          }
        }
        cb(obj);
      });
    },
    boost: function(img) {
      if (!img || !Media.on()) return;
      var proto = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      var url = proto.get.call(img);
      if (!/^https?:\/\//i.test(url) || img.complete && img.naturalWidth) return Media.warm(url);
      var swapped = false;
      Media.peek(url, function(obj) {
        if (obj && !(img.complete && img.naturalWidth) && proto.get.call(img) === url) {
          swapped = true;
          proto.set.call(img, obj);
        }
      });
      img.addEventListener('load', function onload() {
        img.removeEventListener('load', onload);
        if (!swapped) Media.warm(url);
      });
    },
    warm: function(url) {
      if (!Media.on() || Media.mem[url] || Media.wait[url]) return;
      idle(function() {
        Media.get(url, noop);
      }, 6e3);
    },
    hook: function(img) {
      if (!img || img.__hz_img) return;
      img.__hz_img = true;
      var proto = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      if (!proto || !proto.set || !proto.get) return;
      var cur = proto.get.call(img);
      try {
        Object.defineProperty(img, 'src', {
          configurable: true,
          enumerable: true,
          get: function() {
            return img.__hz_src !== undefined ? img.__hz_src : proto.get.call(img);
          },
          set: function(v) {
            var p = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src') || proto;
            v = v === null || v === undefined ? '' : v + '';
            img.__hz_src = v;
            if (!/^https?:\/\//i.test(v) || !Media.on()) return p.set.call(img, v);
            var hit = Media.mem[v];
            if (hit) return p.set.call(img, hit);
            Media.get(v, function(obj) {
              if (img.__hz_src === v) p.set.call(img, obj || v);
            });
          }
        });
      } catch (e) {
        return;
      }
      img.addEventListener('error', function() {
        var shown = proto.get.call(img);
        if (shown.indexOf('blob:') === 0 && img.__hz_src) {
          var orig = img.__hz_src;
          Media.drop(orig);
          proto.set.call(img, orig);
        }
      });
      if (/^https?:\/\//i.test(cur)) Media.warm(cur);
    }
  };
  var LogoPaths = {
    KEY: 'inmod_logo_cache',
    MAX: 400,
    mem: null,
    timer: null,
    load: function() {
      if (LogoPaths.mem) return LogoPaths.mem;
      var m = null;
      try {
        m = JSON.parse(localStorage.getItem(LogoPaths.KEY) || '{}');
      } catch (e) {}
      LogoPaths.mem = m && typeof m === 'object' ? m : {};
      return LogoPaths.mem;
    },
    get: function(k) {
      var e = LogoPaths.load()[k];
      if (!e) return undefined;
      var age = Date.now() - e.t;
      if (!e.p && age > 3 * 864e5 || age > 30 * 864e5) return undefined;
      return e.p;
    },
    set: function(k, p) {
      var m = LogoPaths.load();
      m[k] = {
        p: p || '',
        t: Date.now()
      };
      clearTimeout(LogoPaths.timer);
      LogoPaths.timer = setTimeout(function() {
        idle(function() {
          var keys = Object.keys(m);
          if (keys.length > LogoPaths.MAX) {
            keys.sort(function(a, b) {
              return m[a].t - m[b].t;
            });
            for (var i = 0; i < keys.length - LogoPaths.MAX; i++) delete m[keys[i]];
          }
          try {
            localStorage.setItem(LogoPaths.KEY, JSON.stringify(m));
          } catch (e) {}
        });
      }, 2e3);
    },
    clear: function() {
      LogoPaths.mem = {};
      try {
        localStorage.removeItem(LogoPaths.KEY);
      } catch (e) {}
    }
  };
  var Logo = {
    jobs: {},
    lang: function() {
      try {
        return ((Lampa.Storage.get('tmdb_lang') || Lampa.Storage.get('language') || 'ru') + '').split(/[-_]/)[0];
      } catch (e) {
        return 'ru';
      }
    },
    choose: function(list, lang) {
      if (!list || !list.length) return '';
      var order = [ lang, 'en', null, '' ];
      for (var i = 0; i < order.length; i++) {
        for (var j = 0; j < list.length; j++) {
          var l = list[j];
          if (l && l.file_path && (l.iso_639_1 || null) === (order[i] || null)) return l.file_path;
        }
      }
      return list[0] && list[0].file_path || '';
    },
    url: function(path) {
      return Lampa.TMDB.image('t/p/w500/' + (path + '').replace(/^\//, '').replace(/\.svg$/i, '.png'));
    },
    resolve: function(movie, cb) {
      var type = movie.name || movie.original_name || movie.number_of_seasons ? 'tv' : 'movie';
      var lang = Logo.lang();
      var key = type + movie.id + lang;
      var cached = LogoPaths.get(key);
      if (cached !== undefined) return cb(cached);
      if (movie.images && movie.images.logos) {
        var own = Logo.choose(movie.images.logos, lang);
        LogoPaths.set(key, own);
        return cb(own);
      }
      if (!Lampa.TMDB || !Lampa.TMDB.api) return cb('');
      var net = new Lampa.Reguest();
      try {
        net.silent(Lampa.TMDB.api(type + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + lang + ',en,null'), function(r) {
          var p = Logo.choose(r && r.logos, lang);
          LogoPaths.set(key, p);
          cb(p);
        }, function() {
          cb('');
        });
      } catch (e) {
        cb('');
      }
    },
    prepare: function(movie) {
      if (!isActive() || !cfg.inmod_show_logos || !movie || !movie.id) return;
      if (movie.source && movie.source !== 'tmdb' && movie.source !== 'cub') return;
      var id = movie.id + '';
      if (Logo.jobs[id]) return;
      var job = Logo.jobs[id] = {
        src: undefined,
        cbs: []
      };
      function finish(src) {
        job.src = src || '';
        var c = job.cbs;
        job.cbs = [];
        for (var i = 0; i < c.length; i++) c[i](job.src);
      }
      Logo.resolve(movie, function(path) {
        if (!path) return finish('');
        var url = Logo.url(path);
        if (Media.on()) Media.get(url, function(obj) {
          finish(obj || url);
        }); else finish(url);
      });
      var ids = Object.keys(Logo.jobs);
      if (ids.length > 30) delete Logo.jobs[ids[0]];
    },
    show: function(movie, body) {
      if (!isActive() || !cfg.inmod_show_logos || !movie || !movie.id) return;
      Logo.prepare(movie);
      var job = Logo.jobs[movie.id + ''];
      if (!job) return;
      var t0 = Date.now();
      function put(src) {
        if (!src) return;
        var $render = $(body);
        if ($render.find('.applecation__logo img, .inmod-logo-container').length) return;
        var $title = $render.find('.full-start-new__title').first();
        if (!$title.length) return;
        var img = new Image();
        img.alt = '';
        img.decoding = 'async';
        img.onload = function() {
          if ($render.find('.applecation__logo img, .inmod-logo-container').length) return;
          var box = document.createElement('div');
          box.className = 'inmod-logo-container';
          box.appendChild(img);
          $title.attr('data-inmod-orig-title', $title.text()).empty().append(box);
          if (Date.now() - t0 < 160) img.className = 'inmod-logo-visible inmod-logo-instant'; else requestAnimationFrame(function() {
            img.className = 'inmod-logo-visible';
          });
        };
        img.src = src;
      }
      if (job.src !== undefined) put(job.src); else job.cbs.push(put);
    },
    clear: function() {
      LogoPaths.clear();
      Logo.jobs = {};
    }
  };
  var SeasonInfo = {
    count: function(movie) {
      var list = (movie.seasons || []).filter(function(x) {
        return x && x.season_number > 0;
      });
      var totalS = movie.number_of_seasons || list.length, totalE = movie.number_of_episodes || 0;
      var now = Date.now(), airedS = 0, airedE = 0;
      var last = movie.last_episode_to_air;
      if (last && last.season_number > 0) {
        airedS = last.season_number;
        airedE = last.episode_number || 0;
        list.forEach(function(x) {
          if (x.season_number < last.season_number) airedE += x.episode_count || 0;
        });
      } else {
        list.forEach(function(x) {
          var d = x.air_date ? Date.parse(x.air_date) : NaN;
          if (d <= now) {
            airedS++;
            airedE += x.episode_count || 0;
          }
        });
      }
      if (!airedS) airedS = totalS;
      if (!airedE) airedE = totalE;
      if (totalE && airedE > totalE) airedE = totalE;
      if (airedS > totalS) totalS = airedS;
      return {
        s: totalS,
        e: totalE,
        as: airedS,
        ae: airedE
      };
    },
    text: function(movie, mode) {
      var c = SeasonInfo.count(movie);
      var S = mode === 'aired' ? c.as : c.s;
      var partial = mode === 'aired' && c.e > 0 && c.ae < c.e;
      var E = partial ? c.e : mode === 'aired' ? c.ae : c.e;
      if (!S) return null;
      var sTxt = S + ' ' + plural(S, tr('inmod_season_1'), tr('inmod_season_2'), tr('inmod_season_5'));
      if (!E) return [ sTxt ];
      return [ sTxt, (partial ? c.ae + '/' + c.e : E) + ' ' + plural(E, tr('inmod_episode_1'), tr('inmod_episode_2'), tr('inmod_episode_5')) ];
    },
    add: function(movie, body) {
      var poster = body && body.find ? body.find('.full-start-new__poster')[0] : null;
      if (!poster) return;
      var old = poster.getElementsByClassName('hz-season');
      while (old.length) old[0].parentNode.removeChild(old[0]);
      if (!isActive() || cfg.inmod_seasons_info_mode === 'none' || !movie || !movie.number_of_seasons) return;
      var parts = SeasonInfo.text(movie, cfg.inmod_seasons_info_mode);
      if (!parts) return;
      var el = document.createElement('div');
      el.className = 'hz-season';
      el.setAttribute('data-p', {
        'top-left': 'tl',
        'bottom-right': 'br',
        'bottom-left': 'bl'
      }[cfg.inmod_label_position] || 'tr');
      el.appendChild(document.createTextNode(parts[0]));
      if (parts[1]) {
        var dot = document.createElement('b');
        dot.textContent = '·';
        el.appendChild(dot);
        el.appendChild(document.createTextNode(parts[1]));
      }
      poster.appendChild(el);
    }
  };
  var BtnIcons = {
    map: [ [ 'button--play', 'b_play' ], [ 'view--torrent', 'b_magnet' ], [ 'view--trailer', 'b_film' ], [ 'button--book', 'b_bookmark' ], [ 'button--reaction', 'b_smile' ], [ 'button--subscribe', 'b_bell' ], [ 'button--options', 'b_more' ], [ 'view--sd_download', 'b_download' ], [ 'view--online', 'b_online' ] ],
    patch: function(btn) {
      if (btn.__hz_bi || btn.getAttribute('data-inmod-online') || /kinopoisk/i.test(btn.className)) return;
      if (btn.parentNode && btn.parentNode.classList && btn.parentNode.classList.contains('buttons--container')) return;
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
    full: null,
    timer: null,
    label: function(el) {
      var s = el.querySelector('span');
      var t = (s && s.textContent || '').trim().toLowerCase();
      return t || (el.getAttribute('data-subtitle') || '').trim().toLowerCase();
    },
    priorityHash: function(el) {
      try {
        var c = el.cloneNode(true);
        c.classList.remove('focus');
        return Lampa.Utils.hash(c.outerHTML) + '';
      } catch (e) {
        return '-';
      }
    },
    isSource: function(el) {
      var c = el.classList;
      return !c.contains('hide') && (c.contains('selector') || c.contains('view--torrent') || c.contains('view--trailer') || c.contains('view--online'));
    },
    process: function(full) {
      if (!full || !isActive() || !cfg.inmod_show_online_buttons) return;
      var main = full.querySelector('.full-start-new__buttons');
      var box = full.querySelector('.buttons--container');
      if (!main || !box) return;
      var prHash = '';
      try {
        prHash = (Lampa.Storage.get('full_btn_priority', '') + '').trim();
      } catch (e) {}
      var priority = main.querySelector('.button--priority');
      var ours = {}, taken = {}, i, el;
      var kids = main.children;
      for (i = 0; i < kids.length; i++) {
        el = kids[i];
        if (!el.classList.contains('full-start__button')) continue;
        if (el.classList.contains('inmod-source-btn')) ours[el.getAttribute('data-inmod-id')] = el; else {
          var id0 = Buttons.label(el);
          if (id0) taken[id0] = true;
        }
      }
      var add = [], seen = {};
      var src = box.children;
      for (i = 0; i < src.length; i++) {
        el = src[i];
        if (!el.classList.contains('full-start__button') || !Buttons.isSource(el)) continue;
        var id = Buttons.label(el);
        if (!id || seen[id]) continue;
        seen[id] = true;
        if (taken[id] || prHash && Buttons.priorityHash(el) === prHash) continue;
        if (ours[id]) {
          delete ours[id];
          continue;
        }
        add.push(Buttons.clone(el, id));
      }
      for (var k in ours) if (ours[k] && ours[k].parentNode) ours[k].parentNode.removeChild(ours[k]);
      if (add.length) {
        var torrents = add.filter(function(b) {
          return b.classList.contains('inmod-torrent-btn');
        });
        var others = add.filter(function(b) {
          return !b.classList.contains('inmod-torrent-btn');
        });
        for (i = torrents.length - 1; i >= 0; i--) main.insertBefore(torrents[i], main.firstChild);
        var after = priority || torrents[torrents.length - 1] || null;
        others.forEach(function(b) {
          main.insertBefore(b, after ? after.nextSibling : main.firstChild);
          after = b;
        });
      }
      full.classList.toggle('inmod-sources-ready', !!(main.querySelector('.inmod-source-btn') || priority));
      if (add.length) {
        Buttons.refreshNav(full);
        OnlineIcons.scan(main);
        BtnIcons.scan(main);
      }
    },
    clone: function(el, id) {
      var c = el.cloneNode(true);
      c.classList.remove('hide', 'focus', 'hover', 'traverse');
      c.classList.add('selector', 'inmod-source-btn');
      c.setAttribute('data-inmod-id', id);
      if (el.classList.contains('view--torrent')) c.classList.add('inmod-torrent-btn');
      var $s = $(el);
      $(c).on('hover:enter', function() {
        $s.trigger('hover:enter');
      }).on('hover:long', function() {
        $s.trigger('hover:long');
      });
      return c;
    },
    refreshNav: function(full) {
      try {
        var c = Lampa.Controller.enabled();
        if (c && c.name === 'full_start') Lampa.Controller.collectionSet($(full));
      } catch (e) {}
    },
    focusFirst: function(full) {
      if (!full || full.__hz_focused || !full.classList.contains('inmod-sources-ready')) return;
      var main = full.querySelector('.full-start-new__buttons');
      if (!main) return;
      var cur = main.querySelector('.focus');
      if (cur && !cur.classList.contains('button--play')) return;
      var target = main.querySelector('.inmod-torrent-btn') || main.querySelector('.button--priority') || main.querySelector('.inmod-source-btn');
      if (!target) return;
      full.__hz_focused = true;
      try {
        Lampa.Controller.collectionSet($(full));
        Lampa.Controller.collectionFocus(target, $(full));
      } catch (e) {}
    },
    schedule: function() {
      clearTimeout(Buttons.timer);
      Buttons.timer = setTimeout(function() {
        if (Buttons.full && Buttons.full.parentNode) {
          Buttons.process(Buttons.full);
          BtnIcons.scan(Buttons.full);
        }
      }, 30);
    },
    watch: function(full) {
      Buttons.unwatch();
      if (!full || !window.MutationObserver) return;
      Buttons.full = full;
      var box = full.querySelector('.buttons--container');
      var main = full.querySelector('.full-start-new__buttons');
      Buttons.mo = new MutationObserver(function(muts) {
        if (!isActive()) return;
        for (var i = 0; i < muts.length; i++) {
          var m = muts[i];
          if (m.type === 'attributes') {
            var was = /(^|\s)hide(\s|$)/.test(m.oldValue || '');
            if (was !== m.target.classList.contains('hide')) return Buttons.schedule();
          } else {
            for (var j = 0; j < m.addedNodes.length; j++) {
              var n = m.addedNodes[j];
              if (n.nodeType === 1 && !n.classList.contains('inmod-source-btn')) return Buttons.schedule();
            }
            for (j = 0; j < m.removedNodes.length; j++) {
              var r = m.removedNodes[j];
              if (r.nodeType === 1 && !r.classList.contains('inmod-source-btn')) return Buttons.schedule();
            }
          }
        }
      });
      if (box) Buttons.mo.observe(box, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [ 'class' ],
        attributeOldValue: true
      });
      if (main) Buttons.mo.observe(main, {
        childList: true
      });
    },
    unwatch: function() {
      if (Buttons.mo) {
        try {
          Buttons.mo.disconnect();
        } catch (e) {}
      }
      clearTimeout(Buttons.timer);
      Buttons.mo = null;
      Buttons.full = null;
    },
    reset: function() {
      var list = document.querySelectorAll('.inmod-source-btn');
      for (var i = 0; i < list.length; i++) list[i].parentNode.removeChild(list[i]);
      var f = document.querySelectorAll('.full-start-new.inmod-sources-ready');
      for (i = 0; i < f.length; i++) f[i].classList.remove('inmod-sources-ready');
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
    flush: function(list) {
      if (!isActive()) return;
      var torrents = false, main = null, nav = false;
      for (var i = 0; i < list.length; i++) {
        var node = list[i];
        if (!node.parentNode) continue;
        var cl = node.classList;
        if (!cl) continue;
        if (cl.contains('card')) {
          Badges.processCard(node);
          continue;
        }
        if (cl.contains('card__marker') || cl.contains('card__icons')) {
          Badges.adopt(node);
          continue;
        }
        if (cl.contains('full-start__button')) {
          if (node.parentNode.classList.contains('full-start-new__buttons')) main = node.parentNode;
          continue;
        }
        if (cl.contains('menu__item')) Icons.applyMenu(node);
        if (cl.contains('navigation-bar__item')) nav = true;
        if (cfg.inmod_torrent_styles && (node.className + '').indexOf('torrent') >= 0) torrents = true;
        if (node.firstElementChild) {
          var cards = node.getElementsByClassName('card');
          for (var j = 0; j < cards.length; j++) Badges.processCard(cards[j]);
          if (cl.contains('navigation-bar__body') || cl.contains('navigation-bar')) nav = true;
        }
      }
      if (main) {
        OnlineIcons.scan(main);
        BtnIcons.scan(main);
      }
      if (nav) Nav.mark();
      if (torrents) Torrents.schedule();
    },
    start: function() {
      if (Watcher.mo || !window.MutationObserver) return;
      Watcher.mo = new MutationObserver(function(muts) {
        var list = [];
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) if (added[j].nodeType === 1) list.push(added[j]);
        }
        if (list.length) Watcher.flush(list);
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
    }
  };
  var Full = {
    current: function() {
      if (Buttons.full && Buttons.full.parentNode) return Buttons.full;
      var list = document.querySelectorAll('.activity--active .full-start-new');
      return list[0] || null;
    },
    seen: function(body) {
      var line = body[0] && body[0].querySelector ? body[0].querySelector('.full-start-new__rate-line') : null;
      if (!line) return;
      for (var c = line.firstElementChild; c; c = c.nextElementSibling) if (!c.classList.contains('hide')) c.classList.add('hz-seen');
    },
    complite: function(e) {
      var movie = e.data && e.data.movie;
      var body = e.body || $(e.object && e.object.activity ? e.object.activity.render() : []);
      if (!movie || !body) return;
      Full.seen(body);
      var root = body[0];
      if (root && root.querySelectorAll) {
        var pics = root.querySelectorAll('.full-start__background, .full-start-new__img');
        for (var p = 0; p < pics.length; p++) Media.boost(pics[p]);
      }
      Badges.full(movie, body);
      SeasonInfo.add(movie, body);
      Logo.show(movie, body);
      Backdrop.remember(movie);
      var full = body.hasClass('full-start-new') ? body[0] : body.find('.full-start-new')[0];
      if (!full) return;
      var main = full.querySelector('.full-start-new__buttons');
      if (main) {
        OnlineIcons.scan(main);
        BtnIcons.scan(main);
      }
      Buttons.watch(full);
      if (cfg.inmod_show_online_buttons) {
        Buttons.process(full);
        setTimeout(function() {
          Buttons.focusFirst(full);
        }, 60);
      }
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
    var full = Full.current();
    if (full) {
      Buttons.watch(full);
      Buttons.process(full);
    }
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
        name: 'inmod_icon_size',
        type: 'select',
        values: {
          70: 'Мелкие',
          85: 'Меньше',
          100: 'Обычные',
          120: 'Крупнее',
          145: 'Крупные'
        },
        default: DEFAULTS.inmod_icon_size
      },
      field: {
        name: 'Размер значков на постере',
        description: 'Значки истории, закладок и метки «Смотрю» на постере'
      },
      onChange: function(v) {
        setAndApply('inmod_icon_size', v, Theme.apply);
      }
    });
    add({
      component: COMPONENT,
      param: {
        name: 'inmod_icon_opacity',
        type: 'select',
        values: {
          100: '100%',
          85: '85%',
          70: '70%',
          55: '55%',
          40: '40%'
        },
        default: DEFAULTS.inmod_icon_opacity
      },
      field: {
        name: 'Прозрачность значков на постере'
      },
      onChange: function(v) {
        setAndApply('inmod_icon_opacity', v, Theme.apply);
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
        name: 'inmod_headbar',
        type: 'select',
        values: {
          glass: 'Матовое стекло',
          off: 'Прозрачная (как в Lampa)'
        },
        default: DEFAULTS.inmod_headbar
      },
      field: {
        name: 'Верхняя панель',
        description: 'Полоса под кнопками меню и профиля в цветах фона, чуть темнее. На ТВ — без размытия, чтобы не тормозило'
      },
      onChange: function(v) {
        setAndApply('inmod_headbar', v, Theme.apply);
      }
    });
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
        if (v && isActive()) Buttons.process(Full.current()); else Buttons.reset();
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
        name: 'inmod_poster_cache',
        type: 'trigger',
        default: DEFAULTS.inmod_poster_cache
      },
      field: {
        name: 'Кеш постеров и логотипов',
        description: 'Постеры и логотипы сохраняются на устройстве, и при повторном открытии главной не загружаются заново'
      },
      onChange: function(v) {
        setAndApply('inmod_poster_cache', v);
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
        name: 'Очистить кеш постеров и логотипов'
      },
      onChange: function() {
        Logo.clear();
        CacheBox.clear();
        Lampa.Noty.show('Кеш очищен');
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
      try {
        var body = e.body || $('.settings__body');
        Icons.prepatch();
        Icons.applySettings(body);
        var $f = body.find('.settings-folder[data-component="' + COMPONENT + '"]');
        var $i = body.find('.settings-folder[data-component="interface"]');
        if ($f.length && $i.length && $i.next()[0] !== $f[0]) $f.insertAfter($i);
      } catch (err) {}
    });
  }
  function listen() {
    Lampa.Listener.follow('activity', function(e) {
      if (!isActive()) return;
      if (e.type === 'start') Nav.set(Nav.fromActivity(e.object));
      if ((e.type === 'destroy' || e.type === 'archive') && e.component === 'full') Buttons.unwatch();
    });
    document.addEventListener('click', function(ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest('.navigation-bar__item[data-action]') : null;
      if (t) Nav.set(t.getAttribute('data-action'));
    }, true);
    Lampa.Listener.follow('full', function(e) {
      if (!isActive()) return;
      try {
        if (e.type === 'start') {
          Buttons.unwatch();
          if (e.data && e.data.movie) {
            Logo.prepare(e.data.movie);
            if (cfg.inmod_bg_remember) Backdrop.capture(e.data.movie, true);
          }
        }
        if (e.type === 'complite') Full.complite(e);
      } catch (err) {
        console.log('[HZ-UI] full', err);
      }
    });
    Lampa.Controller.listener.follow('toggle', function(e) {
      if (!isActive() || e.name !== 'full_start' || !cfg.inmod_show_online_buttons) return;
      setTimeout(function() {
        var f = Buttons.full;
        if (f && f.parentNode) Buttons.focusFirst(f);
      }, 20);
    });
  }
  function cleanupLegacy() {
    idle(function() {
      try {
        if (window.indexedDB && !localStorage.getItem('inmod_legacy_clean')) {
          indexedDB.deleteDatabase('inmod_cache');
          localStorage.setItem('inmod_legacy_clean', '1');
        }
      } catch (e) {}
      if (Media.on()) CacheBox.trim();
    }, 15e3);
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
        try {
          Icons.prepatch();
        } catch (e) {}
      }, 2500);
      if (Backdrop.hasSnap()) Backdrop.restore(); else setTimeout(Backdrop.restore, 1300);
    }
    cleanupLegacy();
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
  if (window.appready) start(); else Lampa.Listener.follow('app', function(e) {
    if (e.type === 'ready') start();
  });
})();
