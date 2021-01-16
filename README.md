
# Purest

[![npm-version]][npm] [![travis-ci]][travis]

> _REST API Client Library_

```js
var purest = require('purest')
var google = purest({provider: 'google'})

;(async () => {
  var {res, body} = await google
    .query('youtube')
    .select('channels')
    .where({forUsername: 'PewDiePie'})
    .auth('[ACCESS_TOKEN]')
    .request()
})()
```


## Table of Contents

> _This is documentation for Purest **v4**, for older releases take a look at [v3] and [v2]_

- **Configuration**
  - [Constructor](#configuration-constructor) / [Options](#configuration-options) / [Methods](#configuration-methods) / [Providers](#configuration-providers)
- **Examples**
- **[Changelog][changelog]**

---

## Configuration: Constructor

```js
var google = purest({config: {}, provider: 'google', defaults: {}, methods: {}})
```

Key | Type | Description
:-| :-: | :-
**`config`** | `{}` | Provider configuration to use instead of the built-in one
**`provider`** | `''` | Provider name to initialize from the list of providers inside the `config`
**`defaults`** | `{}` | Any supported configuration option, see below
**`methods`** | `{}` | List of methods and their aliases to use with this instance

---

## Configuration: Options

Key | Type | Description
:-| :-: | :-
***HTTP Verbs*** |
**`get`** |
**`head`** |
**`post`** |
**`put`** |
**`patch`** |
**`options`** |
**`delete`** |
**`trace`** |
**`connect`** |
***Request Options*** |
**`method`** |
**`headers`** |
**`timeout`** |
**`agent`** |
**`url`** |
**`proxy`** |
**`qs`** |
**`form`** |
**`json`** |
**`body`** |
**`multipart`** |
**`auth`** |
**`oauth`** |
**`encoding`** |
**`redirect`** |
**`request`** |
**`buffer`** |
**`stream`** |
***URL Options*** |
**`domain`** |
**`path`** |
**`subdomain`** |
**`version`** |
**`type`** |
***Config Options*** |
**`endpoint`** |
**`auth`** |

---

## Configuration: Methods

All of the above options are also available as methods attached to every Purest instance.

You can define your own method aliases:

```js
var google = purest({provider: 'google', methods: {
  get: ['fetch'],
  post: ['update', 'set']
}})
google.fetch('...').request()
google.update('...').request()
```

Take a look at the [methods.json][] file.

---

## Configuration: Providers

```json
{
  "github": {
    "default": {
      "domain": "https://api.github.com",
      "path": "{path}",
      "headers": {
        "authorization": "Bearer $auth",
        "user-agent": "purest"
      }
    },
    "oauth": {
      "domain": "https://github.com",
      "path": "login/oauth/access_{path}"
    }
  }
}
```

```js
var github = purest({provider: 'github'})
// get user profile
await github
  .get('users/simov')
  .request()
// refresh token
await github
  .query('oauth')
  .post('token')
  .request()
```

---

  [npm-version]: https://img.shields.io/npm/v/purest.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/simov/purest/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/simov/purest.svg?style=flat-square (Test Coverage - Coveralls)
  [codecov-status]: https://img.shields.io/codecov/c/github/simov/purest/master.svg?style=flat-square (Test Coverage - Codecov)

  [npm]: https://www.npmjs.com/package/purest
  [travis]: https://travis-ci.org/simov/purest
  [coveralls]: https://coveralls.io/r/simov/purest?branch=master
  [codecov]: https://codecov.io/github/simov/purest?branch=master

  [v3]: https://github.com/simov/purest/tree/3.x
  [v2]: https://github.com/simov/purest/tree/2.x

  [methods.json]: https://github.com/simov/purest/blob/master/config/methods.json
