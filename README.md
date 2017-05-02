# knex-factory

### Install
`npm i -D knex-factory`

## Usage

Import package with knex:

```
const knex = require('knex');

knex({ ... });

require('knex-factory')(knex);
```

### factory.define(factoryName, tableName, validParams);
When you define factories, you can use `functions` to generate dynamic data or return a promise;



Define a user factory:

```
const factory = require('knex-factory');

factory.define('user', 'users', {
  level: 'member',
  username: 'testUser',
  dynamicField() {
    return new Date();
  },
});
```

Define an avatar factory with user:
```
const factory = require('knex-factory');

factory.define('avatar', 'avatars', {
  async userId() {
    return await factory.create('user');
  },
  fileName: 'file.jpg',
  path: 'file.jpg',
});

...
```

Use in your tests:
```
...
const user = await create('user', { level: 'admin' });

expect(user.level).to.eq('admin');

...

const avatar = await create('avatar', {
  userId: currentUser.id,
  fileName: 'no_avatar.jpg',
});
...
```
