import Chart from "./chart.js"

export default class SplineChart extends Chart {
    constructor (bindto, data) {
        super(bindto, data, 'spline');
    }

    set_x_axis (data) {
        var x_axix_label = 'x';
        data.unshift(x_axix_label);

        this.settings.data.x = x_axix_label;
        this.settings.data.columns.push(data);
        this.settings.axis = {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%m-%d'
                }
            }
        };

        return this;
    }
}
