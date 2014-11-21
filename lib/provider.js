
var request = require('request')
try {
  var debug = require('request-debug')
} catch (e) {
  var debug = function () {}
}

var utils = require('./utils'),
  config = require('./config'),
  Query = require('./query'),
  Url = require('./url'),
  refresh = require('./refresh'),
  override = require('./override')
var Options = require('./options').Options,
  Before = require('./options').Before
var providers = require('../config/providers')


function Provider (options) {
  if (!options || !options.provider)
    throw new Error('Purest: provider option is required!')

  config.extend(providers, options.config)
  var provider = providers[options.provider]
  if (!provider) {
    throw new Error('Purest: non existing provider!')
  }

  this.key = options.consumerKey||options.key||null
  this.secret = options.consumerSecret||options.secret||null
  this.oauth = provider.__provider.oauth
  this.oauth2 = provider.__provider.oauth2
  this._refresh = provider.__provider.refresh

  // this.version = options.version||''
  this._request = request.defaults(options.defaults||{})
  options.debug && debug(this._request)
  this.type = options.type||'json'

  this.apis = config.aliases(provider)||null
  if (options.api && (!this.apis || !this.apis[options.api])) {
    throw new Error('Purest: non existing API!')
  }
  this.api = options.api||'__default'

  this.name = options.provider
  this[options.provider] = true

  this.options = new Options(this)
  this.before = new Before(this)
  this.url = new Url(this)
  this.refresh = refresh(this)
  override(this)
}

function prepare (method, uri, options, callback) {
  var params = request.initParams(uri, options, callback)
  var endpoint = params.uri,
    options = params.options,
    callback = params.callback

  options.method = options.method||(method=='del'?'delete':method).toUpperCase()
  if (method != 'put') {
    options.json = (options.json == undefined) ? true : options.json
  }

  this.oauth && options.oauth && this.options.oauth(options)
  options = config.options(endpoint, options, method, this.apis[options.api||this.api].endpoints)
  this.before.all(endpoint, options)
  this.before[method](endpoint, options)

  return this._request(
    endpoint.indexOf('http') == -1 ? this.url.get(endpoint, options) : endpoint,
    options,
    callback && utils.response(callback))
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
exports = module.exports = Provider
