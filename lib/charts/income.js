var _ = require('lodash');
var d3 = require('d3');
var ParallelCoordinates = require('../chartlibs/ParallelCoordinates');

export default class Auth0IncomeWidget {
  constructor (options) {
    var _this = this;
    this.options = options;

    this.name = options.name;

    this.onClickCallbacks = [];

    this.setup = {
      container:options.wrapper_selector,
      scale:"linear",
      columns:["zipcode","count","income"],
      ref:"lang_usage",
      title_column:"zipcode",
      scale_map:{
        "zipcode":"ordinal",
        "count":"ordinal",
        "income":"linear"
      },
      use:{
        "name":"count"
      },
      sorting:{
        "count":d3.ascending
      },
      dimensions:["count","income","zipcode"],
      column_map:{
        "zipcode":"zipcode",
        "income":"income",
        "count":"count"
      },
      formats:{
      },
      help:{
        "zipcode":"<h4>Zipcode</h4>This is the users zipcode based on their IP.",
        "income":"<h4>Income</h4>This is the Zipcode median household income based on the last US census.",
        "count":"<h4>Count</h4>Amount of users that login in the related zipcode."
      },
      duration:1000,
      onclick: (d)  => this.setFilter(d)
    };
    
  }

  setFilter(d,i) {

    this.filter_selection = this.chart.selected().map( e => e.key );

    if (this.filter_selection.length === 0) {
      data = null;
    } else {
      var data = {
        field:'zipcode',
        value:this.filter_selection
      };
    }

    this.onClickCallbacks.forEach( callback => callback( this, data ) )
  }

  update(raw_data) { 
    if (this.chart) {
      this.load (raw_data);
    } else {
      this.init (raw_data);
    }
  }

  init (raw_data) {
    this.chart = new ParallelCoordinates(this.process_data(raw_data),this.setup);
  }

  load (raw_data) {
    this.chart.loadData(this.process_data(raw_data));
  }

  onClick (callback) {
    this.onClickCallbacks.push(callback);
  }

  process_data (raw_data) {
    raw_data = raw_data.filter(function(e) {return e.zipcode !== null;});
    var grouped_data = _.groupBy(raw_data, function(e) { return e.zipcode; });

    var data = Object.keys(grouped_data).map(function(key) {
      return {
        zipcode:key,
        count: grouped_data[key] ? grouped_data[key].length : 0,
        income: grouped_data[key][0].income ? grouped_data[key][0].income : 0
      };
    });

    return data;
  }

}
          
