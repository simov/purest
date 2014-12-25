
var extend = require('extend')
var utils = require('./utils')
var config = require('../config/providers')


exports = module.exports = function (provider) {
  if (map[provider.name]) {
    map[provider.name].call(provider)
  }
}


var map = {
  flowdock: function () {
    function auth (endpoint, options) {
      if (options.auth && options.auth.bearer) {
        // API token
        if (options.auth.bearer.length < 35) {
          options.auth = {user:options.auth.bearer}
        }
      }
    }
    this.before.all = function (endpoint, options) {
      auth(endpoint, options)
    }
  },
  google: function () {
    this.url.endpoint = function (endpoint, options) {
      var api = options.api||this.provider.api
      if (api == 'gmaps') {
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
    function auth (endpoint, options) {
      if (options.auth && options.auth.bearer.length < 20) {
        extend(true, options.headers, {
          Authorization: 'Client-ID '+options.auth.bearer
        })
        delete options.auth
      }
    }
    this.before.all = function (endpoint, options) {
      auth(endpoint, options)
    }
  },
  linkedin: function () {
    this.before.post = function (endpoint, options) {
      if (options.form) {
        options.json = options.form
        delete options.form
      }
    }
  },
  mailchimp: function () {
    this.url.domain = function (domain, options) {
      // options or apikey
      if (options.domain || /.*-\w{2}\d+/.test(options.qs.apikey)) {
        var _domain = options.domain
          ? options.domain
          : options.qs.apikey.replace(/.*-(\w{2}\d+)/,'$1')
        delete options.domain
        return domain.replace('[domain]', _domain)
      }
      // token
      else throw new Error(
        'Purest: specify domain name to use through the domain option!')
    }
  },
  openstreetmap: function () {
    function auth (endpoint, options) {
      if (options.oauth.token.length < 30) {
        options.auth = {
          user: options.oauth.token,
          pass: options.oauth.token_secret
        }
        delete options.oauth
      }
    }
    this.before.all = function (endpoint, options) {
      auth(endpoint, options)
    }
  },
  paypal: function () {
    this.url.domain = function (domain, options) {
      if (options.domain != 'sandbox') return domain
      delete options.domain
      return domain.replace('api','api.sandbox')
    }
  },
  twitter: function () {
    this.url.qs = function (endpoint, options) {
      // posting but not uploading
      if (options.form) {

        var qs = utils.uri.qs(options.form)
        delete options.form

        return (qs && ('?'+qs))
      }
      // get
      else {
        return ''
      }
    }
  }
}
