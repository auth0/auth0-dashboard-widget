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

Auth0DasboardWidget.prototype.load_chart = function (chart, data, wrapper) {
    var chart_wrapper = wrapper.append('div')
                            .attr('id', `a0-${chart.name}`);
    var type = GetChartType(chart.type);
    return new type(chart_wrapper, data);
}

Auth0DasboardWidget.prototype.show = function(ele) {
    var self = this;
    var wrapper = d3.select(ele);

    for (let a = 0; a < self.charts.length; a++) {
      let chart_settings = self.charts[a];

      renderer(this.domain, this.app_token, wrapper, chart_settings) ;
    }
}
