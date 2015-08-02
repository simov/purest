
if (!process.argv[2]) return console.log('Specify example to run')

var Purest = require('../../')
var user = require('./config')
  , config = require('./providers')


var examples = {
  // asana
  0: function () {
    var asana = new Purest({provider:'asana', config:config})

    asana.query('user').get()
      .auth(user.asana.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // slack
  1: function () {
    var slack = new Purest({provider:'slack', config:config})

    slack.query('user').get()
      .auth(user.slack.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
