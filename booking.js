// booking.js

// http module
const http = require('http');
// express module
const express = require('express');
// envy module to manage environment variables
const envy = require('envy');
// hTTP header security module
const helmet = require('helmet');
// server side session and cookie module
const session = require('express-session');
// mongodb session storage module
const connectMdbSession = require('connect-mongodb-session');

// load controllers and models
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

// set the environment variables
const env = envy()
const port = env.port
const host = env.host
const mongodbpath = env.mongodbpath
const sessionsecret = env.sessionsecret
const sessioncookiename = env.sessioncookiename

// load StartMongoServer function from db configuration file
const StartMongoServer = require('./database/db');
// start MongoDB server
StartMongoServer();

// Create MongoDB session storage object
const MongoDBStore = connectMdbSession(session)

// create new session store in mongodb
const store = new MongoDBStore({
  uri: mongodbpath,
  collection: 'col_sessions'
});

// catch errors in case store creation fails
store.on('error', function(error) {
  console.log(`error store session in session store: ${error.message}`);
});

// Create the express app
const app = express();

// Set Pug Template Engine
app.set('view engine', 'pug')
app.set('views', './views')

// use express.static and locate static files in /static folder in the root of the app
app.use(express.static('./static'));
// use express.urlencoded to parse incomming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// use secure HTTP headers using helmet
app.use(helmet())
// use session to create session and session cookie
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

// middleware to redirect not authenticated users to login others to next()
const redirectLogin = (req, res, next) => {
  if (!req.session.data) {
    res.redirect('/')
  } else {
    next()
  }
}

// middleware to redirect authenticated users to dashboard others to next()
const redirectDashboard = (req, res, next) => {
  if (req.session.data) {
    res.redirect('/dashboard')
  } else {
    next()
  }
}

// middleware to validate birthdate format
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

// middleware to validate role
const roleValidation = (req, res, next) => {
  const role = req.body.role;

  if (role !== 'admin' && role !== 'player' && role !== 'coach') {
    var message = 'Role is not correct. Pls. use role player or coach';
    res.status(400).redirect('/400badRequest?message='+message);

  } else {
    next()
  }

}

// For each navigation link create get routes and send HTML to the Browser
app.get('/', redirectDashboard, (req, res) => {
  console.log(req.url);
  console.log(req.session.id);

  res.render('index', {
      title: 'User Login Page',
    });

});

app.get('/register', redirectDashboard, (req, res) => {
  console.log(req.url);
  console.log(req.session.id);

  res.render('register', {
      title: 'User Registration Page',
    });
});

app.get('/dashboard', redirectLogin, async (req, res) => {

  console.log(req.url);
  console.log(req.session.id);

  if (req.session.data.role == 'admin') {
    console.log('This is admin');

    const user_query = User.find( {} ).sort({lastname: 1, name: 1});
    var users = await user_query.exec();

    const training_query = Training.find( {} ).sort({date: 'desc'});
    var trainings = await training_query.exec();

    const location_query = Location.find( {} ).sort({location: 'desc'});
    var locations = await location_query.exec();

    const booking_query = Booking.find( {} ).sort({_booktraininglocation: 'desc'});
    var bookings = await booking_query.exec();

    const invoice_query = Invoice.find( {} ).sort({invoicedate: 'desc'});
    var invoices = await invoice_query .exec();

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
    // if user not authorized as admin end request and send response
    var message = 'You are not authorized. Access prohibited';
    res.status(400).redirect('/400badRequest?message='+message);
  }

});

app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      res.send('An err occured: ' +err.message);
    } else {
      var message = 'You have been successfully logged out';
      res.status(200).clearCookie('booking').redirect('/200success?message='+message)
    }
  });
})

app.get('/200success', (req, res) => {
  console.log(req.url);
  console.log(req.session.id);

  res.status(200).render('200success', {
    title: 'Success',
    code: 200,
    status: 'Ok',
    message: req.query.message,
  })
})

app.get('/400badRequest', (req, res) => {
  console.log(req.url);
  console.log(req.session.id);

  res.status(400).render('400badRequest', {
    title: 'Bad Request',
    code: 400,
    status: 'Bad Request',
    message: req.query.message,
  })
})

// User Registration and Authentication
app.post('/createusers', birthdateFormatValidation, roleValidation, userController.createUser)
app.post('/loginusers', userController.loginUser)

// Admin User Management
app.post('/callupdateusers', userController.callUpdateUsers)
app.post('/updateuser', birthdateFormatValidation, roleValidation, userController.updateUser)
app.post('/updateuseremail', userController.updateUserEmail)
app.post('/terminateusers', userController.terminateUser)
app.post('/activateusers', userController.activateUser)
app.post('/removeusers', userController.removeUser)
app.post('/setnewuserpassword', userController.setNewUserPassword)

// Admin Training Management
app.post('/callcreatetrainings', trainingController.callCreateTrainings)
app.post('/createtraining', trainingController.createTraining)
app.post('/callupdatetrainings', trainingController.callUpdateTrainings)
app.post('/updatetraining', trainingController.updateTraining)

// Admin Location Management
app.post('/createlocations', locationController.createLocation)
app.post('/callupdatelocations', locationController.callUpdateLocations)
app.post('/updatelocation', locationController.updateLocation)

// Admin Invoice Management
app.post('/createinvoice', invoiceController.createInvoiceUser)
app.post('/callcancelinvoice', invoiceController.callCancelInvoice)
app.post('/cancelinvoice', invoiceController.cancelInvoice)
app.post('/callpayinvoice', invoiceController.callPayInvoice)
app.post('/payinvoice', invoiceController.payInvoice)

// Player Booking Management
app.post('/callbooktrainings', bookingController.callBookTrainings)
app.post('/booktrainings', bookingController.bookTraining)
app.post('/bookingreactivate', bookingController.bookingReactivate)
app.post('/callcancelbookings', bookingController.callCancelBooking)
app.post('/cancelbookings', bookingController.cancelBooking)
app.post('/callupdatemyuserdata', userController.callUpdateMyUserData)
app.post('/updatemyuserdata', userController.updateMyUserData)

// Coach Confirmation Management
app.post('/callparticipants', bookingController.callParticipants)
app.post('/callconfirmpatricipants', bookingController.callConfirmPatricipants)


// Browsers will by default try to request /favicon.ico from the
// root of a hostname, in order to show an icon in the browser tab.
// To avoid that requests returning a 404 (Not Found)
// The favicon.ico request will be catched and send a 204 No Content status
app.get('/favicon.ico', function(req, res) {
    console.log(req.url);
    res.status(204).json({status: 'no favicon'});
});

// default route error handler. matches all routes and all methods
app.use((req, res, next) => {
 res.status(404).send({
 code: 404,
 status: 'Not found',
 message: 'Requested route not found'
 })
})

// default server error handler
app.use( (error, req, res, next) => {
 res.status(500).send({
   code: 500,
   status: 'Internal Server Error',
   message: error.message
 });
})

// create server
const server = http.createServer(app)

// connect server to port
server.listen(port)

console.log(`express bookingsystem server start successful on host ${host} on port ${port}`)
