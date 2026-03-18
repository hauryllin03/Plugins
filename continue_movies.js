(function () {
    'use strict';

    var COMPONENT_NAME = 'continue_movies';
    var PAGE_SIZE = 200; // Все фильмы на одной странице

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

    function ContinueMoviesComponent(object) {
        var CategoryFull = Lampa.Component.get('category_full');
        var all   = getContinueMovies();

        // Все фильмы на одной странице — total_pages: 1 чтобы не было навигации
        var origList = Lampa.Api.list;
        Lampa.Api.list = function (obj, resolve, reject) {
            if (obj && obj._continue_movies_data) {
                Lampa.Api.list = origList;
                if (all.length) {
                    resolve({ results: all, total_pages: 1, page: 1 });
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
            onInstance: function (item, data) {
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
        this.destroy = comp.destroy.bind(comp);

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
            index:  2,
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
