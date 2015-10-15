require('./lib/insert-css');

var _      = require('lodash');
var d3      = require('d3');
var fetch   = require('fetchify')(Promise).fetch;

export default class Auth0DasboardWidget {
    
  constructor (endpoint_url) {
    if (!(this instanceof Auth0DasboardWidget)) {
        return new Auth0DasboardWidget(endpoint_url);
    }

    this.endpoint_url = endpoint_url;
    this.data = null;
    this.charts = [];
    this.filters = [];
    this.events = {};

    var event = new CustomEvent('a0-dashboard-init', { detail: {
      widget:this
    }});
    window.dispatchEvent(event);
  }

  init() {
    this.load();
  }

  load(filters, widgets) {
    this.dispatch('loading');

    return fetch(this.endpoint_url, {
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
      .then( response => this.data = response )
      .then( response => this.charts.filter(chart => !widgets || widgets.indexOf(chart.name) === -1 )
                                    .forEach( chart => chart.update(response) ) )
      .then( () => this.dispatch('loaded') );
  }

  dispatch(event) {
    if (this.events[event]) {
      this.events[event].forEach( cb => cb() );
    }
  }

  on(event, cb) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(cb);
  }

  register(chart) {
    this.charts.push(chart);

    chart.onClick((chart, data) => this.filter(chart, data));

    if (this.data !== null) {
      chart.init(this.data);
    }
  }

  filter(chart, data) {

    if (data === null) {
      delete this.filters[chart.name];
    } else {
      this.filters[chart.name] = data;
    }

    this.load(_.values(this.filters), Object.keys(this.filters));
  }

  refresh() {
    this.load(_.values(this.filters), Object.keys(this.filters));
  }

}

