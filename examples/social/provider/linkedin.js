
var Purest = require('../../../')


function LinkedIn (options) {
  this.client = new Purest(options)
}

LinkedIn.prototype.user = function (options, done) {
  var fields = [
    'id', 'first-name', 'last-name', 'formatted-name', 'headline',
    'picture-url', 'auth-token', 'distance', 'num-connections'
  ]
  this.client.query()
    .select('people/~'+':('+fields.join()+')')
    .auth(options.token, options.secret)
    .request(function (err, res, body) {
      if (err) return done(err)
      var data = {
        id:body.id,
        username:body.formattedName,
        name:body.formattedName,
        avatar:body.pictureUrl,
        type:'linkedin'
      }
      done(null, res, body, data)
    })
}

exports = module.exports = LinkedIn
