import PieChart from "./pie.js"
import BarChart from "./bar.js"
import SplineChart from "./spline.js"

export const chartTypes = {
  pie:'pie',
  bar:'bar',
  spline:'spline'
}

export function GetChartType(type) {
    var chart_type;

    switch (type) {

        case chartTypes.pie:
            chart_type = PieChart;
            break;

        case chartTypes.bar:
            chart_type = BarChart;
            break;

        case chartTypes.spline:
            chart_type = SplineChart;
            break;

        default:
            throw "Ivalid chart type '" + type + "'.";

    }

    return chart_type;
}
