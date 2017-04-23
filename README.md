# knex-factory

### Install
`npm i -S knex-factory`

## Usage

Import package with knex:

```
const knex = require('knex');

knex({
  ...
});

const factory = require('knex-factory')(knex);
```

Define factories with default params:

```
factory.define('user', 'users', {
  level: 'member',
  username: () => faker.internet.userName(),
  email: () => faker.internet.email(),
  hashedPassword: 'hashed-password-01234-abcdef',
  nickname: () => faker.internet.userName(),
  birthday: () => faker.date.past(),
  accountStatus: 'approved',
});

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
const currentUser = await create('user', { level: 'admin' });
const avatar = await create('avatar', {
  userId: currentUser.id,
  fileName: 'no_avatar.jpg',
});
...
```
