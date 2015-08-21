import {GetChartType} from "./chart-type/chart-type.js"
import {GetDataType} from "./data-type/data-type.js"

export default function renderer(domain, app_token, wrapper, chart_settings) {

  var dataType = GetDataType(chart_settings.data);
  var chartType = GetChartType(chart_settings.type);

  var chart_wrapper = wrapper.append('div')
                        .attr('id', `a0-${chart_settings.type}-${chart_settings.data}`)
                        .classed(`a0-${chart_settings.type}`,true);

  var dataRetriever = new dataType(domain, app_token, chart_settings);


  dataRetriever.get()
    .then( data => (new chartType(chart_wrapper, data)).set_x_axis(dataRetriever).generate() )
    .catch( ex => console.log('parsing failed', ex, chart_settings) );;
}
