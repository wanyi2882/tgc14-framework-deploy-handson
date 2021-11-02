const bookshelf = require('../bookshelf');

// create a model
// a model is a class that represents one
// table in our database
// first arg: name of the model
// second arg: settings in the form of an object
const Product = bookshelf.model('Product',{
    'tableName': 'products'
});

module.exports = { Product };