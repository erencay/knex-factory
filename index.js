const { extend, isFunction, isObject } = require('lodash');

let _knex;
const factories = { };

function knexFactory(knex) {
  _knex = knex;

  return knexFactory;
}

extend(knexFactory, {
  define(name, tableName, defaultAttributes) {
    factories[name] = { tableName, defaultAttributes };
  },

  async build(factoryName, attributes) {
    const factory = factories[factoryName];

    if (!factory) {
      throw `Unkown factory: ${factoryName}`;
    }

    const { defaultAttributes } = factory;
    const insertData = {};

    extend(insertData, defaultAttributes, attributes);

    for (let k in insertData) {
      const v = insertData[k];

      if (isFunction(v)) {
        insertData[k] = await v();
      } else {
        insertData[k] = await v;
      }

      if (isObject(insertData[k]) && insertData[k].id) {
        insertData[k] = insertData[k].id;
      }
    };

    return insertData;
  },

  async create(factoryName, attributes) {
    const factory = factories[factoryName];
    const insertData = await knexFactory.build(factoryName, attributes);
    const { tableName } = factory;

    const record = await _knex(tableName).insert(insertData).returning('*');

    return record;
  },
});

module.exports = knexFactory;
