
var extend = require('extend')
var api = require('@request/api')
var _methods = require('../config/methods')


module.exports = (ctor, config, request) => {

  if (ctor.api === 'basic') {
    return api({
      type: 'basic',
      define: {
        request: request
      }
    })
  }

  var define = {
    alias: (options, name) => {
      options.alias = name
    },
    auth: (options, arg1, arg2) => {
      if (typeof arg1 === 'object') {
        // TODO: implement
        // options.auth = {basic: arg1}
        // options.auth = {bearer: arg1}
      }
      else {
        var alias = (options.alias || ctor.alias || '__default')
        config.endpoint.auth(alias, options, arg1, arg2)
      }
    },
    oauth: (options, opts) => {
      // TODO: it should be
      // options.auth = {oauth: opts}
      options.oauth = opts
    },
    options: (options, opts) => {
      extend(true, options, opts)
    },
    request: (options, callback) => {
      if (callback) {
        options.callback = callback
      }
      return request(options)
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
