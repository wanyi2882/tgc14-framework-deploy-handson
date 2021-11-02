const express = require('express');
const router = express.Router();

// #1 require in the Product model
const { Product} = require('../models')
const { bootstrapField, createProductForm} = require('../forms');

async function getProductById(productId) {
    let product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    });
    return product;
}

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

router.get('/:product_id/update', async function(req,res){
    const productId = req.params.product_id;
    // when we refer to the model class directly, we are addressing the table
    // the code below is the same as : "SELECT * from products WHERE id=<product_id></product_id>"
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    });

    const productForm = createProductForm();

    // set the initial value of each of the form field
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update', {
        'productForm': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async function(req,res){
    // find the product that we want to update
    let product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        'require': true
    });

    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            /* form.data contains an object that looks like this:
                {
                    'name': "product_name",
                    'cost': 0,
                    'description':'description of product'
                }

            */
            // product.set('name', form.data.name);
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description);
            /* SQL: update products set name = .... where id =<product_id> */
            product.set(form.data);
            await product.save();
            res.redirect('/products')
        }
    })
})

router.get('/:product_id/delete', async function(req,res){
    let product = await getProductById(req.params.product_id);
    res.render('products/delete',{
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', async function(req, res){
    let product = await getProductById(req.params.product_id);
    await product.destroy();
    res.redirect('/products')
})
module.exports = router;