
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
    var oauth = config.oauth(self)


    // oauth
    if (options.key) {
      self.key = options.key
    }
    if (options.secret) {
      self.secret = options.secret
    }


    var _config = {
      method: {get: ['select']},
      option: {qs: ['where'], parse: [], callback: []},
      custom: {submit: [], api: ['query'], auth: []}
    }
    var _custom = {
      api: function (options, name) {
        options.api = name
        return this
      },
      auth: function (options, a, b) {
        var cfg = self.aliases[options.api || self.api || '__default']

        var auth = config.endpoint.auth(options.url, cfg.endpoints) || cfg.auth

        if (auth) {
          if (auth instanceof Array) {
            auth = (a && b) ? auth[1] : auth[0]
          }

          var result = {}
          Object.keys(auth).forEach(function (key) {
            result[key] = {}
            Object.keys(auth[key]).forEach(function (sub) {
              if (auth[key][sub] === '[0]') {
                result[key][sub] = a
              }
              else if (auth[key][sub] === '[1]') {
                result[key][sub] = b
              }
            })
          })

          extend(true, options, result)
        }

        return this
      },
      submit: function (options) {
        // path config
        var cfg = self.aliases[options.api || self.api || '__default']
        if (!cfg) {
          throw new Error('Purest: non existing API!')
        }

        // oauth
        oauth(options)

        // json
        if (options.parse === undefined) {
          options.parse = {json: true}
        }
        else if (options.parse.json === undefined) {
          options.parse.json = true
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
