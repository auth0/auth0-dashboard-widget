var _ = require('lodash');
var c3 = require('c3');

import Auth0BasicChartWidget from './basic';

export default class Auth0MultivalueChartWidget extends Auth0BasicChartWidget {
  process_data (raw_data) {
    raw_data = _.flatten( _.map(raw_data, ( e => ( e[this.options.grouping_field] || 'Unknown' ) ) ) )

    var grouped_data = _.groupBy(raw_data);

    if ( ! this.categories) {
      this.categories = Object.keys(grouped_data);
    }
    var keys = _.clone(this.categories);
    keys = _.sortBy(keys);

    return this.options.data_processor(keys, grouped_data, 'Users count');
  }

}
          
          