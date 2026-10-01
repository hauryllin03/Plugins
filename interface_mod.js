/*
 * HanzoTV · Оформление (interface_mod.js) v4.0.0
 * ------------------------------------------------------------
 * Полная переработка «Interface Mod» (@pavelpikta, v3.4.1) в стиле Apple:
 *   • темы = акцентный цвет фокуса (Белый tvOS, Синий, Бирюзовый, …)
 *   • нейтральные «стеклянные» плашки на постерах вместо цветных
 *   • фон приложения: пресеты, свой цвет, своя картинка
 *   • запоминание размытого постера последнего тайтла (переживает перезапуск)
 *   • единый набор иконок для пунктов меню и настроек плагинов HanzoTV
 *   • сохранено из v3: кнопки источников отдельно, иконки провайдеров,
 *     логотипы TMDB, инфо о сезонах, стили торрентов, перевод статусов
 *
 * ES5 намеренно: целевое железо — старые Android TV WebView.
 */
(function () {
  'use strict';

  if (window.__hz_interface_v4) return;
  window.__hz_interface_v4 = true;

  var VERSION = '4.0.0';
  var COMPONENT = 'inmod_settings';

  // ==========================================================================
  // ИКОНКИ (24×24, линия 1.8, скругления — в духе SF Symbols и иконок Lampa)
  // ==========================================================================
  function svg(body) {
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">' +
      body + '</svg>';
  }

  var ICONS = {
    palette: svg('<path d="M12 3.2c-4.9 0-8.8 3.8-8.8 8.6 0 4.9 3.9 9 8.6 9 1.2 0 1.9-.8 1.9-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1 .8-1.8 1.8-1.8h2.1c2.6 0 4.6-2.1 4.6-4.6C21.2 6.6 17.1 3.2 12 3.2z"/>' +
      '<circle cx="7.6" cy="11.6" r="1.15" fill="currentColor" stroke="none"/><circle cx="9.7" cy="7.6" r="1.15" fill="currentColor" stroke="none"/>' +
      '<circle cx="14.3" cy="7.2" r="1.15" fill="currentColor" stroke="none"/><circle cx="17.2" cy="10.4" r="1.15" fill="currentColor" stroke="none"/>'),
    collections: svg('<rect x="3.5" y="8.5" width="17" height="12" rx="2.6"/><path d="M6 5.5h12M8.5 2.8h7"/>'),
    star: svg('<path d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
    dock: svg('<rect x="3" y="3.5" width="18" height="17" rx="3.6"/><rect x="6.5" y="14" width="11" height="3.4" rx="1.7"/>'),
    ticket: svg('<path d="M3.5 8a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1.6a2.4 2.4 0 0 0 0 4.8V16a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-1.6a2.4 2.4 0 0 0 0-4.8z"/><path d="M14.5 7v1.5M14.5 11.3v1.4M14.5 15.5V17"/>'),
    skip: svg('<path d="M4.5 6.8v10.4L11 12zM11.5 6.8v10.4L18 12z"/><path d="M20 6.5v11"/>'),
    stack: svg('<rect x="8" y="8" width="12.5" height="12.5" rx="2.6"/><path d="M4 15.5V6.1A2.6 2.6 0 0 1 6.6 3.5H16"/>'),
    tv: svg('<rect x="2.8" y="4.5" width="18.4" height="12.6" rx="2.4"/><path d="M8.5 20.3h7"/>'),
    bell: svg('<path d="M6.2 16.6v-5.3a5.8 5.8 0 0 1 11.6 0v5.3l1.6 1.9H4.6z"/><path d="M10 21a2.3 2.3 0 0 0 4 0"/>'),
    play: svg('<rect x="3" y="4.5" width="18" height="15" rx="4"/><path d="M10.3 9.3v5.4l4.5-2.7z"/>'),
    update: svg('<path d="M19.4 9.2A7.8 7.8 0 0 0 5.4 7.6L4 9.2"/><path d="M4 4.6v4.6h4.6"/><path d="M4.6 14.8a7.8 7.8 0 0 0 14 1.6l1.4-1.6"/><path d="M20 19.4v-4.6h-4.6"/>'),
    download: svg('<circle cx="12" cy="12" r="8.8"/><path d="M12 7.4v8.6M8.3 12.5 12 16.2l3.7-3.7"/>'),
    log: svg('<path d="M6.6 3h7.1l4.8 4.8V19a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M13.5 3.2V8h4.8M8.4 12.6h7.2M8.4 16.2h4.8"/>')
  };

  // Компонент настроек → иконка (ваши плагины)
  var SETTINGS_ICONS = {
    inmod_settings: 'palette',          // этот плагин
    streaming_collections: 'collections', // podborki.js
    mobile_ratings: 'star',             // mobile_ratings.js
    nav_bar_extension: 'dock',          // navigation_bar.js
    kinopoisk: 'ticket',                // kinopoisk.js
    skip_learn: 'skip',                 // skip_learn.js
    hzf: 'stack',                       // franchises.js
    nfx: 'tv',                          // netflix_ui.js
    notify_bg: 'bell',                  // TelegramBot / notify_bg.js
    lampabs: 'play',                    // APK: раздел HanzoTV
    lampabs_updates: 'update'           // APK: обновления
  };

  // Пункт бокового меню → иконка
  var MENU_ICONS = [
    { sel: '[data-action="sd_downloads"]', icon: 'download' }, // stream_download.js
    { sel: '.lampabs-menu-downloads', icon: 'download' },      // APK: Загрузки
    { sel: '[data-action="hzf"]', icon: 'stack' },             // franchises.js
    { sel: '[data-action="nfx"]', icon: 'tv' },                // netflix_ui.js
    { sel: '.hanzo-log-item', icon: 'log' }                    // APK: Журнал
  ];

  // ==========================================================================
  // ПАЛИТРЫ
  // ==========================================================================
  // on — цвет текста на акценте; dark=true значит текст тёмный (нужна инверсия белых иконок)
  var ACCENTS = {
    white:    { name: 'Белый (tvOS)', accent: '#ffffff', on: '#0b0b0c', ring: '#ffffff', dark: true },
    blue:     { name: 'Синий',        accent: '#0a84ff', on: '#ffffff', ring: '#409cff' },
    teal:     { name: 'Бирюзовый',    accent: '#2bb5a5', on: '#ffffff', ring: '#43cea2' },
    indigo:   { name: 'Индиго',       accent: '#5e5ce6', on: '#ffffff', ring: '#7d7aff' },
    purple:   { name: 'Фиолетовый',   accent: '#bf5af2', on: '#ffffff', ring: '#cf7cf5' },
    pink:     { name: 'Розовый',      accent: '#ff375f', on: '#ffffff', ring: '#ff6482' },
    orange:   { name: 'Оранжевый',    accent: '#ff9f0a', on: '#1c1c1e', ring: '#ffb340', dark: true },
    graphite: { name: 'Графит',       accent: '#636366', on: '#ffffff', ring: '#aeaeb2' }
  };

  // bg — фон приложения (статичный градиент, рисуется один раз), solid — для html,
  // surface — панели настроек/модалки
  var BACKGROUNDS = {
    graphite: { name: 'Графит',
      bg: 'radial-gradient(120% 85% at 50% -15%, #343438 0%, #1c1c1e 48%, #0c0c0d 100%)',
      solid: '#1c1c1e', surface: '#1c1c1e', surface2: '#2c2c2e' },
    black: { name: 'Чёрный (OLED)',
      bg: '#000000', solid: '#000000', surface: '#121214', surface2: '#1c1c1e' },
    midnight: { name: 'Полночь',
      bg: 'radial-gradient(110% 90% at 15% -10%, #23345a 0%, #111a2e 45%, #060910 100%)',
      solid: '#0e1526', surface: '#131b2c', surface2: '#1d2740' },
    ocean: { name: 'Глубокий синий',
      bg: 'linear-gradient(165deg, #0b2a4a 0%, #071a30 50%, #030b16 100%)',
      solid: '#071a30', surface: '#0c2036', surface2: '#132c47' },
    teal: { name: 'Бирюзовый',
      bg: 'radial-gradient(120% 90% at 85% -10%, #12514d 0%, #0b2f34 45%, #051416 100%)',
      solid: '#0b2a2e', surface: '#0f2b2f', surface2: '#173b40' },
    aurora: { name: 'Аврора',
      bg: 'radial-gradient(55% 45% at 12% 8%, rgba(94,92,230,.38) 0%, rgba(94,92,230,0) 70%),' +
          'radial-gradient(50% 42% at 88% 14%, rgba(48,176,199,.30) 0%, rgba(48,176,199,0) 70%),' +
          'radial-gradient(70% 55% at 55% 115%, rgba(191,90,242,.26) 0%, rgba(191,90,242,0) 70%),' +
          'linear-gradient(180deg, #0d0d16 0%, #08080d 100%)',
      solid: '#0b0b12', surface: '#15151f', surface2: '#20202d' },
    dusk: { name: 'Закат',
      bg: 'radial-gradient(90% 70% at 85% 0%, rgba(255,120,80,.22) 0%, rgba(255,120,80,0) 65%),' +
          'radial-gradient(120% 90% at 10% 10%, #3a1838 0%, #1b0d1d 50%, #0b060c 100%)',
      solid: '#1b0d1d', surface: '#211326', surface2: '#2f1d36' },
    lampa: { name: 'Стандартный Lampa', bg: '', solid: '#1d1f20', surface: '#262829', surface2: '#353535' },
    color: { name: 'Свой цвет', custom: true },
    image: { name: 'Своя картинка', custom: true }
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
    inmod_badge_type: 'all',
    inmod_badge_style: 'dark',
    inmod_badge_rating: true,
    inmod_badge_quality: true,
    inmod_icons: true,
    inmod_show_online_buttons: true,
    inmod_patch_online_icons: true,
    inmod_show_logos: true,
    inmod_seasons_info_mode: 'aired',
    inmod_label_position: 'top-right',
    inmod_torrent_styles: true
  };

  // ==========================================================================
  // УТИЛИТЫ
  // ==========================================================================
  var cfg = {};

  function storeGet(key) {
    var def = DEFAULTS[key];
    var v;
    try { v = Lampa.Storage.get(key, def); } catch (e) { v = def; }
    if (v === undefined || v === null || v === '') v = (def === '' ? '' : def);
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
    try { return Lampa.Lang.translate(key); } catch (e) { return key; }
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
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }

  function mix(rgb, target, t) {
    return 'rgb(' + rgb.map(function (c, i) { return Math.round(c + (target[i] - c) * t); }).join(',') + ')';
  }

  function isActive() { return !!cfg.inmod_enabled; }

  // ==========================================================================
  // ПЕРЕВОДЫ
  // ==========================================================================
  function registerTranslations() {
    Lampa.Lang.add({
      hz_movie: { ru: 'Фильм', en: 'Movie', uk: 'Фільм' },
      hz_serial: { ru: 'Сериал', en: 'Series', uk: 'Серіал' },
      inmod_status_ended: { ru: 'Завершён', en: 'Ended', uk: 'Завершений' },
      inmod_status_canceled: { ru: 'Отменён', en: 'Canceled', uk: 'Скасовано' },
      inmod_status_returning: { ru: 'Выходит', en: 'Returning', uk: 'Виходить' },
      inmod_status_production: { ru: 'В производстве', en: 'In Production', uk: 'У виробництві' },
      inmod_status_planned: { ru: 'Запланирован', en: 'Planned', uk: 'Заплановано' },
      inmod_status_released: { ru: 'Вышел', en: 'Released', uk: 'Вийшов' },
      inmod_status_post: { ru: 'Скоро', en: 'Post Production', uk: 'Скоро' },
      inmod_status_unknown: { ru: 'Неизвестно', en: 'Unknown', uk: 'Невідомо' },
      inmod_season_1: { ru: 'сезон', en: 'season', uk: 'сезон' },
      inmod_season_2: { ru: 'сезона', en: 'seasons', uk: 'сезони' },
      inmod_season_5: { ru: 'сезонов', en: 'seasons', uk: 'сезонів' },
      inmod_episode_1: { ru: 'серия', en: 'episode', uk: 'серія' },
      inmod_episode_2: { ru: 'серии', en: 'episodes', uk: 'серії' },
      inmod_episode_5: { ru: 'серий', en: 'episodes', uk: 'серій' },
      inmod_out_of: { ru: 'из', en: 'of', uk: 'із' }
    });
    Lampa.Lang.add({
      tv_status_returning_series: { ru: tr('inmod_status_returning') },
      tv_status_planned: { ru: tr('inmod_status_planned') },
      tv_status_in_production: { ru: tr('inmod_status_production') },
      tv_status_ended: { ru: tr('inmod_status_ended') },
      tv_status_canceled: { ru: tr('inmod_status_canceled') },
      tv_status_pilot: { ru: 'Пилот' },
      tv_status_released: { ru: tr('inmod_status_released') },
      tv_status_rumored: { ru: 'По слухам' },
      tv_status_post_production: { ru: tr('inmod_status_post') }
    });
  }

  // ==========================================================================
  // ТЕМА: переменные + статический CSS
  // ==========================================================================
  var Theme = {
    vars: function () {
      var a = ACCENTS[cfg.inmod_accent] || ACCENTS.white;
      var b = BACKGROUNDS[cfg.inmod_bg] || BACKGROUNDS.graphite;
      var bg = b.bg, solid = b.solid, surface = b.surface, surface2 = b.surface2;

      if (cfg.inmod_bg === 'color') {
        var rgb = hexToRgb(cfg.inmod_bg_color) || [16, 24, 32];
        bg = 'radial-gradient(120% 90% at 50% -15%, ' + mix(rgb, [255, 255, 255], 0.12) + ' 0%, ' +
          mix(rgb, [0, 0, 0], 0) + ' 45%, ' + mix(rgb, [0, 0, 0], 0.65) + ' 100%)';
        solid = mix(rgb, [0, 0, 0], 0.2);
        surface = mix(rgb, [20, 20, 22], 0.6);
        surface2 = mix(rgb, [44, 44, 46], 0.55);
      }
      if (cfg.inmod_bg === 'image') {
        var url = (cfg.inmod_bg_image + '').trim();
        if (/^(https?:)?\/\//i.test(url) || /^data:image\//i.test(url)) {
          url = url.replace(/["\\\n\r]/g, '');
          bg = 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.62) 100%), url("' + url + '") center / cover no-repeat, #0c0c0d';
        } else {
          bg = BACKGROUNDS.graphite.bg;
        }
        solid = '#0c0c0d'; surface = '#1c1c1e'; surface2 = '#2c2c2e';
      }

      var poster = parseInt(cfg.inmod_bg_poster, 10);
      if (!(poster > 0 && poster <= 100)) poster = 100;

      return [
        ':root{',
        '--hz-accent:' + a.accent + ';',
        '--hz-on-accent:' + a.on + ';',
        '--hz-ring:' + a.ring + ';',
        '--hz-bg:' + (bg || 'none') + ';',
        '--hz-bg-solid:' + solid + ';',
        '--hz-surface:' + surface + ';',
        '--hz-surface-2:' + surface2 + ';',
        '--hz-poster-opacity:' + (poster / 100) + ';',
        '}'
      ].join('\n');
    },

    css: function () {
      var spinner = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g>' +
        (function () {
          var s = '';
          for (var i = 0; i < 12; i++) {
            s += '<rect x="29.5" y="6" width="5" height="15" rx="2.5" fill="#fff" opacity="' + (0.15 + i * 0.07).toFixed(2) +
              '" transform="rotate(' + (i * 30) + ' 32 32)"/>';
          }
          return s;
        })() +
        '<animateTransform attributeName="transform" type="rotate" calcMode="discrete" dur="1s" repeatCount="indefinite" ' +
        'values="0 32 32;30 32 32;60 32 32;90 32 32;120 32 32;150 32 32;180 32 32;210 32 32;240 32 32;270 32 32;300 32 32;330 32 32"/>' +
        '</g></svg>');

      function mask(path) {
        return 'url("data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>') + '")';
      }
      function maskFill(path) {
        return 'url("data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000" d="' + path + '"/></svg>') + '")';
      }

      var STAR = maskFill('M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z');
      var MARK = {
        look: mask('<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>'),
        viewed: mask('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
        scheduled: mask('<rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M4 10h16M8.5 3.5v3M15.5 3.5v3"/>'),
        continued: maskFill('M7.5 5.2v13.6c0 .8.9 1.3 1.6.9l10.6-6.8c.6-.4.6-1.4 0-1.8L9.1 4.3c-.7-.4-1.6.1-1.6.9z'),
        thrown: mask('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>')
      };

      var B = 'body.hz-on';
      var FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Roboto, "Segoe UI", SegoeUI, Arial, sans-serif';

      var focusSel = [
        '.menu__item.focus', '.menu__item.traverse', '.menu__item.hover',
        '.head__action.focus', '.head__action.hover',
        '.full-start__button.focus', '.simple-button.focus',
        '.selectbox-item.focus', '.settings-folder.focus', '.settings-param.focus',
        '.full-descr__tag.focus', '.tag-count.focus', '.search-source.focus',
        '.player-panel .button.focus', '.watched-history.focus', '.full-person.selector.focus',
        '.navigation-bar__item.focus'
      ].map(function (s) { return B + ' ' + s; }).join(',\n');

      var ringSel = [
        '.card.focus .card__view::after', '.card.hover .card__view::after',
        '.card-more.focus .card-more__box::after', '.full-episode.focus::after',
        '.card-episode.focus .full-episode::after', '.torrent-item.focus::after',
        '.extensions__item.focus::after', '.extensions__block-add.focus::after',
        '.full-review-add.focus::after', '.explorer-card__head-img.selector.focus::after'
      ].map(function (s) { return B + ' ' + s; }).join(',\n');

      var css = [
        // ---------- фон ----------
        'html{background:var(--hz-bg-solid);}',
        B + '.hz-bg-set{background:var(--hz-bg) !important;background-color:var(--hz-bg-solid) !important;}',
        // canvas-слои Lampa (размытый постер) — регулируемая яркость поверх нашего фона
        B + ' .background__fade{opacity:var(--hz-poster-opacity) !important;}',
        B + ' .background__one.visible,' + B + ' .background__two.visible{opacity:var(--hz-poster-opacity);}',

        // ---------- типографика ----------
        B + '.hz-font{font-family:' + FONT + ';letter-spacing:-0.005em;}',
        B + '.hz-font .items-line__title{font-weight:600;letter-spacing:-0.015em;}',
        B + ' .card__title{font-weight:500;}',
        B + ' .card__age{color:rgba(235,235,245,.55);}',

        // ---------- фокус = акцент ----------
        focusSel + '{background:var(--hz-accent) !important;color:var(--hz-on-accent) !important;}',
        B + ' .full-start__button,' + B + ' .simple-button{border-radius:.9em;}',
        B + ' .selectbox-item,' + B + ' .settings-folder,' + B + ' .settings-param{border-radius:.8em;}',
        // иконки в фокусе: белые svg/img — инвертируем только при тёмном тексте на акценте
        B + ' .settings-folder.focus .settings-folder__icon,' + B + ' .selectbox-item.focus .selectbox-item__checkbox,' +
        B + ' .settings-param.focus .selectbox-item__checkbox{-webkit-filter:none !important;filter:none !important;}',
        B + '.hz-on-dark .settings-folder.focus .settings-folder__icon:not(.hz-ico),' + B + '.hz-on-dark .selectbox-item.focus .selectbox-item__checkbox{-webkit-filter:invert(1) !important;filter:invert(1) !important;}',
        B + ':not(.hz-on-dark) .menu__item.focus .menu__ico > img,' + B + ':not(.hz-on-dark) .menu__item.traverse .menu__ico > img,' + B + ':not(.hz-on-dark) .menu__item.hover .menu__ico > img{-webkit-filter:none;filter:none;}',
        B + ' .menu__item.focus .menu__ico [stroke],' + B + ' .menu__item.traverse .menu__ico [stroke],' + B + ' .menu__item.hover .menu__ico [stroke]{stroke:var(--hz-on-accent);}',
        B + ' .menu__item.focus .menu__ico path[fill]:not([fill="none"]),' + B + ' .menu__item.focus .menu__ico rect[fill]:not([fill="none"]),' + B + ' .menu__item.focus .menu__ico circle[fill]:not([fill="none"]),' +
        B + ' .menu__item.traverse .menu__ico path[fill]:not([fill="none"]),' + B + ' .menu__item.hover .menu__ico path[fill]:not([fill="none"]){fill:var(--hz-on-accent);}',
        B + ' .menu__item .menu__ico [fill="none"]{fill:none !important;}',
        B + ' .menu__ico .hz-svg, ' + B + ' .settings-folder__icon.hz-ico svg{width:100%;height:100%;}',

        // кольцо фокуса карточек
        ringSel + '{border-color:var(--hz-ring) !important;border-width:.22em !important;border-radius:1.3em;}',
        B + ' .card.hover .card__view::after{opacity:.55;}',

        // ---------- панели ----------
        B + ' .settings__content,' + B + ' .selectbox__content,' + B + ' .modal__content,' + B + ' .settings-input__content,' +
        B + ' .settings-input--free,' + B + ' .discuss-rules,' + B + ' .bell__item,' + B + ' .navigation-bar__body{background-color:var(--hz-surface) !important;}',
        B + ' .modal__content{border-radius:1.4em;box-shadow:0 1.5em 4em rgba(0,0,0,.45);}',
        B + ' .settings-param-title > span{color:rgba(235,235,245,.6);text-transform:uppercase;font-size:.8em;letter-spacing:.06em;font-weight:600;}',
        B + ' .settings-param__descr{color:rgba(235,235,245,.6);}',
        B + ' .settings-param.focus .settings-param__descr,' + B + ' .settings-folder.focus .settings-param__descr{color:var(--hz-on-accent) !important;opacity:.62;}',
        B + ' .settings-param.focus .settings-param__value,' + B + ' .settings-param.focus .settings-param__name{color:var(--hz-on-accent) !important;}',
        B + ' .selectbox-item.focus .selectbox-item__subtitle{color:var(--hz-on-accent) !important;opacity:.62;}',
        B + ' .card__img,' + B + ' .card-more__box,' + B + ' .full-start-new__poster,' + B + ' .extensions__item,' + B + ' .extensions__block-add{background-color:var(--hz-surface-2);}',
        B + ' .torrent-serial{background-color:var(--hz-surface);}',
        B + ' .torrent-serial__size,' + B + ' .torrent-file__size{background-color:var(--hz-surface-2);}',

        // стекло (backdrop-filter) — только по желанию: дорого на слабых ТВ
        B + '.hz-blur .settings__content,' + B + '.hz-blur .selectbox__content,' + B + '.hz-blur .modal__content,' +
        B + '.hz-blur .settings-input__content,' + B + '.hz-blur .navigation-bar__body{' +
          'background-color:rgba(30,30,32,.72) !important;-webkit-backdrop-filter:blur(28px) saturate(170%);backdrop-filter:blur(28px) saturate(170%);}',

        // ---------- лоадер (activity indicator) ----------
        B + ' .activity__loader,' + B + ' .screensaver__preload{background:url("' + spinner + '") no-repeat 50% 50% !important;background-size:3.2em 3.2em !important;}',

        // ---------- плашки на постерах ----------
        B + ' .hz-badge,' + B + ' .card__view > .card__vote,' + B + ' .card__view > .card__quality,' + B + ' .card__view > .card__marker{' +
          'position:absolute;z-index:2;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;' +
          'font-family:' + FONT + ';font-weight:600;line-height:1;white-space:nowrap;' +
          'background:rgba(16,16,18,.62);color:rgba(255,255,255,.96);' +
          'box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);border-radius:.62em;}',
        B + ' .hz-badge{top:.55em;left:.55em;font-size:.78em;padding:.42em .62em;letter-spacing:.01em;}',

        // рейтинг: справа внизу, звезда
        B + ' .card__view > .card__vote{top:auto;left:auto;right:.55em;bottom:.55em;font-size:.95em;padding:.36em .55em .36em .48em;}',
        B + ' .card__view > .card__vote::before{content:"";width:.78em;height:.78em;margin-right:.3em;background:currentColor;' +
          '-webkit-mask:' + STAR + ' center / contain no-repeat;mask:' + STAR + ' center / contain no-repeat;opacity:.9;}',

        // качество: контурная плашка, сверху слева (под «Фильм», если он есть)
        B + ' .card__view > .card__quality{left:.55em;right:auto;top:.55em;bottom:auto;font-size:.7em;padding:.42em .55em;' +
          'text-transform:uppercase;letter-spacing:.04em;background:rgba(16,16,18,.38);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.62);}',
        B + ' .card.hz-has-type .card__view > .card__quality{top:2.9em;}',
        B + ' .card__view > .card__quality > div{color:inherit;}',

        // маркер (Смотрю / Просмотрено / …): слева внизу, иконка вместо цветной точки
        B + ' .card__view > .card__marker{left:.55em;bottom:.55em;top:auto;right:auto;padding:.36em .6em .36em .45em;font-size:1em;max-width:62%;}',
        B + ' .card__view > .card__marker > span{font-size:.78em;max-width:7em;}',
        B + ' .card__marker::before{width:.95em !important;height:.95em !important;margin-right:.38em !important;border-radius:0 !important;background-color:currentColor !important;opacity:.95;}',
        B + ' .card__marker--look::before{-webkit-mask:' + MARK.look + ' center / contain no-repeat;mask:' + MARK.look + ' center / contain no-repeat;}',
        B + ' .card__marker--viewed::before{-webkit-mask:' + MARK.viewed + ' center / contain no-repeat;mask:' + MARK.viewed + ' center / contain no-repeat;}',
        B + ' .card__marker--scheduled::before{-webkit-mask:' + MARK.scheduled + ' center / contain no-repeat;mask:' + MARK.scheduled + ' center / contain no-repeat;}',
        B + ' .card__marker--continued::before{-webkit-mask:' + MARK.continued + ' center / contain no-repeat;mask:' + MARK.continued + ' center / contain no-repeat;}',
        B + ' .card__marker--thrown::before{-webkit-mask:' + MARK.thrown + ' center / contain no-repeat;mask:' + MARK.thrown + ' center / contain no-repeat;}',
        // если есть маркер — рейтинг остаётся справа, ширина маркера ограничена

        // иконки активности (закладка/история…): справа сверху, компактная капсула
        B + ' .card__view > .card__icons{top:.55em;right:.55em;left:auto;-webkit-justify-content:flex-end;justify-content:flex-end;}',
        B + ' .card__view > .card__icons .card__icons-inner{background:rgba(16,16,18,.62);box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);border-radius:1em;padding:0;}',
        B + ' .card__view > .card__icons .card__icon{width:1.65em;height:1.65em;margin:.08em;background-size:56%;}',

        // родную красную «TV»-плашку прячем — вместо неё наша нейтральная
        B + ' .card__view > .card__type,' + B + ' .full-start-new__poster > .card__type{display:none !important;}',
        // «Новая серия»
        B + ' .card__new-episode > div{background:#fff;color:#0b0b0c;font-weight:600;box-shadow:0 .3em 1em rgba(0,0,0,.35);}',

        // светлые плашки
        B + '.hz-badge-light .hz-badge,' + B + '.hz-badge-light .card__view > .card__vote,' + B + '.hz-badge-light .card__view > .card__marker,' +
        B + '.hz-badge-light .card__view > .card__icons .card__icons-inner{background:rgba(255,255,255,.9);color:#111;box-shadow:0 .15em .6em rgba(0,0,0,.25);}',
        B + '.hz-badge-light .card__view > .card__quality{background:rgba(255,255,255,.9);color:#111;box-shadow:none;}',
        B + '.hz-badge-light .card__view > .card__icons .card__icon{-webkit-filter:invert(1);filter:invert(1);}',

        // выключатели
        B + '.hz-no-rating .card__view > .card__vote{display:none !important;}',
        B + '.hz-no-quality .card__view > .card__quality{display:none !important;}',

        // ---------- карточка тайтла ----------
        B + ' .full-start__pg,' + B + ' .full-start__status{border:1px solid rgba(255,255,255,.38) !important;border-radius:.45em !important;' +
          'padding:.28em .5em !important;color:rgba(255,255,255,.88) !important;background:transparent !important;font-weight:500;}',
        B + ' .full-start__rate{border-radius:.55em;background:rgba(16,16,18,.45);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);}',
        B + ' .full-start-new__poster{position:relative;}',
        B + ' .full-start-new__poster .hz-badge{font-size:.9em;}',
        B + ' .hz-season{position:absolute;z-index:3;padding:.5em .75em;font-size:.85em;font-weight:600;line-height:1.3;text-align:center;' +
          'background:rgba(16,16,18,.68);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);border-radius:.7em;white-space:nowrap;}',
        B + ' .hz-season > div + div{font-weight:500;opacity:.65;font-size:.9em;}',
        B + '.hz-badge-light .hz-season{background:rgba(255,255,255,.9);color:#111;}',

        // ---------- кнопки источников (из v3) ----------
        B + ' .full-start-new__buttons{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;gap:.5em;}',
        B + ' .full-start-new__buttons .inmod-source-btn.inmod-torrent-btn{-webkit-order:-30;order:-30;}',
        B + ' .full-start-new__buttons .button--priority{-webkit-order:-20;order:-20;}',
        B + ' .full-start-new__buttons .inmod-source-btn:not(.inmod-torrent-btn){-webkit-order:-10;order:-10;}',
        B + ' .full-start-new.inmod-sources-ready .button--play:not(.button--priority){display:none !important;}',
        B + ' .full-start__button.view--online[data-inmod-online] svg{width:1.35em;height:1.35em;}',

        // логотип вместо названия
        B + ' .inmod-logo-container{display:flex;justify-content:flex-start;align-items:flex-end;width:100%;min-height:90px;}',
        B + ' .inmod-logo-container img{max-height:120px;max-width:80%;opacity:0;transition:opacity .4s ease;object-fit:contain;object-position:left bottom;}',
        B + ' .inmod-logo-container img.inmod-logo-visible{opacity:1;}',
        '@media screen and (max-width:580px){' + B + ' .inmod-logo-container{justify-content:center;align-items:center;min-height:70px;}' +
          B + ' .inmod-logo-container img{max-height:80px;max-width:90%;object-position:center;}}',

        // ---------- торренты: нейтрально, иерархия прозрачностью ----------
        B + '.hz-torrents .ts-pill{display:inline-flex;align-items:center;justify-content:center;min-height:1.7em;padding:.15em .5em;border-radius:.5em;' +
          'font-weight:600;font-size:.9em;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums;background:rgba(255,255,255,.08);' +
          'box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);color:rgba(255,255,255,.92);}',
        B + '.hz-torrents .torrent-item__bitrate,' + B + '.hz-torrents .torrent-item__grabs,' + B + '.hz-torrents .torrent-item__seeds{margin-right:.55em;}',
        B + '.hz-torrents .ts-pill.ts-low{opacity:.45;}',
        B + '.hz-torrents .ts-pill.ts-top{background:#fff;color:#0b0b0c;box-shadow:none;}',
        B + '.hz-torrents .ts-pill.ts-big{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6);}',

        // ---------- анимации (только transform/opacity) ----------
        B + '.hz-anim .card .card__view{transition:transform .28s cubic-bezier(.2,.8,.2,1);}',
        B + '.hz-anim .card.focus .card__view{-webkit-transform:scale(1.045);transform:scale(1.045);}',
        B + '.hz-anim .items-cards .card.selector,' + B + '.hz-anim .items-cards .card.selector.focus{transform:none !important;}',
        B + '.hz-anim .full-start__button,' + B + '.hz-anim .simple-button{transition:transform .2s ease;}',
        B + '.hz-anim .full-start__button.focus,' + B + '.hz-anim .simple-button.focus{-webkit-transform:scale(1.04);transform:scale(1.04);}'
      ];
      return css.join('\n');
    },

    apply: function () {
      if (!isActive()) return Theme.disable();
      var a = ACCENTS[cfg.inmod_accent] || ACCENTS.white;
      addStyle('hz_vars', Theme.vars());
      addStyle('hz_theme', Theme.css());
      bodyClass('hz-on', true);
      bodyClass('hz-on-dark', !!a.dark);
      bodyClass('hz-bg-set', cfg.inmod_bg !== 'lampa');
      bodyClass('hz-font', cfg.inmod_font);
      bodyClass('hz-blur', cfg.inmod_blur);
      bodyClass('hz-anim', cfg.inmod_animations);
      bodyClass('hz-badge-light', cfg.inmod_badge_style === 'light');
      bodyClass('hz-no-rating', !cfg.inmod_badge_rating);
      bodyClass('hz-no-quality', !cfg.inmod_badge_quality);
      bodyClass('hz-torrents', cfg.inmod_torrent_styles);
      try {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta && cfg.inmod_bg !== 'lampa') meta.setAttribute('content', (BACKGROUNDS[cfg.inmod_bg] || {}).solid || '#1c1c1e');
      } catch (e) { }
    },

    disable: function () {
      removeStyle('hz_vars');
      removeStyle('hz_theme');
      ['hz-on', 'hz-on-dark', 'hz-bg-set', 'hz-font', 'hz-blur', 'hz-anim', 'hz-badge-light', 'hz-no-rating', 'hz-no-quality', 'hz-torrents']
        .forEach(function (c) { bodyClass(c, false); });
    }
  };

  // ==========================================================================
  // ФОН: запоминание размытого постера последнего тайтла
  // ==========================================================================
  // Храним не готовый URL, а пути TMDB: URL пересчитывается штатной
  // Lampa.Utils.cardImgBackgroundBlur() — с актуальными настройками прокси.
  var Backdrop = {
    KEY: 'inmod_bg_last',

    remember: function (movie) {
      if (!isActive() || !cfg.inmod_bg_remember || !movie) return;
      if (!movie.backdrop_path && !movie.poster_path && !movie.img && !movie.poster) return;
      var data = {
        backdrop_path: movie.backdrop_path || '',
        poster_path: movie.poster_path || '',
        img: movie.img || '',
        poster: movie.poster || '',
        title: movie.title || movie.name || ''
      };
      try { Lampa.Storage.set(Backdrop.KEY, data); } catch (e) { }
    },

    restore: function (attempt) {
      attempt = attempt || 0;
      if (!isActive() || !cfg.inmod_bg_remember) return;
      var saved;
      try { saved = Lampa.Storage.get(Backdrop.KEY, '{}'); } catch (e) { return; }
      if (typeof saved === 'string') { try { saved = JSON.parse(saved); } catch (e) { saved = null; } }
      if (!saved || (!saved.backdrop_path && !saved.poster_path && !saved.img && !saved.poster)) return;
      if (!Lampa.Background || !Lampa.Utils || typeof Lampa.Utils.cardImgBackgroundBlur !== 'function') return;

      var url = '';
      try { url = Lampa.Utils.cardImgBackgroundBlur(saved); } catch (e) { }
      if (!url) return;

      // immediately() молча игнорирует вызов чаще раза в секунду — повторим
      try { Lampa.Background.immediately(url); } catch (e) { }
      if (attempt < 2) setTimeout(function () { Backdrop.ensure(url, attempt + 1); }, 1400);
    },

    // если за это время фон так и не нарисовался (canvas пустой) — пробуем ещё раз
    ensure: function (url, attempt) {
      try {
        var c = document.querySelector('.background__fade');
        var drawn = false;
        if (c && c.width) {
          var px = c.getContext('2d').getImageData(Math.floor(c.width / 2), Math.floor(c.height / 2), 1, 1).data;
          drawn = px[3] > 0;
        }
        var mobileVisible = document.querySelector('.background__one.visible, .background__two.visible');
        if (!drawn && !mobileVisible) Backdrop.restore(attempt);
      } catch (e) { }
    },

    clear: function () {
      try { Lampa.Storage.set(Backdrop.KEY, {}); } catch (e) { }
      try {
        var list = document.querySelectorAll('.background canvas');
        for (var i = 0; i < list.length; i++) {
          var c = list[i];
          c.getContext('2d').clearRect(0, 0, c.width, c.height);
        }
      } catch (e) { }
    }
  };

  // ==========================================================================
  // ПЛАШКИ «ФИЛЬМ / СЕРИАЛ»
  // ==========================================================================
  var Badges = {
    isTv: function (d, el) {
      return !!(d.original_name || d.first_air_date || d.number_of_seasons || d.media_type === 'tv' ||
        (el && el.classList.contains('card--tv')));
    },

    isMedia: function (d) {
      if (!d) return false;
      var style = d.params && d.params.style && d.params.style.name;
      if (style && style !== 'default') return false;                     // wide / collection
      if ((d.profile_path || d.known_for_department) && !d.poster_path) return false; // персоны
      return !!(d.poster_path || d.poster || d.img || d.title || d.name);
    },

    make: function (tv) {
      var b = document.createElement('div');
      b.className = 'hz-badge hz-badge--type';
      b.textContent = tv ? tr('hz_serial') : tr('hz_movie');
      return b;
    },

    processCard: function (el) {
      if (el.__hz_badge) return;
      el.__hz_badge = true;
      if (!isActive() || cfg.inmod_badge_type === 'off') return;
      var d = el.card_data;
      if (!Badges.isMedia(d)) return;
      var view = el.querySelector('.card__view');
      if (!view) return;
      var tv = Badges.isTv(d, el);
      if (cfg.inmod_badge_type === 'tv' && !tv) return;
      view.appendChild(Badges.make(tv));
      el.classList.add('hz-has-type');
    },

    full: function (movie, root) {
      try {
        var poster = $(root).find('.full-start-new__poster').first();
        if (!poster.length) return;
        poster.find('.hz-badge--type').remove();
        if (!isActive() || cfg.inmod_badge_type === 'off') return;
        var tv = !!(movie.number_of_seasons || movie.seasons || movie.original_name || movie.first_air_date);
        if (cfg.inmod_badge_type === 'tv' && !tv) return;
        poster.append(Badges.make(tv));
      } catch (e) { }
    },

    reset: function () {
      var old = document.querySelectorAll('.hz-badge--type');
      for (var i = 0; i < old.length; i++) old[i].parentNode && old[i].parentNode.removeChild(old[i]);
      var cards = document.querySelectorAll('.card');
      for (var j = 0; j < cards.length; j++) {
        cards[j].__hz_badge = false;
        cards[j].classList.remove('hz-has-type');
      }
    },

    refreshAll: function () {
      Badges.reset();
      if (!isActive()) return;
      var cards = document.querySelectorAll('.card');
      for (var i = 0; i < cards.length; i++) Badges.processCard(cards[i]);
    }
  };

  // ==========================================================================
  // ИКОНКИ ПЛАГИНОВ (меню + настройки)
  // ==========================================================================
  var Icons = {
    setMenu: function (li, name) {
      if (!li || li.__hz_icon === name) return;
      var ico = li.querySelector('.menu__ico');
      if (!ico) return;
      if (!li.__hz_orig_icon) li.__hz_orig_icon = ico.innerHTML;
      ico.innerHTML = ICONS[name];
      ico.firstChild && ico.firstChild.setAttribute && ico.firstChild.setAttribute('class', 'hz-svg');
      li.__hz_icon = name;
    },

    applyMenu: function (root) {
      if (!isActive() || !cfg.inmod_icons) return;
      root = root || document;
      for (var i = 0; i < MENU_ICONS.length; i++) {
        var m = MENU_ICONS[i];
        var list = root.querySelectorAll ? root.querySelectorAll('.menu__item' + m.sel) : [];
        for (var j = 0; j < list.length; j++) Icons.setMenu(list[j], m.icon);
        if (root.matches && root.matches('.menu__item' + m.sel)) Icons.setMenu(root, m.icon);
      }
    },

    restoreMenu: function () {
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

    applySettings: function (body) {
      if (!isActive() || !cfg.inmod_icons) return;
      var $body = body && body.jquery ? body : $(body || document.body);
      for (var comp in SETTINGS_ICONS) {
        if (!SETTINGS_ICONS.hasOwnProperty(comp)) continue;
        var icon = ICONS[SETTINGS_ICONS[comp]];
        // объект компонента — чтобы и при следующей отрисовке была новая иконка
        try {
          var c = Lampa.SettingsApi.getComponent && Lampa.SettingsApi.getComponent(comp);
          if (c && !c.__hz_orig_icon) { c.__hz_orig_icon = c.icon; c.icon = icon; }
        } catch (e) { }
        var $f = $body.find('.settings-folder[data-component="' + comp + '"] .settings-folder__icon');
        if ($f.length && !$f.hasClass('hz-ico')) $f.addClass('hz-ico').html(icon);
      }
    },

    restoreSettings: function () {
      for (var comp in SETTINGS_ICONS) {
        try {
          var c = Lampa.SettingsApi.getComponent && Lampa.SettingsApi.getComponent(comp);
          if (c && c.__hz_orig_icon !== undefined) { c.icon = c.__hz_orig_icon; delete c.__hz_orig_icon; }
        } catch (e) { }
      }
      // DOM вернётся к оригиналу при следующем открытии настроек (main пересоздаётся не всегда — ок)
    }
  };

  // ==========================================================================
  // ИКОНКИ ONLINE-ПРОВАЙДЕРОВ (из v3)
  // ==========================================================================
  var OnlineIcons = {
    titles: { bwarc: 'BwaRC', dso: 'DSO', lampac: 'Lampac' },
    icons: {
      bwarc: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11.783 10.094c-1.699.998-3.766 1.684-5.678 1.95a1.66 1.66 0 0 1-.684.934c.512 1.093 1.249 2.087 2.139 2.987a7.98 7.98 0 0 0 6.702-3.074l.083-.119c-.244-.914-.648-1.784-1.145-2.644q-.134.038-.261.062c-.143.04-.291.068-.446.068a1.7 1.7 0 0 1-.71-.164M9.051 5.492a18 18 0 0 0-2.004-1.256 1.67 1.67 0 0 1-1.907.985c-.407 1.535-.624 3.162-.511 4.694a1.67 1.67 0 0 1 1.52 1.354c1.695-.279 3.47-.879 4.967-1.738a1.67 1.67 0 0 1-.297-.949c0-.413.156-.786.403-1.078-.654-.736-1.389-1.443-2.171-2.012M4 9.989c-.137-1.634.104-3.392.541-5.032a1.67 1.67 0 0 1-.713-1.369c0-.197.039-.386.104-.562a18 18 0 0 0-1.974-.247c-.089.104-.185.204-.269.314a7.98 7.98 0 0 0-1.23 7.547 9.5 9.5 0 0 0 2.397.666A1.67 1.67 0 0 1 4 9.989m9.928-.3c-.029.037-.064.067-.096.1.433.736.799 1.482 1.053 2.268a7.98 7.98 0 0 0 .832-6.122c-.09.133-.176.267-.271.396-.436.601-.875 1.217-1.354 1.772.045.152.076.311.076.479v.004c.084.374.013.779-.24 1.103M7.164 3.447c.799.414 1.584.898 2.33 1.44.84.611 1.627 1.373 2.324 2.164.207-.092.434-.145.676-.145.5 0 .945.225 1.252.572.404-.492.783-1.022 1.161-1.54.194-.268.372-.543.544-.82A7.96 7.96 0 0 0 7.701.012q-.173.217-.339.439c-.401.552-.739 1.08-1.04 1.637.039.029.064.066.1.1.417.276.697.734.742 1.259m-4.285 8.518a10 10 0 0 1-2.07-.487 7.95 7.95 0 0 0 5.806 4.397 11 11 0 0 1-1.753-2.66 1.675 1.675 0 0 1-1.983-1.25m1.635-9.723a1.32 1.32 0 0 1 1.199-.416C6.025 1.24 6.377.683 6.794.104a7.97 7.97 0 0 0-4.247 2.062c.59.066 1.176.14 1.761.252q.096-.095.206-.176" fill="currentColor"></path></svg>',
      lampac: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="9" r="2.2" stroke="currentColor" stroke-width="2.4"></circle><circle cx="6.5" cy="15" r="2.2" stroke="currentColor" stroke-width="2.4"></circle><rect x="9.4" y="8" width="7.8" height="8" rx="2.2" stroke="currentColor" stroke-width="2.4"></rect><circle cx="17.8" cy="12" r="1.6" stroke="currentColor" stroke-width="2.2"></circle><path d="M19.7 10.9L22.3 9.8V14.2L19.7 13.1" stroke="currentColor" stroke-width="2.0" stroke-linejoin="round"></path><path d="M8.2 19.8H18.2" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path><path d="M10.2 16V19.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path><path d="M16.2 16V19.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path></svg>',
      dso: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 24"><path fill="currentColor" d="M0 13.75C0 19.411 4.589 24 10.25 24S20.5 19.411 20.5 13.75a12.063 12.063 0 0 0-1.531-5.501L19 8.31a3.781 3.781 0 0 1-.781-2.309V6c0-1.75 1.846-3.5 3.78-3.5h.247a1.251 1.251 0 0 0 .002-2.5h-.252c-3.075 0-5.706 1.64-6.33 5a9.12 9.12 0 0 0-5.438-1.499l.019-.001C4.588 3.503.002 8.09.001 13.749zm9 0a1.25 1.25 0 1 1 1.25 1.251h-.003a1.25 1.25 0 0 1-1.246-1.25v-.001zm-6.5 0a2.247 2.247 0 1 1 0 .003v-.003zm11 0a2.247 2.247 0 1 1 0 .003v-.003zM8 19.25a2.25 2.25 0 1 1 2.25 2.25h-.004A2.25 2.25 0 0 1 8 19.25zm0-11a2.247 2.247 0 1 1 4.494.002a2.247 2.247 0 0 1-4.494 0v-.003z"/></svg>'
    },

    parse: function (raw) {
      var token = ((raw || '') + '').trim().split(/\s+/)[0].toLowerCase();
      if (token === 'bwarc' || token === 'bwa') return 'bwarc';
      if (token === 'dso') return 'dso';
      if (token === 'lampac') return 'lampac';
      return '';
    },

    patch: function (btn) {
      var $btn = $(btn);
      if (!$btn.is('.full-start__button.view--online')) return;
      var provider = OnlineIcons.parse($btn.attr('data-subtitle') || $btn.data('subtitle'));
      if (!provider || $btn.attr('data-inmod-online') === provider) return;
      if (!$btn.attr('data-inmod-orig')) $btn.attr('data-inmod-orig', encodeURIComponent($btn.html() || ''));
      $btn.attr('data-inmod-online', provider);
      $btn.empty().append(OnlineIcons.icons[provider] + '<span>' + OnlineIcons.titles[provider] + '</span>');
    },

    scan: function (root) {
      if (!isActive() || !cfg.inmod_patch_online_icons || !root) return;
      if (root.matches && root.matches('.full-start__button.view--online')) OnlineIcons.patch(root);
      if (root.querySelectorAll) {
        var list = root.querySelectorAll('.full-start__button.view--online');
        for (var i = 0; i < list.length; i++) OnlineIcons.patch(list[i]);
      }
    },

    restore: function () {
      $('.full-start__button.view--online[data-inmod-online]').each(function () {
        var $b = $(this), orig = $b.attr('data-inmod-orig');
        try { if (orig) $b.html(decodeURIComponent(orig)); } catch (e) { }
        $b.removeAttr('data-inmod-online').removeAttr('data-inmod-orig');
      });
    }
  };

  // ==========================================================================
  // ЛОГОТИП ВМЕСТО НАЗВАНИЯ (из v3; пропускается, если логотип уже ставит applecation)
  // ==========================================================================
  var Logo = {
    load: function (e) {
      if (!isActive() || !cfg.inmod_show_logos) return;
      var movie = e.data && e.data.movie;
      if (!movie || !movie.id || (movie.source && movie.source !== 'tmdb' && movie.source !== 'cub')) return;
      var $render = $(e.object.activity.render());
      var type = movie.name ? 'tv' : 'movie';
      var lang = Lampa.Storage.get('language') || 'ru';
      var net = new Lampa.Reguest();

      function apply(path) {
        setTimeout(function () {
          if ($render.find('.applecation__logo img, .inmod-logo-container').length) return;
          var $title = $render.find('.full-start-new__title').first();
          if (!$title.length) return;
          // Правило №1 проекта: URL TMDB не трогаем, отдаём Lampa как есть
          var url = Lampa.TMDB.image('t/p/w500' + path.replace('.svg', '.png'));
          var orig = $title.text();
          var img = new Image();
          img.onload = function () {
            if ($render.find('.applecation__logo img').length) return;
            var $c = $('<div class="inmod-logo-container"></div>');
            var $img = $('<img alt="">').attr('src', url);
            $title.attr('data-inmod-orig-title', orig).empty().append($c.append($img));
            setTimeout(function () { $img.addClass('inmod-logo-visible'); }, 20);
          };
          img.src = url;
        }, 350);
      }

      function pick(resp) {
        return resp && resp.logos && resp.logos.length ? resp.logos[0].file_path : '';
      }

      try {
        net.silent(Lampa.TMDB.api(type + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + lang), function (r) {
          var p = pick(r);
          if (p) return apply(p);
          net.silent(Lampa.TMDB.api(type + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key()), function (r2) {
            var p2 = pick(r2);
            if (p2) apply(p2);
          }, function () { });
        }, function () { });
      } catch (err) { }
    }
  };

  // ==========================================================================
  // ИНФО О СЕЗОНАХ НА ПОСТЕРЕ (из v3, нейтральный вид)
  // ==========================================================================
  var SeasonInfo = {
    add: function (e) {
      if (!isActive() || cfg.inmod_seasons_info_mode === 'none') return;
      var movie = e.data && e.data.movie;
      if (!movie || !movie.number_of_seasons) return;

      var mode = cfg.inmod_seasons_info_mode;
      var status = movie.status;
      var totalS = movie.number_of_seasons || 0, totalE = movie.number_of_episodes || 0;
      var airedS = 0, airedE = 0, now = new Date();

      if (movie.seasons) {
        movie.seasons.forEach(function (s) {
          if (s.season_number === 0) return;
          var aired = s.air_date && new Date(s.air_date) <= now;
          if (aired) airedS++;
          if (s.episodes) {
            s.episodes.forEach(function (ep) { if (ep.air_date && new Date(ep.air_date) <= now) airedE++; });
          } else if (aired && s.episode_count) airedE += s.episode_count;
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
      var sTxt = plural(S, tr('inmod_season_1'), tr('inmod_season_2'), tr('inmod_season_5'));
      var eTxt = plural(E, tr('inmod_episode_1'), tr('inmod_episode_2'), tr('inmod_episode_5'));

      var line1 = S + ' ' + sTxt + ' · ';
      if (mode === 'aired' && totalE > 0 && airedE < totalE) line1 += airedE + ' ' + tr('inmod_out_of') + ' ' + totalE + ' ' + eTxt;
      else line1 += E + ' ' + eTxt;

      var statusTxt = {
        'Ended': tr('inmod_status_ended'), 'Canceled': tr('inmod_status_canceled'),
        'Returning Series': tr('inmod_status_returning'), 'In Production': tr('inmod_status_production'),
        'Planned': tr('inmod_status_planned')
      }[status] || '';

      var $info = $('<div class="hz-season"></div>').append($('<div></div>').text(line1));
      if (statusTxt) $info.append($('<div></div>').text(statusTxt));

      var pos = {
        'top-right': { top: '.55em', right: '.55em' }, 'top-left': { top: '.55em', left: '.55em' },
        'bottom-right': { bottom: '.55em', right: '.55em' }, 'bottom-left': { bottom: '.55em', left: '.55em' }
      }[cfg.inmod_label_position] || { top: '.55em', right: '.55em' };
      $info.css(pos);
      if (cfg.inmod_label_position === 'top-left') $info.css('top', '2.8em'); // под плашкой «Сериал»

      setTimeout(function () {
        var $poster = $(e.object.activity.render()).find('.full-start-new__poster').first();
        if ($poster.length) { $poster.find('.hz-season').remove(); $poster.append($info); }
      }, 100);
    }
  };

  // ==========================================================================
  // ТОРРЕНТЫ: нейтральные капсулы
  // ==========================================================================
  var Torrents = {
    timer: null,
    num: function (t) { var m = ((t || '') + '').match(/(\d+(?:[.,]\d+)?)/); return m ? parseFloat(m[1].replace(',', '.')) || 0 : 0; },
    gb: function (t) {
      var m = ((t || '') + '').replace(/ /g, ' ').match(/(\d+(?:[.,]\d+)?)\s*(kb|mb|gb|tb|кб|мб|гб|тб)/i);
      if (!m) return null;
      var n = parseFloat(m[1].replace(',', '.')) || 0, u = m[2].toLowerCase();
      if (u === 'tb' || u === 'тб') return n * 1024;
      if (u === 'mb' || u === 'мб') return n / 1024;
      if (u === 'kb' || u === 'кб') return n / 1048576;
      return n;
    },
    set: function (el, cls) {
      el.classList.add('ts-pill');
      el.classList.remove('ts-low', 'ts-top', 'ts-big');
      if (cls) el.classList.add(cls);
    },
    update: function () {
      if (!isActive() || !cfg.inmod_torrent_styles) return;
      try {
        var i, list;
        list = document.querySelectorAll('.torrent-item__seeds span');
        for (i = 0; i < list.length; i++) {
          var s = Torrents.num(list[i].textContent);
          Torrents.set(list[i], s < 5 ? 'ts-low' : (s >= 20 ? 'ts-top' : ''));
        }
        list = document.querySelectorAll('.torrent-item__grabs span, .torrent-item__bitrate span');
        for (i = 0; i < list.length; i++) Torrents.set(list[i], '');
        list = document.querySelectorAll('.torrent-item__size');
        for (i = 0; i < list.length; i++) {
          var g = Torrents.gb(list[i].textContent);
          Torrents.set(list[i], g !== null && g >= 50 ? 'ts-big' : '');
        }
      } catch (e) { }
    },
    schedule: function () {
      clearTimeout(Torrents.timer);
      Torrents.timer = setTimeout(Torrents.update, 80);
    }
  };

  // ==========================================================================
  // КНОПКИ ИСТОЧНИКОВ ОТДЕЛЬНО (логика v3; наблюдатель теперь на карточке, а не на body)
  // ==========================================================================
  var Buttons = {
    mo: null,

    id: function ($btn) {
      var t = ($btn.find('span').first().text() || '').trim().toLowerCase();
      return t || ($btn.attr('data-subtitle') || '').trim().toLowerCase() || null;
    },

    hash: function ($btn) {
      try { return Lampa.Utils.hash($btn.clone().removeClass('focus hover traverse').prop('outerHTML')); } catch (e) { return ''; }
    },

    findFull: function () {
      try {
        var a = Lampa.Activity.active();
        if (!a || !a.activity || !a.activity.render) return $();
        var $r = $(a.activity.render());
        var $f = $r.find('.full-start-new');
        return $f.length ? $f : $r.filter('.full-start-new');
      } catch (e) { return $(); }
    },

    process: function ($full) {
      if (!$full || !$full.length || !isActive() || !cfg.inmod_show_online_buttons) return;
      var $main = $full.find('.full-start-new__buttons').first();
      if (!$main.length) return;

      var $sources = $full.find('.buttons--container > .full-start__button').filter(function () {
        var $b = $(this);
        if ($b.hasClass('hide')) return false;
        return $b.hasClass('selector') || $b.hasClass('view--torrent') || $b.hasClass('view--trailer') || $b.hasClass('view--online');
      });

      var prHash = (Lampa.Storage.get('full_btn_priority', '') + '').trim();
      var $priority = $main.find('.button--priority');
      var ours = {}, existing = {}, seen = {}, toAdd = [];

      $main.find('.inmod-source-btn').each(function () { var id = $(this).attr('data-inmod-id'); if (id) ours[id] = $(this); });
      $main.find('.full-start__button').each(function () {
        var $b = $(this);
        if ($b.hasClass('inmod-source-btn')) return;
        var id = Buttons.id($b);
        if (id) existing[id] = true;
      });
      if ($priority.length) { var pid = Buttons.id($priority); if (pid) existing[pid] = true; }

      $sources.each(function () {
        var $src = $(this), id = Buttons.id($src);
        if (!id || seen[id]) return;
        seen[id] = true;
        if (prHash && Buttons.hash($src) === prHash) return;
        if (existing[id]) return;
        if (ours[id]) { delete ours[id]; return; }

        var $clone = $src.clone().addClass('selector inmod-source-btn').removeClass('hide focus hover traverse').attr('data-inmod-id', id);
        if ($src.hasClass('view--torrent')) $clone.addClass('inmod-torrent-btn');
        $clone.on('hover:enter', function () { $src.trigger('hover:enter'); })
          .on('hover:long', function () { $src.trigger('hover:long'); });
        toAdd.push($clone);
      });

      for (var old in ours) ours[old].remove();

      if (toAdd.length) {
        var torrents = [], others = [];
        toAdd.forEach(function ($c) { ($c.hasClass('inmod-torrent-btn') ? torrents : others).push($c); });
        torrents.forEach(function ($t) { $main.prepend($t); });
        var $after = $priority.length ? $priority : (torrents.length ? torrents[torrents.length - 1] : null);
        others.forEach(function ($o) {
          if ($after) $o.insertAfter($after); else $main.prepend($o);
          $after = $o;
        });
      }

      $full.toggleClass('inmod-sources-ready', $main.find('.inmod-source-btn').length > 0 || $priority.length > 0);
      if (toAdd.length) Buttons.refreshNav($full, false);
      OnlineIcons.scan($main[0]);
    },

    refreshNav: function ($full, focusTorrents) {
      try {
        var c = Lampa.Controller.enabled();
        if (!c || c.name !== 'full_start') return;
        Lampa.Controller.collectionSet($full);
        if (!focusTorrents) return;
        var $t = $full.find('.full-start-new__buttons .inmod-torrent-btn.selector:visible').first();
        if ($t.length) setTimeout(function () {
          try { Lampa.Controller.collectionSet($full); Lampa.Controller.collectionFocus($t[0], $full); } catch (e) { }
        }, 20);
      } catch (e) { }
    },

    watch: function ($full) {
      Buttons.unwatch();
      if (!$full.length || !window.MutationObserver) return;
      var timer = null;
      Buttons.mo = new MutationObserver(function (muts) {
        if (!isActive() || !cfg.inmod_show_online_buttons) return;
        for (var i = 0; i < muts.length; i++) {
          var m = muts[i], t = m.target;
          var hit = false;
          if (m.type === 'attributes') {
            hit = t.classList && (t.classList.contains('view--torrent') || t.classList.contains('view--online') || t.classList.contains('full-start__button')) &&
              !t.classList.contains('inmod-source-btn');
          } else if (m.addedNodes.length) {
            for (var j = 0; j < m.addedNodes.length; j++) {
              var n = m.addedNodes[j];
              if (n.nodeType === 1 && !(n.classList && n.classList.contains('inmod-source-btn'))) { hit = true; break; }
            }
          }
          if (hit) {
            clearTimeout(timer);
            timer = setTimeout(function () { Buttons.process($full); }, 10);
            return;
          }
        }
      });
      Buttons.mo.observe($full[0], { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    },

    unwatch: function () {
      if (Buttons.mo) { try { Buttons.mo.disconnect(); } catch (e) { } }
      Buttons.mo = null;
    },

    reset: function () {
      $('.inmod-source-btn').remove();
      $('.full-start-new').removeClass('inmod-sources-ready');
    }
  };

  // ==========================================================================
  // ОДИН НАБЛЮДАТЕЛЬ НА ВСЁ ПРИЛОЖЕНИЕ (в v3 их было пять на body)
  // ==========================================================================
  var Watcher = {
    mo: null,

    handle: function (node) {
      if (node.nodeType !== 1) return;
      var cl = node.classList;
      if (cl && cl.contains('card')) Badges.processCard(node);
      else if (node.getElementsByClassName) {
        var cards = node.getElementsByClassName('card');
        for (var i = 0; i < cards.length; i++) Badges.processCard(cards[i]);
      }
      if (cfg.inmod_icons && (cl && cl.contains('menu__item') || (node.querySelector && node.querySelector('.menu__item')))) Icons.applyMenu(node);
      if (cfg.inmod_patch_online_icons && node.querySelector &&
        ((cl && cl.contains('view--online')) || node.querySelector('.view--online'))) OnlineIcons.scan(node);
      if (cfg.inmod_torrent_styles && ((cl && cl.contains('torrent-item')) || (node.querySelector && node.querySelector('.torrent-item')))) Torrents.schedule();
    },

    start: function () {
      if (Watcher.mo || !window.MutationObserver) return;
      Watcher.mo = new MutationObserver(function (muts) {
        if (!isActive()) return;
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            try { Watcher.handle(added[j]); } catch (e) { }
          }
        }
      });
      Watcher.mo.observe(document.body, { childList: true, subtree: true });
    },

    stop: function () {
      if (Watcher.mo) { try { Watcher.mo.disconnect(); } catch (e) { } }
      Watcher.mo = null;
    }
  };

  // ==========================================================================
  // ВКЛ / ВЫКЛ
  // ==========================================================================
  function enableAll() {
    Theme.apply();
    Watcher.start();
    Badges.refreshAll();
    Icons.applyMenu(document);
    Icons.applySettings(document.body);
    OnlineIcons.scan(document.body);
    Torrents.update();
    Buttons.process(Buttons.findFull());
  }

  function disableAll() {
    Watcher.stop();
    Buttons.unwatch();
    Buttons.reset();
    Badges.reset();
    OnlineIcons.restore();
    Icons.restoreMenu();
    Icons.restoreSettings();
    $('.hz-season').remove();
    Theme.disable();
  }

  // ==========================================================================
  // НАСТРОЙКИ
  // ==========================================================================
  function opt(obj) {
    var out = {};
    for (var k in obj) if (obj.hasOwnProperty(k)) out[k] = obj[k].name;
    return out;
  }

  function add(p) {
    try { Lampa.SettingsApi.addParam(p); } catch (e) { console.log('[HZ-UI] addParam', p.param && p.param.name, e); }
  }

  function title(name, text) {
    add({ component: COMPONENT, param: { name: name, type: 'title' }, field: { name: text } });
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
      param: { name: 'inmod_enabled', type: 'trigger', default: DEFAULTS.inmod_enabled },
      field: { name: 'Оформление HanzoTV', description: 'Выключите, чтобы вернуть стандартный вид Lampa' },
      onChange: function (v) {
        setAndApply('inmod_enabled', v);
        if (cfg.inmod_enabled) { enableAll(); Backdrop.restore(); } else disableAll();
      }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_accent', type: 'select', values: opt(ACCENTS), default: DEFAULTS.inmod_accent },
      field: { name: 'Акцент', description: 'Цвет выделения: меню, кнопки, настройки, рамка постера' },
      onChange: function (v) { setAndApply('inmod_accent', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_font', type: 'trigger', default: DEFAULTS.inmod_font },
      field: { name: 'Системный шрифт', description: 'SF Pro на Apple, Roboto на Android — вместо Segoe UI' },
      onChange: function (v) { setAndApply('inmod_font', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_blur', type: 'trigger', default: DEFAULTS.inmod_blur },
      field: { name: 'Матовое стекло', description: 'Размытие под панелями. Красиво на телефоне, но может тормозить на слабых ТВ-приставках' },
      onChange: function (v) { setAndApply('inmod_blur', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_animations', type: 'trigger', default: DEFAULTS.inmod_animations },
      field: { name: 'Анимация фокуса', description: 'Плавное увеличение постера и кнопок' },
      onChange: function (v) { setAndApply('inmod_animations', v, Theme.apply); }
    });

    title('hz_t_bg', 'Фон');

    add({
      component: COMPONENT,
      param: { name: 'inmod_bg', type: 'select', values: opt(BACKGROUNDS), default: DEFAULTS.inmod_bg },
      field: { name: 'Фон приложения', description: 'Виден, пока не открыт тайтл. Размытый постер при открытии карточки работает как раньше' },
      onChange: function (v) { setAndApply('inmod_bg', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_bg_color', type: 'input', values: '', default: DEFAULTS.inmod_bg_color, placeholder: '#101820' },
      field: { name: 'Свой цвет', description: 'HEX, например #101820. Работает при фоне «Свой цвет»' },
      onChange: function (v) { setAndApply('inmod_bg_color', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_bg_image', type: 'input', values: '', default: '', placeholder: 'https://…/wallpaper.jpg' },
      field: { name: 'Своя картинка', description: 'Ссылка на изображение. Работает при фоне «Своя картинка»' },
      onChange: function (v) { setAndApply('inmod_bg_image', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_bg_remember', type: 'trigger', default: DEFAULTS.inmod_bg_remember },
      field: { name: 'Запоминать фон тайтла', description: 'Размытый постер последнего открытого фильма или сериала остаётся фоном — и после перезапуска Lampa' },
      onChange: function (v) { setAndApply('inmod_bg_remember', v, function (on) { if (on) Backdrop.restore(); }); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_bg_poster', type: 'select', values: { '100': '100% — как в Lampa', '80': '80%', '60': '60%', '40': '40%' }, default: DEFAULTS.inmod_bg_poster },
      field: { name: 'Яркость постера на фоне', description: 'Меньше — сильнее проступает фон темы' },
      onChange: function (v) { setAndApply('inmod_bg_poster', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_bg_reset', type: 'button' },
      field: { name: 'Сбросить запомненный фон' },
      onChange: function () {
        Backdrop.clear();
        Lampa.Noty.show('Фон сброшен — снова виден фон темы');
      }
    });

    title('hz_t_badges', 'Плашки на постерах');

    add({
      component: COMPONENT,
      param: { name: 'inmod_badge_type', type: 'select', values: { all: 'Фильм и сериал', tv: 'Только сериалы', off: 'Не показывать' }, default: DEFAULTS.inmod_badge_type },
      field: { name: 'Тип контента', description: 'Нейтральная плашка в левом верхнем углу' },
      onChange: function (v) { setAndApply('inmod_badge_type', v, Badges.refreshAll); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_badge_style', type: 'select', values: { dark: 'Тёмное стекло', light: 'Светлые' }, default: DEFAULTS.inmod_badge_style },
      field: { name: 'Стиль плашек' },
      onChange: function (v) { setAndApply('inmod_badge_style', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_badge_rating', type: 'trigger', default: DEFAULTS.inmod_badge_rating },
      field: { name: 'Рейтинг' },
      onChange: function (v) { setAndApply('inmod_badge_rating', v, Theme.apply); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_badge_quality', type: 'trigger', default: DEFAULTS.inmod_badge_quality },
      field: { name: 'Качество (4K, HD…)' },
      onChange: function (v) { setAndApply('inmod_badge_quality', v, Theme.apply); }
    });

    title('hz_t_full', 'Карточка тайтла');

    add({
      component: COMPONENT,
      param: { name: 'inmod_show_online_buttons', type: 'trigger', default: DEFAULTS.inmod_show_online_buttons },
      field: { name: 'Все источники отдельно', description: 'Торренты, трейлеры и онлайн — отдельными кнопками вместо меню «Смотреть»' },
      onChange: function (v) {
        setAndApply('inmod_show_online_buttons', v);
        if (v && isActive()) { var $f = Buttons.findFull(); Buttons.process($f); Buttons.watch($f); }
        else { Buttons.unwatch(); Buttons.reset(); }
      }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_patch_online_icons', type: 'trigger', default: DEFAULTS.inmod_patch_online_icons },
      field: { name: 'Иконки онлайн-провайдеров', description: 'BwaRC / DSO / Lampac' },
      onChange: function (v) { setAndApply('inmod_patch_online_icons', v, function (on) { if (on) OnlineIcons.scan(document.body); else OnlineIcons.restore(); }); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_show_logos', type: 'trigger', default: DEFAULTS.inmod_show_logos },
      field: { name: 'Логотип вместо названия', description: 'Из TMDB. Если логотип уже ставит «Карточка фильма» (applecation) — не дублируется' },
      onChange: function (v) { setAndApply('inmod_show_logos', v); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_seasons_info_mode', type: 'select', values: { none: 'Не показывать', aired: 'Вышедшие серии', total: 'Всего серий' }, default: DEFAULTS.inmod_seasons_info_mode },
      field: { name: 'Сезоны и серии на постере' },
      onChange: function (v) { setAndApply('inmod_seasons_info_mode', v, function (m) { if (m === 'none') $('.hz-season').remove(); }); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_label_position', type: 'select', values: { 'top-right': 'Справа сверху', 'top-left': 'Слева сверху', 'bottom-right': 'Справа снизу', 'bottom-left': 'Слева снизу' }, default: DEFAULTS.inmod_label_position },
      field: { name: 'Где показывать сезоны' },
      onChange: function (v) { setAndApply('inmod_label_position', v); }
    });

    add({
      component: COMPONENT,
      param: { name: 'inmod_torrent_styles', type: 'trigger', default: DEFAULTS.inmod_torrent_styles },
      field: { name: 'Стиль списка торрентов', description: 'Сиды, размер и битрейт — аккуратными капсулами' },
      onChange: function (v) { setAndApply('inmod_torrent_styles', v, function () { Theme.apply(); Torrents.update(); }); }
    });

    title('hz_t_icons', 'Иконки');

    add({
      component: COMPONENT,
      param: { name: 'inmod_icons', type: 'trigger', default: DEFAULTS.inmod_icons },
      field: { name: 'Единые иконки плагинов', description: 'Подборки, Оценки, Кинопоиск, Франшизы, Загрузки, Журнал и др. — в одном стиле' },
      onChange: function (v) {
        setAndApply('inmod_icons', v, function (on) {
          if (on) { Icons.applyMenu(document); Icons.applySettings(document.body); }
          else { Icons.restoreMenu(); Icons.restoreSettings(); Lampa.Noty.show('Иконки в настройках вернутся после перезапуска'); }
        });
      }
    });

    add({
      component: COMPONENT,
      param: { name: 'hz_version', type: 'static' },
      field: { name: '<span style="opacity:.55">HanzoTV · Оформление v' + VERSION + '</span>' }
    });

    // Подмена иконок + порядок «Оформление» сразу после «Интерфейс»
    Lampa.Settings.listener.follow('open', function (e) {
      if (!e || e.name !== 'main') return;
      setTimeout(function () {
        try {
          var body = e.body || $('.settings__body');
          Icons.applySettings(body);
          var $f = body.find('.settings-folder[data-component="' + COMPONENT + '"]');
          var $i = body.find('.settings-folder[data-component="interface"]');
          if ($f.length && $i.length && $i.next()[0] !== $f[0]) $f.insertAfter($i);
        } catch (err) { }
      }, 0);
    });
  }

  // ==========================================================================
  // СОБЫТИЯ
  // ==========================================================================
  function listen() {
    Lampa.Listener.follow('full', function (e) {
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

        if ($full.length && cfg.inmod_show_online_buttons) {
          Buttons.process($full);
          Buttons.watch($full);
          setTimeout(function () { Buttons.refreshNav($full, true); }, 50);
        }
      }

      if (e.type === 'destroy') Buttons.unwatch();
    });

    // Возврат в карточку (из торрентов и т.п.) — фокус на «Торренты», как в v3
    Lampa.Controller.listener.follow('toggle', function (e) {
      if (!isActive() || !cfg.inmod_show_online_buttons || e.name !== 'full_start') return;
      setTimeout(function () {
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
            if ($first.length) { Lampa.Controller.collectionSet($full); Lampa.Controller.collectionFocus($first[0], $full); }
          }
        } catch (err) { }
      }, 15);
    });
  }

  // ==========================================================================
  // СТАРТ
  // ==========================================================================
  function start() {
    if (window.__hz_interface_started) return;
    window.__hz_interface_started = true;

    try { registerTranslations(); } catch (e) { }
    loadConfig();
    try { registerSettings(); } catch (e) { console.log('[HZ-UI] settings', e); }
    listen();

    if (isActive()) {
      enableAll();
      // меню и настройки плагины дорисовывают позже — догоняем
      setTimeout(function () { Icons.applyMenu(document); }, 2500);
      setTimeout(function () { Icons.applyMenu(document); }, 7000);
      // фон: Background.immediately() игнорирует вызовы в первую секунду после прошлого
      setTimeout(function () { Backdrop.restore(); }, 1300);
    }
  }

  // Тему применяем как можно раньше (до готовности приложения), чтобы не мигал серый фон
  try {
    if (window.Lampa && Lampa.Storage && document.body) {
      loadConfig();
      if (isActive()) Theme.apply();
    }
  } catch (e) { }

  if (window.Lampa && Lampa.Manifest) {
    try {
      Lampa.Manifest.plugins = {
        type: 'interface',
        version: VERSION,
        name: 'Оформление HanzoTV',
        description: 'Темы в стиле Apple, нейтральные плашки, фон приложения, единые иконки',
        author: 'HanzoTV (на основе Interface Mod @pavelpikta)',
        icon: ICONS.palette
      };
    } catch (e) { }
  }

  if (window.appready) start();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
