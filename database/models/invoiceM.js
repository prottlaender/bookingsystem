var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var invoiceSchema = new Schema({

  invoicenumber: {
    type: String,
    validate: function(invoicenumber) {
      return /^[A-Z]{1}-[A-Z]{4}-FROM-[0-9]{8}-TO-[0-9]{8}-[0-9]{3}-INV$/.test(invoicenumber)
    }
  },

  invoicedate: {
    type: Date
  },

  invoicename: {
    type: String,
    required: true,
    validate: function(name) {
      return /^[a-zA-ZüÜäÄöÖ]+\s{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(name)
    }
  },

  invoicelastname: {
    type: String,
    required: true,
    validate: function(lastname) {
      return /^[a-zA-ZüÜäÄöÖ]+[-]{0,1}[a-zA-ZüÜäÄöÖ]+$/.test(lastname)
    }
  },

  invoiceemail: {
    type: String,
    required: true,
    validate: function(email) {
      return /^[a-z0-9.!#$%&’*+\/=?^_`{|}~-]+\@[a-z0-9-]+(\.[a-z0-9-])*\.[a-z0-9-]{2,10}$/.test(email)
    }
  },

  invoicesum: {
    type: String,
    validate: function(invoicesum) {
      return /^(([0-9])|([1-9][0-9]{1,4})).([0][0-9]|[1-9][0-9])$/.test(invoicesum)
    }
  },

  invoicepaid: {
    type: String,
    validate: function(invoicepaid) {
      return /^(-|)(([0-9])|([1-9][0-9]{1,4})).([0][0-9]|[1-9][0-9])$/.test(invoicepaid)
    }
   },

  invoicebalance: {
    type: String,
    validate: function(invoicebalance) {
      return /^(-|)(([0-9])|([1-9][0-9]{1,4})).([0][0-9]|[1-9][0-9])$/.test(invoicebalance)
    }
  },

  invoicestatus: {
    type: String,
    enum: ['open', 'paid', 'canceled']
  },

  invoicebookings: [{
    id: {
      type: String
    },
    location: {
      type: String,
      required: true,
      validate: function(location) {
        return /^([a-zA-ZüÜäÄöÖß]+\s{0,1}|[a-zA-ZüÜäÄöÖß]+[-]{0,1}){1,10}$/.test(location)
      }
    },
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Eishockey', 'Inlinehockey']
    },
    price: {
      type: String,
      required: true,
      validate: function(price) {
        return /^([0-9]|[0-9][0-9]).([0][0-9]|[1-9][0-9])$/.test(price)
      }
    },
  }]

}, { timestamps: true });


var Invoice = mongoose.model('col_invoice', invoiceSchema);

module.exports = Invoice
