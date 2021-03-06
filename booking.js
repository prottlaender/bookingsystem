// booking.js

// Load express module and create app
const express = require('express');
const app = express();
// Trust the first Proxy
app.set('trust proxy', 1);
// Load HTTP response header security module
const helmet = require('helmet');
// use secure HTTP headers using helmet with every request
app.use(
  helmet({
      frameguard: {
        action: "deny",
      },
      referrerPolicy: {
        policy: "no-referrer",
    },
    })
  );
// Load envy module to manage environment variables
const envy = require('envy');
const env = envy();

// Set environment variables
const port = env.port
const host = env.host
const mongodbpath = env.mongodbpath
const sessionsecret = env.sessionsecret
const sessioncookiename = env.sessioncookiename
const sessioncookiecollection = env.sessioncookiecollection

// Load server side session and cookie module
const session = require('express-session');
// Load mongodb session storage module
const connectMdbSession = require('connect-mongodb-session');
// Create MongoDB session store object
const MongoDBStore = connectMdbSession(session)
// Create new session store in mongodb
const store = new MongoDBStore({
  uri: mongodbpath,
  //collection: 'col_sessions'
  collection: sessioncookiecollection
});
// Catch errors in case session store creation fails
store.on('error', function(error) {
  console.log(`error store session in session store: ${error.message}`);
});
// Use session to create session and session cookie
app.use(session({
  secret: sessionsecret,
  name: sessioncookiename,
  store: store,
  resave: false,
  saveUninitialized: false,
  // set cookie to 1 week maxAge
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: true
  },
}));

// load StartMongoServer function from db configuration file
const StartMongoServer = require('./database/db');
// start MongoDB server
StartMongoServer();

// Load db controllers and db models
const userController = require('./database/controllers/userC');
const User = require('./database/models/userM');
const trainingController = require('./database/controllers/trainingC');
const Training = require('./database/models/trainingM');
const locationController = require('./database/controllers/locationC');
const Location = require('./database/models/locationM');
const bookingController = require('./database/controllers/bookingC');
const Booking = require('./database/models/bookingM');
const invoiceController = require('./database/controllers/invoiceC');
const Invoice = require('./database/models/invoiceM');

// Use express.static and locate static files in /static folder in the root of the app
app.use(express.static('./static'));
// Use express.urlencoded to parse incomming requests with urlencoded payloads
app.use(express.urlencoded( { extended: true } ));
// Set Pug Template Engine
app.set('view engine', 'pug')
app.set('views', './views')

// Authorizations
// Redirect GET requests from not authenticated users to login
const redirectLogin = (req, res, next) => {
  if (!req.session.data) {
    res.redirect('/')

  } else {
    next()

  }
}

// Redirect GET requests from authenticated users to dashboard
const redirectDashboard = (req, res, next) => {
  if (req.session.data) {
    res.redirect('/dashboard')

  } else {
    next()

  }
}

// Authorize requests only for not authenticated users
const verifyAnonym = (req, res, next) => {
  if (!req.session.data) {
    next()

  } else {
    var message = 'You are already logged-in. You are not authorized to perform this request !';
    res.status(400).redirect('/400badRequest?message='+message);

  }
}

// Authorize requests only for anonym and admin users
const verifyAnonymAndAdmin = (req, res, next) => {
  if (!req.session.data) {
    next()

  } else {

    if (req.session.data.role == 'admin') {
      next()

    } else {
      var message = 'You are no Admin. You are not authorized to perform this request !';
      res.status(400).redirect('/400badRequest?message='+message);

    }

  }
}

// Authorize requests only for admin and player users
const verifyAdminAndPlayer = (req, res, next) => {
  if (req.session.data) {
    if (req.session.data.role == 'admin') {
      next()

    } else if (req.session.data.role == 'player') {
      next()

    } else {
      var message = 'You are no Admin, no Player. You are not authorized to perform this request !';
      res.status(400).redirect('/400badRequest?message='+message);
    }

  } else {
    var message = 'You are not logged-in. You are not authorized to perform this request !';
    res.status(400).redirect('/400badRequest?message='+message);
  }

}

// Authorize requests only for admin users
const verifyAdmin = (req, res, next) => {
  if (req.session.data) {
    if (req.session.data.role == 'admin') {
      next()

    } else {
      var message = 'You are no Admin. You are not authorized to perform this request !';
      res.status(400).redirect('/400badRequest?message='+message);
    }

  } else {
    var message = 'You are not logged-in. You are not authorized to perform this request !';
    res.status(400).redirect('/400badRequest?message='+message);

  }
}

// Authorize requests only for player users
const verifyPlayer = (req, res, next) => {
  if (req.session.data) {
    if (req.session.data.role == 'player') {
      next()

    } else {
      var message = 'You are no Player. You are not authorized to perform this request !';
      res.status(400).redirect('/400badRequest?message='+message);
    }

  } else {
    var message = 'You are not logged-in. You are not authorized to perform this request !';
    res.status(400).redirect('/400badRequest?message='+message);

  }
}

