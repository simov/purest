
var fs = require('fs')
  , path = require('path')
  , qs = require('qs')
  , should = require('should')
  , Purest = require('../../')
  , providers = require('../../config/providers')


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
      if (providers[name].__provider && providers[name].__provider.oauth) {
        options.key = cred.app[name].key
        options.secret = cred.app[name].secret
      }
      p[name] = new Purest(options)
    }
  })

  // http://about.me/developer/api/docs/#login
  describe('aboutme', function () {
    var _body = null
    it('refresh', function (done) {
      p.aboutme.query('user')
        .update('login/' + cred.user.aboutme.user)
        .set({
          grant_type:'password',
          client_id:cred.user.aboutme.apikey,
          password:cred.user.aboutme.pass
        })
        .request(function (err, res, body) {
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
  // https://developer.act-on.com/documentation/oauth/
  describe.skip('acton', function () {
    // needs user credentials first
    var _body = null
    it('refresh', function (done) {
      p.acton.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.acton.refresh,
          client_id:cred.app.acton.key,
          client_secret:cred.app.acton.secret
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          // should.deepEqual(Object.keys(body), [

          // ])
          _body = body
          done()
        })
    })
    // after(function () {
    //   refresh.store('aboutme', _body.access_token)
    // })
  })
  // https://github.com/Asana/oauth-examples#token-exchange-endpoint
  describe('asana', function () {
    var _body = null
    it('refresh', function (done) {
      p.asana.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.asana.refresh,
          client_id:cred.app.asana.key,
          client_secret:cred.app.asana.secret
        })
        .request(function (err, res, body) {
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
      p.assembla.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.assembla.refresh,
          client_id:cred.app.assembla.key,
          client_secret:cred.app.assembla.secret
        })
        .request(function (err, res, body) {
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
      p.basecamp.query('oauth')
        .update('token')
        .set({
          type:'refresh',
          refresh_token:cred.user.basecamp.refresh,
          client_id:cred.app.basecamp.key,
          client_secret:cred.app.basecamp.secret
        })
        .request(function (err, res, body) {
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
      p.box.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.box.refresh,
          client_id:cred.app.box.key,
          client_secret:cred.app.box.secret
        })
        .request(function (err, res, body) {
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
      p.coinbase.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.coinbase.refresh,
          client_id:cred.app.coinbase.key,
          client_secret:cred.app.coinbase.secret
        })
        .request(function (err, res, body) {
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
      p.dailymotion.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.dailymotion.refresh,
          client_id:cred.app.dailymotion.key,
          client_secret:cred.app.dailymotion.secret
        })
        .request(function (err, res, body) {
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
      p.deviantart.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.deviantart.refresh,
          client_id:cred.app.deviantart.key,
          client_secret:cred.app.deviantart.secret
        })
        .request(function (err, res, body) {
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
      p.digitalocean.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.digitalocean.refresh,
          client_id:cred.app.digitalocean.key,
          client_secret:cred.app.digitalocean.secret
        })
        .request(function (err, res, body) {
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
      p.disqus.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.disqus.refresh,
          client_id:cred.app.disqus.key,
          client_secret:cred.app.disqus.secret
        })
        .request(function (err, res, body) {
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
      p.edmodo.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.edmodo.refresh,
          client_id:cred.app.edmodo.key,
          client_secret:cred.app.edmodo.secret
        })
        .request(function (err, res, body) {
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
      p.flowdock.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.flowdock.refresh,
          client_id:cred.app.flowdock.key,
          client_secret:cred.app.flowdock.secret
        })
        .request(function (err, res, body) {
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
      p.google.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.google.refresh,
          client_id:cred.app.google.key,
          client_secret:cred.app.google.secret
        })
        .request(function (err, res, body) {
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
      p.harvest.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.harvest.refresh,
          client_id:cred.app.harvest.key,
          client_secret:cred.app.harvest.secret
        })
        .request(function (err, res, body) {
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
      p.heroku.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.heroku.refresh,
          client_id:cred.app.heroku.key,
          client_secret:cred.app.heroku.secret
        })
        .request(function (err, res, body) {
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
      p.imgur.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.imgur.refresh,
          client_id:cred.app.imgur.key,
          client_secret:cred.app.imgur.secret
        })
        .request(function (err, res, body) {
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
      p.jawbone.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.jawbone.refresh,
          client_id:cred.app.jawbone.key,
          client_secret:cred.app.jawbone.secret
        })
        .request(function (err, res, body) {
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
      p.live.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.live.refresh,
          client_id:cred.app.live.key,
          client_secret:cred.app.live.secret
        })
        .request(function (err, res, body) {
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
      p.paypal.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.paypal.refresh,
          client_id:cred.app.paypal.key,
          client_secret:cred.app.paypal.secret
        })
        .request(function (err, res, body) {
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
      p.podio.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.podio.refresh,
          client_id:cred.app.podio.key,
          client_secret:cred.app.podio.secret
        })
        .request(function (err, res, body) {
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
      p.redbooth.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.redbooth.refresh,
          client_id:cred.app.redbooth.key,
          client_secret:cred.app.redbooth.secret
        })
        .request(function (err, res, body) {
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
      p.reddit.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.reddit.refresh,
          client_id:cred.app.reddit.key,
          client_secret:cred.app.reddit.secret
        })
        .request(function (err, res, body) {
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
      p.salesforce.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.salesforce.refresh,
          client_id:cred.app.salesforce.key,
          client_secret:cred.app.salesforce.secret
        })
        .request(function (err, res, body) {
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
      p.soundcloud.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.soundcloud.refresh,
          client_id:cred.app.soundcloud.key,
          client_secret:cred.app.soundcloud.secret
        })
        .request(function (err, res, body) {
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
      p.spotify.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.spotify.refresh,
          client_id:cred.app.spotify.key,
          client_secret:cred.app.spotify.secret
        })
        .request(function (err, res, body) {
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
      p.stripe.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.stripe.refresh,
          client_id:cred.app.stripe.key,
          client_secret:cred.app.stripe.secret
        })
        .request(function (err, res, body) {
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
      p.traxo.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.traxo.refresh,
          client_id:cred.app.traxo.key,
          client_secret:cred.app.traxo.secret
        })
        .request(function (err, res, body) {
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
      p.twitch.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.twitch.refresh,
          client_id:cred.app.twitch.key,
          client_secret:cred.app.twitch.secret
        })
        .request(function (err, res, body) {
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
      p.yahoo.query('oauth')
        .update('token')
        .oauth({
          consumer_key:cred.app.yahoo.key,
          consumer_secret:cred.app.yahoo.secret,
          token:cred.user.yahoo.token,
          token_secret:cred.user.yahoo.secret,
          session_handle:cred.user.yahoo.session
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(qs.parse(body)), [
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
