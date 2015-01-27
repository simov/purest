
var fs = require('fs')
var path = require('path')
var should = require('should')
var Purest = require('../../lib/provider')
var providers = require('../../config/providers')


describe('refresh', function () {
  function error (err, done) {
    return (err instanceof Error)
      ? done(err)
      : (console.log(err) || done(new Error('Network error!')))
  }

  require('../utils/credentials')
  var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
  }
  var refresh = require('../utils/refresh')

  var p = {}
  before(function () {
    for (var name in providers) {
      var options = {
        provider:name,
        defaults:{headers:{'User-Agent':'Purest'}}
      }
      if (providers[name].__provider.oauth) {
        options.key = cred.app[name].key
        options.secret = cred.app[name].secret
      }
      p[name] = new Purest(options)
    }
  })

  it('no refresh method', function () {
    try {
      p.twitter.refresh()
    } catch (err) {
      err.message.should.equal(
        "Property 'refresh' of object #<Provider> is not a function")
    }
  })

  // http://about.me/developer/api/docs/#login
  describe('aboutme', function () {
    var _body = null
    it('refresh', function (done) {
      p.aboutme.refresh(
        cred.user.aboutme.apikey,
        cred.user.aboutme.user,
        cred.user.aboutme.pass,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'status', 'expires_in'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('aboutme', _body.access_token)
    })
  })
  // https://github.com/Asana/oauth-examples#token-exchange-endpoint
  describe('asana', function () {
    var _body = null
    it('refresh', function (done) {
      p.asana.refresh(
        cred.app.asana,
        cred.user.asana.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in', 'data'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('asana', _body.access_token)
    })
  })
  // http://api-doc.assembla.com/content/authentication.html#refresh_tokens
  describe('assembla', function () {
    var _body = null
    it('refresh', function (done) {
      p.assembla.refresh(
        cred.app.assembla,
        cred.user.assembla.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('assembla', _body.access_token)
    })
  })
  // https://github.com/basecamp/api/blob/master/sections/authentication.md
  describe('basecamp', function () {
    var _body = null
    it('refresh', function (done) {
      p.basecamp.refresh(
        cred.app.basecamp,
        cred.user.basecamp.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'expires_in', 'access_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('basecamp', _body.access_token)
    })
  })
  // https://developers.box.com/docs/#oauth-2-token
  describe('box', function () {
    var _body = null
    it('refresh', function (done) {
      p.box.refresh(
        cred.app.box,
        cred.user.box.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'expires_in', 'restricted_to',
          'refresh_token', 'token_type'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('box', _body.access_token, _body.refresh_token)
    })
  })
  // https://api.coinbase.com
  describe('coinbase', function () {
    var _body = null
    it('refresh', function (done) {
      p.coinbase.refresh(
        cred.app.coinbase,
        cred.user.coinbase.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in',
          'refresh_token', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('coinbase', _body.access_token, _body.refresh_token)
    })
  })
  // https://developer.dailymotion.com/documentation#using-refresh-tokens
  describe('dailymotion', function () {
    var _body = null
    it('refresh', function (done) {
      p.dailymotion.refresh(
        cred.app.dailymotion,
        cred.user.dailymotion.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in',
          'refresh_token', 'scope', 'uid'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('dailymotion', _body.access_token)
    })
  })
  // https://www.deviantart.com/developers/authentication
  describe('deviantart', function () {
    var _body = null
    it('refresh', function (done) {
      p.deviantart.refresh(
        cred.app.deviantart,
        cred.user.deviantart.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in',
          'refresh_token', 'scope', 'status'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('deviantart', _body.access_token, _body.refresh_token)
    })
  })
  // https://developers.digitalocean.com/oauth/
  describe('digitalocean', function () {
    var _body = null
    it('refresh', function (done) {
      p.digitalocean.refresh(
        cred.app.digitalocean,
        cred.user.digitalocean.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in',
          'refresh_token', 'scope', 'uid','info'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('digitalocean', _body.access_token, _body.refresh_token)
    })
  })
  // https://disqus.com/api/docs/auth/
  describe('disqus', function () {
    var _body = null
    it('refresh', function (done) {
      p.disqus.refresh(
        cred.app.disqus,
        cred.user.disqus.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'username', 'user_id', 'access_token', 'expires_in',
          'token_type', 'state', 'scope', 'refresh_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('disqus', _body.access_token, _body.refresh_token)
    })
  })
  // https://developers.edmodo.com/edmodo-connect/docs/#connecting-your-application
  describe('edmodo', function () {
    var _body = null
    it('refresh', function (done) {
      p.edmodo.refresh(
        cred.app.edmodo,
        cred.user.edmodo.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in', 'refresh_token', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('edmodo', _body.access_token, _body.refresh_token)
    })
  })
  // https://www.flowdock.com/api/authentication
  describe('flowdock', function () {
    var _body = null
    it('refresh', function (done) {
      p.flowdock.refresh(
        cred.app.flowdock,
        cred.user.flowdock.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in',
          'refresh_token', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('flowdock', _body.access_token, _body.refresh_token)
    })
  })
  // https://developers.google.com/accounts/docs/OAuth2WebServer?hl=fr#refresh
  describe('google', function () {
    var _body = null
    it('refresh', function (done) {
      p.google.refresh(
        cred.app.google,
        cred.user.google.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in', 'id_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('google', _body.access_token)
    })
  })
  // https://github.com/harvesthq/api/blob/master/Authentication/OAuth%202.0.md
  describe('harvest', function () {
    var _body = null
    it('refresh', function (done) {
      p.harvest.refresh(
        cred.app.harvest,
        cred.user.harvest.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'refresh_token', 'token_type', 'expires_in'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('harvest', _body.access_token)
    })
  })
  // https://devcenter.heroku.com/articles/oauth#token-refresh
  describe('heroku', function () {
    var _body = null
    it('refresh', function (done) {
      p.heroku.refresh(
        cred.app.heroku,
        cred.user.heroku.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'expires_in', 'refresh_token',
          'token_type', 'user_id', 'session_nonce'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('heroku', _body.access_token)
    })
  })
  // https://api.imgur.com/oauth2#refresh_tokens
  describe('imgur', function () {
    var _body = null
    it('refresh', function (done) {
      p.imgur.refresh(
        cred.app.imgur,
        cred.user.imgur.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'expires_in', 'token_type',
          'scope', 'refresh_token', 'account_id',
          'account_username'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('imgur', _body.access_token, _body.refresh_token)
    })
  })
  // https://jawbone.com/up/developer/authentication
  describe('jawbone', function () {
    var _body = null
    it('refresh', function (done) {
      p.jawbone.refresh(
        cred.app.jawbone,
        cred.user.jawbone.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in', 'refresh_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('jawbone', _body.access_token, _body.refresh_token)
    })
  })
  // http://msdn.microsoft.com/en-us/library/hh243647.aspx
  describe('live', function () {
    var _body = null
    it('refresh', function (done) {
      p.live.refresh(
        cred.app.live,
        cred.user.live.refresh,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'token_type', 'expires_in', 'scope',
          'access_token', 'refresh_token', 'authentication_token',
          'user_id'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('live', _body.access_token, _body.refresh_token)
    })
  })
  // https://developer.paypal.com/docs/api/#grant-token-from-refresh-token
  describe('paypal', function () {
    var _body = null
    it('refresh', function (done) {
      p.paypal.refresh(
        cred.app.paypal,
        cred.user.paypal.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'token_type', 'expires_in', 'access_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('paypal', _body.access_token)
    })
  })
  // https://developers.podio.com/authentication
  describe('podio', function () {
    var _body = null
    it('refresh', function (done) {
      p.podio.refresh(
        cred.app.podio,
        cred.user.podio.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'ref', 'expires_in', 'refresh_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('podio', _body.access_token)
    })
  })
  // https://redbooth.com/api/authentication/
  describe('redbooth', function () {
    var _body = null
    it('refresh', function (done) {
      p.redbooth.refresh(
        cred.app.redbooth,
        cred.user.redbooth.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in',
          'refresh_token', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('redbooth', _body.access_token, _body.refresh_token)
    })
  })
  // https://github.com/reddit/reddit/wiki/OAuth2#refreshing-the-token
  describe('reddit', function () {
    var _body = null
    it('refresh', function (done) {
      p.reddit.refresh(
        cred.app.reddit,
        cred.user.reddit.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('reddit', _body.access_token)
    })
  })
  // https://www.salesforce.com/us/developer/docs/api_rest/
  describe('salesforce', function () {
    var _body = null
    it('refresh', function (done) {
      p.salesforce.refresh(
        cred.app.salesforce,
        cred.user.salesforce.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'id', 'issued_at', 'scope',
          'instance_url', 'token_type', 'signature',
          'access_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('salesforce', _body.access_token)
    })
  })
  // https://developers.soundcloud.com/docs/api/reference#token
  describe('soundcloud', function () {
    var _body = null
    it('refresh', function (done) {
      p.soundcloud.refresh(
        cred.app.soundcloud,
        cred.user.soundcloud.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'expires_in', 'scope', 'refresh_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('soundcloud', _body.access_token, _body.refresh_token)
    })
  })
  // https://developer.spotify.com/web-api/authorization-guide/
  describe('spotify', function () {
    var _body = null
    it('refresh', function (done) {
      p.spotify.refresh(
        cred.app.spotify,
        cred.user.spotify.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('spotify', _body.access_token)
    })
  })
  // https://stripe.com/docs/connect/oauth#test-keys-for-livemode-applications
  describe('stripe', function () {
    var _body = null
    it('refresh', function (done) {
      p.stripe.refresh(
        cred.app.stripe,
        cred.user.stripe.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'livemode', 'refresh_token',
          'token_type',
          'stripe_publishable_key', 'stripe_user_id', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('stripe', _body.access_token)
    })
  })
  // https://developer.traxo.com/docs/connecting
  describe('traxo', function () {
    var _body = null
    it('refresh', function (done) {
      p.traxo.refresh(
        cred.app.traxo,
        cred.user.traxo.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'expires_in', 'token_type',
          'scope', 'refresh_token'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('traxo', _body.access_token, _body.refresh_token)
    })
  })
  // https://github.com/justintv/Twitch-API/blob/master/authentication.md
  describe('twitch', function () {
    var _body = null
    it('refresh', function (done) {
      p.twitch.refresh(
        cred.app.twitch,
        cred.user.twitch.refresh,
      function (err, res, body) {
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'refresh_token', 'scope'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.store('twitch', _body.access_token)
    })
  })
  // https://developer.yahoo.com/oauth/guide/oauth-refreshaccesstoken.html
  describe('yahoo', function () {
    var _body = null
    it('refresh', function (done) {
      p.yahoo.refresh(
        cred.app.yahoo,
        cred.user.yahoo,
        cred.user.yahoo.session,
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'oauth_token', 'oauth_token_secret', 'oauth_expires_in',
          'oauth_session_handle', 'oauth_authorization_expires_in',
          'xoauth_yahoo_guid'
        ])
        _body = body
        done()
      })
    })
    after(function () {
      refresh.storeOAuth1('yahoo', _body.oauth_token, _body.oauth_token_secret)
    })
  })
})
