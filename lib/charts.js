var c3 = require('c3');

export const charts = {

  pie: function(data) {

    var settings = {
      bindto: data.wrapper,
      data: {
        columns: data.columns,
        type : 'pie'
      }
    };

    c3.generate(settings)

  },

  bar: function(data) {

    var settings = {
      bindto: data.wrapper,
      data: {
        columns: data.columns,
        type : 'bar'
      }
    };

    if (data.x_axis_data) {
      data.x_axis_data.unshift('x');
      settings.data.x = 'x';
      settings.data.columns.push(data.x_axis_data);

      settings.axis = {
        x: {
          type: 'category'
        }
      };
    }

    c3.generate(settings);

  },

  spline: function(data) {

    var settings = {
      bindto: data.wrapper,
      data: {
        columns: data.columns,
        type : 'spline'
      }
    };

    if (data.x_axis_data) {
      data.x_axis_data.unshift('x');
      settings.data.x = 'x';
      settings.data.columns.push(data.x_axis_data);
      settings.axis = {
        x: {
          type: 'category',
        }
      };
    }

    c3.generate(settings)

  }
}
