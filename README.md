
# Purest

[![npm-version]][npm] [![travis-ci]][travis] [![coveralls-status]][coveralls]

Purest is a thin wrapper around the [request][request] module, adding [expressive API][query-api] and [configuration data structure][provider-configuration] to ensure seamless communication with **any** REST API provider in a consistent and straightforward way


```js
var Purest = require('purest')
  , google = new Purest({provider:'google'})

google.query('youtube')
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```


## Table of Contents

- API
  - **[Basics][basics]**
  - [Basic API][basic-api]
  - [Constructor][constructor]
  - [Query API][query-api]
  - [Streaming][streaming]
- Configuration
  - [Provider Configuration][provider-configuration]
  - [Create Custom Provider][create-custom-provider]
  - [Extend Existing Provider][extend-existing-provider]
- Misc
  - [OAuth][oauth]
  - [Multipart Uploads][multipart-uploads]
  - [Specific Purest Options][specific-purest-options]
  - [Providers][purest-providers]


## Basics

```js
var Purest = require('purest')
var google = new Purest({provider:'google'})

google.get('channels', {
  api:'youtube',
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```

In this example we are requesting the [channels][youtube-channels] endpoint of the YouTube API. Here is how the related portion of the Google's configuration in [config/providers.json][purest-config] looks like:

```js
"google": {
  "__provider": {
    "oauth2": true,
    "token_url": "https://accounts.google.com/o/oauth2/token"
  },
  "https://www.googleapis.com": {
    "__domain": {
      "auth": {
        "auth": {"bearer": "[0]"}
      }
    },
    "{endpoint}": {
      "__path": {
        "alias": "__default"
      }
    },
    "youtube/[version]/{endpoint}": {
      "__path": {
        "alias": ["youtube"],
        "version": "v3"
      }
    }
  }
}
```

> Refer to the [provider configuration][provider-configuration] section for a full list of all available configuration options

Using the above configuration Purest knows how to construct the absolute URL `https://www.googleapis.com/youtube/v3/channels` for the [channels][youtube-channels] endpoint.

Given the above configuration you can use the so called `__default` path as well:

```js
google.get('youtube/v3/channels', {...}, function (err, res, body) {})
```

Or even the absolute URL:

```js
google.get('https://www.googleapis.com/youtube/v3/channels', {..}, function (..) {})
```

> The underlying request module is accessible as well:
```js
var Purest = require('purest')
Purest.request(...)
```

You can create a separate instance specifically for making requests to the YouTube API:

```js
var youtube = new Purest({provider:'google', api:'youtube'})

youtube.get('channels', {
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```

Notice that specifying the `api:'youtube'` for each request is no longer required.

You can use the more expressive [query API][query-api] as well:

```js
youtube.query()
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```

If you're going to make authenticated requests on behalf of a single user only, you can use the [request's defaults][request-defaults] to set the access token to use for each request made through that instance:

```js
var youtube = new Purest({provider:'google', api:'youtube',
  defaults:{auth:{bearer:'[ACCESS_TOKEN]'}}})
// then just
youtube.query()
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .request(function (err, res, body) {})
```


## Basic API

The basic API resembles the one found in the [request][request-simple] module:

```
[purest instance].[http method](
  'endpoint',
  {mikeal's request options + some specific to purest},
  callback([error object], [response object], [parsed JSON body])
)
```

The first argument is always the endpoint outlined in your provider's official documentation. That's the `{endpoint}` part of the path in the [provider configuration][provider-configuration].

