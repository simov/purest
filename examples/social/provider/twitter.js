
var Purest = require('../../../')


function Twitter (options) {
  this.purest = new Purest(options)
}

Twitter.prototype.user = function (options, done) {
  this.purest.query()
    .get('users/show')
    .where({user_id:options.id})
    .auth(options.auth.token, options.auth.secret)
    .request(function (err, res, body) {
      if (err) return done(err)
      var data = {
        id:body.id_str,
        username:body.screen_name,
        name:body.name,
        avatar:body.profile_image_url_https,
        type:'twitter'
      }
      done(null, res, body, data)
    })
}

exports = module.exports = Twitter
