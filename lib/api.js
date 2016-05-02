
var extend = require('extend')
var api = require('@request/api')
var _methods = require('../config/methods')


module.exports = (ctor, config, request) => {

  if (ctor.api === 'basic') {
    return api({
      type: 'basic',
      request: request
    })
  }

  var define = {
    alias: function (name) {
      this._options.alias = name
      return this
    },
    auth: function (arg1, arg2) {
      var alias = (this._options.alias || ctor.alias || '__default')
      config.endpoint.auth(alias, this._options, arg1, arg2)
      return this
    },
    options: function (options) {
      extend(true, this._options, options)
      return this
    },
    request: function (callback) {
      if (callback) {
        this._options.callback = callback
      }

      return request(this._options)
    }
  }

  ctor.methods = ctor.methods || {}

  var custom = {}
  extend(custom, define, ctor.methods.define)
  delete ctor.methods.define

  var methods = {}
  extend(true, methods, _methods, ctor.methods)

  return api({
    type: 'chain',
    config: methods,
    define: custom
  })
}
