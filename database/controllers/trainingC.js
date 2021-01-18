// database/controllers/trainingC.js

// load the relevant Prototype Objects (exported from the models)
const Training = require('../models/trainingM');
const Location = require('../models/locationM');
const Booking = require('../models/bookingM');
const User = require('../models/userM');

// export the Training Controller Modules

module.exports = {

  callCreateTrainings: async function(req, res, next) {
    // assign input data from request body to input variables
    const id = req.body.id

    try {

      Location.findOne( { _id: id }, function(error, locationfortraining) {
        if (!locationfortraining) {
          // if no location found end request and send response
          var message = 'Location not found. Create Training not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          res.status(200).render('admin_calls/createTrainings', {
            title: 'Create Trainings Page',
            authenticated: req.session.data,
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            role: req.session.data.role,
            data_location_location: locationfortraining.location,
            data_location_priceyouth: locationfortraining.priceyouth,
            data_location_priceadult: locationfortraining.priceadult,

            });
        }
      })

    } catch (error) {
      next(error)

    }

  },

  createTraining: async function(req, res, next) {
    // assign input data from request body to input variables
    const location = req.body.location
    const priceYouth = req.body.priceYouth
    const priceAdult = req.body.priceAdult
    const type = req.body.type
    const date = req.body.date
    const timeStart = req.body.timeStart
    const timeEnd = req.body.timeEnd


    // create a new Training Object with input from the req.body
    const newTraining = new Training({
      location: location,
      priceyouth: priceYouth,
      priceadult: priceAdult,
      type: type,
      date: date,
      timestart: timeStart,
      timeend: timeEnd,

    })

    try {
      newTraining.save(function(err, training) {
        if(err) {
          // if a validation err occur end request and send response
          //res.status(400).render('error', { title: 'Error Page', code: 400, status: 'Bad Request', message: err.message })
          var message = err.message
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          //var trainingData = { trainingId: training._id, location: training.location, date: training.date, timeStart: training.timeStart, timeEnd: training.timeEnd, priceYouth: training.priceAdult, priceAdult: training.priceAdult, status: training._status }
          //res.status(200).render('success_user', { title: 'Success Info Page', code: 200, status: 'Ok', message: 'Training successfully created', data: trainingData })

          var message = 'Training successfully created.';
          res.status(200).redirect('/200success?message='+message);

        }
      })

    } catch (error) {
      next(error)
    }
  // End createTraining Module
  },

  callUpdateTrainings: async function(req, res, next) {

    // assign input data from request body to input variables
    const id = req.body.id

    try {

      Training.findOne( { _id: id, $or:[ { _status: 'active' }, { _status: 'in-active' } ] }, function(error, trainingtoupdate) {
        if (!trainingtoupdate) {
          // if no location found end request and send response
          var message = 'Training not found. Training status mus be active or in-active. Update Training not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          var dd = (trainingtoupdate.date.getDate() < 10 ? '0' : '') +trainingtoupdate.date.getDate();
          var mm = ((trainingtoupdate.date.getMonth()+1) < 10 ? '0' : '') +(trainingtoupdate.date.getMonth()+1)
          var yyyy = trainingtoupdate.date.getFullYear()
          var trainingDate = yyyy +'-' +mm +'-' +dd

          res.status(200).render('admin_calls/updateTrainings', {
            title: 'Update Trainings Page',
            authenticated: req.session.data,
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            role: req.session.data.role,
            data_training_id: trainingtoupdate._id,
            data_training_location: trainingtoupdate.location,
            data_training_priceyouth: trainingtoupdate.priceyouth,
            data_training_priceadult: trainingtoupdate.priceadult,
            data_training_type: trainingtoupdate.type,
            data_training_date: trainingDate,
            data_training_timestart: trainingtoupdate.timestart,
            data_training_timeend: trainingtoupdate.timeend,
            data_training_status: trainingtoupdate._status,

            });
        }
      })

    } catch (error) {
      next(error)

    }

  },

  updateTraining: async function(req, res, next) {
    // assign input data from request body to input variables
    const id = req.body.id

    const updateDate = req.body.newDate
    const updateTimeStart = req.body.newTimeStart
    const updateTimeEnd = req.body.newTimeEnd
    const updateStatus = req.body.newStatus

    if (updateStatus == 'active') {

      try {

        await Training.findOne( { _id: id }, async function(error, training) {
          if (!training) {
            // if no location found end request and send response
            var message = 'Training not found. Update Training not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {

            training.date = updateDate
            training.timestart = updateTimeStart
            training.timeend = updateTimeEnd
            training._status = updateStatus

            await training.save(function(err, up_training) {
              if (err) {
                // if validation err occur end request and send response
                var message = err.message;
                res.status(400).redirect('/400badRequest?message='+message);

              } else {
                // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                var message = 'Update Training successful. Training successfully activated';
                res.status(200).redirect('/200success?message='+message);
              }
            })
          }
        })

      } catch (error) {
        next(error)

      }

    } else if (updateStatus == 'rejected') {

      try {

        await Training.findOne( { _id: id }, async function(error, training) {
          if (!training) {
            // if no location found end request and send response
            var message = 'Training not found. Update Training not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {

            try {

              await Booking.find( { _booktrainingid: id, $or:[ {_bookparticipation: 'booked'}, {_bookparticipation: 'canceled'} ] }, async function(error, booking) {

                if (booking.length == 0) {

                  training.date = updateDate
                  training.timestart = updateTimeStart
                  training.timeend = updateTimeEnd
                  training._status = updateStatus

                  await training.save(function(err, up_training) {
                    if (err) {
                      // if validation err occur end request and send response
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                      var message = 'Update Training successful. Training rejected successfully (No bookings)';
                      res.status(200).redirect('/200success?message='+message);
                    }
                  })

                } else {

                  for (var i = 0; i < booking.length; i++) {

                    if (booking[i]._bookparticipation == 'booked') {

                      booking[i]._bookparticipation = 'rejected'
                      var bookingprice = booking[i]._booktrainingprice
                      var bookingpriceFloat = parseFloat(bookingprice)

                      await booking[i].save(async function(err, up_booking) {
                        if (err) {
                          // if validation err occur end request and send response
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {
                          console.log('Booking Participation has been updated with "rejected" for id: ' +up_booking._id +' Booking Location: ' +up_booking._booktraininglocation);

                        }
                      })

                      try {

                        await User.findOne( { email: booking[i]._bookuseremail }, async function(error, user) {
                          if(!user) {
                            console.log('No User found to update');

                          } else {
                            console.log('User found: ' +user.email);
                            console.log('User Balance: ' +user._balance);

                            var balance = user._balance
                            var balanceFloat = parseFloat(balance)
                            var newbalanceFloat = balance - bookingpriceFloat
                            var newbalanceFixed = newbalanceFloat.toFixed(2)

                            console.log('Booking price: ' +bookingpriceFloat.toFixed(2));
                            console.log('User new balance: ' +newbalanceFixed);

                            user._balance = newbalanceFixed

                            await user.save(function(err, up_user) {
                              if(err) {
                                console.log('err message: ' +err.message);

                              } else {
                                console.log('User update successful. New balance: ' +up_user._balance);

                              }
                            })
                          }
                        })

                      } catch (error) {
                        next(error)

                      }

                    } else {

                      booking[i]._bookparticipation = 'rejected'

                      await booking[i].save(async function(err, up_booking) {
                        if (err) {
                          // if validation err occur end request and send response
                          var message = err.message;
                          res.status(400).redirect('/400badRequest?message='+message);

                        } else {
                          console.log('Booking Participation has been updated with "rejected" for id: ' +up_booking._id +' Booking Location: ' +up_booking._booktraininglocation);

                        }
                      })

                    }
                  }

                  training.date = updateDate
                  training.timestart = updateTimeStart
                  training.timeend = updateTimeEnd
                  training._status = updateStatus

                  await training.save(function(err, up_training) {
                    if (err) {
                      // if validation err occur end request and send response
                      var message = err.message;
                      res.status(400).redirect('/400badRequest?message='+message);

                    } else {
                      // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                      var message = 'Update Training successful. Training rejected successfully. (Bookings updated)';
                      res.status(200).redirect('/200success?message='+message);
                    }
                  })
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

    } else {
      var message = 'Update Status not correct. Status must be active or rejected. Update Training not possible';
      res.status(400).redirect('/400badRequest?message='+message);

    }

  // End Module
  },

// End export the Training Controller Modules
}
