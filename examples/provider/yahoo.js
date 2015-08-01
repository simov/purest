
if (!process.argv[2]) return console.log('Specify example to run')
var id = process.argv[3]

var app = require('../../config/app').yahoo || {}
  , user = require('../../config/user').yahoo || {}
var p = new (require('../../'))({provider:'yahoo',
  key:app.key, secret:app.secret})


var examples = {
  // get user's GUID
  0: function () {
    p.query('social')
      .select('me/guid')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's profile
  1: function () {
    p.query('social')
      .select('user/'+id+'/profile')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get full user profile
  2: function () {
    p.query('query')
      .select('yql')
      .where({
        q: 'SELECT * FROM social.profile WHERE guid='+(id ? "'"+id+"'" : 'me')
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // accepts multiple ids
  3: function () {
    p.query('social')
      .select('users.guid('+id+')/profile')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  4: function () {
    p.query('social')
      .select('user/'+(id||'me')+'/connections')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  5: function () {
    p.query('geo')
      .select("places.q('Central Park, New York')")
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
