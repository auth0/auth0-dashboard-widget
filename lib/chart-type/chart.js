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
    generate() {
        return c3.generate(this.settings);
    }
}
