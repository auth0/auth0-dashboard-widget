var _ = require('lodash');
var c3 = require('c3');

export default class Auth0GenderWidget {
  constructor (options) {
    var _this = this;
    this.name = 'gender';
    this.options = options;
    this.onClickCallbacks = [];

    this.setup = {
      bindto: options.wrapper_selector, 
      data:{
        type:options.type,
        selection: {
          enabled: options.selection_enabled
        },
        onclick: (d, i)  => this.setFilter(d,i)
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

    if (selection.length === 0) {
      data = null;
    } else {

      var filter_selection = selection.map(function(e){
        if(_this.options.type === 'pie') {
          return e.id;
        } else {
          return _this.categories[e.index];
        }
      });

      var data = {
        field:'gender',
        value:filter_selection
      };
    }

    this.onClickCallbacks.forEach( callback => callback( this, data ) )
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

  onClick (callback) {
    this.onClickCallbacks.push(callback);
  }

  process_data(raw_data) {
    var grouped_data = _.groupBy(raw_data, ( e => ( e.gender || 'Unknown' ) ) );
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
          
