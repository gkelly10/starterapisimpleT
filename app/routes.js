const ObjectID = require('mongodb').ObjectID
module.exports = function(app, passport, db) {


// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('tasks').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            tasks: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    // app.post('/habitTrackerRoute', (req, res) => {
    //   db.collection('habitTrackerCollection').save({habit: req.body.habit, accountabuddy: req.body.accountabuddy, minHabitLenght: req.body.minHabitLenght, checkInFrequency: req.body.checkInFrequency}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/profile')
    //   })
    // })
    app.post('/tasks', (req, res) => {//route for passwords | POST method
      db.collection('tasks').insertOne({//adds a new document to the passwords collection in mongo with the values of website, username, and password (comes from the form)
          title: req.body.title,
          feedback: req.body.feedback
          // description: req.body.description || '', 
      }, (err, result) => {
          if (err) return console.log(err);
          console.log('Task added to tracker');
          res.redirect('/profile');//redirects back to the root url to refresh the page with the post there now
      });
  });

    // app.put('/updateHabit', (req, res) => {
    //   db.collection('habitTrackerCollection')
    //   .findOneAndUpdate({_id: ObjectID(req.body.habitId)}, {
    //     $set: {
    //       habit:req.body.newhabit,
    //       accountabuddy:req.body.newaccountabuddy,
    //       minHabitLenght:req.body.newlength,
    //       checkInFrequency:req.body.newfrequency
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })
    app.put('/tasks/feedback', (req, res) => {//PUT route for the edits. puts new stuff into the route
      db.collection('tasks')
          .findOneAndUpdate({ _id: new require('mongodb').ObjectId(req.body.id) }, {//this is searching documents by id now//makes it specific for the server what document to update bcs each one has a unique id
              $set: {//updating website, username, password
                  feedback: req.body.feedback
              }
          }, {
              upsert: true//creates a document if it dsn't exist
          }, (err, result) => {
              if (err) return res.send(err);
              res.send(result);
          });
  });

    // app.delete('/deleteHabit', (req, res) => {
    //   db.collection('habitTrackerCollection').findOneAndDelete({_id: ObjectID(req.body.habitId)}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })
    app.delete('/tasks', (req, res) => {
      db.collection('tasks').findOneAndDelete({ _id: new require('mongodb').ObjectId(req.body.id) }, (err, result) => {//looking for the doument to dlete//specifies the document to be deleted by id
          if (err) return res.send(500, err);
          res.send('Task deleted!');
      });
  });
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
