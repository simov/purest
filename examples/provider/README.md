
# Providers


## Configuration

Each example requires application and user credentials

```js
var app = require('../../config/app').twitter || {}
  , user = require('../../config/user').twitter || {}
```

In case you don't have such files

```js
var app = require('../../config/app').twitter || {
  key:'[CONSUMER_KEY]', secret:'[CONSUMER_SECRET]'}
var user = require('../../config/user').twitter || {
  token:'[ACCESS_TOKEN]', secret:'[ACCESS_SECRET]',
  appkey:'...'
}
```


## Run

```bash
$ node examples/provider/facebook.js [TEST ID]
```

Some tests may require additional parameter

```bash
$ node examples/provider/facebook.js [TEST_ID] [ITEM_ID]
```


## Debug

```bash
$ node --debug-brk examples/provider/facebook.js [TEST ID]
```
