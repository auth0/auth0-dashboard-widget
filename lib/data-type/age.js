import Data from "./data.js"

export default class AgeData extends Data {
    constructor (domain, app_token, chart_data) {
        super(domain, app_token, chart_data);
    }

    get() {
      var url = `https://${this.domain}/api/v2/stats/users-age`;
      return fetch(url, { headers: { 'Authorization': `Bearer ${this.app_token}` } })
          .then( response => response.json() )
          .then( data => data.map( d => [ d.age, d.count ] ) )
    }
}
