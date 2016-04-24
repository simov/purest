
var t = require('assert')
var http = require('http')
var client = require('@request/client')
var purest = require('../')(client)


describe('basic', () => {
  var provider = purest({basic: true, provider: 'purest', config: {purest: {
    'http://localhost:6767': {
      'api/{endpoint}': {
        __path: {alias: '__default'}
      }
    }
  }}})

  describe('function', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => {
        res.end(req.url)
      })
      server.listen(6767, done)
    })

    it('url, options, callback', (done) => {
      provider('user/profile', {qs: {a: 1}}, (err, res, body) => {
        t.equal(body, '/api/user/profile?a=1')
        done()
      })
    })

    it('url, options', (done) => {
      provider('user/profile', {qs: {a: 1}, callback: (err, res, body) => {
        t.equal(body, '/api/user/profile?a=1')
        done()
      }})
    })

    it('url, callback', (done) => {
      provider('user/profile', (err, res, body) => {
        t.equal(body, '/api/user/profile')
        done()
      })
    })

    it('options, callback', (done) => {
      provider({url: 'user/profile', qs: {a: 1}}, (err, res, body) => {
        t.equal(body, '/api/user/profile?a=1')
        done()
      })
    })

    it('options', (done) => {
      provider({url: 'user/profile', qs: {a: 1}, callback: (err, res, body) => {
        t.equal(body, '/api/user/profile?a=1')
        done()
      }})
    })

    after((done) => {
      server.close(done)
    })
  })

  describe('HTTP verbs', () => {
    var server

    before((done) => {
      server = http.createServer()
      server.on('request', (req, res) => {
        res.end(req.method + ' ' + req.url)
      })
      server.listen(6767, done)
    })

    it('url, options, callback', (done) => {
      provider.post('user/profile', {qs: {a: 1}}, (err, res, body) => {
        t.equal(body, 'POST /api/user/profile?a=1')
        done()
      })
    })

    after((done) => {
      server.close(done)
    })
  })
})

describe('query', () => {
  var server, provider

  before((done) => {
    provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        }
      }
    }}})

    server = http.createServer()
    server.on('request', (req, res) => res.end(req.url))
    server.listen(6767, done)
  })

  it('options', (done) => {
    provider
      .get('user/profile')
      .qs({a: 1})
      .options({qs: {b: 2}})
      .request((err, res, body) => {
        t.equal(body, '/api/user/profile?a=1&b=2')
        done()
      })
  })

  after((done) => server.close(done))
})
