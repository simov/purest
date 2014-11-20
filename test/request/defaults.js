
var fs = require('fs')
var path = require('path')
var Purest = require('../../lib/provider')
var providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')


describe('defaults', function () {
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

  describe('', function () {
    describe('request', function () {
      
    })
    describe('query', function () {
      it('set defaults', function (done) {
        var defaults = {
          oauth: {
            consumer_key:cred.app.twitter.key,
            consumer_secret:cred.app.twitter.secret,
            token:cred.user.twitter.token,
            token_secret:cred.user.twitter.secret
          }
        }
        var twitter = new Purest({provider:'twitter', defaults:defaults})
        twitter.query()
          .select('users/show')
          .where({screen_name:'mightymob'})
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.equal(1504092505)
            body.screen_name.should.equal('mightymob')
            done()
          })
      })
    })
  })
})
