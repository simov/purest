
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').sendgrid || {}
  , user = require('../../config/user').sendgrid || {}
var p = new (require('../../lib/provider'))({provider:'sendgrid'})


var examples = {
  // get user's profile
  0: function () {
    p.query()
      .select('profile.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  1: function () {
    p.query()
      .select('blocks.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  2: function () {
    p.query()
      .select('bounces.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  3: function () {
    p.query()
      .select('invalidemails.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  4: function () {
    p.query()
      .select('spamreports.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  5: function () {
    p.query()
      .select('unsubscribes.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  6: function () {
    p.query()
      .select('credentials/get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  7: function () {
    p.query()
      .select('filter.getavailable')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  8: function () {
    p.query()
      .select('stats.get')
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  9: function () {
    var date = new Date()
    date.setDate(date.getDate()-7)

    p.query()
      .update('stats.getAdvanced')
      .set({
        data_type:'global',
        start_date:date.toISOString().slice(0, 10)
      })
      .auth(user.user, user.pass)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
