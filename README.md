
# Purest

[![npm-version]][npm] [![travis-ci]][travis] [![coveralls-status]][coveralls] [![codecov-status]][codecov]

Purest is a generic REST API client library that can be used with *any* REST API, *any* HTTP client library, and *any* Promise implementation:

```js
var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('@purest/providers')
var google = purest({provider: 'google', config})

var req = google
  .query('youtube')
  .select('channels')
  .where({forUsername: 'CaseyNeistat'})
  .auth('[ACCESS_TOKEN]')
  .request()

req
  .catch((err) => {})
  .then((result) => {})
```

# [Documentation for Purest v3.x][docs-v3]

# [Documentation for Purest v2.x][docs-v2]

# [Migrating from Purest v2.x to v3.x][v2-to-v3]


  [npm-version]: https://img.shields.io/npm/v/purest.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/simov/purest/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/simov/purest.svg?style=flat-square (Test Coverage - Coveralls)
  [codecov-status]: https://img.shields.io/codecov/c/github/simov/purest/master.svg?style=flat-square (Test Coverage - Codecov)

  [npm]: https://www.npmjs.com/package/purest
  [travis]: https://travis-ci.org/simov/purest
  [coveralls]: https://coveralls.io/r/simov/purest?branch=master
  [codecov]: https://codecov.io/github/simov/purest?branch=master

  [docs-v3]: https://simov.gitbooks.io/purest/content/
  [docs-v2]: https://github.com/simov/purest/tree/2.x
  [v2-to-v3]: https://github.com/simov/purest/blob/master/CHANGELOG.md#v300-20160717
