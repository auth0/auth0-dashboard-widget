var c3 = require('c3');
var d3 = require('d3');

function PieChart(bindto, data) {

    var chart = c3.generate({
        bindto: bindto,
        data: {
            columns: data,
            type : 'pie'
        }
    });

    return chart;
}

module.exports = PieChart;
