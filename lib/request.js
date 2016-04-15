
var _transform = require('./transform')
var _before = require('./before')


module.exports = (client, promise, ctor, config) => {

  var transform = _transform(ctor)

  function request (options) {
    var alias = (options.api || ctor.api || '__default')

    if (!config.aliases[alias]) {
      throw new Error('Purest: non existing alias!')
    }

    if (options.callback) {
      options.callback = transform.callback(options.callback)
    }

    transform.oauth(options)
    transform.parse(options)
    // legacy request module
    if (client.Request) {
      if (options.json === undefined && options.encoding === undefined) {
        options.json = true
      }
    }
    options = config.endpoint.options(alias, options)

    var before = ctor.before || _before[ctor.provider]
    if (before) {
      if (typeof before.all === 'function') {
        before.all(options, ctor, config.aliases[alias])
      }
      if (typeof before[options.method] === 'function') {
        before[options.method](options, ctor, config.aliases[alias])
      }
    }

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

  return request
}
