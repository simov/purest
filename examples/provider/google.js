
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').google || {}
  , user = require('../../config/user').google || {}
var p = new (require('../../'))({provider:'google'})


var examples = {
  // get all google contact's groups
  0: function () {
    p.query('contacts')
      .select('groups/default/full')
      .where({'max-results':50})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get google contacts from specific group
  1: function () {
    p.query('contacts')
      .select('contacts/default/full')
      .where({
        // group:'http://www.google.com/m8/feeds/groups/email%40gmail.com/base/[ID]',
        'max-results':50
      })
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // google contacts pagination
  2: function () {
    function next (link) {
      for (var i=0; i < link.length; i++) {
        if (link[i].rel == 'next') {
          return parseInt(
            link[i].href.replace(/.*start-index=(\d+).*/,'$1')
          , 10)
        }
      }
      return false
    }
    var contacts = []
    ;(function page (index, done) {
      p.query('contacts')
        .select('contacts/default/full')
        .where({
          'start-index':index,
          'max-results':50
        })
        .auth(user.token)
        .request(function (err, res, body) {
          debugger
          if (err) return done(err)
          contacts = contacts.concat(body.feed.entry)
          var index = next(body.feed.link)
          console.log(index)
          if (index) return page(index, done)
          done()
        })
    }(1, function (err) {
      debugger
      if (err) throw err
      console.log(contacts.length)
    }))
  },

  // get a single message
  3: function () {
    p.query('gmail')
      .select('users/me/messages/14b2d0a9cd8a439f')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get a single thread
  4: function () {
    p.query('gmail')
      .select('users/me/threads/14b2d0a9cd8a439f')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
