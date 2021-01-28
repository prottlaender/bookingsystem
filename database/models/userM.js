var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({

  name: {
    type: String,
    required: true,
    validate: function(name) {
      return /^[a-zA-ZüÜäÄöÖ]+\s{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(name)
    }
  },
  lastname: {
    type: String,
    required: true,
    validate: function(lastname) {
      return /^[a-zA-ZüÜäÄöÖ]+[-]{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(lastname)
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
  birthdate: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: function(email) {
      return /^[a-z0-9.!#$%&’*+\/=?^_`{|}~-]+\@[a-z0-9-]+(\.[a-z0-9-])*\.[a-z0-9-]{2,10}$/.test(email)
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'player',
    enum: ['admin', 'player', 'coach']
  },
  _balance: {
    type: String,
    required: true,
    default: '0.00',
    validate: function(_balance) {
      return /^(-|)(([0-9])|([1-9][0-9]{1,4})).([0][0-9]|[1-9][0-9])$/.test(_balance)
    }
  },
  _status: {
    type: String,
    required: true,
    default: 'awaitapproval',
    enum: ['active', 'terminated', 'awaitapproval']
  },

}, { timestamps: true });


var User = mongoose.model('col_user', userSchema);

module.exports = User
