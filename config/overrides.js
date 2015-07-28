
exports = module.exports = {
  aboutme: function () {
    this.before.all = function (endpoint, options) {
      if (options.headers && options.headers.authorization) {
        var parts = options.headers.authorization.split(' ')
        // token
        if (parts[0] == 'Basic' && parts[1].length > 40) {
          options.headers.authorization = 'OAuth '+parts[1]
        }
      }
    }
  },
  asana: function () {
    this.before.all = function (endpoint, options) {
      if (options.auth && options.auth.user) {
        // token
        if (options.auth.user.length > 35) {
          options.auth = {bearer:options.auth.user}
        }
      }
    }
  },
  flowdock: function () {
    this.before.all = function (endpoint, options) {
      if (options.auth && options.auth.bearer) {
        // apikey
        if (options.auth.bearer.length < 35) {
          options.auth = {user:options.auth.bearer}
        }
      }
    }
  },
  getpocket: function () {
    this.before.all = function (endpoint, options) {
      if (typeof options.body == 'object') {
        options.body = JSON.stringify(options.body)
      }
      options.json = false
    }
  },
  google: function () {
    this.url.endpoint = function (endpoint, options) {
      var api = options.api||this.provider.api
      if (api == 'gmaps') {
        // append /json to certain endpoints in the gmaps api
        var match = endpoint.match(
          /(?:geocode|directions|timezone|elevation|distancematrix)(?:\/(json|xml))?/)
        return (match && !match[1])
          ? endpoint + '/json'
          : endpoint
      }
      else {
        return endpoint
      }
    }
  },
  hackpad: function () {
    this.options.oauth = function (options) {
      var oa = options.oauth = options.oauth||{}
      // 0-legged OAuth
      options.oauth = {
        consumer_key: oa.consumer_key||this.provider.key,
        consumer_secret: oa.consumer_secret||this.provider.secret
      }
      if (!options.oauth.consumer_key || !options.oauth.consumer_secret) {
        throw new Error('Missing OAuth credentials!')
      }
    }
    this.before.all = function (endpoint, options) {
      if (!options.oauth) {
        this.provider.options.oauth(options)
      }
    }
  },
  imgur: function () {
    this.before.all = function (endpoint, options) {
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
  linkedin: function () {
    this.before.post = function (endpoint, options) {
      // linkedin expects the data as JSON
      if (options.form) {
        options.json = options.form
        delete options.form
      }
    }
  },
  mailchimp: function () {
    this.url.domain = function (config, options) {
      // https://login.mailchimp.com
      if (config.domain.indexOf('[subdomain]') == -1) {
        return config.domain
      }

      // data center name set through subdomain
      var dc = options.subdomain||this.provider.subdomain||config.subdomain
      if (dc) {
        delete options.subdomain
        return config.domain.replace('[subdomain]', dc)
      }

      // extract data center name from apikey
      if (options.qs && /.*-\w{2}\d+/.test(options.qs.apikey)) {
        var dc = options.qs.apikey.replace(/.*-(\w{2}\d+)/, '$1')
        return config.domain.replace('[subdomain]', dc)
      }

      // missing data center name
      throw new Error(
        'Purest: specify data center name to use through the subdomain option!')
    }
  },
  openstreetmap: function () {
    this.before.all = function (endpoint, options) {
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
  paypal: function () {
    this.url.domain = function (config, options) {
      var sub = options.subdomain||this.provider.subdomain||config.subdomain

      if (sub == 'sandbox') {
        delete options.subdomain
        return config.domain.replace('api', 'api.sandbox')
      }
      else {
        return config.domain
      }
    }
  }
}
