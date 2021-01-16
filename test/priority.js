
var t = require('assert').strict
var http = require('http')
var purest = require('../')

describe('priority', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      t.equal(req.method, 'GET')
      if (req.url === '/') {
        res.end('root')
      }
      else if (req.url === '/path') {
        res.end('path')
      }
      else if (req.url === '/config/path') {
        res.end('config/path')
      }
      else if (/^\/alias/.test(req.url)) {
        res.end(req.url)
      }
      else if (req.url === '/auth') {
        res.end(req.headers.authorization)
      }
      else if (req.url === '/extend') {
        res.writeHead(200, {'content-type': 'application/json'})
        res.end(JSON.stringify(req.headers))
      }
    })
    server.listen(3000, done)
  })

  after((done) => {
    server.close(done)
  })

  it('method', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000',
      post: 'path'
    })
    t.equal(body, 'root')
  })

  it('url', async () => {
    var client = purest({
      config: {
        purest: {
          default: {
            domain: 'http://localhost:3000',
            path: 'config/{path}'
          }
        }
      },
      provider: 'purest'
    })

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000',
      domain: 'http://localhost:3000',
      path: '{path}',
      get: 'path'
    })
    t.equal(body, 'root')

    var {res, body} = await client({
      domain: 'http://localhost:3000',
      path: '{path}',
      get: 'path'
    })
    t.equal(body, 'path')

    var {res, body} = await client({
      get: 'path'
    })
    t.equal(body, 'config/path')
  })

  it('alias', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/alias',
      qs: 'a=1',
      where: 'b=2',
    })
    t.equal(body, '/alias?a=1')

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/alias',
      where: 'b=2',
    })
    t.equal(body, '/alias?b=2')
  })

  it('auth', async () => {
    var client = purest({
      config: {
        purest: {
          default: {
            domain: 'http://localhost:3000',
            path: 'auth',
            headers: {authorization: 'Bearer $auth'}
          }
        }
      },
      provider: 'purest'
    })

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/auth',
      auth: {user: 'simov', pass: 'purest'}
    })
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0')

    var {res, body} = await client({
      auth: 'token'
    })
    t.equal(body, 'Bearer token')

    var client = purest({
      config: {
        purest: {
          default: {
            domain: 'http://localhost:3000',
            path: 'auth',
            auth: {user: '$auth', pass: '$auth'}
          }
        }
      },
      provider: 'purest',
      methods: {
        auth: ['basic']
      }
    })

    var {res, body} = await client({
      auth: ['simov', 'purest']
    })
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0')

    var {res, body} = await client
      .auth('simov', 'purest')
      .request()
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0')

    var {res, body} = await client
      .basic('simov', 'purest')
      .request()
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0')
  })

  it('extend', async () => {
    var client = purest({
      config: {
        purest: {
          default: {
            domain: 'http://localhost:3000',
            path: 'extend',
            headers: {
              config: 'a', defaults: 'b', request: 'c'
            }
          }
        }
      },
      provider: 'purest',
      defaults: {
        headers: {
          defaults: 'd'
        }
      }
    })

    var {res, body} = await client({
      get: '',
      headers: {
        request: 'e'
      }
    })
    t.equal(body.config, 'a')
    t.equal(body.defaults, 'd')
    t.equal(body.request, 'e')
  })

})
