(function () {
    'use strict';

    /**
     * skip_learn.js — пропуск заставок, титров, рекапов и превью
     *
     * Источники таймкодов, в порядке приоритета:
     *   1. TheIntroDB   — основная база по TMDB id
     *   2. IntroDB      — по TMDB или IMDB id
     *   3. IntroHater   — по IMDB id
     *   4. AniSkip      — аниме, через Jikan → MAL id
     *   5. KP DB        — база по Кинопоиску (github ipavlin98)
     *   6. Своё обучение — если базы промолчали или ошиблись
     *
     * Всё остальное (кнопка, автопропуск, метки на шкале) плагин делает
     * сам, штатный Segments не используется.
     */

    if (window.skip_learn_ready) return;
    window.skip_learn_ready = true;

    // ── внешние источники ────────────────────────────────────────────────

    var TIDB_API = 'https://api.theintrodb.org/v2/media';
    var TIDB_KEY = 'theintrodb:user_3BfEUxCEHvAV12Kb1oJOjyNfLUr:4QnTxxv-Os1HM1dtC82DPej_J8UxULTNBQyN6JyrTzI';
    var IDB_API  = 'https://api.introdb.app';
    var IHAT_API = 'https://introhater.com/api/segments';
    var ANISKIP  = 'https://api.aniskip.com/v2/skip-times';
    var JIKAN    = 'https://api.jikan.moe/v4/anime';
    var KPDB     = 'https://raw.githubusercontent.com/ipavlin98/lmp-series-skip-db/refs/heads/main/database/';

    var REQ_TIMEOUT = 4000;

    // ── ключи хранилища ──────────────────────────────────────────────────

    var DB       = 'skip_learn_db';         // своё обучение
    var CACHE    = 'skip_learn_cache';      // ответы баз
    var K_ENABLE = 'skip_learn_enable';
    var K_MODE   = 'skip_learn_mode';       // button | auto | mark
    var K_KEY    = 'skip_learn_key';        // ok | right | touch
    var K_LEARN  = 'skip_learn_fallback';   // включить своё обучение
    var K_MIN    = 'skip_learn_min';
    var K_WINDOW = 'skip_learn_window';
    var K_CREDIT = 'skip_learn_credits';
    var K_OFFSET = 'skip_learn_offset';     // общее смещение меток, сек
    var K_SRC    = 'skip_learn_src_';       // + имя источника

    // типы сегментов, которые пропускаем
    var K_TYPE   = 'skip_learn_type_';      // + intro|recap|credits|preview

    var MIN_JUMP     = 15;
    var MAX_JUMP     = 180;
    var SEEK_GAP     = 3;
    var SEEK_REAL    = 1.5;
    var SEEK_SETTLE  = 1200;
    var SAMPLES      = 7;
    var KEYS_LIMIT   = 200;
    var CACHE_LIMIT  = 600;
    var CACHE_TTL    = 7 * 24 * 3600 * 1000;
    var CACHE_MISS_TTL = 24 * 3600 * 1000;   // «ничего не нашли» помним сутки
    var CREDITS_TAIL = 600;
    var SHOW_LEAD    = 2;

    var KEYS_OK    = [13, 29443, 65385];
    var KEYS_RIGHT = [39];

    var TITLES = {
        intro:   'Пропустить заставку',
        recap:   'Пропустить рекап',
        credits: 'Пропустить титры',
        preview: 'Пропустить превью'
    };

    var cur = null;

    function log() {
        var a = Array.prototype.slice.call(arguments);
        a.unshift('[skip_learn]');
        try { console.log.apply(console, a); } catch (e) {}
    }

    // ── настройки ────────────────────────────────────────────────────────

    function enabled()      { return Lampa.Storage.get(K_ENABLE, 'true') !== false; }
    function learnOn()      { return Lampa.Storage.get(K_LEARN, 'true') !== false; }
    function learnCredits() { return Lampa.Storage.get(K_CREDIT, 'true') !== false; }
    function mode()         { return Lampa.Storage.get(K_MODE, 'button') || 'button'; }
    function keyMode()      { return Lampa.Storage.get(K_KEY, 'ok') || 'ok'; }

    function srcOn(name) {
        var def = (name === 'kpdb') ? 'false' : 'true';
        return Lampa.Storage.get(K_SRC + name, def) !== false;
    }
    function typeOn(type) {
        var def = (type === 'preview') ? 'false' : 'true';
        return Lampa.Storage.get(K_TYPE + type, def) !== false;
    }
    function offset() {
        var n = parseInt(Lampa.Storage.get(K_OFFSET, '0'));
        return isNaN(n) ? 0 : n;
    }
    function minSamples() {
        var n = parseInt(Lampa.Storage.get(K_MIN, '2'));
        return isNaN(n) ? 2 : n;
    }
    function introWindow() {
        var n = parseInt(Lampa.Storage.get(K_WINDOW, '360'));
        return isNaN(n) ? 360 : n;
    }

    // ── общие утилиты ────────────────────────────────────────────────────

    function readObj(key) {
        try {
            var v = Lampa.Storage.get(key, '{}');
            if (typeof v === 'string') v = JSON.parse(v);
            return (v && typeof v === 'object') ? v : {};
        } catch (e) {
            return {};
        }
    }

    function writeObj(key, val, limit) {
        try {
            if (limit) {
                var keys = Object.keys(val);
                if (keys.length > limit) {
                    keys.sort(function (a, b) { return (val[a].ts || 0) - (val[b].ts || 0); });
                    keys.slice(0, keys.length - limit).forEach(function (k) { delete val[k]; });
                }
            }
            Lampa.Storage.set(key, val);
        } catch (e) {}
    }

    function median(list) {
        if (!list.length) return 0;
        var s = list.slice().sort(function (a, b) { return a - b; });
        var m = Math.floor(s.length / 2);
        return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
    }

    /**
     * XHR вместо fetch: в старых WebView (APK, minSdk 23) fetch и
     * AbortController есть не всегда, а таймаут нужен обязательно —
     * без него зависший источник задержит показ кнопки.
     */
    function request(url, headers) {
        return new Promise(function (resolve) {
            var done = false;
            var xhr;

            var timer = setTimeout(function () {
                done = true;
                try { xhr.abort(); } catch (e) {}
                resolve(null);
            }, REQ_TIMEOUT);

            try {
                xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.setRequestHeader('Accept', 'application/json');

                if (headers) {
                    for (var h in headers) xhr.setRequestHeader(h, headers[h]);
                }

                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4 || done) return;
                    clearTimeout(timer);
                    done = true;

                    if (xhr.status >= 200 && xhr.status < 300) {
                        try { resolve(JSON.parse(xhr.responseText)); }
                        catch (e) { resolve(null); }
                    } else {
                        resolve(null);
                    }
                };

                xhr.onerror = function () {
                    clearTimeout(timer);
                    if (!done) { done = true; resolve(null); }
                };

                xhr.send();
            } catch (e) {
                clearTimeout(timer);
                resolve(null);
            }
        });
    }

    function normType(raw) {
        var t = String(raw || '').toLowerCase();
        if (t.indexOf('credit') >= 0 || t === 'ed' || t.indexOf('outro') >= 0) return 'credits';
        if (t.indexOf('recap') >= 0) return 'recap';
        if (t.indexOf('preview') >= 0) return 'preview';
        return 'intro';
    }

    function seg(type, start, end) {
        if (start == null || end == null) return null;
        start = Math.round(start);
        end = Math.round(end);
        if (end <= start) return null;
        return { type: type, start: start, end: end, done: false, src: '' };
    }

    // ── идентификаторы карточки ──────────────────────────────────────────

    function tmdbId(card) { return card ? (card.tmdb_id || card.id || null) : null; }
    function imdbId(card) { return card ? (card.imdb_id || null) : null; }
    function kpId(card) {
        if (!card) return null;
        return card.kinopoisk_id || card.kp_id ||
               (card.source === 'kinopoisk' ? card.id : null) || null;
    }

    function isAnime(card) {
        if (!card) return false;
        var lang = (card.original_language || '').toLowerCase();
        if (lang === 'ja' || lang === 'zh' || lang === 'cn') return true;
        if (card.genres && card.genres.some) {
            return card.genres.some(function (g) { return g.id === 16 || g === 16; });
        }
        return false;
    }

    // ── источники ────────────────────────────────────────────────────────

    function srcTheIntroDb(card, s, e) {
        var id = tmdbId(card);
        if (!id) return Promise.resolve(null);

        var url = TIDB_API + '?tmdb_id=' + id + '&season=' + s + '&episode=' + e;

        return request(url, { 'Authorization': 'Bearer ' + TIDB_KEY }).then(function (d) {
            if (!d) return null;
            var out = [];

            // формат 1: массивы по типам — intro/recap/credits/preview
            ['intro', 'recap', 'credits', 'preview'].forEach(function (type) {
                var arr = d[type];
                if (!arr || !arr.length) return;
                arr.forEach(function (x) {
                    var a = x.start_ms != null ? x.start_ms / 1000 : x.start;
                    var b = x.end_ms != null ? x.end_ms / 1000 : x.end;
                    var v = seg(type, a, b);
                    if (v) out.push(v);
                });
            });

            // формат 2: общий список segments с полем type
            if (!out.length && d.segments && d.segments.length) {
                d.segments.forEach(function (x) {
                    var v = seg(normType(x.type), x.start, x.end);
                    if (v) out.push(v);
                });
            }

            // формат 3: одиночный отрезок
            if (!out.length && typeof d.start === 'number') {
                var one = seg('intro', d.start, d.end);
                if (one) out.push(one);
            }

            return out.length ? { segs: out, src: 'TheIntroDB' } : null;
        });
    }

    function srcIntroDb(card, s, e) {
        var t = tmdbId(card), i = imdbId(card);
        if (!t && !i) return Promise.resolve(null);

        var q = (i ? 'imdb=' + i : 'tmdb=' + t) + '&season=' + s + '&episode=' + e;

        return Promise.all([
            request(IDB_API + '/get_intros?' + q),
            request(IDB_API + '/get_credits?' + q)
        ]).then(function (r) {
            var out = [];
            var a = seg('intro', r[0] && r[0].start, r[0] && r[0].end);
            var b = seg('credits', r[1] && r[1].start, r[1] && r[1].end);
            if (a) out.push(a);
            if (b) out.push(b);
            return out.length ? { segs: out, src: 'IntroDB' } : null;
        });
    }

    function srcIntroHater(card, s, e) {
        var i = imdbId(card);
        if (!i) return Promise.resolve(null);

        return request(IHAT_API + '/' + i + ':' + s + ':' + e).then(function (d) {
            if (!d || !d.length) return null;
            var out = [];
            d.forEach(function (x) {
                var v = seg(normType(x.label), x.start, x.end);
                if (v) out.push(v);
            });
            return out.length ? { segs: out, src: 'IntroHater' } : null;
        });
    }

    function srcAniSkip(card, s, e) {
        if (!isAnime(card)) return Promise.resolve(null);

        var name = (card.original_name || card.original_title || card.name || '')
            .replace(/\(\d{4}\)/g, '')
            .replace(/\(TV\)/gi, '')
            .replace(/Season\s*\d+/gi, '')
            .replace(/[:\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (!name) return Promise.resolve(null);

        var year = String(card.release_date || card.first_air_date || '').slice(0, 4);
        var q = name + (s > 1 ? ' Season ' + s : '');

        return request(JIKAN + '?q=' + encodeURIComponent(q) + '&limit=10').then(function (j) {
            if (!j || !j.data || !j.data.length) return null;

            var mal = null;
            if (year && s === 1) {
                var m = j.data.find(function (it) {
                    var y = it.year || (it.aired && it.aired.from ? String(it.aired.from).slice(0, 4) : '');
                    return String(y) === year;
                });
                if (m) mal = m.mal_id;
            }
            if (!mal) mal = j.data[0].mal_id;
            if (!mal) return null;

            var url = ANISKIP + '/' + mal + '/' + e +
                      '?types=op&types=ed&types=recap&episodeLength=0';

            return request(url).then(function (d) {
                if (!d || !d.found || !d.results || !d.results.length) return null;

                var out = [];
                d.results.forEach(function (x) {
                    if (!x.interval) return;
                    var a = x.interval.startTime != null ? x.interval.startTime : x.interval.start_time;
                    var b = x.interval.endTime != null ? x.interval.endTime : x.interval.end_time;

                    var t = String(x.skipType || '').toLowerCase();
                    var type = t.indexOf('op') >= 0 ? 'intro'
                             : t.indexOf('ed') >= 0 ? 'credits'
                             : t === 'recap' ? 'recap' : 'intro';

                    var v = seg(type, a, b);
                    if (v) out.push(v);
                });

                return out.length ? { segs: out, src: 'AniSkip' } : null;
            });
        });
    }

    function srcKpDb(card, s, e) {
        var kp = kpId(card);
        if (!kp) return Promise.resolve(null);

        return request(KPDB + kp + '.json').then(function (db) {
            if (!db) return null;

            var list = (db[String(s)] && db[String(s)][String(e)]) || db.movie || null;
            if (!list || !list.length) return null;

            var out = [];
            list.forEach(function (x) {
                var v = seg(normType(x.name || x.type), x.start, x.end);
                if (v) out.push(v);
            });

            return out.length ? { segs: out, src: 'KP DB' } : null;
        });
    }

    var SOURCES = [
        { name: 'theintrodb', fn: srcTheIntroDb },
        { name: 'introdb',    fn: srcIntroDb },
        { name: 'introhater', fn: srcIntroHater },
        { name: 'aniskip',    fn: srcAniSkip },
        { name: 'kpdb',       fn: srcKpDb }
    ];

    // ── кэш ответов баз ──────────────────────────────────────────────────

    function cacheKey(card, s, e) {
        var id = tmdbId(card) || imdbId(card) || kpId(card);
        if (!id) return null;
        return id + '_s' + s + '_e' + e;
    }

    function cacheGet(key) {
        if (!key) return undefined;

        var all = readObj(CACHE);
        var it = all[key];
        if (!it) return undefined;

        var ttl = (it.segs && it.segs.length) ? CACHE_TTL : CACHE_MISS_TTL;
        if (Date.now() - (it.ts || 0) > ttl) return undefined;

        return it.segs || [];
    }

    function cacheSet(key, segs, src) {
        if (!key) return;
        var all = readObj(CACHE);
        all[key] = { segs: segs || [], src: src || '', ts: Date.now() };
        writeObj(CACHE, all, CACHE_LIMIT);
    }

    /**
     * Источники опрашиваются параллельно с индивидуальным таймаутом,
     * а не по очереди: последовательный обход в худшем случае стоил бы
     * пяти таймаутов подряд, и кнопка появилась бы после заставки.
     * Порядок приоритета восстанавливается уже по готовым результатам.
     */
    function fetchSegments(card, s, e) {
        var key = cacheKey(card, s, e);

        var cached = cacheGet(key);
        if (cached !== undefined) {
            log('кэш баз:', cached.length, 'сегмент(ов)');
            return Promise.resolve(cached.length ? cached.map(function (x) {
                return { type: x.type, start: x.start, end: x.end, done: false, src: x.src || 'кэш' };
            }) : null);
        }

        var active = SOURCES.filter(function (s2) { return srcOn(s2.name); });
        if (!active.length) return Promise.resolve(null);

        var jobs = active.map(function (s2) {
            return Promise.resolve()
                .then(function () { return s2.fn(card, s, e); })
                .catch(function (err) {
                    log(s2.name, 'ошибка:', err && err.message);
                    return null;
                });
        });

        return Promise.all(jobs).then(function (results) {
            var best = null;
            for (var i = 0; i < results.length; i++) {
                if (results[i] && results[i].segs && results[i].segs.length) { best = results[i]; break; }
            }

            if (!best) {
                cacheSet(key, [], '');
                log('базы ничего не дали');
                return null;
            }

            best.segs.forEach(function (x) { x.src = best.src; });
            cacheSet(key, best.segs, best.src);
            log('источник', best.src + ':', best.segs.length, 'сегмент(ов)');
            return best.segs;
        });
    }

    // ── своё обучение ────────────────────────────────────────────────────

    function makeKey(card, season) {
        var name = card && (card.original_name || card.original_title || card.name || card.title);
        if (!name) return null;
        return Lampa.Utils.hash(name) + '_s' + (season || 1);
    }

    function predict(key) {
        if (!key || !learnOn()) return null;

        var rec = readObj(DB)[key];
        if (!rec) return null;

        var need = minSamples();
        var out = [];

        ['intro', 'credits'].forEach(function (type) {
            var s = rec[type];
            if (!s || !s.samples || s.samples.length < need) return;

            out.push({
                type: type,
                start: median(s.samples.map(function (x) { return x[0]; })),
                end:   median(s.samples.map(function (x) { return x[1]; })),
                done: false,
                src: 'обучение'
            });
        });

        return out.length ? out : null;
    }

    function remember(type, from, to) {
        if (!cur || !cur.key || !learnOn()) return;

        var db  = readObj(DB);
        var rec = db[cur.key] || (db[cur.key] = { title: cur.title || '' });
        var s   = rec[type] || (rec[type] = { samples: [] });

        s.samples.push([Math.round(from), Math.round(to)]);
        if (s.samples.length > SAMPLES) s.samples = s.samples.slice(-SAMPLES);

        // базы для этого сериала оказались неточными — дальше верим себе
        if (cur.from_db) {
            rec.override = true;
            log('база промахнулась, дальше приоритет у обучения');
        }

        rec.ts = Date.now();
        rec.title = cur.title || rec.title;
        writeObj(DB, db, KEYS_LIMIT);

        log('запомнил', type, Math.round(from) + '\u2192' + Math.round(to),
            '(наблюдений: ' + s.samples.length + ')');

        var own = predict(cur.key);
        if (own) {
            cur.segs = own;
            cur.from_db = false;
            drawMarks();
        }
    }

    function forget(pos) {
        if (!cur || !cur.key || !cur.segs || cur.from_db) return;

        var hit = null;
        for (var i = 0; i < cur.segs.length; i++) {
            var s = cur.segs[i];
            if (pos >= s.start - 5 && pos <= s.end + 5) { hit = s; break; }
        }
        if (!hit) return;

        var db = readObj(DB);
        var rec = db[cur.key];
        if (!rec || !rec[hit.type] || !rec[hit.type].samples.length) return;

        rec[hit.type].samples.pop();
        rec.ts = Date.now();
        writeObj(DB, db, KEYS_LIMIT);

        cur.segs = predict(cur.key);
        drawMarks();
        log('промах по', hit.type, '\u2014 снял одно наблюдение');
    }

    function classify(from, to, duration) {
        var len = to - from;
        if (len < MIN_JUMP || len > MAX_JUMP) return null;
        if (from < introWindow()) return 'intro';
        if (learnCredits() && duration > 900 && from > duration - CREDITS_TAIL) return 'credits';
        return null;
    }

    // ── кнопка ───────────────────────────────────────────────────────────

    var Btn = {
        el: null,
        seg: null,

        css: function () {
            if (document.getElementById('skip_learn_css')) return;

            var s = document.createElement('style');
            s.id = 'skip_learn_css';
            s.innerHTML = ''
                + '.sl-btn{position:fixed!important;right:2.5em;bottom:11em;z-index:2000;'
                + 'display:flex;align-items:center;gap:.6em;'
                + 'padding:.8em 1.4em;border-radius:2em;'
                + 'background:rgba(20,20,22,.88);border:1px solid rgba(255,255,255,.18);'
                + 'color:#fff;font-size:1.1em;line-height:1;white-space:nowrap;cursor:pointer;'
                + 'opacity:0;transform:translate3d(1em,0,0);'
                + 'transition:opacity .22s,transform .22s;'
                + 'backface-visibility:hidden;will-change:opacity,transform;pointer-events:none}'
                + '.sl-btn.sl-on{opacity:1;transform:translate3d(0,0,0);pointer-events:auto}'
                + '.sl-btn svg{width:1.1em;height:1.1em;flex-shrink:0}'
                + '.sl-btn__hint{font-size:.72em;opacity:.5;margin-left:.3em}'
                + '.sl-seg{position:absolute;top:0;bottom:0;'
                + 'background:rgba(255,255,255,.45);border-radius:2px}';

            document.head.appendChild(s);
        },

        build: function () {
            if (this.el) return;
            this.css();

            var hint = '';
            if (keyMode() === 'ok') hint = 'OK';
            else if (keyMode() === 'right') hint = '\u2192';

            var el = document.createElement('div');
            el.className = 'sl-btn';
            el.innerHTML =
                '<svg viewBox="0 0 24 24" fill="currentColor">' +
                '<path d="M5 4l10 8-10 8V4z"/><rect x="17" y="4" width="3" height="16" rx="1"/>' +
                '</svg><span class="sl-btn__text">Пропустить</span>' +
                (hint ? '<span class="sl-btn__hint">' + hint + '</span>' : '');

            var self = this;
            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.fire();
            });

            document.body.appendChild(el);
            this.el = el;
        },

        show: function (s) {
            this.build();
            if (this.seg === s && this.el.classList.contains('sl-on')) return;

            this.seg = s;
            var t = this.el.querySelector('.sl-btn__text');
            if (t) t.innerText = TITLES[s.type] || 'Пропустить';

            this.el.classList.add('sl-on');
        },

        hide: function () {
            if (this.el) this.el.classList.remove('sl-on');
            this.seg = null;
        },

        visible: function () {
            return !!(this.el && this.el.classList.contains('sl-on'));
        },

        fire: function () {
            if (!this.seg) return;
            var s = this.seg;
            this.hide();
            doSkip(s);
        },

        destroy: function () {
            if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
            this.el = null;
            this.seg = null;
        }
    };

    /**
     * Свой прыжок помечаем флагом, иначе детектор перемотки примет его
     * за ручной и запишет собственный прогноз как новое наблюдение.
     */
    function doSkip(s) {
        s.done = true;
        if (cur) cur.ignore_seek = true;

        try {
            var v = Lampa.PlayerVideo.video();
            if (v) {
                v.currentTime = Math.min(s.end, v.duration || s.end);
                setTimeout(function () {
                    try { if (v.paused) v.play(); } catch (e) {}
                }, 100);
            }
        } catch (e) {}

        log('пропущено', s.type, '\u2192', Math.round(s.end), '(' + (s.src || '') + ')');
    }

    // ── клавиши ──────────────────────────────────────────────────────────

    var keyHandler = null;

    function activeKeys() {
        var m = keyMode();
        if (m === 'ok') return KEYS_OK;
        if (m === 'right') return KEYS_RIGHT;
        return [];
    }

    /**
     * Ядро вешает keydownTrigger на window (app_min.js, строка 3702) и
     * рассылает событие слушателям ДО проверки defaultPrevented, поэтому
     * подписка через Lampa.Keypad придёт уже после Controller. Слушаем
     * document в фазе перехвата — она срабатывает раньше window.
     */
    function bindKeys() {
        if (keyHandler) return;

        keyHandler = function (e) {
            if (!Btn.visible()) return;

            var keys = activeKeys();
            if (!keys.length) return;

            var code = e.keyCode || e.which;
            if (keys.indexOf(code) === -1) return;

            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();

            Btn.fire();
        };

        document.addEventListener('keydown', keyHandler, true);
    }

    function unbindKeys() {
        if (!keyHandler) return;
        document.removeEventListener('keydown', keyHandler, true);
        keyHandler = null;
    }

    // ── метки на шкале ───────────────────────────────────────────────────

    /**
     * Ядро в drawSegments чистит контейнер меток целиком (app_min.js,
     * строка 7903) и делает это на loadeddata, поэтому свои метки
     * дорисовываем после него.
     */
    function drawMarks() {
        try {
            if (!cur || !cur.segs) return;

            var box = document.querySelector('.player-panel__timeline-segments');
            if (!box) return;

            var old = box.querySelectorAll('.sl-seg');
            for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);

            var v = Lampa.PlayerVideo.video();
            var dur = v ? v.duration : 0;
            if (!dur) return;

            cur.segs.forEach(function (s) {
                if (!typeOn(s.type)) return;

                var a = Math.min(dur, s.start);
                var b = Math.min(dur, s.end);

                var m = document.createElement('div');
                m.className = 'sl-seg';
                m.style.left  = (a / dur * 100) + '%';
                m.style.width = ((b - a) / dur * 100) + '%';
                box.appendChild(m);
            });
        } catch (e) {}
    }

    // ── такт воспроизведения ─────────────────────────────────────────────

    function onTime(e) {
        if (!cur || !enabled()) return;

        var t = (e && typeof e.current === 'number') ? e.current : null;
        if (t === null) {
            try { t = Lampa.PlayerVideo.video().currentTime; } catch (err) { return; }
        }

        var dur = (e && e.duration) || cur.duration || 0;
        if (dur) cur.duration = dur;

        detectSeek(t);
        applySegments(t);
    }

    function applySegments(t) {
        if (!cur.segs || mode() === 'mark') { Btn.hide(); return; }

        var off = offset();
        var hit = null;

        for (var i = 0; i < cur.segs.length; i++) {
            var s = cur.segs[i];
            if (s.done || !typeOn(s.type)) continue;

            var a = Math.max(0, s.start + off);
            var b = Math.max(0, s.end + off);

            if (t >= a - SHOW_LEAD && t < b) { hit = s; break; }
        }

        if (!hit) { Btn.hide(); return; }

        if (mode() === 'auto') {
            doSkip(hit);
            Lampa.Noty.show((TITLES[hit.type] || 'Сегмент').replace('Пропустить', 'Пропущено:'));
            return;
        }

        Btn.show(hit);
    }

    /**
     * Ядро не шлёт timeupdate во время удержания перемотки (строка 12174:
     * `if (rewind_position == 0 && !_video.rewind)`). Поэтому смотрим не
     * на события, а на разрыв: медиавремя скакнуло, а реального прошло мало.
     */
    function detectSeek(t) {
        if (!learnOn()) return;

        var now = Date.now();

        if (cur.last === null) {
            cur.last = t;
            cur.last_ts = now;
            return;
        }

        var d_media = t - cur.last;
        var d_real  = (now - cur.last_ts) / 1000;

        if (cur.seeking) {
            if (t > cur.seek_to) cur.seek_to = t;
            clearTimeout(cur.settle);
            cur.settle = setTimeout(finishSeek, SEEK_SETTLE);
            cur.last = t;
            cur.last_ts = now;
            return;
        }

        if (d_media > SEEK_GAP && d_real < SEEK_REAL) {
            if (cur.ignore_seek) {
                cur.ignore_seek = false;
            } else {
                cur.seeking = true;
                cur.seek_from = cur.last;
                cur.seek_to = t;
                clearTimeout(cur.settle);
                cur.settle = setTimeout(finishSeek, SEEK_SETTLE);
            }
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

        var type = classify(from, to, cur.duration);
        if (!type) return;

        remember(type, from, to);
    }

    // ── метаданные серии ─────────────────────────────────────────────────

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
        if (out.season == null)  out.season = 1;
        if (out.episode == null) out.episode = 1;

        return out;
    }

    // ── жизненный цикл ───────────────────────────────────────────────────

    function onStart(data) {
        var m = meta(data);
        var key = m.card ? makeKey(m.card, m.season) : null;

        cur = {
            key: key,
            title: m.card ? (m.card.title || m.card.name || '') : '',
            duration: 0,
            last: null,
            last_ts: 0,
            seeking: false,
            seek_from: 0,
            seek_to: 0,
            settle: null,
            ignore_seek: false,
            from_db: false,
            segs: null,
            token: Date.now()
        };

        if (!enabled() || !m.card) return;

        bindKeys();

        var db  = readObj(DB);
        var rec = key ? db[key] : null;
        var own = predict(key);

        // базы для этого сериала уже промахивались — верим своему обучению
        if (rec && rec.override && own) {
            cur.segs = own;
            log('override: беру обучение,', own.length, 'сегмент(ов)');
            setTimeout(drawMarks, 500);
            return;
        }

        // пока базы отвечают, показываем то, что знаем сами
        if (own) {
            cur.segs = own;
            setTimeout(drawMarks, 500);
        }

        var token = cur.token;

        fetchSegments(m.card, m.season, m.episode).then(function (segs) {
            if (!cur || cur.token !== token) return;   // плеер уже сменился

            if (segs && segs.length) {
                cur.segs = segs;
                cur.from_db = true;
                drawMarks();
            } else if (!cur.segs) {
                log('нечего показать, учусь на перемотках');
            }
        });
    }

    function onDestroy() {
        if (cur && cur.settle) clearTimeout(cur.settle);
        cur = null;
        Btn.destroy();
        unbindKeys();
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

    function addTrigger(name, def, title, descr) {
        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: name, type: 'trigger', "default": def },
            field: { name: title, description: descr || '' }
        });
    }

    function settings() {
        Lampa.SettingsApi.addComponent({
            component: 'skip_learn',
            name: 'Пропуск заставок',
            icon: ICON
        });

        addTrigger(K_ENABLE, true, 'Включить',
            'Таймкоды из баз, при их отсутствии — обучение на ваших перемотках');

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_MODE,
                type: 'select',
                values: {
                    button: 'Показывать кнопку',
                    auto: 'Пропускать сразу',
                    mark: 'Только метка на шкале'
                },
                "default": 'button'
            },
            field: { name: 'Что делать', description: 'Поведение при входе в сегмент' }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_KEY,
                type: 'select',
                values: { ok: 'OK', right: 'Вправо', touch: 'Только касание' },
                "default": 'ok'
            },
            field: { name: 'Кнопка пропуска', description: 'Чем нажимать «Пропустить» с пульта' }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_OFFSET,
                type: 'select',
                values: {
                    '-10': '-10 сек', '-5': '-5 сек', '-3': '-3 сек',
                    '0': 'без смещения',
                    '3': '+3 сек', '5': '+5 сек', '10': '+10 сек'
                },
                "default": '0'
            },
            field: {
                name: 'Смещение меток',
                description: 'Если базы стабильно промахиваются на пару секунд'
            }
        });

        // ── что пропускать ──
        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_t_title', type: 'title' },
            field: { name: 'Что пропускать' }
        });

        addTrigger(K_TYPE + 'intro',   true,  'Заставка');
        addTrigger(K_TYPE + 'recap',   true,  'Рекап', 'Нарезка «в предыдущих сериях»');
        addTrigger(K_TYPE + 'credits', true,  'Титры');
        addTrigger(K_TYPE + 'preview', false, 'Превью', 'Анонс следующей серии');

        // ── источники ──
        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_s_title', type: 'title' },
            field: { name: 'Источники' }
        });

        addTrigger(K_SRC + 'theintrodb', true,  'TheIntroDB', 'Основная база, по TMDB');
        addTrigger(K_SRC + 'introdb',    true,  'IntroDB', 'По TMDB или IMDB');
        addTrigger(K_SRC + 'introhater', true,  'IntroHater', 'По IMDB');
        addTrigger(K_SRC + 'aniskip',    true,  'AniSkip', 'Аниме, опенинги и эндинги');
        addTrigger(K_SRC + 'kpdb',       false, 'KP DB', 'База по Кинопоиску с GitHub');

        // ── обучение ──
        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_l_title', type: 'title' },
            field: { name: 'Обучение' }
        });

        addTrigger(K_LEARN, true, 'Учиться на перемотках',
            'Работает там, где базы молчат, и перебивает базу, если она ошиблась');

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_MIN,
                type: 'select',
                values: { 1: 'После 1 раза', 2: 'После 2 раз', 3: 'После 3 раз' },
                "default": '2'
            },
            field: { name: 'Когда применять', description: 'Сколько перемоток нужно для вывода' }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: {
                name: K_WINDOW,
                type: 'select',
                values: { 180: '3 минуты', 300: '5 минут', 360: '6 минут', 600: '10 минут' },
                "default": '360'
            },
            field: { name: 'Окно заставки', description: 'Перемотки позже не считаются заставкой' }
        });

        addTrigger(K_CREDIT, true, 'Учить титры', 'Запоминать также перемотку финальных титров');

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_view', type: 'button' },
            field: { name: 'Что выучено', description: 'Отрезки, найденные самим плагином' },
            onChange: function () {
                var db = readObj(DB);
                var items = [];

                Object.keys(db).forEach(function (k) {
                    var rec = db[k];
                    ['intro', 'credits'].forEach(function (type) {
                        var s = rec[type];
                        if (!s || !s.samples || !s.samples.length) return;

                        items.push({
                            title: (rec.title || k) + ' — ' +
                                   (type === 'intro' ? 'заставка' : 'титры') +
                                   (rec.override ? '  •' : ''),
                            subtitle: fmt(median(s.samples.map(function (x) { return x[0]; }))) +
                                      ' \u2192 ' +
                                      fmt(median(s.samples.map(function (x) { return x[1]; }))) +
                                      '  (наблюдений: ' + s.samples.length + ')'
                        });
                    });
                });

                selectShow('Выученные отрезки', items);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_clear_cache', type: 'button' },
            field: { name: 'Очистить кэш баз', description: 'Перезапросить таймкоды заново' },
            onChange: function () {
                Lampa.Storage.set(CACHE, {});
                Lampa.Noty.show('Кэш баз очищен');
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'skip_learn',
            param: { name: 'skip_learn_reset', type: 'button' },
            field: { name: 'Сбросить обучение', description: 'Удалить выученные отрезки' },
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

            Lampa.Player.listener.follow('start', onStart);
            Lampa.Player.listener.follow('destroy', onDestroy);
            Lampa.PlayerVideo.listener.follow('timeupdate', onTime);

            Lampa.PlayerVideo.listener.follow('loadeddata', function () {
                setTimeout(drawMarks, 300);
            });

            log('готов. в базе обучения:', Object.keys(readObj(DB)).length,
                '| в кэше баз:', Object.keys(readObj(CACHE)).length);
        } catch (e) {
            log('ошибка старта:', e && e.message);
        }
    }

    if (window.appready) boot();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') boot();
    });
})();
