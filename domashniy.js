
(function () {
    'use strict';

    if (window.plugin_domashniy_ready) return;
    window.plugin_domashniy_ready = true;

    var KP_TOKEN = '893c2bd3-ce87-4d94-8d02-5fb59de15214';
    var KP_BASE = 'https://kinopoiskapiunofficial.tech/';
    var NETWORK_NAME = 'Домашний';

    var allSortOptions = [
        { id: 'YEAR', title: 'dm_sort_new' },
        { id: 'RATING', title: 'dm_sort_rating' },
        { id: 'NUM_VOTE', title: 'dm_sort_votes' }
    ];

    var SETTINGS_KEY = 'domashniy_settings';
    function getSettings() { return Lampa.Storage.get(SETTINGS_KEY) || {}; }
    function getSetting(key, def) { var s = getSettings(); return s.hasOwnProperty(key) ? s[key] : def; }
    function setSetting(key, value) { var s = getSettings(); s[key] = value; Lampa.Storage.set(SETTINGS_KEY, s); }

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
        currentRenderList = shuffle(getEnabledSorts());
        renderTimestamp = now;
        return currentRenderList;
    }

    var titleRegistry = {};
    function registerTitle(titleText) { titleRegistry[titleText] = true; }

    function createIconWrap() {
        var wrap = $('<span>').css({
            display: 'inline-flex', 'align-items': 'center', 'justify-content': 'center',
            width: '1.9em', height: '1.9em',
            'background-color': 'rgba(255,255,255,0.35)',
            'border-radius': '0.35em', 'margin-right': '0.45em', 'flex-shrink': '0'
        });
        wrap.append($('<span>').text('ДМ').css({
            color: '#fff', 'font-size': '0.5em', 'font-weight': '700'
        }));
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

    // Получаем TMDB api_key из Lampa
    function getTmdbKey() {
        try {
            // Lampa хранит ключ в разных местах в зависимости от версии
            if (Lampa.TMDB.key) return Lampa.TMDB.key;
            if (Lampa.Manifest && Lampa.Manifest.tmdb_key) return Lampa.Manifest.tmdb_key;
            // Пробуем извлечь из существующего API-вызова
            var testUrl = Lampa.TMDB.api('');
            var match = testUrl.match(/api_key=([^&]+)/);
            if (match) return match[1];
        } catch(e) {}
        return '4ef0d7355d9ffb5151e987764708ce96'; // публичный TMDB ключ
    }

    // Формируем TMDB URL с гарантированным api_key
    function tmdbSearchUrl(path) {
        var url = Lampa.TMDB.api(path);
        // Проверяем есть ли api_key в URL
        if (url.indexOf('api_key=') === -1) {
            var sep = url.indexOf('?') !== -1 ? '&' : '?';
            url += sep + 'api_key=' + getTmdbKey();
        }
        return url;
    }

    function buildKpUrl(sort, page) {
        var now = new Date();
        var yearTo = now.getFullYear();
        var yearFrom = yearTo - 3;

        var url = KP_BASE + 'api/v2.2/films?';
        url += 'order=' + sort.id;
        url += '&type=ALL';
        url += '&yearFrom=' + yearFrom;
        url += '&yearTo=' + yearTo;
        url += '&keyword=' + encodeURIComponent(NETWORK_NAME);
        url += '&page=' + (page || 1);

        return url;
    }

    function kpRequest(url, onSuccess, onError) {
        var network = new Lampa.Reguest();
        network.timeout(15000);
        network.silent(url, function (json) {
            if (json) onSuccess(json);
            else onError();
        }, function () {
            onError();
        }, false, {
            headers: { 'X-API-KEY': KP_TOKEN }
        });
    }

    // Ищем фильм/сериал в TMDB
    function searchTmdb(title, origTitle, year, isSeries, callback) {
        var type = isSeries ? 'tv' : 'movie';
        var query = origTitle || title;
        var yearParam = year ? (isSeries ? '&first_air_date_year=' + year : '&year=' + year) : '';

        var url = tmdbSearchUrl('search/' + type + '?query=' + encodeURIComponent(query) + '&language=ru&page=1' + yearParam);

        var network = new Lampa.Reguest();
        network.timeout(8000);
        network.silent(url, function (data) {
            if (data && data.results && data.results.length) {
                var item = data.results[0];
                if (year) {
                    for (var i = 0; i < data.results.length; i++) {
                        var r = data.results[i];
                        var rYear = (r.release_date || r.first_air_date || '').slice(0, 4);
                        if (rYear === (year + '')) { item = r; break; }
                    }
                }
                item.media_type = type;
                callback(item);
            } else if (query === origTitle && title && title !== origTitle) {
                // Пробуем по русскому названию
                var url2 = tmdbSearchUrl('search/' + type + '?query=' + encodeURIComponent(title) + '&language=ru&page=1' + yearParam);
                network.silent(url2, function (data2) {
                    if (data2 && data2.results && data2.results.length) {
                        data2.results[0].media_type = type;
                        callback(data2.results[0]);
                    } else {
                        tryOtherType(title, year, isSeries, callback);
                    }
                }, function () { callback(null); });
            } else {
                tryOtherType(title, year, isSeries, callback);
            }
        }, function () { callback(null); });
    }

    function tryOtherType(title, year, wasSeries, callback) {
        var type = wasSeries ? 'movie' : 'tv';
        var yearParam = year ? (wasSeries ? '&year=' + year : '&first_air_date_year=' + year) : '';
        var url = tmdbSearchUrl('search/' + type + '?query=' + encodeURIComponent(title) + '&language=ru&page=1' + yearParam);

        var network = new Lampa.Reguest();
        network.timeout(8000);
        network.silent(url, function (data) {
            if (data && data.results && data.results.length) {
                data.results[0].media_type = type;
                callback(data.results[0]);
            } else {
                callback(null);
            }
        }, function () { callback(null); });
    }

    function tmdbToLampaCard(tmdb, kpRating) {
        var isTV = tmdb.media_type === 'tv';
        return {
            id: tmdb.id,
            source: 'tmdb',
            title: tmdb.title || tmdb.name || '',
            original_title: tmdb.original_title || tmdb.original_name || '',
            overview: tmdb.overview || '',
            poster_path: tmdb.poster_path || '',
            backdrop_path: tmdb.backdrop_path || '',
            vote_average: kpRating || tmdb.vote_average || 0,
            vote_count: tmdb.vote_count || 0,
            release_date: tmdb.release_date || '',
            first_air_date: tmdb.first_air_date || '',
            genre_ids: tmdb.genre_ids || [],
            name: tmdb.name || tmdb.title || '',
            original_name: tmdb.original_name || tmdb.original_title || '',
            media_type: isTV ? 'tv' : 'movie'
        };
    }

    function makeRow(sort) {
        return function (callback) {
            var url = buildKpUrl(sort);

            kpRequest(url, function (data) {
                var kpItems = data.items || data.films || [];
                if (!kpItems.length) return callback({ results: [] });

                var results = [];
                var pending = kpItems.length;

                kpItems.forEach(function (kpItem) {
                    var title = kpItem.nameRu || kpItem.nameOriginal || kpItem.nameEn || '';
                    var orig = kpItem.nameOriginal || kpItem.nameEn || '';
                    var year = kpItem.year || '';
                    var isSeries = (kpItem.type === 'TV_SERIES' || kpItem.type === 'MINI_SERIES' || kpItem.type === 'TV_SHOW');
                    var kpRating = kpItem.ratingKinopoisk || 0;

                    searchTmdb(title, orig, year, isSeries, function (tmdbItem) {
                        if (tmdbItem) {
                            results.push(tmdbToLampaCard(tmdbItem, kpRating));
                        }
                        pending--;
                        if (pending <= 0) {
                            var t = Lampa.Lang.translate(sort.title) + ' — ' + NETWORK_NAME;
                            registerTitle(t);

                            callback({
                                results: results,
                                title: t,
                                nomore: true
                            });
                        }
                    });
                });
            }, function () { callback({ results: [] }); });
        };
    }

    var MAX_ROWS = 3;

    function registerContentRows() {
        for (var i = 0; i < MAX_ROWS; i++) {
            (function (idx) {
                Lampa.ContentRows.add({
                    index: 3 + idx * 2,
                    name: 'dm_row_' + idx,
                    title: NETWORK_NAME,
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
            dm_sort_rating: { ru: 'Рейтинг КП', en: 'KP Rating', uk: 'Рейтинг КП' },
            dm_sort_new: { ru: 'Новинки', en: 'New', uk: 'Новинки' },
            dm_sort_imdb: { ru: 'Рейтинг IMDb', en: 'IMDb Rating', uk: 'Рейтинг IMDb' },
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

    function start() {
        addLang();
        startObserver();
        registerContentRows();
        addSettings();
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
