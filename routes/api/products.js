const express = require('express');
const router = express.Router();

const productDataLayer = require('../../dal/products');
const { createProductForm } = require('../../forms');
const { Product } = require('../../models');

router.get('/', async function(req,res){
    let products = await productDataLayer.getAllProducts();
    res.json({
        products,
        // 'products':products
    })
})

router.post('/add', async function(req,res){
    const allCategories = await productDataLayer.getAllCategories();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allTags);
    productForm.handle(req, {
        'empty': function(form){
            res.json({
                'message':'No data detected'
            })
        },
        'success': async function(form) {
            let { tags, ...productData} = form.data;
            const product = new Product(productData);
            await product.save();

            // if there are selected tags
            if (tags) {
                let selectedTags = tags.split(',');
                await product.tags().attach(selectedTags);
            }

            res.json(product.toJSON());
        },
        'error': function(form) {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            }
            res.json(errors);
        }
    })
})

module.exports = router;