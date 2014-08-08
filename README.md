
# purest
_**purest**_ is build on top of [request][1], adding just as needed configuration to ensure seamless communication with any REST API provider in a consistent and straightforward way

```js
var purest = require('purest');

var facebook = new purest({provider:'facebook'});

facebook.get('me', {qs:{access_token:'...'}}, function (err, res, body) {});

facebook.post('me/feed', {
  qs:{access_token:'...'},
  form:{message: 'Purest is awesome!'}
}, function (err, res, body) {});
```


### syntax
```js
[purest instance].[http method](
  'api endpoint',
  {mikeal's request params + some specific to purest},
  callback([error object], [response object], [parsed JSON body])
)
```


### providers
[bitly](http://dev.bitly.com) / [coderbits](https://coderbits.com/api) / [facebook](https://developers.facebook.com) / [foursquare](https://developer.foursquare.com/) / [github](http://developer.github.com) / [gmaps](https://developers.google.com/maps/) / [google](https://developers.google.com/) / [linkedin](http://developer.linkedin.com) / [rubygems](http://guides.rubygems.org/rubygems-org-api) / [soundcloud](http://developers.soundcloud.com) / [stackexchange](https://api.stackexchange.com) / [stocktwits](http://stocktwits.com/developers) / [twitter](https://dev.twitter.com) / [wikimapia](http://wikimapia.org/api) / [yahoo](https://developer.yahoo.com/)


## API
### constructor
```js
new purest({
  // required
  provider:'name', // see the list of supported providers below

  // OAuth1 only
  key:'app-key', // OAuth app consumer key
  secret:'app-secret', // OAuth app consumer secret

  // optional, overrides config/provider.json
  version:'2.1', // provider API version
  domain:'https://api.twitter.com', // provider API domain
  api:'youtube' // set specific api to use for providers with multiple api's under same domain
})
```


### get | post
```js
var twitter = new purest({provider:'twitter', key'..', secret:'..'});

twitter.post('statuses/update', {
  oauth:{token:'..', secret:'..'},
  form:{status:'Check out my new new!'}
}, function (err, res, body) {});
```


### syntax
```js
[purest instance].[http method](
  'api endpoint',
  {mikeal's request params + some specific to purest},
  callback([error object], [response object], [parsed JSON body])
)
```


### specific purest params
Additional to the [mikeal's request params][2], _purest_ adds a few more parameters on its own

- **secret** - _oauth `token_secret` shortcut_
  ```js
  twitter.get('users/show', {
    oauth:{token:'..', secret:'..'},
    qs:{screen_name:'nodejs'}
  }, function (err, res, body) {});
  ```

- **api** - _specific api to use for providers with multiple api's under same domain (currently used only for Google and Yahoo)_
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

- **upload** - _file name is required when uploading_
  ```js
  twitter.post('statuses/update_with_media', {
    oauth:{token:'..', secret:'..'},
    upload:'cat.png',
    form:{
      status:'My cat is awesome!',
      'media[]':fs.readFileSync('/absolute/path/to/cat.png')
    }
  }, function (err, res, body) {});

  facebook.post('me/photos', {
    upload:'cat.png',
    qs:{
      access_token:'..',
      message:'nyan nyan nyan ...'
    },
    form:{
      source:fs.readFileSync('/absolute/path/to/cat.png')
    }
  }, function (err, res, body) {});
  ```

- **token** - _user token shortcut (currently used only for Asana)_
  ```js
asana.get('users/me', {
  token:'...'
}, function (err, res, body) {});
  ```


## misc
### examples
a bunch of examples can be found [here][4]


### access tokens
get one using _**[grant][3]**_


### goals
- no syntax sugar
- zero abstraction on top of the REST APIs - reading provider's official documentation is sufficient
- all provider's API calls return data in the same way
- each request is a separate instance - _purest_ is designed to be used with multiple accounts granted access to your application, that's why most of the parameters are passed to the request itself (like for example the access token)
- easy addition of new providers


### license
MIT


  [1]: https://github.com/mikeal/request
  [2]: https://github.com/mikeal/request#requestoptions-callback
  [3]: https://github.com/simov/grant
  [4]: https://github.com/simov/purest/tree/master/examples
