export default function process(keys, grouped_data, name) {
	var data = [];
    var values = keys.map(function(key) {
      return (grouped_data[key] ? grouped_data[key].length : 0);
    });
    keys.unshift('x');
    values.unshift(name);
    data.push(keys);
    data.push(values);
    return data;
}