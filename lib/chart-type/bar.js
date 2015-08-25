import Chart from "./chart.js"

export default class BarChart extends Chart {
    constructor (bindto, data) {
        super(bindto, data, 'bar');
    }

    set_x_axis (retriever) {
      var data = retriever.get_x_axis();
      var x_axix_label = 'x';
      data.unshift(x_axix_label);

      this.settings.data.x = x_axix_label;
      this.settings.data.columns.push(data);

      return this;
    }
}
