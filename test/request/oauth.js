
var fs = require('fs')
  , path = require('path')
  , should = require('should')
  , qs = require('qs')
var Purest = require('../../')
  , providers = require('../../config/providers')


describe('oauth', function () {
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
  var acc = require('../../../../inf/inf-accounts')

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

  describe('client_credentials', function () {
    it('querystring credentials', function () {
      p.acton.query('oauth')
        .update('token')
        .set({
          grant_type:'client_credentials',
          client_id:cred.app.acton.key,
          client_secret:cred.app.acton.secret
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body), [
            'token_type', 'expires_in', 'refresh_token', 'access_token'
          ])
          done()
        })
    })
    it('basic auth credentials', function () {
      p.acton.query('oauth')
        .update('token')
        .set({grant_type:'client_credentials'})
        .auth(cred.app.acton.key, cred.app.acton.secret)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body), [
            'token_type', 'expires_in', 'refresh_token', 'access_token'
          ])
          done()
        })
    })
    it('querystring response', function () {
      p.facebook.query('oauth')
        .update('token')
        .set({
          grant_type:'client_credentials',
          client_id:cred.app.facebook.key,
          client_secret:cred.app.facebook.secret
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(qs.parse(body)), [
            'access_token'
          ])
          done()
        })
    })
  })

  describe('password', function () {
    it('querystring credentials', function () {
      p.acton.query('oauth')
        .update('token')
        .set({
          grant_type:'password',
          username:acc['act-on.com'].user,
          password:process.env.PASS+acc['act-on.com'].pass,
          client_id:cred.app.acton.key,
          client_secret:cred.app.acton.secret
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body), [
            'token_type', 'expires_in', 'refresh_token', 'access_token'
          ])
          done()
        })
    })
    it('custom - aboutme', function () {
      p.aboutme.query('user')
        .update('login/' + cred.user.aboutme.user)
        .set({
          grant_type:'password',
          client_id:cred.user.aboutme.apikey,
          password:acc['about.me'].pass
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body), [
            'access_token', 'status', 'expires_in'
          ])
          done()
        })
    })
  })

  describe('refresh', function () {
    it('querystring credentials', function (done) {
      // p.acton.query('oauth')
      //   .update('token')
      //   .set({
      //     grant_type:'refresh_token',
      //     refresh_token:cred.user.acton.refresh,
      //     client_id:cred.app.acton.key,
      //     client_secret:cred.app.acton.secret
      //   })
      //   .request(function (err, res, body) {
      //     debugger
      //     if (err) return error(err, done)
      //     // should.deepEqual(Object.keys(body), [

      //     // ])
      //     _body = body
      //     done()
      //   })

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
          done()
        })
    })
    it('basic auth credentials', function (done) {
      p.google.query('oauth')
        .update('token')
        .set({
          grant_type:'refresh_token',
          refresh_token:cred.user.google.refresh
        })
        .auth(cred.app.google.key, cred.app.google.secret)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body), [
            'access_token', 'token_type', 'expires_in', 'id_token'
          ])
          done()
        })
    })
    // https://developer.yahoo.com/oauth/guide/oauth-refreshaccesstoken.html
    // http://oauth.googlecode.com/svn/spec/ext/session/1.0/drafts/1/spec.html#anchor4
    it('oauth1 - yahoo', function (done) {
      p.yahoo.query('oauth')
        .update('token')
        .options({
          oauth: {
            consumer_key:cred.app.yahoo.key,
            consumer_secret:cred.app.yahoo.secret,
            token:cred.user.yahoo.token,
            token_secret:cred.user.yahoo.secret,
            session_handle:cred.user.yahoo.session
          }
        })
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(qs.parse(body)), [
            'oauth_token', 'oauth_token_secret', 'oauth_expires_in',
            'oauth_session_handle', 'oauth_authorization_expires_in',
            'xoauth_yahoo_guid'
          ])
          done()
        })
    })
  })
})
