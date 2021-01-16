
var t = require('assert').strict
var http = require('http')
var purest = require('../')

describe('exec', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/') {
        t.deepEqual(req.headers, {
          authorization: 'Bearer token',
          'user-agent': 'purest',
          host: 'localhost:3000',
          connection: 'close'
        })
        res.end('hi')
      }
      else if (req.url === '/path') {
        t.deepEqual(req.headers, {
          authorization: 'Bearer token',
          'user-agent': 'simov',
          host: 'localhost:3000',
          connection: 'close'
        })
        res.end('hi')
      }
    })
    server.listen(3000, done)
  })

  after((done) => {
    server.close(done)
  })

  it('method', async () => {
    var client = purest()

    var {req, body} = await client
      .method('GET')
      .url('http://localhost:3000')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .request()
    t.equal(body, 'hi')
  })

  it('default alias', async () => {
    var client = purest()

    var {req, body} = await client
      .method('GET')
      .url('http://localhost:3000')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .submit()
    t.equal(body, 'hi')
  })

  it('custom alias', async () => {
    var client = purest({
      methods: {
        request: ['pull']
      }
    })

    var {req, body} = await client
      .method('GET')
      .url('http://localhost:3000')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .pull()
    t.equal(body, 'hi')
  })

  it('accept options', async () => {
    var client = purest()

    var {req, body} = await client
      .method('GET')
      .url('http://localhost:3000/path')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .request({
        headers: {
          'user-agent': 'simov'
        }
      })
    t.equal(body, 'hi')
  })

})
