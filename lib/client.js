
var api = require('@request/api')


module.exports = (client, provider, methods, config, transform) => {
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
      var options = this._options

      if (callback) {
        options.callback = callback
      }

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

      return client(options)
    }
  })
}
