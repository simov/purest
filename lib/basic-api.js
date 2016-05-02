
var extend = require('extend')
var dcopy = require('deep-copy')
var methods = require('../config/methods')


module.exports = (ctor, request) => {

  function init (url, options, callback) {

    var opts = {}
    if (typeof options === 'object') {
      opts = dcopy(options)
    }
    else if (typeof url === 'object') {
      opts = dcopy(url)
    }

    var cb
    if (typeof callback === 'function') {
      cb = callback
    }
    else if (typeof options === 'function') {
      cb = options
    }

    opts.url = (typeof url === 'string') ? url : (opts.url || opts.uri)
    opts.callback = cb || opts.callback

    var result = {}
    if (ctor.defaults) {
      extend(true, result, ctor.defaults, opts)
    }
    else {
      result = opts
    }

    return result
  }

  function api (url, options, callback) {
    var opts = init(url, options, callback)
    return request(opts)
  }

  for (var key in methods.method) {
    api[key] = ((key) => (url, options, callback) => {
      var opts = init(url, options, callback)
      opts.method = key.toUpperCase()
      return request(opts)
    })(key)
  }

  return api
}
