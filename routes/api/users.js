const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const generateToken = (user, secretKey, expiry) => {
    return jwt.sign({
        'username': user.username,
        'id': user.id,
        'email': user.email
    }, secretKey, {
        'expiresIn': expiry // 1000ms = 1000 milliseconds, 1h = 1 hour, 3d = 3 days, 4m = 4 minutes, 1y = 1 year
    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User, BlacklistedToken } = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');

router.post('/login', async function(req,res){
    // get the user by the email address
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        'require': false
    })

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, '1h');
        let refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '3w');
        res.json({
            accessToken, // same as "accessToken": accessToken
            refreshToken
        })
    } else{
        res.json({
            'error':"Wrong email or password"
        })
    }
})

router.get('/profile', checkIfAuthenticatedJWT, function(req,res){
    res.json({
        'user': req.user
    })
})

router.post('/refresh', async function(req,res){
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err,user)=>{
        if (err) {
            res.sendStatus(403);
        } else {

            // check if the token has been blacklisted
            let blacklistedToken = await BlacklistedToken.where({
                'token': refreshToken
            }).fetch({
                'require': false
            })

            if (blacklistedToken) {
                res.status(401);
                res.send({
                    'error':'This token has been expired'
                })
            } else {
                let accessToken = generateToken(user, process.env.TOKEN_SECRET, '1h');
                res.json({
                    accessToken
                })
            }
        }
    })
})

router.post('/logout', async function(req,res){
    let refreshToken = req.body.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        console.log("Got refresh token");
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err,user)=>{
            console.log(err);
            if (err) {
                res.sendStatus(403)
            } else {
                console.log("valid refresh token");
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date());
                await token.save();
                res.json({
                    'message':"Logged out"
                })
            }
        })
    }
});

module.exports = router;