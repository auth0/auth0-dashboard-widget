var c3 = require('c3');

export default function BarChart(bindto, data) {

    return c3.generate({
        bindto: bindto,
        data: {
            columns: data,
            type : 'bar'
        }
    });

}
