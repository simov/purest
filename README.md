
# Purest

[![npm-version]][npm] [![test-ci-img]][test-ci-url] [![test-cov-img]][test-cov-url] [![snyk-vulnerabilities]][snyk]

> _REST API Client Library_

```js
var purest = require('purest')
var google = purest({provider: 'google'})

await google
  .query('youtube')
  .select('channels')
  .where({forUsername: 'GitHub'})
  .auth(token)
  .request()
```

## Table of Contents

> _This is Purest **v4**, for older releases take a look at [v3] and [v2]_

- **[Introduction](#introduction)**
- **[Purest Options](#purest-options)**
- **[Request Options](#request-options)**
- **[Examples](#examples)**
- **[Article]**

---

## Introduction

> _**Purest** is a tool for building **expressive** REST API clients_

### Default Endpoint

Here is a basic configuration for Google:

```json
{
  "google": {
    "default": {
      "origin": "https://www.googleapis.com",
      "path": "{path}",
      "headers": {
        "authorization": "Bearer {auth}"
      }
    }
  }
}
```

Our configuration can be used to instantiate that provider:

```js
var google = purest({provider: 'google', config})
```

Finally we can request some data from YouTube:

```js
var {res, body} = await google
  .get('youtube/v3/channels')
  .qs({forUsername: 'GitHub'})
  .auth(token)
  .request()
```

### Explicit Endpoint

We can define explicit endpoint for accessing the YouTube API:

```json
{
  "google": {
    "default": {
      "origin": "https://www.googleapis.com",
      "path": "{path}",
      "headers": {
        "authorization": "Bearer {auth}"
      }
    },
    "youtube": {
      "origin": "https://www.googleapis.com",
      "path": "youtube/{version}/{path}",
      "version": "v3",
      "headers": {
        "authorization": "Bearer {auth}"
      }
    }
  }
}
```

And then request the same data:

```js
var {res, body} = await google('youtube')
  .get('channels')
  .qs({forUsername: 'GitHub'})
  .auth(token)
  .request()
```

### Defaults

Every method in Purest can also be preconfigured with a static value:

```js
var google = purest({provider: 'google', config,
  defaults: {auth: token}
})
```

Then we no longer need to set the access token on every request:

```js
var {res, body} = await google('youtube')
  .get('channels')
  .qs({forUsername: 'GitHub'})
  .request()
```

### Method Aliases

But what if we want to make our API more expressive? What if we want to make it our own:

```js
var google = purest({provider: 'google', config,
  defaults: {auth: token},
  methods: {get: ['select'], qs: ['where']}
})
```

Yes we can:

```js
var {res, body} = await google('youtube')
  .select('channels')
  .where({forUsername: 'GitHub'})
  .request()
```

---

## Purest Options

> _**Purest** is a flexible tool for **abstracting** out REST APIs_

```js
var google = purest({config: {}, provider: 'google', defaults: {}, methods: {}})
```

| Key            | Type | Description
| :-             | :-:  | :-
| **`provider`** | `''` | Provider name to initialize from the list of providers found in `config`
| **`config`**   | `{}` | Providers configuration to use
| **`defaults`** | `{}` | Any supported configuration option set by default, see below
| **`methods`**  | `{}` | List of methods and their aliases to use with this instance

---

## Request Options

> _**Purest** is built on top of a **[powerful HTTP Client][request-compose]**_

### URL Options

| Option      | Description
| :-          | :-
| `origin`    | The protocol and domain part of the URL, can contain `{subdomain}` token
| `path`      | The path part of the URL, can contain `{version}`, `{path}` and `{type}` tokens
| `subdomain` | Subdomain part of the URL to replace in `origin`
| `version`   | Version string to replace in `path`
| `type`      | Type string to replace in `path`, typically `json` or `xml`

### HTTP Methods

All HTTP methods `get` `head` `post` `put` `patch` `options` `delete` `trace` `connect` accept a string to replace the `{path}` configuration token with, or absolute URL to replace the entire `url`.

### Request Options

| Option     | Type                  | Description
| :--        | :--                   | :--
| `method`   | `'string'` | Request method, implicitly set if one of the above HTTP Methods is used
| `url`      | `'string'` [`url object`][url-parse] | Absolute URL, automatically constructed if the URL Options above are being used, or absolute URL is passed to any of the HTTP Methods above
| `proxy`    | `'string'` [`url object`][url-parse] | Proxy URL; for HTTPS you have to use [tunneling][tunnel-agent] [agent][proxy-agent] instead
| `qs`       | `{object}` `'string'` | URL querystring
| `headers`  | `{object}` | Request headers
| `form`     | `{object}` `'string'` | `application/x-www-form-urlencoded` request body
| `json`     | `{object}` `'string'` | JSON encoded request body
| `multipart`| `{object}` `[array]`  | `multipart/form-data` as object or `multipart/related` as array request body using [request-multipart]
| `body`     | `'string'` [`Buffer`][buffer] [`Stream`][stream-readable] | Raw request body
| `auth`     | `'string'` `['string', 'string']` `{user, pass}`        | String or array of strings to replace the `{auth}` configuration token with, or Basic authorization as object
| `oauth`    | `{object}` | OAuth 1.0a authorization using [request-oauth]
| `encoding` | [`'string'`][buffer-encoding] | Response body encoding
| `redirect` | `{object}` | HTTP redirect [configuration][redirect-config]
| `timeout`  | `number` | Request timeout in milliseconds
| `agent`    | [`Agent`][agent] | HTTP agent

### Response Options

`request`
  - buffers the response body
  - decompresses `gzip` and `deflate` encoded bodies with valid `content-encoding` header
  - converts the response body to string using `utf8` encoding by default
  - tries to parse `JSON` and `querystring` encoded bodies with valid `content-type` header

Returns either String or Object.

`buffer`
  - buffers the response body
  - decompresses `gzip` and `deflate` encoded bodies with valid `content-encoding` header

Returns [Buffer][buffer].

`stream`

Returns the response [Stream][stream-incoming-message].

### Node Core Options

Any other HTTP request option not explicitly exposed in Purest can be set using any of the response methods:

```js
await google.request({socketPath: ''})
await google.buffer({socketPath: ''})
await google.stream({socketPath: ''})
```

### Endpoint

The explicit `endpoint` configuration can be accessed in various ways:

```js
// as argument to the Purest instance
await google('youtube')
// using the option name
await google.endpoint('youtube')
// or the default method alias defined for it
await google.query('youtube')
```

---

## Examples

> _**Purest** comes with a **[fancy logger][request-logs]**_

```bash
npm i --save-dev request-logs
```

```bash
DEBUG=req,res,body,json node examples/file-name.js 'example name'
```

| Category | Topics | Providers | Examples
| :-       | :-     | :-        | :-
| **OAuth 2.0** | _Refresh Access Tokens_ | `box` `google` `twitch` | [Refresh access tokens][refresh-token]
| **OpenID Connect** | *Verify id_token* | `auth0` `google` `microsoft` | [Discover public keys and verify id_token signature][openid-connect]
| **OAuth 1.0a** | _OAuth 1.0a_ | `flickr` `trello` `twitter` | [Get user profile][oauth-1]
| **Storage** | _Multipart, Streams_ | `box` `dropbox` `drive` | [Upload files][file-stream]
| **Storage** | _HTTP Streams_ | `box` `dropbox` | [Stream file from DropBox to Box][http-stream]

> _Get access tokens using **[Grant]**_


  [npm-version]: https://img.shields.io/npm/v/purest.svg?style=flat-square (NPM Version)
  [test-ci-img]: https://img.shields.io/travis/simov/purest/master.svg?style=flat-square (Build Status)
  [test-cov-img]: https://img.shields.io/coveralls/simov/purest.svg?style=flat-square (Test Coverage)
  [snyk-vulnerabilities]: https://img.shields.io/snyk/vulnerabilities/npm/purest.svg?style=flat-square (Vulnerabilities)

  [npm]: https://www.npmjs.com/package/purest
  [test-ci-url]: https://github.com/simov/purest/actions/workflows/test.yml
  [test-cov-url]: https://coveralls.io/r/simov/purest?branch=master
  [snyk]: https://snyk.io/test/npm/purest

  [v3]: https://github.com/simov/purest/tree/3.x
  [v2]: https://github.com/simov/purest/tree/2.x
  [article]: https://dev.to/simov/purest-53k0

  [request-compose]: https://github.com/simov/request-compose
  [request-oauth]: https://github.com/simov/request-oauth
  [request-multipart]: https://github.com/simov/request-multipart
  [request-cookie]: https://github.com/simov/request-cookie
  [request-logs]: https://github.com/simov/request-logs

  [grant]: https://github.com/simov/grant
  [redirect-config]: https://github.com/simov/request-compose#redirect
  [tunnel-agent]: https://github.com/simov/request-compose/blob/master/examples/misc-tunnel-agent.js
  [proxy-agent]: https://github.com/simov/request-compose/blob/master/examples/misc-proxy-agent.js
  [methods.json]: https://github.com/simov/purest/blob/master/config/methods.json

  [refresh-token]: https://github.com/simov/purest/blob/master/examples/refresh-token.js
  [openid-connect]: https://github.com/simov/purest/blob/master/examples/openid-connect.js
  [oauth-1]: https://github.com/simov/purest/blob/master/examples/oauth-1.js
  [file-stream]: https://github.com/simov/purest/blob/master/examples/file-stream.js
  [http-stream]: https://github.com/simov/purest/blob/master/examples/http-stream.js

  [url-parse]: https://nodejs.org/dist/latest-v10.x/docs/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
  [buffer]: https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html
  [buffer-encoding]: https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_buffers_and_character_encodings
  [stream-readable]: https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_readable
  [stream-incoming-message]: https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage
  [agent]: https://nodejs.org/docs/latest-v10.x/api/http.html#http_class_http_agent
