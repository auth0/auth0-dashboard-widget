var c3 = require('c3');

export default class Chart {
    constructor (bindto, data, type) {
      this.settings = {
        bindto: bindto,
        data: {
          columns: data,
          type : type
        }
      }
    }
    set_x_axis() {
      return this;
    }
    generate() {
      return c3.generate(this.settings);
    }
}
