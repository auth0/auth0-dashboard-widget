export default function process(keys, grouped_data) {
	var data = keys.map(function(key) {
      return [key, (grouped_data[key] ? grouped_data[key].length : 0)];
    });
    return data;
}