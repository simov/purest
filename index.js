
var extend = require('extend')
var _config = require('@purest/config')
var _methods = require('./config/methods')
var _options = require('./lib/options')
var _purest = require('./lib/client')


module.exports = (client, promise) => (options) => {
  var provider = {
    api: options.api,
    subdomain: options.subdomain,
    subpath: options.subpath,
    version: options.version,
    type: options.type,
    key: options.key,
    secret: options.secret
  }

  var config

  if (!options || !options.provider) {
    throw new Error('Purest: provider option is required!')
  }

  if (options.config) {
    if (options.config[options.provider]) {
      config = _config(provider, options.config[options.provider])
    }
    else {
      throw new Error('Purest: non existing provider!')
    }
  }
  else {
    throw new Error('Purest: config option is required!')
  }

  if (options.api) {
    if (!config.aliases || !config.aliases[options.api]) {
      throw new Error('Purest: non existing alias!')
    }
  }

  var methods = {}
  extend(true, methods, _methods, options.methods)

  var transform = _options(provider)

  return _purest(client, provider, methods, config, transform, options.defaults, promise)
}
