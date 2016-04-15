
var t = require('assert')
var _transform = require('../lib/transform')


describe('oauth', () => {
  it('ctor key/secret only (hackpad)', () => {
    var transform = _transform({key: 'key', secret: 'secret'})
    var options = {}
    transform.oauth(options)
    t.deepEqual(options, {oauth: {
      consumer_key: 'key',
      consumer_secret: 'secret'
    }})
  })
  it('request consumer_key/consumer_secret overrides ctor key/secret', () => {
    var transform = _transform({key: 'key', secret: 'secret'})
    var options = {oauth: {consumer_key: 'key2', consumer_secret: 'secret2'}}
    transform.oauth(options)
    t.deepEqual(options, {oauth: {
      consumer_key: 'key2', consumer_secret: 'secret2'
    }})
  })

  it('access token_secret', () => {
    var transform = _transform({key: 'key', secret: 'secret'})
    var options = {oauth: {token: 'token', token_secret: 'secret'}}
    transform.oauth(options)
    t.deepEqual(options, {oauth: {
      consumer_key: 'key',
      consumer_secret: 'secret',
      token: 'token',
      token_secret: 'secret'
    }})
  })
  it('access secret', () => {
    var transform = _transform({key: 'key', secret: 'secret'})
    var options = {oauth: {token: 'token', secret: 'secret'}}
    transform.oauth(options)
    t.deepEqual(options, {oauth: {
      consumer_key: 'key',
      consumer_secret: 'secret',
      token: 'token',
      token_secret: 'secret'
    }})
  })
})

describe('response', () => {
  var transform

  before(() => {
    transform = _transform()
  })

  it('return body as err on error status code', () => {
    transform.callback((err, res, body) => {
      t.deepEqual(err, {a: 1})
      t.deepEqual(body, {a: 1})
    })(
      null,
      {statusCode: 500, headers: {'content-encoding': 'application/json'}},
      {a: 1}
    )
  })

  describe('JSONP', () => {
    it('content-encoding: application/json', () => {
      transform.callback((err, res, body) => {
        t.deepEqual(body, {a: 1})
      })(
        null,
        {statusCode: 200, headers: {'content-encoding': 'application/json'}},
        'function(' + JSON.stringify({a: 1}) + ')'
      )
    })
    it('content-type: text/javascript', () => {
      transform.callback((err, res, body) => {
        t.deepEqual(body, {a: 1})
      })(
        null,
        {statusCode: 200, headers: {'content-type': 'text/javascript'}},
        'function(' + JSON.stringify({a: 1}) + ')'
      )
    })
    it('content-type: application/json', () => {
      transform.callback((err, res, body) => {
        t.deepEqual(body, {a: 1})
      })(
        null,
        {statusCode: 200, headers: {'content-type': 'application/json'}},
        'function(' + JSON.stringify({a: 1}) + ')'
      )
    })
    it('return parse error on malformed json', () => {
      transform.callback((err, res, body) => {
        t.equal(err.message, 'Purest: JSON parse error')
        t.equal(body, 'function({a: 1})')
      })(
        null,
        {statusCode: 200, headers: {'content-encoding': 'application/json'}},
        'function({a: 1})'
      )
    })
  })
})
