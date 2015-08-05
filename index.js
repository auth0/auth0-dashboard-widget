require('./lib/insert-css');

var d3      = require('d3');
var fetch   = require('fetchify')(Promise).fetch;
var dateFormat = require('dateformat');

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

Auth0DasboardWidget.prototype.load_chart = function (chart, data, wrapper) {
    var chart_wrapper = wrapper.append('div')
                            .attr('id', chart.name);
    var type = GetChartType(chart.type);
    return new type(chart_wrapper, data);
}

Auth0DasboardWidget.prototype.show = function(ele) {
    var self = this;
    var wrapper = d3.select(ele);

    for (let a = 0; a < self.charts.length; a++) {
        let chart = self.charts[a];

        fetch(chart.url)
            .then(response => response.json())
            .then( data => data.map( d => [ d.age, d.count ] ) )
            .then(
                data => self.load_chart(chart, data, wrapper)
                            .generate()
            )
            .catch( ex => console.log('parsing failed', ex) );
    }

}

Auth0DasboardWidget.prototype.showDaily = function(ele) {
    var self = this;

    var wrapper = d3.select(ele).append('div')
                               .attr('id', 'daily');

    var today = new Date();
    var a_month_ago = new Date();
    a_month_ago.setMonth( a_month_ago.getMonth() - 1 );

    var filter_from = dateFormat( a_month_ago, "yyyymmdd" );
    var filter_to = dateFormat( today, "yyyymmdd" );

    var x_axis_data = [];
    for( let day = a_month_ago; day <= today; day.setHours( day.getHours() + 24 ) ) {
        x_axis_data.push(dateFormat( day, "yyyy-mm-dd" ));
    }

    var stats_url = `https://${self.domain}/api/v2/stats/daily?from=${filter_from}&to=${filter_to}`;

    fetch(stats_url, { headers: { 'Authorization': `Bearer ${self.app_token}` } })
        .then( response => response.json() )
        .then(
            data => data.reduce(function(prev, curr){
                            prev[0].push(curr.logins);
                            prev[1].push(curr.signups);
                            return prev;
                        }, [ ['Logins'], ['Signups'] ])
        )
        .then(
            data => self.load_chart({ name: 'daily', type: 'spline'}, data, wrapper)
                        .set_x_axis(x_axis_data)
                        .generate()
        )
        .catch( ex => console.log('parsing failed', ex) );

}
