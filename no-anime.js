
(function () {
    'use strict';

    // ============================================
    // Плагин: Полное удаление аниме из Лампы
    // Версия: 2.0
    // ============================================

    var ANIME_GENRE_ID = 16; // Animation

    // --- Определение аниме-карточки ---
    function isAnimeCard(card) {
        if (!card) return false;

        var dominated_by_ja = (card.original_language === 'ja');

        var genre_ids = card.genre_ids || [];
        if (card.genres && card.genres.length) {
            genre_ids = card.genres.map(function (g) { return g.id || g; });
        }
        var has_animation = genre_ids.indexOf(ANIME_GENRE_ID) !== -1;

        // Японский + анимация = аниме
        if (dominated_by_ja && has_animation) return true;

        // Японские символы в оригинальном названии + анимация
        var name = card.original_name || card.original_title || '';
        if (has_animation && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(name)) return true;

        return false;
    }

    function filterResults(results) {
        if (!results || !Array.isArray(results)) return results;
        return results.filter(function (card) {
            return !isAnimeCard(card);
        });
    }

    function startPlugin() {

        // =============================================
        // 1. УБИРАЕМ ПУНКТ МЕНЮ "АНИМЕ"
        // =============================================
        var style = document.createElement('style');
        style.textContent = [
            '.menu__item[data-action="anime"] { display: none !important; }',
            '.menu-edit-list__item[data-action="anime"] { display: none !important; }'
        ].join('\n');
        document.head.appendChild(style);

        function removeAnimeMenuItems() {
            document.querySelectorAll('.menu__item[data-action="anime"]').forEach(function (el) {
                el.remove();
            });
        }
        removeAnimeMenuItems();

        // =============================================
        // 2. БЛОКИРУЕМ ПЕРЕХОД В РАЗДЕЛ АНИМЕ
        // =============================================
        Lampa.Listener.follow('menu', function (e) {
            if (e.type === 'action' && e.action === 'anime') {
                e.abort();
                Lampa.Noty.show('Аниме отключено');
            }
        });

        // =============================================
        // 3. ПАТЧ Favorite.continues — убираем аниме из "Продолжить"
        // =============================================
        if (Lampa.Favorite && Lampa.Favorite.continues) {
            var _origContinues = Lampa.Favorite.continues;
            Lampa.Favorite.continues = function (type) {
                if (type === 'anime') return [];
                var result = _origContinues.apply(this, arguments);
                return filterResults(result);
            };
        }

        // =============================================
        // 4. ПЕРЕХВАТ СОЗДАНИЯ КАРТОЧЕК
        // =============================================
        if (Lampa.Utils && Lampa.Utils.createInstance) {
            var _origCreate = Lampa.Utils.createInstance;
            Lampa.Utils.createInstance = function (BaseClass, element) {
                if (element && isAnimeCard(element)) {
                    return null;
                }
                return _origCreate.apply(this, arguments);
            };
        }

        // =============================================
        // 5. ПЕРЕХВАТ РЕНДЕРА СТРОК КОНТЕНТА
        // =============================================
        Lampa.Listener.follow('line', function (e) {
            if (e.data && e.data.results) {
                e.data.results = filterResults(e.data.results);
            }
        });

        // =============================================
        // 6. ПЕРЕХВАТ ACTIVITY
        // =============================================
        Lampa.Listener.follow('activity', function (e) {
            if (e.type === 'start' && e.object) {
                if (e.object.url === 'anime') {
                    e.object.url = 'tv';
                }
                if (e.object.results) {
                    e.object.results = filterResults(e.object.results);
                }
            }
        });

        // =============================================
        // 7. MUTATION OBSERVER — удаляем аниме-карточки из DOM
        // =============================================
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) return;

                    var cards = [];
                    if (node.classList && node.classList.contains('card')) {
                        cards.push(node);
                    }
                    if (node.querySelectorAll) {
                        var found = node.querySelectorAll('.card');
                        for (var i = 0; i < found.length; i++) cards.push(found[i]);
                    }

                    cards.forEach(function (cardEl) {
                        var data = cardEl.card_data;
                        if (data && isAnimeCard(data)) {
                            cardEl.remove();
                        }
                    });
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // =============================================
        // 8. ПЕРИОДИЧЕСКАЯ ОЧИСТКА (каждые 2 сек)
        // =============================================
        setInterval(function () {
            removeAnimeMenuItems();

            document.querySelectorAll('.card').forEach(function (cardEl) {
                var data = cardEl.card_data;
                if (data && isAnimeCard(data)) {
                    cardEl.remove();
                }
            });
        }, 2000);

        // =============================================
        // 9. ПЕРЕХВАТ XHR
        // =============================================
        var _origXhrOpen = XMLHttpRequest.prototype.open;
        var _origXhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function () {
            this._noAnimeUrl = arguments[1] || '';
            return _origXhrOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function () {
            var self = this;

            this.addEventListener('load', function () {
                try {
                    var url = self._noAnimeUrl || '';
                    if (url.indexOf('cat=anime') !== -1 ||
                        url.indexOf('/discover') !== -1 ||
                        url.indexOf('/trending') !== -1 ||
                        url.indexOf('/popular') !== -1 ||
                        url.indexOf('/top_rated') !== -1 ||
                        url.indexOf('/recommendations') !== -1 ||
                        url.indexOf('/similar') !== -1 ||
                        url.indexOf('/now_playing') !== -1 ||
                        url.indexOf('sort=') !== -1) {

                        var data = JSON.parse(self.responseText);

                        if (url.indexOf('cat=anime') !== -1) {
                            data.results = [];
                        } else if (data && data.results) {
                            data.results = filterResults(data.results);
                        }

                        var newResponse = JSON.stringify(data);
                        Object.defineProperty(self, 'responseText', {
                            get: function () { return newResponse; },
                            configurable: true
                        });
                        Object.defineProperty(self, 'response', {
                            get: function () { return newResponse; },
                            configurable: true
                        });
                    }
                } catch (e) { }
            });

            return _origXhrSend.apply(this, arguments);
        };

        // =============================================
        // 10. ПЕРЕХВАТ FETCH
        // =============================================
        var _origFetch = window.fetch;
        window.fetch = function () {
            var url = typeof arguments[0] === 'string' ? arguments[0] : (arguments[0] && arguments[0].url) || '';

            if (url.indexOf('cat=anime') !== -1) {
                return Promise.resolve(new Response(JSON.stringify({ results: [], total_pages: 0, total_results: 0 }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }

            return _origFetch.apply(this, arguments).then(function (response) {
                if (url.indexOf('/discover') !== -1 ||
                    url.indexOf('/trending') !== -1 ||
                    url.indexOf('/popular') !== -1 ||
                    url.indexOf('/top_rated') !== -1 ||
                    url.indexOf('/recommendations') !== -1 ||
                    url.indexOf('/similar') !== -1 ||
                    url.indexOf('sort=') !== -1) {

                    var cloned = response.clone();
                    return cloned.text().then(function (text) {
                        try {
                            var data = JSON.parse(text);
                            if (data && data.results) {
                                data.results = filterResults(data.results);
                            }
                            return new Response(JSON.stringify(data), {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                        } catch (e) {
                            return response;
                        }
                    });
                }

                return response;
            });
        };

        // =============================================
        // 11. ПЕРЕХВАТ ВНУТРЕННЕЙ СЕТИ ЛАМПЫ (Lampa.Reguest)
        // =============================================
        if (Lampa.Reguest) {
            var proto = Lampa.Reguest.prototype;

            ['native', 'silent', 'timeout'].forEach(function (method) {
                if (!proto[method]) return;
                var _orig = proto[method];

                proto[method] = function (url, success, error, post, params) {
                    if (typeof url === 'string' && url.indexOf('cat=anime') !== -1) {
                        if (success) success({ results: [], total_pages: 0, total_results: 0 });
                        return;
                    }

                    var wrappedSuccess = function (data) {
                        if (data && data.results) {
                            data.results = filterResults(data.results);
                        }
                        if (success) success(data);
                    };

                    return _orig.call(this, url, wrappedSuccess, error, post, params);
                };
            });
        }

        // =============================================
        // 12. СЛУШАЕМ СОБЫТИЯ СТАРТА И КАТАЛОГА
        // =============================================
        Lampa.Listener.follow('start', function (e) {
            if (e.type === 'complite' && e.data && e.data.results) {
                e.data.results = filterResults(e.data.results);
            }
        });

        Lampa.Listener.follow('catalog', function (e) {
            if (e.menu) {
                e.menu = e.menu.filter(function (item) {
                    return item.url !== 'anime' && item.action !== 'anime';
                });
            }
        });

        // =============================================
        // 13. ПОЛНАЯ БЛОКИРОВКА — перехват событий full (карточка фильма)
        //     Если пользователь как-то открыл аниме — перенаправляем назад
        // =============================================
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' && e.data && e.data.movie) {
                if (isAnimeCard(e.data.movie)) {
                    Lampa.Noty.show('Этот контент заблокирован (аниме)');
                    Lampa.Activity.backward();
                }
            }
        });

        console.log('No-Anime Plugin v2.0', 'Аниме полностью удалено из Лампы');
    }

    // Запуск
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

})();
