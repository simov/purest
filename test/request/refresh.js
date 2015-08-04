
var qs = require('qs')
  , should = require('should')
var Purest = require('../../')
  , providers = require('../../config/providers')
var config = require('../config/refresh-token')
  , store = require('../utils/store')


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


describe('oauth2', function () {
  Object.keys(config).forEach(function (provider) {
    var options = {}
    var params = {
      grant_type:'refresh_token',
      refresh_token:user[provider].refresh,
      client_id:app[provider].key,
      client_secret:app[provider].secret
    }
    if (/basecamp/.test(provider)) {
      params.type = 'refresh'
      delete params.grant_type
    }
    if (/feedly/.test(provider)) {
      options.subdomain = 'sandbox'
    }
    if (/reddit/.test(provider)) {
      options.auth = {user:params.client_id, pass:params.client_secret}
      delete params.client_id
      delete params.client_secret
    }
    if (/vend/.test(provider)) {
      options.subdomain = user.vend.subdomain
    }

    it(provider, function (done) {
      p[provider].query('oauth')
        .update('token')
        .set(params)
        .options(options)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)

          body = (/elance/.test(provider)) ? body.data : body

          should.deepEqual(Object.keys(body), config[provider].fields)

          if (config[provider].update.length == 2) {
            store.oauth2(provider, body.access_token, body.refresh_token)
          } else {
            store.oauth2(provider, body.access_token)
          }

          done()
        })
    })
  })
})

describe('custom', function () {
  // http://about.me/developer/api/docs/#login
  it('aboutme', function (done) {
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
        store.oauth2('aboutme', body.access_token)
        done()
      })
  })
})

describe('oauth1', function () {
  // https://developer.yahoo.com/oauth/guide/oauth-refreshaccesstoken.html
  it('yahoo', function (done) {
    p.yahoo.query('oauth')
      .update('token')
      .oauth({
        consumer_key:app.yahoo.key,
        consumer_secret:app.yahoo.secret,
        token:user.yahoo.token,
        token_secret:user.yahoo.secret,
        session_handle:user.yahoo.session
      })
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body = qs.parse(body)
        should.deepEqual(Object.keys(body), [
          'oauth_token', 'oauth_token_secret', 'oauth_expires_in',
          'oauth_session_handle', 'oauth_authorization_expires_in',
          'xoauth_yahoo_guid'
        ])
        store.oauth1('yahoo', body.oauth_token, body.oauth_token_secret)
        done()
      })
  })
})
