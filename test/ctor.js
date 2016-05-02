
var t = require('assert')
var http = require('http')
var purest = require('../')({
  request: require('@request/client')
})


describe('ctor', () => {

  describe('path modifiers', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => res.end(req.url))
      server.listen(6767, done)
    })

    it('api, subdomain, subpath, version, type', (done) => {
      var provider = purest({provider: 'purest', api: 'test',
      subdomain: 'localhost', subpath: 'api', version: '1.0', type: 'xml',
      config: {purest: {
        'http://[subdomain]:6767': {
          '[subpath]/[version]/{endpoint}.[type]': {
            __path: {alias: 'test'}
          }
        }
      }}})
      provider
        .select('me')
        .where({a: 1})
        .request((_err, res, body) => {
          t.equal(body, '/api/1.0/me.xml?a=1')
          done()
        })
    })

    after((done) => {
      server.close(done)
    })
  })

  describe('oauth', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => res.end(req.headers.authorization))
      server.listen(6767, done)
    })

    it('key, secret', (done) => {
      var provider = purest({provider: 'purest',
      key: 'key', secret: 'secret',
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider
        .select('me')
        .oauth({token: 'token', secret: 'secret'})
        .request((_err, res, body) => {
          t.ok(/oauth_consumer_key="key"/.test(body))
          t.ok(/oauth_token="token"/.test(body))
          done()
        })
    })

    after((done) => {
      server.close(done)
    })
  })

  describe('defaults', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => res.end(req.url))
      server.listen(6767, done)
    })

    it('set', (done) => {
      var provider = purest({provider: 'purest',
      defaults: {qs: {a: 1, b: 2}},
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider
        .select('me')
        .qs({b: 3, c: 4})
        .request((_err, res, body) => {
          t.equal(body, '/api/me?a=1&b=3&c=4')
          done()
        })
    })

    after((done) => {
      server.close(done)
    })
  })

  describe('methods', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => res.end(req.url))
      server.listen(6767, done)
    })

    it('alias + define', (done) => {
      var provider = purest({provider: 'purest',
      methods: {
        method: {get: ['gimme']},
        option: {qs: ['search']},
        custom: {request: ['snatch'], method: []},
        define: {
          method: function (arg) {
            if (this._options.qs) {
              this._options.qs.b = arg
            }
            else {
              this._options.qs = {b: arg}
            }
            return this
          }
        }
      },
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider
        .gimme('me')
        .search({a: 1})
        .method(2)
        .snatch((_err, res, body) => {
          t.equal(body, '/api/me?a=1&b=2')
          done()
        })
    })

    after((done) => {
      server.close(done)
    })
  })

  describe('throw', () => {

    it('missing provider option', () => {
      t.throws(() => {
        purest()
      }, 'Purest: provider option is required!')
    })
    it('missing config option', () => {
      t.throws(() => {
        purest({provider: 'purest'})
      }, 'Purest: config option is required!')
    })
    it('missing config option', () => {
      t.throws(() => {
        purest({provider: 'purest', config: {}})
      }, 'Purest: non existing provider!')
    })

    it('config: missing __path key', () => {
      t.throws(() => {
        purest({provider: 'purest',
          config: {purest: {
            'http://localhost:6767': {
              'api/{endpoint}': {}
            }
          }
        }})
      }, 'Purest: __path key is required!')
    })
    it('config: missing __path.alias key', () => {
      t.throws(() => {
        purest({provider: 'purest',
          config: {purest: {
            'http://localhost:6767': {
              'api/{endpoint}': {
                __path: {}
              }
            }
          }
        }})
      }, 'Purest: __path.alias key is required!')
    })

    it('non existing alias', () => {
      t.throws(() => {
        purest({provider: 'purest', api: 'test',
          config: {purest: {
            'http://localhost:6767': {
              'api/{endpoint}': {
                __path: {alias: 'name'}
              }
            }
          }
        }})
      }, 'Purest: non existing alias!')
    })
  })
})
