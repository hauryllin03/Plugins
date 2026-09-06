(function () {
    'use strict';

    /**
     * skip_learn.js — пропуск заставки с обучением на ваших перемотках
     *
     * Идея: ядро Lampa уже умеет пропускать сегменты. В app_min.js есть
     * внутренний модуль Segments, а плеер подписан на его событие 'skip':
     *
     *     Segments.listener.follow('skip', function (e) {
     *         if (Storage.get('player_segments_' + e.type, 'auto') == 'auto') {
     *             _video.currentTime = Math.min(_video.duration, e.segment.end);
     *             Bell.push({text: 'Пропущено'});
     *         }
     *     });
     *
     * Плюс режим «вручную»: перемотка вперёд внутри сегмента прыгает на его
     * конец (функция rewind). Режим переключается в самом плеере:
     * Сегменты → Пропуск интро → Авто / Вручную / Выключено.
     *
     * Чего ядру не хватает — таймкодов. Штатный вход для них:
     * data.segments = {skip: [...]} в Lampa.Player.play(data).
     *
     * Поэтому плагин НЕ рисует кнопок, НЕ перематывает сам и НЕ ходит
     * ни в какие внешние базы. Он только:
     *   1) ловит ваши ручные перемотки и запоминает, где у сериала заставка;
     *   2) подкладывает выученное в play(), дальше работает ядро.
     */

    if (window.skip_learn_ready) return;
    window.skip_learn_ready = true;

    var DB       = 'skip_learn_db';
    var K_ENABLE = 'skip_learn_enable';
    var K_MIN    = 'skip_learn_min';       // сколько наблюдений до применения
    var K_WINDOW = 'skip_learn_window';    // окно поиска заставки, сек
    var K_CREDIT = 'skip_learn_credits';   // учить титры

    var MIN_JUMP   = 15;    // короче — не заставка, а промах пальцем
    var MAX_JUMP   = 180;   // длиннее — человек ищет нужное место
    var SEEK_GAP   = 3;     // скачок больше этого считаем перемоткой
    var SEEK_REAL  = 1.5;   // ...если реального времени прошло меньше
    var SEEK_SETTLE = 1200; // мс тишины = перемотка закончилась
    var SAMPLES    = 7;     // сколько наблюдений храним на сегмент
    var KEYS_LIMIT = 200;   // сериалов в базе
    var CREDITS_TAIL = 600; // хвост, в котором ищем титры

    // состояние текущего воспроизведения
    var cur = null;

    function log() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift('[skip_learn]');
        try { console.log.apply(console, a); } catch (e) {}
    }

    function enabled() { return Lampa.Storage.get(K_ENABLE, 'true') !== false; }
    function learnCredits() { return Lampa.Storage.get(K_CREDIT, 'true') !== false; }
    function minSamples() {
        var n = parseInt(Lampa.Storage.get(K_MIN, '2'));
        return isNaN(n) ? 2 : n;
    }
    function introWindow() {
        var n = parseInt(Lampa.Storage.get(K_WINDOW, '360'));
        return isNaN(n) ? 360 : n;
    }

    // ── база ─────────────────────────────────────────────────────────────

    function readDb() {
        try {
            var v = Lampa.Storage.get(DB, '{}');
            if (typeof v === 'string') v = JSON.parse(v);
            return (v && typeof v === 'object') ? v : {};
        } catch (e) {
            return {};
        }
    }

    function writeDb(db) {
        try {
            var keys = Object.keys(db);
            if (keys.length > KEYS_LIMIT) {
                keys.sort(function (a, b) { return (db[a].ts || 0) - (db[b].ts || 0); });
                keys.slice(0, keys.length - KEYS_LIMIT).forEach(function (k) { delete db[k]; });
            }
            Lampa.Storage.set(DB, db);
        } catch (e) {}
    }

    /**
     * Ключ обучения — сериал плюс сезон. У разных сезонов заставка
     * часто разной длины, а внутри сезона она стабильна.
     */
    function makeKey(card, season) {
        var name = card && (card.original_name || card.original_title || card.name || card.title);
        if (!name) return null;
        return Lampa.Utils.hash(name) + '_s' + (season || 1);
    }

    function median(list) {
        if (!list.length) return 0;
        var s = list.slice().sort(function (a, b) { return a - b; });
        var m = Math.floor(s.length / 2);
        return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
    }

    // ── чтение метаданных серии ──────────────────────────────────────────

    /**
     * Season/episode приходят по-разному в зависимости от балансера,
     * поэтому проверяем все известные варианты подряд.
     */
    function meta(data) {
        var out = { season: null, episode: null, card: null, serial: false };

        var card = (data && (data.card || data.movie)) || null;
        if (!card) {
            try {
                var a = Lampa.Activity.active();
                if (a) card = a.movie || a.card || null;
            } catch (e) {}
        }
        out.card = card;

        if (data) {
            if (data.season != null)  out.season  = parseInt(data.season);
            if (data.episode != null) out.episode = parseInt(data.episode);

            if ((out.season == null || out.episode == null) && data.title) {
                var m = String(data.title).match(/[Ss](\d+)\s*[Ee](\d+)/);
                if (m) {
                    if (out.season == null)  out.season  = parseInt(m[1]);
                    if (out.episode == null) out.episode = parseInt(m[2]);
                }
            }

            if (data.playlist && data.playlist.length) {
                for (var i = 0; i < data.playlist.length; i++) {
                    var it = data.playlist[i];
                    if (it.url !== data.url) continue;
                    if (out.season == null)  out.season  = parseInt(it.season || it.s || 1);
                    if (out.episode == null) out.episode = parseInt(it.episode || it.e || (i + 1));
                    break;
                }
            }
        }

        if (card) {
            out.serial = !!(card.original_name || card.name || card.number_of_seasons || card.first_air_date);
        }
        if (out.season != null && out.episode != null) out.serial = true;
        if (out.season == null) out.season = 1;

        return out;
    }

    // ── предсказание ─────────────────────────────────────────────────────

    function predict(key) {
        var db = readDb();
        var rec = db[key];
        if (!rec) return null;

        var need = minSamples();
        var out = [];

        ['intro', 'credits'].forEach(function (type) {
            var seg = rec[type];
            if (!seg || !seg.samples || seg.samples.length < need) return;

            var starts = seg.samples.map(function (x) { return x[0]; });
            var ends   = seg.samples.map(function (x) { return x[1]; });

            out.push({
                start: median(starts),
                end: median(ends),
                _type: type
            });
        });

        return out.length ? out : null;
    }

    // ── обучение ─────────────────────────────────────────────────────────

    function remember(type, from, to) {
        if (!cur || !cur.key) return;

        var db  = readDb();
        var rec = db[cur.key] || (db[cur.key] = { title: cur.title || '' });
        var seg = rec[type] || (rec[type] = { samples: [] });

        seg.samples.push([Math.round(from), Math.round(to)]);
        if (seg.samples.length > SAMPLES) seg.samples = seg.samples.slice(-SAMPLES);

        rec.ts = Date.now();
        rec.title = cur.title || rec.title;

        writeDb(db);
        log('запомнил', type, Math.round(from) + '→' + Math.round(to),
            '(наблюдений: ' + seg.samples.length + ')');
    }

    /**
     * Откат назад внутрь предсказанного сегмента = наша оценка промахнулась.
     * Снимаем одно наблюдение, чтобы медиана поехала в нужную сторону.
     */
    function forget(pos) {
        if (!cur || !cur.key || !cur.predicted) return;

        var hit = null;
        for (var i = 0; i < cur.predicted.length; i++) {
            var s = cur.predicted[i];
            if (pos >= s.start - 5 && pos <= s.end + 5) { hit = s; break; }
        }
        if (!hit) return;

        var db = readDb();
        var rec = db[cur.key];
        if (!rec || !rec[hit._type] || !rec[hit._type].samples.length) return;

        rec[hit._type].samples.pop();
        rec.ts = Date.now();
        writeDb(db);

        log('промах по', hit._type, '— снял одно наблюдение');
    }

    function classify(from, to, duration) {
        var len = to - from;
        if (len < MIN_JUMP || len > MAX_JUMP) return null;

        if (from < introWindow()) return 'intro';

        if (learnCredits() && duration > 900 && from > duration - CREDITS_TAIL) return 'credits';

        return null;
    }

    // ── детектор перемотки ───────────────────────────────────────────────

    /**
     * Ядро не шлёт timeupdate во время удержания перемотки (строка 12174:
     * `if (rewind_position == 0 && !_video.rewind)`), зато rewindStart шлёт
     * свой timeupdate с целевой позицией. Поэтому надёжнее не ловить события
     * перемотки, а смотреть на разрыв: медиавремя скакнуло сильно, а реального
     * прошло мало — значит это seek, а не воспроизведение.
     */
    function onTime(e) {
        if (!cur || !enabled()) return;

        var t = (e && typeof e.current === 'number') ? e.current : null;
        if (t === null) {
            try { t = Lampa.PlayerVideo.video().currentTime; } catch (err) { return; }
        }

        var dur = (e && e.duration) || cur.duration || 0;
        if (dur) cur.duration = dur;

        var now = Date.now();

        if (cur.last === null) {
            cur.last = t;
            cur.last_ts = now;
            return;
        }

        var d_media = t - cur.last;
        var d_real  = (now - cur.last_ts) / 1000;

        // перемотка уже идёт — тянем её конец, пока позиция растёт
        if (cur.seeking) {
            if (t > cur.seek_to) cur.seek_to = t;
            clearTimeout(cur.settle);
            cur.settle = setTimeout(finishSeek, SEEK_SETTLE);
            cur.last = t;
            cur.last_ts = now;
            return;
        }

        if (d_media > SEEK_GAP && d_real < SEEK_REAL) {
            cur.seeking = true;
            cur.seek_from = cur.last;
            cur.seek_to = t;
            clearTimeout(cur.settle);
            cur.settle = setTimeout(finishSeek, SEEK_SETTLE);
        }
        else if (d_media < -SEEK_GAP && d_real < SEEK_REAL) {
            forget(t);
        }

        cur.last = t;
        cur.last_ts = now;
    }

    function finishSeek() {
        if (!cur || !cur.seeking) return;

        var from = cur.seek_from;
        var to   = cur.seek_to;
        cur.seeking = false;

        // ядро само прыгнуло по нашему же сегменту — это не новое знание
        if (cur.predicted) {
            for (var i = 0; i < cur.predicted.length; i++) {
                var s = cur.predicted[i];
                if (Math.abs(to - s.end) < 8 && from >= s.start - 8) {
                    log('прыжок по своему сегменту — не учу');
                    return;
                }
            }
        }

        var type = classify(from, to, cur.duration);
        if (!type) return;

        remember(type, from, to);
    }

    // ── подкладываем сегменты в play() ───────────────────────────────────

    function hookPlay() {
        var orig = Lampa.Player.play;

        Lampa.Player.play = function (data) {
            try {
                if (enabled() && data && typeof data === 'object') {
                    var m = meta(data);

                    if (m.serial && m.card) {
                        var key = makeKey(m.card, m.season);
                        var has_own = data.segments &&
                                      data.segments.skip &&
                                      data.segments.skip.length;

                        // сегменты от балансера главнее — они точные
                        if (key && !has_own) {
                            var segs = predict(key);
                            if (segs) {
                                data.segments = data.segments || {};
                                data.segments.skip = segs.map(function (s) {
                                    return { start: s.start, end: s.end };
                                });
                                log('отдал ядру', segs.length, 'сегмент(ов) для', key);
                            }
                        }
                    }
                }
            } catch (e) {
                log('ошибка в play:', e && e.message);
            }

            return orig.apply(this, arguments);
        };
    }

    // ── жизненный цикл ───────────────────────────────────────────────────

    function onStart(data) {
        var m = meta(data);
        var key = (m.serial && m.card) ? makeKey(m.card, m.season) : null;

        cur = {
            key: key,
            title: m.card ? (m.card.title || m.card.name || '') : '',
            season: m.season,
            duration: 0,
            last: null,
            last_ts: 0,
            seeking: false,
            seek_from: 0,
            seek_to: 0,
            settle: null,
            predicted: key ? predict(key) : null
        };

        if (key) log('старт, ключ', key, cur.predicted ? '(есть прогноз)' : '(учусь)');
    }

    function onDestroy() {
        if (cur && cur.settle) clearTimeout(cur.settle);
        cur = null;
    }

    // ── настройки ────────────────────────────────────────────────────────

    var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M4 5l10 7-10 7V5z" fill="currentColor"/>' +
        '<rect x="17" y="5" width="3" height="14" rx="1" fill="currentColor"/>' +
        '</svg>';

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

    function fmt(sec) {
        var m = Math.floor(sec / 60), s = Math.round(sec % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function settings() {
        Lampa.SettingsApi.addComponent({
            component: 'skip_learn',
            name: 'Заставки: обучение',
            icon: ICON
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: K_ENABLE, type: 'trigger', "default": true },
            field: {
                name: 'Включить',
                description: 'Запоминать перемотки и подсказывать ядру, где заставка. ' +
                             'Сам пропуск включается в плеере: Сегменты → Пропуск интро'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_MIN,
                type: 'select',
                values: { 1: 'После 1 раза', 2: 'После 2 раз', 3: 'После 3 раз' },
                "default": '2'
            },
            field: {
                name: 'Когда применять',
                description: 'Сколько раз надо перемотать, чтобы плагин начал подсказывать'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_WINDOW,
                type: 'select',
                values: { 180: '3 минуты', 300: '5 минут', 360: '6 минут', 600: '10 минут' },
                "default": '360'
            },
            field: {
                name: 'Окно заставки',
                description: 'Перемотки позже этой отметки не считаются заставкой'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: K_CREDIT, type: 'trigger', "default": true },
            field: { name: 'Учить титры', description: 'Запоминать также перемотку финальных титров' }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_view', type: 'button' },
            field: { name: 'Что выучено', description: 'Список сериалов и найденные отрезки' },
            onChange: function () {
                var db = readDb();
                var items = [];

                Object.keys(db).forEach(function (k) {
                    var rec = db[k];
                    ['intro', 'credits'].forEach(function (type) {
                        var seg = rec[type];
                        if (!seg || !seg.samples || !seg.samples.length) return;

                        var starts = seg.samples.map(function (x) { return x[0]; });
                        var ends   = seg.samples.map(function (x) { return x[1]; });

                        items.push({
                            title: (rec.title || k) + ' — ' +
                                   (type === 'intro' ? 'заставка' : 'титры'),
                            subtitle: fmt(median(starts)) + ' → ' + fmt(median(ends)) +
                                      '  (наблюдений: ' + seg.samples.length + ')'
                        });
                    });
                });

                selectShow('Выученные отрезки', items);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_reset', type: 'button' },
            field: { name: 'Сбросить обучение', description: 'Удалить всё выученное' },
            onChange: function () {
                selectShow('Сбросить обучение?', [
                    { title: 'Да, удалить всё', yes: true },
                    { title: 'Отмена' }
                ], function (item) {
                    if (!item.yes) return;
                    Lampa.Storage.set(DB, {});
                    Lampa.Noty.show('Обучение сброшено');
                });
            }
        });
    }

    // ── старт ────────────────────────────────────────────────────────────

    function boot() {
        try {
            settings();
            hookPlay();

            Lampa.Player.listener.follow('start', onStart);
            Lampa.Player.listener.follow('destroy', onDestroy);
            Lampa.PlayerVideo.listener.follow('timeupdate', onTime);

            var db = readDb();
            log('готов. сериалов в базе:', Object.keys(db).length);
        } catch (e) {
            log('ошибка старта:', e && e.message);
        }
    }

    if (window.appready) boot();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') boot();
    });
})();
