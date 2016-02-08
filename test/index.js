
var http = require('http')
var should = require('should')
var purest = require('../')


describe('aliases', () => {
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
      .where({a: 'b'})
      .callback((err, res, body) => {
        should.equal(body, '/?a=b')
        done()
      })
      .submit()
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
      .where({a: 'b'})
      .callback((err, res, body) => {
        should.equal(body, '/api/user/profile?a=b')
        done()
      })
      .submit()
  })

  it('named', (done) => {
    var provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        },
        'api/[version]/{endpoint}': {
          __path: {alias: 'picture', version: '1.0'}
        }
      }
    }}})
    provider
      .query('picture')
      .select('uploads')
      .where({a: 'b'})
      .callback((err, res, body) => {
        should.equal(body, '/api/1.0/uploads?a=b')
        done()
      })
      .submit()
  })

  it('named - array', (done) => {
    var provider = purest({provider: 'purest', config: {purest: {
      'http://localhost:6767': {
        'api/{endpoint}': {
          __path: {alias: '__default'}
        },
        'api/[version]/{endpoint}': {
          __path: {alias: ['picture', 'thumb'], version: '1.0'}
        }
      }
    }}})
    provider
      .query('thumb')
      .select('uploads')
      .where({a: 'b'})
      .callback((err, res, body) => {
        should.equal(body, '/api/1.0/uploads?a=b')
        done()
      })
      .submit()
  })

  after((done) => {
    server.close(done)
  })
})
