// database/controllers/invoiceC.js

// load the relevant Prototype Objects (exported from the models)
const User = require('../models/userM');
const Booking = require('../models/bookingM');
const Invoice = require('../models/invoiceM');


// export the User Controller Modules
module.exports = {

  createInvoiceUser: async function(req, res, next) {

    // Input Email
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    // Input date from
    const datefrom = req.body.datefrom
    const datefromDate = new Date(datefrom);
    const dd_from = (datefromDate.getDate() < 10 ? '0' : '') +datefromDate.getDate();
    const mm_from = ((datefromDate.getMonth()+1) < 10 ? '0' : '') +(datefromDate.getMonth()+1)
    const yyyy_from = datefromDate.getFullYear()
    const dateFromDateFormat = 'FROM' +'-' +yyyy_from+mm_from+dd_from

    // Input date to
    const dateto = req.body.dateto
    const datetoDate = new Date(dateto);
    const dd_to = (datetoDate.getDate() < 10 ? '0' : '') +datetoDate.getDate();
    const mm_to = ((datetoDate.getMonth()+1) < 10 ? '0' : '') +(datetoDate.getMonth()+1)
    const yyyy_to = datetoDate.getFullYear()
    const dateToDateFormat = 'TO' +'-' +yyyy_to+mm_to+dd_to

    // Invoice current date
    // ACHTUNG !!!!!!!!!!
    const bookinvoiceDate = new Date('2021-02-01');
    console.log('Current Date - bookinvoiceDate: ' +bookinvoiceDate);

    // Invoice period must end in the past
    if (datetoDate <= bookinvoiceDate) {
      // Invoice period must be correct when dateto is greater than datefrom
      if (datetoDate >= datefromDate) {

        // First try (User.findOne)
        try {
          // Try to find a user with email
          await User.findOne({ email: email }, async function(error, user) {
            if (!user) {
              var message = 'No User found. Create Invoice not possible';
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              // Create uppercase letters for invoice number
              const name = user.name
              const nameFirstCharUp = name.charAt(0).toUpperCase()
              const lastname = user.lastname
              const lastnameFirst3CharUp = lastname.slice(0,4).toUpperCase()

              // Create random invoice number between 100 and 999
              const max = 999;
              const min = 100;
              const randomNum = Math.floor(Math.random()*(max-min+1)+min);

              // Create invoice number
              const invoiceNum = nameFirstCharUp +'-' +lastnameFirst3CharUp +'-' +dateFromDateFormat +'-' +dateToDateFormat +'-' +randomNum +'-' +'INV'

              // Second try (Booking.find)
              try {
                // Try to find all bookings of the user in the period
                await Booking.find( { _bookuseremail: email, _booktrainingdate: {$gte: datefromDate, $lte: datetoDate}, $or:[ {_bookparticipation: 'booked'}, {_bookparticipation: 'participated'} ] }, async function(error, booking) {

                  if (booking.length == 0) {
                    var message = 'No Bookings for invoicing found for this user in this period. No invoice created';
                    res.status(400).redirect('/400badRequest?message='+message);

                  } else {

                    var invoicebookingsArr = [];
                    const invoicesum = '0.00'
                    var invoicesumFloat = parseFloat(invoicesum)

                    for (var i = 0; i < booking.length; i++) {

                      booking[i]._bookparticipation = 'invoice'

                      await booking[i].save(function(err, up_booking) {
                        if(err) {
                          // if validation err occur end request and send response
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {
                          console.log('Booking participation status updated with invoice for booking-id: ' +up_booking._id);
                        }
                      })

                      var invoicebookingsObj = {
                        id: booking[i]._id,
                        location: booking[i]._booktraininglocation,
                        date: booking[i]._booktrainingdate,
                        type: booking[i]._booktrainingtype,
                        price: booking[i]._booktrainingprice,
                      }

                      invoicebookingsArr.push(invoicebookingsObj)
                      var priceFloat = parseFloat(booking[i]._booktrainingprice)
                      invoicesumFloat = invoicesumFloat + priceFloat

                    }

                    const invoicesumFixed = invoicesumFloat.toFixed(2);

                    const newInvoice = new Invoice ({
                      invoicenumber: invoiceNum,
                      invoicedate: bookinvoiceDate,
                      invoicename: name,
                      invoicelastname: lastname,
                      invoiceemail: email,
                      invoicesum: invoicesumFixed,
                      invoicepaid: '0.00',
                      invoicebalance: invoicesumFixed,
                      invoicestatus: 'open',
                      invoicebookings: invoicebookingsArr
                    })

                    await newInvoice.save(function(err, up_invoice) {
                      if(err) {
                        // if validation err occur end request and send response
                        var message = err.message;
                        res.status(400).redirect('/400badRequest?message='+message);

                      } else {
                        var message = 'Invoice created successfully';
                        res.status(200).redirect('/200success?message='+message);
                      }
                    })
                  }
                })
              // End second try (Booking.find)
              } catch (error) {
                next(error)

              }
            }
          })
        // End first try (User.findOne)
        } catch (error) {
          next(error)
        }

        } else {
          var message = 'Invoice Period End before Period Start (Date-to smaller than Date-From). Invoicing not possible for this period';
          res.status(400).redirect('/400badRequest?message='+message);
        }

      } else {
        var message = 'Invoice Period end in the future. Invoice Period must end in the past. Invoicing not possible';
        res.status(400).redirect('/400badRequest?message='+message);
      }
  // End Module
  },

  callCancelInvoice: async function(req, res, next) {
    const invoiceNumToCancel = req.body.invoicenum

    try {

      await Invoice.findOne({ invoicenumber: invoiceNumToCancel, invoicestatus: 'open', invoicepaid: '0.00' }, function(error, invoice) {
        if(!invoice) {
          var message = 'User invoice not found or invoice status not open or invoice has been paid or partly paid. Cancel Invoice is not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          res.status(200).render('admin_calls/cancelInvoice', {
            title: 'Cancel User Invoice Page',
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            data_invoice_email: invoice.invoiceemail,
            data_invoice_invoicenum: invoice.invoicenumber,
            data_invoice_name: invoice.invoicename,
            data_invoice_lastname: invoice.invoicelastname,
            data_invoice_invoicesum: invoice.invoicesum,
            });
        }
      })

    } catch (error) {
      next(error)

    }
  // End Module
  },

  cancelInvoice: async function(req, res, next) {
      const invoiceNumToCancel = req.body.invoicenum
      const invoiceToCancelUserEmail = req.body.email

    try {
      // Find the user with the invoice to be canceled in the _invoices Array on the user object
      await Invoice.findOne({ invoicenumber: invoiceNumToCancel }, async function(error, invoice) {

        if(!invoice) {
          var message = 'Invoice not found. Cancel Invoice not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          try {

            await Booking.find({_bookuseremail: invoiceToCancelUserEmail, _bookparticipation: 'invoice'}, async function(error, bookings) {

              if(bookings.lenght == 0) {
                var message = 'No Booking found for User from Invoice to cancel. Cancel Invoice not possible';
                res.status(400).redirect('/400badRequest?message='+message);

              } else {

                for (var i = 0; i < bookings.length; i++) {
                  bookings[i]._bookparticipation = 'booked'

                  await bookings[i].save(function(err, up_bookings) {
                    if (err) {
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      console.log('Booking Participation has been updated with "booked" for id: ' +up_bookings._id +' Booking Location: ' +up_bookings._booktraininglocation);
                    }
                  })

                }

                try {

                  Invoice.deleteOne( { invoicenumber: invoiceNumToCancel }, function(err, result) {
                    if (result.n == 0) {
                      // if result show no item to delete {n: 0, nModified: 0, ok: 0} end request and send response
                      var message = 'No Invoice with this Invoice Number. Remove Invoice not possible';
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update author email successful end request and send response
                      var message = 'Invoice removed successfully';
                      res.status(200).redirect('/200success?message='+message);
                    }
                  })

                } catch (error) {
                  next(error)

                }
              }
            })

          } catch (error) {
            next(error)

          }
        }
      })

    } catch (error) {
      next(error)

    }
    // End module
    },

  callPayInvoice: async function(req, res, next) {
    const invoiceNumToPay = req.body.invoicenum

    try {

      await Invoice.findOne({ invoicenumber: invoiceNumToPay, invoicestatus: 'open'}, function(error, invoice) {

        if(!invoice) {
          var message = 'Invoice not found or invoice already paid. Invoice payment not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          res.status(200).render('admin_calls/payInvoice', {
            title: 'Create User Payment Page',
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            data_invoice_invoicenum: invoice.invoicenumber,
            data_invoice_name: invoice.invoicename,
            data_invoice_lastname: invoice.invoicelastname,
            data_invoice_email: invoice.invoiceemail,
            data_invoice_invoicesum: invoice.invoicesum,
            data_invoice_invoicepaid: invoice.invoicepaid,
            data_invoice_balance: invoice.invoicebalance,
            data_invoice_payment: '0.00',
            });
        }
      })

    } catch (error) {
        next(error)
    }
  // End Module
  },

  payInvoice: async function(req, res, next) {

    const invoiceNumber = req.body.invoicenum
    const invoiceUserEmail = req.body.email
    const invoicePayment = req.body.invoicepayment
    const invoicePaymentFloat = parseFloat(invoicePayment)

    try {

      await Invoice.findOne( { invoicenumber: invoiceNumber }, async function(error, invoice) {

        if(!invoice) {
          var message = 'Invoice not found. Invoice payment not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          // Calculate new invoice paid amount
          var invoicepaid = invoice.invoicepaid
          var invoicepaidFloat = parseFloat(invoicepaid)
          var newInvoicepaidFloat = invoicepaidFloat + invoicePaymentFloat
          var newInvoicepaidFixed = newInvoicepaidFloat.toFixed(2)
          invoice.invoicepaid = newInvoicepaidFixed

          // Calculate new invoive balance
          var invoicebalance = invoice.invoicebalance
          var invoicebalanceFloat = parseFloat(invoicebalance)
          var newInvoicebalanceFloat = invoicebalanceFloat - invoicePaymentFloat
          var newInvoicebalanceFixed = newInvoicebalanceFloat.toFixed(2)
          invoice.invoicebalance = newInvoicebalanceFixed

          if (newInvoicebalanceFloat > 0) {

            try {

              await User.findOne({ email: invoiceUserEmail }, async function(error, user) {

                // Calculate new user balance
                var userbalance = user._balance
                var userbalanceFloat = parseFloat(userbalance)
                var newuserbalanceFloat = userbalanceFloat - invoicePaymentFloat
                var newuserbalanceFixed = newuserbalanceFloat.toFixed(2)
                user._balance = newuserbalanceFixed

                await user.save(async function(err, up_user) {
                  if (err) {
                    var message = err.message;
                    res.status(400).redirect('/400badRequest?message='+message);

                  } else {

                    await invoice.save(function(err, up_invoice) {
                      if (err) {
                        var message = err.message;
                        res.status(400).redirect('/400badRequest?message='+message);

                      } else {
                        var message = 'Invoice paid partly';
                        res.status(200).redirect('/200success?message='+message);

                      }
                    })
                  }
                })
              })

            } catch (error) {
              next(error)

            }

          } else {

            try {

              await User.findOne({ email: invoiceUserEmail }, async function(error, user) {

                // Calculate new user balance
                var userbalance = user._balance
                var userbalanceFloat = parseFloat(userbalance)
                var newuserbalanceFloat = userbalanceFloat - invoicePaymentFloat
                var newuserbalanceFixed = newuserbalanceFloat.toFixed(2)
                user._balance = newuserbalanceFixed

                await user.save(async function(err, up_user) {
                  if (err) {
                    var message = err.message;
                    res.status(400).redirect('/400badRequest?message='+message);

                  } else {

                    invoice.invoicestatus = 'paid'

                    await invoice.save(function(err, up_invoice) {
                      if (err) {
                        var message = err.message;
                        res.status(400).redirect('/400badRequest?message='+message);

                      } else {
                        var message = 'Invoice paid';
                        res.status(200).redirect('/200success?message='+message);

                      }
                    })
                  }
                })
              })

            } catch (error) {
              next(error)

            }
          }
        }
      })

    } catch (error) {
      next(error)
    }
  // End module
  },

// End export Modules
}
