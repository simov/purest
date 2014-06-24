
# purest
_**purest**_ is build on top of [request][1], adding just as needed configuration to ensure seamless communication with each REST API provider in a consistent and user friendly way

```js
var purest = require('purest');

var facebook = new purest({provider:'facebook'});

facebook.get('me', {qs:{access_token:'...'}}, function (err, res, body) { });

facebook.post('me/feed', {
  qs:{access_token:'...'},
  form:{message: 'Purest is awesome!'}
},
function (err, res, body) { });
```


## constructor
```js
new purest({
  // required
  provider:'name', // see the list of supported providers below

  // OAuth 1 only
  consumerKey:'app-key', // OAuth app consumer key
  consumerSecret:'app-secret', // // OAuth app consumer secret

  // optional, overrides config/provider.json
  version:'2.1', // provider API version
  domain:'https://api.twitter.com', // provider API domain
  api:'youtube' // set specific api to use for providers with multiple api's under same domain
})
```


## get | post
```js
var twitter = new purest({provider:'twitter', consumerKey'..', consumerSecret:'..'});

twitter.post('statuses/update', {
  oauth:{token:'..', secret:'..'},
  form:{status:'Loot!'}
},
function (err, res, body) { });
```

### syntax
```js
[purest instance].[http method](
  'api endpoint',
  [mikeal's request params + some specific to purest],
  callback([error object], [response object], [parsed JSON body])
)
```
### additional request params
Additional to the [mikeal's request params][2], _purest_ adds a few more parameters on its own

#### secret
> oauth:{token:'', secret:'same as token_secret'}

```js
t.twitter.get('users/show', {
  oauth:{token:'..', secret:'..'},
  qs:{screen_name:'nodejs'}
}, function (err, res, body) {});
```

#### api
> currently used only for Google and Yahoo<br />
specific api to use for providers with multiple api's under same domain

```js
google.get('channels', {
  api:'youtube',
  qs:{
    access_token:'..',
    part:'id, snippet, contentDetails, statistics, status, topicDetails',
    forUsername:'RayWilliamJohnson'
  }
}, function (err, res, body) {});

yahoo.get('yql', {
  api:'query',
  oauth:{token:'..', secret:'..'},
  qs:{q:'SELECT * FROM social.profile WHERE guid=me'}
}, function (err, res, body) {});
```

#### upload
> file name is required when uploading

```js
twitter.post('statuses/update_with_media', {
  oauth:{token:'..', secret:'..'},
  upload:'cat.png',
  form:{
    status:'My cat is awesome!',
    'media[]':fs.readFileSync('/absolute/path/to/cat.png')
  }
},
function (err, res, body) {});

facebook.post('me/photos', {
  upload:'cat.png',
  qs:{
    access_token:'..',
    message:'nyan nyan nyan ...'
  },
  form:{
    source:fs.readFileSync('/absolute/path/to/cat.png')
  }
},
function (err, res, body) {});
```

## providers
[generate the list here]


## examples
...

## goals
- no syntax sugar
- zero abstraction on top of the REST APIs - reading provider's official documentation is sufficient
- all provider's API calls return data in the same way
- each request is a separate instance - purest is designed to be used with multiple accounts granted access to your application, that's why most of the parameters are passed to the request itself, like for example the access tokens


## license
MIT


  [1]: https://github.com/mikeal/request
  [2]: https://github.com/mikeal/request#requestoptions-callback
  