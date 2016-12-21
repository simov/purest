
var extend = require('extend')
var transform = require('./transform')


module.exports = (deps, ctor, config) => (options) => {

  var alias = (options.alias || ctor.alias || '__default')

  if (!config.aliases[alias]) {
    // throw new Error('Purest: non existing alias!')
    if (deps.promise) {
      return deps.promise.reject(new Error('Purest: non existing alias!'))
    }
    else if (options.callback) {
      options.callback(new Error('Purest: non existing alias!'))
      return
    }
    // TODO: should emit if the client returns a stream
  }

  if (ctor.defaults) {
    var opts = {}
    extend(true, opts, ctor.defaults, options)
    options = opts
  }

  if (options.callback) {
    options.callback = transform.callback(options.callback)
  }

  transform.oauth(ctor, options)
  transform.parse(options)
  transform.length(options)
  // TODO: move to external wrapper using @request/interface
  // legacy request module
  if (deps.request.Request) {
    if (options.json === undefined && options.encoding === undefined) {
      options.json = true
    }
    if (typeof options.multipart === 'object') {
      options.formData = options.multipart
      delete options.multipart
    }
  }
  options = config.endpoint.options(alias, options)

  if (!/^https?:\/\//.test(options.url)) {
    options.url = config.url(alias, options)
  }

  if (deps.promise) {
    var Promise = deps.promise
    var promise = new Promise((resolve, reject) => {
      options.callback = (err, res, body) => {
        if (err) {
          reject(err)
        }
        else {
          resolve([res, body])
        }
      }
    })
    if (options.defer) {
      options.defer((err) => {
        if (err) {
          throw err
        }
        deps.request(options)
      })
    }
    else {
      deps.request(options)
    }
    return promise
  }
  else {
    if (options.defer) {
      options.defer((err) => {
        if (err) {
          throw err
        }
        // TODO: won't be able to pipe streaming implementation
        // defer option should be implemented in the underlying http client
        deps.request(options)
      })
    }
    else {
      return deps.request(options)
    }
  }
}
