(function () {
    'use strict';

    // ============================================
    // Плагин: Полное удаление аниме из Лампы
    // Версия: 1.0
    // Установка: добавить в плагины Лампы
    // ============================================

    function startPlugin() {

        // --- 1. Убираем пункт "Аниме" из бокового меню ---
        function removeAnimeMenu() {
            var menuItems = document.querySelectorAll('.menu__item[data-action="anime"]');
            menuItems.forEach(function (item) {
                item.remove();
            });
        }

        // --- 2. Перехватываем меню — блокируем action "anime" ---
        Lampa.Listener.follow('menu', function (e) {
            if (e.type === 'action' && e.action === 'anime') {
                e.abort();
                Lampa.Noty.show('Аниме отключено плагином');
            }
        });

        // --- 3. Фильтрация карточек: убираем аниме из выдачи ---
        //    Аниме определяется как: японский язык + жанр анимация (id 16)
        function isAnimeCard(card) {
            if (!card) return false;

            var dominated_by_ja = (card.original_language === 'ja');
            var has_animation_genre = false;

            var genre_ids = card.genre_ids || [];
            if (card.genres && card.genres.length) {
                genre_ids = card.genres.map(function (g) { return g.id; });
            }
            has_animation_genre = genre_ids.indexOf(16) !== -1;

            // Японский контент с жанром "анимация" = аниме
            if (dominated_by_ja && has_animation_genre) return true;

            // Проверка по названию — содержит японские символы + анимация
            var name = card.original_name || card.original_title || '';
            if (has_animation_genre && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(name)) return true;

            return false;
        }

        function filterAnimeFromResults(results) {
            if (!results || !Array.isArray(results)) return results;
            return results.filter(function (card) {
                return !isAnimeCard(card);
            });
        }

        // --- 4. Перехват отрисовки карточек на главной и в категориях ---
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' && e.data) {
                if (e.data.movie && isAnimeCard(e.data.movie)) {
                    // Можно скрыть, но карточку уже открыли — оставляем
                }
            }
        });

        // --- 5. Перехват API-ответов через Activity ---
        Lampa.Listener.follow('activity', function (e) {
            if (e.type === 'archive' && e.object && e.object.activity) {
                var component = e.object.activity.component;
                if (component === 'anime' || 
                    (e.object.activity.url && e.object.activity.url === 'anime')) {
                    // Блокируем открытие категории аниме
                    Lampa.Activity.backward();
                }
            }
        });

        // --- 6. Патчим рендер карточек — убираем аниме из любых списков ---
        var originalAppend = Lampa.Api.sources;
        
        // Перехватываем событие отрисовки строк контента
        Lampa.Listener.follow('content_rows', function (e) {
            if (e.results) {
                e.results = filterAnimeFromResults(e.results);
            }
        });

        // --- 7. CSS: скрываем всё что связано с аниме в меню ---
        var style = document.createElement('style');
        style.textContent = [
            '.menu__item[data-action="anime"] { display: none !important; }',
            '.menu-edit-list__item[data-action="anime"] { display: none !important; }'
        ].join('\n');
        document.head.appendChild(style);

        // --- 8. Перехват загрузки компонентов — фильтрация "продолжить просмотр" ---
        var origContinues = Lampa.Favorite.continues;
        if (origContinues) {
            Lampa.Favorite.continues = function (type) {
                if (type === 'anime') return [];
                var result = origContinues.apply(this, arguments);
                return filterAnimeFromResults(result);
            };
        }

        // --- 9. Фильтрация в главной ленте (main) ---
        Lampa.Listener.follow('start', function (e) {
            if (e.type === 'complite' && e.data && e.data.results) {
                e.data.results = filterAnimeFromResults(e.data.results);
            }
        });

        // --- 10. Убираем аниме из списка children (services) ---
        //     Перехватываем создание меню каталога
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                removeAnimeMenu();

                // Повторная очистка через таймер (меню может перерисоваться)
                setInterval(removeAnimeMenu, 3000);
            }
        });

        // --- 11. Патч рекомендаций — фильтруем аниме из "Похожие" ---
        var origXHROpen = XMLHttpRequest.prototype.open;
        var origXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function () {
            this._url = arguments[1] || '';
            return origXHROpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function () {
            var self = this;

            this.addEventListener('load', function () {
                try {
                    if (self._url && (
                        self._url.indexOf('/recommendations') !== -1 ||
                        self._url.indexOf('/similar') !== -1 ||
                        self._url.indexOf('discover') !== -1 ||
                        self._url.indexOf('trending') !== -1 ||
                        self._url.indexOf('now_playing') !== -1 ||
                        self._url.indexOf('popular') !== -1
                    )) {
                        var data = JSON.parse(self.responseText);
                        if (data && data.results) {
                            data.results = filterAnimeFromResults(data.results);

                            Object.defineProperty(self, 'responseText', {
                                get: function () { return JSON.stringify(data); }
                            });
                            Object.defineProperty(self, 'response', {
                                get: function () { return JSON.stringify(data); }
                            });
                        }
                    }
                } catch (e) {
                    // Тихо игнорируем ошибки парсинга
                }
            });

            return origXHRSend.apply(this, arguments);
        };

        // --- 12. Перехват fetch-запросов ---
        var origFetch = window.fetch;
        window.fetch = function () {
            var url = arguments[0];
            if (typeof url === 'string' && url.indexOf('cat=anime') !== -1) {
                // Блокируем запросы к категории аниме
                return Promise.resolve(new Response(JSON.stringify({ results: [] }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }

            return origFetch.apply(this, arguments).then(function (response) {
                var cloned = response.clone();

                if (typeof url === 'string' && (
                    url.indexOf('/recommendations') !== -1 ||
                    url.indexOf('/similar') !== -1 ||
                    url.indexOf('discover') !== -1 ||
                    url.indexOf('trending') !== -1
                )) {
                    return cloned.json().then(function (data) {
                        if (data && data.results) {
                            data.results = filterAnimeFromResults(data.results);
                        }
                        return new Response(JSON.stringify(data), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }).catch(function () {
                        return response;
                    });
                }

                return response;
            });
        };

        console.log('No-Anime Plugin', 'Плагин удаления аниме загружен');
    }

    // Запуск плагина
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
