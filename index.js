require('./lib/insert-css');

var d3 = require('d3');

var PieChart = require('./lib/chart-type/pie.js');
var BarChart = require('./lib/chart-type/bar.js');

module.exports = Auth0DasboardWidget;

function Auth0DasboardWidget (app_token, domain, options) {

    if (!(this instanceof Auth0DasboardWidget)) {
        return new Auth0DasboardWidget(app_token, domain, options);
    }

    this.charts = options.charts;

}

Auth0DasboardWidget.prototype.get_chart_type = function(type) {
    switch (type) {
        case 'pie':
            return PieChart;
            break;
        case 'bar':
            return BarChart;
            break;
        default:
            throw "Ivalid chart type '" + type + "'.";

    }
}

Auth0DasboardWidget.prototype.show = function(ele) {

    var self = this;

    self.wrapper = d3.select(ele);

    self.charts.forEach(function(chart){
        var type = self.get_chart_type(chart.type);

        d3.json(chart.url, function(error, data) {
            var chart_wrapper = self.wrapper.append('div')
                                    .attr('id', chart.name);

            var chart_data = data.map(function(d){
                return [
                    d.age,
                    d.count
                ];
            });

            type(chart_wrapper, chart_data);

        });
    });


}
