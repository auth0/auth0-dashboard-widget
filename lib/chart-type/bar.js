import Chart from "./chart.js"

export default class BarChart extends Chart {
    constructor (bindto, data) {
        super(bindto, data, 'bar');
    }
}
