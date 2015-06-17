
if (!process.argv[2]) return console.log('Specify example to run')
var id = process.argv[3]

var app = require('../../config/app').stocktwits || {}
  , user = require('../../config/user').stocktwits || {}
var p = new (require('../../'))({provider:'stocktwits'})


var examples = {
  0: function () {
    p.query()
      .select('account/verify')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  1: function () {
    p.query()
      .select('streams/user/' + id)
      .where({
        // since: '', max: '', limit: '', callback: '', filter: ''
      })
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  2: function () {
    p.query()
      .select('streams/home')
      .where({
        // since: '', max: '', limit: '', callback: '', filter: ''
      })
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  3: function () {
    p.query()
      .post('messages/create')
      .set({
        body: 'Publisher message on ' + new Date()
        // in_reply_to_message_id: '', chart: '', sentiment: ''
      })
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
