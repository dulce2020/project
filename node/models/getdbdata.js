var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ltu');
var dht11Schema = new mongoose.Schema({
    'pm25': Number,
    'pm10': Number,
	'CO2': Number,
	'CO': Number,	
    'CH4': Number,	
    'Time': String
});
var getdbdata = mongoose.model('ltua58c090', dht11Schema);
module.exports = getdbdata;