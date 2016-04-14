
var t = require('assert')
var http = require('http')
var client = require('@request/client')
var purest = require('../')(client)


describe('ctor', () => {

  describe('path modifiers', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => {
        res.end(req.url)
      })
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
        .request((err, res, body) => {
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
      server.on('request', (req, res) => {
        res.end(req.headers.authorization)
      })
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
        .request((err, res, body) => {
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
      server.on('request', (req, res) => {
        res.end(req.url)
      })
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
        .request((err, res, body) => {
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
      server.on('request', (req, res) => {
        res.end(req.url)
      })
      server.listen(6767, done)
    })

    it('set', (done) => {
      var provider = purest({provider: 'purest',
      methods: {
        method: {get: ['gimme']},
        option: {qs: ['search']},
        custom: {request: ['snatch']}
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
        .snatch((err, res, body) => {
          t.equal(body, '/api/me?a=1')
          done()
        })
    })

    after((done) => {
      server.close(done)
    })
  })
})

describe('alias', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(req.url)
    })
    server.listen(6767, done)
  })

  it('absolute URL', (done) => {
    var provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        }
      }
    }}})
    provider
      .select('http://localhost:6767')
      .where({a: 1})
      .request((err, res, body) => {
        t.equal(body, '/?a=1')
        done()
      })
  })

  it('__default', (done) => {
    var provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        }
      }
    }}})
    provider
      .select('user/profile')
      .where({a: 1})
      .request((err, res, body) => {
        t.equal(body, '/api/user/profile?a=1')
        done()
      })
  })

  it('named', (done) => {
    var provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        },
        'api/uploads/{endpoint}': {
          __path: {alias: 'uploads'}
        }
      }
    }}})
    provider
      .query('uploads')
      .select('picture')
      .where({a: 1})
      .request((err, res, body) => {
        t.equal(body, '/api/uploads/picture?a=1')
        done()
      })
  })

  it('named - array', (done) => {
    var provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        },
        'api/uploads/{endpoint}': {
          __path: {alias: ['uploads', 'images']}
        }
      }
    }}})
    provider
      .query('images')
      .select('picture')
      .where({a: 1})
      .request((err, res, body) => {
        t.equal(body, '/api/uploads/picture?a=1')
        done()
      })
  })

  after((done) => {
    server.close(done)
  })
})
