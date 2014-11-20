
var Purest = require('../../lib/provider')
var providers = require('../../config/providers')


describe('verbs', function () {
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

  describe('aboutme', function () {
    describe('request', function () {
      it('absolute url', function (done) {
        p.aboutme.get('https://api.about.me/api/v2/json/user/view/simeonv', {
          headers:{Authorization:'Basic '+cred.user.aboutme.apikey}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.user_name.should.equal('simeonv')
          done()
        })
      })
    })
    describe('query', function () {
      
    })
  })

  describe('yahoo', function () {
    describe('request', function () {
      it('http options', function (done) {
        p.yahoo.get('yql', {
          api:'yql',
          method:'OPTIONS',
          oauth:{
            token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
          }
        }, function (err, res, body) {
          if (err) return error(err, done)
          res.headers.allow
            .should.equal('GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS')
          done()
        })
      })
    })
    describe('query', function () {
      
    })
  })
})
