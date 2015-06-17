
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').box || {}
  , user = require('../../config/user').box || {}
var p = new (require('../../'))({provider:'box'})


var examples = {
  // get root folder metadata
  0: function () {
    p.query()
      .get('folders/0')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get root folder items
  1: function () {
    p.query()
      .select('folders/0/items')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
