import Chart from "./chart.js"

export default class PieChart extends Chart {
    constructor (bindto, data) {
        super(bindto, data, 'pie');
    }
}
