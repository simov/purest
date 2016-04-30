
var _extend = require('extend')
var _methods = require('../config/methods')


module.exports = (request, defaults) => {

  function init (url, options, callback) {
    var _options = {}
    if (typeof options === 'object') {
      _options = options
    }
    else if (typeof url === 'object') {
      _options = url
    }

    var _callback
    if (typeof callback === 'function') {
      _callback = callback
    }
    else if (typeof options === 'function') {
      _callback = options
    }

    var _url
    if (typeof url === 'string') {
      _url = url
    }

    _options.url = _url || _options.url || _options.uri
    _options.callback = _callback || _options.callback

    var result = {}
    if (defaults) {
      _extend(true, result, defaults, _options)
    }
    else {
      result = _options
    }

    return result
  }

  function api (url, options, callback) {
    var _options = init(url, options, callback)
    return request(_options)
  }

  for (var key in _methods.method) {
    api[key] = ((key) => {
      return function (url, options, callback) {
        var _options = init(url, options, callback)
        _options.method = key.toUpperCase()
        return request(_options)
      }
    })(key)
  }

  return api
}
