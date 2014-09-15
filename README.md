
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
| | | | | | |
:---: | :---: | :---: | :---: | :---: | :---:
[asana](http://developer.asana.com/documentation/) | [bitly](http://dev.bitly.com) | [coderbits](https://coderbits.com/api) | [dropbox](https://www.dropbox.com/developers) | [facebook](https://developers.facebook.com) | [flickr](https://www.flickr.com/services/api/)
[foursquare](https://developer.foursquare.com/) | [github](http://developer.github.com) | [gmaps](https://developers.google.com/maps/) | [google](https://developers.google.com/) | [heroku](https://devcenter.heroku.com/categories/platform-api) | [instagram](http://instagram.com/developer)
[linkedin](http://developer.linkedin.com) | [mailchimp](http://apidocs.mailchimp.com/) | [mailgun](http://documentation.mailgun.com/) | [mandrill](https://mandrillapp.com/api/docs/) | [openstreetmap](http://wiki.openstreetmap.org/wiki/API_v0.6) | [rubygems](http://guides.rubygems.org/rubygems-org-api)
[sendgrid](http://sendgrid.com/docs/) | [slack](https://api.slack.com/) | [soundcloud](http://developers.soundcloud.com) | [stackexchange](https://api.stackexchange.com) | [stocktwits](http://stocktwits.com/developers) | [trello](https://trello.com/docs/)
[twitter](https://dev.twitter.com) | [wikimapia](http://wikimapia.org/api) | [yahoo](https://developer.yahoo.com/)

##### google
| | | | | | |
:---: | :---: | :---: | :---: | :---: | :---:
[plus](https://developers.google.com/+/api) | [youtube](https://developers.google.com/youtube/v3) | [drive](https://developers.google.com/drive/v2/reference) | [freebase](https://developers.google.com/freebase/v1) | [tasks](https://developers.google.com/google-apps/tasks/) | [urlshortener](https://developers.google.com/url-shortener/)
[pagespeedonline](https://developers.google.com/speed/docs/insights/v1/getting_started) | [youtube/analytics](https://developers.google.com/youtube/analytics) | [contacts](https://developers.google.com/google-apps/contacts/v3/)


##### yahoo
| | | |
:---: | :---: | :---:
[social](https://developer.yahoo.com/social) | [yql](https://developer.yahoo.com/yql) | [geo](https://developer.yahoo.com/geo/geoplanet)


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


#### oauth:secret
- Shortcut for `oauth:token_secret`
  ```js
  twitter.get('users/show', {
    oauth:{token:'..', secret:'..'},
    qs:{screen_name:'nodejs'}
  }, function (err, res, body) {});
  ```

#### api
- _Google|Yahoo only_ - Specific API to use for providers with multiple API's under the same domain
  ```js
  google.get('channels', {
    api:'youtube',
    qs:{
      access_token:'..',
      part:'id, snippet, contentDetails, statistics, status, topicDetails',
      forUsername:'RayWilliamJohnson'
    }
  }, function (err, res, body) {});
  ```

  ```js
  yahoo.get('yql', {
    api:'yql',
    oauth:{token:'..', secret:'..'},
    qs:{q:'SELECT * FROM social.profile WHERE guid=me'}
  }, function (err, res, body) {});
  ```


#### upload

- The `upload` key is required for _multipart encoded_ requests
- Everything inside the `form` key will be transferred as _multipart/form-data_ instead of a querystring

  ```js
  twitter.post('statuses/update_with_media', {
    oauth:{token:'..', secret:'..'},
    upload:'cat.png',
    form:{
      status:'My cat is awesome!',
      'media[]':fs.readFileSync('/absolute/path/to/cat.png')
    }
  }, function (err, res, body) {});
  ```

- It's possible to encode only part of the request's data as _multipart/form-data_ _(that purely depends on the provider you use)_
  ```js
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

- Some providers allow encoding of multiple values for a given key inside the multipart encoded body _(in this example we're sending an email with two attachments to two different recipients at the same time)_
  ```js
  sendgrid.post('mail.send', {
    upload:['cat.png','beep.mp3'],
    form:{
      api_user:'..',
      api_key:'..',
      from:'purest@mailinator.com',
      to:['purest@mailinator.com','purest2@mailinator.com'],
      subject:'Purest is awesome!',
      html:'<h1>Purest is awesome!</h1>',
      text:'True idd!',
      files: [
        fs.readFileSync('/absolute/path/to/cat.png'),
        fs.readFileSync('/absolute/path/to/beep.mp3')
      ]
    }
  }, function (err, res, body) {});
  ```

- _[see the rest of the upload examples][5]_


#### dc
- _Mailchimp only_ - set **d**ata **c**enter name (required when using access token)
  
  ```js
  mailchimp.get('campaigns/list', {
    dc:'us2',
    qs:{apikey:'access_token'}
  }, function (err, res, body) {});
  ```
- First obtain and store the user's data center name
  
  ```js
  purest.request('https://login.mailchimp.com/oauth2/metadata', {
    headers: {'Authorization': 'OAuth '+'access_token'},
    json: true
  }, function (err, res, body) {
    // body.dc - data center name
  });
  ```


## misc
### examples
a bunch of examples can be found [here][4] also take a look at the [tests][6]


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
  [5]: https://github.com/simov/purest/blob/master/test/request/upload.js
  [6]: https://github.com/simov/purest/tree/master/test/request
