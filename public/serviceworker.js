var STATIC_CACHE = 'static-cache-v1';
var urlsToCache = [
    // js
    '/vendor/plugins/jquery.areyousure/jquery.are-you-sure.js',
    '/vendor/plugins/jquery/jquery.min.js?v=3.4.1',
    '/vendor/plugins/jquery-migrate/jquery-migrate.min.js?v=3.0.1',
    '/vendor/plugins/semantic/semantic.min.js',
    '/js/index.js',
    '/js/draw.js',
    '/vendor/plugins/clipboard/clipboard.min.js',
    '/vendor/plugins/gitgraph/gitgraph.js',
    '/vendor/plugins/vue/vue.min.js',
    '/vendor/plugins/emojify/emojify.min.js',
    '/vendor/plugins/cssrelpreload/loadCSS.min.js',
    '/vendor/plugins/cssrelpreload/cssrelpreload.min.js',
    '/vendor/plugins/dropzone/dropzone.js',
    '/vendor/plugins/highlight/highlight.pack.js',
    '/vendor/plugins/jquery.datetimepicker/jquery.datetimepicker.js',
    '/vendor/plugins/jquery.minicolors/jquery.minicolors.min.js',
    '/vendor/plugins/codemirror/addon/mode/loadmode.js',
    '/vendor/plugins/codemirror/mode/meta.js',
    '/vendor/plugins/simplemde/simplemde.min.js',

    // css
    '/vendor/assets/font-awesome/css/font-awesome.min.css',
    '/vendor/assets/octicons/octicons.min.css',
    '/vendor/plugins/simplemde/simplemde.min.css',
    '/vendor/plugins/gitgraph/gitgraph.css',
    '/vendor/plugins/tribute/tribute.css',
    '/vendor/plugins/semantic/semantic.min.css',
    '/css/index.css',
    '/vendor/plugins/highlight/github.css',
    '/vendor/plugins/jquery.minicolors/jquery.minicolors.css',
    '/vendor/plugins/jquery.datetimepicker/jquery.datetimepicker.css',
    '/vendor/plugins/dropzone/dropzone.css',
    '/css/theme-arc-green.css',

    // img
    '/img/gitea-sm.png',
    '/img/gitea-lg.png',

    // fonts
    '/vendor/plugins/semantic/themes/default/assets/fonts/icons.woff2',
    '/vendor/assets/octicons/octicons.woff2?ef21c39f0ca9b1b5116e5eb7ac5eabe6',
    '/vendor/assets/lato-fonts/lato-v14-latin-regular.woff2',
    '/vendor/assets/lato-fonts/lato-v14-latin-700.woff2'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});
