
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
      if ('object'===typeof options.body) {
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
      options.oauth = options.oauth||{}
      // 0-legged OAuth
      options.oauth = {
        consumer_key: options.oauth.consumer_key||this.provider.key,
        consumer_secret: options.oauth.consumer_secret||this.provider.secret
      }
      if (!options.oauth.consumer_key || !options.oauth.consumer_secret)
        throw new Error('Missing OAuth credentials!')
    }
  },
  imgur: function () {
    this.before.all = function (endpoint, options) {
      if (options.auth && options.auth.bearer.length < 20) {
        options.headers = options.headers || {}
        options.headers['authorization'] = 'Client-ID '+options.auth.bearer
        delete options.auth
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
    this.url.domain = function (domain, options) {
      // https://login.mailchimp.com
      if (domain.indexOf('[domain]') == -1) {
        return domain
      }
      // options
      else if (options.domain) {
        var _domain = options.domain
        delete options.domain
        return domain.replace('[domain]', _domain)
      }
      // extract the domain from the apikey
      else if (options.qs && /.*-\w{2}\d+/.test(options.qs.apikey)) {
        var _domain = options.qs.apikey.replace(/.*-(\w{2}\d+)/,'$1')
        return domain.replace('[domain]', _domain)
      }
      // token
      else {
        throw new Error(
          'Purest: specify domain name to use through the domain option!')
      }
    }
  },
  openstreetmap: function () {
    this.before.all = function (endpoint, options) {
      if (options.oauth.token.length < 30) {
        options.auth = {
          user: options.oauth.token,
          pass: options.oauth.token_secret
        }
        delete options.oauth
      }
    }
  },
  paypal: function () {
    this.url.domain = function (domain, options) {
      if (options.domain == 'sandbox') {
        delete options.domain
        return domain.replace('api','api.sandbox')
      }
      else {
        return domain
      }
    }
  }
}
