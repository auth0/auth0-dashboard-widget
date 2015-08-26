require('./lib/insert-css');

var d3      = require('d3');
var fetch   = require('fetchify')(Promise).fetch;

import renderer from "./lib/chart-renderer.js"

export default function Auth0DasboardWidget (domain, app_token, options) {
    if (!(this instanceof Auth0DasboardWidget)) {
        return new Auth0DasboardWidget(app_token, domain, options);
    }

    this.app_token = app_token;
    this.domain = domain;
    this.charts = options.charts;
}

Auth0DasboardWidget.prototype.show = function(ele) {
    var dashboard_wrapper = d3.select(ele);

    for (let a = 0; a < this.charts.length; a++) {
      let chart_data = this.charts[a];
      chart_data.domain = this.domain;
      chart_data.app_token = this.app_token;
      chart_data.dashboard_wrapper = dashboard_wrapper;
      renderer(chart_data) ;
    }
}
