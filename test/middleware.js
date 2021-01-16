
var t = require('assert').strict
var http = require('http')
var fs = require('fs')
var path = require('path')
var qs = require('qs')
var purest = require('../')

var file = {
  binary: path.resolve(__dirname, './fixtures/cat.png'),
}
var header =
  '--XXX\r\n' +
  'Content-Disposition: form-data; name="string"\r\n' +
  'Content-Type: text/plain\r\n' +
  '\r\n' +
  'value\r\n' +
  '--XXX\r\n' +
  'Content-Disposition: form-data; name="file"\r\n' +
  'Content-Type: application/octet-stream\r\n' +
  '\r\n'
var footer =
  '\r\n--XXX--'

describe('middleware', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/json') {
        res.writeHead(200, {'content-type': 'application/json'})
        res.end(JSON.stringify({a: {b: {c: 1}}}))
      }
      else if (req.url === '/qs') {
        res.writeHead(200, {'content-type': 'application/x-www-form-urlencoded'})
        res.end(qs.stringify({a: {b: {c: 1}}}))
      }
      else if (req.url === '/oauth') {
        res.end(req.headers.authorization)
      }
      else if (req.url === '/multipart') {
        t.equal(
          +req.headers['content-length'],
          header.length + fs.statSync(file.binary).size + footer.length,
          'content length should equal multipart header + file size + footer'
        )
        var body = ''
        req.on('data', (chunk) => body += chunk)
        req.on('end', () => {
          t.ok(
            !body.indexOf(header + '�PNG\r\n'),
            'should start with multipart header followed by file body'
          )
          res.end()
        })
        res.end()
      }
    })
    server.listen(3000, done)
  })

  after((done) => {
    server.close(done)
  })

  it('parse', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/json',
    })
    t.deepEqual(body, {a: {b: {c: 1}}})

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/qs',
    })
    t.deepEqual(body, {a: {b: {c: '1'}}})
  })

  it('oauth', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/oauth',
      oauth: {
        consumer_key: 'app_key',
        consumer_secret: 'app_secret',
        token: 'user_token',
        token_secret: 'user_secret',
      }
    })
    t.ok(body.includes('oauth_consumer_key="app_key"'))
    t.ok(body.includes('oauth_token="user_token"'))
  })

  it('multipart', async () => {
    var client = purest()

    var {res, body} = await client({
      method: 'POST',
      url: 'http://localhost:3000/multipart',
      headers: {'content-type': 'multipart/form-data; boundary=XXX'},
      multipart: {
        string: 'value',
        file: fs.readFileSync(file.binary),
      }
    })
  })

  it('logs', async () => {
    var client = purest()

    process.env.DEBUG = true

    var {res, body} = await client({
      method: 'GET',
      url: 'http://localhost:3000/json',
    })
    t.deepEqual(body, {a: {b: {c: 1}}})

    process.env.DEBUG = undefined
  })

})
