
var purest = require('../')

// ----------------------------------------------------------------------------

var auth = {
  box: {
    // root_readwrite
    token: '',
  },
  dropbox: {
    // files.content.write - on the app
    token: '',
  },
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
  "dropbox": {
    "download": {
      "url": "https://content.dropboxapi.com/2/files/download",
      "headers": {
        "authorization": "Bearer {auth}"
      }
    },
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

  'stream file from dropbox to box': async () => {
    var box = purest({provider: 'box', config, defaults: {
      auth: auth.box.token
    }})
    var dropbox = purest({provider: 'dropbox', config, defaults: {
      auth: auth.dropbox.token
    }})

    var {res:download} = await dropbox('download')
      .headers({
        'Dropbox-API-Arg': JSON.stringify({path: '/cat.png'}),
      })
      .stream()

    await box('upload')
      .multipart({
        attributes: JSON.stringify({
          name: 'cat.png',
          parent: {id: 0},
        }),
        file: {
          body: download,
          options: {name: 'cat.png', type: 'image/png'}
        }
      })
      .request()
  }

})[process.argv[2]]()
