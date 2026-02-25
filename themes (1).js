(function() {
    'use strict';
    
    Lampa.Lang.add({
        maxsm_themes: {
            ru: "Темы",
            en: "Themes",
            uk: "Теми",
            be: "Тэмы",
            zh: "主题",
            pt: "Temas",
            bg: "Теми",
            he: "ערכות נושא",
            cs: "Témata"
        },
        maxsm_themes_theme: {
            ru: "Тема оформления",
            en: "Interface theme",
            uk: "Тема оформлення",
            be: "Тэма афармлення",
            zh: "界面主题",
            pt: "Tema de interface",
            bg: "Тема на интерфейса",
            he: "ערכת נושא לממשק",
            cs: "Téma rozhraní"
        },
        maxsm_themes_animations: {
            ru: "Анимации",
            en: "Animations",
            uk: "Анімації",
            be: "Анімацыі",
            zh: "动画",
            pt: "Animações",
            bg: "Анимации",
            he: "אנימציות",
            cs: "Animace"
        },
        maxsm_themes_translate_tv: {
            ru: "Переводить TV",
            en: "Translate TV",
            uk: "Перекладати TV",
            be: "Перакладаць TV",
            zh: "翻译 TV",
            pt: "Traduzir TV",
            bg: "Превеждане на TV",
            he: "לתרגם TV",
            cs: "Přeložit TV"
        },
        maxsm_themes_tvcaption: {
            ru: "СЕРИАЛ",       
            en: "SERIES",   
            uk: "СЕРІАЛ",    
            be: "СЕРЫЯЛ",     
            zh: "剧集",       
            pt: "SÉRIE",     
            bg: "СЕРИАЛ",      
            he: "סִדְרָה",  
            cs: "SERIÁL" 
        },
        maxsm_themes_incardtemplate: {
            ru: "Раздельные кнопки в карточке",
            en: "Separate buttons in the card",
            uk: "Окремі кнопки в картці",
            be: "Асобныя кнопкі ў картцы",
            zh: "卡片中的独立按钮",
            pt: "Botões separados no cartão",
            bg: "Отделни бутони в картата",
            he: "כפתורים נפרדים בכרטיס",
            cs: "Samostatná tlačítka na kartě"
        },
        maxsm_themes_bigbuttons: {
            ru: "Большие кнопки в карточке",
            en: "Large buttons in card",
            uk: "Великі кнопки в картці",
            be: "Вялікія кнопкі ў картцы",
            zh: "卡片中的大按钮",
            pt: "Botões grandes no cartão",
            bg: "Големи бутони в картата",
            he: "כפתורים גדולים בכרטיס",
            cs: "Velká tlačítka v kartě"
        }
    });
    
    var themes_svg = '<!-- icon666.com - MILLIONS OF FREE VECTOR ICONS --><svg viewBox="0 0 512.00026 512" xmlns="http://www.w3.org/2000/svg"><path d="m491.238281 20.761719c-14.375-14.375-34.265625-21.890625-54.550781-20.625-20.289062 1.269531-39.078125 11.207031-51.550781 27.261719l-98.660157 127.007812-41.109374-41.109375c-12.015626-12.019531-27.996094-18.636719-44.988282-18.636719-16.996094 0-32.972656 6.617188-44.992187 18.636719l-142.363281 142.363281c-17.363282 17.363282-17.363282 45.617188 0 62.980469l180.335937 180.335937c8.679687 8.683594 20.085937 13.023438 31.488281 13.023438 11.40625 0 22.808594-4.339844 31.492188-13.023438l142.363281-142.363281c12.019531-12.019531 18.636719-27.996093 18.636719-44.992187 0-16.992188-6.617188-32.972656-18.636719-44.988282l-41.109375-41.109374 127.007812-98.660157c16.054688-12.472656 25.992188-31.261719 27.261719-51.550781 1.269531-20.292969-6.25-40.175781-20.625-54.550781zm-276.386719 456.722656-15.898437-15.898437 22.957031-22.957032c5.933594-5.9375 5.933594-15.558594 0-21.496094-5.933594-5.933593-15.558594-5.933593-21.492187 0l-22.957031 22.957032-10.152344-10.148438 44.210937-44.210937c5.9375-5.933594 5.9375-15.558594 0-21.492188-5.933593-5.9375-15.558593-5.9375-21.492187 0l-44.210938 44.210938-42.265625-42.265625 22.957031-22.957032c5.9375-5.9375 5.9375-15.558593 0-21.496093-5.933593-5.933594-15.558593-5.933594-21.492187 0l-22.957031 22.957031-10.152344-10.148438 44.210938-44.210937c5.9375-5.933594 5.9375-15.558594 0-21.492187-5.933594-5.9375-15.558594-5.9375-21.492188 0l-44.210938 44.210937-15.898437-15.898437c-5.511719-5.511719-5.511719-14.484376 0-19.996094l77.199219-77.195313 200.328125 200.328125-77.199219 77.199219c-5.511719 5.511719-14.480469 5.511719-19.992188 0zm118.6875-98.695313-200.328124-200.328124 18.175781-18.175782 200.328125 200.328125zm53.40625-67.167968c0 8.875-3.457031 17.222656-9.734374 23.496094l-4 4.003906-191.484376-191.480469-8.847656-8.847656 4.003906-4.003907c6.273438-6.277343 14.621094-9.730468 23.496094-9.730468s17.21875 3.453125 23.492188 9.730468l153.339844 153.335938c6.277343 6.277344 9.734374 14.621094 9.734374 23.496094zm94.578126-238.210938c-.726563 11.589844-6.398438 22.324219-15.570313 29.449219l-130.019531 101-27.796875-27.792969 101.003906-130.019531c7.125-9.171875 17.855469-14.847656 29.449219-15.570313 11.578125-.71875 22.945312 3.566407 31.15625 11.777344 8.210937 8.210938 12.503906 19.570313 11.777344 31.15625zm0 0" fill="#000000" style="fill: rgb(255, 255, 255);"></path><path d="m439.84375 56.953125c-7.949219 0-15.566406 6.992187-15.195312 15.199219.367187 8.234375 6.675781 15.199218 15.195312 15.199218 7.953125 0 15.566406-6.988281 15.199219-15.199218-.367188-8.234375-6.675781-15.199219-15.199219-15.199219zm0 0" fill="#000000" style="fill: rgb(255, 255, 255);"></path></svg>';
    
    var img_load_svg = '<svg width="300" height="450" viewBox="0 0 1080 1620" fill="none" xmlns="http://www.w3.org/2000/svg"><style type="text/css"><![CDATA[	.st0{fill:#fff; fill-opacity: 0.5;}]]></style>  <!-- Фон -->  <rect width="100%" height="100%" fill="#3E3E3E"/><g transform="translate(280, 580)">	<path class="st0" d="M18.941,474.5c0,20.719,16.781,37.5,37.5,37.5h404.984c20.703,0,37.5-16.781,37.5-37.5V235.813H18.941V474.5zM226.675,364v-54.156c0-0.781,0.422-1.484,1.078-1.859c0.672-0.375,1.484-0.359,2.141,0.031l90.75,54.172		c0.641,0.375,1.031,1.078,1.031,1.813c0,0.75-0.391,1.453-1.031,1.828L229.894,420c-0.656,0.406-1.469,0.422-2.141,0.031		c-0.656-0.375-1.078-1.078-1.078-1.859V364z"/>	<polygon class="st0" points="82.285,144.531 128.972,212.016 193.3,212.016 146.613,144.531 	"/>	<polygon class="st0" points="197.472,144.531 244.175,212.016 308.519,212.016 261.816,144.531 	"/>	<path class="st0" d="M18.941,212.016h59.156L31.41,144.531l33.672-74.875l-21.313,3.953C23.41,77.375,9.941,96.906,13.707,117.281		l5.234,28.375V212.016z"/>	<polygon class="st0" points="312.675,144.531 359.363,212.016 423.722,212.016 377.019,144.531 	"/>	<polygon class="st0" points="427.894,144.531 474.565,212.016 498.925,212.016 498.925,144.531 	"/>	<polygon class="st0" points="178.363,48.766 115.097,60.438 81.441,135.281 144.707,123.609 	"/>	<polygon class="st0" points="291.66,27.844 228.394,39.531 194.722,114.375 257.988,102.688 	"/>	<polygon class="st0" points="404.957,6.938 341.675,18.625 308.019,93.469 371.285,81.781 	"/>	<path class="st0" d="M485.706,30.172c-3-16.328-16.188-28.016-31.766-30.172L421.3,72.563l69.859-12.875L485.706,30.172z"/></g></svg>';
    
    var player_svg = '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="512" height="512" x="0" y="0" viewBox="0 0 30.051 30.051" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g xmlns="http://www.w3.org/2000/svg">	<path d="M19.982,14.438l-6.24-4.536c-0.229-0.166-0.533-0.191-0.784-0.062c-0.253,0.128-0.411,0.388-0.411,0.669v9.069   c0,0.284,0.158,0.543,0.411,0.671c0.107,0.054,0.224,0.081,0.342,0.081c0.154,0,0.31-0.049,0.442-0.146l6.24-4.532   c0.197-0.145,0.312-0.369,0.312-0.607C20.295,14.803,20.177,14.58,19.982,14.438z" fill="#ffffff" data-original="#000000" style="" class=""/>	<path d="M15.026,0.002C6.726,0.002,0,6.728,0,15.028c0,8.297,6.726,15.021,15.026,15.021c8.298,0,15.025-6.725,15.025-15.021   C30.052,6.728,23.324,0.002,15.026,0.002z M15.026,27.542c-6.912,0-12.516-5.601-12.516-12.514c0-6.91,5.604-12.518,12.516-12.518   c6.911,0,12.514,5.607,12.514,12.518C27.541,21.941,21.937,27.542,15.026,27.542z" fill="#ffffff" data-original="#000000" style="" class=""/></g></svg>';

    var bookmark_svg = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path fill="#fff" d="M391.416,0H120.584c-17.778,0-32.242,14.464-32.242,32.242v460.413c0,7.016,3.798,13.477,9.924,16.895			c2.934,1.638,6.178,2.45,9.421,2.45c3.534,0,7.055-0.961,10.169-2.882l138.182-85.312l138.163,84.693			c5.971,3.669,13.458,3.817,19.564,0.387c6.107-3.418,9.892-9.872,9.892-16.875V32.242C423.657,14.464,409.194,0,391.416,0z			 M384.967,457.453l-118.85-72.86c-6.229-3.817-14.07-3.798-20.28,0.032l-118.805,73.35V38.69h257.935V457.453z"/>	</g></g></svg>';
    
    var like_svg = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 477.534 477.534" style="enable-background:new 0 0 477.534 477.534;" xml:space="preserve"><g>	<g>		<path fill="#fff" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909			l-8.431-8.909C181.284,5.762,98.662,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778			c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654			c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z M413.787,234.226h-0.017			L238.802,418.768L63.818,234.226c-39.78-42.916-39.78-109.233,0-152.149c36.125-39.154,97.152-41.609,136.306-5.484			c1.901,1.754,3.73,3.583,5.484,5.484l20.804,21.948c6.856,6.812,17.925,6.812,24.781,0l20.804-21.931			c36.125-39.154,97.152-41.609,136.306-5.484c1.901,1.754,3.73,3.583,5.484,5.484C453.913,125.078,454.207,191.516,413.787,234.226			z"/>	</g></g></svg>';
    
     var time_svg = '<?xml version="1.0" encoding="iso-8859-1"?><!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path fill="#fff" d="M347.216,301.211l-71.387-53.54V138.609c0-10.966-8.864-19.83-19.83-19.83c-10.966,0-19.83,8.864-19.83,19.83v118.978			c0,6.246,2.935,12.136,7.932,15.864l79.318,59.489c3.569,2.677,7.734,3.966,11.878,3.966c6.048,0,11.997-2.717,15.884-7.952			C357.766,320.208,355.981,307.775,347.216,301.211z"/>	</g></g><g>	<g>		<path fill="#fff" d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.833,256-256S397.167,0,256,0z M256,472.341			c-119.275,0-216.341-97.066-216.341-216.341S136.725,39.659,256,39.659c119.295,0,216.341,97.066,216.341,216.341			S375.275,472.341,256,472.341z"/>	</g></g></svg>';
    
    // Основной объект плагина
    var maxsm_themes = {
        // Название плагина
        name: 'maxsm_themes',
        // Версия плагина
        version: '2.6.1',
        // Настройки по умолчанию
        settings: {
            theme: 'mint_dark'
        }
    };

    // Была ли предыдущая тема стоковая
    var prevtheme = '';
    // Запускаем только один раз
    var onetime = false;

    // Цвета loader'а для каждой темы
    var loaderColors = {
        "default": '#fff',
        violet_blue: '#6a11cb',
        mint_dark: '#3da18d',
        deep_aurora: '#7e7ed9',
        crystal_cyan: '#7ed0f9',
        amber_noir: '#f4a261',
        velvet_sakura: '#f6a5b0'
    };
    
    // Функция для кодирования SVG (корректная обработка спецсимволов)
    function encodeSVG(svg) {
      return svg
        .replace(/"/g, "'") // Заменяем двойные кавычки на одинарные
        .replace(/%/g, '%25') // Экранируем %
        .replace(/</g, '%3C') // Экранируем <
        .replace(/>/g, '%3E') // Экранируем >
        .replace(/#/g, '%23') // Экранируем # (важно для цветов!)
        .replace(/{/g, '%7B') // Экранируем {
        .replace(/}/g, '%7D') // Экранируем }
        .replace(/\s+/g, ' '); // Убираем лишние пробелы
    }

    // Функция для применения тем
    function applyTheme(theme) {
        // Удаляем предыдущие стили темы
        $('#maxsm_themes_theme').remove();

        if (
            prevtheme !== '' &&
            (
                (prevtheme === 'default' && theme !== 'default') ||
                (prevtheme !== 'default' && theme === 'default')
            )
        ) {
            window.location.reload();
        }

        prevtheme = theme;

        // Если выбрано "Нет", просто удаляем стили
        if (theme === 'default') {
            removeAdditionalSettings();
            return;
        }

        var color = loaderColors[theme] || loaderColors["default"];

        var svgCode = encodeURIComponent("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"135\" height=\"140\" fill=\"".concat(color, "\"><rect width=\"10\" height=\"40\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"20\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"40\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.4s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.4s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"60\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.6s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.6s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"80\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"0.8s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"0.8s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"100\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"1s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"1s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect><rect width=\"10\" height=\"40\" x=\"120\" y=\"100\" rx=\"6\"><animate attributeName=\"height\" begin=\"1.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"40;100;40\" keyTimes=\"0;0.5;1\"/><animate attributeName=\"y\" begin=\"1.2s\" calcMode=\"linear\" dur=\"1s\" repeatCount=\"indefinite\" values=\"100;40;100\" keyTimes=\"0;0.5;1\"/></rect></svg>"));


        // Создаем новый стиль
        var style = $('<style id="maxsm_themes_theme"></style>');

        // Определяем стили для разных тем
        var themes = {
            mint_dark: "\n.navigation-bar__body\n{background: rgba(18, 32, 36, 0.96);\n}\n.card__quality,\n .card__type::after,\n .card--tv .card__type {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #0a1b2a, #1a4036) !important;\ncolor: #ffffff !important;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #1e2c2f;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #1e6262, #3da18d);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(61, 161, 141, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.watched-history.selector.focus::after,.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #3da18d;\nbox-shadow: 0 0 0.8em rgba(61, 161, 141, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #3da18d, #1e6262);\n}\n.modal__content {\nbackground: rgba(18, 32, 36, 0.96);\nborder: 0em solid rgba(18, 32, 36, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(18, 32, 36, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #1a3b36cc;\nborder: 0.2em solid #3da18d;\n}\n"),
            crystal_cyan: "\n.navigation-bar__body\n{background: rgba(10, 25, 40, 0.96);\n}\n.card__quality,\n .card__type::after,\n .card--tv .card__type {\nbackground: linear-gradient(to right, #00d2ff, #3a8ee6);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #081822, #104059) !important;\ncolor: #ffffff !important;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #112b3a;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #00d2ff, #3a8ee6);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #00d2ff, #3a8ee6);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(72, 216, 255, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.watched-history.selector.focus::after,.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #00d2ff;\nbox-shadow: 0 0 0.8em rgba(72, 216, 255, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #00d2ff, #3a8ee6);\n}\n.modal__content {\nbackground: rgba(10, 25, 40, 0.96);\nborder: 0em solid rgba(10, 25, 40, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(10, 25, 40, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #0c2e45cc;\nborder: 0.2em solid #00d2ff;\n}\n"),
            deep_aurora: "\n.navigation-bar__body\n{background: rgba(18, 34, 59, 0.96);\n}\n.card__quality,\n .card__type::after,\n .card--tv .card__type {\nbackground: linear-gradient(to right, #2c6fc1, #7e7ed9);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #1a102b, #0a1c3f) !important;\ncolor: #ffffff !important;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #171f3a;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #2c6fc1, #7e7ed9);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(124, 194, 255, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #2c6fc1, #7e7ed9);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(124, 194, 255, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.watched-history.selector.focus::after,.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #7e7ed9;\nbox-shadow: 0 0 0.8em rgba(124, 194, 255, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #7e7ed9, #2c6fc1);\n}\n.modal__content {\nbackground: rgba(18, 34, 59, 0.96);\nborder: 0em solid rgba(18, 34, 59, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(18, 34, 59, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #1a102bcc;\nborder: 0.2em solid #7e7ed9;\n}\n"),
            amber_noir: "\n.navigation-bar__body\n{background: rgba(28, 18, 10, 0.96);\n}\n.card__quality,\n .card__type::after,\n .card--tv .card__type {\nbackground: linear-gradient(to right, #f4a261, #e76f51);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #1f0e04, #3b2a1e) !important;\ncolor: #ffffff !important;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #2a1c11;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #f4a261, #e76f51);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(255, 160, 90, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #f4a261, #e76f51);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(255, 160, 90, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.watched-history.selector.focus::after,.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #f4a261;\nbox-shadow: 0 0 0.8em rgba(255, 160, 90, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #f4a261, #e76f51);\n}\n.modal__content {\nbackground: rgba(28, 18, 10, 0.96);\nborder: 0em solid rgba(28, 18, 10, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(28, 18, 10, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #3b2412cc;\nborder: 0.2em solid #f4a261;\n}\n"),
            velvet_sakura: "\n.navigation-bar__body\n{background: rgba(56, 32, 45, 0.96);\n}\n.card__quality,\n .card__type::after,\n .card--tv .card__type {\nbackground: linear-gradient(to right, #f6a5b0, #f9b8d3);\n}\n.screensaver__preload {\nbackground:url(\"data:image/svg+xml,".concat(svgCode, "\") no-repeat 50% 50%\n}\n.activity__loader {\nposition:absolute;\ntop:0;\nleft:0;\nwidth:100%;\nheight:100%;\ndisplay:none;\nbackground:url(\"data:image/svg+xml,").concat(svgCode, "\") no-repeat 50% 50%\n \n}\nhtml, body, .extensions\n {\nbackground: linear-gradient(135deg, #4b0e2b, #7c2a57) !important;\ncolor: #ffffff !important;\n}\n.company-start.icon--broken .company-start__icon,\n.explorer-card__head-img > img,\n.bookmarks-folder__layer,\n.card-more__box,\n.card__img\n,.extensions__block-add\n,.extensions__item\n {\nbackground-color: #5c0f3f;\n}\n.search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus,\n.full-review.focus {\nbackground: linear-gradient(to right, #f6a5b0, #f9b8d3);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(246, 165, 176, 0.0);\n}\n.selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\nbackground: linear-gradient(to right, #f6a5b0, #f9b8d3);\ncolor: #fff;\nbox-shadow: 0 0.0em 0.4em rgba(246, 165, 176, 0.0);\nborder-radius: 0.5em 0 0 0.5em;\n}\n.full-episode.focus::after,\n.card-episode.focus .full-episode::after,\n.items-cards .selector.focus::after,  \n.card-more.focus .card-more__box::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.torrent-item.focus::after,\n.watched-history.selector.focus::after,.online-prestige.selector.focus::after,\n.online-prestige--full.selector.focus::after,\n.explorer-card__head-img.selector.focus::after,\n.extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-review-add.focus::after {\nborder: 0.2em solid #f6a5b0;\nbox-shadow: 0 0 0.8em rgba(246, 165, 176, 0.0);\n}\n.head__action.focus,\n.head__action.hover {\nbackground: linear-gradient(45deg, #f9b8d3, #f6a5b0);\n}\n.modal__content {\nbackground: rgba(56, 32, 45, 0.96);\nborder: 0em solid rgba(56, 32, 45, 0.96);\n}\n.settings__content,\n.settings-input__content,\n.selectbox__content,\n.settings-input {\nbackground: rgba(56, 32, 45, 0.96);\n}\n.torrent-serial {\nbackground: rgba(0, 0, 0, 0.22);\nborder: 0.2em solid rgba(0, 0, 0, 0.22);\n}\n.torrent-serial.focus {\nbackground-color: #7c2a57cc;\nborder: 0.2em solid #f6a5b0;\n}\n")
        };

        // Устанавливаем стили для выбранной темы
        style.html(themes[theme] || '');

        // Добавляем стиль в head
        $('head').append(style);
        
        animations();
        translate_tv();
        bigbuttons();

        if (onetime === false) {
            onetime = true;
            forall();
            removeFromSettingsMenu();
            fix_lang();
            incardtemplate();
        }
    }
    
    function fix_lang() {
       Lampa.Lang.add({
        tv_status_returning_series: {
          ru: "Идет"
        },
        tv_status_planned: {
          ru: "Запланирован"
        },
        tv_status_in_production: {
          ru: "В производстве"
        },
        tv_status_ended: {
          ru: "Завершен"
        },
        tv_status_canceled: {
          ru: "Отменен"
        },
        tv_status_pilot: {
          ru: "Пилот"
        },
        tv_status_released: {
          ru: "Вышел"
        },
        tv_status_rumored: {
          ru: "По слухам"
        },
        tv_status_post_production: {
          ru: "Скоро"
        }
      });
    }
    
    function removeAdditionalSettings() {
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'maxsm_themes') {
                e.body.find('[data-name="maxsm_themes_animations"]').remove();
                e.body.find('[data-name="maxsm_themes_translate_tv"]').remove();
                e.body.find('[data-name="maxsm_themes_incardtemplate"]').remove();
                e.body.find('[data-name="maxsm_themes_bigbuttons"]').remove();
            }
        });        
    }
    
    function removeFromSettingsMenu() {
        // Скрываем всё, что плохо сочетается с плагином тем
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name == 'interface') {
                e.body.find('[data-name="light_version"]').remove();
                e.body.find('[data-name="background"]').remove();
                e.body.find('[data-name="background_type"]').remove();
                e.body.find('[data-name="card_interfice_type"]').remove();
                e.body.find('[data-name="glass_style"]').prev('.settings-param-title').remove();
                e.body.find('[data-name="glass_style"]').remove();
                e.body.find('[data-name="glass_opacity"]').remove();
                e.body.find('[data-name="card_interfice_poster"]').prev('.settings-param-title').remove();
                e.body.find('[data-name="card_interfice_poster"]').remove();
                e.body.find('[data-name="card_interfice_cover"]').remove();
                e.body.find('[data-name="advanced_animation"]').remove();
            }
        });
        // Настройки интерфейса под темы
        Lampa.Storage.set('light_version', 'false');
        Lampa.Storage.set('background', 'false');
        Lampa.Storage.set('card_interfice_type', 'new');
        Lampa.Storage.set('glass_style', 'false');
        Lampa.Storage.set('card_interfice_poster', 'false');
        Lampa.Storage.set('card_interfice_cover', 'true');
        Lampa.Storage.set('advanced_animation', 'false');

    }

    // Дополнительные Шаблоны, не меняющиеся от цветовых стилей    
    function forall() {
        // Шаблон карточки, где год перенесен выше названия
        Lampa.Template.add('card', "<div class=\"card selector layer--visible layer--render\">\n    <div class=\"card__view\">\n        <img src=\"../img/img_load.svg\" class=\"card__img\" />\n\n        <div class=\"card__icons\">\n            <div class=\"card__icons-inner\">\n                \n            </div>\n        </div>\n    <div class=\"card__age\">{release_year}</div>\n    </div>\n\n    <div class=\"card__title\">{title}</div>\n    </div>");
        // Шаблон карточки выхода эпизода, выкинем футер из card_episode, год и название на карточку
        Lampa.Template.add('card_episode', "<div class=\"card-episode selector layer--visible layer--render\">\n    <div class=\"card-episode__body\">\n        <div class=\"full-episode\">\n            <div class=\"full-episode__img\">\n                <img />\n            </div>\n\n            <div class=\"full-episode__body\">\n     <div class=\"card__title\">{title}</div>\n            <div class=\"card__age\">{release_year}</div>\n            <div class=\"full-episode__num hide\">{num}</div>\n                <div class=\"full-episode__name\">{name}</div>\n                <div class=\"full-episode__date\">{date}</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"card-episode__footer hide\">\n        <div class=\"card__imgbox\">\n            <div class=\"card__view\">\n                <img class=\"card__img\" />\n            </div>\n        </div>\n\n        <div class=\"card__left\">\n            <div class=\"card__title\">{title}</div>\n            <div class=\"card__age\">{release_year}</div>\n        </div>\n    </div>\n</div>");
        // Стили 
        var forall_style = "\n<style id=\"maxsm_themes_forall\">\n " +
            // Отступник для часов
            ".head__time-now  {\n margin-left: 0.5em;\n}\n" +
            // Фикс шапки на тач интерфейсе если нет на главной иконок вверху.
            ".head__body {\n   min-height: 4.1em;\n}\n" +
            // По центру в мобилке
            "@media screen and (max-width: 480px) { .full-start-new__head, .full-start-new__title, .full-start__title-original, .full-start__rate, .full-start-new__reactions, .full-start-new__rate-line, .full-start-new__buttons, .full-start-new__details, .full-start-new__tagline { -webkit-justify-content: center; justify-content: center; text-align: center; }\n" +
            ".full-start__title-original {\n   max-width: 100%;\n}\n}" +
            "@media screen and (max-width: 480px) { .full-start-new__right { background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0))); background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);}}" +
            // Круглые чек-боксы
            ".selectbox-item__checkbox\n {\nborder-radius: 100%\n}\n" +
            ".selectbox-item--checked .selectbox-item__checkbox\n {\nbackground: #ccc;\n}\n" +
            //  Рейтинги внутри карточки
            ".full-start-new__rate-line .full-start__pg {\n    font-size: 1em;\nbackground: #fff;\n    color: #000;\n}\n." +
            ".full-start__rate \n{\n     border-radius: 0.25em;\n padding: 0.3em;\n background-color: rgba(0, 0, 0, 0.3);\n}\n" +
            ".full-start__pg, .full-start__status\n {\nfont-size: 1em;\nbackground: #fff;\n    color: #000;\n}\n" +
            // Докручиваем плашки на карточках стилями 
              // Заголовок
            ".card__title {\n                    height: 3.6em;\n                    text-overflow: ellipsis;\n                     -o-text-overflow: ellipsis;\n                    text-overflow: ellipsis;\n                    -webkit-line-clamp: 3;\n                    line-clamp: 3;\n                }\n " +
              // Год
            ".card__age {\n  position: absolute;\n  right: 0em;\n  bottom: 0em;\n  z-index: 10;\n  background: rgba(0, 0, 0, 0.6);\n  color: #ffffff;\n  font-weight: 700;\n  padding: 0.4em 0.6em;\n    -webkit-border-radius: 0.48em 0 0.48em 0;\n     -moz-border-radius: 0.48em 0 0.48em 0;\n          border-radius: 0.48em 0 0.48em 0;\nline-height: 1.0;\nfont-size: 1.0em;\n}\n " +
              // Рейтинг
            ".card__vote {\n  position: absolute;\n  bottom: auto; \n right: 0em;\n  top: 0em;\n  background: rgba(0, 0, 0, 0.6);\n    font-weight: 700;\n  color: #fff;\n -webkit-border-radius: 0 0.34em 0 0.34em;\n     -moz-border-radius: 0 0.34em 0 0.34em;\n          border-radius: 0 0.34em 0 0.34em;\nline-height: 1.0;\nfont-size: 1.4em;\n}\n  " +
              // Иконки закладок и т.д.
            ".card__icons {\n  position: absolute;\n  top: 2em;\n  left: 0;\n  right: auto;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n     -moz-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  background: rgba(0, 0, 0, 0.6);\n  color: #fff;\n     -webkit-border-radius: 0 0.5em 0.5em 0;\n     -moz-border-radius: 0 0.5em 0.5em 0;\n          border-radius: 0 0.5em 0.5em 0;\n}\n" +
            ".card__icons-inner {\n  background: none; color: #fff\n}\n" +
            //FUCKING LG FIX
            ".card__icon.icon--book {\n    background-image: url(\"data:image/svg+xml," + encodeSVG(bookmark_svg) + "\");\n}\n"+
            ".card__icon.icon--like {\n    background-image: url(\"data:image/svg+xml," + encodeSVG(like_svg) + "\");\n}\n"+
            ".card__icon.icon--wath {\n    background-image: url(\"data:image/svg+xml," + encodeSVG(time_svg) + "\");\n}\n"+
            ".card__icon.icon--history {\n    background-image: url(\"data:image/svg+xml," + encodeSVG(player_svg) + "\");\n}\n"+
              // Статус расширенных закладок
            ".card__marker {\n position: absolute;\n  left: 0em;\n  top: 4em;\n  bottom: auto; \n  background: rgba(0, 0, 0, 0.6);\n  -webkit-border-radius: 0 0.5em 0.5em 0;\n     -moz-border-radius: 0 0.5em 0.5em 0;\n          border-radius: 0 0.5em 0.5em 0;\n  font-weight: 700;\n font-size: 1.0em;\n   padding: 0.4em 0.6em;\n    display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n     -moz-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  line-height: 1.2;\nmax-width: min(12em, 95%);\nbox-sizing: border-box;\n}\n" +
              // На маленьких экранах обрезаем, на больших полностью
            ".card__marker > span {\n max-width: min(12em, 95%);\n}\n" +
              // отметка качества background: rgba(0, 0, 0, 0.6);\n  
            ".card__quality {\n  position: absolute;\n  left: auto;\n right: 0em;\n  bottom: 2.4em;\n  padding: 0.4em 0.6em;\n  color: #fff;\n font-weight: 700;\n  font-size: 1.0em;\n  -webkit-border-radius: 0.5em 0 0 0.5em;\n  -moz-border-radius: 0.5em 0 0 0.5em;\n  border-radius: 0.5em 0 0 0.5em;\n  text-transform: uppercase;\n}\n" +
            // Уменьшаем расстояние между рядами только для карточках в списках
            ".items-line.items-line--type-cards + .items-line.items-line--type-cards  {\nmargin-top: 1em;\n}\n" +
            // Так же широкие карты фиксим, чтобы не было отскока нижнего ряда, делаем отступ снизу
            ".card--small .card__view {\nmargin-bottom: 2em;\n}\n" +
            // Уменьшаем высоту после удаления футера, нужно для card_episode
            ".items-line--type-cards {\n min-height: 18em;\n}\n" +
            // Внутри карточки информация стремится к нижней границе экрана
            "@media screen and (min-width: 580px) {\n.full-start-new {\nmin-height: 80vh;\ndisplay: flex\n}\n}\n" +
            // Постер в карточке, менее затемнен чем в стоке
            ".full-start__background.loaded {\nopacity: 0.8;\n}\n.full-start__background.dim {\nopacity: 0.2;\n}\n" +
            // Скругления у большого числа элементов
            ".explorer__files .torrent-filter .simple-button {\nfont-size: 1.2em;\n-webkit-border-radius: 0.5em;\n-moz-border-radius: 0.5em;\nborder-radius: 0.5em;\n}\n" +
            ".full-review-add,\n.full-review,\n.extensions__item,\n.extensions__block-add,\n.search-source,\n.bookmarks-folder__layer,\n.bookmarks-folder__body,\n.card__img,\n.card__promo,\n.full-episode--next .full-episode__img:after,\n.full-episode__img img,\n.full-episode__body,\n.full-person__photo,\n.card-more__box,\n.full-start__button,\n.simple-button,\n.register {\nborder-radius: 0.5em;\n}\n" +
            ".extensions__item.focus::after,\n.extensions__block-add.focus::after,\n.full-episode.focus::after,\n.full-review-add.focus::after,\n.card-parser.focus::after,\n.card-episode.focus .full-episode::after,\n.card-episode.hover .full-episode::after,\n.card.focus .card__view::after,\n.card.hover .card__view::after,\n.card-more.focus .card-more__box::after,\n.register.focus::after {\nborder-radius: 1em;\n}\n" +
            ".search-source.focus,\n.simple-button.focus,\n.menu__item.focus,\n.menu__item.traverse,\n.menu__item.hover,\n.full-start__button.focus,\n.full-descr__tag.focus,\n.player-panel .button.focus,\n.full-person.selector.focus,\n.tag-count.selector.focus {\nborder-radius: 0.5em;\n}\n" +
            // Меню слева
            ".menu__item.focus {border-radius: 0 0.5em 0.5em 0;\n}\n" +
            ".menu__list {\npadding-left: 0em;\n}\n" +
            // Оставим иконки белыми в левом Меню
            // ".menu__item.focus .menu__ico {\n   -webkit-filter: invert(1);\n    filter: invert(1);\n }\n " +
            // Фикс ТОЛЬКО для иконок плагинов (те, что в <li>)
            "li.menu__item .menu__ico {\n" +
            "    -webkit-filter: none !important;\n" +
            "    filter: none !important;\n" +
            "}\n" +
            "li.menu__item.focus .menu__ico,\n" +
            "li.menu__item.hover .menu__ico {\n" +
            "    color: #fff !important;\n" +
            "}\n" +
            "li.menu__item .menu__ico svg {\n" +
            "    -webkit-filter: none !important;\n" +
            "    filter: none !important;\n" +
            "}\n" +
            "li.menu__item.focus .menu__ico svg path[fill],\n" +
            "li.menu__item.hover .menu__ico svg path[fill] {\n" +
            "    fill: #fff !important;\n" +
            "}\n" +
            "li.menu__item.focus .menu__ico svg rect[stroke],\n" +
            "li.menu__item.hover .menu__ico svg rect[stroke] {\n" +
            "    stroke: #fff !important;\n" +
            "}\n" +
            // Белые иконки в бошке
            // ".head__action.focus, .head__action.hover {\ncolor: fff;\n}\n" +
            "</style>\n";
        Lampa.Template.add('forall_style_css', forall_style);
        $('body').append(Lampa.Template.get('forall_style_css', {}, true));
    }
    
    function incardtemplate() {
        var incardtemplate = localStorage.getItem('maxsm_themes_incardtemplate')  === 'true';
        if (incardtemplate) {
                Lampa.Template.add('full_start_new', "<div class=\"full-start-new\">\n\n    <div class=\"full-start-new__body\">\n        <div class=\"full-start-new__left\">\n            <div class=\"full-start-new__poster\">\n                <img class=\"full-start-new__img full--poster\" />\n            </div>\n        </div>\n\n        <div class=\"full-start-new__right\">\n            <div class=\"full-start-new__head\"></div>\n            <div class=\"full-start-new__title\">{title}</div>\n            <div class=\"full-start__title-original\">{original_title}</div>\n            <div class=\"full-start-new__tagline full--tagline\">{tagline}</div>\n            <div class=\"full-start-new__rate-line\">\n                <div class=\"full-start__rate rate--tmdb\"><div>{rating}</div><div class=\"source--name\">TMDB</div></div>\n                <div class=\"full-start__rate rate--imdb hide\"><div></div><div>IMDB</div></div>\n                <div class=\"full-start__rate rate--kp hide\"><div></div><div>KP</div></div>\n\n                <div class=\"full-start__pg hide\"></div>\n                <div class=\"full-start__status hide\"></div>\n            </div>\n            <div class=\"full-start-new__details\"></div>\n            <div class=\"full-start-new__reactions\">\n                <div>#{reactions_none}</div>\n            </div>\n\n            <div class=\"full-start-new__buttons\">\n                <div class=\"full-start__button selector button--play\">\n                    <svg><use xlink:href=\"#sprite-play\"></use></svg>\n\n                    <span>#{title_watch}</span>\n                </div>\n\n                <div class=\"full-start__button view--torrent\">\n                    <svg><use xlink:href=\"#sprite-torrent\"></use></svg>\n\n                    <span>#{full_torrents}</span>\n                </div>\n\n                <div class=\"full-start__button selector view--trailer\">\n                    <svg><use xlink:href=\"#sprite-trailer\"></use></svg>\n\n                    <span>#{full_trailers}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--book\">\n                    <svg width=\"21\" height=\"32\" viewBox=\"0 0 21 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z\" stroke=\"currentColor\" stroke-width=\"2.5\"/>\n                    </svg>\n\n                    <span>#{settings_input_links}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--reaction\">\n                    <svg><use xlink:href=\"#sprite-reaction\"></use></svg>           \n\n                    <span>#{title_reactions}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--subscribe hide\">\n                    <svg viewBox=\"0 0 25 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z\" fill=\"currentColor\"></path>\n                        <path d=\"M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z\" stroke=\"currentColor\" stroke-width=\"2.6\"></path>\n                    </svg>\n\n                    <span>#{title_subscribe}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--options\">\n                    <svg><use xlink:href=\"#sprite-dots\"></use></svg>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Контейнер buttons--container можно удалить, так как кнопки теперь в основном блоке -->\n</div>");
        } else {
                Lampa.Template.add('full_start_new', "<div class=\"full-start-new\">\n\n    <div class=\"full-start-new__body\">\n        <div class=\"full-start-new__left\">\n            <div class=\"full-start-new__poster\">\n                <img class=\"full-start-new__img full--poster\" />\n            </div>\n        </div>\n\n        <div class=\"full-start-new__right\">\n            <div class=\"full-start-new__head\"></div>\n            <div class=\"full-start-new__title\">{title}</div>\n            <div class=\"full-start__title-original\">{original_title}</div>\n            <div class=\"full-start-new__tagline full--tagline\">{tagline}</div>\n            <div class=\"full-start-new__rate-line\">\n                <div class=\"full-start__rate rate--tmdb\"><div>{rating}</div><div class=\"source--name\">TMDB</div></div>\n                <div class=\"full-start__rate rate--imdb hide\"><div></div><div>IMDB</div></div>\n                <div class=\"full-start__rate rate--kp hide\"><div></div><div>KP</div></div>\n\n                <div class=\"full-start__pg hide\"></div>\n                <div class=\"full-start__status hide\"></div>\n            </div>\n            <div class=\"full-start-new__details\"></div>\n            <div class=\"full-start-new__reactions\">\n                <div>#{reactions_none}</div>\n            </div>\n\n            <div class=\"full-start-new__buttons\">\n                <div class=\"full-start__button selector button--play\">\n                    <svg><use xlink:href=\"#sprite-play\"></use></svg>\n\n                    <span>#{title_watch}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--book\">\n                    <svg width=\"21\" height=\"32\" viewBox=\"0 0 21 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z\" stroke=\"currentColor\" stroke-width=\"2.5\"/>\n                    </svg>\n\n                    <span>#{settings_input_links}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--reaction\">\n                    <svg><use xlink:href=\"#sprite-reaction\"></use></svg>           \n\n                    <span>#{title_reactions}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--subscribe hide\">\n                    <svg viewBox=\"0 0 25 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                        <path d=\"M6.01892 24C6.27423 27.3562 9.07836 30 12.5 30C15.9216 30 18.7257 27.3562 18.981 24H15.9645C15.7219 25.6961 14.2632 27 12.5 27C10.7367 27 9.27804 25.6961 9.03542 24H6.01892Z\" fill=\"currentColor\"></path>\n                        <path d=\"M3.81972 14.5957V10.2679C3.81972 5.41336 7.7181 1.5 12.5 1.5C17.2819 1.5 21.1803 5.41336 21.1803 10.2679V14.5957C21.1803 15.8462 21.5399 17.0709 22.2168 18.1213L23.0727 19.4494C24.2077 21.2106 22.9392 23.5 20.9098 23.5H4.09021C2.06084 23.5 0.792282 21.2106 1.9273 19.4494L2.78317 18.1213C3.46012 17.0709 3.81972 15.8462 3.81972 14.5957Z\" stroke=\"currentColor\" stroke-width=\"2.6\"></path>\n                    </svg>\n\n                    <span>#{title_subscribe}</span>\n                </div>\n\n                <div class=\"full-start__button selector button--options\">\n                    <svg><use xlink:href=\"#sprite-dots\"></use></svg>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"hide buttons--container\">\n        <div class=\"full-start__button view--torrent hide\">\n            <svg><use xlink:href=\"#sprite-torrent\"></use></svg>\n\n            <span>#{full_torrents}</span>\n        </div>\n\n        <div class=\"full-start__button selector view--trailer\">\n            <svg><use xlink:href=\"#sprite-trailer\"></use></svg>\n\n            <span>#{full_trailers}</span>\n        </div>\n    </div>\n</div>");            
        }
    }
    
    function translate_tv() {
        var tv_caption = Lampa.Lang.translate('maxsm_themes_tvcaption');
        var translate_tv = localStorage.getItem('maxsm_themes_translate_tv')  === 'true';
        var translate_tv_style;
        $('#maxsm_themes_translate_tv').remove(); 
        if (!translate_tv) {
            translate_tv_style = "\n<style id=\"maxsm_themes_translate_tv\">\n " +
                ".card__type {\n  position: absolute;\n  bottom: auto; \n left: 0em; \nright: auto;\n  top: 0em;\n  background: rgba(0, 0, 0, 0.6);\n  color: #fff;\n  font-weight: 700;\n  padding: 0.4em 0.6em;\n  -webkit-border-radius: 0.4em 0 0.4em 0;\n     -moz-border-radius: 0.4em 0 0.4em 0;\n          border-radius: 0.4em 0 0.4em 0;\nline-height: 1.0;\nfont-size: 1.0em;\n}\n " +
                ".card--tv .card__type {\n  color: #fff;\n}\n" +
            "</style>\n";
            $('body').append(translate_tv_style);
        } else {
            translate_tv_style = "\n<style id=\"maxsm_themes_translate_tv\">\n " +
                ".card--tv .card__type,\n.card__type {\n  font-size: 1em;\n  background: transparent;\n color: transparent;\n left: 0;\n  top: 0;\n}\n" + 
                ".card__type::after {\n  content: '" + tv_caption + "';\n  color: #fff;\n  position: absolute;\n  left: 0;\n  top: 0;\n padding: 0.4em 0.6em;\n  border-radius: 0.4em 0 0.4em 0;\n  font-weight: 700;\n}" +
            "</style>\n";
            $('body').append(translate_tv_style);
        }
    }
    
    function animations() {
        var animations = localStorage.getItem('maxsm_themes_animations') === 'true';
        $('#maxsm_themes_animations').remove();
        if (animations) {
            var animations_style = "\n<style id=\"maxsm_themes_animations\">\n " +
                // Пробуем немного анимацмм
                ".card\n{transform: scale(1);\ntransition: transform 0.3s ease;\n}\n" +
                ".card.focus\n{transform: scale(1.03);\n}\n" +
                ".watched-history,\n.torrent-item,\n.online-prestige\n{transform: scale(1);\ntransition: transform 0.3s ease;\n}\n" +
                ".watched-history.focus,\n.torrent-item.focus,\n.online-prestige.focus\n{transform: scale(1.01);\n}\n" +
                ".extensions__item,\n.extensions__block-add,\n.full-review-add,\n.full-review,\n.tag-count,\n.full-person,\n.full-episode,\n.simple-button,\n.full-start__button,\n.items-cards .selector,\n.card-more,\n.explorer-card__head-img.selector,\n.card-episode\n{transform: scale(1);\ntransition: transform 0.3s ease;\n}\n" +
                ".extensions__item.focus,\n.extensions__block-add.focus,\n.full-review-add.focus,\n.full-review.focus,\n.tag-count.focus,\n.full-person.focus,\n.full-episode.focus,\n.simple-button.focus,\n.full-start__button.focus,\n.items-cards .selector.focus,\n.card-more.focus,\n.explorer-card__head-img.selector.focus,\n.card-episode.focus\n{transform: scale(1.03);\n}\n" +
                ".menu__item {\n  transition: transform 0.3s ease;\n}\n" +
                ".menu__item.focus {\n transform: translateX(-0.2em);\n}\n" +
                ".selectbox-item,\n.settings-folder,\n.settings-param {\n transition: transform 0.3s ease;\n}\n" +
                ".selectbox-item.focus,\n.settings-folder.focus,\n.settings-param.focus {\n transform: translateX(0.2em);\n}\n" +
            "</style>\n";
            $('body').append(animations_style);
        }
    }
    
    function bigbuttons() {
        var bigbuttons = localStorage.getItem('maxsm_themes_bigbuttons')  === 'true';
        $('#maxsm_themes_bigbuttons').remove();
        if (bigbuttons) {
            var bigbuttons_style = "\n<style id=\"maxsm_themes_bigbuttons\">\n " +
                ".full-start-new__buttons .full-start__button:not(.focus) span {\ndisplay: inline ;\n}\n@media screen and (max-width: 580px) {\n.full-start-new__buttons {\noverflow: auto;\n}\n.full-start-new__buttons .full-start__button:not(.focus) span {\ndisplay: none;\n}\n}\n" +
            "</style>\n";
            $('body').append(bigbuttons_style);
        }
    }    

    // Функция инициализации плагина
    function startPlugin() {
        // Список доступных тем
        var availableThemes = ['mint_dark', 'deep_aurora', 'crystal_cyan', 'amber_noir', 'velvet_sakura', 'default'];
        
        // Значения по умолчанию
        if (!localStorage.getItem('maxsm_themes_animations')) {
            localStorage.setItem('maxsm_themes_animations', 'true');
        }
        if (!localStorage.getItem('maxsm_themes_translate_tv')) {
            localStorage.setItem('maxsm_themes_translate_tv', 'true');
        }
        if (!localStorage.getItem('maxsm_themes_incardtemplate')) {
            localStorage.setItem('maxsm_themes_incardtemplate', 'true');
        }   
        if (!localStorage.getItem('maxsm_themes_bigbuttons')) {
            localStorage.setItem('maxsm_themes_bigbuttons', 'false');
        }
        
        // Меню        
        Lampa.SettingsApi.addComponent({
            component: "maxsm_themes",
            name: Lampa.Lang.translate('maxsm_themes'),
            icon: themes_svg
        });


        Lampa.SettingsApi.addParam({
            component: 'maxsm_themes',
            param: {
                name: 'maxsm_themes_selected',
                type: 'select',
                values: {
                    mint_dark: 'Mint Dark',
                    deep_aurora: 'Deep Aurora',
                    crystal_cyan: 'Crystal Cyan',
                    amber_noir: 'Amber Noir',
                    velvet_sakura: 'Velvet Sakura',
                    default: 'LAMPA'
                },
                "default": 'Mint Dark'
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_theme'),
                description: ''
            },
            onChange: function onChange(value) {
                maxsm_themes.settings.theme = value;
                Lampa.Settings.update();
                applyTheme(value);
            }
        }); 
        

        Lampa.SettingsApi.addParam({
            component: 'maxsm_themes',
            param: {
                name: 'maxsm_themes_animations',
                type: "trigger",
                default: true
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_animations'),
                description: ''
            },
            onChange: function(value) {
                animations();
            }
        });
        
        Lampa.SettingsApi.addParam({
            component: 'maxsm_themes',
            param: {
                name: 'maxsm_themes_translate_tv',
                type: "trigger",
                default: true
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_translate_tv'),
                description: ''
            },
            onChange: function(value) {
                translate_tv();
            }
        });
        
        Lampa.SettingsApi.addParam({
            component: 'maxsm_themes',
            param: {
                name: 'maxsm_themes_incardtemplate',
                type: "trigger",
                default: true
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_incardtemplate'),
                description: ''
            },
            onChange: function(value) {
                window.location.reload();
            }
        });
        
        Lampa.SettingsApi.addParam({
            component: 'maxsm_themes',
            param: {
                name: 'maxsm_themes_bigbuttons',
                type: "trigger",
                default: false
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_bigbuttons'),
                description: ''
            },
            onChange: function(value) {
                bigbuttons();
            }
        });


        // Применяем настройки и проверяем, существует ли выбранная тема
        var savedTheme = Lampa.Storage.get('maxsm_themes_selected', 'mint_dark');
        if (availableThemes.indexOf(savedTheme) === -1) {
            // Если сохраненная тема не существует, ставим по умолчанию
            Lampa.Storage.set('maxsm_themes_selected', 'mint_dark');
            savedTheme = 'mint_dark';
        }
        maxsm_themes.settings.theme = savedTheme;
        applyTheme(maxsm_themes.settings.theme);
    }

    // Ждем загрузки приложения и запускаем плагин
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }
    // Регистрация плагина в манифесте
    Lampa.Manifest.plugins = {
        name: 'maxsm_themes',
        version: '3.0.0',
        description: 'maxsm_themes'
    };

    // Экспортируем объект плагина для внешнего доступа
    window.maxsm_themes = maxsm_themes;
})();