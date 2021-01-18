var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var trainingSchema = new Schema({

  location: {
    type: String,
    required: true,
    validate: function(location) {
      return /^([a-zA-ZüÜäÄöÖß]+\s{0,1}|[a-zA-ZüÜäÄöÖß]+[-]{0,1}){1,10}$/.test(location)
    }
  },
  date: {
    type: Date,
    required: true,
  },
  timestart: {
    type: String,
    required: true,
    validate: function(timestart) {
      return /^([0][1-9]|[1][0-9]|[2][0-3]):([0][0-9]|[1-5][0-9])$/.test(timestart)
    }
  },
  timeend: {
    type: String,
    required: true,
    validate: function(timeend) {
      return /^([0][1-9]|[1][0-9]|[2][0-3]):([0][0-9]|[1-5][0-9])$/.test(timeend)
    }
  },
  priceyouth: {
    type: String,
    required: true,
    validate: function(priceyouth) {
      return /^([0-9]|[0-9][0-9]).([0][0-9]|[1-9][0-9])$/.test(priceyouth)
    }
  },
  priceadult: {
    type: String,
    required: true,
    validate: function(priceadult) {
      return /^([0-9]|[0-9][0-9]).([0][0-9]|[1-9][0-9])$/.test(priceadult)
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['Eishockey', 'Inlinehockey']
  },
  _status: {
    type: String,
    required: true,
    default: 'in-active',
    enum: ['active', 'in-active', 'rejected']
  }
}, { timestamps: true });

var Training = mongoose.model('col_training', trainingSchema);

module.exports = Training
