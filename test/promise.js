
var t = require('assert')
var http = require('http')
var client = require('@request/client')
var bluebird = require('bluebird')


describe('promise', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(202)
      res.end(req.url)
    })
    server.listen(6767, done)
  })

  describe('Promise', () => {
    var provider

    before(() => {
      var purest = require('../')(client, Promise)
      provider = purest({provider: 'purest', config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        },
        'http://lolhost:6767': {
          'api/{endpoint}': {
            __path: {alias: 'fail'}
          }
        }
      }}})
    })

    it('resolve', (done) => {
      provider
        .select('me')
        .where({a: 1})
        .request()
        .then((result) => {
          var res = result[0]
          var body = result[1]
          t.equal(res.statusCode, 202)
          t.equal(body, '/api/me?a=1')
          done()
        })
    })

    it('reject', (done) => {
      provider
        .query('fail')
        .select('me')
        .where({a: 1})
        .request()
        .catch((err) => {
          t.equal(err.message, 'getaddrinfo ENOTFOUND lolhost lolhost:6767')
          done()
        })
    })
  })

  describe('bluebird', () => {
    var provider

    before(() => {
      var purest = require('../')(client, bluebird)
      provider = purest({provider: 'purest', config: {purest: {
        'http://localhost:6767': {
          'api/{endpoint}': {
            __path: {alias: '__default'}
          }
        }
      }}})
    })

    it('spread', (done) => {
      provider
        .select('me')
        .where({a: 1})
        .request()
        .spread((res, body) => {
          t.equal(res.statusCode, 202)
          t.equal(body, '/api/me?a=1')
          done()
        })
    })
  })

  after((done) => {
    server.close(done)
  })
})
