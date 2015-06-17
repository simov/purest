
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').bitly || {}
  , user = require('../../config/user').bitly || {}
var p = new (require('../../'))({provider:'bitly',
  defaults:{qs:{access_token:user.token}}})


var examples = {
  0: function () {
    p.query()
      .select('user/info')
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  1: function () {
    p.query()
      .get('shorten')
      .where({longUrl:'http://simov.github.io'})
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  2: function () {
    p.query()
      .get('bitly_pro_domain')
      .where({domain:'buswk.co'})
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  3: function () {
    p.query()
      .select('link/clicks')
      .where({link:'http://nyti.ms/ItXWMo'})
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  4: function () {
    p.query()
      .get('info')
      .where({shortUrl:'http://nyti.ms/ItXWMo'})
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
