
var extend = require('extend')
var api = require('@request/api')


module.exports = (client, provider, methods, config, transform, defaults, promise, basic) => {

  function request (options) {
    var alias = (options.api || provider.api || '__default')

    if (!config.aliases[alias]) {
      throw new Error('Purest: non existing alias!')
    }

    transform.oauth(options)
    transform.parse(options)
    options = config.endpoint.options(alias, options)

    if (!/^http/.test(options.url)) {
      options.url = config.url(alias, options)
    }

    if (promise) {
      var p = new promise((resolve, reject) => {
        options.callback = (err, res, body) => {
          if (err) {
            reject(err)
          }
          else {
            resolve([res, body])
          }
        }
      })
      client(options)
      return p
    }
    else {
      return client(options)
    }
  }

  if (basic) {
    var init = function (url, options, callback) {
      var opts = {}
      if (typeof options === 'object') {
        opts = options
      }
      else if (typeof url === 'object') {
        opts = url
      }

      var cb
      if (typeof callback === 'function') {
        cb = callback
      }
      else if (typeof options === 'function') {
        cb = options
      }

      var u
      if (typeof url === 'string') {
        u = url
      }

      opts.url = u || opts.url || opts.uri
      opts.callback = cb || opts.callback

      return opts
    }
    var wreck = function (url, options, callback) {
      var opts = init(url, options, callback)
      return request(opts)
    }

    for (var key in methods.method) {
      wreck[key] = (function (key) {
        return function (url, options, callback) {
          var opts = init(url, options, callback)
          opts.method = key.toUpperCase()
          return request(opts)
        }
      })(key)
    }

    return wreck
  }

  else {
    return api(methods, {
      api: function (name) {
        this._options.api = name
        return this
      },
      auth: function (arg1, arg2) {
        var alias = (this._options.api || provider.api || '__default')
        config.endpoint.auth(alias, this._options, arg1, arg2)
        return this
      },
      request: function (callback) {
        var options = {}
        if (defaults) {
          extend(true, options, defaults, this._options)
        }
        else {
          options = this._options
        }

        if (callback) {
          options.callback = callback
        }

        return request(options)
      }
    })
  }
}
