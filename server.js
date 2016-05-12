// Require the Express Module
var express = require("express");
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Integrate body-parser with our App
// Require path
var path = require("path");
var moment = require("moment");
//require mongoose
app.use(bodyParser.urlencoded());
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/messageboard');


// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, "./static")));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
var MessageSchema = new mongoose.Schema({
 name: String,
 message: String,
 comments: [{name: String, comment: String}],
 created_at: {type: Date, default: Date.now() }
})
mongoose.model('Message', MessageSchema); // We are setting this Schema in our Models as 'Message'
var Message = mongoose.model('Message') // We are retrieving this Schema from our Models, named 'Quote'

MessageSchema.path('name').required(true, 'Name cannot be blank');
MessageSchema.path('message').required(true, 'Message name cannot be blank');
// Root Request
app.get('/', function(req, res) {
  Message.find({}, function(err, messages) {
    // This is the method that finds all of the ducks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    // console.log(messages);
      res.render('index', {messagelist: messages});
    //   callback function that has an error (if any) and all of the users
    // Keep in mind that everything you want to do AFTER you get the users from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
  });    
});
// // Add User Request 
// app.post('/users', function(req, res) {
//     console.log("POST DATA", req.body);
//     // This is where we would add the user from req.body to the database.
//     res.redirect('/');
// })

app.post('/message', function(req, res) {
  console.log("POST DATA", req.body);
  // var currenttime = moment().format('MMMM Do YYYY, h:mm:ss a');
  // create a new User with the name and age corresponding to those from req.body
  var message = new Message({name: req.body.name, message: req.body.message, created_at: Date.now() });
  // Try to save that new quote to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  message.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong');
      res.redirect('/');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a message!');
      res.redirect('/');
    }
  })
})
app.post('/:id/comment', function(req, res) {
  Message.findOne( {_id: req.params.id}, function (err, message){ 
    if(err) {
      console.log('something went wrong');
      res.redirect('/');
    } else if(req.body.name.length < 4) {
      console.log('Name must be at least 4 characters long.');
      res.redirect('/');
    } else if(req.body.comment.length < 1) {
      console.log('Comment is required.');
      res.redirect('/');
    } else { // else console.log that we did well and then redirect to the root route
      message.comments.push({name: req.body.name, comment: req.body.comment} )
       message.save(function (err) {
        if (!err) console.log('successfully added a comment!');
      res.redirect("/");
      });
    }
  });
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000, project Message Board");
})