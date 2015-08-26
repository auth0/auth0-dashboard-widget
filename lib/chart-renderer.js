import {charts} from "./charts.js"
import {sources} from "./sources.js"
import Pipeline from "./pipeline.js"

export default function renderer(data) {
  var render_pipeline = new Pipeline();

  render_pipeline.push( sources[data.data] );
  render_pipeline.push( charts[data.type] );

  data.wrapper = data.dashboard_wrapper.append('div')
                        .attr('id', `a0-${data.type}-${data.data}`)
                        .classed(`a0-${data.type}`,true);

  render_pipeline.run(data);
}
