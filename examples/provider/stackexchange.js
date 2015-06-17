
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').stackexchange || {}
  , user = require('../../config/user').stackexchange || {}
var p = new (require('../../'))({provider:'stackexchange'})


var examples = {
  // anonymous
  0: function () {
    p.query()
      .select('users')
      .where({
        site:'stackoverflow',
        sort:'reputation',
        order:'desc'
      })
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // app limited
  1: function () {
    p.query()
      .select('users')
      .where({
        site:'stackoverflow',
        sort:'reputation',
        order:'desc'
      })
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // app/user pair limited
  2: function () {
    p.query()
      .select('users')
      .where({
        site:'stackoverflow',
        sort:'reputation',
        order:'desc'
      })
      .auth(user.apikey, user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
