
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}


exports = module.exports = function (p) {
  return {

    // Contacts

    // get all google contact's groups
    0: function () {
      p.get('groups/default/full', {
        api:'contacts',
        qs:{
          access_token:cred.user.google.token,
          'max-results':50
        }
      }, function (err, res, body) {
        debugger
        console.log(body)
      })
    },
    // get google contacts from specific group
    1: function () {
      p.get('contacts/default/full', {
        api:'contacts',
        qs:{
          access_token:cred.user.google.token,
          // group:'http://www.google.com/m8/feeds/groups/email%40gmail.com/base/ID',
          'max-results':50
        }
      }, function (err, res, body) {
        debugger
        console.log(body)
      })
    },
    // pagination
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
      (function page (index, done) {
        p.get('contacts/default/full', {
          api:'contacts',
          qs:{
            access_token:cred.user.google.token,
            'start-index':index,
            'max-results':50
          }
        }, function (err, res, body) {
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

    // GMail

    // get a single message
    3: function () {
      p.query('gmail')
        .select('users/me/messages/14b2d0a9cd8a439f')
        .auth(cred.user.google.token)
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
        .auth(cred.user.google.token)
        .request(function (err, res, body) {
          debugger
          if (err) console.log(err)
          console.log(body)
        })
    }
  }
}
