var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var paymentSchema = new Schema({

  paymentnumber: {
    type: String,
    validate: function(paymentnumber) {
      return /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z]{3}-[0-9]{3}-PAY$/.test(paymentnumber)
    }
  },

  paymentdate: {
    type: Date
  },

  paymenttype: {
    type: String,
    enum: ['ingoing', 'outgoing']
  },

  paymentinvoicenumber: {
    type: String,
    validate: function(paymentinvoicenumber) {
      return /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[A-Z]{1}-[A-Z]{4}-[0-9]{3}-INV$/.test(paymentinvoicenumber)
    }
  },

  paymentinvoicename: {
    type: String,
    required: true,
    validate: function(paymentinvoicename) {
      return /^[a-zA-ZüÜäÄöÖ]+\s{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(paymentinvoicename)
    }
  },

  paymentinvoicelastname: {
    type: String,
    required: true,
    validate: function(paymentinvoicelastname) {
      return /^[a-zA-ZüÜäÄöÖ]+[-]{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(paymentinvoicelastname)
    }
  },

  paymentinvoiceemail: {
    type: String,
    required: true,
    validate: function(paymentinvoiceemail) {
      return /^[a-z0-9.!#$%&’*+\/=?^_`{|}~-]+\@[a-z0-9-]+(\.[a-z0-9-])*\.[a-z0-9-]{2,10}$/.test(paymentinvoiceemail)
    }
  },

  paymentinvoicepaid: {
    type: String,
    validate: function(paymentinvoicepaid) {
      return /^(-|)(([0-9])|([1-9][0-9]{1,4})).([0][0-9]|[1-9][0-9])$/.test(paymentinvoicepaid)
    }
   },

}, { timestamps: true });


var Payment = mongoose.model('col_payment', paymentSchema);

module.exports = Payment
