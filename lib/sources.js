var dateFormat = require('dateformat');

export const sources = {

  age: function(data, next) {
    var url = `https://${data.domain}/api/v2/stats/users-age`;
    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then( response => response.map( d => [ d.age, d.count ] ) )
        .then( function(response){
          data.columns = response;
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

    var x_axis_data = [];

    var url = `https://${data.domain}/api/v2/stats/daily?from=${filter_from}&to=${filter_to}`;
    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then(
            data => data.reduce(function(prev, curr){
                            prev[0].push(curr.logins);
                            prev[1].push(curr.signups);
                            x_axis_data.push(new Date(curr.date));
                            return prev;
                        }, [ ['Logins'], ['Signups'] ])
        )
        .then( function(response){
          data.columns = response;
          data.x_axis_data = x_axis_data;
          next(data);
        });
  },

  income: function(data, next) {
    var x_axis_data = [];

    var url = `https://${data.domain}/api/v2/stats/income`;
    return fetch(url, { headers: { 'Authorization': `Bearer ${data.app_token}` } })
        .then( response => response.json() )
        .then( data => data.reduce( function( prev, curr ) {
          prev[0].push(curr.count);
          prev[1].push(curr.income/1000);
          x_axis_data.push(curr.zipcode);
          return prev;
        }, [ ['Users'], ['Income'] ] ) )
        .then( function(response){
          data.columns = response;
          data.x_axis_data = x_axis_data;
          next(data);
        });
  }

}
