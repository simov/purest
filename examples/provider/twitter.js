
if (!process.argv[2]) return console.log('Specify example to run')
var id = process.argv[3]

var app = require('../../config/app').twitter || {}
  , user = require('../../config/user').twitter || {}
var p = new (require('../../'))({provider:'twitter',
  key:app.key, secret:app.secret})


var examples = {
  // get user's profile
  0: function () {
    p.query()
      .select('users/show')
      .where({user_id:id})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's timeline
  1: function () {
    p.query()
      .select('statuses/user_timeline')
      .where({
        count: 3000
        // trim_user: true
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's home timeline
  2: function () {
    p.query()
      .select('statuses/home_timeline')
      .where({count: 200})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's mention timeline
  3: function () {
    p.query()
      .select('statuses/mentions_timeline')
      // .where({since_id: 'id'})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  //
  4: function () {
    p.query()
      .select('statuses/retweets_of_me')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // show retweets for a tweet
  5: function () {
    p.query()
      .select('statuses/retweets')
      .where({
        id:id,
        count:100
      })
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  6: function () {
    p.query()
      .select('help/configuration')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // post a tweet
  7: function () {
    p.query()
      .post('statuses/update')
      .set({status:'Message on ' + new Date()})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // search
  8: function () {
    p.query()
      .select('users/search')
      .where({q:'twitter'})
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's received direct messages
  9: function () {
    p.query()
      .select('direct_messages')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's sent direct messages
  10: function () {
    p.query()
      .select('direct_messages/sent')
      .auth(user.token, user.secret)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
