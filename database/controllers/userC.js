// database/controllers/userC.js

// load the bcryptjs module
const bcrypt = require('bcryptjs');
// load the relevant Prototype Objects (exported from the models)
const Booking = require('../models/bookingM');
const User = require('../models/userM');

// define hash saltrounds for password hashing
const saltRounds = 10;

// export the User Controller Modules
module.exports = {

  // createUser Module
  createUser: async function(req, res, next) {

    // assign input data from request body to input variables
    const name = req.body.name
    const lastname = req.body.lastname
    const street = req.body.street
    const plz = req.body.plz
    const city = req.body.city
    const birthdate = req.body.birthdate
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()
    const password = req.body.password
    const passwordrepeat = req.body.passwordrepeat
    const role = req.body.role

    if (password == passwordrepeat) {
      // create a new User Object with input from the req.body
      const newUser = new User({
        name: name,
        lastname: lastname,
        street: street,
        plz: plz,
        city: city,
        birthdate: birthdate,
        email: email,
        password: password,
        role: role,
      })

      newUser.password = await bcrypt.hash(newUser.password, saltRounds)

      try {
        // try to find a user by email and catch error in case query fail
        User.findOne({ email: email }, function(error, user) {
          if (user) {
            // if user already exist end request and send response
            var message = 'User already with this email exist. Create User not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {
            // if user not exist save new user
            newUser.save(function(err, user) {
              if (err) {
                // if a validation err occur end request and send response
                var message = err.message
                res.status(400).redirect('/400badRequest?message='+message);

              } else {
                var message = 'User successfully created. Pls. wait for approval';
                res.status(200).redirect('/200success?message='+message);
              }
            })
          }
        })

      } catch (error) {
        // if user query fail call default error function
        next(error)
      }

    } else {
      var message = 'Passwords do not match. Create User not possible';
      res.status(400).redirect('/400badRequest?message='+message);

    }

  // End createUser Module
  },

  callUpdateUsers: async function(req, res, next) {

    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    try {

      User.findOne( { email: email }, function(error, usertoupdate) {
        if (!usertoupdate) {
          // if no User found end request and send response
          var message = 'User not found. Update User not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          var yearInMs = 3.15576e+10;
          var currentDate = new Date ()
          var currentDateMs = currentDate.getTime()
          var birthDateMs = usertoupdate.birthdate.getTime()
          var age = Math.floor((currentDateMs - birthDateMs) / yearInMs)

          if (age < 18) {
            var cat = 'youth'
          } else {
            var cat = 'adult'
          };

          var dd = (usertoupdate.birthdate.getDate() < 10 ? '0' : '') +usertoupdate.birthdate.getDate();
          var mm = ((usertoupdate.birthdate.getMonth()+1) < 10 ? '0' : '') +(usertoupdate.birthdate.getMonth()+1)
          var yyyy = usertoupdate.birthdate.getFullYear()
          var updateBirthdate = yyyy +'-' +mm +'-' +dd

          res.status(200).render('admin_calls/updateUsers', {
            title: 'Update User Page',
            authenticated: req.session.data,
            name: req.session.data.name,
            lastname: req.session.data.lastname,
            role: req.session.data.role,
            data_user_name: usertoupdate.name,
            data_user_lastname: usertoupdate.lastname,
            data_user_street: usertoupdate.street,
            data_user_plz: usertoupdate.plz,
            data_user_city: usertoupdate.city,
            data_user_role: usertoupdate.role,
            data_user_email: usertoupdate.email,
            data_user_balance: usertoupdate._balance,
            data_user_status: usertoupdate._status,
            calc_birthdate: updateBirthdate,
            calc_age: age,
            calc_cat: cat,

            });
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  // End Module
  },

  updateUser: async function(req, res, next) {

    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    const updateName = req.body.updateName
    const updateLastname = req.body.updateLastname
    const updateStreet = req.body.updateStreet
    const updatePlz = req.body.updatePlz
    const updateCity = req.body.updateCity
    const updateBirthdate = req.body.birthdate
    const updateRole = req.body.role

    try {

      User.findOne( { email: email }, function(error, user) {
        if (!user) {
          // if no User found end request and send response
          var message = 'User not found. Update User not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          user.name = updateName
          user.lastname = updateLastname
          user.street = updateStreet
          user.plz = updatePlz
          user.city = updateCity
          user.birthdate = updateBirthdate
          user.role = updateRole

          user.save(function(err, up_user) {
            if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
              var message = 'Update User successful';
              res.status(200).redirect('/200success?message='+message);
            }
          })
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  // End Module
  },

  callUpdateMyUserData: async function(req, res, next) {

    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    if (email !== req.session.data.email) {
      // if no User found end request and send response
      var message = 'You are not allowed to update User Data from any other User ';
      res.status(400).redirect('/400badRequest?message='+message);

    } else {

      try {

        User.findOne( { email: email }, function(error, usertoupdate) {
          if (!usertoupdate) {
            // if no User found end request and send response
            var message = 'User not found. Update User not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {

            var dd = (usertoupdate.birthdate.getDate() < 10 ? '0' : '') +usertoupdate.birthdate.getDate();
            var mm = ((usertoupdate.birthdate.getMonth()+1) < 10 ? '0' : '') +(usertoupdate.birthdate.getMonth()+1)
            var yyyy = usertoupdate.birthdate.getFullYear()
            var updateBirthdate = yyyy +'-' +mm +'-' +dd

            var yearInMs = 3.15576e+10;
            var currentDate = new Date ()
            var currentDateMs = currentDate.getTime()
            var birthDateMs = usertoupdate.birthdate.getTime()
            var age = Math.floor((currentDateMs - birthDateMs) / yearInMs)

            if (age < 18) {
              var cat = 'youth'
            } else {
              var cat = 'adult'
            };

            res.status(200).render('player_calls/updateMyUserData', {
              title: 'Update My User Data Page',
              data_user_name: usertoupdate.name,
              data_user_lastname: usertoupdate.lastname,
              data_user_street: usertoupdate.street,
              data_user_plz: usertoupdate.plz,
              data_user_city: usertoupdate.city,
              data_user_birthdate: updateBirthdate,
              data_user_role: usertoupdate.role,
              data_user_email: usertoupdate.email,
              data_user_balance: usertoupdate._balance,
              data_user_status: usertoupdate._status,
              calc_age: age,
              calc_cat: cat,

              });
          }
        })

      } catch (error) {
        // if user query fail call default error function
        next(error)
      }
    }
  // End Module
  },

  updateMyUserData: async function(req, res, next) {

    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    const updateBirthdate = req.body.birthdate
    const updateName = req.body.updateName
    const updateLastname = req.body.updateLastname
    const updateStreet = req.body.updateStreet
    const updatePlz = req.body.updatePlz
    const updateCity = req.body.updateCity

    try {

      User.findOne( { email: email }, function(error, user) {
        if (!user) {
          // if no User found end request and send response
          var message = 'User not found. Update User not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
          user.name = updateName
          user.lastname = updateLastname
          user.street = updateStreet
          user.plz = updatePlz
          user.city = updateCity
          user.birthdate = updateBirthdate

          user.save(function(err, up_user) {
            if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
              var message = 'Update My User Data successful';
              res.status(200).redirect('/200success?message='+message);
            }
          })
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  // End Module
  },

  // updateUserEmail Module
  updateUserEmail: function(req, res, next) {
    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()
    const inputnewemail = req.body.newEmail
    const updateEmail = inputnewemail.toLowerCase()

    try {
      // try to find a user by email and catch error in case query fail
      User.findOne({ email: email }, function(error, user) {
       if (!user) {
          // if no user found end request and send response
          var message = 'User not found. Update User Email not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          if (req.session.data.role == 'admin') {
            // if user exist update user email with updateEmail and save user
            user.email = updateEmail
            user.save(function(err, up_user) {
              if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

              } else {
                // where the user is author and catch err in case update fail
                Booking.updateMany({ "_bookuseremail": email }, { "_bookuseremail": updateEmail }, function(err, result) {
                  if (result.n == 0) {
                    var message = 'User email update successful. No Bookings Found to update User email on Bookings';
                    res.status(200).redirect('/200success?message='+message);

                   } else {
                     var message = 'User email update successful. User email on Bookings updated';
                     res.status(200).redirect('/200success?message='+message);
                   }
                })
              }
            })

          // End User is Admin condition
          } else {

            // Check if the the user that is logged in change his own email
            if (req.session.data.email == inputemail) {

              // if user exist update user email with updateEmail and save user
              user.email = updateEmail
              user.save(function(err, up_user) {
                if (err) {
                // if validation err occur end request and send response
                var message = err.message;
                res.status(400).redirect('/400badRequest?message='+message);

                } else {
                  // where the user is author and catch err in case update fail
                  Booking.updateMany({ "_bookuseremail": email }, { "_bookuseremail": updateEmail }, function(err, result) {

                    if (result.n == 0) {
                      req.session.destroy(function(err) {
                        if (err) {
                          res.send('An err occured: ' +err.message);

                        } else {
                          var message = 'User email update successful. No Bookings Found to update User email on Bookings. Login with your new Email';
                          //res.status(200).redirect('/200success?message='+message);
                          res.status(200).clearCookie('booking').redirect('/200success?message='+message);
                        }
                      })

                     } else {
                       req.session.destroy(function(err) {
                         if (err) {
                           res.send('An err occured: ' +err.message);

                         } else {
                           var message = 'User email update successful. User email on Bookings updated. Login with your new Email';
                           res.status(200).clearCookie('booking').redirect('/200success?message='+message);

                         }
                       })
                     }
                  })
                }
              })

            } else {

              var message = 'You are not authorized to perform this request. You can only update your own email !';
              res.status(400).redirect('/400badRequest?message='+message);

            }
          // End User is no admin condition
          }
        // End User exist condition
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  // End Module
  },

  // terminateUser Module
  terminateUser: function(req, res, next) {
    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()
    const updateStatus = "terminated"

    try {
      // try to find a user by email and catch error in case query fail
      User.findOne({ email: email }, function(error, user) {
       if (!user) {
          // if no user found end request and send response
          var message = 'User not found. Terminate User not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          if (user._status == 'terminated') {

            var message = 'User status is already terminated. Terminate user not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {

            if (user._balance > 0) {
              // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update author email successful end request and send response
              var message = 'User can not be terminated because users balance is greater 0';
              res.status(400).redirect('/400badRequest?message='+message);

            } else {
              // if user exist update user email with updateEmail and save user
              user._status = updateStatus
              user.save(function(err, up_user) {
                if (err) {
                // if validation err occur end request and send response
                var message = err.message;
                res.status(400).redirect('/400badRequest?message='+message);

                } else {
                  var message = 'Terminate User successful';
                  res.status(200).redirect('/200success?message='+message);
                }
              })
            }
          }
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  // End Module
  },

  // activateUser Module
  activateUser: function(req, res, next) {
    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()
    const updateStatus = "active"

    try {
      // try to find a user by email and catch error in case query fail
      User.findOne({ email: email }, function(error, user) {

       if (!user) {
          // if no user found end request and send response
          var message = 'User not found. Activate User not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          if (user._status == 'active') {

            var message = 'User is already active. Activate user not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {

            // if user exist update user email with updateEmail and save user
            user._status = updateStatus
            user.save(function(err, up_user) {

              if (err) {
              // if validation err occur end request and send response
              var message = err.message;
              res.status(400).redirect('/400badRequest?message='+message);

              } else {
                var message = 'Activate User successful';
                res.status(200).redirect('/200success?message='+message);

              }
            })
          }
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
  // End Module
  },

  // removeUser Module
  removeUser: function(req, res, next) {

    // assign input data from request body to input variables
    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    try {

      User.findOne({ email: email }, function(error, user) {
        if(!user) {
          // if no user found end request and send response
          var message = 'User not found. Remove User not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else if (user.role == 'admin') {
          // if user role is admin end request and send response
          var message = 'User role is admin. Remove Admin Users is not possible';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {

          if (user._status !== 'terminated') {
            // if user status is not terminated end request and send response
            var message = 'User Status is not terminated. Remove User not possible';
            res.status(400).redirect('/400badRequest?message='+message);

          } else {
            User.deleteOne({ email: email }, function(err, result) {
              if (result.n == 0) {
                // if result show no item to delete {n: 0, nModified: 0, ok: 0} end request and send response
                var message = 'No User with this Email. Remove User not possible';
                res.status(400).redirect('/400badRequest?message='+message);

              } else {
                // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update author email successful end request and send response
                var message = 'User removed successfully';
                res.status(200).redirect('/200success?message='+message);
              }
            })
          }
        }
      })

    } catch (error) {
      // if user query fail call default error function
      next(error)
    }
    // End Module
  },

  loginUser: function (req, res) {

    const inputemail = req.body.email
    const email = inputemail.toLowerCase()

    User.findOne({ email: email }, async function(error, user) {
      if (!user) {
        var message = 'User not found. Login not possible';
        res.status(400).redirect('/400badRequest?message='+message);

      } else {
        if (user._status !== 'active') {
          var message = 'Login not possible. Await User to be activated';
          res.status(400).redirect('/400badRequest?message='+message);

        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {

              var yearInMs = 3.15576e+10;
              var currentDate = new Date ()
              var currentDateMs = currentDate.getTime()
              var birthDateMs = user.birthdate.getTime()
              var age = Math.floor((currentDateMs - birthDateMs) / yearInMs)

              if (age < 18) {
                var cat = 'youth'
              } else {
                var cat = 'adult'
              };

              var userData = {
                userId: user._id,
                status: user._status,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
                age: age,
                cat: cat,
              }

              req.session.data = userData

              res.status(200).redirect('/dashboard')

            } else {
              var message = 'Login not possible. Wrong User password';
              res.status(400).redirect('/400badRequest?message='+message);
            }
        }
      }
    })
  // End Module
  },

  setNewUserPassword: async function(req, res, next) {
    const currentpassword = req.body.currentpassword
    const password = req.body.password
    const passwordrepeat = req.body.passwordrepeat

    if (password == passwordrepeat) {

      if (req.session.data.role == 'admin') {
        const inputemail = req.body.email
        const email = inputemail.toLowerCase()

        try {
          User.findOne({ email: email }, async function(error, user) {

            if (!user) {
              var message = 'User not found. Set new password not possible';
              res.status(400).redirect('/400badRequest?message='+message);

            } else {

              var newpassword = await bcrypt.hash(password, saltRounds)
              user.password = newpassword

              user.save(function(err, up_user) {
                if (err) {
                  // if validation err occur end request and send response
                  var message = err.message;
                  res.status(400).redirect('/400badRequest?message='+message);

                } else {
                  // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                  var message = 'New password has been set successfully';
                  res.status(200).redirect('/200success?message='+message);
                }
              })
            }
          })

        } catch (error) {
          next(error)
        }

      } else {

        const inputemail = req.session.data.email
        const email = inputemail.toLowerCase()

        try {
          User.findOne({ email: email }, async function(error, user) {

            if (!user) {
              var message = 'User not found. Set new password not possible';
              res.status(400).redirect('/400badRequest?message='+message);

            } else {

              if (bcrypt.compareSync(currentpassword, user.password)) {

                var newpassword = await bcrypt.hash(password, saltRounds)
                user.password = newpassword

                user.save(function(err, up_user) {
                  if (err) {
                    // if validation err occur end request and send response
                    var message = err.message;
                    res.status(400).redirect('/400badRequest?message='+message);

                  } else {
                    // if result show items (example result object: {n: 2, nModified: 2, ok: 2}) to update location location successful end request and send response
                    var message = 'New password has been set successfully. Pls. remember that you must logon next time with the new password';
                    res.status(200).redirect('/200success?message='+message);
                  }
                })

              } else {
                var message = 'Change Password not possible. Wrong Current User password';
                res.status(400).redirect('/400badRequest?message='+message);

              }
            }
          })

      } catch (error) {
        next(error)
      }

      }

    } else {
      var message = 'Passwords do not match. Set new password not possible';
      res.status(400).redirect('/400badRequest?message='+message);
    }
  // End Module
  },
// End export Modules
}
