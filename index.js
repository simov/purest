
var client = require('@request/client')

var _config = require('@purest/config')

var _options = require('./lib/options')
var _methods = require('./lib/methods')
var _purest = require('./lib/client')


module.exports = (options) => {
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

  var transform = _options(provider)
  var methods = _methods(options)

  return _purest(client, provider, methods, config, transform)
}
