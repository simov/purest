
# Purest

[![npm-version]][npm] [![travis-ci]][travis] [![coveralls-status]][coveralls] [![codecov-status]][codecov]

Purest is a thin wrapper around the [request][request] module, adding [expressive API][query-api] and extensive [configuration data structure][provider-configuration] to ensure seamless communication with **any** REST API provider in a consistent and straightforward way:


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

- [**Quick Start**][quick-start]
- **API**
  - [Constructor][constructor]
  - [Basic API][basic-api]
  - [Query API][query-api]
- **Configuration**
  - [Provider Configuration][provider-configuration] - *[Domain][domain] / [Auth][auth] / [Path][path] / [Alias][alias] / [Endpoint][endpoint] / [Match All][match-all]*
  - [URL Modifiers][url-modifiers]
  - [Create New Provider][create-new-provider]
  - [Extend Existing Provider][extend-existing-provider]
  - [Before Request Hooks][before-request-hooks]
  - [Query Method Aliases][query-method-aliases]
- **Misc**
  - [Streaming][streaming]
  - [OAuth][oauth]
  - [Multipart Uploads][multipart-uploads]
  - [Specific Purest Options][specific-purest-options]
  - [Providers][purest-providers]


## Quick Start

```js
var Purest = require('purest')
var google = new Purest({provider:'google'})

google.get('channels', {
  api:'youtube',
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```

In this example we are requesting the [channels][youtube-channels] endpoint of the `YouTube` API. Here is how the related portion of the Google's configuration in [config/providers.json][purest-config] looks like:

```js
"google": {
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
        "alias": "youtube",
        "version": "v3"
      }
    }
  }
}
```

Using the above configuration Purest knows how to construct the absolute URL `https://www.googleapis.com/youtube/v3/channels` for the [channels][youtube-channels] endpoint.

Given the above configuration you can use the so called `__default` path as well:

```js
google.get('youtube/v3/channels', {
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```

> Notice that when using the `__default` path, specifying a path alias through the `api` key is no longer needed.

Or even the absolute URL:

```js
google.get('https://www.googleapis.com/youtube/v3/channels', {
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```

> The underlying request module is accessible as well:
```js
var Purest = require('purest')
Purest.request(...)
```

You can create a separate instance specifically for making requests to the `YouTube` API:

```js
var youtube = new Purest({provider:'google', api:'youtube'})

youtube.get('channels', {
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```

Notice that specifying `api:'youtube'` for each request is no longer required.

You can use a more expressive [query API][query-api] as well:

```js
var google = new Purest({provider:'google'})
google.query('youtube')
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
// OR
var youtube = new Purest({provider:'google', api:'youtube'})
youtube.query()
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```

If you're going to make authenticated requests on behalf of a single user, you can use the [request's defaults][request-defaults] to set the access token to use for each request made through that instance:

```js
var youtube = new Purest({
  provider:'google', api:'youtube',
  defaults:{auth:{bearer:'[ACCESS_TOKEN]'}}
})
// then just
youtube.query()
  .select('channels')
  .where({forUsername:'RayWilliamJohnson'})
  .request(function (err, res, body) {})
```


## Constructor

The Purest's constructor accepts a couple of options, with only the **provider** option being required:

```js
var provider = new Purest({provider:'google'})
```

###### Provider

- **provider** - name of the provider from the [list of supported providers][purest-config] or any other name (in case of custom provider)

###### OAuth 1.0

- **key** - `consumer_key` to use for all requests
- **secret** - `consumer_secret` to use for all requests

> These keys are just convenience shortcuts, as it's often required to make all of the requests through a single OAuth app, and specifying these values for each request can be irritating.<br><br>
Both `key` and `secret` can be overridden for each request. Alternatively these values can be set throught the `defaults` option as well:<br>
`{oauth:{consumer_key:'..', consumer_secret:'..'}}`.

###### Path Alias (API)

- **api** - set specific *API/alias* path to use for all requests

> The `api` key can be overridden for each request.

###### URL Modifiers

- **subdomain** - set default value to replace the `[subdomain]` URL token with
- **subpath** - set default value to replace the `[subpath]` URL token with
- **version** - set default value to replace the `[version]` URL token with
- **type** - set default value to replace the `[type]` URL token with

