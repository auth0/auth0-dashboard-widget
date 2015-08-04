var c3 = require('c3');
var d3 = require('d3');

function BarChart(bindto, data) {

    var chart = c3.generate({
        bindto: bindto,
        data: {
            columns: data,
            type : 'bar'
        }
    });

    return chart;
}

module.exports = BarChart;
