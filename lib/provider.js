'use strict'

var request = require('request')
  , extend = require('extend')
try {
  var debug = require('request-debug')
} catch (e) {
  var debug = function () {
    console.log('request-debug is not installed!')
  }
}

var utils = require('./utils')
  , config = require('./config')
  , Query = require('./query')
  , Url = require('./url')
var Options = require('./options').Options
  , Before = require('./options').Before
var providers = require('../config/providers')
  , overrides = require('../config/overrides')


function Provider (options) {
  if (!options || !options.provider) {
    throw new Error('Purest: provider option is required!')
  }

  // provider
  var provider = {}
    , name = options.provider
  // config
  if (options.config) {
    // existing
    if (providers[name]) {
      // extend
      if (options.config[name]) {
        extend(true, provider, providers[name], options.config[name])
      } else {
        provider = providers[name]
      }
    } else {
      // custom
      provider = options.config[name]
    }
  } else {
    provider = providers[name]
  }
  if (!provider) {
    throw new Error('Purest: non existing provider!')
  }

  // key & secret
  if (options.consumerKey||options.key) {
    this.key = options.consumerKey||options.key
  }
  if (options.consumerSecret||options.secret) {
    this.secret = options.consumerSecret||options.secret
  }

  // defaults
  if (options.defaults) {
    this._request = request.defaults(options.defaults)
  } else {
    this._request = request
  }
  // debug
  if (options.debug) {
    debug(this._request)
  }

  // url modifiers
  this.domain = options.domain
  this.path = options.path
  this.version = options.version
  this.type = options.type

  // api - path alias
  this.apis = config.aliases(provider)
  if (options.api) {
    if (!this.apis || !this.apis[options.api]) {
      throw new Error('Purest: non existing API!')
    } else {
      this.api = options.api
    }
  } else {
    this.api = '__default'
  }

  // shortcuts
  this.name = options.provider
  this[options.provider] = true

  // classes
  this.options = new Options(this)
  this.before = new Before(this)
  this.url = new Url(this)

  // overrides
  if (overrides[this.name]) {
    overrides[this.name].call(this)
  }
  if (options.overrides) {
    options.overrides.call(this)
  }
}

function prepare (method, uri, options, callback) {
  var params = request.initParams(uri, options, callback)
  var endpoint = params.uri||''
    , options = params
    , callback = params.callback

  options.method = options.method||(method=='del'?'delete':method).toUpperCase()
  if (method != 'put') {
    options.json = (options.json == undefined) ? true : options.json
  }

  if (options.oauth) {
    this.options.oauth(options)
  }
  var api = this.apis[options.api||this.api]
  if (!api) {
    throw new Error('Purest: non existing API!')
  }
  options = config.options(endpoint, options, method, api.endpoints)
  this.before.all(endpoint, options)
  this.before[method](endpoint, options)

  var url = endpoint.indexOf('http') == -1
    ? this.url.get(endpoint, options)
    : endpoint

  callback = (typeof callback == 'function')
    ? utils.response(callback)
    : undefined

  return this._request(url, options, callback)
}

Provider.prototype.get = function (uri, options, callback) {
  return prepare.call(this, 'get', uri, options, callback)
}

Provider.prototype.post = function (uri, options, callback) {
  return prepare.call(this, 'post', uri, options, callback)
}

Provider.prototype.put = function (uri, options, callback) {
  return prepare.call(this, 'put', uri, options, callback)
}

Provider.prototype.del = function (uri, options, callback) {
  return prepare.call(this, 'del', uri, options, callback)
}

Provider.prototype.patch = function (uri, options, callback) {
  return prepare.call(this, 'patch', uri, options, callback)
}

Provider.prototype.head = function (uri, options, callback) {
  return prepare.call(this, 'head', uri, options, callback)
}


Provider.prototype.config = function (name) {
  return new Query(this, name)
}

Provider.prototype.query = function (name) {
  return new Query(this, name)
}

Provider.request = request
Provider.extend = extend
exports = module.exports = Provider