// Authorize requests only for coach users
const verifyCoach = (req, res, next) => {
  if (req.session.data) {
    if (req.session.data.role == 'coach') {
      next()

    } else {
      var message = 'You are no Coach. You are not authorized to perform this request !';
      res.status(400).redirect('/400badRequest?message='+message);

    }

  } else {
    var message = 'You are not logged-in. You are not authorized to perform this request !';
    res.status(400).redirect('/400badRequest?message='+message);

  }
}

// Validations
// Validate birthdate format
const birthdateFormatValidation = (req, res, next) => {
  const birthdate = req.body.birthdate;
  const regex = /^\d{4}-(0[1-9]|(1[0-2]))-(0[1-9]|([1-2][0-9])|(3[0-1]))$/;

  if(birthdate.match(regex)) {
    next()
  } else {
    var message = 'Birthdate Format not correct. Must be yyyy-mm-dd. mm is i.e. 03 or max 12, dd is i.e. 01 or max. 31.';
    res.status(400).redirect('/400badRequest?message='+message);
  }
}

// Get endpoints
// GET home route only for anonym users. Authenticated users redirected to dashboard
app.get('/', redirectDashboard, (req, res) => {
  console.log(req.url);
  console.log(req.session.id);
  console.log(req.session);

  res.render('index', {
      title: 'User Login Page',
    });

});

// GET register route only for anonym users. Authenticated users redirected to dashboard
app.get('/register', redirectDashboard, (req, res) => {
  console.log(req.url);
  console.log(req.session.id);
  console.log(req.session);

  res.render('register', {
      title: 'User Registration Page',
    });
});

// GET dashboard route only for authenticated users. Anonym users redirected to home
app.get('/dashboard', redirectLogin, async (req, res) => {
  console.log(req.url);
  console.log(req.session.id);
  console.log(req.session);

  // Check admin authorization and render admin_dashboard
  if (req.session.data.role == 'admin') {
    console.log('This is admin');

    const user_query = User.find( {} ).sort({lastname: 1, name: 1});
    var users = await user_query.exec();

    const training_query = Training.find( {} ).sort({date: 'desc'});
    var trainings = await training_query.exec();

    const location_query = Location.find( {} ).sort({location: 'desc'});
    var locations = await location_query.exec();

    const booking_query = Booking.find( {} ).sort({_booktrainingdate: 'desc'});
    var bookings = await booking_query.exec();

    const invoice_query = Invoice.find( {} ).sort({invoicedate: 'desc'});
    var invoices = await invoice_query.exec();

    res.status(200).render('admin_dashboard', {
      title: 'Admin Dashboard Page',
      name: req.session.data.name,
      lastname: req.session.data.lastname,
      role: req.session.data.role,
      data_users: users,
      data_trainings: trainings,
      data_locations: locations,
      data_bookings: bookings,
      data_invoices: invoices,

      });

  // Check player authorization and render player_dashboard
  } else if (req.session.data.role == 'player') {
    console.log('This is player');

    var currentDate = new Date();
    console.log('current date: ' +currentDate);

    const availabletraining_query = Training.find( { _status: 'active', date: { $gte: currentDate } } ).sort({ date: 'desc' });
    var availabletrainings = await availabletraining_query.exec();

    const booking_query = Booking.find( { _bookuseremail: req.session.data.email, _bookparticipation: { $ne: 'invoice' } } ).sort({ _booktrainingdate: 'desc' });
    var bookings = await booking_query.exec();

    const myuser_query = User.findOne( { email: req.session.data.email } );
    var myuser = await myuser_query.exec();

    const invoice_query = Invoice.find( {invoiceemail: req.session.data.email} ).sort({invoicedate: 'desc'});
    var invoices = await invoice_query .exec();

    res.status(200).render('player_dashboard', {
      title: 'Player Dashboard Page',
      name: req.session.data.name,
      lastname: req.session.data.lastname,
      role: req.session.data.role,
      email: req.session.data.email,
      data_availabletrainings: availabletrainings,
      data_bookings: bookings,
      data_myuser: myuser,
      data_myinvoices: invoices,
      });

  // Check coach authorization and render coach_dashboard
  } else if (req.session.data.role == 'coach') {
    console.log('This is coach');

    var currentDate = new Date().setHours(00, 00, 00);
    console.log('currentDate: ' +currentDate);

    const training_query = Training.find( { _status: 'active', date: { $gte: currentDate } } ).sort({ date: 'asc' });
    var trainings = await training_query.exec();

    res.status(200).render('coach_dashboard', {
      title: 'Coach Dashboard Page',
      name: req.session.data.name,
      lastname: req.session.data.lastname,
      role: req.session.data.role,
      data_trainings: trainings,
      });

  } else {
    // if user not authorized as admin, player or coach end request and send response
    var message = 'You are not authorized. Access prohibited';
    res.status(400).redirect('/400badRequest?message='+message);
  }

});

