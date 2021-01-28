// database/controllers/bookingC.js

// load the relevant Prototype Objects (exported from the models)
const Training = require('../models/trainingM');
const Booking = require('../models/bookingM');
const User = require('../models/userM');

// export the Training Controller Modules

module.exports = {

  callBookTrainings: async function(req, res, next) {
    // assign input data from request body to input variables
    const id = req.body.id

    try {

      Training.findOne( { _id: id }, function(error, training) {
        if (!training) {
          // if no training found end request and send response
          var message = 'Training not found. Book Training not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          const dd = (training.date.getDate() < 10 ? '0' : '') +training.date.getDate();
          const mm = ((training.date.getMonth()+1) < 10 ? '0' : '') +(training.date.getMonth()+1);
          const yyyy = training.date.getFullYear();
          const trainingDate = yyyy +'-' +mm +'-' +dd

          Booking.findOne( { _bookuseremail: req.session.data.email,  _booktrainingid: id }, function(error, booking) {

            if (!booking) {

              if (req.session.data.cat == 'adult') {
                res.status(200).render('player_calls/bookTraining', {
                  title: 'Book Trainings Page',
                  name: req.session.data.name,
                  lastname: req.session.data.lastname,
                  email: req.session.data.email,
                  cat: req.session.data.cat,
                  data_training_id: training._id,
                  data_training_type: training.type,
                  data_training_location: training.location,
                  data_training_price: training.priceadult,
                  data_training_date: trainingDate,
                  data_training_timestart: training.timestart,
                  data_training_timeend: training.timeend,

                  });

              } else {
                res.status(200).render('player_calls/bookTraining', {
                  title: 'Book Trainings Page',
                  name: req.session.data.name,
                  lastname: req.session.data.lastname,
                  email: req.session.data.email,
                  cat: req.session.data.cat,
                  data_training_id: training._id,
                  data_training_type: training.type,
                  data_training_location: training.location,
                  data_training_price: training.priceyouth,
                  data_training_date: trainingDate,
                  data_training_timestart: training.timestart,
                  data_training_timeend: training.timeend,
                  });

              }
            // end no booking condition
            } else if (booking._bookparticipation == 'canceled') {

                if (req.session.data.cat == 'adult') {

                  res.status(200).render('player_calls/reactivateBooking', {
                    title: 'Reactivate Bookings Page',
                    name: req.session.data.name,
                    lastname: req.session.data.lastname,
                    email: req.session.data.email,
                    cat: req.session.data.cat,
                    data_booking_id: booking._id, // extisting biiking id never change
                    data_booking_type: booking._booktrainingtype,
                    data_booking_location: booking._booktraininglocation,
                    data_training_price: training.priceadult,
                    data_training_date: trainingDate,
                    data_training_timestart: training.timestart,
                    data_training_timeend: training.timeend,

                    });

                  } else {

                    res.status(200).render('player_calls/reactivateBooking', {
                      title: 'Reactivate Bookings Page',
                      name: req.session.data.name,
                      lastname: req.session.data.lastname,
                      email: req.session.data.email,
                      cat: req.session.data.cat,
                      data_booking_id: booking._id, // extisting biiking id never change
                      data_booking_type: booking._booktrainingtype,
                      data_booking_location: booking._booktraininglocation,
                      data_training_price: training.priceyouth,
                      data_training_date: trainingDate,
                      data_training_timestart: training.timestart,
                      data_training_timeend: training.timeend,

                    });
                  }
            // end bookparticipation == canceled condition
            } else {
              // if booking found end request and send response
              var message = 'This Training has already been booked, is rejected or is already in the past. Booking not possible';
              res.status(400).redirect('/400badRequest?message='+message);
            }
          })
        }
      })

    } catch (error) {
      next(error)
    }
  },

  bookTraining: async function(req, res, next) {
    // assign input data from request body to input variables
    const name = req.body.name
    const lastname = req.body.lastname
    const email = req.body.email
    const cat = req.body.cat
    const id = req.body.id
    const type = req.body.type
    const location = req.body.location
    const price = req.body.price
    const date = req.body.date
    const timeStart = req.body.timeStart
    const timeEnd = req.body.timeEnd

    try {

      // create a new Training Object with input from the req.body
      const newBooking = new Booking({

        _bookuseremail: email,
        _bookusername: name,
        _bookuserlastname: lastname,
        _bookusercat: cat,
        _booktrainingid: id,
        _booktrainingtype: type,
        _booktraininglocation: location,
        _booktrainingdate: date,
        _booktrainingtimestart: timeStart,
        _booktrainingtimeend: timeEnd,
        _booktrainingprice: price,

      })

      newBooking.save(function(err, booktraining) {
        if(err) {
          // if a validation err occur end request and send response
          //res.status(400).render('error', { title: 'Error Page', code: 400, status: 'Bad Request', message: err.message })
          var message = err.message
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          // Update User Balance
          User.findOne({ email: email }, function(error, user) {
            if (!user) {
              // if no user found end request and send response
              var message = 'User not found to update balance. Book Training not possible';
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              var balanceFloat = parseFloat(user._balance)
              var priceFloat = parseFloat(price)

              var newBalance = balanceFloat+priceFloat

              var newBalanceFixed = newBalance.toFixed(2)


              user._balance = newBalanceFixed;

              user.save(function(err, up_user) {
                if (err) {
                  // if validation err occur end request and send response
                  var message = err.message;
                  res.status(400).redirect('/400badRequest?message='+message)

                } else {
                  var message = 'Training successfully booked';
                  res.status(200).redirect('/200success?message='+message);

                }
              });
            }
          })
        }
      })

    } catch (error) {
      next(error)
    }
  // End createTraining Module
  },

  bookingReactivate: async function(req, res, next) {

    const id = req.body.id // extisting booking id never change
    const name = req.body.name
    const lastname = req.body.lastname
    const email = req.body.email
    const cat = req.body.cat
    const type = req.body.type
    const location = req.body.location
    const price = req.body.price
    const date = req.body.date
    const timeStart = req.body.timeStart
    const timeEnd = req.body.timeEnd

    try {

      Booking.findOne({ _id: id }, function(error, booking) {

        if (!booking) {
          // if no user found end request and send response
          var message = 'Booking not found. Reactivate Booking not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          booking._bookparticipation = 'booked'
          booking._bookuseremail = email
          booking._bookusername = name
          booking._bookuserlastname = lastname
          booking._bookusercat = cat
          booking._booktrainingtype = type
          booking._booktraininglocation = location
          booking._booktrainingdate = date
          booking._booktrainingtimestart = timeStart
          booking._booktrainingtimeend = timeEnd
          booking._booktrainingprice = price

          booking.save(function(err, up_booking) {

            if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

            } else {

              User.findOne({ email: email }, function(error, user) {

                if(!user) {
                  // if no User found end request and send response
                  var message = 'User not found. Booking updated but update User not possible';
                  res.status(400).redirect('/400badRequest?message='+message);

                } else {
                  var currentUserBalanceFloat = parseFloat(user._balance)
                  var priceFloat = parseFloat(price)
                  var newUserBalanceFloat = currentUserBalanceFloat + priceFloat
                  var newUserBalance = newUserBalanceFloat.toFixed(2)

                  user._balance = newUserBalance

                  user.save(function(err, up_user) {
                    if (err) {
                      // if validation err occur end request and send response
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                      var message = 'Reactivate Booking successful. User and Booking updated';
                      res.status(200).redirect('/200success?message='+message);
                    }
                  })
                // End user available 'else' condition
                }
              })
            }

          })
        // End booking available 'else' condition
        }

      })

    } catch (error) {
      next(error)

    }
  },

  callCancelBooking: async function(req, res, next) {
    // assign input data from request body to input variables
    const id = req.body.id
    
    try {

      Booking.findOne( { _id: id }, function(error, bookingtocancel) {
        if (!bookingtocancel) {
          // if no Booking found end request and send response
          var message = 'Booking not found. Booking might be in the past. Cancel Booking not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        // End Booking not found condition
        } else {

          const dd = (bookingtocancel._booktrainingdate.getDate() < 10 ? '0' : '') +bookingtocancel._booktrainingdate.getDate();
          const mm = ((bookingtocancel._booktrainingdate.getMonth()+1) < 10 ? '0' : '') +(bookingtocancel._booktrainingdate.getMonth()+1);
          const yyyy = bookingtocancel._booktrainingdate.getFullYear();
          const booktrainingDate = yyyy +'-' +mm +'-' +dd

          if (bookingtocancel._bookparticipation == 'booked') {

            var oneDay = 24*60*60*1000;
            var currentDate = new Date();
            var currentDateMs = currentDate.getTime();
            var bookingDate = new Date(bookingtocancel._booktrainingdate);
            var bookingDateMs = bookingDate.getTime();

            var daysDiff =  (bookingDateMs - currentDateMs) / oneDay;
            console.log('daysDiff: ' +daysDiff);
            var daysDiffCeil = Math.ceil(daysDiff)

            if (daysDiffCeil <= 4 && daysDiffCeil >= 0) {
              var message = 'Less than 4 days left to training. Cancel Booking not possible';
              res.status(400).redirect('/400badRequest?message='+message);

            } else if (daysDiffCeil < 0) {
              var message = 'You can not cancel bookings in the past. Cancel Booking not possible';
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              res.status(200).render('player_calls/cancelBooking', {
                title: 'Cancel Booking Page',
                authenticated: req.session.data,
                name: req.session.data.name,
                lastname: req.session.data.lastname,
                role: req.session.data.role,
                data_booking_name: bookingtocancel._bookusername,
                data_booking_lastname: bookingtocancel._bookuserlastname,
                data_booking_email: bookingtocancel._bookuseremail,
                data_booking_location: bookingtocancel._booktraininglocation,
                data_booking_id: bookingtocancel._id,
                data_booking_date: booktrainingDate,
                data_booking_timestart: bookingtocancel._booktrainingtimestart,
                data_booking_timeend: bookingtocancel._booktrainingtimeend,
                data_booking_price: bookingtocancel._booktrainingprice,
		            data_booking_type: bookingtocancel._booktrainingtype,
                data_booking_bookparticipation: bookingtocancel._bookparticipation,

                });
            }

          // End bookparticipation == booked condition
          } else {
          var message = 'Participation-Status is: ' +bookingtocancel._bookparticipation +'. Cancel Booking is not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        }

        // End Booking found condition
        }
      })

    } catch (error) {
      next(error)

    }

  },

  cancelBooking: async function(req, res, next) {
    // assign input data from request body to input variables
    const id = req.body.id
    const email = req.body.email
    const price = req.body.price

    try {
      Booking.findOne( { _id: id }, function(error, booking) {
        if (!booking) {
          // if no User found end request and send response
          var message = 'Booking not found. Cancel Booking not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          booking._bookparticipation = 'canceled'

          booking.save(function(err, up_booking) {
            if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              User.findOne( { email: email }, function(error, user) {
                if(!user) {
                  // if no User found end request and send response
                  var message = 'No User found. User Balance Update not successful';
                  res.status(400).redirect('/400badRequest?message='+message);

                } else {

                  currentUserBalance = parseFloat(user._balance)
                  bookingPrice = parseFloat(price)

                  var newUserBalance = currentUserBalance - bookingPrice
                  user._balance = newUserBalance.toFixed(2)

                  user.save(function(err, up_user) {
                    if(err) {
                      // if validation err occur end request and send response
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                      var message = 'Booking successfully canceled. Update User balance successful';
                      res.status(200).redirect('/200success?message='+message);

                    }
                  })
                }
              })
            }
          })
        // End Booking found condition
        }
      })

    } catch (error) {
      next(error)
    }
  // End createTraining Module
  },

  callParticipants: async function(req, res, next) {
    const id = req.body.id

    try {
      Booking.find({ _booktrainingid: id, $or:[{ _bookparticipation: 'booked' }, { _bookparticipation: 'canceled' }] }, async function(error, bookings) {

        if(bookings.length == 0) {
          // if no User found end request and send response
          var message = 'No Booking found with Booking ID. Confirm Participation not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          res.status(200).render('coach_calls/confirmParticipants', {
            title: 'Confirm Participation Page',
            authenticated: req.session.data,
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            role: req.session.data.role,
            data_bookings: bookings,
            });
        }

      })

    } catch (error) {
      next(error)

    }
  },

  callConfirmPatricipants: async function(req, res, next) {

    const data = req.body.participantsdatainput
    const data_parsed = JSON.parse(data)

    console.log('data: ' +data);
    console.log('data_parsed: ' +data_parsed);
    console.log('data_parsed.length: ' +data_parsed.length);

    try {

      for (let i = 0; i < data_parsed.length; i++) {

        console.log('data_parsed[i].email: ' +data_parsed[i].email);
        console.log('data_parsed[i].id: ' +data_parsed[i].id);

        Booking.findOne({ _bookuseremail: data_parsed[i].email, _booktrainingid: data_parsed[i].id }, async function(error, booking) {
          if(!booking) {
            // if no User found end request and send response
            var message = 'Booking not found. Participation of User can not be confirmed';
            console.log('message: ' +message);
            //res.status(400).redirect('/400badRequest?message='+message);

          } else {

            booking._bookparticipation = 'participated'

            await booking.save(function(err, up_booking) {

              if (err) {
                // if validation err occur end request and send response
                var message = err.message;
                //res.status(400).redirect('/400badRequest?message='+message);
                console.log('message: ' +message);

              } else {
                var message = ('Booking found. Participation of User confirmed for user: '+booking._bookuseremail +' and training-location: '+booking._booktraininglocation);
                console.log('message: ' +message);

              }
            })

          }
        })
      }

      var message = 'Participants Bookings successfully updated';
      res.status(200).redirect('/200success?message='+message);

    } catch (error) {
        next(error)
    }

  },

// End export the Training Controller Modules
}
