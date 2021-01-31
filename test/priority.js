
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
    t.equal(body, 'root', 'method overrides verb method')
  })

  it('url', async () => {
    var client = purest({
      provider: 'purest',
      config: {
        purest: {
          default: {
            origin: 'http://localhost:3000',
            path: 'config/{path}'
          }
        }
      }
    })

    var {res, body} = await client({
      get: 'path'
    })
    t.equal(body, 'config/path', 'config path')

    var {res, body} = await client({
      path: '{path}',
      get: 'path'
    })
    t.equal(body, 'path', 'override config path')

    var {res, body} = await client({
      url: 'http://localhost:3000',
      path: '{path}',
      get: 'path'
    })
    t.equal(body, 'root', 'url overrides all')
  })

  it('alias', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/alias',
      where: 'b=2',
    })
    t.equal(body, '/alias?b=2', 'alias sets method value')

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/alias',
      qs: 'a=1',
      where: 'b=2',
    })
    t.equal(body, '/alias?a=1', 'method overrides alias')
  })

  it('auth', async () => {
    var client = purest({
      provider: 'purest',
      config: {
        purest: {
          default: {
            origin: 'http://localhost:3000',
            path: 'auth',
            headers: {authorization: 'Bearer $auth'}
          }
        }
      }
    })

    var {res, body} = await client({})
    t.equal(body, 'Bearer $auth', 'no replacement')

    var {res, body} = await client({
      auth: 'token'
    })
    t.equal(body, 'Bearer token', 'default replacement')

    var {res, body} = await client({
      headers: {authorization: 'Bearer token'}
    })
    t.equal(body, 'Bearer token', 'headers override')

    var {res, body} = await client({
      auth: {user: 'simov', pass: 'purest'}
    })
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0', 'basic auth')

    var client = purest({
      provider: 'purest',
      config: {
        purest: {
          default: {
            origin: 'http://localhost:3000',
            path: 'auth',
            auth: {user: '$auth', pass: '$auth'}
          }
        }
      },
      methods: {
        auth: ['basic']
      }
    })

    var {res, body} = await client({
      auth: ['simov', 'purest']
    })
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0', 'array option')

    var {res, body} = await client
      .auth('simov', 'purest')
      .request()
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0', 'default method')

    var {res, body} = await client
      .basic('simov', 'purest')
      .request()
    t.equal(body, 'Basic c2ltb3Y6cHVyZXN0', 'method alias')
  })

  it('extend', async () => {
    var client = purest({
      provider: 'purest',
      config: {
        purest: {
          default: {
            origin: 'http://localhost:3000',
            path: 'extend',
            headers: {
              config: 'a', defaults: 'b', request: 'c'
            }
          }
        }
      },
      defaults: {
        headers: {
          defaults: 'd'
        }
      }
    })

    var {res, body} = await client({
      headers: {
        request: 'e'
      }
    })
    t.equal(body.config, 'a')
    t.equal(body.defaults, 'd')
    t.equal(body.request, 'e')
  })

})
