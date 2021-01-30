
var t = require('assert').strict
var http = require('http')
var purest = require('../')

describe('client', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      t.deepEqual(req.headers, {
        authorization: 'Bearer token',
        'user-agent': 'purest',
        host: 'localhost:3000',
        connection: 'close'
      })
      if (req.url === '/') {
        res.end('hi')
      }
      else if (req.url === '/path') {
        res.end('path')
      }
    })
    server.listen(3000, done)
  })

  after((done) => {
    server.close(done)
  })

  it('request-compose', async () => {
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

  it('default endpoint', async () => {
    var client = purest({
      config: {
        purest: {
          default: {
            domain: 'http://localhost:3000',
            path: '{path}'
          }
        }
      },
      provider: 'purest'
    })

    var {res, body} = await client({
      get: 'path',
      headers: {
        authorization: 'Bearer token',
        'user-agent': 'purest'
      }
    })
    t.equal(body, 'path')

    var {res, body} = await client
      .get('path')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .request()
    t.equal(body, 'path')

    var {res, body} = await client()
      .get('path')
      .headers({
        authorization: 'Bearer token',
        'user-agent': 'purest'
      })
      .request()
    t.equal(body, 'path')
  })

  it('auth method', async () => {
    var client = purest({
      config: {
        purest: {
          default: {
            domain: 'http://localhost:3000',
            path: '{path}',
            headers: {
              authorization: 'Bearer $auth',
              'user-agent': 'purest'
            }
          }
        }
      },
      provider: 'purest'
    })

    var {res, body} = await client({
      get: 'path',
      auth: 'token',
    })
    t.equal(body, 'path')

    var {res, body} = await client
      .get('path')
      .auth('token')
      .request()
    t.equal(body, 'path')
  })

  it('explicit endpoint', async () => {
    var client = purest({
      config: {
        purest: {
          endpoint: {
            domain: 'http://localhost:3000',
            path: '{path}',
            headers: {
              authorization: 'Bearer $auth',
              'user-agent': 'purest'
            }
          }
        }
      },
      provider: 'purest'
    })

    var {res, body} = await client({
      endpoint: 'endpoint',
      get: 'path',
      auth: 'token',
    })
    t.equal(body, 'path')

    var {res, body} = await client
      .endpoint('endpoint')
      .get('path')
      .auth('token')
      .request()
    t.equal(body, 'path')

    var {res, body} = await client('endpoint')
      .get('path')
      .auth('token')
      .request()
    t.equal(body, 'path')
  })

  it('method alias', async () => {
    var client = purest({
      config: {
        purest: {
          endpoint: {
            domain: 'http://localhost:3000',
            path: '{path}',
            headers: {
              authorization: 'Bearer $auth',
              'user-agent': 'purest'
            }
          }
        }
      },
      provider: 'purest'
    })

    var {res, body} = await client({
      query: 'endpoint',
      select: 'path',
      auth: 'token',
    })
    t.equal(body, 'path')

    var {res, body} = await client
      .query('endpoint')
      .select('path')
      .auth('token')
      .request()
    t.equal(body, 'path')
  })

  it('ctor defaults', async () => {
    var client = purest({
      config: {
        purest: {
          endpoint: {
            domain: 'http://localhost:3000',
            path: '{path}',
            headers: {
              authorization: 'Bearer $auth',
              'user-agent': 'purest'
            }
          }
        }
      },
      provider: 'purest',
      defaults: {
        auth: 'token'
      }
    })

    var {res, body} = await client({
      query: 'endpoint',
      select: 'path',
    })
    t.equal(body, 'path')

    var {res, body} = await client
      .query('endpoint')
      .select('path')
      .request()
    t.equal(body, 'path')
  })

  it('custom method alias', async () => {
    var client = purest({
      config: {
        purest: {
          endpoint: {
            domain: 'http://localhost:3000',
            path: '{path}',
            headers: {
              authorization: 'Bearer $auth',
              'user-agent': 'purest'
            }
          }
        }
      },
      provider: 'purest',
      defaults: {
        auth: 'token'
      },
      methods: {
        get: ['fetch']
      }
    })

    var {res, body} = await client({
      query: 'endpoint',
      fetch: 'path',
    })
    t.equal(body, 'path')

    var {res, body} = await client
      .query('endpoint')
      .fetch('path')
      .request()
    t.equal(body, 'path')
  })

})
