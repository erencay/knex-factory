const assert = require('assert');
const { extend } = require('lodash');
const knexFactory = require('./index.js');

let _insertData;
const knexMock = function () { return knexMock };
knexMock.insert = function (insertData) {
  _insertData = insertData;
  _insertData.id = 1;
  return [1];
}

knexMock.where = function () { return knexMock.where };
knexMock.where.first = function () {
  return _insertData;
}

knexFactory(knexMock);

knexFactory.define('user', 'users', {
  username: 'johndoe',
  password() {
    return 'dynamic';
  },
});

knexFactory.define('role', 'roles', {
  type: 'admin',
  async userId() {
    return await knexFactory.create('user');
  },
});

(async function () {
  const defaultUser = await knexFactory.create('user');
  assert.equal(defaultUser.username, 'johndoe');
  assert.equal(defaultUser.password, 'dynamic');

  const customUser = await knexFactory.create('user', {
    username: 'johnsnow',
    password: 'winterfell'
  });
  assert.equal(customUser.username, 'johnsnow');
  assert.equal(customUser.password, 'winterfell');

  const role = await(knexFactory.create('role'));
  assert.equal(role.userId, 1);

  try {
    await(knexFactory.create('posts'))
  } catch(err) {
    assert.equal(err, 'Unkown factory: posts');
  }
})()
