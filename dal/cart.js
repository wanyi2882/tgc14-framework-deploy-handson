const { CartItem } = require('../models');

async function getShoppingCartForUser(userId) {
    return await CartItem.collection().where({
        'user_id': userId
    }).fetch(
        {
            require:false,
            withRelated:['product', 'product.category']
        }
    );
}

async function createCartItem(userId, productId, quantity) {
    // Model: represents the entire table
    // instance of a model: represents one row in the table
    let cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'quantity': quantity
    });

    await cartItem.save();
    return cartItem;
}

async function getCartItemByUserAndProduct(userId, productId) {
    return await CartItem.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        'require': false
    })
}

async function updateQuantity(userId, productId, newQuantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    cartItem.set('quantity', newQuantity);
    await cartItem.save();
}

module.exports = {createCartItem, getCartItemByUserAndProduct, updateQuantity, getShoppingCartForUser};