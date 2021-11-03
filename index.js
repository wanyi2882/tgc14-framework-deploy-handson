const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// for sessions and flash messages
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// custom middleware goes here
app.use(function(req,res,next){
  res.locals.date = new Date();
  next();
})

// setup sessions
app.use(session({
  'store': new FileStore(),
  'secret': 'qz6tamEGgnjrRPqC8BgYP5FORLWKu9K4',
  'resave': false, 
  'saveUninitialized': true
}))

// setup our flash messages
app.use(flash());

// middleware to extact out the flash messages from
// the session and make it available to all hbs files
app.use(function(req,res,next){
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})

// require our custom routers
const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/users')
async function main() {

    // first arg - the prefix
    // second arg - if it is a router
    // then the routes to use if the path
    // begins with the prefix
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});