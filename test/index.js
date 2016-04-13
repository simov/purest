
var t = require('assert')
var http = require('http')
var client = require('@request/client')
var purest = require('../')(client)


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
