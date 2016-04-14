
var t = require('assert')
var http = require('http')
var client = require('@request/client')
var purest = require('../')(client)


describe('request', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(202)
      res.end(req.url)
    })
    server.listen(6767, done)
  })

  it('before.all', (done) => {
    var provider = purest({provider: 'purest',
    before: {
      all: function (options) {
        options.qs = {a: 1}
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
      .select('me')
      .request((err, res, body) => {
        t.equal(body, '/api/me?a=1')
        done()
      })
  })

  after((done) => {
    server.close(done)
  })
})
