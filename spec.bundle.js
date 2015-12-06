Error.stackTraceLimit = Infinity;
require('reflect-metadata');
require('angular2/test');
require('angular2/mock');

/*
  We can use the the context method on require that Webpack created in order to
  tell Webpack what files we actually want to require or import. Below, context
  will be a function/object with file names as keys.
*/
//var testContext = require.context('./test', true, /\.spec\.ts/);
var appContext = require.context('./src', true, /\.spec\.ts/);

// Get all the files, for each file, call the context function
// that will require the file and load it up here. Context will
// loop and require those spec files here.
appContext.keys().forEach(appContext);
//testContext.keys().forEach(testContext);

// Select BrowserDomAdapter.
// see https://github.com/AngularClass/angular2-webpack-starter/issues/124
var domAdapter = require('angular2/src/core/dom/browser_adapter').BrowserDomAdapter;
domAdapter.makeCurrent();
