
var should = require('should')
var Purest = require('../../')
  , utils = require('../../lib/utils')


describe('utils oauth', function () {
  it('ctor key/secret only - hackpad', function () {
    var p = new Purest({provider:'twitter', key:'k', secret:'s'})
      , options = {}
    utils.oauth.call(p, options)
    options.oauth.consumer_key.should.equal('k')
    options.oauth.consumer_secret.should.equal('s')
  })
  it('ctor key/secret + request token/secret', function () {
    var p = new Purest({provider:'twitter', key:'k', secret:'s'})
      , options = {oauth:{token:'t', secret:'ts'}}
    utils.oauth.call(p, options)
    options.oauth.consumer_key.should.equal('k')
    options.oauth.consumer_secret.should.equal('s')
  })
  it('request consumer_key/consumer_secret overrides ctor key/secret', function () {
    var p = new Purest({provider:'twitter', key:'k', secret:'s'})
      , options = {oauth:{
        consumer_key:'ck', consumer_secret:'cs', token:'t', secret:'s'}}
    utils.oauth.call(p, options)
    options.oauth.consumer_key.should.equal('ck')
    options.oauth.consumer_secret.should.equal('cs')
  })
  it('request token_secret', function () {
    var p = new Purest({provider:'twitter', key:'k', secret:'s'})
      , options = {oauth:{token:'t', token_secret:'ts'}}
    utils.oauth.call(p, options)
    options.oauth.token.should.equal('t')
    options.oauth.token_secret.should.equal('ts')
  })
  it('request secret shortcut', function () {
    var p = new Purest({provider:'twitter', key:'k', secret:'s'})
      , options = {oauth:{token:'t', secret:'ts'}}
    utils.oauth.call(p, options)
    options.oauth.token.should.equal('t')
    options.oauth.token_secret.should.equal('ts')
  })
})

describe('utils response', function () {
  it('don\'t throw error on missing callback', function () {
    utils.response()(null, {}, {})
  })
  it('return on error', function () {
    utils.response(function (err, res, body) {
      err.should.be.an.instanceOf(Error)
    })(new Error())
  })

  describe('parse string response', function () {
    it('content-encoding: application/json', function (done) {
      utils.response(function (err, res, body) {
        if (err) return done(err)
        should.deepEqual(body, {data:'data'})
        done()
      })(
        null,
        {statusCode:200,headers:{'content-encoding':'application/json'}},
        '{"data":"data"}'
      )
    })
    it('content-type: text/javascript', function (done) {
      utils.response(function (err, res, body) {
        if (err) return done(err)
        should.deepEqual(body, {data:'data'})
        done()
      })(
        null,
        {statusCode:200,headers:{'content-type':'text/javascript'}},
        '{"data":"data"}'
      )
    })
    it('content-type: application/json', function (done) {
      utils.response(function (err, res, body) {
        if (err) return done(err)
        should.deepEqual(body, {data:'data'})
        done()
      })(
        null,
        {statusCode:200,headers:{'content-type':'application/json'}},
        '{"data":"data"}'
      )
    })
    it('handle flickr response', function (done) {
      utils.response(function (err, res, body) {
        if (err) return done(err)
        should.deepEqual(body, {data:'data'})
        done()
      })(
        null,
        {statusCode:200,headers:{'content-type':'text/javascript'}},
        'jsonFlickrApi({"data":"data"})'
      )
    })
    it('return parse error on malformed json', function (done) {
      utils.response(function (err, res, body) {
        err.message.should.equal('JSON parse error!')
        body.should.equal('<html>')
        done()
      })(
        null,
        {statusCode:200,headers:{'content-encoding':'application/json'}},
        '<html>'
      )
    })
  })

  it('return error on non successful status code', function (done) {
    utils.response(function (err, res, body) {
      should.deepEqual(err, {data:'data'})
      should.deepEqual(body, {data:'data'})
      done()
    })(
      null,
      {statusCode:500,headers:{'content-encoding':'application/json'}},
      '{"data":"data"}'
    )
  })
  it('succeed on JSON body', function (done) {
    utils.response(function (err, res, body) {
      if (err) return done(err)
      should.deepEqual(body, {data:'data'})
      done()
    })(null, {statusCode:200,headers:{}}, {data:'data'})
  })
})
