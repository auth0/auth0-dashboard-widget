var c3 = require('c3');

export default function SplineChart(bindto, data) {

    return c3.generate({
        bindto: bindto,
        data: {
            columns: data,
            type : 'spline'
        }
    });

}
