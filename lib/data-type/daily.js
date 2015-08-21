import Data from "./data.js"

var dateFormat = require('dateformat');

export default class DailyData extends Data {
    constructor (domain, app_token, chart_data) {
        super(domain, app_token, chart_data);

        this.today = new Date();
        this.a_month_ago = (new Date());
        this.a_month_ago.setMonth( this.a_month_ago.getMonth() - 1 )

        this.filter_from = dateFormat( this.a_month_ago, "yyyymmdd" );
        this.filter_to = dateFormat( this.today, "yyyymmdd" );
    }

    get_x_axis() {
      var x_axis_data = [];
      for( let day = this.a_month_ago; day <= this.today; day.setHours( day.getHours() + 24 ) ) {
          x_axis_data.push(dateFormat( day, "yyyy-mm-dd" ));
      }
      return x_axis_data;
    }

    get() {
      var url = `https://${this.domain}/api/v2/stats/daily?from=${this.filter_from}&to=${this.filter_to}`;

      return fetch(url, { headers: { 'Authorization': `Bearer ${this.app_token}` } })
          .then( response => response.json() )
          .then(
              data => data.reduce(function(prev, curr){
                              prev[0].push(curr.logins);
                              prev[1].push(curr.signups);
                              return prev;
                          }, [ ['Logins'], ['Signups'] ])
          )
          // .then(
          //     data => self.load_chart({ name: 'daily', type: 'spline'}, data, wrapper)
          //                 .set_x_axis(x_axis_data)
          //                 .generate()
          // )
          // .catch( ex => console.log('parsing failed', ex) );
    }
}