> All of these keys can be overridden per request as well. Take a look at the [URL Modifiers][url-modifiers] section for more details.

###### Configuration

- **defaults** - [request.defaults][request-defaults] object. Pass any valid [request option][request-options] here.
- **config** - configuration object containing valid [provider configuration][provider-configuration]. Use this option to define custom providers or extend existing ones.

> See the [Create New Provider][create-new-provider] and the [Extend Existing Provider][extend-existing-provider] sections.

- **before** - object containing before request hooks

> See the [Before Request Hooks][before-request-hooks] section for more details.

- **methods** - define your own method [aliases][query-method-aliases] to use with the [Query API][query-api].

> See the [Query Method Aliases][query-method-aliases] section for more details

- **debug** - set to `true` to enable the [request-debug][request-debug] module.


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

There are a few method aliases pre-defined for you in [config/query.json][config-query]:

```js
{
  "verbs": {
    "get"      : ["select", "read"],
    "post"     : ["update", "send", "submit"],
    "put"      : ["create", "insert", "write"],
    ...
  },
  "options": {
    "qs"       : ["where"],
    "form"     : ["set"],
    "formData" : ["upload"],
    "headers"  : [],
    ...
    "options"  : []
  },
  "custom": {
    "auth"     : [],
    "request"  : []
  }
}
```

The actual methods are on the left and their aliases are to the right. You can [**define your own**][query-method-aliases] method aliases and use them instead.

The `verbs` key contains all HTTP verbs. `options` contains methods used to pass any [valid option][request-options] to the underlying request.

> The `.options()` method from this section can be used to pass any valid option to the underlying request, even if you don't have a query method for it.

Lastly the `custom` section contains methods specific to Purest.


### Query and Request

Each query starts with the `.query()` method and ends with the `.request()` method:

```js
// var google = new Purest({provider:'google'})
google
  .query()
  // ... other query methods
  .request()
```

Using the `.query()` method without parameters results in using the `__default` path from that provider's configuration.

To use a specific *API/alias* path from that provider, you can pass the alias name to the `.query()` method:

```js
// var google = new Purest({provider:'google'})
google
  .query('youtube')
  // ... other query methods
  .request()
```

Alternatively the *API/alias* name can be passed using the `api` key and the generic `.options()` method of the Query API:

```js
// var google = new Purest({provider:'google'})
google
  .query()
  .options({api:'youtube'})
  // ... other query methods
  .request()
```

> The `.request([callback])` method returns the underlying [request][request-simple] object, so [streaming][streaming] works as usual. The callback is the same you'll find in request.

Additionally Purest passes `json:true` by default to each request, so the response `body` is always a parsed JSON object:

```js
// var google = new Purest({provider:'google'})
google
  .query()
  // .options({json:true}) // not needed
  .request(function (err, res, body) {
    // body is a parsed JSON object
  })
```


### Authentication

The `.auth()` method is used to abstract out some of the parameters that you have to pass to each request:

```js
// var google = new Purest({provider:'google'})
google.query()
  .auth('[ACCESS_TOKEN]')
  .request()
```

And this is how the related portion of the Google's configuration looks like:

```js
"google": {
  "https://www.googleapis.com": {
    "__domain": {
      "auth": {
        "auth": {"bearer": "[0]"}
      }
    }
  }
}
```

Alternatively you can use:

```js
// var google = new Purest({provider:'google'})
google.query()
  .auth({bearer:'[ACCESS_TOKEN]'})
  .request()
// OR
google.query()
  .options({auth:{bearer:'[ACCESS_TOKEN]'}})
  .request()
```

> Notice that if you pass an object to the `.auth({})` method, Purest sets the regular `auth` option found in [request][request].

Take a look at the [Auth][auth] section of the [Provider Configuration][provider-configuration] chapter on how to configure the `.auth()` method.

Alternatively you can search for `"auth"` in [config/providers.json][purest-config] to see how various auth schemes are configured.


## Provider Configuration

This is how Facebook is configured in [config/providers.json][purest-config]:

