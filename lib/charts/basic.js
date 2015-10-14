var _ = require('lodash');
var c3 = require('c3');

export default class Auth0BasicChartWidget {
  constructor (options) {
    var _this = this;
    this.options = options;

    this.name = options.name;

    this.onClickCallbacks = [];

    this.setup = {
      bindto: options.wrapper_selector, 
      data:{
        type:options.type,
        selection: {
          enabled: options.selection_enabled
        },
        onclick: (d, i)  => this.setFilter(d,i),
        color: function (color, d) {
          var bucket;
          if (typeof(d) === 'string') {
            bucket = d;
          } else {
            bucket = d.id;
          }
          
          if (_this.filter_selection && _this.filter_selection.length > 0 && _this.filter_selection.indexOf(bucket) === -1) {
            return '#DDDDDD';
          }

          return (d === 'Unknown') ? '#CACACA' : color;
        }
      },
      color: {
        pattern: options.color_pattern
      },
      axis: {
        x: {
          type: 'category'
        }
      }
    };
  }

  setFilter(d,i) {

    var _this = this;
    var selection = this.chart.selected();
    var data;

    this.filter_selection = selection.map(function(e){
      if(_this.options.type === 'pie') {
        return e.id === 'Unknown' ? null : e.id;
      } else {
        return _this.categories[e.index] === 'Unknown' ? null : _this.categories[e.index];
      }
    });

    if (this.filter_selection.length === 0) {
      data = null;
    } else {

      var data = {
        field:this.options.grouping_field,
        value:this.filter_selection
      };
    }

    this.onClickCallbacks.forEach( callback => callback( this, data ) )

    this.chart.flush();
  }

  update(raw_data) { 
    if (this.chart) {
      this.load (raw_data);
    } else {
      this.init (raw_data);
    }
  }

  init (raw_data) {
    this.setup.data.columns = this.process_data(raw_data);
    this.chart = c3.generate(this.setup);
  }

  load (raw_data) {
    this.chart.load({
      columns: this.process_data(raw_data)
    });
  }

  onClick (callback) {
    this.onClickCallbacks.push(callback);
  }

  process_data (raw_data) {
    var grouped_data = _.groupBy(raw_data, ( e => ( e[this.options.grouping_field] || 'Unknown' ) ) );

    if ( ! this.categories) {
      this.categories = Object.keys(grouped_data);
    }
    var keys = _.clone(this.categories);
    keys = _.sortBy(keys);

    return this.options.data_processor(keys, grouped_data, 'Users count');
  }

}
          
          