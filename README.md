# knex-factory

### Install
`npm i -D knex-factory`

## Initialize

Require the package with knex

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

### factory.build(factoryName, customData)
Build method will not save record's itself but associations.

```
const avatar = await build('avatar', { fileName: 'no_avatar.jpg' });

expect(avatar.id).to.be(null);
expect(avatar.userId).not.to.be(null);
```


### factory.create(factoryName, customData)
Works like build method expect it will also create a persisted record of the factory instance.
```
const user = await create('user', { level: 'admin' });

expect(user.id).not.to.eq(null);
expect(user.level).to.eq('admin');
```