```js
"facebook": {
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

That's about the bare minimum configuration you want to have for a provider.

With this configuration you can request the user's profile like this:

```js
// var facebook = new Purest({provider:'facebook'})
facebook.query()
  .get('me')
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```

This will result in requesting the `https://graph.facebook.com/me` endpoint. Purest will also send the `Authorization: Bearer [ACCESS_TOKEN]` header for you.


### Domain

Each provider configuration should contain at least one domain in it:

```js
"google": {
  "https://www.googleapis.com": {...},
  "https://maps.googleapis.com": {...},
  "https://www.google.com": {...},
  "https://accounts.google.com": {...}
}
```

Each domain can have a `__domain` meta key, containing specific options for that domain:

```js
"https://graph.facebook.com": {
  "__domain": {
    "auth": {
      "auth": {"bearer": "[0]"}
    }
  }
}
```

In this case we're specifying an authentication scheme to use with the `.auth()` method of the [Query API][query-api].


### Auth

The `auth` key can be placed inside `__domain`, `__path` or `__endpoint` meta key. Each inner `auth` config overrides the outer one.


The `auth` key is designed to be used only with the `.auth()` method of the [Query API][query-api]. It can contain any [request option][request-options] used for authentication:

```js
// Example: (one of the following)
"auth": {
  // OAuth1.0
  "oauth": {"token": "[0]", "secret": "[1]"}
  // OAuth2 header
  "auth": {"bearer": "[0]"}
  // basic auth
  "auth": {"user": "[0]", "pass": "[1]"}
  // custom header
  "headers": {"Authorize": "X-Shopify-Access-Token [0]"}
  // querystring
  "qs": {"access_token": "[0]"}
  // querystring
  "qs": {"api_key": "[0]", "api_secret": "[1]"}
  // combination of querystring + header
  "qs": {"client_id": "[0]"}, "headers": {"Authorization": "OAuth [1]"}
}
```

Having such configuration you can pass just the string values to the `.auth()` method:

```js
// var facebook = new Purest({provider:'facebook'})
facebook.query()
  .get('me')
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```

Alternatively the `auth` key can be an array of authentication schemes to use:

```js
"auth": [
  {"auth": {"bearer": "[0]"}},
  {"auth": {"user": "[0]", "pass": "[1]"}}
]
```

With this configuration Purest will pick the authentication scheme based on the count of the parameters you are passing to the `auth` method:

```js
// will use OAuth2 Bearer header
facebook.query().auth('[ACCESS_TOKEN]')
// will use Basic authentication
facebook.query().auth('[USER]', '[PASS]')
```


### Path

Each domain can have multiple paths in it:

```js
"google": {
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
    "plus/[version]/{endpoint}": {
      "__path": {
        "alias": "plus",
        "version": "v1"
      }
    },
    "youtube/[version]/{endpoint}": {
      "__path": {
        "alias": "youtube",
        "version": "v3"
      }
    }
  }
}
```

With the above configuration you can use the path aliases defined for the `Google+` and the `YouTube` API to remove the clutter:

```js
// var google = new Purest({provider:'google'})
google.query('youtube')
  .get('channels')
  .qs({mine:true})
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```

This will result in requesting the `https://www.googleapis.com/youtube/v3/channels` endpoint from the `YouTube` API.

In the same way you can request the `https://www.googleapis.com/plus/v1/people/me` endpoint from the `Google+` API:

```js
google.query('plus')
  .select('people/me')
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```

> All available options for the `__path` key, can be found in the [Path Modifiers][path-modifiers] section.

### Alias

