var c3 = require('c3');

function SplineChart(bindto, data) {

    var chart = c3.generate({
        bindto: bindto,
        data: {
            columns: data,
            type : 'spline'
        }
    });

    return chart;
}

module.exports = SplineChart;
