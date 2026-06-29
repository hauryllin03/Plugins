/*
 * Mobile Ratings — ряд оценок (IMDb, Кинопоиск, TMDB, Rotten Tomatoes,
 * Metacritic, Letterboxd, Trakt, MyAnimeList) в карточке на мобильных.
 *
 * НАСТРОЙКА:
 *   1. Установите плагин в Lampa.
 *   2. Откройте: Настройки → «Оценки (моб.)».
 *   3. Введите свои API-ключи:
 *        • MDBList API Key  — бесплатно на https://mdblist.com (после входа: Preferences → API).
 *                              Даёт IMDb, Rotten Tomatoes, Metacritic, Letterboxd, Trakt.
 *        • КиноПоиск API Key — бесплатно на https://kinopoiskapiunofficial.tech
 *                              Даёт оценку Кинопоиска.
 *   4. Выберите в «Отображаемые рейтинги», какие показывать.
 *
 * Без ключей будет показана только оценка TMDB (она есть в карточке).
 * TMDB-оценка работает всегда и ключа не требует.
 *
 * Ряд показывается только на мобильных (ширина ≤ 590px); на ПК не активен.
 */
(function () {
  'use strict';

  // ============================================================
  //  mobile_ratings.js — ряд оценок в стиле applecation
  //  Только для мобильных устройств. Заменяет штатный ряд
  //  рейтингов Lampa в карточке. Ключи берёт из Lampa.Storage:
  //    applecation_kp_api_key      — оценка Кинопоиска
  //    applecation_mdblist_api_key — imdb/tomatoes/popcorn/
  //                                  metacritic/letterboxd/trakt
  //  TMDB-оценка берётся прямо из карточки (vote_average).
  // ============================================================

  // --- Только рендер ряда — на мобильных. Настройки доступны везде. ---
  function isMobile() {
    return window.innerWidth <= 590;
  }

  // Раннее скрытие штатного ряда оценок на мобильных (до отрисовки карточек,
  // чтобы штатные оценки не мелькнули перед нашими).
  (function earlyHide() {
    if (!isMobile()) return;
    var css = 'body.mr-hide-native .full-start-new__rate-line,'
            + 'body.mr-hide-native .full-start__rate-line{display:none !important;}';
    var st = document.createElement('style');
    st.id = 'mobile-ratings-early';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
    var apply = function () { if (document.body) document.body.classList.add('mr-hide-native'); };
    if (document.body) apply();
    else document.addEventListener('DOMContentLoaded', apply);
  })();

  var CACHE_KEY = 'mobile_ratings_cache';
  var CACHE_VER_KEY = 'mobile_ratings_cache_ver';
  var CACHE_VER = '3'; // менять при изменении логики оценок — старый кэш очистится

  // Источник оценок:
  // false — прямые запросы к MDBList/КиноПоиск с ключами, введёнными в настройках (этот режим)
  // true  — через собственный прокси-сервер (для продвинутых; см. PROXY_BASE)
  var USE_PROXY = false;
  // Если USE_PROXY=true — база прокси (по умолчанию текущий домен)
  var PROXY_BASE = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
  var DEBUG = false; // лог в консоль (для отладки)
  var CACHE_TTL = 2592e5; // 3 дня
  var ORDER = ['imdb','kp','tmdb','tomatoes','popcorn','metacritic','letterboxd','trakt','myanimelist'];

var ICONS={
  imdb: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="currentColor" d="M4 7c-1.103 0-2 .897-2 2v6.4c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2H4Zm1.4 2.363h1.275v5.312H5.4V9.362Zm1.962 0H9l.438 2.512.287-2.512h1.75v5.312H10.4v-3l-.563 3h-.8l-.512-3v3H7.362V9.362Zm8.313 0H17v1.2c.16-.16.516-.363.875-.363.36.04.84.283.8.763v3.075c0 .24-.075.404-.275.524-.16.04-.28.075-.6.075-.32 0-.795-.196-.875-.237-.08-.04-.163.275-.163.275h-1.087V9.362Zm-3.513.037H13.6c.88 0 1.084.078 1.325.237.24.16.35.397.35.838v3.2c0 .32-.15.563-.35.762-.2.2-.484.288-1.325.288h-1.438V9.4Zm1.275.8v3.563c.2 0 .488.04.488-.2v-3.126c0-.28-.247-.237-.488-.237Zm3.763.675c-.12 0-.2.08-.2.2v2.688c0 .159.08.237.2.237.12 0 .2-.117.2-.238l-.037-2.687c0-.12-.043-.2-.163-.2Z"/></svg>`,
  kp: `<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M96.5 20 66.1 75.733V20H40.767v152H66.1v-55.733L96.5 172h35.467C116.767 153.422 95.2 133.578 80 115c28.711 16.889 63.789 35.044 92.5 51.933v-30.4C148.856 126.4 108.644 115.133 85 105c23.644 3.378 63.856 7.889 87.5 11.267v-30.4L85 90c27.022-11.822 60.478-22.711 87.5-34.533v-30.4C143.789 41.956 108.711 63.11 80 80l51.967-60z" style="fill:none;stroke:currentColor;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10"/></svg>`,
  tmdb: `<svg width="800" height="800" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M25.99 29.198c2.807 0 4.708-1.896 4.708-4.708v-19.781c0-2.807-1.901-4.708-4.708-4.708h-19.979c-2.807 0-4.708 1.901-4.708 4.708v27.292l2.411-2.802v-24.49c.005-1.266 1.031-2.292 2.297-2.292h19.974c1.266 0 2.292 1.026 2.292 2.292v19.781c0 1.266-1.026 2.292-2.292 2.292h-16.755l-2.417 2.417-.016-.016zM11.714 15.286h-2.26v7.599h2.26c5.057 0 5.057-7.599 0-7.599zM11.714 21.365h-.734v-4.557h.734c2.958 0 2.958 4.557 0 4.557zM11.276 13.854h1.516v-6.083h1.891v-1.505h-5.302v1.505h1.896zM18.75 9.599l-2.625-3.333h-.49v7.714h1.542v-4.24l1.573 2.042 1.578-2.042-.010 4.24h1.542v-7.714h-.479zM21.313 19.089c.474-.333.677-.922.698-1.5.031-1.339-.807-2.307-2.156-2.307h-3.005v7.609h3.005c1.24-.010 2.245-1.021 2.245-2.26v-.036c0-.62-.307-1.172-.781-1.5zM18.37 16.802h1.354c.432 0 .698.339.698.766.031.406-.286.76-.698.76h-1.354zM19.724 21.37h-1.354v-1.516h1.37c.411 0 .745.333.745.745v.016c0 .417-.333.755-.75.755z"/></svg>`,
  tomatoes: `<svg id="svg3390" xmlns="http://www.w3.org/2000/svg" height="141.25" viewBox="0 0 138.75 141.25" width="138.75" version="1.1"><g id="layer1" fill="#f93208"><path id="path3412" d="m20.154 40.829c-28.149 27.622-13.657 61.011-5.734 71.931 35.254 41.954 92.792 25.339 111.89-5.9071 4.7608-8.2027 22.554-53.467-23.976-78.009z"/><path id="path3471" d="m39.613 39.265 4.7778-8.8607 28.406-5.0384 11.119 9.2082z"/></g><g id="layer2"><path id="path3437" d="m39.436 8.5696 8.9682-5.2826 6.7569 15.479c3.7925-6.3226 13.79-16.316 24.939-4.6684-4.7281 1.2636-7.5161 3.8553-7.7397 8.4768 15.145-4.1697 31.343 3.2127 33.539 9.0911-10.951-4.314-27.695 10.377-41.771 2.334 0.009 15.045-12.617 16.636-19.902 17.076 2.077-4.996 5.591-9.994 1.474-14.987-7.618 8.171-13.874 10.668-33.17 4.668 4.876-1.679 14.843-11.39 24.448-11.425-6.775-2.467-12.29-2.087-17.814-1.475 2.917-3.961 12.149-15.197 28.625-8.476z" fill="#02902e"/></g></svg>`,
  popcorn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106.25 140" width="106.25" height="140"><path fill="#fa3106" d="M2.727 39.537c-.471-21.981 100.88-25.089 100.88-.42L92.91 117.56c-7.605 26.86-72.064 27.007-79.07.21z"/><g fill="#fff"><path d="M8.809 51.911l9.018 66.639c3.472 4.515 8.498 7.384 9.648 8.022l-6.921-68.576c-3.498-1.41-9.881-4.579-11.745-6.083zM28.629 59.776l5.453 68.898c4.926 2.652 11.04 3.391 15.73 3.566l-1.258-70.366c-3.414-.024-13.82-.642-19.925-2.098zM97.632 52.121l-9.019 66.643c-3.472 4.515-8.498 7.384-9.647 8.022l6.92-68.583c3.5-1.41 9.882-4.579 11.746-6.082zM77.812 59.986l-5.453 68.898c-4.926 2.652-11.04 3.391-15.73 3.566l1.258-70.366c3.414-.024 13.82-.642 19.925-2.098z"/></g><g fill="#ffd600"><circle cx="13.213" cy="31.252" r="6.816"/><circle cx="22.022" cy="27.687" r="6.607"/><circle cx="30.359" cy="19.769" r="5.925"/><circle cx="34.973" cy="15.155" r="6.03"/><circle cx="45.093" cy="17.095" r="4.929"/><circle cx="51.123" cy="9.597" r="6.24"/><circle cx="61.19" cy="9.387" r="6.554"/><circle cx="67.954" cy="13.635" r="4.929"/><circle cx="76.081" cy="17.672" r="5.925"/><circle cx="78.913" cy="22.706" r="4.352"/><circle cx="83.475" cy="26.324" r="5.243"/><circle cx="88.194" cy="34.398" r="5.768"/><path d="M87.355 35.447c5.79 2.799 1.352-2.213 10.696 2.097-9.574 15.338-74.774 16.892-90.291.525l-.21-3.985L38.59 16.99l22.863-6.606 15.52 9.962z"/></g></svg>`,
  metacritic: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.209 32.937L20.619 29.527L14.052 22.96C13.776 22.684 13.476 22.338 13.315 21.946C12.946 21.163 12.785 19.942 13.684 19.043C14.79 17.937 16.264 18.398 17.693 19.827L24.006 26.14L27.416 22.73L20.826 16.14C20.55 15.864 20.227 15.449 20.066 15.103C19.628 14.205 19.651 13.076 20.458 12.269C21.587 11.14 23.061 11.555 24.698 13.191L30.826 19.32L34.236 15.91L27.6 9.274C24.236 5.91 21.08 6.025 18.914 8.191C18.084 9.021 17.577 9.896 17.324 10.887C17.0952 11.8067 17.0639 12.7643 17.232 13.697L17.186 13.744C15.526 13.053 13.637 13.467 12.186 14.919C10.25 16.854 10.32 18.905 10.55 20.103L10.48 20.173L8.799 18.813L5.849 21.762C6.886 22.707 8.131 23.859 9.536 25.264L17.209 32.937Z" fill="white"/><path d="M19.982 8.12464e-06C16.0272 0.0035675 12.1621 1.17957 8.87551 3.37936C5.5889 5.57915 3.02825 8.70397 1.51726 12.3588C0.00626421 16.0136 -0.387235 20.0344 0.386501 23.9128C1.16024 27.7913 3.06647 31.3532 5.86424 34.1485C8.662 36.9437 12.2257 38.8468 16.1048 39.617C19.9839 40.3873 24.0044 39.9901 27.6578 38.4759C31.3113 36.9616 34.4338 34.3981 36.6306 31.1095C38.8275 27.8209 40 23.9549 40 20V19.976C39.9936 14.6727 37.8812 9.58908 34.1273 5.84302C30.3734 2.09697 25.2853 -0.00476866 19.982 8.12464e-06ZM19.891 4.27401C24.0449 4.27029 28.0303 5.9166 30.9705 8.85087C33.9108 11.7851 35.5652 15.7671 35.57 19.921V19.939C35.57 23.0366 34.6516 26.0647 32.931 28.6405C31.2104 31.2162 28.7647 33.2241 25.9032 34.4101C23.0417 35.5962 19.8927 35.9073 16.8544 35.3041C13.8161 34.7009 11.0249 33.2104 8.83348 31.0211C6.6421 28.8318 5.14897 26.042 4.54284 23.0043C3.93671 19.9666 4.24479 16.8173 5.42814 13.9547C6.61148 11.092 8.61697 8.64442 11.1911 6.92133C13.7652 5.19823 16.7924 4.27697 19.89 4.27401H19.891Z" fill="#FFBD3F"/></svg>`,
  letterboxd: `<svg width="800" height="800" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="currentColor" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M1179.28 284.01c-6.02-5.845-14.23-9.447-23.28-9.447-9.04 0-17.25 3.597-23.27 9.438-6.03-5.841-14.23-9.438-23.28-9.438-18.45 0-33.43 14.983-33.43 33.437 0 18.454 14.98 33.437 33.43 33.437 9.05 0 17.25-3.597 23.28-9.438 6.02 5.841 14.23 9.438 23.27 9.438 9.05 0 17.26-3.602 23.28-9.447 6.02 5.845 14.24 9.447 23.28 9.447 18.46 0 33.44-14.983 33.44-33.437 0-18.454-14.98-33.437-33.44-33.437-9.04 0-17.26 3.602-23.28 9.447Zm-7.07 9.965c-3.94-4.539-9.74-7.412-16.21-7.412-6.46 0-12.26 2.867-16.2 7.397a33.152 33.152 0 0 1 3.09 14.04c0 5.012-1.1 9.768-3.09 14.04 3.94 4.53 9.74 7.397 16.2 7.397 6.47 0 12.27-2.873 16.21-7.412a33.228 33.228 0 0 1-3.08-14.025c0-5.007 1.1-9.758 3.08-14.025Zm-46.56-.015c-3.93-4.53-9.73-7.397-16.2-7.397-11.83 0-21.43 9.606-21.43 21.437 0 11.831 9.6 21.437 21.43 21.437 6.47 0 12.27-2.867 16.2-7.397a33.303 33.303 0 0 1-3.09-14.04c0-5.012 1.11-9.768 3.09-14.04Zm60.71 28.065c3.93 4.539 9.73 7.412 16.2 7.412 11.83 0 21.44-9.606 21.44-21.437 0-11.831-9.61-21.437-21.44-21.437-6.47 0-12.27 2.873-16.2 7.412a33.373 33.373 0 0 1 3.07 14.025c0 5.007-1.1 9.758-3.07 14.025Z" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" transform="translate(-1060 -212)"/></svg>`,
  trakt: `<svg width="800" height="800" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M16 32c-8.817 0-16-7.183-16-16s7.183-16 16-16c8.817 0 16 7.183 16 16s-7.183 16-16 16zM16 1.615c-7.932 0-14.385 6.453-14.385 14.385s6.453 14.385 14.385 14.385c7.932 0 14.385-6.453 14.385-14.385s-6.453-14.385-14.385-14.385zM6.521 24.708c2.339 2.557 5.724 4.152 9.479 4.152 1.917 0 3.735-0.417 5.369-1.167l-8.932-8.907zM25.573 24.62c2.052-2.281 3.307-5.323 3.307-8.625 0-5.177-3.047-9.62-7.421-11.677l-8.12 8.099 12.219 12.204zM12.401 13.38l-6.765 6.74-0.907-0.907 15.421-15.416c-1.301-0.437-2.692-0.677-4.151-0.677-7.115-0.005-12.885 5.765-12.885 12.88 0 2.896 0.953 5.573 2.588 7.735l6.74-6.74 0.479 0.437 9.663 9.661c0.197-0.109 0.38-0.219 0.556-0.353l-10.703-10.672-6.468 6.473-0.907-0.905 7.38-7.381 0.479 0.443 11.281 11.251c0.177-0.136 0.339-0.292 0.5-0.421l-12.181-12.157-0.109 0.021zM16.464 14.749l-0.901-0.9 6.38-6.385 0.907 0.916-6.385 6.38zM22.521 5.979l-7.36 7.36-0.907-0.907 7.36-7.359 0.907 0.911z"/></svg>`,
  myanimelist: `<svg width="512" height="206" viewBox="0 0 512 206" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M176.49 1.28V180.97L131.63 180.91V69.67L88.32 120.96L45.89 68.52L45.46 181.27H0V1.32001H47L86.79 55.61L129.79 1.30002L176.49 1.28ZM360.55 45.42L361.08 180.57H310.63L310.46 119.32H250.73C252.22 129.97 255.21 146.32 259.63 157.32C262.94 165.45 265.99 173.32 272.07 181.38L235.7 205.38C228.25 191.81 222.43 176.86 216.97 160.96C211.505 145.955 207.872 130.346 206.15 114.47C204.34 98.47 204.08 83.09 208.43 67.28C212.708 51.9137 221.305 38.0972 233.2 27.47C239.88 21.22 249.2 16.8 256.67 12.81C264.14 8.82003 272.52 7.18002 280.29 5.15002C288.64 3.16198 297.138 1.85764 305.7 1.25C314.19 0.52 329.32 -0.159976 356.7 0.650024L368.33 37.96H309.55C296.9 38.13 290.82 37.96 280.94 42.42C273.097 46.129 266.415 51.9066 261.611 59.131C256.808 66.3555 254.066 74.7531 253.68 83.42L310.49 84.12L311.3 45.51H360.56L360.55 45.42ZM445.72 0.670013V142.02L512 142.67L502.83 180.54H400.28V0L445.72 0.670013Z" fill="white"/></svg>`,
};
  // --- Сетевой помощник (тихие запросы, как в applecation) ---
  function getJson(url, ok, err, headers) {
    var req = new Lampa.Reguest();
    req.timeout(15000);
    req.silent(url, ok, err, false, { dataType: 'json', headers: headers || {} });
  }
  function getText(url, ok, err) {
    var req = new Lampa.Reguest();
    req.timeout(15000);
    req.silent(url, ok, err, false, { dataType: 'text' });
  }

  // --- Кэш в Storage ---
  function cacheGet(id) {
    var all = Lampa.Storage.get(CACHE_KEY, {});
    var rec = all[id];
    if (!rec) return null;
    if (Date.now() - rec.t > CACHE_TTL) { delete all[id]; Lampa.Storage.set(CACHE_KEY, all); return null; }
    return rec.d;
  }
  function cacheSet(id, data) {
    var all = Lampa.Storage.get(CACHE_KEY, {});
    var keys = Object.keys(all);
    if (keys.length > 500) delete all[keys[0]];
    all[id] = { t: Date.now(), d: data };
    Lampa.Storage.set(CACHE_KEY, all);
  }

  // --- MDBList: imdb/tomatoes/popcorn/metacritic/letterboxd/trakt ---
  function fetchMdblist(card, done) {
    var type = card.name ? 'show' : 'movie';
    var url;
    if (USE_PROXY) {
      // через VPS — ключ подставит nginx, клиенту он не нужен
      url = PROXY_BASE + '/ratings-mdblist/tmdb/' + type + '/' + card.id;
    } else {
      var key = Lampa.Storage.get('applecation_mdblist_api_key', '');
      if (!key) { if (DEBUG) console.log('[mobile_ratings] MDBList: КЛЮЧ ПУСТОЙ'); return done({}); }
      url = 'https://api.mdblist.com/tmdb/' + type + '/' + card.id + '?apikey=' + key;
    }
    if (DEBUG) console.log('[mobile_ratings] MDBList запрос:', url);
    getJson(url, function (resp) {
      if (DEBUG) console.log('[mobile_ratings] MDBList ответ:', resp && resp.ratings ? resp.ratings : resp);
      var out = {};
      if (resp && resp.ratings) {
        resp.ratings.forEach(function (r) {
          var src = (r.source || '').toString().toLowerCase().trim();
          if (src === 'tmdb') return;
          if (src === 'tomatoes' || src === 'popcorn')
            out[src] = { value: r.value, score: r.score, votes: r.votes };
          else
            out[src] = r.value;
        });
      }
      if (DEBUG) console.log('[mobile_ratings] MDBList распознано:', out);
      done(out);
    }, function (err) {
      if (DEBUG) console.log('[mobile_ratings] MDBList ОШИБКА запроса:', err);
      done({});
    });
  }

  // --- Кинопоиск (по imdb_id, как в applecation) ---
  function fetchKp(card, done) {
    if (!card.imdb_id) return done(null);
    var url, headers = {};
    if (USE_PROXY) {
      url = PROXY_BASE + '/ratings-kp/api/v2.2/films?imdbId=' + encodeURIComponent(card.imdb_id);
    } else {
      var key = Lampa.Storage.get('applecation_kp_api_key', '');
      if (!key) return done(null);
      url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?imdbId=' + encodeURIComponent(card.imdb_id);
      headers = { 'X-API-KEY': key };
    }
    getJson(url, function (resp) {
      var items = (resp && (resp.items || resp.films)) || [];
      var film = items[0];
      if (!film) return done(null);
      var r = film.ratingKinopoisk || film.rating;
      var v = parseFloat(r);
      done((v > 0 && v <= 10) ? v : null);
    }, function () { done(null); }, headers);
  }

  // --- Сбор всех оценок для карточки ---
  // Мгновенные оценки из самого объекта карточки (как это делает Lampa)
  function instantFromCard(card) {
    var r = {
      imdb: null, kp: null,
      tmdb: card.vote_average ? parseFloat(card.vote_average) : null,
      tomatoes: null, popcorn: null, metacritic: null,
      letterboxd: null, trakt: null, myanimelist: null
    };
    if (card.imdb_rating && parseFloat(card.imdb_rating) > 0) r.imdb = parseFloat(card.imdb_rating);
    if (card.kp_rating && parseFloat(card.kp_rating) > 0) r.kp = parseFloat(card.kp_rating);
    return r;
  }

  // collect(card, onData) — onData может вызваться дважды:
  //   1) мгновенно с оценками из карточки (imdb/kp/tmdb)
  //   2) после догрузки MDBList/КП с полным набором
  function collect(card, onData) {
    if (!card || !card.id) return onData({}, true);

    var cached = cacheGet(card.id);
    if (cached) return onData(cached, true);

    // фаза 1 — мгновенно
    var result = instantFromCard(card);
    onData(result, false);

    // фаза 2 — догрузка дополнительных источников
    var needMdb = USE_PROXY || !!Lampa.Storage.get('applecation_mdblist_api_key', '');
    var needKp = !result.kp && card.imdb_id && (USE_PROXY || !!Lampa.Storage.get('applecation_kp_api_key', ''));
    var pending = (needMdb ? 1 : 0) + (needKp ? 1 : 0);
    if (pending === 0) { cacheSet(card.id, result); return onData(result, true); }

    function step() { if (--pending <= 0) { cacheSet(card.id, result); onData(result, true); } }

    if (needMdb) fetchMdblist(card, function (m) {
      // не затираем imdb/kp из карточки, если MDBList их не вернул
      for (var k in m) if (m[k] !== null && m[k] !== undefined) result[k] = m[k];
      step();
    });
    if (needKp) fetchKp(card, function (kp) { if (kp) result.kp = kp; step(); });
  }

  // --- Построение HTML ряда (формат значений как в applecation) ---
  function buildHtml(data, isSerial) {
    var html = '';
    var enabled = Lampa.Storage.get('mobile_ratings_enabled', ['imdb','tmdb']);
    if (!Array.isArray(enabled)) enabled = ['imdb','tmdb'];
    if (DEBUG) console.log('[mobile_ratings] enabled:', enabled, '| данные:', data);
    ORDER.forEach(function (key) {
      if (enabled.indexOf(key) < 0) return;
      var raw = data[key];
      if (raw === null || raw === undefined) return;
      var val = (raw && typeof raw === 'object') ? (raw.score != null ? raw.score : raw.value) : raw;
      var num = parseFloat(val);
      if (isNaN(num)) return;

      var text;
      if (key === 'tomatoes' || key === 'popcorn') text = Math.round(num) + '%';
      else if (key === 'metacritic' || key === 'trakt') text = Math.round(num).toString();
      else text = num.toFixed(1);

      html += '<div class="mrate mrate--' + key + '">' + ICONS[key] + '<div>' + text + '</div></div>';
    });
    return html;
  }

  // --- Вставка ряда в карточку вместо штатного ---
  function inject(render, data, isSerial) {
    var html = buildHtml(data, isSerial);
    if (!html) return;

    // удалим прежний наш ряд (если карточка перерисовалась)
    render.find('.mobile-ratings').remove();

    var rateLine = render.find('.full-start-new__rate-line, .full-start__rate-line').first();
    var container = $('<div class="mobile-ratings"></div>').html(html);

    if (rateLine.length) {
      rateLine.before(container);
    } else {
      var details = render.find('.full-start-new__details, .full-start__details').first();
      if (details.length) details.before(container);
      else render.find('.full-start-new__title, .full-start__title').first().after(container);
    }
  }



  // ============================================================
  //  НАСТРОЙКИ ПЛАГИНА (вкладка в меню Lampa)
  //  Ключи общие с applecation:
  //    applecation_mdblist_api_key, applecation_kp_api_key
  //  Выбор оценок:  mobile_ratings_enabled  (свой ключ)
  // ============================================================
  function L(key, def) { return Lampa.Storage.get(key, def); }

  function initDefaults() {
    // версия кэша — если изменилась, чистим старые (возможно неполные) записи
    if (L(CACHE_VER_KEY, '') !== CACHE_VER) {
      Lampa.Storage.set(CACHE_KEY, {});
      Lampa.Storage.set(CACHE_VER_KEY, CACHE_VER);
    }
    if (L('mobile_ratings_enabled') === undefined) {
      var hasKp = !!L('applecation_kp_api_key', '');
      Lampa.Storage.set('mobile_ratings_enabled', hasKp ? ['imdb','kp','tmdb'] : ['imdb','tmdb']);
    }
    if (L('applecation_mdblist_api_key') === undefined) Lampa.Storage.set('applecation_mdblist_api_key', '');
    if (L('applecation_kp_api_key') === undefined) Lampa.Storage.set('applecation_kp_api_key', '');
    if (L('mobile_ratings_scale') === undefined) Lampa.Storage.set('mobile_ratings_scale', '100');
  }

  // Применяет масштаб к ряду через CSS-переменную
  function applyScale() {
    var scale = parseInt(L('mobile_ratings_scale', '100'), 10) || 100;
    // 100% = 1.25em (базовый), масштабируем пропорционально
    var em = (1.25 * scale / 100).toFixed(3);
    document.documentElement.style.setProperty('--mr-scale', em + 'em');
  }

  var ALL_RATINGS = [
    { value: 'imdb',        title: 'IMDb' },
    { value: 'kp',          title: 'Кинопоиск' },
    { value: 'tmdb',        title: 'TMDB' },
    { value: 'tomatoes',    title: 'Rotten Tomatoes' },
    { value: 'popcorn',     title: 'Popcorn (RT Audience)' },
    { value: 'metacritic',  title: 'Metacritic' },
    { value: 'letterboxd',  title: 'Letterboxd' },
    { value: 'trakt',       title: 'Trakt' },
    { value: 'myanimelist', title: 'MyAnimeList' }
  ];

  function clearCache() { Lampa.Storage.set(CACHE_KEY, {}); }

  function addSettings() {
    if (!Lampa.SettingsApi) return;

    Lampa.SettingsApi.addComponent({
      component: 'mobile_ratings',
      name: 'Оценки (моб.)',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M 14.78 1.80  L 17.97 8.29  L 25.05 9.23  L 19.85 14.19  L 21.15 21.27  L 14.78 17.97  L 8.41 21.27  L 9.71 14.19  L 4.51 9.23  L 11.59 8.29  Z"/><path d="M 23.63 28.35  V 22.45"/><path d="M 28.35 28.35  V 17.73"/><path d="M 33.07 28.35  V 13.01"/><path d="M 21.27 28.35  H 35.43"/><path d="M 25.40 31.89  L 28.59 35.08  L 36.02 27.64"/></svg>'
    });

    // Заголовок секции
    Lampa.SettingsApi.addParam({
      component: 'mobile_ratings',
      param: { name: 'mr_title', type: 'title' },
      field: { name: 'Рейтинги' }
    });

    // MDBList API Key
    Lampa.SettingsApi.addParam({
      component: 'mobile_ratings',
      param: { name: 'applecation_mdblist_api_key', type: 'button', default: '' },
      field: {
        name: 'MDBList API Key',
        description: 'API ключ для оценок IMDb / Rotten Tomatoes / Metacritic / Letterboxd / Trakt (mdblist.com)'
      },
      onChange: function () {
        var cur = L('applecation_mdblist_api_key', '');
        Lampa.Input.edit({ title: 'MDBList API Key', value: cur, free: true, nosave: true }, function (val) {
          if (val !== cur) {
            Lampa.Storage.set('applecation_mdblist_api_key', val);
            clearCache();
            Lampa.Noty.show('MDBList API Key ' + (val ? 'сохранён' : 'очищен'));
          }
        });
      }
    });

    // КиноПоиск API Key
    Lampa.SettingsApi.addParam({
      component: 'mobile_ratings',
      param: { name: 'applecation_kp_api_key', type: 'button', default: '' },
      field: {
        name: 'КиноПоиск API Key',
        description: 'API ключ для оценки КиноПоиска (kinopoiskapiunofficial.tech)'
      },
      onChange: function () {
        var cur = L('applecation_kp_api_key', '');
        Lampa.Input.edit({ title: 'КиноПоиск API Key', value: cur, free: true, nosave: true }, function (val) {
          if (val !== cur) {
            Lampa.Storage.set('applecation_kp_api_key', val);
            clearCache();
            Lampa.Noty.show('КиноПоиск API Key ' + (val ? 'сохранён' : 'очищен'));
            // если ключ убрали — выкинем kp из выбранных
            if (!val) {
              var en = L('mobile_ratings_enabled', []);
              if (Array.isArray(en) && en.indexOf('kp') > -1)
                Lampa.Storage.set('mobile_ratings_enabled', en.filter(function (x) { return x !== 'kp'; }));
            }
          }
        });
      }
    });

    // Отображаемые рейтинги (чекбоксы)
    Lampa.SettingsApi.addParam({
      component: 'mobile_ratings',
      param: { name: 'mobile_ratings_enabled', type: 'button', default: ['imdb','tmdb'] },
      field: {
        name: 'Отображаемые рейтинги',
        description: 'Выберите, какие оценки показывать'
      },
      onChange: function () {
        var en = L('mobile_ratings_enabled', ['imdb','tmdb']);
        if (!Array.isArray(en)) en = ['imdb','tmdb'];
        var hasKp = !!L('applecation_kp_api_key', '');
        if (!hasKp && en.indexOf('kp') > -1) {
          en = en.filter(function (x) { return x !== 'kp'; });
          Lampa.Storage.set('mobile_ratings_enabled', en);
        }
        var items = ALL_RATINGS
          .filter(function (r) { return r.value !== 'kp' || hasKp; })
          .map(function (r) {
            return { title: r.title, value: r.value, checkbox: true, checked: en.indexOf(r.value) > -1 };
          });
        Lampa.Select.show({
          title: 'Отображаемые рейтинги',
          items: items,
          onCheck: function (item) {
            var cur = L('mobile_ratings_enabled', ['imdb','tmdb']);
            if (!Array.isArray(cur)) cur = [];
            if (item.checked) { if (cur.indexOf(item.value) < 0) cur.push(item.value); }
            else { var i = cur.indexOf(item.value); if (i > -1) cur.splice(i, 1); }
            Lampa.Storage.set('mobile_ratings_enabled', cur);
          },
          onBack: function () { Lampa.Controller.toggle('settings_component'); }
        });
      }
    });

    // Размер оценок (как в applecation)
    Lampa.SettingsApi.addParam({
      component: 'mobile_ratings',
      param: {
        name: 'mobile_ratings_scale',
        type: 'select',
        values: {
          50: '50%', 60: '60%', 70: '70%', 80: '80%', 90: '90%',
          100: 'По умолчанию',
          110: '110%', 120: '120%', 130: '130%', 140: '140%',
          150: '150%', 160: '160%', 170: '170%', 180: '180%'
        },
        default: '100'
      },
      field: {
        name: 'Размер оценок',
        description: 'Масштаб ряда оценок в карточке'
      },
      onChange: function (val) {
        Lampa.Storage.set('mobile_ratings_scale', val);
        applyScale();
      }
    });
  }


  // --- CSS ---
  function addStyle() {
    var css = ''
      + '.mobile-ratings{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.55em 1.1em;margin:0.5em 0 0.7em;font-size:var(--mr-scale,1.25em);}'
      + '.mobile-ratings .mrate{display:flex;align-items:center;gap:0.4em;}'
      + '.mobile-ratings .mrate svg{width:1.7em;height:auto;flex-shrink:0;color:rgba(255,255,255,0.92);}'
      + '.mobile-ratings .mrate--kp svg{width:1.45em;}'
      + '.mobile-ratings .mrate--tmdb svg{width:1.5em;}'
      + '.mobile-ratings .mrate--tomatoes svg{width:1.35em;}'
      + '.mobile-ratings .mrate--popcorn svg{width:1.15em;}'
      + '.mobile-ratings .mrate--metacritic svg{width:1.35em;}'
      + '.mobile-ratings .mrate--letterboxd svg{width:1.7em;}'
      + '.mobile-ratings .mrate--trakt svg{width:1.35em;}'
      + '.mobile-ratings .mrate>div{font-size:1.05em;font-weight:600;line-height:1;color:#fff;}';
    var st = document.createElement('style');
    st.id = 'mobile-ratings-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  // --- Инициализация ---
  function start() {
    if (!window.Lampa || !Lampa.Listener || !Lampa.Storage || !Lampa.Reguest) {
      return setTimeout(start, 200);
    }
    initDefaults();
    addSettings();
    applyScale();
    if (!document.getElementById('mobile-ratings-style')) addStyle();

    function process(e) {
      if (!isMobile()) return;
      if (e.type !== 'complite' && e.type !== 'render' && e.type !== 'show') return;

      var render = (e.object && e.object.activity && e.object.activity.render)
        ? e.object.activity.render()
        : (e.body || null);
      if (!render || !render.find) return;

      var card = (e.data && e.data.movie) ? e.data.movie : e.data;
      if (!card || !card.id) return;
      var isSerial = !!(card.name || card.original_name || card.first_air_date);

      collect(card, function (data, isFinal) {
        if (!render || !render.length || !$.contains(document, render[0])) return;
        if (DEBUG && isFinal) {
          var got = ORDER.filter(function (k) { return data[k] !== null && data[k] !== undefined; });
          console.log('[mobile_ratings] id=' + card.id + ' получены:', got.join(','), data);
        }
        inject(render, data, isSerial);
      });
    }

    Lampa.Listener.follow('full', function (e) {
      // на complite — сразу, на render/show — с задержкой (после interface_mod)
      if (e.type === 'complite') process(e);
      else if (e.type === 'render' || e.type === 'show') setTimeout(function () { process(e); }, 100);
    });
  }

  start();
})();
