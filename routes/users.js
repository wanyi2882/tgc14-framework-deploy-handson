const express = require('express');
const { createSignupForm, bootstrapField, createLoginForm } = require('../forms');
const { User } = require('../models');
const router = express.Router();
const crypto = require('crypto');
const { checkIfAuthenticated} = require('../middlewares');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/register', (req,res)=>{
    const signUpForm = createSignupForm();
    res.render('users/register',{
        signUpForm: signUpForm.toHTML(bootstrapField)
    })
});

router.post('/register', (req,res)=>{
    const signUpForm = createSignupForm();
    signUpForm.handle(req,{
        'error': (form) => {
            res.render('users/register',{
                signUpForm: form.toHTML(bootstrapField)
            })
        },
        'success': async(form) => {
            let user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email
            });
            await user.save();
            req.flash('success_messages', "You have been signed up successfully");
            res.redirect('/users/login');
        }
    })
})

router.get('/login', (req,res)=>{
    const loginForm = createLoginForm();
    res.render('users/login',{
        'loginForm': loginForm.toHTML(bootstrapField)
    });
})

router.post('/login', (req,res)=>{
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        'error': (form)=> {
            res.render('users/login',{
                'loginForm': form
            })
        },
        'success': async(form) => {
            // retrieve user by the given email in the form
            let user = await User.where({
                'email': form.data.email
            }).fetch({
                'require': false
            })

            // if that user exists, then we check the password matches
            if (user) {
                if (user.get('password') == getHashedPassword(form.data.password)) {
                    // login
                    req.session.user = {
                        'id': user.get('id'),
                        'email': user.get('email'),
                        'username': user.get('username')
                    }
                    req.flash('success_messages', "Welcome back " + user.get('username'));
                    res.redirect('/users/profile');

                } else {
                    req.flash('error_messages', 'Login failed')
                    res.redirect('/users/login')
                }
            } else {
                req.flash('error_messages', 'Login failed')
                res.redirect('/users/login');
            }
        }
    })
})

router.get('/profile', [checkIfAuthenticated], (req,res)=>{
   
        res.render('users/profile',{
            'user': req.session.user
        })
   

})

router.get('/logout', [checkIfAuthenticated], (req,res)=>{
    req.session.user = null;
    req.flash('success_messages', "Logged out successfully");
    res.redirect('/users/login');
});

module.exports = router;