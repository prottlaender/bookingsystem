const envy = require('envy')
const env = envy()

const mongodbpath = env.mongodbpath

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const StartMongoServer = async function() {
  try {

    await mongoose.connect(mongodbpath)
    .then(function() {
      console.log(`Mongoose connection to bookingsystem DB open on ${mongodbpath}`);
    })
    .catch(function(error) {
      console.log(`Connection error message: ${error.message}`);
    })

  } catch(error) {
    res.json( { status: "db connection error", message: error.message } );
  }

};

module.exports = StartMongoServer;
