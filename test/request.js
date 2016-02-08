
var should = require('should')
var app = require('../../../purest/config/app')
var user = require('../../../purest/config/user')
var config = require('../../../purest/config/providers')
var purest = require('../')


describe('request', () => {
  it('__default alias', (done) => {
    var twitter = purest({
      provider: 'twitter', config: config,
      key: app.twitter.key, secret: app.twitter.secret
    })

    twitter
      .select('users/show')
      .where({screen_name: '_simov'})
      .auth(user.twitter.token, user.twitter.secret)
      .callback((err, res, body) => {
        should.equal(body.screen_name, '_simov')
        done()
      })
      .submit()
  })
})
