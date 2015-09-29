require('./lib/insert-css');

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

      if (this.options.wrapper) {
        this.element_wrapper = d3.select(this.options.wrapper);
      }

      var event = new CustomEvent('a0-dashboard-init', { detail: {
        widget:this
      }});
      window.dispatchEvent(event);
    }

    init() {
       return fetch(`${this.domain}/stats`)
        .then( response => response.json() )
        .then( function(response) {
          console.table(response);
          return response;
        } )
        .then( response => this.charts.forEach( chart => chart.init(response) ) )
    }

    register(chart) {
      this.charts.push(chart);
    }

}

