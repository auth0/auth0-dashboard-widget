var _ = require('lodash');
var c3 = require('c3');

export default class Auth0GenderWidget {
  constructor (options) {
    var _this = this;
    this.name = 'age';
    this.options = options;

    this.setup = {
      bindto: options.wrapper_selector, 
      data:{
        type:options.type,
        selection: {
          enabled: options.selection_enabled
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

  init (raw_data) {
    this.setup.data.columns = this.process_data(raw_data);
    this.chart = c3.generate(this.setup);
    console.log(this.setup.data.columns);
  }

  load (raw_data) {
    this.chart.load({
      columns: this.process_data(raw_data)
    });
  }

  process_data(raw_data) {
    var grouped_data = _.groupBy(raw_data, function(e) { return e.gender || 'Unknown'; });
    if ( ! this.categories) {
      this.categories = Object.keys(grouped_data);
    }
    var keys = _.clone(this.categories);
    keys = _.sortBy(keys);

    return this.options.data_processor(keys, grouped_data, 'Users count');
  }

}


            // setup.data.onclick = function (d, i) {
            //   var selection = this.selected();
            //   _this.filter_selection = selection.map(function(e){
            //     <?php if($this->type === 'pie') {?>
            //       return e.id;
            //     <?php } else {?>
            //       return _this.categories[e.index];
            //     <?php } ?>
            //   });
            //   if (selection.length === 0) {
            //     filter_callback( _this, null, null, null );
            //   } else {
            //     filter_callback(_this, 'Age', _this.filter_selection, function(e) { return _this.filter_selection.indexOf(e.agebucket) > -1; } );
            //   }
            //   _this.chart.flush();
            // };
            // setup.data.color = function (color, d) {
            //   var bucket;
            //   if (typeof(d) === 'string') {
            //     bucket = d;
            //   } else {
            //     bucket = d.id;
            //   }
            //   if (_this.filter_selection && _this.filter_selection.length > 0 && _this.filter_selection.indexOf(bucket) === -1) {
            //     return '#DDDDDD';
            //   }
            //   return (d === '<?php echo WP_Auth0_Dashboard_Widgets::UNKNOWN_KEY; ?>') ? '#CACACA' : color;
            // };
          
