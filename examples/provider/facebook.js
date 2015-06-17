
if (!process.argv[2]) return console.log('Specify example to run')
var id = process.argv[3]

var app = require('../../config/app').facebook || {}
  , user = require('../../config/user').facebook || {}
var p = new (require('../../'))({provider:'facebook'})


var examples = {
  // get user's profile
  0: function (id) {
    p.query()
      .get(id || 'me')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's timeline
  1: function (id) {
    p.query()
      .get((id || 'me') + '/feed')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's accounts
  2: function () {
    p.query()
      .select('me/accounts')
      .where({fields:'id,name,picture,access_token'})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get user's groups
  3: function () {
    p.query()
      .select('me/groups')
      .where({fields:'id,name,picture,administrator,cover,icon'})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get group's avatar
  4: function () {
    p.query()
      .select('fql')
      .where({q:'SELECT icon34 FROM group WHERE gid IN ('+id+')'})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get friends count
  5: function () {
    p.query()
      .select('fql')
      .where({q:'SELECT friend_count FROM user WHERE uid = ' + id})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get the memebers of a group
  6: function () {
    p.query()
      .select('fql')
      .where({q:'SELECT uid FROM group_member WHERE gid = ' + id})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // post message to user's feed
  7: function () {
    p.query()
      .update((id || 'me') + '/feed')
      .set({message:'Publish message on ' + new Date()})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
