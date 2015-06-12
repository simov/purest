
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').mailchimp || {}
  , user = require('../../config/user').mailchimp || {}
var p = new (require('../../lib/provider'))({provider:'mailchimp'})

var es = require('event-stream')


var examples = {
  // retrieve all of the lists defined for your user account
  0: function () {
    p.query()
      .select('lists/list')
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // export contacts from a list
  1: function () {
    p.query('export')
      .select('list')
      .where({id:'bd0b216f1c'})
      .auth(user.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // stream contacts from a list
  2: function () {
    p.query('export')
      .select('list')
      .where({id:'bd0b216f1c'})
      .auth(user.apikey)
      .request()
      .pipe(es.split())
      .pipe(es.map(function (data, done) {
        console.log(data)
        console.log('---------------------')
        done()
      }))
      .on('end', function (e) {
        console.log('DONE!')
      })
  }
}

examples[process.argv[2]]()
