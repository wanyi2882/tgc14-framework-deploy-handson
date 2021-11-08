const express = require('express');
const router = express.Router();

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const cartServices = require('../services/cart')

router.get('/', async function(req,res){

    // 1. create line items from the user's shopping cart
    let cartItems = await cartServices.getShoppingCart(req.session.user.id);
    let allLineItems = [];
    let metadata = [];
    for (let item of cartItems) {
        const lineItem = {
            'name': item.related('product').get('name'),
            // amount is in cents
            'amount': item.related('product').get('cost'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'            
        }
        if (item.related('product').get('image')) {
            lineItem['images'] = [ item.related('product').get('image_url')]
        }
        allLineItems.push(lineItem);

        // add to the metadata an object that remembers for a given product id
        // how many was ordered
        metadata.push({
            'product_id': item.related('product').get('id'),
            'quantity': item.get('quantity')
        })
    }

    // 2. create a stripe payment session (session id that will be sent to the user)

    // .. convert the metadata array to a JSON string (requirement of Stripe)
   let metadataJSON = JSON.stringify(metadata);

   let payment = {
       'payment_method_types': ['card'],
       'line_items':  allLineItems,
       'success_url': 'https://www.google.com',
       'cancel_url': 'https://www.yahoo.com',
       'metadata': {
           'orders': metadataJSON
       }
   }

    // 3. register the session with stripe
    let stripeSession = await Stripe.checkout.sessions.create(payment);
   
    // 4. send back to the browser the id of the session
    res.render('checkout/checkout', {
        'sessionId' : stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

module.exports = router;