Each path should have a `__path` meta key in it containing an `alias` to use to access that path *(otherwise it won't be accessible)*:

```js
"google": {
  "https://www.googleapis.com": {
    "plus/[version]/{endpoint}": {
      "__path": {
        "alias": "plus",
        "version": "v1"
      }
    }
  }
}
```

Using the above configuration you can access the `Google+` API in various ways:

```js
// Example: (one of the following)
// Set it for the entire provider instance
var google = new Purest({provider:'google', api:'plus'})
// Use it with the Basic API
google.get('people/me', {api:'plus'}, function (err, res, body) {})
// Use it with the Query API
google.query('plus').get('people/me').request(function (err, res, body) {})
// or
google.query().get('people/me').options({api:'plus'}).request(function(err,res,body){})
```

Alternatively the `alias` configuration can contain an array of names:

```js
"google": {
  "https://www.googleapis.com": {
    "drive/[version]/{endpoint}": {
      "__path": {
        "alias": ["drive", "storage"],
        "version": "v2"
      }
    }
  }
}
```

With this configuration you can use either one of the specified aliases:

```js
google.query('drive')
  .get('about')
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
// same as
google.query('storage')
  .get('about')
  .auth('[ACCESS_TOKEN]')
  .request(function (err, res, body) {})
```


### Endpoint

Each path can have multiple endpoints defined in it. They are used to set specific options per endpoint:

```js
"live": {
  "https://apis.live.net": {
    "__domain": {
      "auth": {
        "auth": {"bearer": "[0]"}
      }
    },
    "[version]/{endpoint}": {
      "__path": {
        "alias": "__default",
        "version": "v5.0"
      },
      "me/picture": {
        "get": {
          "encoding": null
        }
      },
      ".*\\/skydrive\\/files\\/.*": {
        "__endpoint": {
          "regex": true
        },
        "put": {
          "headers": {
            "Content-Type": "application/json"
          }
        }
      }
    }
  }
}
```

With the above configuration each `GET` request made to the `me/picture` endpoint will have the `encoding:null` [request option][request-options] set:

```js
// var live = new Purest({provider:'live'})
live.query()
  .get('me/picture')
  // no longer needed to set this option explicitly
  .options({encoding:null})
  .request(function (err, res, body) {})
```

> The `encoding:null` option is required when you expect binary response body, such as image.

Additionally, with the above configuration, each `PUT` request made to the `[USER_ID]/skydrive/files/[FILE_NAME]` endpoint will have its `Content-Type: application/json` header set.

The difference here is that this a `regex` endpoint, that should be defined as such:

```js
".*\\/skydrive\\/files\\/.*": {
  "__endpoint": {
    "regex": true
  }
}
```

Omitting the `regex:true` key will result in a regular *string* endpoint.

> Notice the double escape used in the regex string:<br>
`.*\\/skydrive\\/files\\/.*`


### Match All

There is one special endpoint that can be used to match all endpoints:

```js
"*": {
  "get": {
    "headers": {"x-li-format": "json"}
  }
}
```

This will result in all `GET` requests made to any of the endpoints in that path having the `x-li-format: json` header set.

There is one specific HTTP verb that can be used to match all request types as well:

```js
"*": {
  "all": {
    "headers": {"x-li-format": "json"}
  }
}
```

This will result in having the `x-li-format: json` header being set **always**.


## URL Modifiers

Purest supports a few tokens that you can embed into your provider's domains and paths.


### Domain Modifiers

There is only one domain modifier that you can use - `[subdomain]`:

```js
"mailchimp": {
  "https://[subdomain].api.mailchimp.com": {...}
},
"salesforce": {
  "https://[subdomain].salesforce.com": {...}
}
```

The `subdomain` value is usually a user specific data that needs to be added to the domain dynamically.

You have a couple of options to set this value:

```js
// Set it directly in the config
"salesforce": {
  "https://[subdomain].salesforce.com": {
    "__domain": {
      "subdomain": "us2"
    }
  }
}

// Set it in the constructor
var salesforce = new Purest({provider:'salesforce', subdomain:'us2'})

// Set it on each request
salesforce.get('me', {subdomain:'us2'}, function (err, res, body) {})
// or
salesforce.query()
  .get('me')
  .options({subdomain:'us2'})
  .request(function (err, res, body) {})
```


### Path Modifiers

The path modifiers are tokens that you can embed into the path when defining it in the configuration:

```js
"basecamp": {
  "https://basecamp.com": {
    "[subpath]/api/[version]/{endpoint}.[type]": {
      "__path": {
        "alias": "__default",
        "version": "v1"
      }
    }
  }
}
```

Having the above configuration we can request the `https://basecamp.com/123/api/v1/people/me.json` endpoint like this:

```js
// var basecamp = new Purest({provider:'basecamp'})
basecamp.query()
  .select('people/me')
  .options({subpath:'[USER_ID]'})
  .request(function (err, res, body) {})
```

- `[subpath]` arbitrary string replaced in your path
- `[version]` contains the version string
- `[type]` defaults to `json`
- `{endpoint}` the endpoint you are requesting. *Notice the {}*

You can set either one of this *path modifiers* in various ways *(except the `{endpoint}`)*:

```js
// Set it directly in the config
"basecamp": {
  "https://basecamp.com": {
    "[subpath]/api/[version]/{endpoint}.[type]": {
      "__path": {
        "alias": "__default",
        "subpath": "some default value",
        "version": "v1",
        "type": "xml"
      }
    }
  }
}

// Set it in the constructor
var basecamp = new Purest({provider:'basecamp',
  subpath:'123', version:'v1.1', type:'xml'})

// Set it on each request
basecamp.get('me', {
  subpath:'123', version:'v1.1', type:'xml'
}, function (err, res, body) {})
// or
basecamp.query()
  .get('me')
  .options({subpath:'456', version:'v1.2', type:'xml'})
  .request(function (err, res, body) {})
```


## Create New Provider

You can create your own provider configuration and add it to the available providers through the `config` option of the Purest's constructor:

```js
var awesome = new Purest({
  provider:'awesome',
  config:{
    "awesome":{
      "https://api.awesome.com":{
        "__domain":{
          "auth":{
            "auth":{"bearer": "[0]"}
          }
        },
        "[version]/{endpoint}.[type]":{
          "alias": "__default",
          "version": "1"
        }
      }
    }
  }
})
```

> All available provider configuration options can be found in the [Provider Configuration][provider-configuration] section.


## Extend Existing Provider

If you have the following configuration for Google in [config/providers.json][purest-config]:

```js
"google": {
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

You can extend it through the `config` options of the Purest's constructor:

```js
var google = new Purest({
  provider:'google',
  config:{
    "google": {
      "https://www.googleapis.com": {
        "youtube/[version]/{endpoint}": {
          "__path": {
            "alias": "youtube",
            "version": "v3"
          }
        },
        "drive/[version]/{endpoint}": {
          "__path": {
            "alias": "drive",
            "version": "v2"
          }
        }
      },
      "https://maps.googleapis.com":{...}
    }
  }
})
```

This will add two additional path aliases for `https://www.googleapis.com` and one new domain - `https://maps.googleapis.com`.

> All available provider configuration options can be found in the [Provider Configuration][provider-configuration] section.


## Before Request Hooks

Purest's extensive configuration structure allows you to configure almost everything without the need to write a single line of code. However small bits of application logic may be required to get a fully compatible REST API client library for your provider.

The only thing that you can modify in a `before` hook is the `options` argument. These hooks are executed right before the [request][request] is started, so that's the last chance to dynamically change some of the passed options to the request.

Let's take a look at the MailChimp's `before.all` function:

```js
var mailchimp = new Purest({
  provider:'mailchimp',
  before:{
    all: function (endpoint, options, config) {
      var dc = options.subdomain||this.subdomain||config.subdomain
      if (dc) return

      // extract data center name from apikey
      if (options.qs && /.*-\w{2}\d+/.test(options.qs.apikey)) {
        var dc = options.qs.apikey.replace(/.*-(\w{2}\d+)/, '$1')
        options.subdomain = dc
      }
    }
  }
})
```

This particular function is executed before every request, and it's sole purpose is to extract the user's *data center* name from its `apikey`.

Mailchimp needs a correct *data center* name, that will be set as a subdomain in the API URL:

```js
"mailchimp": {
  "https://[subdomain].api.mailchimp.com": {...}}
```

### Structure

You can define HTTP hook for every valid HTTP verb + one special `all` hook which is executed always:

```js
var before = {
  all: function (endpoint, options, config) {},
  get: function (endpoint, options, config) {},
  post: function (endpoint, options, config) {}
}
```

Arguments:

- **endpoint** - the endpoint that the request is called with
- **options** - all options passed to the request
- **config** - configuration of the matched *API/alias* path

Inside `before` hook `this` points to the provider's instance.

> Take a look at the [config/hooks.js][purest-hooks] as it contains a couple of `before` hooks bundled with Purest.

**Note:** Always write tests for your hooks, and execute those tests each time after upgrade to a newer version of Purest!


## Query Method Aliases

Purest comes with a bunch of pre-configured [method aliases][purest-query] to use with its [Query API][query-api]:

```js
{
  "verbs": {
    "get"      : ["select", "read"],
    "post"     : ["update", "send", "submit"],
    "put"      : ["create", "insert", "write"],
    ...
  },
  "options": {
    "qs"       : ["where"],
    "form"     : ["set"],
    "formData" : ["upload"],
    ...
    "options"  : []
  },
  "custom": {
    "auth"     : [],
    "request"  : []
  }
}
```

> The actual methods are to the left, and their aliases are to the right.

Using the above configuration the following API calls are identical:

```js
// var facebook = new Purest({provider:'facebook'})
facebook.query()
  .get('me')
  .request(function (err, res, body) {})
// same as
facebook.query()
  .select('me')
  .request(function (err, res, body) {})
```

However you may not be happy with the pre-defined aliases, luckily you can define your own:

```js
var facebook = new Purest({
  provider:'facebook',
  methods:{
    verbs:{get:['loot']},
    custom:{request:['submit']}
  }
})
```

Then the following code is valid:

```js
facebook.query()
  .loot('me')
  .submit(function (err, res, body) {})
```

**Note:** Keep in mind that you should not use the actual method names as alias names.

**Note:** Your alias methods override any previously defined alias method with the same name.


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


## OAuth

You can configure Purest to make your code more expressive using various OAuth grant types. For example this is how the configuration for [act-on][acton-oauth] looks like:

```js
"acton": {
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
        "alias": "oauth"
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


### Basic Auth

Alternatively you can send the app credentials via basic auth:

```js
"acton": {
  "https://restapi.actonsoftware.com": {
    "{endpoint}": {
      "__path": {
        "alias": "oauth",
        "auth": {"auth":{"user": "[0]", "pass": "[1]"}}
      }
    }
  }
}
```

```js
acton.query('oauth')
  .update('token')
  .set({grant_type:'client_credentials|password|refresh_token'})
  .auth('[APP_ID]', '[APP_SECRET]')
  .request(function (err, res, body) {})
```


### [Authorization Code Grant][grant-authorization-code]

This grant type is implemented by **_[Grant][grant]_** which is OAuth middleware for Express, Koa and Hapi. Alternatively you can use the [OAuth Playground][grant-oauth] for testing.


### [Consumer Requests to Update Access Token - OAuth1][refresh-oauth1]

```js
yahoo.query('oauth')
  .update('token')
  .oauth({
    consumer_key:'...',
    consumer_secret:'...',
    token:'...',
    token_secret:'...',
    session_handle:'...'
  })
  .request(function (err, res, body) {})
```

> Search for `"alias": "oauth"` in [config/providers.json][purest-config] to see how various OAuth token paths are configured for different providers.


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

Additional to the [request's options][request-options], Purest adds a few more options on its own.


### api

Specific *API/alias* path to use for providers with multiple paths configuration:

```js
google.get('channels', {
  api:'youtube',
  auth:{bearer:'[ACCESS_TOKEN]'},
  qs:{forUsername:'RayWilliamJohnson'}
}, function (err, res, body) {})
```


### version

Replaces the API `[version]` token embedded into the path configuration (if present).

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

Resulting in request to the `https://api.twitter.com/1.0/users/show.json` absolute URL.


### type

Again, using the above configuration for Twitter, we can change the `[type]` token embedded into the path. If present `[type]` always defaults to `json`.

To override that pass the `type` option with the appropriate value:

```js
twitter.get('users/show', {type:'xml'}, function (err, res, body) {})
```

Resulting in request to the `https://api.twitter.com/1.1/users/show.xml` absolute URL.


### subdomain

Some domain configurations have a `[subdomain]` variable embedded into them:

```js
"mailchimp": {
  "https://[subdomain].api.mailchimp.com": {...}}
```

Set your data center name like this:

```js
// var mailchimp = new Purest({provider:'mailchimp'})
mailchimp.get('campaigns/list', {
  subdomain:'us2',
  qs:{apikey:'[API_KEY]'}
}, function (err, res, body) {})
```

This will result in request to the `https://us2.api.mailchimp.com` domain.


### subpath

Some providers may have a `[subpath]` token embedded into them:

```js
"basecamp": {
  "[subpath]/api/[version]/{endpoint}.[type]": {...}}
```

The `BaseCamp` API needs the user's ID embedded into their path configuration:

```js
// var basecamp = new Purest({provider:'basecamp'})
basecamp.get('people/me', {
  subpath:'[USER_ID]',
  auth:{bearer:'[ACCESS_TOKEN]'}
}, function (err, res, body) {})
```


### oauth:secret

Shortcut for `oauth:token_secret` used to set the user's `[ACCESS_SECRET]`:

```js
var twitter = new Purest({
  provider:'twitter',
  key:'[CONSUMER_KEY]', secret:'[CONSUMER_SECRET]'
})
twitter.get('users/show', {
  oauth:{token:'[ACCESS_TOKEN]', secret:'[ACCESS_SECRET]'},
  qs:{screen_name:'nodejs'}
}, function (err, res, body) {})
```


## License

MIT


  [npm-version]: http://img.shields.io/npm/v/purest.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/simov/purest/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/simov/purest.svg?style=flat-square (Test Coverage - Coveralls)
  [codecov-status]: https://img.shields.io/codecov/c/github/simov/purest.svg?style=flat-square (Test Coverage - Codecov)

  [npm]: https://www.npmjs.com/package/purest
  [travis]: https://travis-ci.org/simov/purest
  [coveralls]: https://coveralls.io/r/simov/purest?branch=master
  [codecov]: https://codecov.io/github/simov/purest?branch=master


  [quick-start]: #quick-start
  [constructor]: #constructor
  [basic-api]: #basic-api
  [query-api]: #query-api

  [provider-configuration]: #provider-configuration
  [domain]: #domain
  [auth]: #auth
  [path]: #path
  [alias]: #alias
  [endpoint]: #endpoint
  [match-all]: #match-all

  [url-modifiers]: #url-modifiers
  [domain-modifiers]: #domain-modifiers
  [path-modifiers]: #path-modifiers

  [create-new-provider]: #create-new-provider
  [extend-existing-provider]: #extend-existing-provider

  [before-request-hooks]: #before-request-hooks
  [query-method-aliases]: #query-method-aliases

  [streaming]: #streaming
  [oauth]: #oauth
  [multipart-uploads]: #multipart-uploads
  [specific-purest-options]: #specific-purest-options


  [purest-config]: https://github.com/simov/purest/blob/master/config/providers.json
  [purest-query]: https://github.com/simov/purest/blob/master/config/query.json
  [purest-hooks]: https://github.com/simov/purest/blob/master/config/hooks.js
  [purest-providers]: https://github.com/simov/purest/wiki/Providers

  [request]: https://github.com/request/request
  [request-options]: https://github.com/request/request#requestoptions-callback
  [request-simple]: https://github.com/request/request#super-simple-to-use
  [request-defaults]: https://github.com/request/request#requestdefaultsoptions
  [request-streaming]: https://github.com/request/request#streaming
  [request-multipart]: https://github.com/request/request#multipartform-data-multipart-form-uploads

  [grant]: https://github.com/simov/grant
  [grant-oauth]: https://grant-oauth.herokuapp.com

  [request-debug]: https://github.com/request/request-debug

  [youtube-channels]: https://developers.google.com/youtube/v3/docs/channels/list
  [event-stream]: https://github.com/dominictarr/event-stream

  [acton-oauth]: https://developer.act-on.com/documentation/oauth/
  [grant-authorization-code]: https://tools.ietf.org/html/rfc6749#section-4.1
  [grant-password]: https://tools.ietf.org/html/rfc6749#section-4.3
  [grant-client-credentials]: https://tools.ietf.org/html/rfc6749#section-4.4
  [grant-refresh]: https://tools.ietf.org/html/rfc6749#section-6
  [refresh-oauth1]: http://oauth.googlecode.com/svn/spec/ext/session/1.0/drafts/1/spec.html#update_access_token
