
var Purest = require('../../../')
  , async = require('async')


function Facebook (options) {
  this.purest = new Purest(options)
}

Facebook.prototype.user = function (options, done) {
  var self = this

  async.auto({
    me: function (done) {
      self.purest.query()
        .get('me')
        .auth(options.token)
        .request(done)
    },
    avatar: ['me', function (done, result) {
      self.purest.query()
        .select(result.me[1].id+'/picture')
        .where({redirect:false})
        .auth(options.token)
        .request(done)
    }]
  }, function (err, result) {
    if (err) return done(err)

    var me = result.me[1]
      , avatar = result.avatar[1]

    var data = {
      id:me.id,
      username:undefined,
      name:me.name,
      avatar:avatar.data.url,
      type:'facebook'
    }

    var res = [result.me[0], result.avatar[0]]
      , body = [me, avatar]
    done(null, res, body, data)
  })
}

exports = module.exports = Facebook
