
var provider = process.argv[2]
  , index = process.argv[3]
  , id = process.argv[4]
  , fname = process.argv[5]

if (!provider) {
  throw new Error('Specify provider!')
}
if (!index) {
  throw new Error('Specify example!')
}

var fs = require('fs')
  , path = require('path')
var Storage = require('./storage')

var cred = require('./config')
var token
if (provider == 'drive') token = cred.google.token
else if (provider == 'onedrive') token = cred.live.token
else token = cred[provider].token

var image = path.resolve(__dirname, '../../test/fixtures/cat.png')

var storage = new Storage({provider:provider})


var examples = {
  // list
  0: function () {
    storage.list({
      id:id, // box - 0, dropbox - /, onedrive - me
      type:'folder',
      token:token
    }, function (err, res, body) {
      if (err) console.log(err)
      console.log(body)
    })
  },
  // stats folder
  1: function () {
    storage.stats({
      id:id, // box - 0, dropbox - /, onedrive - me
      type:'folder',
      token:token
    }, function (err, res, body) {
      if (err) console.log(err)
      console.log(body)
    })
  },
  // stats file
  2: function () {
    storage.stats({
      id:id,
      type:'file',
      token:token
    }, function (err, res, body) {
      if (err) console.log(err)
      console.log(body)
    })
  },
  // upload file
  3: function () {
    storage.upload({
      path:id||image,
      token:token
    }, function (err, res, body) {
      if (err) console.log(err)
      console.log(body)
    })
  },
  // download file
  4: function () {
    storage.download({
      id:id,
      token:token
    }, function (err, res, body) {
      if (err) console.log(err)
      console.log(body)
    })
    .pipe(fs.createWriteStream(path.resolve(__dirname, fname||'cat.png')))
  },
  // copy - put
  5: function () {
    var box = new Storage({provider:'box'})
      , dropbox = new Storage({provider:'dropbox'})
      , onedrive = new Storage({provider:'onedrive'})

    var request = box.download({
      id:id,
      token:cred.box.token
    })
    request.pipe(dropbox.upload({
      name:fname||'cat.png',
      token:cred.dropbox.token
    }))
    request.pipe(onedrive.upload({
      name:fname||'cat.png',
      token:cred.live.token
    }))
  },
  // copy - multipart
  6: function () {
    var dropbox = new Storage({provider:'dropbox'})
      , box = new Storage({provider:'box'})
      , drive = new Storage({provider:'drive'})

    var request = dropbox.download({
      id:id,
      token:cred.dropbox.token
    })
    box.upload({
      body:request,
      token:cred.box.token
    })
    drive.upload({
      path:fname||'cat.png',
      body:request,
      token:cred.google.token
    })
  }
}

examples[index]()
