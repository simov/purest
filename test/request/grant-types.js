
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
var app = require('../../config/app')
  , user = require('../../config/user')

var p = {}
for (var name in providers) {
  var options = {
    provider:name,
    defaults:{headers:{'User-Agent':'Purest'}}
  }
  if (app[name] && user[name] && user[name].token && user[name].secret) {
    options.key = app[name].key
    options.secret = app[name].secret
  }
  p[name] = new Purest(options)
}


describe('client_credentials', function () {
  it('querystring credentials', function (done) {
    p.acton.query('oauth')
      .update('token')
      .set({
        grant_type:'client_credentials',
        client_id:app.acton.key,
        client_secret:app.acton.secret
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
      .auth(app.acton.key, app.acton.secret)
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
        client_id:app.facebook.key,
        client_secret:app.facebook.secret
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
        client_id:app.organisedminds.key,
        client_secret:app.organisedminds.secret,
        scope: 'read write'
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
        client_id:app.twitter.key,
        client_secret:app.twitter.secret
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
        username:user.acton.user,
        password:user.acton.pass,
        client_id:app.acton.key,
        client_secret:app.acton.secret
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
        username:user.acton.user,
        password:user.acton.pass
      })
      .auth({user:app.acton.key, pass:app.acton.secret})
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
      .update('login/' + user.aboutme.user)
      .set({
        grant_type:'password',
        client_id:user.aboutme.apikey,
        password:user.aboutme.pass
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
