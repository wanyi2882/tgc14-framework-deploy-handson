'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // add a new column named 'category_id' to the 'products' table
  return db.addColumn('products', 'category_id',{
    'type':'int',
    'unsigned': true,
    'notNull':true,
    // this column s a FK to referring to the 'id' column in the 'categories' table
    'foreignKey': {
      'name':'product_category_fk',
      'table':'categories',
      'mapping':'id',
      'rules':{
        'onDelete': 'cascade',
        'onUpdate': 'restrict'
      }
    }
  })
};

exports.down = function(db) {
  return db.dropColumn('category_id')
};

exports._meta = {
  "version": 1
};
