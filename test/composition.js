
var t = require('assert').strict
var http = require('http')
var fs = require('fs')
var path = require('path')
var purest = require('../')
var file = {
  binary: path.resolve(__dirname, './fixtures/cat.png'),
}

describe('composition', () => {
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
      else if (req.url === '/stream') {
        t.deepEqual(req.headers, {
          authorization: 'Bearer token',
          'user-agent': 'purest',
          host: 'localhost:3000',
          connection: 'close',
          'content-length': '17552'
        })
        res.writeHead(200, {'content-length': fs.statSync(file.binary).size})
        req.pipe(res)
      }
    })
    server.listen(3000, done)
  })

  after((done) => {
    server.close(done)
  })

  it('client', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000',
      headers: {
        authorization: 'Bearer token',
        'user-agent': 'purest'
      }
    })
    t.equal(body, 'hi')

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

  it('buffer', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000',
      headers: {
        authorization: 'Bearer token',
        'user-agent': 'purest'
      },
      buffer: true
    })
    t.ok(Buffer.from('hi').equals(body))

    var {req, body} = await client
      .method('GET')
      .url('http://localhost:3000')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .buffer()
    t.ok(Buffer.from('hi').equals(body))
  })

  it('stream - file -> req -> req -> file', async () => {
    var client = purest()

    var {res} = await client({
      method: 'GET',
      url: 'http://localhost:3000/stream',
      headers: {
        authorization: 'Bearer token',
        'user-agent': 'purest'
      },
      body: fs.createReadStream(file.binary, {highWaterMark: 1024}),
      stream: true
    })
    var {body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/stream',
      headers: {
        authorization: 'Bearer token',
        'user-agent': 'purest'
      },
      body: res,
      buffer: true
    })
    t.equal(
      fs.statSync(file.binary).size,
      body.length,
      'input file size should equal response body length'
    )

    var {res} = await client
      .method('GET')
      .url('http://localhost:3000/stream')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .body(fs.createReadStream(file.binary, {highWaterMark: 1024}))
      .stream()
    var {body} = await client
      .method('GET')
      .url('http://localhost:3000/stream')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .body(res)
      .buffer()
    t.equal(
      fs.statSync(file.binary).size,
      body.length,
      'input file size should equal response body length'
    )
  })

})
