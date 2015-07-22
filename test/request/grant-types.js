
var qs = require('qs')
  , should = require('should')
var Purest = require('../../')
  , providers = require('../../config/providers')


function error (err, done) {
  return (err instanceof Error)
    ? done(err)
    : (console.log(err) || done(new Error('Error response!')))
}

require('../utils/credentials')
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}
var refresh = require('../utils/refresh')

var p = {}
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


describe('client_credentials', function () {
  it('querystring credentials', function (done) {
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
  it('basic auth credentials', function (done) {
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
  it('querystring response', function (done) {
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
        body = qs.parse(body)
        should.deepEqual(Object.keys(body), [
          'access_token'
        ])
        done()
      })
  })
  it('scope parameter', function (done) {
    p.organisedminds.query('oauth')
      .update('token')
      .set({
        grant_type:'client_credentials',
        client_id:cred.app.organisedminds.key,
        client_secret:cred.app.organisedminds.secret,
        scope: 'write'
      })
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'access_token', 'token_type', 'expires_in', 'scope'
        ])
        done()
      })
  })
  it('twitter - OAuth1 app', function (done) {
    p.twitter.query('oauth')
      .update('token')
      .set({
        grant_type:'client_credentials',
        client_id:cred.app.twitter.key,
        client_secret:cred.app.twitter.secret
      })
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'token_type', 'access_token'
        ])
        done()
      })
  })
})


describe('password', function () {
  it('querystring credentials', function (done) {
    p.acton.query('oauth')
      .update('token')
      .set({
        grant_type:'password',
        username:cred.user.acton.user,
        password:cred.user.acton.pass,
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
  it('basic auth', function (done) {
    p.acton.query('oauth')
      .update('token')
      .set({
        grant_type:'password',
        username:cred.user.acton.user,
        password:cred.user.acton.pass
      })
      .auth({user:cred.app.acton.key, pass:cred.app.acton.secret})
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), [
          'token_type', 'expires_in', 'refresh_token', 'access_token'
        ])
        done()
      })
  })
  it('aboutme - custom', function (done) {
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
        done()
      })
  })
})
