
var _config = require('@purest/config')


module.exports = (provider, options) => {
  var config = {}

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

  return config
}
