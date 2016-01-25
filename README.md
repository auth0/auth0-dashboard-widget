#Auth0 Dashboard Widget

Widget to show a dashboard about your users stats consuming the API provided by [Auth0 Dashboard Backend](https://github.com/auth0/auth0-dashboard-backend)

##How it works
This widget can be separated in different sections. First, it provides different kind of ways to show your data. Second, it will connect all the widgets in order to allow cross filtering and data drill down. Finally, it uses an API to filter your users data.

###Charts

All chart must register to the `Auth0DasboardWidget` which is the responsible of handling the chart events, calling the API to retrieve the fitered information and udpate the events.

```
var widget = new Auth0DasboardWidget(api_endpoint);

widget.on('loading', function(){
    document.getElementById('loading').className = "visible";
});
widget.on('loaded', function(){
    document.getElementById('loading').className = "";
})

widget.init();

widget.register(chart1);
widget.register(chart2);
```

* The api endpoint is the one the widget will call to retrieve the information
* The events `loading` and `loaded` are called before and after the api request is made
* The `register` method is used to regist each chart to the widget

The `Auth0DasboardWidget` provides an event in order to make it easy to register the charts in case they are instantiated separately. You can listen to the event like this:

```
window.addEventListener('a0-dashboard-init', function (e) { 
    var map = new Auth0MapWidget({
            ...        
        });
    e.detail.widget.register(map);
});

```

#### Basic chart
This one will provide a simple pie or bar chart.

```
var age = new Auth0BasicChartWidget({
        name:'age',
        grouping_field:'agebucket',
        selection_enabled: true,
        color_pattern:['#F39C12','#2ECC71','#3498DB','#9B59B6','#34495E','#F1C40F','#E67E22','#E74C3C', '#1ABC9C'],
        type: 'pie',
        data_processor: Auth0PieDataProcessor,
        wrapper_selector:'#auth0ChartAge'
    });
```
* name: chart name
* grouping_field: field it will use to show the data
* selection_enabled: allow the user to select what will be user for filtering the data
* color_pattern: colors used in the chart
* type: C3js chart type
* data_processor: how it will handle the data to be shown (Pie or Bar data processor)
* wrapper_selector: where it will be shown

#### Map chart
It will show a map based on geolocated data

```
var map = new Auth0MapWidget({
    name:'location',
    wrapper_selector:'auth0ChartLocations',
    map_styles:[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
});
```

* map_styles: a way to customize the map style

#### TimeLine chart

This will show a line chart based on a timeline

#### Income chart

This is a multidimention chart based on parallel coordinates.

##API endpoint
This widget needs an API in order to store the rates of the products. You can use webtask.io if you don't have a backend and it is provided with the plugin.

In order to create your webtask, download the [webtask code](https://github.com/auth0/auth0-rate-widget/blob/master/webtasks/rating_endpoint.js) and follow this steps:

  * Follow the instructions to install the `wt-cli` tool and setup it for your [Auth0 account](https://manage.auth0.com/#/account/webtasks).
  * Create the webtask used by the plugin to retrieve the information:
```
wt create dashboard_endpoint.js --no-merge --no-parse
```
  * Create the cronned webtask used to retriebe your users info and process it to allow the plugin query this information:
```
wt cron schedule -n dashboard-cron "*/30 * * * *" dashboard_cron.js -p "wptest-default" \
  --secret mongo_connection_string=mongo_connection_string \
  --secret domain=yourdomain.auth0.com \
  --secret app_token=app_token \
  --output url mfa-passwordless.js
```
    - mongo_connection_string: This widget needs some place to store the users information. In this case it uses a Mongolab MongoDB database.
    - domain: your account domain
    - app_token: this should be a valid app_token, with `read:users` scope (you can generate one here https://auth0.com/docs/api/v2#!/Users/get_users)


## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
