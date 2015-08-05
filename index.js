require('./lib/insert-css');

var d3      = require('d3');
var fetch   = require('fetchify')(Promise).fetch;

import GetChartType from "./lib/chart-type/chart-type.js"

module.exports = Auth0DasboardWidget;

function Auth0DasboardWidget (app_token, domain, options) {
    if (!(this instanceof Auth0DasboardWidget)) {
        return new Auth0DasboardWidget(app_token, domain, options);
    }

    this.app_token = app_token;
    this.domain = domain;
    this.charts = options.charts;
}

Auth0DasboardWidget.prototype.show = function(ele) {
    var self = this;

    var load_chart = function (chart, data) {
        var chart_wrapper = self.wrapper.append('div')
                                .attr('id', chart.name);
        var type = GetChartType(chart.type);
        type(chart_wrapper, data);
    };

    self.wrapper = d3.select(ele);

    for (let a = 0; a < self.charts.length; a++) {
        let chart = self.charts[a];

        fetch(chart.url)
            .then(response => response.json())
            .then( data => data.map( d => [ d.age, d.count ] ) )
            .then( data => load_chart(chart, data) )
            .catch( ex => console.log('parsing failed', ex) );
    }

}

Auth0DasboardWidget.prototype.showDaily = function(ele) {
    var self = this;

    var filter_from = '20150701';
    var filter_to = '20150801';

    var stats_url = `https://${self.domain}/api/v2/stats/daily?from=${filter_from}&to=${filter_to}`;

    fetch(stats_url, { headers: { 'Authorization': `Bearer ${self.app_token}` } })
        .then( response => response.json() )
        .then( data => data.reduce(function(prev, curr){
                            prev[0].push(curr.logins);
                            prev[1].push(curr.signups);
                            return prev;
                        }, [ ['Logins'], ['Signups'] ])
        )
        .then(function(data){
            var chart_wrapper = self.wrapper.append('div')
                                    .attr('id', 'daily');
            var type = GetChartType('spline');
            type(chart_wrapper, data);
        })
        .catch( ex => console.log('parsing failed', ex) );

}
