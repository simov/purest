
var purest = require('../')
var fs = require('fs')
var path = require('path')

// ----------------------------------------------------------------------------

var auth = {
  box: {
    // root_readwrite
    token: '',
  },
  drive: {
    // drive.file
    token: '',
  },
  dropbox: {
    // files.content.write - on the app
    token: '',
  },
}

var file = {
  cat: path.resolve(__dirname, '../test/fixtures/cat.png'),
}

// ----------------------------------------------------------------------------

var config = {
  "box": {
    "upload": {
      "method": "POST",
      "url": "https://upload.box.com/api/2.0/files/content",
      "headers": {
        "authorization": "Bearer {auth}"
      }
    }
  },
  "drive": {
    "upload": {
      "method": "POST",
      "url": "https://www.googleapis.com/upload/drive/v3/files",
      "headers": {
        "authorization": "Bearer {auth}"
      }
    }
  },
  "dropbox": {
    "upload": {
      "method": "POST",
      "url": "https://content.dropboxapi.com/2/files/upload",
      "headers": {
        "authorization": "Bearer {auth}",
        "content-type": "application/octet-stream"
      }
    }
  }
}

// ----------------------------------------------------------------------------

;({

  // https://developer.box.com/reference/post-files-content/
  'box upload': async () => {
    var box = purest({provider: 'box', config, defaults: {
      auth: auth.box.token
    }})

    await box('upload')
      .multipart({
        attributes: JSON.stringify({
          name: 'cat.png',
          parent: {id: 0},
        }),
        file: fs.createReadStream(file.cat)
      })
      .request()
  },

  // https://developers.google.com/drive/api/v3/manage-uploads#http_1
  'drive upload': async () => {
    var drive = purest({provider: 'drive', config, defaults: {
      auth: auth.drive.token
    }})

    await drive('upload')
      .multipart([
        {
          'Content-Type': 'application/json',
          body: JSON.stringify({name: 'cat.png'})
        },
        {
          'Content-Type': 'image/png',
          body: fs.createReadStream(file.cat)
        }
      ])
      .request()
  },

  // https://www.dropbox.com/developers/documentation/http/documentation#files-upload
  'dropbox upload': async () => {
    var dropbox = purest({provider: 'dropbox', config, defaults: {
      auth: auth.dropbox.token
    }})

    await dropbox('upload')
      .headers({
        'Dropbox-API-Arg': JSON.stringify({path: '/cat.png'}),
      })
      .body(fs.createReadStream(file.cat))
      .request()
  },

})[process.argv[2]]()
