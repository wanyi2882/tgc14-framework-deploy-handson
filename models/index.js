const bookshelf = require('../bookshelf');

// create a model
// a model is a class that represents one
// table in our database
// first arg: name of the model
// second arg: settings in the form of an object
const Product = bookshelf.model('Product',{
    'tableName': 'products',
    // the function name must match the lower-case form of the model's name
    category() {
        return this.belongsTo('Category')
    }
});

const Category = bookshelf.model('Category',{
    tableName:'categories',
    // the name must be the plural form of the model's name in lower case
    products() {
        return this.hasMany('Product');
    }
})

module.exports = { Product, Category };