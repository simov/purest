
var _options = require('./options')


module.exports = (client, promise, ctor, config) => {

  var transform = _options(ctor)

  function request (options) {
    var alias = (options.api || ctor.api || '__default')

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

  return request
}
