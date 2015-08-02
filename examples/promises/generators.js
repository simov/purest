
if (!process.argv[2]) return console.log('Specify example to run')

var co = require('co')
var Purest = require('../../')
var user = require('./config')


var examples = {
  0: function () {
    var p = new Purest({
      provider:'facebook',
      promise:true
    })

    co(function* () {
      return yield p.query()
        .get('me')
        .auth(user.facebook.token)
        .request()
    })
    .then(function (results) {
      console.log(results[0].statusCode)
      console.log(results[1])
    })
    .catch(function (err) {
      console.log(err)
    })
  }
}

examples[process.argv[2]]()
