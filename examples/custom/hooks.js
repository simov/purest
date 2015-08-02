
if (!process.argv[2]) return console.log('Specify example to run')

var Purest = require('../../')
var user = require('./config')


var examples = {
  0: function () {
    var slack = new Purest({
      provider:'slack',
      before:{
        all: function (endpoint, options, config) {
          options.headers = options.headers || {}
          // set the Date header for each request
          options.headers.date = (new Date()).toUTCString()
        }
      },
      debug:true
    })

    slack.query()
      .get('auth.test')
      .auth(user.slack.token)
      .request(function (err, res, body) {
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
