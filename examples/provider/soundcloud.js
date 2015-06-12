
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').soundcloud || {}
  , user = require('../../config/user').soundcloud || {}
var p = new (require('../../lib/provider'))({provider:'soundcloud'})


var examples = {
  0: function () {
    p.query()
      .get('me')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  1: function () {
    p.query()
      .select('tracks')
      .where({q:'dnb'})
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
