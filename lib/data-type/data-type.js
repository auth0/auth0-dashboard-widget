import AgeData from "./age.js"
import ProvidersData from "./providers.js"
import DailyData from "./daily.js"

export const dataTypes = {
  age:'age',
  providers:'providers',
  daily:'daily'
}

export function GetDataType(type) {
    var data_type;

    switch (type) {

        case dataTypes.age:
            data_type = AgeData;
            break;
        case dataTypes.providers:
            data_type = ProvidersData;
            break;
        case dataTypes.daily:
            data_type = DailyData;
            break;

        default:
            throw "Ivalid data type '" + type + "'.";

    }

    return data_type;
}
