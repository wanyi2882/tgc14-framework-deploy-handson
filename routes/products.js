const express = require('express');
const router = express.Router();

// #1 require in the Product model
const { Product} = require('../models')
const { bootstrapField, createProductForm} = require('../forms');

router.get('/', async function(req,res){
    // the model represents the entire table
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON() // convert the results to JSON
    })
})

router.get('/add',  function(req,res){
    const productForm = createProductForm();
    res.render('products/add',{
        'productForm': productForm.toHTML(bootstrapField)
    })
})

router.post('/add', async function(req,res){
    const productForm = createProductForm();
    productForm.handle(req, {
        'empty': (form) => {
            // if the form is submitted empty, this will run
            return res.render('products/add',{
                'productForm': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            // if the form passes all validation
            // create a new product 
            // remmber: an instance of the Model
            // represents one ROW in the corresponding table
            const product = new Product();
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save();
            res.redirect('/products');

        },
        'error': (form) => {
            // if the form has errors (i.e some fields failed validation)
            res.render('products/add', {
                'productForm': form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;