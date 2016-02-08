
module.exports = ((client, api, config, extend) => {
  return (options) => {
    var self = {}

    if (!options || !options.provider) {
      throw new Error('Purest: provider option is required!')
    }


    var name = options.provider

    if (options.config) {
      if (options.config[name]) {
        self.config = options.config[name]
      }
      else {
        throw new Error('Purest: non existing provider!')
      }
    }
    else {
      throw new Error('Purest: config option is required!')
    }


    self.aliases = config.init.aliases(self.config)

    if (options.api) {
      if (!self.aliases || !self.aliases[options.api]) {
        throw new Error('Purest: non existing API!')
      }
      else {
        self.api = options.api
      }
    }


    // url modifiers
    self.subdomain = options.subdomain
    self.subpath = options.subpath
    self.version = options.version
    self.type = options.type


    var url = config.url(self)


    var _config = {
      verb: {get: ['select']},
      option: {qs: ['where'], callback: []},
      custom: {submit: [], api: ['query']}
    }
    var _custom = {
      api: function (options, name) {
        options.api = name
        return this
      },
      submit: function (options) {
        // path config
        var cfg = self.aliases[options.api || self.api || '__default']
        if (!cfg) {
          throw new Error('Purest: non existing API!')
        }

        // create absolute url
        options.url = (options.url.indexOf('http') === -1)
          ? url.get(options.url, options, cfg)
          : options.url

        return client(options)
      }
    }

    var purest = api(_config, _custom)
    return purest
  }
})(
  require('@request/client'),
  require('@request/api'),
  require('@purest/config'),
  require('extend')
)
