
/*
 * HanzoTV — Подборки (podborki.js)
 *
 * Объединённый плагин. Внутри два независимых модуля:
 *
 *  1. СТРИМИНГИ — ряды «Новинки/Популярное — Netflix, Кинопоиск HD…» на
 *     главной (TMDB Discover + with_networks), с логотипами сервисов и
 *     вставкой вразброс между родными рядами Lampa. Бывший podborki.js.
 *
 *  2. ФРАНШИЗЫ — раздел меню «Франшизы»: киносерии TMDB, сериальные
 *     франшизы, вселенные, тематические подборки, аниме, поиск, ряд трендов,
 *     личные подборки. Каталог читается из franchises.json рядом с плагином.
 *     Бывший franchises.js.
 *
 * Модули не делят код и состояние: у каждого свои функции, свои ключи
 * хранилища (streaming_collections_settings / hzf_*), свой флаг повторной
 * загрузки. Общее у них одно — экран настроек «Подборки».
 *
 * Флаги повторной загрузки сохранены прежние (plugin_streaming_collections_ready,
 * hzf_plugin_ready): если где-то ещё подключён старый franchises.js или старый
 * podborki.js, соответствующий модуль здесь просто не запустится, без дублей.
 */
(function () {
    'use strict';

    // Общий экран настроек обоих модулей
    var SETTINGS = 'hanzo_podborki';
    var SETTINGS_ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="3" width="15" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 7v11a3 3 0 0 0 3 3h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11.5 7.5v5l4-2.5-4-2.5z" fill="currentColor"/></svg>';

    // ==================================================================
    //  МОДУЛЬ 1. СТРИМИНГИ НА ГЛАВНОЙ
    // ==================================================================

    var Streaming = (function () {
        if (window.plugin_streaming_collections_ready) return null;
        window.plugin_streaming_collections_ready = true;

        var globalStreaming = [
            { id: 213, title: 'Netflix' }, { id: 2739, title: 'Disney+' },
            { id: 2552, title: 'Apple TV+' }, { id: 1024, title: 'Amazon Prime Video' },
            { id: 3186, title: 'Max' }, { id: 4330, title: 'Paramount+' },
            { id: 3353, title: 'Peacock' }, { id: 453, title: 'Hulu' },
            { id: 49, title: 'HBO' }, { id: 318, title: 'Starz' },
            { id: 2, title: 'ABC' }, { id: 6, title: 'NBC' },
            { id: 19, title: 'FOX' }, { id: 67, title: 'Showtime' },
            { id: 88, title: 'FX' }, { id: 174, title: 'AMC' },
            { id: 16, title: 'CBS' }, { id: 64, title: 'Discovery' },
            { id: 493, title: 'BBC America' }, { id: 77, title: 'SyFy' }
        ];

        var russianStreaming = [
            { id: 3827, title: 'Кинопоиск HD' }, { id: 2493, title: 'Start' },
            { id: 3923, title: 'ИВИ' }, { id: 3871, title: 'Okko' },
            { id: 4085, title: 'KION' }, { id: 2859, title: 'Premier' },
            { id: 5806, title: 'Wink' }, { id: 3882, title: 'More.TV' },
            { id: 412, title: 'Россия 1' }, { id: 558, title: 'Первый канал' },
            { id: 806, title: 'СТС' }, { id: 1191, title: 'ТНТ' },
            { id: 3031, title: 'Пятница!' }
        ];

        var allSortOptions = [
            { id: 'vote_count.desc', title: 'sc_sort_votes' },
            { id: 'vote_average.desc', title: 'sc_sort_rating' },
            { id: 'first_air_date.desc', title: 'sc_sort_new' },
            { id: 'popularity.desc', title: 'sc_sort_popular' }
        ];

        var logoPending = {};

        var LOGO_STORAGE_KEY = 'sc_logo_cache';
        var logoCache = Lampa.Storage.get(LOGO_STORAGE_KEY) || {};

        // Одноразовая чистка кэша логотипов после смены логики URL.
        // Раньше сюда могли попасть переписанные вручную ссылки — удаляем их,
        // чтобы плагин запросил логотипы заново уже через Lampa.TMDB.image.
        (function resetLogoCacheOnce() {
            var VER_KEY = 'sc_logo_cache_ver';
            var VER = '2';
            try {
                if (Lampa.Storage.get(VER_KEY, '') !== VER) {
                    logoCache = {};
                    Lampa.Storage.set(LOGO_STORAGE_KEY, logoCache);
                    Lampa.Storage.set(VER_KEY, VER);
                }
            } catch (e) {}
        })();

        // Подписчики: networkId -> [callback, ...]
        // Когда лого придёт — вызываем всех подписчиков (в т.ч. уже отрисованные иконки)
        var logoSubscribers = {};

        function saveLogoCache() {
            Lampa.Storage.set(LOGO_STORAGE_KEY, logoCache);
        }

        function onLogoReady(networkId, callback) {
            if (logoCache[networkId]) { callback(logoCache[networkId]); return; }
            if (!logoSubscribers[networkId]) logoSubscribers[networkId] = [];
            logoSubscribers[networkId].push(callback);
        }

        function getLogoUrl(networkId, callback) {
            // Есть в кэше и не пустой — сразу отдаём
            if (logoCache.hasOwnProperty(networkId) && logoCache[networkId]) {
                if (callback) callback(logoCache[networkId]);
                return;
            }
            // Уже грузится — просто подписываемся
            if (logoPending[networkId]) {
                if (callback) logoPending[networkId].push(callback);
                return;
            }
            logoPending[networkId] = callback ? [callback] : [];

            var apiUrl = Lampa.TMDB.api('network/' + networkId + '?api_key=' + Lampa.TMDB.key());
            Lampa.Network.silent(apiUrl, function (data) {
                // Lampa.TMDB.image сама подставит прокси, если в настройках
                // включено «Проксировать TMDB». Ничего не переписываем.
                var url = data && data.logo_path ? Lampa.TMDB.image('t/p/w154' + data.logo_path) : '';

                // Не пишем пустой URL в кэш — иначе следующий заход возьмёт '' из кэша
                // и не запустит повторный запрос. Логотип не появится никогда.
                if (url) {
                    logoCache[networkId] = url;
                    saveLogoCache();
                }

                var cbs = logoPending[networkId] || [];
                delete logoPending[networkId];
                cbs.forEach(function (cb) { cb(url); });

                // Уведомляем подписчиков (уже отрисованные иконки-плейсхолдеры)
                if (url && logoSubscribers[networkId]) {
                    logoSubscribers[networkId].forEach(function (cb) { cb(url); });
                    delete logoSubscribers[networkId];
                }
            }, function () {
                var cbs = logoPending[networkId] || [];
                delete logoPending[networkId];
                cbs.forEach(function (cb) { cb(''); });
            }, false, { cache: { life: 60 * 24 * 7 } });
        }

        function preloadLogos() {
            globalStreaming.concat(russianStreaming).forEach(function (s) {
                getLogoUrl(s.id, null);
            });
        }

        function getAll() { return Lampa.Storage.get('streaming_collections_settings') || {}; }
        function getProfile() {
            var pid = Lampa.Storage.get('lampac_profile_id', '') || 'default';
            var a = getAll(); if (!a[pid]) { a[pid] = {}; Lampa.Storage.set('streaming_collections_settings', a); } return a[pid];
        }
        function getSetting(k, d) { var p = getProfile(); return p.hasOwnProperty(k) ? p[k] : d; }
        function setSetting(k, v) {
            var a = getAll(), pid = Lampa.Storage.get('lampac_profile_id', '') || 'default';
            if (!a[pid]) a[pid] = {}; a[pid][k] = v; Lampa.Storage.set('streaming_collections_settings', a);
        }

        var BASE_KW = '346488,158718,41278,13141,345822,315535,290667,323477,290609';

        function buildParams(sort, isRussian) {
            var p = '&sort_by=' + sort.id;
            if (sort.id === 'first_air_date.desc') {
                var e = new Date(); e.setDate(e.getDate() - 10);
                var s = new Date(); s.setFullYear(s.getFullYear() - 3);
                p += '&first_air_date.gte=' + s.toISOString().split('T')[0] + '&first_air_date.lte=' + e.toISOString().split('T')[0];
            }
            if (!isRussian) p += '&vote_count.gte=10';
            return p + '&without_keywords=' + encodeURIComponent(BASE_KW);
        }

        function getEnabledSorts() {
            var r = allSortOptions.filter(function (s) { return getSetting('sort_' + s.id, true); });
            return r.length ? r : allSortOptions;
        }

        function getActiveServices() {
            var list = [];
            if (getSetting('include_global', true))
                globalStreaming.forEach(function (s) { if (getSetting('gs_' + s.id, true)) list.push({ service: s, isRussian: false }); });
            if (getSetting('include_russian', true))
                russianStreaming.forEach(function (s) { if (getSetting('rs_' + s.id, true)) list.push({ service: s, isRussian: true }); });
            return list;
        }

        function shuffle(arr) {
            var a = arr.slice();
            for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
            return a;
        }

        var currentRenderList = null;
        var renderTimestamp = 0;

        function getCurrentRenderList() {
            var now = Date.now();
            if (currentRenderList && (now - renderTimestamp) < 2000) return currentRenderList;

            var services = getActiveServices();
            var sorts = getEnabledSorts();
            var combos = [];

            for (var i = 0; i < services.length; i++) {
                for (var j = 0; j < sorts.length; j++) {
                    combos.push({
                        service: services[i].service,
                        isRussian: services[i].isRussian,
                        sort: sorts[j]
                    });
                }
            }

            currentRenderList = shuffle(combos);
            renderTimestamp = now;
            return currentRenderList;
        }

        var titleRegistry = {};

        function registerTitle(titleText, networkId, serviceName) {
            titleRegistry[titleText] = { networkId: networkId, serviceName: serviceName };
        }

        function createIconImg(url) {
            return $('<img>').attr('src', url).css({
                width: '1.45em', height: '1.45em', 'object-fit': 'contain', display: 'block'
            });
        }

        function createIconWrap(networkId, serviceName) {
            var wrap = $('<span>').css({
                display: 'inline-flex', 'align-items': 'center', 'justify-content': 'center',
                width: '1.9em', height: '1.9em',
                'background-color': 'rgba(255,255,255,1)',
                'border-radius': '0.35em', 'margin-right': '0.45em', 'flex-shrink': '0'
            });

            var url = logoCache[networkId];

            if (url) {
                // Лого уже в кэше — сразу ставим картинку
                wrap.append(createIconImg(url));
            } else {
                // Кэша нет — ставим невидимый плейсхолдер (белый квадрат без текста)
                // и подписываемся: как только лого придёт — заменяем
                onLogoReady(networkId, function (logoUrl) {
                    if (!logoUrl) return;
                    wrap.empty().append(createIconImg(logoUrl));
                });
            }

            return wrap;
        }

        // Возвращает jQuery-элементы заголовков строк — совместимо со старой Lampa и CUB/LampacNG
        function findTitleElements() {
            var selectors = [
                '.items-line__title',
                '.items-line--title',
                '.items-line__header',
                '.content-row__title',
                '.row__title'
            ];
            var $found = $();
            for (var i = 0; i < selectors.length; i++) {
                var $els = $(selectors[i]);
                if ($els.length) $found = $found.add($els);
            }
            if (!$found.length) {
                $('[class]').each(function () {
                    var cls = $(this).attr('class') || '';
                    if (/items.line/i.test(cls) && /title/i.test(cls)) $found = $found.add(this);
                });
            }
            return $found;
        }

        function processAllTitles() {
            findTitleElements().each(function () {
                var el = $(this);
                if (el.data('sc-icon')) return;

                var text = el.text().trim();
                var info = titleRegistry[text];
                if (!info) return;

                el.data('sc-icon', true);
                el.css({ display: 'flex', 'align-items': 'center' });
                el.prepend(createIconWrap(info.networkId, info.serviceName));
            });
        }

        var observerStarted = false;

        function startObserver() {
            if (observerStarted) return;
            observerStarted = true;
            setInterval(processAllTitles, 500);
        }

        function makeRow(service, isRussian, sort) {
            var baseParams = '';

            if (sort.id === 'first_air_date.desc') {
                var e = new Date(); e.setDate(e.getDate() - 10);
                var s = new Date(); s.setFullYear(s.getFullYear() - 3);
                baseParams += '&first_air_date.gte=' + s.toISOString().split('T')[0];
                baseParams += '&first_air_date.lte=' + e.toISOString().split('T')[0];
            }
            if (!isRussian) baseParams += '&vote_count.gte=10';
            baseParams += '&without_keywords=' + encodeURIComponent(BASE_KW);

            var discoverPath = 'discover/tv?with_networks=' + service.id + baseParams;

            return function (callback) {
                var tmdbUrl = Lampa.TMDB.api(discoverPath + '&sort_by=' + sort.id + '&api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language', 'ru'));
                var net = new Lampa.Reguest();

                net.silent(tmdbUrl, function (json) {
                    if (!json || !Array.isArray(json.results)) return callback({ results: [] });
                    json.results.forEach(function (item) { if (!item.source) item.source = 'tmdb'; });
                    var t = Lampa.Lang.translate(sort.title) + ' — ' + service.title;
                    json.title = t;
                    json.url = discoverPath + '&sort_by=' + sort.id;
                    json.source = 'tmdb';
                    json.nomore = false;
                    registerTitle(t, service.id, service.title);
                    callback(json);
                }, function () { callback({ results: [] }); });
            };
        }

        var MAX_ROWS = 16;

        // ------------------------------------------------------------------
        //  Порядок рядов на главной.
        //
        //  Ядро вызывает ContentRows.call('main', params, parts_data), когда
        //  parts_data уже заполнен TMDB-загрузчиками (now_playing, trending,
        //  popular и т.д.). call перебирает зарегистрированные ряды и через
        //  Arrays.insert = splice(index,0,cb) вставляет их в этот массив.
        //
        //  Считать позицию по числу включённых штатных рядов оказалось
        //  ненадёжно: результат зависит от того, вернул ли каждый штатный ряд
        //  callback (пустая история/расписание => ряда в массиве нет), а это
        //  заранее неизвестно. Поэтому вместо угадывания индекса перехватываем
        //  сам ContentRows.call: даём ядру собрать calls, затем ВЫНИМАЕМ наши
        //  помеченные callback-и и переставляем их сразу за блоком "канальных"
        //  рядов Lampa (continue_watch / recomend_watch / timetable_*).
        //
        //  Метка живёт прямо на функции-callback: cb.__sc_priority = N.
        //  N задаёт порядок среди наших рядов ("Вы смотрели" = 0, подборки 1+).
        // ------------------------------------------------------------------

        function registerContentRows() {
            for (var i = 0; i < MAX_ROWS; i++) {
                (function (idx) {
                    Lampa.ContentRows.add({
                        index: 1,
                        name: 'sc_row_' + idx,
                        title: '',
                        screen: ['main'],
                        call: function () {
                            var list = getCurrentRenderList();
                            if (idx >= list.length) return function (cb) { cb({ results: [] }); };
                            var c = list[idx];
                            var producer = makeRow(c.service, c.isRussian, c.sort);
                            // Помечаем callback: приоритет = после "Вы смотрели",
                            // порядок подборок между собой по idx.
                            producer.__sc_priority = 100 + idx;
                            return producer;
                        }
                    });
                })(i);
            }
        }

        // ------------------------------------------------------------------
        //  Перехват ContentRows.call.
        //
        //  ContentRows.call('main', params, calls) вызывается, когда calls уже
        //  заполнен исходными загрузчиками главной (now_playing, latest, fire,
        //  trending, popular... — состав зависит от режима: CUB main$1 или
        //  TMDB main$2). Ядро домешивает в этот массив зарегистрированные ряды:
        //  канальные (continue_watch/recomend/timetable, все index:1) и наши.
        //
        //  Задача:
        //   - "Вы смотрели" (__sc_priority 0) — сразу за блоком канальных рядов;
        //   - подборки стримингов (priority 100+) — ВРАЗБРОС среди рядов
        //     КУБ/TMDB ниже границы (Последнее добавление, Огонь, Популярное...),
        //     а не отдельным блоком.
        //
        //  Граница = конец канального блока Lampa. Ловим её так: снимаем
        //  Set(calls) ДО origCall (исходные загрузчики, ссылки стабильны), после
        //  origCall идём с позиции 1, пропуская всё, чего НЕ было в Set (это
        //  вставленные ядром канальные ряды). Первый исходный загрузчик = граница.
        // ------------------------------------------------------------------
        function installRowsReorder() {
            if (window.__sc_rows_reorder_installed) return;
            window.__sc_rows_reorder_installed = true;

            var CR = Lampa.ContentRows;
            var origCall = CR.call.bind(CR);

            CR.call = function (screen, params, calls) {
                if (screen !== 'main' || !Array.isArray(calls)) {
                    return origCall(screen, params, calls);
                }

                // Исходные загрузчики главной, до вмешательства ядра.
                var originalSet = new Set(calls);

                origCall(screen, params, calls);

                // 1) Вынимаем наши помеченные ряды из массива.
                var watched = null;   // "Вы смотрели" (priority 0)
                var collections = []; // подборки стримингов (priority 100+)

                for (var i = calls.length - 1; i >= 0; i--) {
                    var cb = calls[i];
                    if (cb && typeof cb.__sc_priority === 'number') {
                        if (cb.__sc_priority === 0) watched = cb;
                        else collections.unshift(cb);
                        calls.splice(i, 1);
                    }
                }
                if (!watched && !collections.length) return;

                // 2) Граница канального блока Lampa: с позиции 1 пропускаем всё,
                //    чего не было в исходном массиве (вставленные ядром каналы).
                //    Первый исходный загрузчик = конец блока.
                var boundary = 1; // после now_playing по умолчанию
                for (var j = 1; j < calls.length; j++) {
                    if (originalSet.has(calls[j])) { boundary = j; break; }
                    boundary = j + 1;
                }

                // 3) "Вы смотрели" — вплотную за границей, ДО чередования.
                //    Сразу за ним пойдёт первый родной КУБ/TMDB ряд (см. п.4).
                if (watched) {
                    calls.splice(boundary, 0, watched);
                    boundary++; // чередование начинаем НИЖЕ "Вы смотрели"
                }

                // 4) Строгое чередование "по одному стримингу".
                //
                //    ВАЖНО про состав массива: в CUB-режиме (main$1) на момент
                //    ContentRows.call ниже границы лежат лишь ~5 родных рядов
                //    (latest, fire, in_high_quality, top_100 x2, trailers).
                //    Жанры и CUB-коллекции ядро добавляет в parts_data ПОЗЖЕ,
                //    уже после нашего перехвата (parts_data.push в цикле genres +
                //    network.silent для collections). Значит "родных" разделителей
                //    в доступном нам куске мало, а стримингов может быть до 16.
                //
                //    Правило "по 1 стримингу, между ними родной ряд" требует, чтобы
                //    стримингов было НЕ БОЛЬШЕ, чем родных рядов ниже границы.
                //    Иначе они неизбежно слипнутся. Поэтому:
                //      - считаем родные ряды ниже boundary (nativeBelow);
                //      - берём не больше nativeBelow стримингов, лишние отбрасываем;
                //      - вставляем каждый через один родной ряд (шаг gap=1).
                //
                //    Так на главной стримингов ровно столько, сколько влезает
                //    без слипания, и первым после "Вы смотрели" всегда родной ряд.

                // Сколько родных рядов доступно ниже границы для разбавления.
                var nativeBelow = 0;
                for (var n = boundary; n < calls.length; n++) {
                    if (originalSet.has(calls[n])) nativeBelow++;
                }

                // Влезает столько стримингов, сколько родных разделителей.
                // (каждому стримингу нужен минимум один родной ряд перед ним)
                var maxFit = nativeBelow;
                if (collections.length > maxFit) {
                    collections = collections.slice(0, maxFit);
                }

                // Вставляем строго через один родной ряд.
                var cursor = boundary;
                for (var k = 0; k < collections.length; k++) {
                    // Пропускаем ровно 1 родной ряд перед стримингом.
                    var passed = 0;
                    while (cursor < calls.length && passed < 1) {
                        if (originalSet.has(calls[cursor])) passed++;
                        cursor++;
                    }
                    calls.splice(cursor, 0, collections[k]);
                    cursor++; // встаём за вставленным стримингом
                }
            };
        }

        function addLang() {
            Lampa.Lang.add({
                sc_plugin_title: { ru: 'Подборки', en: 'Collections', uk: 'Підбірки' },
                sc_sort_votes: { ru: 'Много голосов', en: 'Most Votes', uk: 'Багато голосів' },
                sc_sort_rating: { ru: 'Высокий рейтинг', en: 'Top Rated', uk: 'Високий рейтинг' },
                sc_sort_new: { ru: 'Новинки', en: 'New', uk: 'Новинки' },
                sc_sort_popular: { ru: 'Популярные', en: 'Popular', uk: 'Популярні' },
                sc_sort_title: { ru: 'Виды сортировки подборок', en: 'Sorting types', uk: 'Типи сортування' },
                sc_sort_description: { ru: 'Выбор сортировки подборок', en: 'Choose sorting', uk: 'Вибір сортування' },
                sc_streaming_title: { ru: 'Стриминги', en: 'Streaming', uk: 'Стрімінги' },
                sc_streaming_description: { ru: 'Выберите регион', en: 'Choose region', uk: 'Виберіть регіон' },
                sc_global: { ru: 'Глобальные стриминги', en: 'Global streaming', uk: 'Глобальні стрімінги' },
                sc_global_description: { ru: 'Выбор глобальных сервисов', en: 'Choose global services', uk: 'Вибір глобальних сервісів' },
                sc_russian: { ru: 'Российские стриминги', en: 'Russian streaming', uk: 'Російські стрімінги' },
                sc_russian_description: { ru: 'Выбор российских сервисов', en: 'Choose Russian services', uk: 'Вибір російських сервісів' },
                sc_settings_section: { ru: 'Какие стриминги показывать', en: 'Which services to show', uk: 'Які стрімінги показувати' },
                sc_filters: { ru: 'Фильтры', en: 'Filters', uk: 'Фільтри' }
            });
        }

        function addSettingsParams() {
            Lampa.SettingsApi.addParam({ component: SETTINGS, param: { name: 'sc_head', type: 'title' }, field: { name: 'Стриминги на главной' } });

            Lampa.SettingsApi.addParam({ component: SETTINGS, param: { name: '', type: 'title' }, field: { name: Lampa.Lang.translate('sc_filters') } });

            Lampa.SettingsApi.addParam({
                component: SETTINGS, param: { name: 'sc_sort', type: 'button' },
                field: { name: Lampa.Lang.translate('sc_sort_title'), description: Lampa.Lang.translate('sc_sort_description') },
                onChange: function () {
                    var p = Lampa.Controller.enabled().name;
                    Lampa.Select.show({
                        title: Lampa.Lang.translate('sc_sort_title'),
                        items: allSortOptions.map(function (s) { return { title: Lampa.Lang.translate(s.title), id: s.id, checkbox: true, checked: getSetting('sort_' + s.id, true) }; }),
                        onBack: function () { Lampa.Controller.toggle(p); },
                        onCheck: function (i) { setSetting('sort_' + i.id, !getSetting('sort_' + i.id, true)); i.checked = getSetting('sort_' + i.id, true); }
                    });
                }
            });

            Lampa.SettingsApi.addParam({ component: SETTINGS, param: { name: '', type: 'title' }, field: { name: Lampa.Lang.translate('sc_settings_section') } });

            Lampa.SettingsApi.addParam({
                component: SETTINGS, param: { name: 'sc_region', type: 'button' },
                field: { name: Lampa.Lang.translate('sc_streaming_title'), description: Lampa.Lang.translate('sc_streaming_description') },
                onChange: function () {
                    var p = Lampa.Controller.enabled().name;
                    Lampa.Select.show({
                        title: Lampa.Lang.translate('sc_streaming_title'),
                        items: [
                            { title: Lampa.Lang.translate('sc_global'), id: 'include_global', checkbox: true, checked: getSetting('include_global', true) },
                            { title: Lampa.Lang.translate('sc_russian'), id: 'include_russian', checkbox: true, checked: getSetting('include_russian', true) }
                        ],
                        onBack: function () { Lampa.Controller.toggle(p); },
                        onCheck: function (i) { setSetting(i.id, !getSetting(i.id, true)); i.checked = getSetting(i.id, true); }
                    });
                }
            });

            Lampa.SettingsApi.addParam({
                component: SETTINGS, param: { name: 'sc_gs', type: 'button' },
                field: { name: Lampa.Lang.translate('sc_global'), description: Lampa.Lang.translate('sc_global_description') },
                onChange: function () {
                    var p = Lampa.Controller.enabled().name;
                    Lampa.Select.show({
                        title: Lampa.Lang.translate('sc_global'),
                        items: globalStreaming.map(function (s) { return { title: s.title, id: s.id, checkbox: true, checked: getSetting('gs_' + s.id, true) }; }),
                        onBack: function () { Lampa.Controller.toggle(p); },
                        onCheck: function (i) { setSetting('gs_' + i.id, !getSetting('gs_' + i.id, true)); i.checked = getSetting('gs_' + i.id, true); }
                    });
                }
            });

            Lampa.SettingsApi.addParam({
                component: SETTINGS, param: { name: 'sc_rs', type: 'button' },
                field: { name: Lampa.Lang.translate('sc_russian'), description: Lampa.Lang.translate('sc_russian_description') },
                onChange: function () {
                    var p = Lampa.Controller.enabled().name;
                    Lampa.Select.show({
                        title: Lampa.Lang.translate('sc_russian'),
                        items: russianStreaming.map(function (s) { return { title: s.title, id: s.id, checkbox: true, checked: getSetting('rs_' + s.id, true) }; }),
                        onBack: function () { Lampa.Controller.toggle(p); },
                        onCheck: function (i) { setSetting('rs_' + i.id, !getSetting('rs_' + i.id, true)); i.checked = getSetting('rs_' + i.id, true); }
                    });
                }
            });
        }


        return {
            start: function () { addLang(); preloadLogos(); startObserver(); installRowsReorder(); registerContentRows(); },
            settings: addSettingsParams
        };
    })();

    // ==================================================================
    //  МОДУЛЬ 2. ФРАНШИЗЫ И ТЕМАТИЧЕСКИЕ ПОДБОРКИ
    // ==================================================================

    var Franchises = (function () {
        if (window.hzf_plugin_ready) return null;
        window.hzf_plugin_ready = true;


        // ------------------------------------------------------------------
        //  КАТАЛОГ
        //  c: id коллекции TMDB. Названия и картинки приходят из TMDB на языке
        //  интерфейса, поэтому здесь только номера (в комментарии — для себя).
        // ------------------------------------------------------------------

        // kw: ключевые слова TMDB — число (проверенный id) или точное английское
        // название (id найдётся через search/keyword). Именно они добирают во
        // вселенные всё, чего нет в коллекциях: спин-оффы, мультфильмы, сериалы.
        var SECTIONS = [
            {
                title: 'Вселенные',
                universes: [
                    { key: 'mcu',   name: 'Киновселенная Marvel',   img: { c: 86311 },  kw: [180547] },
                    { key: 'sw',    name: 'Звёздные войны',          img: { c: 10 },     c: [10], s: [85536, 71412, 3478, 105971, 92830, 83867, 60554, 82856, 115036, 114461, 202879, 114478, 79093, 4194, 203085], kw: ['star wars'] },
                    { key: 'st',    name: 'Звёздный путь',           img: { c: 115575 }, c: [151, 115570, 115575], s: [253, 655, 580, 1855, 1992, 314, 103516, 67198, 82491, 85948, 85949, 106393], kw: ['star trek'] },
                    { key: 'mc',    name: 'Всё по Marvel Comics',    img: { c: 131292 }, kw: ['marvel comics'] },
                    { key: 'dc',    name: 'Вселенная DC',            img: { c: 263 },    c: [263, 120794, 8537, 209131, 468552, 573693], s: [1412, 60735, 62688, 62643, 71663, 89247], kw: ['dc comics', 'dc extended universe (dceu)', 'dc universe (dcu)'] },
                    { key: 'bat',   name: 'Бэтмен',                  img: { c: 120794 }, c: [263, 120794], kw: ['batman'] },
                    { key: 'sup',   name: 'Супермен',                img: { c: 8537 },   c: [8537, 209131], kw: ['superman'] },
                    { key: 'xmen',  name: 'Люди Икс',                img: { c: 748 },    c: [748, 453993, 448150], kw: ['x-men'] },
                    { key: 'spidy', name: 'Все Человеки-пауки',      img: { c: 556 },    c: [556, 125574, 531241, 573436], kw: ['spider-man'] },
                    { key: 'wiz',   name: 'Волшебный мир',           img: { c: 1241 },   c: [1241, 435259], kw: ['wizarding world'] },
                    { key: 'me',    name: 'Средиземье',              img: { c: 119 },    c: [119, 121938], kw: ['middle-earth (tolkien)'] },
                    { key: 'avp',   name: 'Чужой и Хищник',          img: { c: 8091 },   c: [8091, 135416, 399, 115762], kw: ['xenomorph'] },
                    { key: 'godz',  name: 'Годзилла и Монстрверс',   img: { c: 535313 }, c: [535313, 374509, 374511, 535790], kw: ['godzilla', 'monsterverse'] },
                    { key: 'tf',    name: 'Трансформеры',            img: { c: 8650 },   c: [8650], kw: ['transformers'] },
                    { key: 'conj',  name: 'Вселенная «Заклятия»',    img: { c: 313086 }, c: [313086, 402074], kw: ['the conjuring universe'] },
                    { key: 'ff',    name: 'Форсаж',                  img: { c: 9485 },   c: [9485, 688042] },
                    { key: 'rocky', name: 'Рокки и Крид',            img: { c: 1575 },   c: [1575, 553717] },
                    { key: 'apes',  name: 'Планета обезьян',         img: { c: 173710 }, c: [1709, 173710] }
                ]
            },
            {
                title: 'Сериальные франшизы',
                shows: [
                    { name: 'Игра престолов',         s: [1399, 94997] },
                    { name: 'Ходячие мертвецы',       s: [1402, 62286, 94305, 194583, 211684, 206586] },
                    { name: 'Звёздные войны: сериалы', s: [82856, 83867, 115036, 114461, 92830, 105971, 4194, 60554, 202879, 71412, 3478, 114478, 79093, 203085, 85536] },
                    { name: 'Звёздный путь: сериалы', s: [253, 655, 580, 1855, 1992, 314, 103516, 67198, 82491, 85948, 85949, 106393] },
                    { name: 'Вселенная Стрелы',       s: [1412, 60735, 62688, 62643, 71663, 89247] },
                    { name: 'Йеллоустоун',            s: [73586, 157744, 118357, 157732] },
                    { name: 'Доктор Кто',             s: [121, 57243, 1057, 424, 203, 64073, 239770] },
                    { name: 'Звёздные врата',         s: [4629, 2290, 5148, 72925] },
                    { name: 'Морская полиция',        s: [4614, 17610, 124271, 61387, 4376, 157950, 243006, 247732] },
                    { name: 'CSI',                    s: [1431, 1620, 2458, 122194, 61811] },
                    { name: 'Закон и порядок',        s: [549, 2734, 4601, 3357, 32632, 72496, 106158, 7098] },
                    { name: 'Чикаго',                 s: [44006, 58841, 62650, 67993] },
                    { name: 'ФБР',                    s: [80748, 94372, 121658] },
                    { name: '911',                    s: [75219, 89393] },
                    { name: 'Новичок',                s: [79744, 201992] },
                    { name: 'Власть в ночном городе', s: [54650, 97890, 124394, 119845] },
                    { name: 'Спартак',                s: [46296, 240459] },
                    { name: 'Ричер',                  s: [108978, 273207] },
                    { name: 'Босх',                   s: [60585, 153657] },
                    { name: 'Сумеречная зона',        s: [6357, 1918, 83135, 16399] },
                    { name: 'Милые обманщицы',        s: [31917, 46958, 79863, 110531] },
                    { name: 'Инспектор Морс',         s: [3476, 44264, 2343] },
                    { name: 'Смерть в раю',           s: [41956, 205072, 244978] }
                ]
            },
            // ---- Киносерии (коллекции TMDB) ----
            {
                title: 'Киносерии: Marvel',
                c: [86311, 131292, 131295, 131296, 284433, 422834, 618529, 531241, 556, 125574, 573436, 748, 453993, 448150, 9744, 735, 90306, 635362]
            },
            {
                title: 'Киносерии: DC и комиксы',
                c: [263, 120794, 8537, 209131, 468552, 573693, 17235, 135179, 1582, 401562]
            },
            {
                title: 'Киносерии: фантастика',
                c: [10, 115575, 115570, 151, 2344, 528, 8091, 135416, 399, 115762, 264, 87096, 726871, 328, 173710, 1709, 8650, 86055, 422837, 63043, 5547, 304378, 535313, 131635, 2794]
            },
            {
                title: 'Киносерии: фэнтези и приключения',
                c: [119, 121938, 1241, 435259, 420, 295, 84, 1733, 495527, 85943, 2980, 115776, 531331, 261307]
            },
            {
                title: 'Киносерии: боевики',
                c: [645, 87359, 9485, 688042, 404609, 1570, 31562, 5039, 1575, 553717, 126125, 945, 135483, 523855, 14890, 9518, 386534, 8945, 52785, 64751, 192492, 2883, 90863, 85861, 531330, 43064, 112399, 525891, 10456, 9818, 70068]
            },
            {
                title: 'Киносерии: криминал',
                c: [230, 304, 102322, 382685, 9743, 52783, 496796, 424202, 87186, 14377]
            },
            {
                title: 'Киносерии: ужасы',
                c: [656, 2602, 313086, 402074, 91361, 8581, 9735, 111751, 8864, 256322, 477962, 10455, 521226, 14563, 10453, 86578, 8918, 3601, 1565, 10789, 91799, 537982, 2366, 89151, 105995]
            },
            {
                title: 'Киносерии: мультфильмы',
                c: [10194, 2150, 8354, 14740, 86066, 544669, 89137, 77816, 87118, 468222, 137697, 137696, 386382, 185103, 325470, 404825, 427084, 464577, 489724, 229932, 94032, 531315, 134897, 167613, 275402, 750822]
            },
            {
                title: 'Киносерии: комедии',
                c: [9888, 86119, 2806, 51509, 1006, 4246, 9338, 3167, 37139, 96665, 212562, 180546, 266672, 280588, 93791, 352789, 86024, 44979, 86028, 3169, 124949, 473971, 487376, 11716, 647077, 747168, 168880, 458558, 488924, 722961]
            },

            // ---- Тематические подборки (ключевые слова TMDB) ----
            // covers: ручные обложки [id фильма, оригинальное название]; если id
            // не совпал с названием — обложка подберётся автоматически.
            {
                title: 'Подборки: время, космос, технологии',
                themes: [
                    { name: 'Путешествия во времени',  kw: [4379], covers: [[105, 'Back to the Future']] },
                    { name: 'Временная петля',         kw: ['time loop'], covers: [[137113, 'Edge of Tomorrow'], [137, 'Groundhog Day']] },
                    { name: 'Космос',                  kw: ['space travel', 'outer space', 'spaceship'], covers: [[157336, 'Interstellar']] },
                    { name: 'Вторжение пришельцев',    kw: ['alien invasion'], covers: [[602, 'Independence Day']] },
                    { name: 'Искусственный интеллект', kw: ['artificial intelligence (a.i.)'], covers: [[264660, 'Ex Machina']] },
                    { name: 'Роботы и андроиды',       kw: ['robot', 'android'], covers: [[10681, 'WALL·E']] },
                    { name: 'Киберпанк',               kw: ['cyberpunk'], covers: [[78, 'Blade Runner']] },
                    { name: 'Антиутопия',              kw: ['dystopia'] },
                    { name: 'Постапокалипсис',         kw: ['post-apocalyptic future'], covers: [[76341, 'Mad Max: Fury Road']] },
                    { name: 'Параллельные миры',       kw: ['parallel world', 'multiverse'] },
                    { name: 'Виртуальная реальность',  kw: ['virtual reality'], covers: [[333339, 'Ready Player One']] },
                    { name: 'Супергерои',              kw: ['superhero'], covers: [[24428, 'The Avengers']] }
                ]
            },
            {
                title: 'Подборки: легенды и дальние края',
                themes: [
                    { name: 'Драконы',                kw: ['dragon'], covers: [[10191, 'How to Train Your Dragon']] },
                    { name: 'Магия',                  kw: ['magic'], covers: [[671, "Harry Potter and the Philosopher's Stone"]] },
                    { name: 'Пираты',                 kw: ['pirate'], covers: [[22, 'Pirates of the Caribbean']] },
                    { name: 'Поиски сокровищ',        kw: ['treasure hunt'], covers: [[85, 'Raiders of the Lost Ark']] },
                    { name: 'Динозавры',              kw: ['dinosaur'], covers: [[329, 'Jurassic Park']] },
                    { name: 'Самураи',                kw: ['samurai'], covers: [[346, '七人の侍'], [616, 'The Last Samurai']] },
                    { name: 'Рыцари и Средневековье', kw: ['medieval', 'knight'], covers: [[197, 'Braveheart'], [1495, 'Kingdom of Heaven']] },
                    { name: 'Выживание',              kw: ['survival'], covers: [[281957, 'The Revenant'], [8358, 'Cast Away']] },
                    { name: 'Катастрофы',             kw: ['natural disaster', 'disaster'], covers: [[14161, '2012']] },
                    { name: 'Роуд-муви',              kw: ['road trip'] }
                ]
            },
            {
                title: 'Подборки: преступный мир',
                themes: [
                    { name: 'Ограбления',          kw: ['heist'], covers: [[161, "Ocean's Eleven"], [949, 'Heat']] },
                    { name: 'Шпионы',              kw: ['spy'], covers: [[36557, 'Casino Royale']] },
                    { name: 'Мафия',               kw: ['mafia'], covers: [[238, 'The Godfather']] },
                    { name: 'Серийные убийцы',     kw: ['serial killer'], covers: [[807, 'Se7en']] },
                    { name: 'Месть',               kw: ['revenge'], covers: [[24, 'Kill Bill'], [245891, 'John Wick']] },
                    { name: 'Тюрьма и побег',      kw: ['prison', 'prison escape'], covers: [[278, 'The Shawshank Redemption']] },
                    { name: 'Боевые искусства',    kw: ['martial arts'], covers: [[9461, 'Enter the Dragon'], [14756, '葉問']] },
                    { name: 'Наркокартели',        kw: ['drug cartel'], covers: [[273481, 'Sicario']] },
                    { name: 'Коррупция в полиции', kw: ['police corruption'], covers: [[1422, 'The Departed']] }
                ]
            },
            {
                title: 'Подборки: страх и мистика',
                themes: [
                    { name: 'Зомби',                   kw: [12377], covers: [[924, 'Dawn of the Dead']] },
                    { name: 'Вампиры',                 kw: ['vampire'], covers: [[6114, 'Dracula']] },
                    { name: 'Оборотни',                kw: ['werewolf'], covers: [[814, 'An American Werewolf in London']] },
                    { name: 'Дом с привидениями',      kw: ['haunted house'], covers: [[138843, 'The Conjuring']] },
                    { name: 'Одержимость и экзорцизм', kw: ['exorcism', 'demonic possession'], covers: [[9552, 'The Exorcist']] },
                    { name: 'Найденная плёнка',        kw: ['found footage'], covers: [[2667, 'The Blair Witch Project']] },
                    { name: 'Слэшеры',                 kw: ['slasher'], covers: [[948, 'Halloween'], [4232, 'Scream']] },
                    { name: 'Акулы',                   kw: ['shark'], covers: [[578, 'Jaws']] },
                    { name: 'Ведьмы',                  kw: ['witch'], covers: [[310131, 'VVitch']] }
                ]
            },
            {
                title: 'Подборки: жизнь и история',
                themes: [
                    { name: 'Реальные события', kw: ['based on true story'], covers: [[424, "Schindler's List"]] },
                    { name: 'Биографии',        kw: ['biography'], covers: [[424694, 'Bohemian Rhapsody']] },
                    { name: 'По мотивам книг',  kw: [818], covers: [[120, 'The Lord of the Rings']] },
                    { name: 'По комиксам',      kw: ['based on comic'], covers: [[155, 'The Dark Knight']] },
                    { name: 'По видеоиграм',    kw: ['based on video game'], covers: [[454626, 'Sonic the Hedgehog']] },
                    { name: 'Спорт',            kw: ['sports'], covers: [[1366, 'Rocky']] },
                    { name: 'Взросление',       kw: ['coming of age'], covers: [[235, 'Stand by Me']] },
                    { name: 'Школа',            kw: ['high school'], covers: [[10625, 'Mean Girls']] },
                    { name: 'Вторая мировая',   kw: ['world war ii'], covers: [[857, 'Saving Private Ryan']] },
                    { name: 'Холодная война',   kw: ['cold war'] },
                    { name: 'Рождество',        kw: ['christmas'], covers: [[771, 'Home Alone']] },
                    { name: 'Хэллоуин',         kw: ['halloween'] }
                ]
            },

            // ---- Аниме: японская анимация (жанр 16 + язык ja) ----
            {
                title: 'Аниме: главное',
                anime: true,
                themes: [
                    { name: 'Популярные аниме-сериалы', media: 'tv' },
                    { name: 'Аниме-фильмы',             media: 'movie' },
                    { name: 'Студия Ghibli',            media: 'movie', company: 10342 },
                    { name: 'Сёнэн',                    kw: ['shounen'] },
                    { name: 'Сэйнэн',                   kw: ['seinen'] },
                    { name: 'Сёдзё',                    kw: ['shoujo'] },
                    { name: 'Исекай',                   kw: ['isekai'] },
                    { name: 'Меха',                     kw: ['mecha'] }
                ]
            },
            {
                title: 'Аниме: по темам',
                anime: true,
                themes: [
                    { name: 'Повседневность',         kw: ['slice of life'] },
                    { name: 'Романтика',              kw: ['romance'] },
                    { name: 'Школа',                  kw: ['school', 'high school'] },
                    { name: 'Спорт',                  kw: ['sports'] },
                    { name: 'Магия',                  kw: ['magic'] },
                    { name: 'Сверхъестественное',     kw: ['supernatural'] },
                    { name: 'Демоны',                 kw: ['demon'] },
                    { name: 'Самураи',                kw: ['samurai'] },
                    { name: 'Киберпанк',              kw: ['cyberpunk'] },
                    { name: 'Постапокалипсис',        kw: ['post-apocalyptic future'] }
                ]
            }
        ];

        // ------------------------------------------------------------------
        //  КАТАЛОГ С СЕРВЕРА
        //  SECTIONS выше — встроенная копия на случай, если файл недоступен.
        //  Рабочий каталог лежит рядом с плагином: franchises.json. Его можно
        //  править на сервере без пересборки плагина и рестарта Lampac —
        //  клиенты перечитывают его раз в час (параметр ?h= в адресе).
        // ------------------------------------------------------------------

        var BUILTIN = SECTIONS;
        var catalog = null;
        var catalogInfo = 'ещё не загружен';

        // Адрес папки плагина. document.currentScript доступен только в момент
        // первого выполнения файла, поэтому вычисляем сразу. В APK страница
        // открыта с file://, там location бесполезен — запасной вариант домен.
        var SCRIPT_BASE = (function () {
            try {
                var s = document.currentScript && document.currentScript.src;
                if (s && /^https?:/i.test(s)) return s.replace(/[?#].*$/, '').replace(/\/[^\/]*$/, '');
            } catch (e) {}
            try {
                var o = location.origin;
                if (o && /^https?:/i.test(o)) return o;
            } catch (e) {}
            return 'https://hanzoon.online';
        })();

        function loadCatalog(cb) {
            if (catalog) return cb(catalog);
            var finished = false;
            var guard = setTimeout(function () { finish(null); }, 6000);
            var url = SCRIPT_BASE + '/franchises.json?h=' + Math.floor(Date.now() / 3600000);

            new Lampa.Reguest().silent(url, function (j) { finish(j); }, function () { finish(null); });

            function finish(j) {
                if (finished) return;
                finished = true;
                clearTimeout(guard);
                if (typeof j === 'string') { try { j = JSON.parse(j); } catch (e) { j = null; } }
                if (j && Array.isArray(j.sections) && j.sections.length) {
                    catalog = j.sections;
                    catalogInfo = 'с сервера, версия ' + (j.version || '?') + ', рядов: ' + j.sections.length;
                } else {
                    catalog = BUILTIN;
                    catalogInfo = 'встроенный (franchises.json не загрузился)';
                    console.log('HZF', 'franchises.json не загрузился, использую встроенный каталог:', url);
                }
                cb(catalog);
            }
        }

        // ------------------------------------------------------------------
        //  ЛИЧНЫЕ ПОДБОРКИ И СКРЫТЫЕ РЯДЫ (хранятся на устройстве)
        // ------------------------------------------------------------------

        var USER_TITLE = 'Мои подборки';
        var TREND_TITLE = 'Франшизы в тренде';

        function readJson(key, def) {
            var v = Lampa.Storage.get(key, '');
            if (typeof v === 'string') { try { v = v ? JSON.parse(v) : def; } catch (e) { v = def; } }
            return v || def;
        }

        function userData() {
            var d = readJson('hzf_user', {});
            d.c = d.c || [];            // коллекции TMDB: [{id, name}]
            d.themes = d.themes || [];  // темы: [{name, kw: [...]}]
            return d;
        }

        function saveUser(d) { Lampa.Storage.set('hzf_user', d); }

        function hiddenRows() { return readJson('hzf_hidden', []); }

        function allSections(cat) {
            var list = [];
            var u = userData();
            if (u.c.length || u.themes.length) list.push({ title: USER_TITLE, user: true });
            list.push({ title: TREND_TITLE, trending: true });
            return list.concat(cat);
        }

        function visibleSections(cat) {
            var hidden = hiddenRows();
            return allSections(cat).filter(function (s) { return hidden.indexOf(s.title) < 0; });
        }

        // ------------------------------------------------------------------
        //  НАСТРОЙКИ
        // ------------------------------------------------------------------

        // Кэш TMDB (в минутах). Состав коллекций, discover и тренды меняются —
        // их держим полсуток, чтобы новые части появлялись быстро. Карточки
        // фильмов/сериалов и id ключевых слов почти не меняются — неделя.
        var CACHE_DYNAMIC = 60 * 12;
        var CACHE_STATIC = 60 * 24 * 7;

        function cacheLife(path) {
            return /^(collection|discover|trending|search\/collection)/.test(path) ? CACHE_DYNAMIC : CACHE_STATIC;
        }
        var MAX_PARALLEL = 3;          // одновременных запросов к TMDB
        var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="3" width="15" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 7v11a3 3 0 0 0 3 3h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11.5 7.5v5l4-2.5-4-2.5z" fill="currentColor"/></svg>';

        function field(name, def) {
            try {
                var v = Lampa.Storage.field(name);
                return (v === undefined || v === null || v === '') ? def : v;
            } catch (e) { return def; }
        }

        function lang() {
            return Lampa.Storage.get('tmdb_lang', '') || Lampa.Storage.get('language', 'ru') || 'ru';
        }

        // ------------------------------------------------------------------
        //  СЕТЬ: очередь + кэш в памяти + склейка одинаковых запросов
        // ------------------------------------------------------------------

        var net = new Lampa.Reguest();
        var memo = {};       // path -> json   (на время сессии)
        var inflight = {};   // path -> [{ok, err}]
        var queue = [];
        var running = 0;

        function pump() {
            while (running < MAX_PARALLEL && queue.length) {
                var job = queue.shift();
                running++;
                job();
            }
        }

        function tmdb(path, ok, err) {
            if (memo[path]) { ok(memo[path]); return; }
            if (inflight[path]) { inflight[path].push({ ok: ok, err: err }); return; }
            inflight[path] = [{ ok: ok, err: err }];

            queue.push(function () {
                var sep = path.indexOf('?') >= 0 ? '&' : '?';
                var url = Lampa.TMDB.api(path + sep + 'api_key=' + Lampa.TMDB.key() + '&language=' + lang());
                var finished = false;

                function done(json, failed) {
                    if (finished) return;
                    finished = true;
                    running--;
                    var subs = inflight[path] || [];
                    delete inflight[path];
                    if (!failed) memo[path] = json;   // ошибки не запоминаем
                    subs.forEach(function (s) {
                        try {
                            if (failed) { if (s.err) s.err(); }
                            else s.ok(json);
                        } catch (e) { console.log('HZF', 'callback error', e && e.message); }
                    });
                    pump();
                }

                // Страховка: если Reguest не вызвал ни ok, ни error — освобождаем слот
                var guard = setTimeout(function () { done(null, true); }, 20000);

                net.silent(url, function (json) {
                    clearTimeout(guard);
                    if (!json || json.success === false || json.status_code) done(null, true);
                    else done(json, false);
                }, function () {
                    clearTimeout(guard);
                    done(null, true);
                }, false, { cache: { life: cacheLife(path) } });
            });
            pump();
        }

        // Загрузить список путей, вернуть массив ответов в том же порядке (null — ошибка)
        function tmdbAll(paths, cb) {
            var left = paths.length, out = new Array(paths.length);
            if (!left) return cb(out);
            paths.forEach(function (p, i) {
                tmdb(p, function (json) { out[i] = json; if (--left === 0) cb(out); },
                        function () { out[i] = null; if (--left === 0) cb(out); });
            });
        }

        // ------------------------------------------------------------------
        //  ДАННЫЕ
        // ------------------------------------------------------------------

        function cleanName(name) {
            var s = String(name || '')
                .replace(/\s*\(\s*(коллекция|collection|серия фильмов|film series|сборник)\s*\)\s*$/i, '')
                .replace(/\s*[-–—|:]?\s*(коллекция|collection|серия фильмов|film series|сборник)\s*$/i, '')
                .replace(/^\s*(коллекция|сборник)\s*/i, '')
                .replace(/[«»]/g, '')
                .replace(/[\s|·:–—-]+$/, '')
                .trim();
            // «Звёздный путь (TOS» → «Звёздный путь (TOS)»: скобку могло съесть удаление суффикса
            var open = (s.match(/\(/g) || []).length, close = (s.match(/\)/g) || []).length;
            while (close++ < open) s += ')';
            return s;
        }

        function plural(n, one, few, many) {
            var m10 = n % 10, m100 = n % 100;
            if (m10 === 1 && m100 !== 11) return one;
            if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
            return many;
        }

        function dateOf(item) {
            return item.release_date || item.first_air_date || '';
        }

        function isFuture(item) {
            var d = dateOf(item);
            if (!d) return true;
            return d > new Date().toISOString().slice(0, 10);
        }

        function sortItems(items) {
            var order = field('hzf_order', 'asc');
            var arr = items.slice();
            if (field('hzf_hide_future', false)) arr = arr.filter(function (i) { return !isFuture(i); });

            if (order === 'rating') {
                arr.sort(function (a, b) { return (b.vote_average || 0) - (a.vote_average || 0); });
            } else {
                arr.sort(function (a, b) {
                    var da = dateOf(a), db = dateOf(b);
                    if (!da && !db) return 0;
                    if (!da) return 1;          // без даты — в конец
                    if (!db) return -1;
                    return order === 'desc' ? (da < db ? 1 : da > db ? -1 : 0) : (da < db ? -1 : da > db ? 1 : 0);
                });
            }
            return arr;
        }

        // Копия без служебных полей. Ответы TMDB лежат в общем кэше memo, а карточка
        // ядра дописывает в объект params/emit. Без копии обработчик «Enter» со
        // страницы франшизы переехал бы в ряд на главной и открывал фильм дважды.
        function copyItem(src) {
            var out = {};
            for (var k in src) if (src.hasOwnProperty(k) && k !== 'params') out[k] = src[k];
            return out;
        }

        function markSource(src, media) {
            var item = copyItem(src);
            item.source = 'tmdb';
            if (media === 'tv' && !item.original_name) item.original_name = item.original_title || item.name || '';
            return item;
        }

        // ------------------------------------------------------------------
        //  КЛЮЧЕВЫЕ СЛОВА TMDB
        //  В каталоге можно указать число (проверенный id) или английское
        //  название ключевого слова. Название превращается в id запросом
        //  search/keyword с ТОЧНЫМ совпадением имени — чтобы «robot» не
        //  превратился в «robot chicken». Не нашлось — слово тихо пропускается,
        //  в консоль пишется строка HZF, по ней видно, что поправить.
        // ------------------------------------------------------------------

        // Нижний регистр, пунктуация → пробел. Иероглифы и кириллица сохраняются
        // (обложка «Семь самураев» сверяется по оригиналу 七人の侍).
        function norm(s) {
            return String(s || '').toLowerCase().replace(/[\s!-\/:-@\[-`{-~·«»–—’]+/g, ' ').trim();
        }

        function resolveKeywords(list, cb) {
            list = [].concat(list || []);
            var ids = [], left = list.length;
            if (!left) return cb(ids);

            function done(id) {
                if (id && ids.indexOf(id) < 0) ids.push(id);
                if (--left === 0) cb(ids);
            }

            list.forEach(function (k) {
                if (typeof k === 'number') return done(k);
                tmdb('search/keyword?query=' + encodeURIComponent(k), function (json) {
                    var want = norm(k), hit = null;
                    (json.results || []).forEach(function (r) { if (!hit && norm(r.name) === want) hit = r; });
                    if (!hit) console.log('HZF', 'ключевое слово не найдено:', k);
                    done(hit ? hit.id : 0);
                }, function () { done(0); });
            });
        }

        // ------------------------------------------------------------------
        //  DISCOVER-ЗАПРОСЫ
        //  opts.anime — только японская анимация (жанр 16 + язык ja),
        //  opts.company — фильтр по студии. Документалки, новости и ток-шоу
        //  отсекаются всегда.
        // ------------------------------------------------------------------

        function discoverPath(kind, ids, sort, minVotes, opts) {
            opts = opts || {};
            var q = 'discover/' + kind + '?sort_by=' + sort + '&vote_count.gte=' + minVotes;
            if (ids && ids.length) q += '&with_keywords=' + ids.join('|');
            if (opts.company) q += '&with_companies=' + opts.company;
            if (opts.anime) q += '&with_genres=16&with_original_language=ja';
            q += kind === 'movie' ? '&without_genres=99' : '&without_genres=99,10763,10767';
            return q;
        }

        // Аниме = японская анимация. У TMDB нет отдельного жанра «аниме», поэтому
        // определяем по связке «жанр Анимация (16) + язык оригинала ja».
        function isAnime(item) {
            return item && item.original_language === 'ja' && (item.genre_ids || []).indexOf(16) >= 0;
        }

        // Первая страница, затем остальные (до maxPages) — только если они есть
        function fetchPaged(base, maxPages, cb) {
            tmdb(base + '&page=1', function (first) {
                var all = (first.results || []).slice();
                var total = Math.min(first.total_pages || 1, maxPages);
                if (total <= 1) return cb(all);
                var paths = [];
                for (var p = 2; p <= total; p++) paths.push(base + '&page=' + p);
                tmdbAll(paths, function (res) {
                    res.forEach(function (j) { if (j && j.results) all.push.apply(all, j.results); });
                    cb(all);
                });
            }, function () { cb([]); });
        }

        // Все фильмы/сериалы, входящие во франшизу или вселенную
        function loadEntryItems(entry, ok, fail) {
            var seen = {}, items = [];

            function push(item, media) {
                if (!item || !item.id) return;
                var key = media + ':' + item.id;
                if (seen[key]) return;
                seen[key] = true;
                items.push(markSource(item, media));
            }

            var paths = [], kinds = [];
            (entry.c || []).forEach(function (id) { paths.push('collection/' + id); kinds.push('c'); });
            (entry.s || []).forEach(function (id) { paths.push('tv/' + id); kinds.push('s'); });

            tmdbAll(paths, function (res) {
                res.forEach(function (json, i) {
                    if (!json) return;
                    if (kinds[i] === 'c') (json.parts || []).forEach(function (p) { push(p, p.media_type === 'tv' ? 'tv' : 'movie'); });
                    else push(json, 'tv');
                });

                resolveKeywords(entry.kw, function (ids) {
                    if (!ids.length) return finish();
                    // Берём самые обсуждаемые (vote_count.desc), а хронологию наводим сами:
                    // сортировка по дате на стороне TMDB отдала бы только самое старое
                    var left = 2;
                    fetchPaged(discoverPath('movie', ids, 'vote_count.desc', 3), 6, function (list) {
                        list.forEach(function (p) { push(p, 'movie'); });
                        if (--left === 0) finish();
                    });
                    fetchPaged(discoverPath('tv', ids, 'vote_count.desc', 3), 3, function (list) {
                        list.forEach(function (p) { push(p, 'tv'); });
                        if (--left === 0) finish();
                    });
                });
            });

            function finish() {
                if (items.length) ok(sortItems(items));
                else fail();
            }
        }

        function themeKinds(entry) {
            return entry.media ? [entry.media] : ['movie', 'tv'];
        }

        // Ключевые слова темы. Если они заданы, но ни одно не нашлось — тему не показываем:
        // иначе вместо «Самураев» открылся бы просто список всех фильмов подряд.
        function themeKeywords(entry, ok, fail) {
            if (!entry.kw || !entry.kw.length) return ok([]);
            resolveKeywords(entry.kw, function (ids) { ids.length ? ok(ids) : fail(); });
        }

        // Страница тематической подборки: фильмы + сериалы, самые популярные сверху
        function loadThemePage(entry, page, ok, fail) {
            themeKeywords(entry, function (ids) {
                var kinds = themeKinds(entry);
                var paths = kinds.map(function (k) {
                    var minVotes = entry.anime ? (k === 'movie' ? 20 : 10) : (k === 'movie' ? 30 : 15);
                    return discoverPath(k, ids, 'vote_count.desc', minVotes, entry) + '&page=' + page;
                });

                tmdbAll(paths, function (res) {
                    var items = [], total = 0;
                    res.forEach(function (json, i) {
                        if (!json) return;
                        total = Math.max(total, json.total_pages || 0);
                        (json.results || []).forEach(function (p) {
                            // В обычных темах аниме не показываем — для него свой раздел
                            if (!entry.anime && isAnime(p)) return;
                            items.push(markSource(p, kinds[i]));
                        });
                    });
                    if (field('hzf_hide_future', false)) items = items.filter(function (i) { return !isFuture(i); });
                    items.sort(function (a, b) { return (b.vote_count || 0) - (a.vote_count || 0); });
                    if (!items.length && page === 1) return fail();
                    ok({ results: items, total_pages: Math.min(total || 1, 30) });
                });
            }, fail);
        }

        // ------------------------------------------------------------------
        //  ОБЛОЖКИ ПЛИТОК
        //  used — общий на весь экран хаба набор уже занятых картинок и
        //  фильмов, чтобы одна и та же «Начало» не стояла на двух плитках.
        // ------------------------------------------------------------------

        function takeImage(cands, used) {
            for (var i = 0; i < cands.length; i++) {
                var c = cands[i];
                if (c && !used['img:' + c]) { used['img:' + c] = true; return c; }
            }
            return cands.filter(Boolean)[0] || '';
        }

        // Ручная обложка темы: [id фильма, оригинальное название]. Название
        // сверяется с ответом TMDB — если id оказался не тем фильмом, обложка
        // просто пропускается, а не показывает случайное кино.
        function tryCovers(covers, used, ok, fail) {
            covers = (covers || []).slice();
            (function next() {
                if (!covers.length) return fail();
                var c = covers.shift();
                tmdb('movie/' + c[0], function (m) {
                    var want = norm(c[1]);
                    var match = !!want && (norm(m.original_title).indexOf(want) >= 0 || norm(m.title).indexOf(want) >= 0);
                    if (!match) console.log('HZF', 'обложка не совпала:', c[0], c[1], '→', m.original_title);
                    if (!match || !m.backdrop_path || used['img:' + m.backdrop_path] || used['m:' + m.id]) return next();
                    used['img:' + m.backdrop_path] = true;
                    used['m:' + m.id] = true;
                    ok(m);
                }, next);
            })();
        }

        // Автоподбор: сначала самые высоко оценённые фильмы темы (так в «Самураях»
        // первым оказывается «Семь самураев», а не «Росомаха»), затем популярные.
        function autoCover(entry, ids, used, ok, fail) {
            var kind = themeKinds(entry)[0];
            var minVotes = entry.anime ? 300 : 1500;
            var paths = [
                discoverPath(kind, ids, 'vote_average.desc', minVotes, entry) + '&page=1',
                discoverPath(kind, ids, 'vote_count.desc', entry.anime ? 20 : 30, entry) + '&page=1'
            ];
            tmdbAll(paths, function (res) {
                var cands = [];
                res.forEach(function (j) { if (j) cands = cands.concat(j.results || []); });
                if (!cands.length) return fail();
                var pick = null;
                cands.forEach(function (r) {
                    if (pick || !r.backdrop_path) return;
                    if (!entry.anime && isAnime(r)) return;
                    if (used['img:' + r.backdrop_path] || used['m:' + r.id]) return;
                    pick = r;
                });
                pick = pick || cands.filter(function (r) { return r.backdrop_path; })[0] || cands[0];
                used['img:' + pick.backdrop_path] = true;
                used['m:' + pick.id] = true;
                ok(pick);
            });
        }

        // Карточка для хаба: название, картинка, счётчик
        function loadEntryCard(entry, ok, fail, used) {
            used = used || {};

            if (entry.t === 'c') {
                tmdb('collection/' + entry.id, function (json) {
                    var parts = json.parts || [];
                    if (parts.length < 2) return fail();
                    var votes = parts.filter(function (p) { return p.vote_average > 0; });
                    var avg = votes.length ? votes.reduce(function (s, p) { return s + p.vote_average; }, 0) / votes.length : 0;
                    var name = cleanName(json.name);
                    // Картинку коллекции могла уже занять вселенная — тогда берём кадр одной из частей
                    var img = takeImage([json.backdrop_path].concat(parts.map(function (p) { return p.backdrop_path; })), used);
                    ok({
                        name: name,
                        title: name + ' · ' + parts.length + ' ' + plural(parts.length, 'фильм', 'фильма', 'фильмов'),
                        poster_path: json.poster_path,
                        backdrop_path: img,
                        overview: json.overview,
                        vote_average: avg
                    });
                }, fail);
                return;
            }

            if (entry.t === 'k') {
                var done = function (m) {
                    ok({ name: entry.name, title: entry.name, backdrop_path: m.backdrop_path, poster_path: m.poster_path });
                };
                themeKeywords(entry, function (ids) {
                    // Тема без результатов не показывается вовсе
                    tmdb(discoverPath(themeKinds(entry)[0], ids, 'vote_count.desc', entry.anime ? 20 : 30, entry) + '&page=1', function (probe) {
                        if (!(probe.results || []).length) return fail();
                        tryCovers(entry.covers, used, done, function () {
                            autoCover(entry, ids, used, done, fail);
                        });
                    }, fail);
                }, fail);
                return;
            }

            // Вселенная / сериальная франшиза: картинку берём у «опорной» коллекции или сериала
            var img = entry.img || { s: (entry.s || [])[0] };
            var path = img.c ? 'collection/' + img.c : 'tv/' + img.s;
            var count = entry.t === 's' ? (entry.s || []).length : 0;

            tmdb(path, function (json) {
                var cands = [json.backdrop_path].concat((json.parts || []).map(function (p) { return p.backdrop_path; }));
                ok({
                    name: entry.name,
                    title: entry.name + (count ? ' · ' + count + ' ' + plural(count, 'сериал', 'сериала', 'сериалов') : ''),
                    poster_path: json.poster_path,
                    backdrop_path: takeImage(cands, used),
                    overview: json.overview,
                    vote_average: entry.t === 's' ? json.vote_average : 0
                });
            }, function () {
                // Картинка не пришла — всё равно показываем запись
                ok({ name: entry.name, title: entry.name, img: './img/img_broken.svg' });
            });
        }

        // Тренды: фильмы недели → у кого есть belongs_to_collection → эти франшизы.
        // Ряд пересобирается сам, вручную его вести не нужно.
        function trendingEntries(cb) {
            tmdb('trending/movie/week', function (j) {
                var ids = (j.results || []).slice(0, 20).map(function (r) { return r.id; });
                tmdbAll(ids.map(function (id) { return 'movie/' + id; }), function (res) {
                    var seen = {}, out = [];
                    res.forEach(function (m) {
                        var c = m && m.belongs_to_collection;
                        if (c && !seen[c.id]) { seen[c.id] = true; out.push({ t: 'c', id: c.id, c: [c.id] }); }
                    });
                    cb(out);
                });
            }, function () { cb([]); });
        }

        function sectionEntriesAsync(sec, cb) {
            if (sec.trending) return trendingEntries(cb);
            if (sec.user) {
                var u = userData();
                return cb(u.c.map(function (x) { return { t: 'c', id: x.id, c: [x.id] }; }).concat(
                    u.themes.map(function (th) { return { t: 'k', id: 'u_' + norm(th.name), name: th.name, kw: th.kw }; })));
            }
            cb(sectionEntries(sec));
        }

        // Нормализованные записи секции
        function sectionEntries(sec) {
            if (sec.universes) return sec.universes.map(function (u) {
                return { t: 'u', id: u.key, name: u.name, img: u.img, c: u.c, s: u.s, kw: u.kw };
            });
            if (sec.shows) return sec.shows.map(function (s) {
                return { t: 's', id: s.s[0], name: s.name, s: s.s, img: { s: s.s[0] } };
            });
            if (sec.themes) return sec.themes.map(function (th) {
                return {
                    t: 'k', id: 'k_' + norm(th.name), name: th.name, kw: th.kw, covers: th.covers,
                    anime: !!(sec.anime || th.anime), media: th.media, company: th.company
                };
            });
            return (sec.c || []).map(function (id) { return { t: 'c', id: id, c: [id] }; });
        }

        // ------------------------------------------------------------------
        //  ОТКРЫТИЕ ЭКРАНОВ
        // ------------------------------------------------------------------

        function openEntry(entry, name) {
            Lampa.Activity.push({
                url: '',
                title: name || entry.name || 'Франшиза',
                component: entry.t === 'k' ? 'hzf_theme' : 'hzf_list',
                hzf_entry: entry,
                source: 'tmdb',
                page: 1
            });
        }

        function openHub() {
            Lampa.Activity.push({ url: '', title: 'Франшизы', component: 'hzf_hub', source: 'tmdb', page: 1 });
        }

        function openSearch() {
            Lampa.Input.edit({ title: 'Поиск франшизы', value: '', free: true, nosave: true }, function (value) {
                value = (value || '').trim();
                if (!value) { Lampa.Controller.toggle('content'); return; }
                Lampa.Activity.push({
                    url: '', title: 'Франшизы: ' + value, component: 'hzf_search',
                    hzf_query: value, source: 'tmdb', page: 1
                });
            });
        }

        function background(data) {
            try { Lampa.Background.change(Lampa.Utils.cardImgBackground(data)); } catch (e) {}
        }

        // Карточка-плитка франшизы (без меню закладок/отметок — это не фильм)
        function franchiseCard(entry, info, style) {
            var Mod = Lampa.Maker.module('Card');
            return {
                title: info.title,
                poster_path: info.poster_path,
                backdrop_path: info.backdrop_path,
                overview: info.overview,
                vote_average: info.vote_average,
                img: info.img,
                hzf_entry: entry,
                params: {
                    style: { name: style || 'collection' },
                    module: Mod.only('Card', 'Style', 'Release', 'Ratting', 'Callback'),
                    emit: {
                        onEnter: function () { openEntry(entry, info.name); },
                        onFocus: function (html, data) { background(data); }
                    }
                }
            };
        }

        var SEARCH_IMG = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 281"><rect width="500" height="281" fill="#1d1f24"/>' +
            '<circle cx="232" cy="128" r="54" fill="none" stroke="#fff" stroke-width="14"/>' +
            '<path d="M271 167l46 46" stroke="#fff" stroke-width="16" stroke-linecap="round"/></svg>');

        function searchCard() {
            var Mod = Lampa.Maker.module('Card');
            return {
                title: 'Найти франшизу в TMDB',
                img: SEARCH_IMG,
                params: {
                    style: { name: 'collection' },
                    module: Mod.only('Card', 'Style', 'Callback'),
                    emit: { onEnter: openSearch }
                }
            };
        }

        function movieCardParams(item) {
            item.params = {
                emit: {
                    onEnter: function () { Lampa.Router.call('full', item); },
                    onFocus: function (html, data) { background(data); }
                }
            };
            return item;
        }

        // ------------------------------------------------------------------
        //  КОМПОНЕНТ: хаб «Франшизы» (ряды по жанрам, подгрузка при скролле)
        // ------------------------------------------------------------------

        function HubComponent(object) {
            var comp = Lampa.Maker.make('Main', object);
            var pending = [];
            var alive = true;
            var used = {};   // занятые картинки — одна обложка не повторяется на двух плитках

            function loadSection(sec, cb) {
                sectionEntriesAsync(sec, function (entries) { if (alive) buildSection(sec, entries, cb); });
            }

            function buildSection(sec, entries, cb) {
                var left = entries.length, cards = new Array(entries.length);
                if (!left) return cb(null);
                entries.forEach(function (entry, i) {
                    loadEntryCard(entry, function (info) {
                        cards[i] = franchiseCard(entry, info, 'collection');
                        if (--left === 0) finish();
                    }, function () {
                        cards[i] = null;
                        if (--left === 0) finish();
                    }, used);
                });
                function finish() {
                    var res = cards.filter(Boolean);
                    cb(res.length ? { title: sec.title, results: res, total_pages: 1 } : null);
                }
            }

            // Берём следующие count непустых секций
            function loadNext(count, ok, fail) {
                var lines = [];
                (function step() {
                    if (!alive) return;
                    if (lines.length >= count || !pending.length) {
                        return lines.length ? ok(lines) : fail();
                    }
                    loadSection(pending.shift(), function (line) {
                        if (line) lines.push(line);
                        step();
                    });
                })();
            }

            comp.use({
                onCreate: function () {
                    var self = this;
                    var search = { title: 'Поиск', results: [searchCard()], total_pages: 1 };
                    loadCatalog(function (cat) {
                        if (!alive) return;
                        pending = visibleSections(cat);
                        loadNext(2, function (lines) {
                            if (alive) self.build([search].concat(lines));
                        }, function () {
                            if (alive) self.build([search]);
                        });
                    });
                },
                onNext: function (resolve, reject) {
                    loadNext(1, function (lines) { if (alive) resolve(lines); }, function () { if (alive) reject(); });
                },
                onDestroy: function () { alive = false; }
            });

            return comp;
        }

        // ------------------------------------------------------------------
        //  КОМПОНЕНТ: состав франшизы (сетка карточек фильмов/сериалов)
        // ------------------------------------------------------------------

        function ListComponent(object) {
            var comp = Lampa.Maker.make('Category', object);
            var alive = true;

            comp.use({
                onCreate: function () {
                    var self = this;
                    var entry = object.hzf_entry;
                    if (!entry) return self.empty();

                    loadEntryItems(entry, function (items) {
                        if (!alive) return;
                        if (!items.length) return self.empty();
                        self.build({ results: items.map(movieCardParams), total_pages: 1 });
                    }, function () {
                        if (alive) self.empty();
                    });
                },
                onNext: function (resolve, reject) { reject(); },
                onDestroy: function () { alive = false; }
            });

            return comp;
        }

        // ------------------------------------------------------------------
        //  КОМПОНЕНТ: поиск коллекций TMDB
        // ------------------------------------------------------------------

        function SearchComponent(object) {
            var comp = Lampa.Maker.make('Category', object);
            var alive = true;

            function load(page, ok, fail) {
                tmdb('search/collection?query=' + encodeURIComponent(object.hzf_query || '') + '&page=' + page, function (json) {
                    var res = (json.results || []).filter(function (r) { return r.poster_path || r.backdrop_path; }).map(function (r) {
                        var entry = { t: 'c', id: r.id, c: [r.id] };
                        var name = cleanName(r.name);
                        return franchiseCard(entry, {
                            name: name, title: name,
                            poster_path: r.poster_path, backdrop_path: r.backdrop_path, overview: r.overview
                        }, 'default');
                    });
                    ok({ results: res, total_pages: json.total_pages || 1 });
                }, fail);
            }

            comp.use({
                onCreate: function () {
                    var self = this;
                    load(1, function (data) {
                        if (!alive) return;
                        if (!data.results.length) return self.empty();
                        self.build(data);
                    }, function () { if (alive) self.empty(); });
                },
                onNext: function (resolve, reject) {
                    load(object.page, function (data) { if (alive) resolve(data); }, function () { if (alive) reject(); });
                },
                onDestroy: function () { alive = false; }
            });

            return comp;
        }

        // ------------------------------------------------------------------
        //  КОМПОНЕНТ: тематическая подборка (ключевые слова TMDB, с подгрузкой)
        // ------------------------------------------------------------------

        function ThemeComponent(object) {
            var comp = Lampa.Maker.make('Category', object);
            var alive = true;
            var entry = object.hzf_entry || {};

            comp.use({
                onCreate: function () {
                    var self = this;
                    loadThemePage(entry, 1, function (data) {
                        if (!alive) return;
                        data.results = data.results.map(movieCardParams);
                        self.build(data);
                    }, function () { if (alive) self.empty(); });
                },
                // Category сам увеличивает object.page и зовёт next, пока page < total_pages
                onNext: function (resolve, reject) {
                    loadThemePage(entry, object.page, function (data) {
                        if (!alive) return;
                        data.results = data.results.map(movieCardParams);
                        resolve(data);
                    }, function () { if (alive) reject(); });
                },
                onDestroy: function () { alive = false; }
            });

            return comp;
        }

        // ------------------------------------------------------------------
        //  МЕНЮ И НАСТРОЙКИ
        // ------------------------------------------------------------------

        function addMenu() {
            if (!field('hzf_menu', true)) return;
            if ($('.menu__item[data-action="hzf"]').length) return;

            var item = $('<li class="menu__item selector" data-action="hzf">' +
                '<div class="menu__ico">' + ICON + '</div>' +
                '<div class="menu__text">Франшизы</div></li>');
            item.on('hover:enter', openHub);

            // Ставим сразу после «Коллекций»/«Фильмов», если они есть; иначе в конец
            var list = $('.menu .menu__list').eq(0);
            var after = list.find('[data-action="collections"]');
            if (!after.length) after = list.find('[data-action="movie"]');
            if (after.length) after.eq(0).after(item);
            else list.append(item);
        }

        // ------------------------------------------------------------------
        //  РЕДАКТОР: действия из настроек
        //  prev — контроллер экрана настроек, в который возвращаем фокус после
        //  любого Select/Input (иначе пульт «теряется»).
        // ------------------------------------------------------------------

        function back(prev) { Lampa.Controller.toggle(prev); }

        function editRows(prev) {
            loadCatalog(function (cat) {
                var hidden = hiddenRows();
                Lampa.Select.show({
                    title: 'Ряды на экране «Франшизы»',
                    items: allSections(cat).map(function (s) {
                        return { title: s.title, key: s.title, checkbox: true, checked: hidden.indexOf(s.title) < 0 };
                    }),
                    onCheck: function (item) {
                        var h = hiddenRows(), i = h.indexOf(item.key);
                        if (i >= 0) h.splice(i, 1); else h.push(item.key);
                        Lampa.Storage.set('hzf_hidden', h);
                        item.checked = h.indexOf(item.key) < 0;
                    },
                    onBack: function () { back(prev); }
                });
            });
        }

        function addFranchise(prev) {
            Lampa.Input.edit({ title: 'Название франшизы (лучше по-английски)', value: '', free: true, nosave: true }, function (q) {
                q = (q || '').trim();
                if (!q) return back(prev);
                tmdb('search/collection?query=' + encodeURIComponent(q) + '&page=1', function (json) {
                    var res = json.results || [];
                    if (!res.length) { Lampa.Noty.show('В TMDB ничего не найдено'); return back(prev); }
                    Lampa.Select.show({
                        title: 'Выберите франшизу',
                        items: res.slice(0, 30).map(function (r) { return { title: cleanName(r.name), id: r.id }; }),
                        onSelect: function (a) {
                            var u = userData();
                            if (u.c.some(function (x) { return x.id === a.id; })) Lampa.Noty.show('Уже есть в «' + USER_TITLE + '»');
                            else {
                                u.c.push({ id: a.id, name: a.title });
                                saveUser(u);
                                Lampa.Noty.show('Добавлено в «' + USER_TITLE + '»');
                            }
                            back(prev);
                        },
                        onBack: function () { back(prev); }
                    });
                }, function () { Lampa.Noty.show('TMDB не ответил'); back(prev); });
            });
        }

        function addTheme(prev) {
            Lampa.Input.edit({ title: 'Название подборки', value: '', free: true, nosave: true }, function (name) {
                name = (name || '').trim();
                if (!name) return back(prev);
                Lampa.Input.edit({ title: 'Ключевые слова TMDB через запятую (англ.)', value: '', free: true, nosave: true }, function (raw) {
                    var kw = (raw || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
                        .map(function (s) { return /^\d+$/.test(s) ? parseInt(s, 10) : s; });
                    if (!kw.length) return back(prev);
                    resolveKeywords(kw, function (ids) {
                        if (!ids.length) {
                            Lampa.Noty.show('Ни одно ключевое слово не найдено в TMDB');
                            return back(prev);
                        }
                        var u = userData();
                        u.themes = u.themes.filter(function (t) { return t.name !== name; });
                        u.themes.push({ name: name, kw: kw });
                        saveUser(u);
                        Lampa.Noty.show('Подборка «' + name + '» добавлена, найдено слов: ' + ids.length + ' из ' + kw.length);
                        back(prev);
                    });
                });
            });
        }

        function manageUser(prev) {
            var u = userData();
            var items = u.c.map(function (x) { return { title: x.name || ('Коллекция ' + x.id), kind: 'c', id: x.id }; })
                .concat(u.themes.map(function (t) { return { title: t.name, subtitle: [].concat(t.kw).join(', '), kind: 't', id: t.name }; }));
            if (!items.length) { Lampa.Noty.show('Личных подборок пока нет'); return; }

            Lampa.Select.show({
                title: USER_TITLE,
                items: items,
                onSelect: function (a) {
                    Lampa.Select.show({
                        title: a.title,
                        items: [{ title: 'Удалить', del: true }, { title: 'Отмена' }],
                        onSelect: function (b) {
                            if (b.del) {
                                var d = userData();
                                if (a.kind === 'c') d.c = d.c.filter(function (x) { return x.id !== a.id; });
                                else d.themes = d.themes.filter(function (t) { return t.name !== a.id; });
                                saveUser(d);
                                Lampa.Noty.show('Удалено');
                            }
                            back(prev);
                        },
                        onBack: function () { back(prev); }
                    });
                },
                onBack: function () { back(prev); }
            });
        }

        function catalogStatus() {
            catalog = null;   // перечитать файл прямо сейчас
            loadCatalog(function () { Lampa.Noty.show('Каталог: ' + catalogInfo); });
        }

        function addButton(name, title, descr, fn) {
            Lampa.SettingsApi.addParam({
                component: SETTINGS,
                param: { name: name, type: 'button' },
                field: { name: title, description: descr },
                onChange: function () { fn(Lampa.Controller.enabled().name); }
            });
        }

        function addSettingsParams() {
            Lampa.SettingsApi.addParam({ component: SETTINGS, param: { name: 'hzf_head', type: 'title' }, field: { name: 'Франшизы и тематические подборки' } });

            Lampa.SettingsApi.addParam({
                component: SETTINGS,
                param: { name: 'hzf_order', type: 'select', values: { asc: 'По хронологии', desc: 'Сначала новые', rating: 'По рейтингу' }, 'default': 'asc' },
                field: { name: 'Порядок внутри франшизы', description: 'Как сортировать фильмы и сериалы на странице франшизы' }
            });

            Lampa.SettingsApi.addParam({
                component: SETTINGS,
                param: { name: 'hzf_hide_future', type: 'trigger', 'default': false },
                field: { name: 'Скрывать анонсы', description: 'Не показывать ещё не вышедшие части' }
            });

            Lampa.SettingsApi.addParam({
                component: SETTINGS,
                param: { name: 'hzf_menu', type: 'trigger', 'default': true },
                field: { name: 'Пункт в меню', description: 'Показывать «Франшизы» в боковом меню (после перезапуска)' }
            });

            Lampa.SettingsApi.addParam({ component: SETTINGS, param: { name: 'hzf_title_edit', type: 'title' }, field: { name: 'Редактор подборок' } });
            addButton('hzf_rows', 'Какие ряды показывать', 'Скрыть или вернуть ряды на экране «Франшизы»', editRows);
            addButton('hzf_add_c', 'Добавить франшизу', 'Найти киносерию в TMDB и добавить в «' + USER_TITLE + '»', addFranchise);
            addButton('hzf_add_t', 'Добавить свою подборку', 'По ключевым словам TMDB: например «heist, bank robbery»', addTheme);
            addButton('hzf_manage', 'Мои подборки', 'Посмотреть и удалить добавленное', manageUser);
            addButton('hzf_status', 'Обновить каталог', 'Перечитать franchises.json с сервера и показать версию', function () { catalogStatus(); });
        }

        // ------------------------------------------------------------------
        //  СТАРТ
        // ------------------------------------------------------------------


        return {
            start: function () {
                if (!Lampa.Maker || !Lampa.Maker.make || !Lampa.TMDB) {
                    console.log('HZF', 'Lampa.Maker недоступен — версия Lampa слишком старая');
                    return false;
                }
                Lampa.Component.add('hzf_hub', HubComponent);
                Lampa.Component.add('hzf_list', ListComponent);
                Lampa.Component.add('hzf_search', SearchComponent);
                Lampa.Component.add('hzf_theme', ThemeComponent);
                addMenu();
                return true;
            },
            settings: addSettingsParams
        };
    })();

    // ==================================================================
    //  СТАРТ
    //  Каждый модуль в своём try/catch: ошибка в одном не роняет другой.
    // ==================================================================

    function start() {
        var withSettings = [];

        try {
            if (Streaming) { Streaming.start(); withSettings.push(Streaming); }
        } catch (e) { console.log('Podborki', 'streaming init error', e && e.message); }

        try {
            if (Franchises && Franchises.start()) withSettings.push(Franchises);
        } catch (e) { console.log('HZF', 'init error', e && e.message); }

        if (!withSettings.length) return;
        try {
            Lampa.SettingsApi.addComponent({ component: SETTINGS, name: 'Подборки', icon: SETTINGS_ICON });
            withSettings.forEach(function (m) {
                try { m.settings(); } catch (e) { console.log('Podborki', 'settings error', e && e.message); }
            });
        } catch (e) { console.log('Podborki', 'settings error', e && e.message); }
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
