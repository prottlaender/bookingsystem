var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({

  location: {
    type: String,
    required: true,
    validate: function(location) {
      return /^([a-zA-ZüÜäÄöÖß]+\s{0,1}|[a-zA-ZüÜäÄöÖß]+[-]{0,1}){1,10}$/.test(location)
    }
  },
  street: {
    type: String,
    required: true,
    validate: function(street) {
      return /^([a-zA-ZüÜäÄöÖß]+\s{0,1}|[a-zA-ZüÜäÄöÖß]+[-]{0,1}){1,10}\s{1}([0-9]{1,10}[a-z]{0,3})$/.test(street)
    }
  },
  plz: {
    type: String,
    required: true,
    validate: function(plz) {
      return /^([0-9][0-9][0-9][0-9][0-9])$/.test(plz)
    }
  },
  city: {
    type: String,
    required: true,
    validate: function(city) {
      return /^([a-zA-ZüÜäÄöÖß]+\s{0,1}|[a-zA-ZüÜäÄöÖß]+[-]{0,1}){1,10}$/.test(city)
    }
  },
  priceyouth: {
    type: String,
    required: true,
    validate: function(priceyouth) {
      return /^(([0-9])|([1-9][0-9])).([0][0-9]|[1-9][0-9])$/.test(priceyouth)
    }
  },
  priceadult: {
    type: String,
    required: true,
    validate: function(priceadult) {
      return /^(([0-9])|([1-9][0-9])).([0][0-9]|[1-9][0-9])$/.test(priceadult)
    }
  },
  _status: {
    type: String,
    required: true,
    default: 'active',
    enum: ['active', 'in-active']
  }

}, { timestamps: true });


var Location = mongoose.model('col_location', locationSchema);

module.exports = Location
