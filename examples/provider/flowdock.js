
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').flowdock || {}
  , user = require('../../config/user').flowdock || {}
var p = new (require('../../'))({provider:'flowdock'})


var examples = {
  // get all flows (channels)
  0: function () {
    p.query()
      .get('flows')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // stream messages from a flow (channel)
  1: function () {
    p.query('stream')
      .get('flows')
      .where({filter:'simeon-velichkov/main'})
      .auth(user.token)
      .request()
      .on('data', function (data) {
        console.log(data.toString('utf8'))
      })
  }
}

examples[process.argv[2]]()
