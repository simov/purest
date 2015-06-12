
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').trello || {}
  , user = require('../../config/user').trello || {}
var p = new (require('../../lib/provider'))({provider:'trello'})


var examples = {
  // get all boards
  0: function () {
    p.query()
      .get('members/me/boards')
      .auth(app.key, user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get all lists in a board
  1: function () {
    p.query()
      .get('boards/' + user.board + '/lists')
      .auth(app.key, user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get all cards in a list
  2: function () {
    p.query()
      .get('lists/' + user.list + '/cards')
      .auth(app.key, user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
