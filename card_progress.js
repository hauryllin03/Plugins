
(function () {
    'use strict';

    /**
     * card_progress.js — полоска прогресса просмотра на постерах
     *
     * Lampa хранит прогресс в Storage['file_view'] как { hash: {percent,time,duration} },
     * где hash = Utils.hash(original_title) для фильма и
     * Utils.hash([season, season>10?':':'', episode, original_name].join('')) для серии.
     *
     * Плагин перехватывает Template.js('card') — единственную точку, через
     * которую ядро строит DOM карточки, — и дорисовывает полоску внутрь
     * .card__view. Ни MutationObserver, ни опроса DOM.
     */

    if (window.card_progress_ready) return;
    window.card_progress_ready = true;

    var K_ENABLE = 'card_progress_enable';
    var K_LABEL  = 'card_progress_label';    // показывать подпись
    var K_DONE   = 'card_progress_done';     // показывать досмотренное
    var K_MIN    = 'card_progress_min';      // минимальный процент

    var MAX_SEASON  = 15;   // глубина перебора при поиске серий
    var MAX_EPISODE = 40;
    var DONE_AT     = 90;   // с какого процента считаем «досмотрено»

    var queue = [], timer = null, memo = {};

    function log() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift('[card_progress]');
        try { console.log.apply(console, a); } catch (e) {}
    }

    function enabled()  { return Lampa.Storage.get(K_ENABLE, 'true') !== false; }
    function showLabel(){ return Lampa.Storage.get(K_LABEL, 'true') !== false; }
    function showDone() { return Lampa.Storage.get(K_DONE, 'true') !== false; }
    function minPct()   {
        var n = parseInt(Lampa.Storage.get(K_MIN, '3'));
        return isNaN(n) ? 3 : n;
    }

    // ── чтение прогресса ─────────────────────────────────────────────────

    function viewed() {
        try {
            var v = Lampa.Storage.get(Lampa.Timeline.filename(), '{}');
            return (v && typeof v === 'object') ? v : {};
        } catch (e) {
            return {};
        }
    }

    function road(map, hash) {
        var r = map[hash];
        if (typeof r === 'undefined') return null;
        if (typeof r === 'object') return r;
        return { percent: r || 0, time: 0, duration: 0 };
    }

    function isSerial(data) {
        return !!(data.original_name || data.name || data.number_of_seasons);
    }

    /**
     * Прогресс для фильма: один хеш по original_title
     */
    function movieProgress(map, data) {
        var title = data.original_title || data.title;
        if (!title) return null;

        var r = road(map, Lampa.Utils.hash(title));
        if (!r || !r.percent) return null;

        var label = '';
        if (r.duration && r.time) {
            var left = Math.round((r.duration - r.time) / 60);
            if (left > 0) label = left + ' мин';
        }
        return { percent: r.percent, label: label, done: r.percent >= DONE_AT };
    }

    /**
     * Прогресс для сериала: ищем самую позднюю просмотренную серию.
     * Перебор хешей, а не запросов — Utils.hash работает по короткой строке,
     * 15×40 итераций на карточку укладываются в единицы миллисекунд.
     */
    function serialProgress(map, data) {
        var name = data.original_name || data.original_title || data.name;
        if (!name) return null;

        var best = null;

        for (var s = 1; s <= MAX_SEASON; s++) {
            var found_in_season = false;

            for (var e = 1; e <= MAX_EPISODE; e++) {
                var hash = Lampa.Utils.hash([s, s > 10 ? ':' : '', e, name].join(''));
                var r = road(map, hash);
                if (!r || !r.percent) continue;

                found_in_season = true;
                best = { season: s, episode: e, road: r };
            }

            // если в сезоне нет ни одной отметки и что-то уже нашли раньше —
            // дальше почти наверняка пусто, но проверим ещё один сезон про запас
            if (!found_in_season && best && s > best.season + 1) break;
        }

        if (!best) return null;

        return {
            percent: best.road.percent,
            label: 'S' + best.season + 'E' + best.episode,
            done: best.road.percent >= DONE_AT
        };
    }

    function progressOf(data) {
        if (!data) return null;

        var key = (data.id || '') + ':' + (data.original_title || data.original_name || '');
        if (Object.prototype.hasOwnProperty.call(memo, key)) return memo[key];

        var map = viewed();
        var res = isSerial(data) ? serialProgress(map, data) : movieProgress(map, data);

        memo[key] = res;
        return res;
    }

    // ── отрисовка ────────────────────────────────────────────────────────

    function paint(card) {
        try {
            if (!card || !card.card_data) return;

            var old = card.querySelector('.cp-bar');
            if (old) old.parentNode.removeChild(old);

            if (!enabled()) return;

            var view = card.querySelector('.card__view');
            if (!view) return;

            var p = progressOf(card.card_data);
            if (!p || p.percent < minPct()) return;
            if (p.done && !showDone()) return;

            var bar = document.createElement('div');
            bar.className = 'cp-bar' + (p.done ? ' cp-bar--done' : '');

            var fill = document.createElement('div');
            fill.className = 'cp-bar__fill';
            fill.style.width = Math.min(100, p.percent) + '%';
            bar.appendChild(fill);

            if (p.label && showLabel()) {
                var tag = document.createElement('div');
                tag.className = 'cp-tag';
                tag.innerText = p.label;
                view.appendChild(tag);
            }

            view.appendChild(bar);
        } catch (e) {}
    }

    /**
     * Батчинг: карточки строятся пачками по 20+, обрабатываем их
     * одним проходом, чтобы не плодить таймеры на слабых Android-TV.
     */
    function enqueue(card) {
        queue.push(card);
        if (timer) return;
        timer = setTimeout(function () {
            timer = null;
            var list = queue;
            queue = [];
            list.forEach(paint);
        }, 30);
    }

    function repaintAll() {
        memo = {};
        try {
            var all = document.querySelectorAll('.card');
            for (var i = 0; i < all.length; i++) paint(all[i]);
        } catch (e) {}
    }

    // ── перехват шаблона ─────────────────────────────────────────────────

    function hook() {
        var orig = Lampa.Template.js;

        Lampa.Template.js = function (name) {
            var el = orig.apply(this, arguments);

            if (name === 'card' && el && el.querySelector) {
                // card_data ставится ядром синхронно сразу после Template.js,
                // поэтому читаем его в следующем тике, а не прямо здесь
                enqueue(el);
            }

            return el;
        };
    }

    // ── стили ────────────────────────────────────────────────────────────

    function styles() {
        var css = ''
            + '.card__view{position:relative}'
            + '.cp-bar{position:absolute;left:0;right:0;bottom:0;height:0.32em;'
            + 'background:rgba(0,0,0,.55);border-radius:0 0 .6em .6em;overflow:hidden;z-index:3}'
            + '.cp-bar__fill{height:100%;background:#4d9fff;'
            + 'box-shadow:none;will-change:auto}'
            + '.cp-bar--done .cp-bar__fill{background:#5ecb7a}'
            + '.cp-tag{position:absolute;left:.4em;bottom:.7em;z-index:3;'
            + 'padding:.15em .4em;border-radius:.3em;font-size:.9em;line-height:1;'
            + 'background:rgba(0,0,0,.72);color:#fff}'
            + '.card--small .cp-tag{font-size:.75em}';

        var style = document.createElement('style');
        style.id = 'card_progress_style';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // ── настройки ────────────────────────────────────────────────────────

    var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2"/>' +
        '<rect x="5" y="19" width="14" height="2" rx="1" fill="currentColor"/>' +
        '<rect x="5" y="19" width="7" height="2" rx="1" fill="currentColor"/>' +
        '</svg>';

    function settings() {
        Lampa.SettingsApi.addComponent({
            component: 'card_progress',
            name: 'Прогресс на постерах',
            icon: ICON
        });

        Lampa.SettingsApi.addParam({
            component: 'card_progress',
            param: { name: K_ENABLE, type: 'trigger', "default": true },
            field: { name: 'Включить', description: 'Полоска просмотра внизу постера' },
            onRender: function (item) {
                item.on('change', function () { setTimeout(repaintAll, 100); });
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'card_progress',
            param: { name: K_LABEL, type: 'trigger', "default": true },
            field: {
                name: 'Подпись',
                description: 'Номер серии для сериалов, остаток времени для фильмов'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'card_progress',
            param: { name: K_DONE, type: 'trigger', "default": true },
            field: { name: 'Показывать досмотренное', description: 'Зелёная полоса при 90% и выше' }
        });

        Lampa.SettingsApi.addParam({
            component: 'card_progress',
            param: {
                name: K_MIN,
                type: 'select',
                values: { 1: '1%', 3: '3%', 5: '5%', 10: '10%' },
                "default": '3'
            },
            field: { name: 'Минимальный прогресс', description: 'Ниже этого порога полоска не рисуется' }
        });

        Lampa.SettingsApi.addParam({
            component: 'card_progress',
            param: { name: 'card_progress_diag', type: 'button' },
            field: { name: 'Диагностика', description: 'Сколько отметок просмотра вообще есть' },
            onChange: function () {
                var map = viewed();
                var keys = Object.keys(map);
                var withPct = keys.filter(function (k) {
                    var r = road(map, k);
                    return r && r.percent > 0;
                });

                var prev = Lampa.Controller.enabled().name;
                Lampa.Select.show({
                    title: 'Диагностика прогресса',
                    items: [
                        { title: 'Ключ хранилища: ' + Lampa.Timeline.filename() },
                        { title: 'Всего записей: ' + keys.length },
                        { title: 'С ненулевым прогрессом: ' + withPct.length },
                        { title: 'Карточек в DOM: ' + document.querySelectorAll('.card').length },
                        { title: 'Полосок отрисовано: ' + document.querySelectorAll('.cp-bar').length }
                    ],
                    onSelect: function () { Lampa.Controller.toggle(prev); },
                    onBack:   function () { Lampa.Controller.toggle(prev); }
                });
            }
        });
    }

    // ── старт ────────────────────────────────────────────────────────────

    function boot() {
        try {
            styles();
            settings();
            hook();

            // карточки, созданные до подключения плагина
            repaintAll();

            // вернулись из плеера или с карточки — пересчитать
            Lampa.Listener.follow('activity', function (e) {
                if (e.type === 'start' || e.type === 'archive') setTimeout(repaintAll, 200);
            });

            var map = viewed();
            log('старт. записей в', Lampa.Timeline.filename() + ':', Object.keys(map).length);
        } catch (e) {
            log('ошибка старта:', e && e.message);
        }
    }

    if (window.appready) boot();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') boot();
    });
})();
