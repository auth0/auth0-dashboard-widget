require('./lib/insert-css');

var d3      = require('d3');
var curry   = require('curry');

var Promise = require('bluebird');
var fetch   = require('fetchify')(Promise).fetch;

var PieChart = require('./lib/chart-type/pie.js');
var BarChart = require('./lib/chart-type/bar.js');
var SplineChart = require('./lib/chart-type/spline.js');

module.exports = Auth0DasboardWidget;

function Auth0DasboardWidget (app_token, domain, options) {
    if (!(this instanceof Auth0DasboardWidget)) {
        return new Auth0DasboardWidget(app_token, domain, options);
    }

    this.app_token = app_token;
    this.domain = domain;
    this.charts = options.charts;
}

Auth0DasboardWidget.prototype.get_chart_type = function(type) {
    var chart_type;

    switch (type) {

        case 'pie':
            chart_type = PieChart;
            break;

        case 'bar':
            chart_type = BarChart;
            break;

        case 'spline':
            chart_type = SplineChart;
            break;

        default:
            throw "Ivalid chart type '" + type + "'.";

    }

    return chart_type;
}

Auth0DasboardWidget.prototype.show = function(ele) {
    var self = this;

    var load_chart = function (chart, data) {
        var chart_wrapper = self.wrapper.append('div')
                                .attr('id', chart.name);
        var type = self.get_chart_type(chart.type);
        type(chart_wrapper, data);
    };


    self.wrapper = d3.select(ele);

    for (var a = 0; a < self.charts.length; a++) {
        let chart = self.charts[a];

        fetch(chart.url)
            .then(function(response) {
                return response.json()
            })
            .then(function(data) {
                return data.map( d => [ d.age, d.count ] );
            })
            .then( data => load_chart(chart, data) )
            .catch(function(ex) {
                console.log('parsing failed', ex)
            });
    }

}

Auth0DasboardWidget.prototype.showDaily = function(ele) {
    var self = this;
    var stats_url = 'https://' + self.domain + '/api/v2/stats/daily';

    var filter_from = '20150701';
    var filter_to = '20150801';

    stats_url += "?from=" + filter_from;
    stats_url += "&to=" + filter_to;

    fetch(stats_url, {
          headers: {
            'Authorization': 'Bearer ' + self.app_token
          }
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            var new_data = [
                ['Logins'],
                ['Signups']
            ];

            data.forEach(function(d){
                new_data[0].push(d.logins);
                new_data[1].push(d.signups);
            });

            return new_data;
        })
        .then(function(data){
            var chart_wrapper = self.wrapper.append('div')
                                    .attr('id', 'daily');
            var type = self.get_chart_type('spline');
            type(chart_wrapper, data);
        })
        .catch(function(ex) {
            console.log('parsing failed', ex)
        });

}
