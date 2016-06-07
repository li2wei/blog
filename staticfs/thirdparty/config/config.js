var  path = {
    'jquery': 'thirdparty/jquery/jquery.min',
    'text':  'thirdparty/requirejs/text',
    'backbone': 'thirdparty/backbone/backbone-0.9.10',
    'underscore': 'thirdparty/backbone/underscore-1.4.4',
    'bootstrap': 'thirdparty/bootstrap/bootstrap.min',
    // 'mo':'thirdparty/mojs/mo'
    'mo':'thirdparty/mojs-master/build/mo.min'
};
var shim = {
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'bootstrap':{
        deps:['jquery']
    }
};
require.config({
    baseUrl:'/staticfs/',
    paths:path,
    shim:shim
});