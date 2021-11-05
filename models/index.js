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
    },
    tags(){
        return this.belongsToMany('Tag');
    }
});

const Category = bookshelf.model('Category',{
    tableName:'categories',
    // the name must be the plural form of the model's name in lower case
    products() {
        return this.hasMany('Product');
    }
})

const Tag = bookshelf.model('Tag', {
    'tableName':'tags',
    products() {
        return this.belongsToMany('Product')
    }
})

const User = bookshelf.model('User', {
    'tableName': 'users'
})

const CartItem = bookshelf.model('CartItem',{
    'tableName': 'cart_items',
    product() {
        return this.belongsTo('Product');
    }
})

module.exports = { Product, Category, Tag, User, CartItem };