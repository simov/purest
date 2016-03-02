'use strict'

var request = require('request')
  , extend = require('extend')

var Promise = null
try {
  Promise = require('bluebird')
} catch (e) {}

var debug = null
try {
  debug = require('request-debug')
} catch (e) {}

var config = require('./config')
  , utils = require('./utils')
var Query = require('./query')
  , Url = require('./url')

var providers = require('../config/providers')
  , hooks = require('../config/hooks')


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

  // request
  this._request = Provider.request
  // promise
  if (options.promise) {
    if (!Promise) {
      throw new Error('Purest: bluebird is not installed!')
    } else {
      this._request = Promise.promisify(Provider.request, {multiArgs:true})
    }
  }
  // debug
  if (options.debug) {
    if (!debug) {
      throw new Error('Purest: request-debug is not installed!')
    } else {
      debug(this._request)
    }
  }
  // defaults
  if (options.defaults) {
    this._request = this._request.defaults(options.defaults)
  }

  // url modifiers
  this.subdomain = options.subdomain
  this.subpath = options.subpath
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
  this.url = new Url(this)

  // method aliases
  if (options.methods) {
    this._query = new Query(this, options.methods)
  } else {
    this._query = new Query(this)
  }

  // hooks
  this.before = {}
  if (hooks[this.name]) {
    this.before = hooks[this.name]
  }
  if (options.before) {
    this.before = options.before
  }
}

function prepare (method, uri, options, callback) {
  var params = request.initParams(uri, options, callback)
  var endpoint = params.uri||''
    , options = params
    , callback = params.callback

  options.method = options.method||(method=='del'?'delete':method).toUpperCase()

  // path config
  var cfg = this.apis[options.api||this.api||'__default']
  if (!cfg) {
    throw new Error('Purest: non existing API!')
  }

  // check for endpoint specific options
  options = config.options(endpoint, options, method, cfg.endpoints)
  if (method != 'put') {
    if (options.json === undefined && options.encoding === undefined) {
      options.json = true
    }
  }
  // oauth option transformations
  utils.oauth.call(this, options)

  // hooks
  if (this.before.all) {
    this.before.all.call(this, endpoint, options, cfg)
  }
  if (this.before[method]) {
    this.before[method].call(this, endpoint, options, cfg)
  }

  // create absolute url
  var url = endpoint.indexOf('http') == -1
    ? this.url.get(endpoint, options, cfg)
    : endpoint

  // start
  if (callback) {
    return this._request(url, options, utils.response(callback))
  } else {
    return this._request(url, options)
  }
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
  this._query._init(name)
  return this._query
}

Provider.prototype.query = function (name) {
  this._query._init(name)
  return this._query
}

Provider.request = request
Provider.extend = extend
exports = module.exports = Provider
