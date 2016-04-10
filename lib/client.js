
var api = require('@request/api')


module.exports = (client, provider, methods, config, transform) => {
  return api(methods, {
    api: function (options, name) {
      options.api = name
      return this
    },
    auth: function (options, arg1, arg2) {
      var alias = (options.api || provider.api || '__default')
      config.endpoint.auth(alias, options, arg1, arg2)
      return this
    },
    submit: function (options) {
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
