
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').box || {}
  , user = require('../../config/user').box || {}
var p = new (require('../../'))({provider:'box'})


var examples = {
  // get root folder metadata
  0: function () {
    p.query()
      .get('folders/0')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get root folder items
  1: function () {
    p.query()
      .select('folders/0/items')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // view api
  2: function () {
    p.query('view')
      .get('documents')
      .auth(user.viewapikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // view api download
  3: function () {
    // needs session/sharing permissions for that document
    p.query('view')
      .get('documents/d7ee1566af95470eb2a44df5f612ed17/content.pdf')
      .auth(user.viewapikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(res.statusCode)
        if (res.statusCode == 200) {
          require('fs').writeFileSync('test.pdf', body, 'binary')
        }
      })
  },
  // cloud download
  4: function () {
    p.query('view')
      .get('zzxlzc38hq7u1u5jdteu.pdf')
      .auth(user.viewapikey)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(res.statusCode)
        if (res.statusCode == 200) {
          require('fs').writeFileSync('test.pdf', body, 'binary')
        }
      })
  }
}

examples[process.argv[2]]()
