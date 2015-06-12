
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').github || {}
  , user = require('../../config/user').github || {}
var p = new (require('../../lib/provider'))({provider:'github',
  defaults:{headers:{'user-agent':'purest'}}})


var examples = {
  // get user's account
  0: function () {
    p.query()
      .select('users/simov')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's repositories
  1: function () {
    p.query()
      .select('user/repos')
      .auth(user.token)
      .request(function (err, res, body) {
        console.log(res.headers.link)
        debugger
        console.log(body)
      })
  },
  // get repo
  2: function () {
    p.query()
      .get('repos/senchalabs/connect')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get repo
  3: function () {
    p.query()
      .post('markdown')
      .body({
        text: '# Header',
        mode: 'markdown'
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
