import {GetChartType} from "../chart-type/chart-type.js"

export default class Data {
    constructor (domain, app_token, chart_data) {
        this.domain = domain;
        this.app_token = app_token;
        this.chart_data = chart_data;
    }

    get_x_axis() {
      return [];
    }
}
