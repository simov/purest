
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}


exports = module.exports = function (t) {
  return {
    // get user's account
    0: function () {
      t.get('users/simov', {
        qs:{access_token:cred.user.github.token}
      }, function (err, res, body) {
        debugger
        console.log(body)
      })
    },
    // get user's repositories
    1: function () {
      t.get('user/repos', {
        qs:{
          access_token:cred.user.github.token
          // page:2
        }
      }, function (err, res, body) {
        console.log(res.headers.link)
        debugger
        console.log(body)
      })
    },
    // get repo
    2: function () {
      t.get('repos/senchalabs/connect', {
        qs:{access_token:cred.user.github.token}
      }, function (err, res, body) {
        debugger
        console.log(body)
      })
    },
    // get repo
    3: function () {
      t.post('markdown', {
        qs:{
          access_token:cred.user.github.token
        },
        body:{
          text: '# Header',
          mode: 'markdown'
        }
      }, function (err, res, body) {
        debugger
        console.log(body)
      })
    }
  }
}
