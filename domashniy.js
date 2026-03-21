(function () {
    'use strict';

    if (window.plugin_domashniy_ready) return;
    window.plugin_domashniy_ready = true;

    var NETWORK_ID = 1325;
    var NETWORK_TITLE = 'Домашний';

    var allSortOptions = [
        { id: 'vote_count.desc', title: 'dm_sort_votes' },
        { id: 'vote_average.desc', title: 'dm_sort_rating' },
        { id: 'first_air_date.desc', title: 'dm_sort_new' },
        { id: 'popularity.desc', title: 'dm_sort_popular' }
    ];

    var logoPending = {};
    var LOGO_STORAGE_KEY = 'dm_logo_cache';
    var logoCache = Lampa.Storage.get(LOGO_STORAGE_KEY) || {};

    function saveLogoCache() {
        Lampa.Storage.set(LOGO_STORAGE_KEY, logoCache);
    }

    function getLogoUrl(callback) {
        if (logoCache.hasOwnProperty(NETWORK_ID) && logoCache[NETWORK_ID]) return callback(logoCache[NETWORK_ID]);
        if (logoPending[NETWORK_ID]) { logoPending[NETWORK_ID].push(callback); return; }
        logoPending[NETWORK_ID] = [callback];

        var apiUrl = Lampa.TMDB.api('network/' + NETWORK_ID + '?api_key=' + Lampa.TMDB.key());
        Lampa.Network.silent(apiUrl, function (data) {
            var url = data && data.logo_path ? Lampa.TMDB.image('t/p/w154' + data.logo_path) : '';
            logoCache[NETWORK_ID] = url;
            saveLogoCache();
            var cbs = logoPending[NETWORK_ID] || [];
            delete logoPending[NETWORK_ID];
            cbs.forEach(function (cb) { cb(url); });
        }, function () {
            var cbs = logoPending[NETWORK_ID] || [];
            delete logoPending[NETWORK_ID];
            cbs.forEach(function (cb) { cb(''); });
        }, false, { cache: { life: 60 * 24 * 7 } });
    }

    var SETTINGS_KEY = 'domashniy_settings';

    function getSettings() {
        return Lampa.Storage.get(SETTINGS_KEY) || {};
    }

    function getSetting(key, def) {
        var s = getSettings();
        return s.hasOwnProperty(key) ? s[key] : def;
    }

    function setSetting(key, value) {
        var s = getSettings();
        s[key] = value;
        Lampa.Storage.set(SETTINGS_KEY, s);
    }

    var BASE_KW = '346488,158718,41278,13141,345822,315535,290667,323477,290609';

    function buildParams(sort) {
        var p = '&sort_by=' + sort.id;
        if (sort.id === 'first_air_date.desc') {
            var e = new Date(); e.setDate(e.getDate() - 10);
            var s = new Date(); s.setFullYear(s.getFullYear() - 3);
            p += '&first_air_date.gte=' + s.toISOString().split('T')[0];
            p += '&first_air_date.lte=' + e.toISOString().split('T')[0];
        }
        p += '&without_keywords=' + encodeURIComponent(BASE_KW);
        return p;
    }

    function getEnabledSorts() {
        var r = allSortOptions.filter(function (s) { return getSetting('sort_' + s.id, true); });
        return r.length ? r : allSortOptions;
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
        var sorts = getEnabledSorts();
        currentRenderList = shuffle(sorts.slice());
        renderTimestamp = now;
        return currentRenderList;
    }

    var titleRegistry = {};

    function registerTitle(titleText) {
        titleRegistry[titleText] = true;
    }

    function createIconWrap() {
        var url = logoCache[NETWORK_ID];
        var wrap = $('<span>').css({
            display: 'inline-flex', 'align-items': 'center', 'justify-content': 'center',
            width: '1.9em', height: '1.9em',
            'background-color': 'rgba(255,255,255,0.35)',
            'border-radius': '0.35em', 'margin-right': '0.45em', 'flex-shrink': '0'
        });
        if (url) {
            wrap.append($('<img>').attr('src', url).css({
                width: '1.45em', height: '1.45em', 'object-fit': 'contain', display: 'block'
            }));
        } else {
            wrap.append($('<span>').text('ДМ').css({
                color: '#fff', 'font-size': '0.5em', 'font-weight': '700'
            }));
        }
        return wrap;
    }

    function processAllTitles() {
        $('.items-line__title').each(function () {
            var el = $(this);
            if (el.data('dm-icon')) return;
            var text = el.text().trim();
            if (!titleRegistry[text]) return;
            el.data('dm-icon', true);
            el.css({ display: 'flex', 'align-items': 'center' });
            el.prepend(createIconWrap());
        });
    }

    var observerStarted = false;

    function startObserver() {
        if (observerStarted) return;
        observerStarted = true;
        setInterval(processAllTitles, 500);
    }

    function makeRow(sort) {
        var baseParams = buildParams(sort);
        var discoverPath = 'discover/tv?with_networks=' + NETWORK_ID + baseParams;

        return function (callback) {
            var tmdbUrl = Lampa.TMDB.api(discoverPath + '&api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language', 'ru'));
            var net = new Lampa.Reguest();

            net.silent(tmdbUrl, function (json) {
                if (!json || !Array.isArray(json.results)) return callback({ results: [] });
                json.results.forEach(function (item) { if (!item.source) item.source = 'tmdb'; });
                var t = Lampa.Lang.translate(sort.title) + ' — ' + NETWORK_TITLE;
                json.title = t;
                json.url = discoverPath;
                json.source = 'tmdb';
                json.nomore = false;
                registerTitle(t);
                callback(json);
            }, function () { callback({ results: [] }); });
        };
    }

    var MAX_ROWS = 4;

    function registerContentRows() {
        for (var i = 0; i < MAX_ROWS; i++) {
            (function (idx) {
                Lampa.ContentRows.add({
                    index: 3 + idx * 2,
                    name: 'dm_row_' + idx,
                    title: '',
                    screen: ['main'],
                    call: function () {
                        var list = getCurrentRenderList();
                        if (idx >= list.length) return function (cb) { cb({ results: [] }); };
                        return makeRow(list[idx]);
                    }
                });
            })(i);
        }
    }

    function addLang() {
        Lampa.Lang.add({
            dm_plugin_title: { ru: 'Домашний', en: 'Domashniy', uk: 'Домашній' },
            dm_sort_votes: { ru: 'Много голосов', en: 'Most Votes', uk: 'Багато голосів' },
            dm_sort_rating: { ru: 'Высокий рейтинг', en: 'Top Rated', uk: 'Високий рейтинг' },
            dm_sort_new: { ru: 'Новинки', en: 'New', uk: 'Новинки' },
            dm_sort_popular: { ru: 'Популярные', en: 'Popular', uk: 'Популярні' },
            dm_sort_title: { ru: 'Виды сортировки', en: 'Sorting types', uk: 'Типи сортування' },
            dm_sort_description: { ru: 'Выбор сортировки подборок', en: 'Choose sorting', uk: 'Вибір сортування' }
        });
    }

    function addSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'domashniy',
            name: Lampa.Lang.translate('dm_plugin_title'),
            icon: '<svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6C3 4.89543 3.89543 4 5 4H9.38197C9.76074 4 10.107 4.214 10.2764 4.55279L10.7236 5.44721C10.893 5.786 11.2393 6 11.618 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" stroke="white" stroke-width="1.8"/><path d="M1 8C1 6.89543 1.89543 6 3 6H7.38197C7.76074 6 8.107 6.214 8.2764 6.55279L8.7236 7.44721C8.893 7.786 9.23926 8 9.61803 8H17C18.1046 8 19 8.89543 19 10V20C19 21.1046 18.1046 22 17 22H3C1.89543 22 1 21.1046 1 20V8Z" fill="white" fill-opacity="0.3" stroke="white" stroke-width="1.5"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'domashniy', param: { name: 'dm_sort', type: 'button' },
            field: { name: Lampa.Lang.translate('dm_sort_title'), description: Lampa.Lang.translate('dm_sort_description') },
            onChange: function () {
                var p = Lampa.Controller.enabled().name;
                Lampa.Select.show({
                    title: Lampa.Lang.translate('dm_sort_title'),
                    items: allSortOptions.map(function (s) { return { title: Lampa.Lang.translate(s.title), id: s.id, checkbox: true, checked: getSetting('sort_' + s.id, true) }; }),
                    onBack: function () { Lampa.Controller.toggle(p); },
                    onCheck: function (i) { setSetting('sort_' + i.id, !getSetting('sort_' + i.id, true)); i.checked = getSetting('sort_' + i.id, true); }
                });
            }
        });
    }

    function start() { addLang(); getLogoUrl(function () {}); startObserver(); registerContentRows(); addSettings(); }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
