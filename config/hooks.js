
exports = module.exports = {

  // auth

  aboutme: {
    all: function (endpoint, options) {
      if (options.headers && options.headers.authorization) {
        var parts = options.headers.authorization.split(' ')
        // apikey
        if (parts[0] == 'OAuth' && parts[1].length < 45) {
          options.headers.authorization = 'Basic '+parts[1]
        }
      }
    }
  },
  asana: {
    all: function (endpoint, options) {
      if (options.auth && options.auth.bearer) {
        // apikey
        if (options.auth.bearer.length < 35) {
          options.auth = {user:options.auth.bearer}
        }
      }
    }
  },
  flowdock: {
    all: function (endpoint, options) {
      if (options.auth && options.auth.bearer) {
        // apikey
        if (options.auth.bearer.length < 35) {
          options.auth = {user:options.auth.bearer}
        }
      }
    }
  },
  gitlab: {
    all: function (endpoint, options) {
      if (options.auth && options.auth.bearer) {
        // apikey
        if (options.auth.bearer.length < 35) {
          options.headers = options.headers || {}
          options.headers['PRIVATE-TOKEN'] = options.auth.bearer
          delete options.auth
        }
      }
    }
  },
  imgur: {
    all: function (endpoint, options) {
      if (options.auth && options.auth.bearer) {
        // app key
        if (options.auth.bearer.length < 35) {
          options.headers = options.headers || {}
          options.headers.authorization = 'Client-ID '+options.auth.bearer
          delete options.auth
        }
      }
    }
  },
  openstreetmap: {
    all: function (endpoint, options) {
      if (options.oauth && options.oauth.token) {
        // basic
        if (options.oauth.token.length < 35) {
          options.auth = {
            user: options.oauth.token,
            pass: options.oauth.token_secret
          }
          delete options.oauth
        }
      }
    }
  },

  // other

  freshbooks: {
    all: function (endpoint, options) {
      // feel free to submit PR with the full implementation
      options.body = '<!--?xml version="1.0" encoding="utf-8"?-->'+
      '<request method="'+endpoint+'"></request>'
    }
  },

  getpocket: {
    all: function (endpoint, options) {
      // getpocket expects the data as JSON
      if (options.qs) {
        options.json = options.qs
        delete options.qs
      }
      else if (options.form) {
        options.json = options.form
        delete options.form
      }
      // getpocket returns error on
      // Accept: application/json header
      options.body = JSON.stringify(options.json)
      options.json = false
    }
  },
  linkedin: {
    post: function (endpoint, options) {
      // linkedin expects the data as JSON
      if (options.form) {
        options.json = options.form
        delete options.form
      }
    }
  },
  mailchimp: {
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
}