// GET logout route only for authenticated users. Anonym users redirected to home
app.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      res.send('An err occured: ' +err.message);
    } else {
      var message = 'You have been successfully logged out';
      res.status(200).clearCookie('booking').redirect('/200success?message='+message)
    }
  });
})

// GET favicon default
// Browsers will by default try to request /favicon.ico from the
// root of a hostname, in order to show an icon in the browser tab.
// To avoid that requests returning a 404 (Not Found)
// The favicon.ico request will be catched and send a 204 No Content status
app.get('/favicon.ico', function(req, res) {
    console.log(req.url);
    res.status(204).json( { status: 'no favicon' } );
});

// GET Success route render 200success
app.get('/200success', (req, res) => {
  console.log(req.url);
  console.log(req.session.id);
  console.log(req.session);

  res.status(200).render('200success', {
    title: 'Success',
    code: 200,
    status: 'Ok',
    message: req.query.message,
  })
})

// GET Bad Request route render 400badRequest
app.get('/400badRequest', (req, res) => {
  console.log(req.url);
  console.log(req.session.id);
  console.log(req.session);

  res.status(400).render('400badRequest', {
    title: 'Bad Request',
    code: 400,
    status: 'Bad Request',
    message: req.query.message,
  })
})

// POST endpoints
// Anonym POST endpoint
// Login user available for anonym only
app.post('/loginusers', verifyAnonym, userController.loginUser)

// Shared POST endpoints
// Create Users available for anonym and admin
app.post('/createusers', verifyAnonymAndAdmin, birthdateFormatValidation, userController.createUser)
// Update User-Email available for admin and player
app.post('/updateuseremail', verifyAdminAndPlayer, userController.updateUserEmail)
// Update User-Password available for admin and player
app.post('/setnewuserpassword', verifyAdminAndPlayer, userController.setNewUserPassword)

// Admin POST endpoints
// Admin User Management
app.post('/callupdateusers', verifyAdmin, userController.callUpdateUsers)
app.post('/updateuser', verifyAdmin, birthdateFormatValidation, userController.updateUser)
app.post('/terminateusers', verifyAdmin, userController.terminateUser)
app.post('/activateusers', verifyAdmin, userController.activateUser)
app.post('/removeusers', verifyAdmin, userController.removeUser)
// Admin Update Training
app.post('/callupdatetrainings', verifyAdmin, trainingController.callUpdateTrainings)
app.post('/updatetraining', verifyAdmin, trainingController.updateTraining)
// Admin Location Management
app.post('/createlocations', verifyAdmin, locationController.createLocation)
app.post('/callupdatelocations', verifyAdmin, locationController.callUpdateLocations)
app.post('/updatelocation', verifyAdmin, locationController.updateLocation)
app.post('/callcreatetrainings', verifyAdmin, trainingController.callCreateTrainings)
app.post('/createtraining', verifyAdmin, trainingController.createTraining)
// Admin Invoice Management
app.post('/createinvoice', verifyAdmin, invoiceController.createInvoiceUser)
app.post('/callcancelinvoice', verifyAdmin, invoiceController.callCancelInvoice)
app.post('/cancelinvoice', verifyAdmin, invoiceController.cancelInvoice)
app.post('/callpayinvoice', verifyAdmin, invoiceController.callPayInvoice)
app.post('/payinvoice', verifyAdmin, invoiceController.payInvoice)
app.post('/callrepayinvoice', verifyAdmin, invoiceController.callRePayInvoice)
app.post('/repayinvoice', verifyAdmin, invoiceController.rePayInvoice)

// Player POST endpoints
// Player Booking Management
app.post('/callbooktrainings', verifyPlayer, bookingController.callBookTrainings)
app.post('/booktrainings', verifyPlayer, bookingController.bookTraining)
app.post('/bookingreactivate', verifyPlayer, bookingController.bookingReactivate)
app.post('/callcancelbookings', verifyPlayer, bookingController.callCancelBooking)
app.post('/cancelbookings', verifyPlayer, bookingController.cancelBooking)
// Player User Management
app.post('/callupdatemyuserdata', verifyPlayer, userController.callUpdateMyUserData)
app.post('/updatemyuserdata', verifyPlayer, birthdateFormatValidation, userController.updateMyUserData)

// Coach POST endpoints
// Coach Confirmation Management
app.post('/callparticipants', verifyCoach, bookingController.callParticipants)
app.post('/callconfirmpatricipants', verifyCoach, bookingController.callConfirmPatricipants)

// Default route error handler. matches all routes and all methods when no route found.
app.use( (req, res, next) => {
 res.status(404).send({
 code: 404,
 status: 'Not found',
 message: 'Requested route not found'
 })
})

// Default server error handler
app.use( (error, req, res, next) => {
 res.status(500).send({
   code: 500,
   status: 'Internal Server Error',
   message: error.message
 });
})

// Start the app
app.listen(port)

// Default log
console.log(`express bookingsystem server start successful on host ${host} on port ${port}`)
