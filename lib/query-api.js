
var _extend = require('extend')
var _api = require('@request/api')
var _methods = require('../config/methods')


module.exports = (ctor, config, request, defaults) => {

  var _define = {
    api: function (name) {
      this._options.api = name
      return this
    },
    auth: function (arg1, arg2) {
      var alias = (this._options.api || ctor.api || '__default')
      config.endpoint.auth(alias, this._options, arg1, arg2)
      return this
    },
    options: function (options) {
      _extend(true, this._options, options)
      return this
    },
    request: function (callback) {
      var options = {}
      if (defaults) {
        _extend(true, options, defaults, this._options)
      }
      else {
        options = this._options
      }

      if (callback) {
        options.callback = callback
      }

      return request(options)
    }
  }

  ctor.methods = ctor.methods || {}

  var define = {}
  _extend(true, define, _define, ctor.methods.define)
  delete ctor.methods.define

  var methods = {}
  _extend(true, methods, _methods, ctor.methods)

  return _api(methods, define)
}
