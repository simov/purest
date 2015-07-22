
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


describe('stocktwits', function () {
  it('options', function (done) {
    p.stocktwits.get('streams/user/nonexisting', function (err, res, body) {
      err.response.status.should.equal(404)
      err.errors[0].message.should.equal('User not found')
      done()
    })
  })
})
