
if (!process.argv[2]) return console.log('Specify example to run')

var fs = require('fs')
  , path = require('path')
var Purest = require('../../')
var user = require('./config')
  , image = path.resolve(__dirname, '../../test/fixtures/cat.png')


var examples = {
  // send - HTTP POST alias
  0: function () {
    var sendgrid = new Purest({
      provider:'sendgrid',
      methods:{
        verbs:{post:['send']}
      }
    })

    sendgrid.query()
      .send('mail.send')
      .set({
        api_user:user.sendgrid.user,
        api_key:user.sendgrid.pass,
        from:'purest@mailinator.com',
        to:['purest@mailinator.com','purest2@mailinator.com'],
        subject:'Purest is awesome! (sendgrid)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!'
      })
      .request(function (err, res, body) {
        if (err) console.log(err)
        console.log(body)
      })
  },

  // write - HTTP PUT alias
  1: function () {
    var dropbox = new Purest({
      provider:'dropbox',
      methods:{
        verbs:{put:['write']}
      }
    })

    dropbox.query('files')
      .write('files_put/auto/cat.png')
      .body(fs.readFileSync(image))
      .auth(user.dropbox.token)
      .request(function (err, res, body) {
        if (err) console.log(err)
        console.log(body)
      })
  },

  // search - HTTP GET alias
  // params - request({qs:}) alias
  // submit - purest.request() alias
  2: function () {
    var soundcloud = new Purest({
      provider:'soundcloud',
      methods:{
        verbs:{get:['search']},
        options:{qs:['params']},
        custom:{request:['submit']}
      }
    })

    soundcloud.query()
      .search('users')
      .params({q:'Thriftworks'})
      .submit(function (err, res, body) {
        if (err) console.log(err)
        console.log(body)
      })
  }
}

examples[process.argv[2]]()
