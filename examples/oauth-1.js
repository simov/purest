
var purest = require('../')

// ----------------------------------------------------------------------------

var auth = {
  flickr: {
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: '',
  },
  trello: {
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: '',
  },
  twitter: {
    consumer_key: '',
    consumer_secret: '',
    token: '',
    token_secret: '',
    screen_name: '',
  },
}

// ----------------------------------------------------------------------------

var config = {
  "flickr": {
    "default": {
      "origin": "https://api.flickr.com",
      "path": "services/rest/",
      "oauth": {
        "token": "{auth}",
        "token_secret": "{auth}"
      },
      "qs": {
        "format": "json"
      }
    }
  },
  "trello": {
    "default": {
      "origin": "https://api.trello.com",
      "path": "{version}/{path}",
      "version": "1",
      "oauth": {
        "token": "{auth}",
        "token_secret": "{auth}"
      }
    }
  },
  "twitter": {
    "default": {
      "origin": "https://api.twitter.com",
      "path": "{version}/{path}.{type}",
      "version": "1.1",
      "type": "json",
      "oauth": {
        "token": "{auth}",
        "token_secret": "{auth}"
      }
    }
  }
}

// ----------------------------------------------------------------------------

;({

  'flickr profile': async () => {
    var flickr = purest({provider: 'flickr', config, defaults: {
      oauth: {
        consumer_key: auth.flickr.consumer_key,
        consumer_secret: auth.flickr.consumer_secret
      }
    }})

    await flickr
      .get()
      .qs({
        method: 'flickr.urls.getUserProfile',
        api_key: auth.flickr.consumer_key
      })
      .auth(auth.flickr.token, auth.flickr.token_secret)
      .request()
  },

  'trello profile': async () => {
    var trello = purest({provider: 'trello', config, defaults: {
      oauth: {
        consumer_key: auth.trello.consumer_key,
        consumer_secret: auth.trello.consumer_secret
      }
    }})

    await trello
      .get('members/me')
      .auth(auth.trello.token, auth.trello.token_secret)
      .request()
  },

  'twitter profile': async () => {
    var twitter = purest({provider: 'twitter', config, defaults: {
      oauth: {
        consumer_key: auth.twitter.consumer_key,
        consumer_secret: auth.twitter.consumer_secret
      }
    }})

    await twitter
      .get('users/show')
      .qs({screen_name: auth.twitter.screen_name})
      .auth(auth.twitter.token, auth.twitter.token_secret)
      .request()
  },

})[process.argv[2]]()
