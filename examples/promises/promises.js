
if (!process.argv[2]) return console.log('Specify example to run')

var Purest = require('../../')
var user = require('./config')


var examples = {
  // promise
  0: function (done) {
    var p = new Purest({provider:'facebook', promise:true})

    p.query()
      .get('me')
      .auth(user.facebook.token)
      .request()
      .spread(function (res, body) {
        console.log(res.statusCode)
        console.log(body)
        done && done()
      })
  },
  // promise + defaults
  1: function (done) {
    var p = new Purest({
      provider:'facebook',
      promise:true,
      defaults:{
        auth:{bearer:user.facebook.token}
      }
    })

    p.query()
      .get('me')
      .request()
      .spread(function (res, body) {
        console.log(res.statusCode)
        console.log(body)
        done && done()
      })
  },
  // 1 instance with promise + 1 instance without promise
  2: function () {
    examples[0](function () {
      var p = new Purest({
        provider:'facebook',
        defaults:{
          auth:{bearer:user.facebook.token}
        }
      })

      p.query()
        .get('me')
        .request(function (err, res, body) {
          console.log(res.statusCode)
          console.log(body)
        })
    })
  }
}

examples[process.argv[2]]()
