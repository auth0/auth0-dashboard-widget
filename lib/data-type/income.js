import Data from "./data.js"

export default class IncomeData extends Data {
    constructor (domain, app_token, chart_data) {
      super(domain, app_token, chart_data);
      this.x_axis_data = [];
    }

    get() {
      var url = `https://${this.domain}/api/v2/stats/income`;
      return fetch(url, { headers: { 'Authorization': `Bearer ${this.app_token}` } })
          .then( response => response.json() )
          .then( data => data.reduce( ( prev, curr ) => (prev[0].push(curr.count), prev[1].push(curr.income/1000),this.x_axis_data.push(curr.zipcode), prev), [ ['Users'], ['Income'] ] ) )
    }

    get_x_axis() {
      return this.x_axis_data;
    }
}
