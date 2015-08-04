var c3 = require('c3');

export default function PieChart(bindto, data) {

    return c3.generate({
        bindto: bindto,
        data: {
            columns: data,
            type : 'pie'
        }
    });

}
