
var qs = require('querystring')
var request = require('request')


// http://oauth.googlecode.com/svn/spec/ext/session/1.0/drafts/1/spec.html#anchor4
function OAuth1 (provider) {
  return function (app, user, session, done) {
    var url = provider._refresh
    var options = {
      oauth: {
        consumer_key:app.key,
        consumer_secret:app.secret,
        token:user.token,
        token_secret:user.secret,
        session_handle:session
      }
    }
    request.post(url, options, function (err, res, body) {
      done(err, res, qs.parse(body))
    })
  }
}

function OAuth2 (provider) {
  return function (app, refresh, done) {
    var url = provider._refresh
    var options = {
      form:{
        grant_type:'refresh_token',
        client_id:app.key,
        client_secret:app.secret,
        refresh_token:refresh
      },
      json:true
    }
    if (provider.basecamp) {
      delete options.form.grant_type
      options.form.type = 'refresh'
    }
    if (provider.reddit) {
      delete options.form.client_id
      delete options.form.client_secret
      options.auth = {user:app.key, pass:app.secret}
    }
    request.post(url, options, done)
  }
}

function aboutme (provider) {
  return function (apikey, user, pass, done) {
    var url = provider._refresh + user
    var options = {
      form:{
        client_id:apikey,
        grant_type:'password',
        password:pass
      },
      json:true
    }
    request.post(url, options, done)
  }
}

exports = module.exports = function (provider) {
  if (provider.oauth2 && provider._refresh) {
    return new OAuth2(provider)
  }
  else if (provider.oauth && provider._refresh) {
    return new OAuth1(provider)
  }
  else if (provider.aboutme) {
    return new aboutme(provider)
  }
}
