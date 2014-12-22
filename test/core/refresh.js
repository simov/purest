
var http = require('http'),
  qs = require('querystring')
var should = require('should')
var Purest = require('../../lib/provider'),
  refresh = require('../../lib/refresh')
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}


describe('refresh', function () {
  var server
  before(function (done) {
    server = http.createServer(function (req, res) {
      var data = ''
      req.setEncoding('utf8')

      req.on('data', function(d) {
        data += d
      })

      req.on('end', function() {
        if (req.headers.authorization) {
          if (/^Basic /.test(req.headers.authorization)) {
            data += '&basic=true'
          }
          else if (/^OAuth /.test(req.headers.authorization)) {
            data = req.headers.authorization
              .replace('OAuth ','').replace(/,/g,'&').replace(/"/g,'')
          }
        }
        res.end(data)
      })
    })

    server.listen(3000, done)
  })

  it('oauth', function (done) {
    var yahoo = new Purest({provider:'yahoo'})
    yahoo._refresh = 'http://localhost:3000/'
    yahoo.refresh(cred.app.yahoo, cred.user.yahoo, cred.user.yahoo.session,
    function (err, res, body) {
      should.deepEqual(Object.keys(body), [
        'oauth_consumer_key', 'oauth_nonce', 'oauth_session_handle',
        'oauth_signature_method', 'oauth_timestamp', 'oauth_token',
        'oauth_version', 'oauth_signature'
      ])
      done()
    })
  })

  it('oauth2', function (done) {
    var google = new Purest({provider:'google'})
    google._refresh = 'http://localhost:3000/'
    google.refresh(cred.app.google, cred.user.google.refresh, function (err, res, body) {
      should.deepEqual(Object.keys(qs.parse(body)),
        ['grant_type', 'client_id', 'client_secret', 'refresh_token'])
      done()
    })
  })

  it('reddit', function (done) {
    var reddit = new Purest({provider:'reddit'})
    reddit._refresh = 'http://localhost:3000/'
    reddit.refresh(cred.app.reddit, cred.user.reddit.refresh, function (err, res, body) {
      should.deepEqual(Object.keys(qs.parse(body)),
        ['grant_type', 'refresh_token', 'basic'])
      done()
    })
  })

  it.skip('aboutme', function (done) {
    
  })

  after(function () {
    server.close()
  })
})
