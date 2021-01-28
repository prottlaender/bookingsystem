// database/controllers/invoiceC.js

// load the relevant Prototype Objects (exported from the models)
const User = require('../models/userM');
const Booking = require('../models/bookingM');
const Invoice = require('../models/invoiceM');
const Payment = require('../models/paymentM');

// export the User Controller Modules
module.exports = {

  createInvoiceUser: async function(req, res, next) {

    // Input User Email using the request body. The data come from the post request
    // initiated by the create invoice modal.
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    // Invoice date is defined as the current date
    // Attention. bookinvoiceDate manipulated for testing !!!!!!!!!!
    const currentDate = new Date('2021-03-01');
    // Format current date
    const dd = (currentDate.getDate() < 10 ? '0' : '') +currentDate.getDate();
    const mm = ((currentDate.getMonth()+1) < 10 ? '0' : '') +(currentDate.getMonth()+1)
    const yyyy = currentDate.getFullYear()
    const invoiceDateFormat = yyyy+'-' +mm+'-' +dd

    // First try. Find the User using User.findOne
    try {

      // Try to find the user with the email. findOne() returns one document that
      // satisfies the specified query criteria.

      await User.findOne({ email: email }, async function(error, user) {

        // If no document has been found end the request with status 400 and
        // send a message back to the client

        if (!user) {
          var message = 'No User found. Create Invoice not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          // In case one document has been found run the following code.

          // Create uppercase letters from name and lastname for invoice number
          const name = user.name
          const nameFirstCharUp = name.charAt(0).toUpperCase()
          const lastname = user.lastname
          const lastnameFirst4CharUp = lastname.slice(0,4).toUpperCase()

          // Create random invoice number between 100 and 999
          const max = 999;
          const min = 100;
          const randomNum = Math.floor(Math.random()*(max-min+1)+min);

          // Create invoice number
          const invoiceNum = invoiceDateFormat +'-' +nameFirstCharUp +'-' +lastnameFirst4CharUp +'-' +randomNum +'-' +'INV'

          // Second try. Find all relevant User-Bookings using Booking.find

          try {

            // Try to find all bookings of the user in the past with status booked or participated

            await Booking.find( { _bookuseremail: email, _booktrainingdate: {$lt: currentDate}, $or:[ {_bookparticipation: 'booked'}, {_bookparticipation: 'participated'} ] }, async function(error, booking) {

              // The return value of the find() function is an array (booking).
              // If the booking array has a length of 0, not a single booking has been found

              if (booking.length == 0) {
                var message = 'No Bookings for invoicing found for this user in this period. No invoice created';
                res.status(400).redirect('/400badRequest?message='+message);

              } else {

                // The array booking has a length of greater 0. Bookings can be billed.

                // create a Booking Collector Array to collect all bookings
                // that can be billed
                var invoicebookingsArr = [];
                // The const invoicesum is set to a string with value 0.00
                const invoicesum = '0.00'
                // The parseFloat() function parses the string invoicesum (0.00) and returns
                // a floating point number (in this case the number 0) which is assigned
                // to the variable invoicesumFloat. This is required to enable arithmetic operations
                // such as additions and subscriptions
                var invoicesumFloat = parseFloat(invoicesum)

                // loop through the booking array
                for (var i = 0; i < booking.length; i++) {
                  // Each booking status must be set to invoice
                  booking[i]._bookparticipation = 'invoice'
                  // Each booking get the invoice number reference
                  booking[i]._bookinvoicenumber = invoiceNum
                  // Save the invoice status of each booking to the database
                  await booking[i].save(function(err, up_booking) {
                    if(err) {
                      // if validation err occur end request and send response
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      console.log('Booking participation status updated with invoice for booking-id: ' +up_booking._id);
                    }
                  })

                  // Create a booking Object for each booking
                  // containing relevant booking data for the invoice
                  var invoicebookingsObj = {
                    id: booking[i]._id,
                    location: booking[i]._booktraininglocation,
                    date: booking[i]._booktrainingdate,
                    type: booking[i]._booktrainingtype,
                    price: booking[i]._booktrainingprice,
                  }
                  // Push the booking Object to the Booking Collector Array
                  invoicebookingsArr.push(invoicebookingsObj)
                  // To calculate the total of the bill, the training price of each booking, which
                  // is a string, must be converted into a float number and assigned to the variable
                  // priceFloat.
                  var priceFloat = parseFloat(booking[i]._booktrainingprice)
                  // Add up the price of each booking (priceFloat) and calculate
                  // the total of the bill (invoicesumFloat)
                  invoicesumFloat = invoicesumFloat + priceFloat

                }
                // Convert the number of invoicesumFloat into a string an rounding the number
                // to keep only two decimals. This is because we store strings in teh database
                const invoicesumFixed = invoicesumFloat.toFixed(2);

                // Here in this following section we create the new invoice object
                // and store it into the database.
                const newInvoice = new Invoice ({
                  invoicenumber: invoiceNum,
                  invoicedate: invoiceDateFormat,
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
            // End Booking.find function
            })
          // End second try (Booking.find)
          } catch (error) {
            next(error)

          }

        }
      // End User.findOne function
      })
    // End first try (User.findOne)
    } catch (error) {
      next(error)
    }

  // End Module
  },

  callCancelInvoice: async function(req, res, next) {

    // Input Invoice number using the request body. The data come from the post request
    // initiated by the call cancel invoice modal.
    const invoiceNumToCancel = req.body.invoicenum

    // First try. Find the invoice that need to be canceled using Invoice.findOne
    try {

      // Try to find the invoice with the invoice number (invoiceNumToCancel) and with
      // status open and where there have been no payments so far. findOne() returns
      // one document that satisfies the specified query criteria.

      await Invoice.findOne({ invoicenumber: invoiceNumToCancel, invoicestatus: 'open', invoicepaid: '0.00' }, function(error, invoice) {

        // If no document has been found end the request with status 400 and
        // send a message back to the client

        if(!invoice) {
          var message = 'User invoice not found or invoice status not open or invoice has been paid or partly paid. Cancel Invoice is not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          // In case one document has been found end the request with status 200
          // and render the cancelInvoice Template with the following data

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

    // End First try.
    } catch (error) {
      next(error)

    }
  // End Module
  },

  cancelInvoice: async function(req, res, next) {

    // Input Invoice number using the request body. The data come from the post request
    // initiated by the cancel invoice modal.
    const invoiceNumToCancel = req.body.invoicenum

    // First try. Find the invoice that need to be canceled using Invoice.findOne

    try {

      // Try to find the invoice with the invoice number (invoiceNumToCancel). findOne() returns
      // one document that satisfies the specified query criteria.

      await Invoice.findOne({ invoicenumber: invoiceNumToCancel }, async function(error, invoice) {

        // If no document has been found end the request with status 400 and
        // send a message back to the client

        if(!invoice) {
          var message = 'Invoice not found. Cancel Invoice not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          // In case one document has been found run the following code.

          // Second try. Find all relevant User-Bookings using Booking.find

          try {

            // Try to find all bookings with the invoice number reference

            await Booking.find({ _bookinvoicenumber: invoiceNumToCancel }, async function(error, bookings) {

              // The return value of the find() function is an array (booking).
              // If the booking array has a length of 0, not a single booking has been found

              if(bookings.lenght == 0) {
                var message = 'No Booking found for User from Invoice to cancel. Cancel Invoice not possible';
                res.status(400).redirect('/400badRequest?message='+message);

              } else {

                // The array booking has a length of greater 0. Bookings can be canceled.

                // loop through the booking array
                for (var i = 0; i < bookings.length; i++) {
                  // Each booking status must be set to booked
                  bookings[i]._bookparticipation = 'booked'
                  // Save the booking status of each booking to the database
                  await bookings[i].save(function(err, up_bookings) {
                    if (err) {
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      console.log('Booking Participation has been updated with "booked" for id: ' +up_bookings._id +' Booking Location: ' +up_bookings._booktraininglocation);
                    }
                  })

                }
              }
            })
          // End Second try.
          } catch (error) {
            next(error)

          }
          // After the above code, the invoice status must be set to canceled
          invoice.invoicestatus = 'canceled'
          // Save the invoice status to the database
          await invoice.save(function(err, up_invoice) {
            if (err) {
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);
            } else {
              var message = 'Invoice canceled successfully';
              res.status(200).redirect('/200success?message='+message);
            }
          })

        }
      })
    // End First try.
    } catch (error) {
      next(error)

    }
    // End module
    },

  callPayInvoice: async function(req, res, next) {

    // Input Invoice number using the request body. The data come from the post request
    // initiated by the call pay invoice modal.
    const invoiceNumToPay = req.body.invoicenum

    // First try. Find the invoice that should be payed using Invoice.findOne

    try {

      // Try to find the invoice with the invoice number (invoiceNumToPay) and where invoice status is open.
      // findOne() returns one document that satisfies the specified query criteria.

      await Invoice.findOne({ invoicenumber: invoiceNumToPay, invoicestatus: 'open'}, function(error, invoice) {

        // If no document has been found end the request with status 400 and
        // send a message back to the client

        if(!invoice) {
          var message = 'Invoice not found or invoice already paid. Invoice payment not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          // In case one document has been found end the request with status 200
          // and render the payInvoice Template with the following data

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

    // End First try.
    } catch (error) {
        next(error)
    }
  // End Module
  },

  payInvoice: async function(req, res, next) {

    // Input via request body Invoice number, user email from the invoice and the amount
    // that was paid with the actual payment (invoicePayment)
    // The data come from the post request initiated by the call pay invoice modal.
    const invoiceNumber = req.body.invoicenum
    const invoiceUserEmail = req.body.email
    // In order to be able to work arithmetically with the amount that was paid (invoicePayment),
    // the invoicePayment value, which is a string, must be converted into a float number
    // and assigned to the variable invoicePaymentFloat.
    const invoicePayment = req.body.invoicepayment
    const invoicePaymentFloat = parseFloat(invoicePayment)

    // Payment date is defined as the current date
    // Attention. bookinvoiceDate manipulated for testing !!!!!!!!!!
    const paymentDate = new Date('2021-02-25');
    // Format current date
    const dd = (paymentDate.getDate() < 10 ? '0' : '') +paymentDate.getDate();
    const mm = ((paymentDate.getMonth()+1) < 10 ? '0' : '') +(paymentDate.getMonth()+1)
    const yyyy = paymentDate.getFullYear()
    const paymentDateFormat = yyyy+'-' +mm+'-' +dd

    // Create random payment number between 100 and 999
    const max = 999;
    const min = 100;
    const randomNum = Math.floor(Math.random()*(max-min+1)+min);

    // Create invoice number
    const paymentNum = paymentDateFormat +'-' +'ING' +'-' +randomNum +'-' +'PAY'


    // First try. Find the invoice that should be payed using Invoice.findOne

    try {

      // Try to find the invoice with the invoice number (invoiceNumber).
      // findOne() returns one document that satisfies the specified query criteria.

      await Invoice.findOne( { invoicenumber: invoiceNumber }, async function(error, invoice) {

        // If no document has been found end the request with status 400 and
        // send a message back to the client

        if(!invoice) {
          var message = 'Invoice not found. Invoice payment not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          // In case one document has been found run the following code.

          // An invoice has 3 amounts:
          // (1) the invoice amount (invoiceamount). invoiceamount is a static value,
          // is initially calculated when the invoice is issued and cannot be changed afterwards.
          // (2) the invoice balance (invoicebalance). invoicebalance indicates the
          // remaining amount that is currently still open.
          // (3) the amount paid (invoicepaid). invoicepaid gives the amount that has been paid so far.

          // Calculate new invoicebalance
          var invoicebalance = invoice.invoicebalance
          var invoicebalanceFloat = parseFloat(invoicebalance)
          var newInvoicebalanceFloat = invoicebalanceFloat - invoicePaymentFloat
          // Convert the number of newInvoicebalanceFloat into a string and rounding the number
          // to keep only two decimals. This is because we store strings in the database
          var newInvoicebalanceFixed = newInvoicebalanceFloat.toFixed(2)
          // Assign newInvoicebalanceFixed to then save the new value in the database
          invoice.invoicebalance = newInvoicebalanceFixed

          // Calculate new invoicepaid
          var invoicepaid = invoice.invoicepaid
          var invoicepaidFloat = parseFloat(invoicepaid)
          var newInvoicepaidFloat = invoicepaidFloat + invoicePaymentFloat
          // Convert the number of newInvoicepaidFloat into a string and rounding the number
          // to keep only two decimals. This is because we store strings in the database
          var newInvoicepaidFixed = newInvoicepaidFloat.toFixed(2)
          // Assign newInvoicepaidFixed to then save the new value in the database
          invoice.invoicepaid = newInvoicepaidFixed

          // In case newInvoicebalanceFloat is greater 0 then there is a remaining amount that
          // is currently still open.

          if (newInvoicebalanceFloat > 0) {

            // Second try (1). Find the user that payed using Invoice.findOne

            try {

              // Try to find the user with the email (invoiceUserEmail).
              // findOne() returns one document that satisfies the specified query criteria.

              await User.findOne({ email: invoiceUserEmail }, async function(error, user) {

                // If no document has been found end the request with status 400 and
                // send a message back to the client

                if(!user) {
                  var message = 'No User found. Invoice payment not possible';
                  res.status(400).redirect('/400badRequest?message='+message);

                } else {

                  // In case one document has been found run the following code.

                  // Whenever a user books a training course, the amount to be paid
                  // for the training course is added to his user balance. So the
                  // user balance is the total amount that the user owes the ice hockey club.
                  // A payment leads to a new user balance reduced by the amount paid.

                  // Calculate new user balance
                  var userbalance = user._balance
                  var userbalanceFloat = parseFloat(userbalance)
                  var newuserbalanceFloat = userbalanceFloat - invoicePaymentFloat
                  // Convert the number of newuserbalanceFloat into a string and rounding the number
                  // to keep only two decimals. This is because we store strings in the database
                  var newuserbalanceFixed = newuserbalanceFloat.toFixed(2)
                  // Assign newuserbalanceFixed to then save the new value in the database
                  user._balance = newuserbalanceFixed

                  // Save the new user balance to the database (user collection)

                  await user.save(async function(err, up_user) {
                    if (err) {
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {

                      // Save the new amount that has been paid so far (newInvoicepaidFixed) and
                      // the amount that is currently still open for this bill (newInvoicebalanceFixed)
                      // to the database (invoice collection).
                      // Important: Dont update the invoice status which is still open as the bill
                      // has not been paid in full.

                      await invoice.save(async function(err, up_invoice) {
                        if (err) {
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {

                          // After everything went fine above (user and invoice has been successfully updated)
                          // we create the new Payment object and store it into the database (payments collection).

                          const newPayment = new Payment ({
                            paymentnumber: paymentNum,
                            paymentdate: paymentDateFormat,
                            paymenttype: 'ingoing',
                            paymentinvoicenumber: invoiceNumber,
                            paymentinvoicename: user.name,
                            paymentinvoicelastname: user.lastname,
                            paymentinvoiceemail: user.email,
                            paymentinvoicepaid: invoicePayment,
                          })

                          await newPayment.save(function(err, payment) {
                            if(err) {
                              // if validation err occur end request and send response
                              var message = err.message;
                              res.status(400).redirect('/400badRequest?message='+message);

                            } else {
                              var message = 'Invoice paid partly';
                              res.status(200).redirect('/200success?message='+message);
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            // End Second try (1).
            } catch (error) {
              next(error)

            }

          } else {

            // The newInvoicebalanceFloat is not greater 0. There is no remaining amount that
            // is currently still open.

            // The following documentation has been shortened because essentially the
            // same processes take place as above during the if-part.

            // Second Try (2).
            try {

              await User.findOne({ email: invoiceUserEmail }, async function(error, user) {

                if(!user) {
                  var message = 'No User found. Invoice payment not possible';
                  res.status(400).redirect('/400badRequest?message='+message);

                } else {

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

                      // Assign paid to the invoicestatus to then save the new value in the database
                      invoice.invoicestatus = 'paid'

                      // Save the new amount that has been paid so far (newInvoicepaidFixed) and
                      // the amount that is currently still open (newInvoicebalanceFixed)
                      // to the database (invoice collection).
                      // Important: Here the invoice status will be updated to paid as the bill
                      // has been paid in full.

                      await invoice.save(async function(err, up_invoice) {
                        if (err) {
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {

                          // Create Payment
                          const newPayment = new Payment ({
                            paymentnumber: paymentNum,
                            paymentdate: paymentDateFormat,
                            paymenttype: 'ingoing',
                            paymentinvoicenumber: invoiceNumber,
                            paymentinvoicename: user.name,
                            paymentinvoicelastname: user.lastname,
                            paymentinvoiceemail: user.email,
                            paymentinvoicepaid: invoicePayment,
                          })

                          await newPayment.save(function(err, payment) {
                            if(err) {
                              // if validation err occur end request and send response
                              var message = err.message;
                              res.status(400).redirect('/400badRequest?message='+message);

                            } else {
                              var message = 'Invoice paid';
                              res.status(200).redirect('/200success?message='+message);
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            // End Second try (2).
            } catch (error) {
              next(error)

            }
          }
        }
      })
    // End First try.
    } catch (error) {
      next(error)

    }
  // End module
  },

  callRePayInvoice: async function(req, res, next) {

    // Input Invoice number using the request body. The data come from the post request
    // initiated by the call pay invoice modal.
    const invoiceNumToRePay = req.body.invoicenum

    // First try. Find the invoice that should be re-payed using Invoice.findOne

    try {

      // Try to find the invoice with the invoice number (invoiceNumToRePay).
      // findOne() returns one document that satisfies the specified query criteria.

      await Invoice.findOne({ invoicenumber: invoiceNumToRePay, invoicestatus: 'paid'}, function(error, invoice) {

        if(!invoice) {
          var message = 'Invoice not found. Invoice Re-payment not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          // In case one document has been found run the following code.

          // Calculate new user balance
          var invoicebalance = invoice.invoicebalance
          var invoicebalanceFloat = parseFloat(invoicebalance)

          if (invoicebalanceFloat >= 0) {

            var message = 'Invoice Balance is greater or equal to 0. Invoice Re-payment not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {

            // In case one document has been found, and the balance is less than 0
            // end the request with status 200 and render the rePayInvoice Template
            // with the following data

            res.status(200).render('admin_calls/rePayInvoice', {
              title: 'Create User Re-Payment Page',
              name: req.session.data.name,
              lastname: req.session.data.lastname,
              data_invoice_invoicenum: invoice.invoicenumber,
              data_invoice_name: invoice.invoicename,
              data_invoice_lastname: invoice.invoicelastname,
              data_invoice_email: invoice.invoiceemail,
              data_invoice_invoicesum: invoice.invoicesum,
              data_invoice_invoicepaid: invoice.invoicepaid,
              data_invoice_balance: invoice.invoicebalance,
              data_invoice_repayment: '0.00',
              });
          }
        }
      })

    // End First try
    } catch (error) {
      next(error)
    }
  // End module
  },

  rePayInvoice: async function(req, res, next) {

    // Input via request body Invoice number, user email from the invoice and the amount
    // that was re-paid with the actual re-payment (invoiceRePayment).
    // The data come from the post request initiated by the call re-pay invoice modal.
    const invoiceNumber = req.body.invoicenum
    const invoiceUserEmail = req.body.email
    const invoiceRePayment = req.body.invoicerepayment
    // In order to be able to work arithmetically with the amount that was re-paid (invoiceRePayment),
    // the invoiceRePayment value, which is a string, must be converted into a float number
    // and assigned to the variable invoiceRePaymentFloat.
    const invoiceRePaymentFloat = parseFloat(invoiceRePayment)

    // Payment date is defined as the current date

    const rePaymentDate = new Date();
    // Format current date
    const dd = (rePaymentDate.getDate() < 10 ? '0' : '') +rePaymentDate.getDate();
    const mm = ((rePaymentDate.getMonth()+1) < 10 ? '0' : '') +(rePaymentDate.getMonth()+1)
    const yyyy = rePaymentDate.getFullYear()
    const rePaymentDateFormat = yyyy+'-' +mm+'-' +dd

    // Create random payment number between 100 and 999
    const max = 999;
    const min = 100;
    const randomNum = Math.floor(Math.random()*(max-min+1)+min);

    // Create invoice number
    const rePaymentNum = rePaymentDateFormat +'-' +'OUT' +'-' +randomNum +'-' +'PAY'

    // First try. Find the invoice that should be payed using Invoice.findOne
    try {

      // Try to find the invoice with the invoice number (invoiceNumber).
      // findOne() returns one document that satisfies the specified query criteria.

      await Invoice.findOne( { invoicenumber: invoiceNumber }, async function(error, invoice) {

        if(!invoice) {
          var message = 'Invoice not found. Invoice Re-payment not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          // In case one document has been found run the following code.

          // An invoice has 3 amounts:
          // (1) the invoice amount (invoiceamount). invoiceamount is a static value,
          // is initially calculated when the invoice is issued and cannot be changed afterwards.
          // (2) the invoice balance (invoicebalance). invoicebalance indicates the
          // remaining amount that is currently still open.
          // (3) the amount paid (invoicepaid). invoicepaid gives the amount that has been paid so far.

          // Calculate new invoicebalance
          var invoicebalance = invoice.invoicebalance
          var invoicebalanceFloat = parseFloat(invoicebalance)
          var newInvoicebalanceFloat = invoicebalanceFloat + invoiceRePaymentFloat
          // Convert the number of newInvoicebalanceFloat into a string and rounding the number
          // to keep only two decimals. This is because we store strings in the database
          var newInvoicebalanceFixed = newInvoicebalanceFloat.toFixed(2)
          // Assign newInvoicebalanceFixed to then save the new value in the database
          invoice.invoicebalance = newInvoicebalanceFixed

          // Calculate new invoicepaid
          var invoicepaid = invoice.invoicepaid
          var invoicepaidFloat = parseFloat(invoicepaid)
          var newInvoicepaidFloat = invoicepaidFloat - invoiceRePaymentFloat
          // Convert the number of newInvoicepaidFloat into a string and rounding the number
          // to keep only two decimals. This is because we store strings in the database
          var newInvoicepaidFixed = newInvoicepaidFloat.toFixed(2)
          // Assign newInvoicepaidFixed to then save the new value in the database
          invoice.invoicepaid = newInvoicepaidFixed

          // Second try
          try {

            // Try to find the user with the invoice email (invoiceUserEmail).
            // findOne() returns one document that satisfies the specified query criteria.

            await User.findOne({ email: invoiceUserEmail }, async function(error, user) {

              if(!user) {
                var message = 'User not found. Invoice Re-payment not possible';
                res.status(400).redirect('/400badRequest?message='+message);

              } else {

                // In case one document has been found run the following code.

                // Calculate new user balance
                userBalance = user._balance
                userBalanceFloat = parseFloat(userBalance)
                newUserBalanceFloat = userBalanceFloat + invoiceRePaymentFloat
                var newUserBalanceFixed = newUserBalanceFloat.toFixed(2)
                user._balance = newUserBalanceFixed

                // Save the new user balance to the database (users collection)
                await user.save(async function(err, up_user) {
                  if (err) {
                    var message = err.message;
                    res.status(400).redirect('/400badRequest?message='+message);

                  } else {

                    // check if the new invoice balance is greater 0

                    if (newInvoicebalanceFloat > 0) {

                      // In case the new invoice balance is greater 0 then the invoice
                      // has to be re-opened because the invoice is then not balanced.

                      invoice.invoicestatus = 'open'

                      await invoice.save(async function(err, up_invoice) {
                        if (err) {
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {

                          // Create Payment
                          const newPayment = new Payment ({
                            paymentnumber: rePaymentNum,
                            paymentdate: rePaymentDateFormat,
                            paymenttype: 'outgoing',
                            paymentinvoicenumber: invoiceNumber,
                            paymentinvoicename: user.name,
                            paymentinvoicelastname: user.lastname,
                            paymentinvoiceemail: user.email,
                            paymentinvoicepaid: invoiceRePayment,
                          })

                          await newPayment.save(function(err, payment) {
                            if(err) {
                              // if validation err occur end request and send response
                              var message = err.message;
                              res.status(400).redirect('/400badRequest?message='+message);

                            } else {
                              var message = 'Invoice re-paiment successful. Invoice status re-opened.';
                              res.status(200).redirect('/200success?message='+message);
                            }
                          })
                        }
                      })

                    } else {

                      // In case the new invoice balance is less or equal to 0 then the invoice
                      // is still overpaid or balanced. In this case, the status remains paid.

                      await invoice.save(async function(err, up_invoice) {
                        if (err) {
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {

                          // Create Payment
                          const newPayment = new Payment ({
                            paymentnumber: rePaymentNum,
                            paymentdate: rePaymentDateFormat,
                            paymenttype: 'outgoing',
                            paymentinvoicenumber: invoiceNumber,
                            paymentinvoicename: user.name,
                            paymentinvoicelastname: user.lastname,
                            paymentinvoiceemail: user.email,
                            paymentinvoicepaid: invoiceRePayment,
                          })

                          await newPayment.save(function(err, payment) {
                            if(err) {
                              // if validation err occur end request and send response
                              var message = err.message;
                              res.status(400).redirect('/400badRequest?message='+message);

                            } else {
                              var message = 'Invoice re-paiment successful';
                              res.status(200).redirect('/200success?message='+message);
                            }
                          })
                        }
                      })
                    }
                  }
                })
              }
            })

          // End Second try
          } catch (error) {
            next(error)

          }
        }
      })
    // End First try.
    } catch (error) {
      next(error)

    }
  // End module
  },

// End export Modules
}
