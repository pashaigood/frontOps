# Features

**?** - Функционал под вопросом, не оценивался и в текущей версии делаться не будет.

1. build tool
    1. (done) Common env browser version setting - 4h
    1. App level config.  
     <small>Настройки на уровне приложения, сейчас у нас это происходит в одном файле,
     что с одной стороны удобно, позволет копипастить, но чем больше там записей, тем он менее читаем,
      а само приложение монолитней и нерасширяемей</small>
        1. (done) Routing - 2h.  
           <small>
            В настройках приложений мы можем указывать шаблоны ссылок на то или иное состояние,
            которые нам нужны по тем или иным причинам сделать глобальными.  
            *Пример: ссылка на состояние редктирования дашборда.*
            </small>
            1. Url
            2. States
        1. (done) Alias  
            <small>
            Синоном приложения при роутинге.
            Позволяет не иметь строгой связи между именами приложений и типами сущностсей, что хранятся бд.
              
            *Пример: В filesystem сервер присылает типы сущностей, которые не всегда соответрвуют приложению,
             которые их открывают. Что бы не делать доп. маппинг на уровне приложения, есть возможность указать типы как синонимы.*
            </small>
        1. (done) Output   
            <small>
            Точка входа (какому адресу) будет доступно приложени.
            </small>
        1. (done) Multi output - 1h
            <small>
            Если есть необходимость иметь две точки входа для одного приложения.
            Поддерживаются внешние переменные для каждой из точек входа.
              
            *Пример: Страницы ошибок, на основе одного и тогоже кода, но разных входных данных генерится все необходимые.*
            </small>
        1. (done) Pre rendering - 9h  
            <small>
            Нужно ли предварительный рендеринг приложению. Предварительный рендеринг - создание html разметки до подгрузки скриптов.
              
            *Пример: Страницы ошибок. Сервер отжаёт просто html+css, при загрузки скриптов применяется брендинг.*
            </small>
        1. Application type?
            1. Default
            1. Dll   
                <small>
                Приложение не имеет своей точки входа, но собиратеся в отделбную библиотеку, что подключается к другим приложения.   
                В теории, уменьшит время сборки.
                </small>
    1. (done) Alias  
        <small>
        Доступ к библиоткем по указанному специальному пути. Также позволяет создать "прокси-модули".
        *Пример: Пакет react не содержит prop-types в 16 версии, создание "прокси-модуля" по имени react, позволило сохранить старый интерфейс и не рефакторить весь код, где используются prop-types.*
        </small>
    1. (done) Extract Text  
        <small>
        Плагин, собирающий стили в отдельный css файл.
        </small>
    1. (rejected) PurifyCSS - 2h
    1. (done) System version - 1h
    1. (done) happypack  
        <small>
        Параллельное компилирование модулей.
        Ускоряет сборку при разработке.
        </small>
    1. (done) webpack 3
    1. (done) loaders
        1. (done) scss
        1. (done) imports
        1. (done) Strip code
        1. (done) json
        1. (done) ng-annotate
        1. (done) bundle
        1. (done) imports
        1. (done) val
        1. (done) PostCss
            1. (done) autoprefix
        1. Stylus?
    1. Cut prop types from prod?  
        <small>
        Вырезает все проверки на типы из production версии.
        </small>
    1. Precompiled js?  
        <small>
        Первичная компиляция кода - оптимзирут конструкции как "2 + 3" в "5"
        </small>
    1. New routing?  
        <small>
        Заменить систему глобального роутига с angular на что-то иное.
        </small>
    1. (done) Concat legacy code
    1. (done) Service Worker?
    1. ~~favicon~~
    1. (done) autoprefix - 1h
    1. (done) polyfills - 3h
    1. (done) decorators - 1h  
        <small>
        Код становиться более лаконичны и читаемый.
        Повсеместно использую в своём коде.
        </small>
    1. i18n?  
        <small>
        Интернационализация, позволяет создовть приложение на разных языках.
        </small>
1. dev server
    1. (done) Proxy server - 2h // BrowserSync выпиливается ? **Нет**  
        <small>
        Определяет api запросы и отправляет backend серверу.
        </small>
    1. (done) SPA
    1. (done) HMR - 4h
    1. (done) bundle profiler - 2h
    1. (done) Dll - 3h  
        <small>
        Позволяет вынести библиотеки в предварительно собранные модули не теряя доступ к ним через можульную систему.
        Ускоряет сборку при разработке.
        </small>
    1. Widget library?
    1. API library?
    1. (done) Caching
    1. Rebuild only changed apps
1. scaffolding?
1. lint  
    <small>
    Проверка стилей кода.
    </small>
    1. Code - 2h 
    2. Styles - 2h // как это будет работать если большая часть кода не приведена к этим правилам? Планирую реализовать проверку только изменившихся файлов. Если это сложней, то будет просто сигнализировать о проблемах. Предварительно проганю на всём коде автоформат.
1. test runner - 8h

## Application's config

``application`` (Object|Boolean)

```json
// package.json
{
  "name": "...",
  "application": {
    "alias": "", // (String) - alias routing name.
    "prerender": false, // (Boolean) - should application be pre-rendered.
    "skipped": false, // (Boolean) - skip this application from routing.
    "output": "", // (String) - output path, default equals to fs folder name.
    "entry": "", // (String|Object|Array<Object>) - custom output entry relative to the root.
    "url": "", // (String) - custom absolute url for application.
    "states": {} // (Object) - Addition application states visible ouside the app.
  }
}
```

``application.entry``

```json
{
  "entry": [{
    "filename": "page-not-found.html", // (String) - output string name
    "vars": { // (Object) - custom options for entry
      "hello": "world"
    }
  }]
}
```

``application.url``

```json
{
  "url": "/control-editor/:hash/:tabHash/:id"
}
```

``application.states``

```json
{
  "states": {
    "edit": {
      "url": "/edit?:selectedId&:tabHash"
    }
  }
}
```
# Experiments
1. https://www.npmjs.com/package/uglify-loader
1. https://www.npmjs.com/package/babili-webpack-plugins
1. https://github.com/reactjs/react-codemod
1. https://github.com/smelukov/webpack-runtime-analyzer
1. https://github.com/webpack-contrib/thread-loader
1. https://github.com/webpack-contrib/cache-loader
1. https://github.com/mzgoddard/hard-source-webpack-plugin
1. (used) https://github.com/schmod/babel-plugin-angularjs-annotate
1. https://www.npmjs.com/package/webpack-dashboard
1. https://www.npmjs.com/package/case-sensitive-paths-webpack-plugin
1. https://github.com/dylang/npm-check
1. https://www.npmjs.com/package/dependency-check
1. https://github.com/prettier/prettier-eslint
1. https://github.com/facebook/react/blob/d906de7f602df810c38aa622c83023228b047db6/scripts/babel/transform-prevent-infinite-loops.js // while loop detector
1. https://www.npmjs.com/package/image-webpack-loader