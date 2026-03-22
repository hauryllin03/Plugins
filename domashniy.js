
(function () {
    'use strict';

    if (window.plugin_domashniy_ready) return;
    window.plugin_domashniy_ready = true;

    var API_TOKEN = '893c2bd3-ce87-4d94-8d02-5fb59de15214';
    var API_BASE = 'https://kinopoiskapiunofficial.tech/';
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

    function buildApiUrl(sort, page) {
        var now = new Date();
        var yearTo = now.getFullYear();
        var yearFrom = yearTo - 3;

        var url = API_BASE + 'api/v2.2/films?';
        url += 'order=' + sort.id;
        url += '&type=ALL';
        url += '&yearFrom=' + yearFrom;
        url += '&yearTo=' + yearTo;
        url += '&keyword=' + encodeURIComponent(NETWORK_NAME);
        url += '&page=' + (page || 1);

        return url;
    }

    // Ищем TMDB id по названию фильма, чтобы карточка открывалась
    function findTmdbId(title, year, mediaType, callback) {
        var type = mediaType === 'tv' ? 'tv' : 'movie';
        var searchUrl = Lampa.TMDB.api('search/' + type + '?query=' + encodeURIComponent(title) + '&language=ru&page=1' + (year ? '&year=' + year : ''));

        var network = new Lampa.Reguest();
        network.timeout(10000);
        network.silent(searchUrl, function (data) {
            if (data && data.results && data.results.length) {
                // Пробуем найти точное совпадение по году
                var match = null;
                if (year) {
                    match = data.results.find(function (r) {
                        var rYear = (r.release_date || r.first_air_date || '').slice(0, 4);
                        return rYear === (year + '');
                    });
                }
                callback(match || data.results[0]);
            } else if (type === 'tv') {
                // Если не нашли как сериал, пробуем как фильм
                var searchUrl2 = Lampa.TMDB.api('search/movie?query=' + encodeURIComponent(title) + '&language=ru&page=1' + (year ? '&year=' + year : ''));
                network.silent(searchUrl2, function (data2) {
                    if (data2 && data2.results && data2.results.length) {
                        callback(data2.results[0]);
                    } else {
                        callback(null);
                    }
                }, function () { callback(null); });
            } else {
                // Если не нашли как фильм, пробуем как сериал
                var searchUrl3 = Lampa.TMDB.api('search/tv?query=' + encodeURIComponent(title) + '&language=ru&page=1' + (year ? '&first_air_date_year=' + year : ''));
                network.silent(searchUrl3, function (data3) {
                    if (data3 && data3.results && data3.results.length) {
                        var r = data3.results[0];
                        r.media_type = 'tv';
                        callback(r);
                    } else {
                        callback(null);
                    }
                }, function () { callback(null); });
            }
        }, function () { callback(null); });
    }

    function kpToLampaCard(item) {
        var id = item.kinopoiskId || item.filmId || item.id;
        var title = item.nameRu || item.nameOriginal || item.nameEn || '';
        var orig = item.nameOriginal || item.nameEn || '';
        var year = item.year || '';
        var posterUrl = item.posterUrlPreview || item.posterUrl || '';
        var rating = item.ratingKinopoisk || item.rating || 0;
        var votes = item.ratingKinopoiskVoteCount || 0;
        var isSeries = (item.type === 'TV_SERIES' || item.type === 'MINI_SERIES' || item.type === 'TV_SHOW');

        return {
            id: id,
            source: 'kp',
            title: title,
            original_title: orig,
            overview: item.description || item.shortDescription || '',
            // Постеры — полные URL напрямую с КП, не через TMDB прокси
            poster_path: posterUrl,
            backdrop_path: item.coverUrl || '',
            vote_average: typeof rating === 'string' ? parseFloat(rating) || 0 : rating || 0,
            vote_count: votes,
            release_date: year + '',
            first_air_date: year + '',
            genre_ids: (item.genres || []).map(function (g) { return g.genre || g.name || ''; }),
            name: title,
            original_name: orig,
            media_type: isSeries ? 'tv' : 'movie',
            // img — полный URL, Lampa покажет его напрямую
            img: posterUrl,
            year: year,
            number_of_seasons: 0,
            kinopoisk_id: id,
            // Помечаем как КП-карточку для перехвата
            dm_source: true
        };
    }

    function kpRequest(url, onSuccess, onError) {
        var network = new Lampa.Reguest();
        network.timeout(15000);
        network.silent(url, function (json) {
            if (json) onSuccess(json);
            else onError();
        }, function (a, c) {
            onError();
        }, false, {
            headers: {
                'X-API-KEY': API_TOKEN
            }
        });
    }

    function makeRow(sort) {
        return function (callback) {
            var url = buildApiUrl(sort);

            kpRequest(url, function (data) {
                var items = data.items || data.films || [];
                if (!items.length) return callback({ results: [] });

                var results = items.map(kpToLampaCard);
                var t = Lampa.Lang.translate(sort.title) + ' — ' + NETWORK_NAME;
                registerTitle(t);

                callback({
                    results: results,
                    title: t,
                    nomore: true
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

    // Перехватываем клик по карточке — ищем в TMDB и открываем правильно
    function interceptCardClick() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start') {
                var card = e.data && e.data.movie;
                if (!card || !card.dm_source) return;

                // Останавливаем загрузку — будем искать в TMDB
                e.preventDefault && e.preventDefault();
            }
        });

        // Перехватываем открытие карточки
        var originalActivity = Lampa.Activity.push;
        Lampa.Activity.push = function (obj) {
            var card = obj && obj.movie;
            if (card && card.dm_source && card.source === 'kp') {
                // Ищем в TMDB по названию
                Lampa.Noty.show('Ищем в TMDB: ' + card.title);

                findTmdbId(card.title, card.year, card.media_type, function (tmdbItem) {
                    if (tmdbItem) {
                        // Подменяем данные на TMDB
                        var newCard = Object.assign({}, tmdbItem);
                        newCard.source = 'tmdb';
                        newCard.media_type = tmdbItem.media_type || card.media_type;
                        if (!newCard.title) newCard.title = tmdbItem.name || card.title;
                        if (!newCard.original_title) newCard.original_title = tmdbItem.original_name || card.original_title;
                        delete newCard.dm_source;

                        obj.movie = newCard;
                        obj.id = newCard.id;
                        originalActivity.call(Lampa.Activity, obj);
                    } else {
                        Lampa.Noty.show('Не найдено в TMDB');
                        // Открываем как есть — пусть Lampa попробует
                        delete card.dm_source;
                        originalActivity.call(Lampa.Activity, obj);
                    }
                });

                return;
            }

            originalActivity.call(Lampa.Activity, obj);
        };
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
        interceptCardClick();
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
