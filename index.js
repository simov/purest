
var Config = require('@purest/config')
var basic = require('./lib/basic-api')
var query = require('./lib/query-api')
var Request = require('./lib/request')


module.exports = (deps) => (options) => {

  var config

  if (!options || !options.provider) {
    throw new Error('Purest: provider option is required!')
  }

  if (options.config) {
    if (options.config[options.provider]) {
      config = Config(options, options.config[options.provider])
    }
    else {
      throw new Error('Purest: non existing provider!')
    }
  }
  else {
    throw new Error('Purest: config option is required!')
  }

  if (options.alias) {
    if (!config.aliases || !config.aliases[options.alias]) {
      throw new Error('Purest: non existing alias!')
    }
  }

  var request = Request(deps, options, config)

  if (options.api === 'basic') {
    return basic(options, request)
  }
  else {
    return query(options, config, request)
  }
}
