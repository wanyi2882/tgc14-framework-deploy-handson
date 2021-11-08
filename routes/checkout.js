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
       'success_url': process.env.STRIPE_SUCCESS_URL,
       'cancel_url': process.env.STRIPE_CANCEL_URL,
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

// NOTE! This is called by Stripe not internally by us.
router.post('/process_payment', express.raw({type:'application/json'}), function(req,res){
    // payload is what Stripe is sending us
    let payload = req.body;

    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    // extract signature header
    let sigHeader = req.headers['stripe-signature'];

    // verify that the signature is actually from stripe
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        if (event.type ==  "checkout.session.completed") {
            let stripeSession = event.data.object;
            console.log(stripeSession);
            let metadata = JSON.parse(stripeSession.metadata.orders);
            console.log(metadata);
            res.send({
                'received': true
            })
        }
    } catch (e) {
        // handle errors
        res.send({
            'error': e.message
        })
    }
    
})

router.get('/success', function(req,res){
    res.send("Thank your order. Your order has been processed");
})

router.get('/cancel', function(req,res){
    res.send("Your order has failed or has been cancelled");
})

module.exports = router;