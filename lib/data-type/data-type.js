import AgeData from "./age.js"
import ProvidersData from "./providers.js"
import DailyData from "./daily.js"
import IncomeData from "./income.js"

export const dataTypes = {
  age:'age',
  providers:'providers',
  daily:'daily',
  income:'income'
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
        case dataTypes.income:
            data_type = IncomeData;
            break;

        default:
            throw "Ivalid data type '" + type + "'.";

    }

    return data_type;
}
