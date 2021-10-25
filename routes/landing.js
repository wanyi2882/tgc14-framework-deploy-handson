const express = require('express');

// create a new router object
const router = express.Router(); // Router() will return a new
                                 // router object

// A router object can contain routes

router.get('/', (req,res)=>{
    res.render('landing/welcome')
})

router.get('/about-us', (req,res)=>{
    res.render('landing/about-us')
})

router.get('/contact-us', (req,res)=>{
    res.render('landing/contact-us')
})
// export out the router object so that other js files can use
// it
module.exports = router;