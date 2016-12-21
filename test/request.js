
var t = require('assert')
var http = require('http')
var client = require('@request/client')
var request = require('request')
var Purest = require('../')


describe('request', () => {
  describe('throw', () => {
    it('callback', (done) => {
      var purest = Purest({request: client})
      var provider = purest({provider: 'purest',
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider.query('test')
        .select('me')
        .request((err, res, body) => {
          t.equal(err.message, 'Purest: non existing alias!')
          done()
        })
    })
    it('promise', (done) => {
      var purest = Purest({request: client, promise: Promise})
      var provider = purest({provider: 'purest',
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider.query('test')
        .select('me')
        .request()
        .catch((err) => {
          t.equal(err.message, 'Purest: non existing alias!')
          done()
        })
    })
  })

  describe('parse JSON by default', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => {
        res.writeHead(202)
        res.end(JSON.stringify({a: 1}))
      })
      server.listen(6767, done)
    })

    it('request next', (done) => {
      var purest = Purest({request: client})
      var provider = purest({provider: 'purest',
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider
        .select('me')
        .request((_err, res, body) => {
          t.deepEqual(body, {a: 1})
          done()
        })
    })

    it('request legacy', (done) => {
      var purest = Purest({request: request})
      var provider = purest({provider: 'purest',
      config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
      provider
        .select('me')
        .request((_err, res, body) => {
          t.deepEqual(body, {a: 1})
          done()
        })
    })

    after((done) => {
      server.close(done)
    })
  })

  describe('defer', () => {
    var server, provider

    function init (promise) {
      var purest = Purest({request: client, promise})
      provider = purest({provider: 'purest', config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {
              alias: '__default',
              auth: {auth: {bearer: '[0]'}}
            }
          }
        }
      }}, methods: {custom: {refresh: []}, define: {refresh: (options) => {
        options.defer = (done) => {
          process.nextTick(() => {
            options.auth.bearer = 't2'
            done()
          })
        }
      }}}})
    }

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => res.end(req.headers.authorization))
      server.listen(6767, done)
    })

    it('request with callback', (done) => {
      init()
      provider
        .get('user/profile')
        .auth('t1')
        .refresh()
        .request((_err, res, body) => {
          t.equal(body, 'Bearer t2')
          done()
        })
    })
    it('promise', (done) => {
      init(Promise)
      provider
        .get('user/profile')
        .auth('t1')
        .refresh()
        .request()
        .then((result) => {
          t.equal(result[1], 'Bearer t2')
          done()
        })
        .catch(done)
    })

    after((done) => server.close(done))
  })
})