The second argument is the [request's options][request-options] that you normally pass to the request module. There are [few options specific to Purest][specific-purest-options] as well.

The third argument is the [request's callback][request-simple] function. These are the callback arguments (pasted from the request's docs):

> 1. An `error` when applicable (usually from [`http.ClientRequest`](http://nodejs.org/api/http.html#http_class_http_clientrequest) object)
2. An [`http.IncomingMessage`](http://nodejs.org/api/http.html#http_http_incomingmessage) object
3. The third is the `response` body (`String` or `Buffer`, or JSON object if the `json` option is supplied)

Purest sets `json:true` for all of your requests by default, so `body` is always a JSON object.


## Constructor

```js
new Purest({
  // REQUIRED:
  provider:'name', // see the list of supported providers

  // OPTIONAL: (OAuth 1.0 only)
  // set consumer key and secret to be used by this instance
  // (alternatively you can set them for each request
  // or through the defaults option below)
  key:'[CONSUMER_KEY]',
  secret:'[CONSUMER_SECRET]',

  // OPTIONAL:
  // set specific API/alias to use by default for all requests from this instance
  api:'youtube'

  // OPTIONAL:
  // set any request options to be added by default
  // for each request made through this instance
  // (this uses the request.defaults() method internally)
  defaults:{...}

  // OPTIONAL:
  // extend the providers config with your own provider configuration
  // or extend existing one (refer to the provider configuration section)
  config:require('./path/to/custom/config.json'),

  // OPTIONAL:
  // enable the request-debug module
  debug:true
})
```


## Query API

Purest provides a nice API to make your application code more expressive:

```js
var Purest = require('purest')
var google = new Purest({provider:'google'})

google.query('youtube')
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```


### Start

```js
// use the __default path configuration
.query()
// specify (API/alias) path configuration to use
.query('youtube')
```


### HTTP verb

```js
// GET request
.get('endpoint')
.select('endpoint')
// POST request
.post('endpoint')
.update('endpoint')
// PUT request
.put('endpoint')
.create('endpoint')
.insert('endpoint')
// DELETE request
.del('endpoint')
// PATCH request
.patch('endpoint')
// HEAD request
.head('endpoint')
```


### Request Options

```js
// querystring
.qs({options})
.where({options})
// application/x-www-form-urlencoded
.form({options})
.set({options})
// multipart/form-data
.formData({options})
.upload({options})
// multipart/related
.multipart([options])
.upload([options])
// HTTP headers
.headers({options})
// json
.json({options})
// body
.body({options})
// any other request options
.options({options})
```

Any other [request option][request-options] not listed here, can be set through the `.options({})` method.


### Authentication

If properly configured Purest knows exactly how to pass your credentials to the underlying request, therefore the `auth` method accepts just values:

```js
.auth('..')
// or
.auth('..', '..')
```

For example that may be `.auth('user','pass')`, `.auth('bearerToken')`, `.auth('token','secret')`, `.auth('apikey')`, `.auth('anything', 'else')`.

Refer to the [config/providers.json][purest-config] file to see how various providers are configured.


### Request

Finally initiate the request:

```js
.request(function (err, res, body) {})

```

This method returns the underlying [request][request] object, so [streaming][streaming] works as usual. The callback is the same you'll find in [request][request-simple]. The only difference is that Purest passes `json:true` by default, so you don't need to, and therefore `body` is always a parsed JSON object.


## Streaming

Purest always returns a [request][request] object, so [streaming][request-streaming] works as usual:

```js
var Purest = require('purest')
var box = new Purest({provider:'box'})
  , dropbox = new Purest({provider:'dropbox'})

// move a file from Box to Dropbox
box.query()
  .get('files/21838973235/content')
  .auth('[ACCESS_TOKEN]')
  .request()
  .pipe(dropbox.query('files')
    .put('files_put/auto/cat.jpg')
    .auth('[ACCESS_TOKEN]')
    .request()
    .on('end', function () {}))
```

Using [event-stream][event-stream] to process each line of data as it arrives:

```js
var es = require('event-stream')
var Purest = require('purest')
var mailchimp = new Purest({provider:'mailchimp'})

// export Mailchimp contacts
mailchimp.query('export')
  .select('list')
  .where({id:'bd0b216f1c'})
  .auth('[API_KEY]')
  .request()
  .pipe(es.split())
  .pipe(es.map(function (contact, done) {
    // process each contact as it arrives
    done()
  }))
```


## Provider Configuration

This is how Facebook is currently configured in [config/providers.json][purest-config]:

```js
"facebook": {
  "__provider": {
    "oauth2": true
  },
  "https://graph.facebook.com": {
    "__domain": {
      "auth": {
        "auth": {"bearer": "[0]"}
      }
    },
    "{endpoint}": {
      "__path": {
        "alias": "__default"
      }
    }
  }
}
```

That's about the bare minimum configuration you want to have for a provider. However some providers require different set of options, plus you may want to configure request options for a specific endpoint.


```js
{
  // provider name
  "facebook": {
    // REQUIRED: meta data about this provider
    "__provider": {
      // OPTIONAL: indicates that this provider is using OAuth1
      "oauth": true,
      // OPTIONAL: indicates that this provider is using OAuth2
      "oauth2": true
    },
    // REQUIRED: at least one domain is required
    "https://graph.facebook.com": {
      // REQUIRED: meta data about this domain
      "__domain": {
        // OPTIONAL:
        // specify authentication scheme to use for this domain
        // Example: facebook.query().auth('the-token')
        "auth": {
          // Example: (one of the following)
          "auth": {"bearer": "[0]"} // OAuth2 header
          "headers": {"Authorize": "[0]"} // custom header
          "qs": {"access_token": "[0]"} // querystring
          "qs": {"api_key": "[0]", "api_secret": "[1]"} // querystring
          "auth": {"user": "[0]", "pass": "[1]"} // basic auth
          "oauth": {"token": "[0]", "secret": "[1]"} // OAuth1.0
          "qs": {"client_id": "[0]"}, "headers": {"Authorization": "OAuth [1]"}//combo
        }
        // alternatively you can specify up to 2 different auth schemes for a domain
        // (index is argument count based)
        // Example: facebook.query().auth('the-token') // will pick the first scheme
        // Example: facebook.query().auth('user', 'pass') // will pick the second
        "auth": [
          {"auth": {"bearer": "[0]"}},
          {"auth": {"user": "[0]", "pass": "[1]"}}
        ]
      },
      // REQUIRED: at least one path is required
      "api/[version]/{endpoint}.[type]": {
        // REQUIRED: meta data about this path
        "__path": {
          // REQUIRED:
          // each provider should have at least one path with a __default alias in it
          // Example: facebook.get('some/endpoint') // no need for {api:'some-name'}
          // Example: facebook.query().get('abc') // no need for api name in query()
          "alias": "__default"
          // any other path in this provider should specify alias name/s to use
          // Example: google.get('channels', {api:'youtube'})
          // Example: google.query('tube').get('channels')
          "alias": ["youtube", "tube"],

          // OPTIONAL: only required when the path have a [version] embedded in it
          "version": "v3",

          // OPTIONAL: specify auth scheme to use for this path only
          // (overrides the one specified for the domain)
          "auth": {"bearer": "[0]"}
        },

        // OPTIONAL: set request options per endpoint in this path

        // match all endpoints in this path
        // Example: any endpoint in this path, using any HTTP verb will have
        // the "x-li-format": "json" header set (unless you override it in the request)
        "*": {
          // match all HTTP verbs
          "all": {
            // any valid request option
            "headers": {"x-li-format": "json"}
          }
        },

        // exact matching endpoint
        // Example: given the path and domain set above, this will match
        // https://graph.facebook.com/api/v3/documents.json
        "documents": {
          // meta data about this endpoint
          "__endpoint": {
            // OPTIONAL: specify auth scheme to use for this endpoint only
            // (overrides the one specified for the path and for the domain)
            "auth": {"bearer": "[0]"}
          },
          // match only GET requests
          "get": {
            // this option will be added for each request to this endpoint
            "encoding": null
          }
        },

        // match regex endpoint - notice the double \\ escape
        // Example: given the path and domain set above, this will match
        // https://graph.facebook.com/api/v3/files/[NUMBER-ID]/content.json
        "files\\/\\d+\\/content": {
          "__endpoint": {
            // REQUIRED: for regex endpoints
            "regex": true
          },
          // match only POST requests
          "post": {
            // you can override these options when you are making the request
            "form": {"json": true}
          },
          // more HTTP verbs
        }
        // more endpoints
      },
      // more paths
    },
    // more domains
  },
  // more providers
}
```

Take a look at how various providers are configured in [config/providers.json][purest-config] and the [providers list][purest-providers].


## Create Custom Provider

Using the above configuration data structure you can create your own provider configuration:

```js
{
  "my-private-provider": {
    // ... use the above data structure
  }
}
```

And pass it to the Purest's constructor:

```js
var myapi = new Purest({
  provider:'my-private-provider',
  config:require('./my-config.json')
})
```


## Extend Existing Provider

You can even extend or override existing provider. For example if we have the following configuration for Google:

```js
"google": {
  "__provider": {
    "oauth2": true,
    "token_url": "https://accounts.google.com/o/oauth2/token"
  },
  "https://www.googleapis.com": {
    "__domain": {
      "auth": {
        "auth": {"bearer": "[0]"}
      }
    },
    "{endpoint}": {
      "__path": {
        "alias": "__default"
      }
    }
  }
}
```

This is how we can extend the `https://www.googleapis.com` domain with two more paths:

```js
"google": {
  "https://www.googleapis.com": {
    "youtube/[version]/{endpoint}": {
      "__path": {
        "alias": ["youtube"],
        "version": "v3"
      }
    },
    "drive/[version]/{endpoint}": {
      "__path": {
        "alias": ["drive"],
        "version": "v2"
      }
    }
  }
}
```

Notice that some of the meta keys are missing. In case you don't want to change anything in these meta keys (and they are already defined) you can ommit them.

Then pass your extend configuration to the Purest's constructor:

```js
var myapi = new Purest({provider:'google', config:require('./google-config.json')})
```


## OAuth

You can configure Purest to make your code more expressive for using various OAuth grant types. For example this is how the configuration for [acton][acton-oauth] looks like:

```js
"acton": {
  "__provider": {
    "oauth2": true
  },
  "https://restapi.actonsoftware.com": {
    "__domain": {
      "auth": {
        "auth": {"bearer": "[0]"}
      }
    },
    "api/[version]/{endpoint}": {
      "__path": {
        "alias": "__default",
        "version": "1"
      }
    },
    "{endpoint}": {
      "__path": {
        "alias": ["oauth"]
      }
    }
  }
}
```

### [Client Credentials Grant][grant-client-credentials]

```js
acton.query('oauth')
  .update('token')
  .set({
    grant_type:'client_credentials',
    client_id:'[APP_ID]',
    client_secret:'[APP_SECRET]'
  })
  .request(function (err, res, body) {})
```

### [Resource Owner Password Credentials Grant][grant-password]

```js
acton.query('oauth')
  .update('token')
  .set({
    grant_type:'password',
    username:'[USERNAME]',
    password:'[PASSWORD]',
    client_id:'[APP_ID]',
    client_secret:'[APP_SECRET]'
  })
  .request(function (err, res, body) {})
```

### [Refresh Token][grant-refresh]

```js
acton.query('oauth')
  .update('token')
  .set({
    grant_type:'refresh_token',
    refresh_token:'[REFRESH_TOKEN]',
    client_id:'[APP_ID]',
    client_secret:'[APP_SECRET]'
  })
  .request(function (err, res, body) {})
```

Alternatively you can send the app credentials via basic auth:

```js
"acton": {
  "https://restapi.actonsoftware.com": {
    "{endpoint}": {
      "__path": {
        "alias": ["oauth"],
        "auth": {"auth":{"user": "[0]", "pass": "[1]"}}
      }
    }
  }
}
```

```js
acton.query('oauth')
  .update('token')
  .set({grant_type:'client_credentials'})
  .auth('[APP_ID]', '[APP_SECRET]')
  .request(function (err, res, body) {})
```

### [Consumer Requests to Update Access Token - OAuth1][refresh-oauth1]

```js
yahoo.query('oauth')
  .update('token')
  .options({
    oauth: {
      consumer_key:'...',
      consumer_secret:'...',
      token:'...',
      token_secret:'...',
      session_handle:'...'
    }
  })
  .request(function (err, res, body) {})
```

Take a look at how OAuth token paths are configured for various providers in [config/providers.json][purest-config].


### [Authorization Code Grant][grant-authorization-code]

This grant type is implemented by **_[Grant][grant]_** which is OAuth middleware for Express, Koa and Hapi. Alternatively you can use the [OAuth Playground][grant-oauth] for testing.


## Multipart Uploads

Multipart uploads works out of the box, just like in [request][request-multipart]:

### multipart/form-data

```js
facebook.post('me/photos', {
  auth:{bearer:'[ACCESS_TOKEN]'},
  formData:{
    message:'My cat is awesome!',
    source:fs.createReadStream('cat.png')
  }
},
function (err, res, body) {})
```

```js
facebook.query()
  .update('me/photos')
  .upload({
    message:'My cat is awesome!',
    source:fs.createReadStream('cat.png')
  })
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```


### multipart/related

```js
google.post('files', {
  api:'upload-drive',
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{uploadType:'multipart'},
  multipart: [
    {
      'Content-Type':'application/json',
      body:JSON.stringify({title:'cat.png'})
    },
    {
      'Content-Type':'image/png',
      body:fs.createReadStream('cat.png')
    }
  ]
},
function (err, res, body) {})
```

```js
google.query('upload-drive')
  .update('files')
  .where({uploadType:'multipart'})
  .upload([
    {
      'Content-Type':'application/json',
      body:JSON.stringify({title:'cat.png'})
    },
    {
      'Content-Type':'image/png',
      body:fs.createReadStream('cat.png')
    }
  ])
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```


## Specific Purest Options

Additional to the [request's options][request-options], Purest adds a few more options on its own:


### api

Specific API path to use for providers with multiple paths configuration:

```js
google.get('channels', {
  api:'youtube',
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```


### version

Override the API `[version]` embedded into the path configuration (if present).

For example here are the relevant bits of the Twitter's configuration in [config/providers.json][purest-config]:

```js
"twitter": {
  "https://api.twitter.com": {
    "[version]/{endpoint}.[type]": {
      "__path": {
        "alias": "__default",
        "version": "1.1"
      }
    }
  }
}
```

Given the above configuration, all requests will default to version `1.1` embedded into the absolute URL `https://api.twitter.com/1.1/users/show.json`:

```js
twitter.get('users/show', function (err, res, body) {})
```

We can change that using the `version` option:

```js
twitter.get('users/show', {version:'1.0'}, function (err, res, body) {})
```

Resulting in `https://api.twitter.com/1.0/users/show.json` absolute URL.


### type

Again, using the above configuration for Twitter, we can change the `[type]` variable embedded into the path. If present `[type]` always defaults to `json`.

To override that pass the `type` option with the appropriate value:

```js
twitter.get('users/show', {type:'xml'}, function (err, res, body) {})
```

Resulting in `https://api.twitter.com/1.1/users/show.xml` absolute URL.


### domain

Some domain configurations have a `[domain]` variable embedded into them. For example see the configuration for Salesforce, Mailchimp, Paypal and Harvest in [config/providers.json][purest-config].

```js
// make request to https://us2.api.mailchimp.com
mailchimp.get('campaigns/list', {
  domain:'us2',
  qs:{apikey:'access_token'}
}, function (err, res, body) {})
```

> Mailchimp's data center name can be obtained like this

```js
mailchimp.get('https://login.mailchimp.com/oauth2/metadata', {
  headers: {'Authorization': 'OAuth '+'[ACCESS_TOKEN]'}
}, function (err, res, body) {
  // body.dc - contains the data center name
})
```


### oauth:secret

Shortcut for `oauth:token_secret`

```js
twitter.get('users/show', {
  oauth:{token:'..', secret:'..'},
  qs:{screen_name:'nodejs'}
}, function (err, res, body) {})
```


## License

MIT


  [npm-version]: http://img.shields.io/npm/v/purest.svg?style=flat-square (NPM Version)
  [travis-ci]: https://img.shields.io/travis/simov/purest/master.svg?style=flat-square (Build Status)
  [coveralls-status]: https://img.shields.io/coveralls/simov/purest.svg?style=flat-square (Test Coverage)
  [npm]: https://www.npmjs.org/package/purest
  [travis]: https://travis-ci.org/simov/purest
  [coveralls]: https://coveralls.io/r/simov/purest?branch=master

  [basics]: #basics
  [basic-api]: #basic-api
  [constructor]: #constructor
  [query-api]: #query-api
  [streaming]: #streaming
  [provider-configuration]: #provider-configuration
  [create-custom-provider]: #create-custom-provider
  [extend-existing-provider]: #extend-existing-provider
  [oauth]: #oauth
  [multipart-uploads]: #multipart-uploads
  [specific-purest-options]: #specific-purest-options

  [purest-config]: https://github.com/simov/purest/blob/master/config/providers.json
  [purest-providers]: https://github.com/simov/purest/wiki/Providers

  [request]: https://github.com/request/request
  [request-options]: https://github.com/request/request#requestoptions-callback
  [request-simple]: https://github.com/request/request#super-simple-to-use
  [request-defaults]: https://github.com/request/request#requestdefaultsoptions
  [request-streaming]: https://github.com/request/request#streaming
  [request-multipart]: https://github.com/request/request#multipartform-data-multipart-form-uploads

  [grant]: https://github.com/simov/grant
  [grant-oauth]: https://grant-oauth.herokuapp.com

  [youtube-channels]: https://developers.google.com/youtube/v3/docs/channels/list
  [event-stream]: https://github.com/dominictarr/event-stream

  [acton-oauth]: https://developer.act-on.com/documentation/oauth/
  [grant-authorization-code]: https://tools.ietf.org/html/rfc6749#section-4.1
  [grant-password]: https://tools.ietf.org/html/rfc6749#section-4.3
  [grant-client-credentials]: https://tools.ietf.org/html/rfc6749#section-4.4
  [grant-refresh]: https://tools.ietf.org/html/rfc6749#section-6
  [refresh-oauth1]: http://oauth.googlecode.com/svn/spec/ext/session/1.0/drafts/1/spec.html#update_access_token
