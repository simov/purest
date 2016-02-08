
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


    self.subdomain = options.subdomain
    self.subpath = options.subpath
    self.version = options.version
    self.type = options.type


    if (options.key) {
      self.key = options.key
    }
    if (options.secret) {
      self.secret = options.secret
    }


    var url = config.url(self)
    var oauth = config.oauth(self)


    var methods = {
      method: {
        get      : ['select'],
        post     : [],
        put      : [],
        patch    : [],
        head     : [],
        trace    : [],
        options  : [],
        delete   : []
      },
      option: {
        qs       : ['where'],
        form     : [],
        json     : [],
        body     : [],
        multipart: [],
        auth     : [],
        oauth    : [],
        headers  : [],
        gzip     : [],
        encoding : [],
        cookie   : [],
        length   : [],
        redirect : [],
        timeout  : [],
        proxy    : [],
        tunnel   : [],
        parse    : [],
        stringify: [],
        callback : [],
        end      : []
      },
      custom: {
        api      : ['query'],
        auth     : [],
        submit   : []
      }
    }

    if (options.methods) {
      extend(true, methods, options.methods)
    }


    return api(methods, {
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
    })
  }
})(
  require('@request/client'),
  require('@request/api'),
  require('@purest/config'),
  require('extend')
)
