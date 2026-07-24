
(function () {
    'use strict';

    var COMPONENT_NAME = 'continue_movies';
    var PAGE_SIZE = 40;

    function getContinueMovies() {
        var result = Lampa.Favorite.get({ type: 'history' });
        var viewed = Lampa.Favorite.get({ type: 'viewed' });
        var thrown = Lampa.Favorite.get({ type: 'thrown' });

        result = result.filter(function (e) {
            return !viewed.find(function (v) { return v.id == e.id; }) &&
                   !thrown.find(function (t) { return t.id == e.id; });
        });

        result = result.filter(function (e) {
            var is_tv = e.number_of_seasons || e.first_air_date;
            return !is_tv;
        });

        return result.map(function (e) {
            var c = Object.assign({}, e);
            c.wide  = false;
            c.small = false;
            c.broad = false;
            return c;
        });
    }

    /**
     * Позиция ряда в parts_data.
     *
     * Все четыре штатных ряда ядра зарегистрированы с index:1 и попадают
     * в parts_data раньше нас (ядро грузится до customPlugins).
     * Arrays.insert это splice(index, 0, item) — вставка ПЕРЕД тем, что уже
     * лежит на этой позиции, поэтому порядок на экране обратен порядку
     * регистрации:
     *
     *   регистрация: continue_watch -> recomend_watch -> timetable_lately
     *                -> timetable_recently
     *   на экране:   timetable_recently, timetable_lately, recomend_watch,
     *                continue_watch
     *
     * То есть continue_watch ("Продолжить просмотр") оказывается ПОСЛЕДНИМ
     * из штатных. Чтобы встать сразу за ним, берём позицию = число
     * включённых штатных рядов + 1.
     *
     * Если пользователь выключил часть рядов в Настройки -> Каналы,
     * блок короче — индекс пересчитывается сам.
     */
    var NATIVE_ROWS = [
        'continue_watch',
        'recomend_watch',
        'timetable_lately',
        'timetable_recently'
    ];

    function nativeRowsCount() {
        var enabled = 0;

        NATIVE_ROWS.forEach(function (n) {
            try {
                if (Lampa.Storage.get('content_rows_' + n, 'true')) enabled++;
            } catch (e) {
                enabled++;
            }
        });

        return enabled;
    }

    function rowIndex() {
        return nativeRowsCount() + 1;
    }

    function ContinueMoviesComponent(object) {
        var CategoryFull = Lampa.Component.get('category_full');
        var all   = getContinueMovies();
        var total = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
        var origList = Lampa.Api.list;

        // Патчим Api.list постоянно пока компонент жив
        Lampa.Api.list = function (obj, resolve, reject) {
            if (obj && obj._continue_movies_data) {
                var p      = parseInt(obj.page || 1);
                var offset = (p - 1) * PAGE_SIZE;
                var res    = all.slice(offset, offset + PAGE_SIZE);
                if (res.length) {
                    resolve({ results: res, total_pages: total, page: p });
                } else {
                    reject();
                }
            } else {
                origList(obj, resolve, reject);
            }
        };

        object._continue_movies_data = true;

        var comp = new CategoryFull(object);

        comp.use({
            onlyInstance: function (item, data) {
                item.use({
                    onEnter: function () {
                        Lampa.Activity.push({
                            component: 'full',
                            id:        data.id,
                            method:    'movie',
                            card:      data,
                            source:    data.source
                        });
                    },
                    onFocus: function () {
                        Lampa.Background.change(Lampa.Utils.cardImgBackground(data));
                    }
                });
            }
        });

        this.create  = comp.create.bind(comp);
        this.start   = comp.start.bind(comp);
        this.pause   = comp.pause.bind(comp);
        this.stop    = comp.stop    ? comp.stop.bind(comp)    : function () {};
        this.refresh = comp.refresh ? comp.refresh.bind(comp) : function () {};
        this.render  = comp.render.bind(comp);

        // При уничтожении восстанавливаем Api.list
        this.destroy = function () {
            Lampa.Api.list = origList;
            comp.destroy();
        };

        Object.defineProperty(this, 'activity', {
            get: function () { return comp.activity; },
            set: function (v) { comp.activity = v;   }
        });
    }

    function openContinueMovies() {
        Lampa.Activity.push({
            url:       '',
            title:     Lampa.Lang.translate('title_watched') || 'Вы смотрели',
            component: COMPONENT_NAME,
            page:      1
        });
    }

    function patchRouter() {
        var origCall = Lampa.Router.call.bind(Lampa.Router);
        Lampa.Router.call = function (name, data) {
            if (name === 'category_full' && data && data._continue_movies) {
                openContinueMovies();
            } else {
                origCall(name, data);
            }
        };
    }

    function init() {
        Lampa.Component.add(COMPONENT_NAME, ContinueMoviesComponent);

        patchRouter();

        Lampa.ContentRows.add({
            name:   'continue_watch_movies',
            title:  Lampa.Lang.translate('title_watched') || 'Вы смотрели',
            index:  rowIndex(),
            screen: ['main'],
            call: function (params, screen) {
                var all = getContinueMovies();
                if (!all.length) return;

                return function (call) {
                    call({
                        results:          all.slice(0, 19),
                        title:            Lampa.Lang.translate('title_watched') || 'Вы смотрели',
                        total_pages:      2,
                        _continue_movies: true
                    });
                };
            }
        });
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

})();
                
