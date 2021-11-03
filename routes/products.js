const express = require('express');
const router = express.Router();

// #1 require in the Product model
const {
    Product,
    Category,
    Tag
} = require('../models')
const {
    bootstrapField,
    createProductForm
} = require('../forms');

async function getProductById(productId) {
    let product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    });
    return product;
}

router.get('/', async function (req, res) {
    // the model represents the entire table
    let products = await Product.collection().fetch({
        'withRelated':['category','tags']
    });

    res.render('products/index', {
        'products': products.toJSON() // convert the results to JSON
    })
})

router.get('/add', async function (req, res) {
    const allCategories = await Category.fetchAll().map(c => [c.get('id'), c.get('name')]);
    /* example output of allCategories:
        [
            [1, "soy-based"],
            [2, "meat subsitute"],
            [3, "lactose free"],
            [4, "grain-based"]
        ]

    */
    const allTags = await Tag.fetchAll().map(t => [t.get('id'), t.get('name')]);
    const productForm = createProductForm(allCategories, allTags);
    res.render('products/add', {
        'productForm': productForm.toHTML(bootstrapField)
    })
})

router.post('/add', async function (req, res) {
    const allCategories = await Category.fetchAll().map(c => [c.get('id'), c.get('name')]);
    const allTags = await Tag.fetchAll().map(t => [t.get('id'), t.get('name')]);
    const productForm = createProductForm(allCategories, allTags);
    productForm.handle(req, {
        'empty': (form) => {
            // if the form is submitted empty, this will run
            return res.render('products/add', {
                'productForm': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            // if the form passes all validation
            // create a new product 
            // remmber: an instance of the Model
            // represents one ROW in the corresponding table
            const product = new Product();
            // product.set('name', form.data.name);
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description);
            // product.set('category_id', form.data.category_id);
            let {tags, ...productData} = form.data;
            product.set(productData);
            await product.save();

            // create the many to many relationship
            if (tags) {
                let selectedTags = tags.split(',');
                await product.tags().attach(selectedTags);
            }
            // add in a flash message to tell user that the product
            // has been created successfully
            req.flash('success_messages', 
                      `New product ${product.get('name')} has been added successfully`)
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

router.get('/:product_id/update', async function (req, res) {
    const productId = req.params.product_id;
    // when we refer to the model class directly, we are addressing the table
    // the code below is the same as : "SELECT * from products WHERE id=<product_id></product_id>"
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require': true,
        'withRelated':['tags'] // tell Bookshelf to fetch all the tags associated with the product
    });

    // get all the related tags
    const selectedTags = await product.related('tags').pluck('id');
   
    const allCategories = await Category.fetchAll().map(c => [c.get('id'), c.get('name')]);
    const allTags = await Tag.fetchAll().map(t => [t.get('id'), t.get('name')]);
    const productForm = createProductForm(allCategories, allTags);
    productForm.fields.tags.value = selectedTags;


    // set the initial value of each of the form field
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    res.render('products/update', {
        'productForm': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async function (req, res) {
    // find the product that we want to update
    let product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        'require': true,
        'withRelated':['tags']
    });

    const allCategories = await Category.fetchAll().map(c => [c.get('id'), c.get('name')]);
    const allTags = await Tag.fetchAll().map(t => [t.get('id'), t.get('name')]);
    
    const productForm = createProductForm(allCategories, allTags);
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
            let {tags, ...productData} = form.data;
            product.set(productData);
            await product.save();

            // update the relationships:
            // 1. any tags that WAS in the product but NOT selected anymore
            //    will be removed
            //
            // 2. any tags that WASN'T in the product but IS selected now
            //    will be added

            // 3. any tags that WAS in the product and is STILL selected 
            //    remain unchanged

            console.log(tags);
            let selectedTags = tags.split(',');

            // get all the tags that are already associated with the product
            let existingTagIds = await product.related('tags').pluck('id');

            // 1. remove all the existing tags that aren't selected in the form
            let toRemove = existingTagIds.filter( id => selectedTags.includes(id) === false );
            await product.tags().detach(toRemove); 

            // 2. add in all the selected tags to the form
            await product.tags().attach(selectedTags);
            
            res.redirect('/products')
        },
        'error': (form) => {
            res.render('products/update', {
                'productForm': form
            })
        }
    })
})

router.get('/:product_id/delete', async function (req, res) {
    let product = await getProductById(req.params.product_id);
    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', async function (req, res) {
    let product = await getProductById(req.params.product_id);
    await product.destroy();
    res.redirect('/products')
})
module.exports = router;