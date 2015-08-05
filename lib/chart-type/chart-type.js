import PieChart from "./pie.js"
import BarChart from "./bar.js"
import SplineChart from "./spline.js"

export default function GetChartType(type) {
    var chart_type;

    switch (type) {

        case 'pie':
            chart_type = PieChart;
            break;

        case 'bar':
            chart_type = BarChart;
            break;

        case 'spline':
            chart_type = SplineChart;
            break;

        default:
            throw "Ivalid chart type '" + type + "'.";

    }

    return chart_type;
}
