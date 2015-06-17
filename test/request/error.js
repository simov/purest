
var Purest = require('../../')
var providers = require('../../config/providers')


describe('error', function () {
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
      if (providers[name].__provider && providers[name].__provider.oauth) {
        options.key = cred.app[name].key
        options.secret = cred.app[name].secret
      }
      p[name] = new Purest(options)
    }
  })

  describe('stocktwits', function () {
    describe('request', function () {
      it('error', function (done) {
        p.stocktwits.get('streams/user/nonexisting', function (err, res, body) {
          err.response.status.should.equal(404)
          err.errors[0].message.should.equal('User not found')
          done()
        })
      })
    })
    describe('query', function () {

    })
  })
})
