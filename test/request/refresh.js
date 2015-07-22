
var qs = require('qs')
  , should = require('should')
var Purest = require('../../')
  , providers = require('../../config/providers')
var config = require('../config/refresh-token')


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
var store = require('../utils/store')

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


describe('refresh', function () {
  // OAuth2
  Object.keys(config).forEach(function (provider) {
    var options = {}
    var params = {
      grant_type:'refresh_token',
      refresh_token:cred.user[provider].refresh,
      client_id:cred.app[provider].key,
      client_secret:cred.app[provider].secret
    }
    if (provider == 'basecamp') {
      params.type = 'refresh'
      delete params.grant_type
    }
    if (provider == 'reddit') {
      options.auth = {user:params.client_id, pass:params.client_secret}
      delete params.client_id
      delete params.client_secret
    }

    it(provider, function (done) {
      p[provider].query('oauth')
        .update('token')
        .set(params)
        .options(options)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)

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

  // http://about.me/developer/api/docs/#login
  it('aboutme', function (done) {
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
        store.oauth2('aboutme', body.access_token)
        done()
      })
  })

  // https://developer.yahoo.com/oauth/guide/oauth-refreshaccesstoken.html
  it('yahoo', function (done) {
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
