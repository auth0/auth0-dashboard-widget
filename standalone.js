/*
 *
 * This is used to build the bundle with browserify.
 *
 * The bundle is used by people who doesn't use browserify.require
 * Those who use browserify will install with npm and require the module,
 * the package.json file points to index.js.
 */


//temporary disable define from AMD.
var old_define = global.define;
global.define = undefined;

var Auth0DasboardWidget = require('./');
var Auth0BasicChartWidget = require('./lib/charts/basic');
var Auth0MapWidget = require('./lib/charts/map');
var Auth0PieDataProcessor = require('./lib/data_processor/standard_pie');

//restore define
global.define = old_define;

// use amd or just throught to window object.
if (typeof global.define == 'function' && global.define.amd) {
  global.define('auth0-dashboard-widget', function () { return Auth0DasboardWidget; });
  global.define('auth0-basic-chart-widget', function () { return Auth0BasicChartWidget; });
  global.define('auth0-map-widget', function () { return Auth0MapWidget; });
  global.define('auth0-pie-data-processor', function () { return Auth0PieDataProcessor; });
} else if (global) {
  global.Auth0DasboardWidget = Auth0DasboardWidget;
  global.Auth0BasicChartWidget = Auth0BasicChartWidget;
  global.Auth0MapWidget = Auth0MapWidget;
  global.Auth0PieDataProcessor = Auth0PieDataProcessor;
}
