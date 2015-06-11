
var Purest = require('purest')
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
        .auth(options.auth.token)
        .request(function (err, res, body) {
          if (err) return done(err)
          done(null, err, res, body)
        })
    },
    avatar: ['me', function (done, res) {
      self.purest.query()
        .select(res.me[2].id+'/picture')
        .where({redirect:false})
        .auth(options.auth.token)
        .request(function (err, res, body) {
          if (err) return done(err)
          done(null, body)
        })
    }]
  }, function (err, res) {
    if (err) return done(err)
    var data = {
      id:res.me.id,
      username:res.me.username,
      name:res.me.name,
      avatar:res.avatar.data.url,
      type:'facebook'
    }
    done(null, res.me[1], res.me[2], data)
  })
}

exports = module.exports = Facebook
