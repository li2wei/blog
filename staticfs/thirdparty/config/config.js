var path = {
    'jquery': 'jquery/jquery.min',
    'text': 'requirejs/text',
    'backbone': 'backbone/backbone-0.9.10',
    'underscore': 'Markdown/lib/underscore.min',
    'bootstrap': 'bootstrap/bootstrap.min',
    // 'mo':'thirdparty/mojs/mo'
    'mo': 'mojs-master/build/mo.min',
    'editor': 'Markdown/editormd.min',
    'marked': "Markdown/lib/marked.min",
    'prettify': "Markdown/lib/prettify.min",
    'raphael': "Markdown/lib/raphael.min",
    'flowchart': "Markdown/lib/flowchart.min",
    'jqueryflowchart': "Markdown/lib/jquery.flowchart.min",
    'sequenceDiagram': "Markdown/lib/sequence-diagram.min",
    'katex': "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
    'editormd': "Markdown/editormd.amd" // Using Editor.md amd version for Req
};
var shim = {
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'bootstrap': {
        deps: ['jquery']
    },
    'editor': {
        deps: ['jquery']
    },
    'jqueryflowchart':{
        deps: ['jquery']
    },
    'sequenceDiagram':{
        deps:['raphael']
    }
    // 'flowchart':{
    //     deps: ['jquery']
    // }
};
require.config({
    baseUrl: '/staticfs/thirdparty',
    paths: path,
    shim: shim,
    waitSeconds: 30
});