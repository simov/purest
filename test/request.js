
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
})
