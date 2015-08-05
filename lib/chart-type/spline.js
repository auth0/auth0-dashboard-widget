import Chart from "./chart.js"

export default class SplineChart extends Chart {
    constructor (bindto, data) {
        super(bindto, data, 'spline');
    }
}
