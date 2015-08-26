var dateFormat = require('dateformat');

export const sources = {

  age: function(data, next) {
    var url = `https://${data.domain}/api/v2/stats/users-age`;

    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then( response => response.reduce( function(prev,curr) {
            prev.axis.push(curr.age);
            prev.columns.push(curr.count);
            return prev;
          }, {axis:[],columns:['Users']} ))
        .then( function(response){
          data.columns = [response.columns];
          data.x_axis_data = response.axis;
          next(data);
        });
  },

  providers: function(data, next) {
    var url = `https://${data.domain}/api/v2/stats/providers`;
    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then( data => data.map( d => [ d.provider, d.count ] ) )
        .then( function(response){
          data.columns = response;
          next(data);
        });
  },

  daily: function(data, next) {

    var today = new Date();
    var a_month_ago = (new Date());
    a_month_ago.setMonth( a_month_ago.getMonth() - 1 )

    var filter_from = dateFormat( a_month_ago, "yyyymmdd" );
    var filter_to = dateFormat( today, "yyyymmdd" );


    var url = `https://${data.domain}/api/v2/stats/daily?from=${filter_from}&to=${filter_to}`;
    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then(
            data => data.reduce(function(prev, curr){
                            prev.columns[0].push(curr.logins);
                            prev.columns[1].push(curr.signups);

                            prev.axis.push( dateFormat( new Date(curr.date), "mm/dd/yyyy" ) );

                            return prev;
                        }, {
                          columns:[ ['Logins'], ['Signups'] ],
                          axis:[]
                        })
        )
        .then( function(response){
          data.columns = response.columns;
          data.x_axis_data = response.axis;
          next(data);
        });
  },

  income: function(data, next) {
    var url = `https://${data.domain}/api/v2/stats/income`;
    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then( data => data.reduce( function( prev, curr ) {

          prev.columns[0].push(curr.count);
          prev.columns[1].push(curr.income/1000);
          prev.axis.push(curr.zipcode);
          return prev;

        }, {
          columns:[ ['Users'], ['Income'] ],
          axis:[]
        } ) )
        .then( function(response){
          data.columns = response.columns;
          data.x_axis_data = response.axis;
          next(data);
        });
  }

}
