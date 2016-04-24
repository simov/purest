
var _config = require('@purest/config')
var _basic = require('./lib/basic-api')
var _query = require('./lib/query-api')
var _request = require('./lib/request')


module.exports = (client, promise) => (options) => {

  var config

  if (!options || !options.provider) {
    throw new Error('Purest: provider option is required!')
  }

  if (options.config) {
    if (options.config[options.provider]) {
      config = _config(options, options.config[options.provider])
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

  var request = _request(client, promise, options, config)

  if (options.basic) {
    return _basic(request, options.defaults)
  }
  else {
    return _query(options, config, request, options.defaults)
  }
}
