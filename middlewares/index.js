const jwt = require('jsonwebtoken');

const checkIfAuthenticated = (req, res, next) => {

    if (req.session.user) {
        next();
    } else {
        req.flash('error_messages', 'You need to sign in to access this page');
        res.redirect('/users/login');
    }
}

const checkIfAuthenticatedJWT = (req,res,next) => {
    // try to get authorization headers
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // the authHeader will be a string that is like
        // "Bearer <ACCESS_TOKEN>"
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err,user)=>{
            if (err) {
                res.sendStatus(403);
            } else {
                // store the current logged in user inside req.user
                req.user = user;
                next();
            }
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { checkIfAuthenticated, checkIfAuthenticatedJWT};