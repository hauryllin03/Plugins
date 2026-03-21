
(function () {
    'use strict';

    if (window.plugin_domashniy_ready) return;
    window.plugin_domashniy_ready = true;

    var API_TOKEN = '9b8d0eb9-f6d3-46ba-9f38-2a43ba68f18f';
    var API_BASE = 'https://api.kinopoisk.dev/v1.4/movie';
    var NETWORK_NAME = 'Домашний';

    var allSortOptions = [
        { id: 'year', title: 'dm_sort_new', sortType: '-1' },
        { id: 'rating.kp', title: 'dm_sort_rating', sortType: '-1' },
        { id: 'votes.kp', title: 'dm_sort_votes', sortType: '-1' },
        { id: 'rating.imdb', title: 'dm_sort_imdb', sortType: '-1' }
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

        var url = API_BASE + '?page=' + (page || 1) + '&limit=20';
        url += '&networks.items.name=' + encodeURIComponent(NETWORK_NAME);
        url += '&sortField=' + sort.id;
        url += '&sortType=' + sort.sortType;
        url += '&poster.url=!null';
        url += '&year=' + yearFrom + '-' + yearTo;

        if (sort.id === 'rating.kp' || sort.id === 'rating.imdb') {
            url += '&votes.kp=50-5000000';
        }

        return url;
    }

    function kpToLampaCard(item) {
        return {
            id: item.id,
            source: 'kp',
            title: item.name || item.alternativeName || '',
            original_title: item.alternativeName || item.enName || '',
            overview: item.description || item.shortDescription || '',
            poster_path: item.poster ? item.poster.previewUrl || item.poster.url || '' : '',
            backdrop_path: item.backdrop ? item.backdrop.url || '' : '',
            vote_average: item.rating ? item.rating.kp || 0 : 0,
            vote_count: item.votes ? item.votes.kp || 0 : 0,
            release_date: item.year ? item.year + '' : '',
            first_air_date: item.year ? item.year + '' : '',
            genre_ids: (item.genres || []).map(function (g) { return g.name; }),
            name: item.name || '',
            original_name: item.alternativeName || item.enName || '',
            media_type: item.isSeries ? 'tv' : 'movie',
            img: item.poster ? item.poster.previewUrl || item.poster.url || '' : '',
            year: item.year,
            number_of_seasons: item.seasonsInfo ? item.seasonsInfo.length : 0,
            kinopoisk_id: item.id
        };
    }

    function makeRow(sort) {
        return function (callback) {
            var url = buildApiUrl(sort);

            $.ajax({
                url: url,
                headers: { 'X-API-KEY': API_TOKEN },
                success: function (data) {
                    if (!data || !data.docs || !data.docs.length) return callback({ results: [] });

                    var results = data.docs.map(kpToLampaCard);
                    var t = Lampa.Lang.translate(sort.title) + ' — ' + NETWORK_NAME;
                    registerTitle(t);

                    callback({
                        results: results,
                        title: t,
                        nomore: true
                    });
                },
                error: function () { callback({ results: [] }); }
            });
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

    function start() { addLang(); startObserver(); registerContentRows(); addSettings(); }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
