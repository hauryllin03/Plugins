(function () {
    'use strict';

    /**
     * sticky_voice.js — «липкая» озвучка для HanzoTV
     *
     * Штатный online-плагин Lampac запоминает выбор озвучки только внутри
     * одной карточки: online_choice_<balanser>[movie.id].voice_name.
     * При открытии НОВОГО фильма/сериала выбор начинается с нуля.
     *
     * Этот плагин:
     *   1) наблюдает за online_choice_* и копит статистику «какую студию
     *      пользователь выбирает чаще всего» — отдельно по каждому балансеру;
     *   2) при открытии карточки, для которой выбора ещё нет, заранее
     *      прописывает voice_name = любимая студия. Дальше штатный плагин
     *      сам находит её в списке кнопок и переключается (см. ветку
     *      find_voice_name в Online/plugin.js).
     *
     * Никаких патчей ядра и online-плагина — только чтение/запись Storage.
     */

    if (window.sticky_voice_ready) return;
    window.sticky_voice_ready = true;

    var PREFIX   = 'online_choice_';
    var K_STATS  = 'sticky_voice_stats';   // { balanser: { voice_name: count } }
    var K_SEEN   = 'sticky_voice_seen';    // { balanser: { movie_id: voice_name } }
    var K_PIN    = 'sticky_voice_pin';     // { balanser: voice_name }
    var K_ENABLE = 'sticky_voice_enable';
    var K_MODE   = 'sticky_voice_mode';    // 'auto' | 'pin'
    var K_MIN    = 'sticky_voice_min';     // порог срабатывания
    var K_NOTY   = 'sticky_voice_noty';

    var SEEN_LIMIT = 400;                  // записей на балансер в снимке
    var busy = false;                      // защита от рекурсии при записи

    // ── утилиты хранилища ────────────────────────────────────────────────

    function readObj(key) {
        try {
            var v = Lampa.Storage.get(key, '{}');
            return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
        } catch (e) {
            return {};
        }
    }

    function writeObj(key, val) {
        try {
            // третий аргумент true = не рассылать событие change:
            // свои служебные ключи не должны крутить наш же обработчик
            Lampa.Storage.set(key, val, true);
        } catch (e) {}
    }

    function enabled() {
        return Lampa.Storage.get(K_ENABLE, 'true') !== false;
    }

    function minCount() {
        var n = parseInt(Lampa.Storage.get(K_MIN, '2'));
        return isNaN(n) ? 2 : n;
    }

    function log() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift('[sticky_voice]');
        try { console.log.apply(console, a); } catch (e) {}
    }

    // ── список балансеров, по которым вообще есть история ────────────────

    function balansers() {
        var out = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf(PREFIX) === 0) out.push(k.slice(PREFIX.length));
            }
        } catch (e) {}
        return out;
    }

    // ── обучение: сравниваем текущее состояние со снимком ────────────────

    function learn(balanser, data) {
        if (!data || typeof data !== 'object') return;

        var stats = readObj(K_STATS);
        var seen  = readObj(K_SEEN);
        var s = stats[balanser] || (stats[balanser] = {});
        var w = seen[balanser]  || (seen[balanser]  = {});
        var changed = false;

        for (var id in data) {
            if (!Object.prototype.hasOwnProperty.call(data, id)) continue;
            var rec = data[id];
            if (!rec || typeof rec !== 'object') continue;

            var vn = rec.voice_name;
            if (!vn || typeof vn !== 'string') continue;

            // уже учтено — значит выбор не менялся
            if (w[id] === vn) continue;

            w[id] = vn;
            s[vn] = (s[vn] || 0) + 1;
            changed = true;
        }

        if (!changed) return;

        // подрезаем снимок, чтобы localStorage не пух
        var keys = Object.keys(w);
        if (keys.length > SEEN_LIMIT) {
            keys.slice(0, keys.length - SEEN_LIMIT).forEach(function (k) { delete w[k]; });
        }

        writeObj(K_STATS, stats);
        writeObj(K_SEEN, seen);
    }

    // ── любимая озвучка для балансера ────────────────────────────────────

    function favorite(balanser) {
        if (Lampa.Storage.get(K_MODE, 'auto') === 'pin') {
            var pin = readObj(K_PIN);
            return pin[balanser] || '';
        }

        var s = readObj(K_STATS)[balanser];
        if (!s) return '';

        var best = '', bestN = 0;
        for (var name in s) {
            if (s[name] > bestN) { bestN = s[name]; best = name; }
        }
        return bestN >= minCount() ? best : '';
    }

    // ── применение к новой карточке ──────────────────────────────────────

    function apply(movieId) {
        if (!enabled() || !movieId) return;

        var list = balansers();
        var seen = readObj(K_SEEN);
        var applied = [];

        list.forEach(function (b) {
            var fav = favorite(b);
            if (!fav) return;

            var key  = PREFIX + b;
            var data = readObj(key);
            var rec  = data[movieId];

            // выбор для этой карточки уже есть — не трогаем
            if (rec && rec.voice_name) return;

            data[movieId] = Lampa.Arrays.extend(rec || {}, {
                season: 0,
                voice: 0,
                voice_url: '',          // обязательно пусто: url привязан к другому фильму
                voice_name: fav,
                episodes_view: {},
                movie_view: ''
            });

            // помечаем в снимке ДО записи, иначе обучение засчитает
            // нашу же подстановку и озвучка начнёт «самоусиливаться»
            (seen[b] || (seen[b] = {}))[movieId] = fav;

            busy = true;
            try { Lampa.Storage.set(key, data); } catch (e) {}
            busy = false;

            applied.push(b + ':' + fav);
        });

        if (applied.length) {
            writeObj(K_SEEN, seen);
            log('подставлено для', movieId, '→', applied.join(', '));

            if (Lampa.Storage.get(K_NOTY, 'false') === true) {
                Lampa.Noty.show('Озвучка: ' + applied[0].split(':')[1]);
            }
        }
    }

    // ── настройки ────────────────────────────────────────────────────────

    var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" stroke="currentColor" stroke-width="2"/>' +
        '<path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
        '</svg>';

    function flatList() {
        var stats = readObj(K_STATS);
        var out = [];
        for (var b in stats) {
            for (var v in stats[b]) {
                out.push({ balanser: b, voice: v, count: stats[b][v] });
            }
        }
        out.sort(function (a, c) { return c.count - a.count; });
        return out;
    }

    function selectShow(title, items, onSelect) {
        var prev = Lampa.Controller.enabled().name;
        var back = function () { Lampa.Controller.toggle(prev); };

        Lampa.Select.show({
            title: title,
            items: items.length ? items : [{ title: 'Пока пусто', nope: true }],
            onSelect: function (item) {
                if (!item.nope && onSelect) onSelect(item);
                back();
            },
            onBack: back
        });
    }

    function settings() {
        Lampa.SettingsApi.addComponent({
            component: 'sticky_voice',
            name: 'Липкая озвучка',
            icon: ICON
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: { name: K_ENABLE, type: 'trigger', "default": true },
            field: {
                name: 'Включить',
                description: 'Подставлять привычную студию озвучки на новых карточках'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: {
                name: K_MODE,
                type: 'select',
                values: { auto: 'Автоматически', pin: 'Закреплённая' },
                "default": 'auto'
            },
            field: {
                name: 'Режим',
                description: 'Авто — самая частая студия. Закреплённая — выбранная вручную ниже'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: {
                name: K_MIN,
                type: 'select',
                values: { 1: '1 раз', 2: '2 раза', 3: '3 раза', 5: '5 раз' },
                "default": '2'
            },
            field: {
                name: 'Порог автовыбора',
                description: 'Сколько раз студию надо выбрать, чтобы она стала любимой'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: { name: K_NOTY, type: 'trigger', "default": false },
            field: { name: 'Показывать уведомление', description: 'Всплывашка при подстановке' }
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: { name: 'sticky_voice_pin_btn', type: 'button' },
            field: {
                name: 'Закрепить озвучку',
                description: 'Жёстко задать студию для конкретного балансера'
            },
            onChange: function () {
                var pin = readObj(K_PIN);
                var items = flatList().map(function (r) {
                    return {
                        title: r.balanser + ' — ' + r.voice,
                        subtitle: 'выбрана ' + r.count + ' раз(а)',
                        checkbox: true,
                        checked: pin[r.balanser] === r.voice,
                        data: r
                    };
                });
                items.push({ title: 'Снять все закрепления', clear: true });

                selectShow('Закрепить озвучку', items, function (item) {
                    if (item.clear) {
                        writeObj(K_PIN, {});
                        Lampa.Noty.show('Закрепления сняты');
                        return;
                    }
                    var p = readObj(K_PIN);
                    p[item.data.balanser] = item.data.voice;
                    writeObj(K_PIN, p);
                    Lampa.Storage.set(K_MODE, 'pin');
                    Lampa.Noty.show('Закреплено: ' + item.data.voice);
                });
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: { name: 'sticky_voice_stat_btn', type: 'button' },
            field: { name: 'Статистика выбора', description: 'Что плагин успел выучить' },
            onChange: function () {
                var items = flatList().map(function (r) {
                    return { title: r.balanser + ' — ' + r.voice, subtitle: r.count + ' раз(а)' };
                });
                selectShow('Статистика озвучек', items);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'sticky_voice',
            param: { name: 'sticky_voice_reset_btn', type: 'button' },
            field: { name: 'Сбросить статистику', description: 'Обучение начнётся заново' },
            onChange: function () {
                selectShow('Сбросить статистику?', [
                    { title: 'Да, сбросить', yes: true },
                    { title: 'Отмена' }
                ], function (item) {
                    if (!item.yes) return;
                    writeObj(K_STATS, {});
                    writeObj(K_SEEN, {});
                    writeObj(K_PIN, {});
                    Lampa.Noty.show('Статистика очищена');
                });
            }
        });
    }

    // ── старт ────────────────────────────────────────────────────────────

    function boot() {
        try {
            settings();

            // первичная калибровка по уже накопленной истории
            balansers().forEach(function (b) { learn(b, readObj(PREFIX + b)); });

            // обучение на лету
            Lampa.Storage.listener.follow('change', function (e) {
                if (busy || !e.name || e.name.indexOf(PREFIX) !== 0) return;
                try { learn(e.name.slice(PREFIX.length), e.value); } catch (err) {}
            });

            // применение при открытии карточки
            Lampa.Listener.follow('full', function (e) {
                if (e.type !== 'complite') return;
                try {
                    var card = e.object && e.object.card;
                    if (card && card.id) apply(String(card.id));
                } catch (err) {}
            });

            log('готов, балансеров в истории:', balansers().length);
        } catch (e) {
            log('ошибка старта:', e && e.message);
        }
    }

    if (window.appready) boot();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') boot();
    });
})();
