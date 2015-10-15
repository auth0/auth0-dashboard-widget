var _ = require('lodash');
var c3 = require('c3');

export default class Auth0TimeLineChartWidget {
  constructor (options) {
    var _this = this;
    this.options = options;

    this.name = options.name;

    this.onClickCallbacks = [];

    this.setup = {
        bindto: options.wrapper_selector,
        data: {
          x: 'x',
          type:options.type
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y:{
                tick:{
                    format:function(x){return (x == Math.floor(x)) ? x: "";}
                }
            }
        }
    };
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

  }

  process_data (raw_data) {
    var limitDate = new Date();
    var _this = this;

    var date_formatter = d3.time.format("%Y-%m-%d");

    limitDate.setMonth(limitDate.getMonth() - 1);

    raw_data = raw_data.filter(function(e){
      e.created_at_obj = new Date( e[_this.options.grouping_field] );
      e.created_at_day = date_formatter(e.created_at_obj);
      return e.created_at_obj>limitDate;
    })

    var grouped_data = _.groupBy(raw_data, e => e.created_at_day );

    if ( ! this.categories) {
      this.categories = Object.keys(grouped_data);
    }
    var keys = _.clone(this.categories);
    keys = _.sortBy(keys);

    return this.options.data_processor(keys, grouped_data, 'Signups');
  }

}
          
