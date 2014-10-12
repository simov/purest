
# Purest [![npm-version]][npm]

_**Purest**_ is build on top of [request][request], adding just as needed configuration to ensure seamless communication with any REST API provider in a consistent and straightforward way


## Simple Usage

```js
var Purest = require('purest');
var google = new Purest({provider:'google'});

google.get('channels', {
  api:'youtube',
  qs:{
    access_token:'token',
    forUsername:'RayWilliamJohnson'
  }
}, function (err, res, body) {});
```


## Expressive API

On top of that _**Purest**_ provides a nice API to make your application code more expressive

```js
google.query('youtube')
  .select('channels')
  .where({
    forUsername:'RayWilliamJohnson'
  })
  .auth('access-token')
  .request(function (err, res, body) {});
```


## Streaming

Everything you know about [request][request] works out of the box

```js
// move a file from Box to Dropbox
box.query()
  .get('files/21838973235/content')
  .auth('token')
  .request()
  .pipe(dropbox.query('files')
    .put('files_put/auto/cat.jpg')
    .auth('token')
    .request()
    .on('end', done));
```


# [Documentation][docs]


## License

(The MIT License)

Copyright (c) 2013-2014 simov <simeonvelichkov@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


  [request]: https://github.com/mikeal/request
  [docs]: http://simov.github.io/purest/html/
  [npm]: https://www.npmjs.org/package/purest

  [npm-version]: http://img.shields.io/npm/v/purest.svg?style=flat (NPM Version)
  [npm-downloads]: http://img.shields.io/npm/dm/purest.svg?style=flat (NPM Downloads)
