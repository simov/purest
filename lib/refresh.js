
var query = require('querystring')
var request = require('request')


// http://oauth.googlecode.com/svn/spec/ext/session/1.0/drafts/1/spec.html#anchor4
function OAuth1 (provider) {
  return function (app, user, session, done) {
    var url = provider._refresh
    request.post(url, {
      oauth: {
        consumer_key:app.key,
        consumer_secret:app.secret,
        token:user.token,
        token_secret:user.secret,
        session_handle:session
      }
    }, function (err, res, body) {
      done(err, res, query.parse(body))
    })
  }.bind(provider)
}

// 
function OAuth2 (provider) {
  return function (app, refresh, done) {
    var url = provider._refresh
    request.post(url, {
      form:{
        grant_type:'refresh_token',
        client_id:app.key,
        client_secret:app.secret,
        refresh_token:refresh
      },
      json:true
    }, done)
  }.bind(provider)
}

function aboutme (provider) {
  return function (apikey, user, pass, done) {
    provider.query()
      .update('user/login/'+user)
      .where({
        client_id:apikey,
        grant_type:'password',
        password:pass
      })
      .request(done) 
  }
}

function reddit (provider) {
  return function (app, refresh, done) {
    var url = provider._refresh
    request.post(url, {
      auth:{user:app.key, pass:app.secret},
      form:{
        grant_type:'refresh_token',
        refresh_token:refresh
      },
      json:true
    }, done)
  }.bind(provider)
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
  else if (provider.reddit) {
    return new reddit(provider)
  }
}
