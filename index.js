const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

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

// require our custom routers
const landingRoutes = require('./routes/landing')

async function main() {

    // first arg - the prefix
    // second arg - if it is a router
    // then the routes to use if the path
    // begins with the prefix
    app.use('/', landingRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});