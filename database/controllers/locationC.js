// database/controllers/locationC.js

// load the relevant Prototype Objects (exported from the models)
const Location = require('../models/locationM');

// export the Location Controller Modules

module.exports = {

  createLocation: async function(req, res, next) {
    // assign input data from request body to input variables
    const location = req.body.location
    const street = req.body.street
    const plz = req.body.plz
    const city = req.body.city
    const priceYouth = req.body.priceYouth
    const priceAdult = req.body.priceAdult

    // create a new Location Object with input from the req.body
    const newLocation = new Location({
      location: location,
      street: street,
      plz: plz,
      city: city,
      priceyouth: priceYouth,
      priceadult: priceAdult
    })

    try {
      newLocation.save(function(err, location) {
        if(err) {
          // if a validation err occur end request and send response
          //res.status(400).render('error', { title: 'Error Page', code: 400, status: 'Bad Request', message: err.message })
          var message = err.message
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          //var locationData = { locationId: location._id, location: location.location, date: location.date, timeStart: location.timeStart, timeEnd: location.timeEnd, priceYouth: location.priceAdult, priceAdult: location.priceAdult, status: location._status }
          //res.status(200).render('success_user', { title: 'Success Info Page', code: 200, status: 'Ok', message: 'Location successfully created', data: locationData })

          var message = 'Location successfully created.';
          res.status(200).redirect('/200success?message='+message);

        }
      })

    } catch (error) {
      next(error)
    }
  // End createLocation Module
  },

  callUpdateLocations: async function(req, res, next) {

    // assign input data from request body to input variables
    const id = req.body.id

    try {

      Location.findOne( { _id: id }, function(error, locationtoupdate) {
        if (!locationtoupdate) {
          // if no location found end request and send response
          var message = 'Location not found. Update Location not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          res.status(200).render('admin_calls/updateLocations', {
            title: 'Update Locations Page',
            authenticated: req.session.data,
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            role: req.session.data.role,
            data_location_id: locationtoupdate._id,
            data_location_location: locationtoupdate.location,
            data_location_street: locationtoupdate.street,
            data_location_plz: locationtoupdate.plz,
            data_location_city: locationtoupdate.city,
            data_location_priceyouth: locationtoupdate.priceyouth,
            data_location_priceadult: locationtoupdate.priceadult,

            });
        }
      })

    } catch (error) {
      next(error)

    }

  },

  updateLocation: async function(req, res, next) {

    // assign input data from request body to input variables
    const id = req.body.id
    const updateLocation = req.body.updateLocation
    const updateStreet = req.body.updateStreet
    const updatePlz = req.body.updatePlz
    const updateCity = req.body.updateCity
    const updatePriceYouth = req.body.updatePriceYouth
    const updatePriceAdult= req.body.updatePriceAdult
  

    try {
      Location.findOne( { _id: id }, function(error, location) {
        if (!location) {
          // if no location found end request and send response
          var message = 'Location not found. Update Location not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          location.location = updateLocation
          location.street = updateStreet
          location.plz = updatePlz
          location.city = updateCity
          location.priceyouth = updatePriceYouth
          location.priceadult = updatePriceAdult
          //location._status= updateStatus

          location.save(function(err, up_location) {
            if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
              var message = 'Update Location successful';
              res.status(200).redirect('/200success?message='+message);
            }
          })
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  },

// End export the Location Controller Modules
}
