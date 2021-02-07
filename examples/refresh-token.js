
var purest = require('../')

// ----------------------------------------------------------------------------

var auth = {
  box: {
    key: '',
    secret: '',
    token: '',
    refresh: '',
  },
  // requires access_type: offline
  google: {
    key: '',
    secret: '',
    token: '',
    refresh: '',
  },
  twitch: {
    key: '',
    secret: '',
    token: '',
    refresh: '',
  },
}

// ----------------------------------------------------------------------------

var config = {
  "box": {
    "refresh": {
      "origin": "https://api.box.com",
      "path": "oauth2/token",
      "method": "POST",
      "form": {
        "grant_type": "refresh_token",
        "refresh_token": "{auth}"
      }
    }
  },
  "google": {
    "refresh": {
      "origin": "https://oauth2.googleapis.com",
      "path": "token",
      "method": "POST",
      "form": {
        "grant_type": "refresh_token",
        "refresh_token": "{auth}"
      }
    }
  },
  "twitch": {
    "refresh": {
      "origin": "https://api.twitch.tv",
      "path": "kraken/oauth2/token",
      "method": "POST",
      "form": {
        "grant_type": "refresh_token",
        "refresh_token": "{auth}"
      }
    }
  }
}

// ----------------------------------------------------------------------------

;({

  'box refresh': async () => {
    var box = purest({provider: 'box', config, defaults: {
      form: {
        client_id: auth.box.key,
        client_secret: auth.box.secret
      }
    }})

    await box('refresh')
      .auth(auth.box.refresh)
      .request()
  },

  'google refresh': async () => {
    var google = purest({provider: 'google', config, defaults: {
      form: {
        client_id: auth.google.key,
        client_secret: auth.google.secret
      }
    }})

    await google('refresh')
      .auth(auth.google.refresh)
      .request()
  },

  'twitch refresh': async () => {
    var twitch = purest({provider: 'twitch', config, defaults: {
      form: {
        client_id: auth.twitch.key,
        client_secret: auth.twitch.secret
      }
    }})

    await twitch('refresh')
      .auth(auth.twitch.refresh)
      .request()
  },

})[process.argv[2]]()
