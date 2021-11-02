// knex is underlying technology
// that powers Bookshelf
const knex = require('knex')({
    'client': 'mysql',
    'connection': {
        'user': 'foo',
        'password': 'bar',
        'database': 'organic'
    }
});

// create the bookshelf
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;