
if (!process.argv[2]) return console.log('Specify example to run')

var app = require('../../config/app').live || {}
  , user = require('../../config/user').live || {}
var p = new (require('../../lib/provider'))({provider:'live'})

var fs = require('fs')
  , path = require('path')
var fpath = path.resolve(__dirname,'../../test/fixtures/cat.png')


var examples = {
  // Identity

  // user's profile
  0: function () {
    p.query()
      .select('me')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // user's avatar
  1: function () {
    p.query()
      .select('me/picture')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
        fs.writeFileSync('avatar.png', body)
      })
  },


  // Outlook

  // get user's contacts
  2: function () {
    p.query()
      .select('me/contacts')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get a single contact
  3: function () {
    p.query()
      .select('contact.de3413e6000000000000000000000000')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },


  // OneDrive

  // get the root skydrive folder
  4: function () {
    p.query()
      .select('me/skydrive') // or [id]/skydrive
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // list of all folders, albums and files inside the root directory
  5: function () {
    p.query()
      .select('me/skydrive/files') // or [id]/skydrive
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get folder's metadata
  6: function () {
    p.query()
      .select('folder.e8e0202776d99ad4.E8E0202776D99AD4!103')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // get folder's content
  7: function () {
    p.query()
      .select('folder.e8e0202776d99ad4.E8E0202776D99AD4!103/files')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // upload a file
  8: function () {
    p.query()
      .put('me/skydrive/files/cat.png')
      .options({body:fs.readFileSync(fpath)})
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      })
  },
  // upload streaming a file
  9: function () {
    fs.createReadStream(fpath)
      .pipe(p.query()
      .put('me/skydrive/files/cat.png')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
      }))
  },
  // download file
  10: function () {
    p.query()
      .get('file.e8e0202776d99ad4.E8E0202776D99AD4!108/content')
      .auth(user.token)
      .request(function (err, res, body) {
        debugger
        if (err) console.log(err)
        console.log(body)
        fs.writeFileSync('cat.png', body)
      })
  },
  // download streaming a file
  11: function () {
    p.query()
      .get('file.e8e0202776d99ad4.E8E0202776D99AD4!108/content')
      .auth(user.token)
      .request()
      .pipe(fs.createWriteStream('cat.png'))
      .on('end', function () {
        console.log('DONE!')
      })
  }
}

examples[process.argv[2]]()
