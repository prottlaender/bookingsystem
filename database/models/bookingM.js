var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bookingSchema = new Schema({

  // User References
  _bookuseremail: {
    type: String,
    required: true,
    validate: function(_bookuseremail) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9-]{2,10}$/.test(_bookuseremail)
    }
  },
  _bookusername: {
    type: String,
    required: true,
    validate: function(_bookusername) {
      return /^[a-zA-ZüÜäÄöÖ]+\s{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(_bookusername)
    }
  },
  _bookuserlastname: {
    type: String,
    required: true,
    validate: function(_bookuserlastname) {
      return /^[a-zA-ZüÜäÄöÖ]+[-]{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(_bookuserlastname)
    }
  },
  _bookusercat: {
    type: String,
    required: true,
    enum: ['youth', 'adult']
  },
  // Training References
  _booktrainingid: {
    type: String,
    required: true
  },
  _booktrainingtype: {
    type: String,
    required: true,
    enum: ['Eishockey', 'Inlinehockey']
  },
  _booktraininglocation: {
    type: String,
    required: true,
    validate: function(_booktraininglocation) {
      return /^([a-zA-ZüÜäÄöÖß]+\s{0,1}|[a-zA-ZüÜäÄöÖß]+[-]{0,1}){1,10}$/.test(_booktraininglocation)
    }
  },
  _booktrainingdate: {
    type: Date,
    required: true
  },
  _booktrainingtimestart: {
    type: String,
    required: true,
    validate: function(_booktrainingtimestart) {
      return /^([0][1-9]|[1][0-9]|[2][0-3]):([0][0-9]|[1-5][0-9])$/.test(_booktrainingtimestart)
    }
  },
  _booktrainingtimeend: {
    type: String,
    required: true,
    validate: function(_booktrainingtimeend) {
      return /^([0][1-9]|[1][0-9]|[2][0-3]):([0][0-9]|[1-5][0-9])$/.test(_booktrainingtimeend)
    }
  },
  _booktrainingprice: {
    type: String,
    required: true,
    validate: function(_booktrainingprice) {
      return /^([0-9]|[0-9][0-9]).([0][0-9]|[1-9][0-9])$/.test(_booktrainingprice)
    }
  },
  // Status
  _bookparticipation: {
    type: String,
    required: true,
    default: 'booked',
    enum: ['booked', 'canceled', 'rejected', 'participated', 'invoice']
  },

  _bookinvoicenumber: {
    type: String,
    validate: function(invoicenumber) {
      return /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z]{1}-[A-Z]{4}-[0-9]{3}-INV$/.test(invoicenumber)
    }
  },

}, { timestamps: true });

var Booking = mongoose.model('col_booking', bookingSchema);

module.exports = Booking
