
var t = require('assert')
var http = require('http')
var purest = require('../')({
  request: require('@request/client')
})


describe('basic', () => {
  var provider = purest({api: 'basic', provider: 'purest', config: {purest: {
    'http://localhost:6767': {
      'api/{endpoint}': {
        __path: {alias: '__default'}
      }
    }
  }}})

  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(req.method + ' ' + req.url)
    })
    server.listen(6767, done)
  })

  it('request(url, options, callback)', (done) => {
    provider('user/profile', {qs: {a: 1}}, (_err, res, body) => {
      t.equal(body, 'GET /api/user/profile?a=1')
      done()
    })
  })

  it('request[VERB](url, options, callback)', (done) => {
    provider.post('user/profile', {qs: {a: 1}}, (_err, res, body) => {
      t.equal(body, 'POST /api/user/profile?a=1')
      done()
    })
  })

  after((done) => {
    server.close(done)
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
      .request((_err, res, body) => {
        t.equal(body, '/api/user/profile?a=1&b=2')
        done()
      })
  })

  after((done) => server.close(done))
})
