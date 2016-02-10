
var client = require('@request/client')

var _provider = require('./lib/provider')
var _config = require('./lib/config')
var _options = require('./lib/options')
var _methods = require('./lib/methods')
var _purest = require('./lib/client')


module.exports = (options) => {
  var provider = _provider(options)
  var config = _config(provider, options)
  var transform = _options(provider)

  var methods = _methods(options)

  return _purest(client, provider, methods, config, transform)
}
