require('./lib/insert-css');

var _      = require('lodash');
var d3      = require('d3');
var fetch   = require('fetchify')(Promise).fetch;

export default class Auth0DasboardWidget {
    
    constructor (domain, options) {
      if (!(this instanceof Auth0DasboardWidget)) {
          return new Auth0DasboardWidget(domain, options);
      }

      this.domain = domain;
      this.options = options.charts;
      this.charts = [];
      this.filters = [];

      if (this.options.wrapper) {
        this.element_wrapper = d3.select(this.options.wrapper);
      }

      var event = new CustomEvent('a0-dashboard-init', { detail: {
        widget:this
      }});
      window.dispatchEvent(event);
    }

    load(filters, widgets) {
      return fetch(`${this.domain}/stats`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filter: filters
          })
        })
        .then( response => response.json() )
        // .then( function(response) {
        //   console.table(response);
        //   return response;
        // } )
        .then( response => this.charts.filter(chart => !widgets || widgets.indexOf(chart.name) === -1 )
                                      .forEach( chart => chart.init(response) ) );
    }

    register(chart) {
      this.charts.push(chart);

      chart.onClick((chart, data) => this.filter(chart, data));
    }

    filter(chart, data) {

      if (data === null) {
        delete this.filters[chart.name];
      } else {
        this.filters[chart.name] = data;
      }

      this.load(_.values(this.filters), Object.keys(this.filters));
    }

}

