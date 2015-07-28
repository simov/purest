
var fs = require('fs')
  , path = require('path')
  , should = require('should')
var Purest = require('../../')
  , providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')
  , audio = path.resolve(__dirname, '../fixtures/beep.mp3')
  , pdf = path.resolve(__dirname, '../fixtures/coffee.pdf')


function error (err, done) {
  return (err instanceof Error)
    ? done(err)
    : (console.log(err) || done(new Error('Error response!')))
}

require('../utils/credentials')
var app = require('../../config/app')
  , user = require('../../config/user')

var p = {}
for (var name in providers) {
  var options = {
    provider:name,
    defaults:{headers:{'User-Agent':'Purest'}}
  }
  if (app[name]) {
    options.key = app[name].key
    options.secret = app[name].secret
  }
  p[name] = new Purest(options)
}


describe('asana', function () {
  it('options', function (done) {
    var id = '16202185639027'
    p.asana.post('tasks/'+id+'/attachments', {
      auth: {bearer:user.asana.token},
      formData:{
        file:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.name.should.equal('cat.png')
      done()
    })
  })
  it('query', function (done) {
    var id = '16202185639027'
    p.asana.query()
      .update('tasks/'+id+'/attachments')
      .upload({
        file:fs.createReadStream(image)
      })
      .auth(user.asana.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.name.should.equal('cat.png')
        done()
      })
  })
})

describe('box', function () {
  describe('options', function () {
    it('content API upload', function (done) {
      p.box.post('files/content', {
        api:'upload',
        auth:{bearer:user.box.token},
        qs:{parent_id:0},
        formData:{filename:fs.createReadStream(image)}
      }, function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.entries[0].name.should.equal('cat.png')
        done()
      })
    })
  })
  describe('query', function () {
    it('content API upload', function (done) {
      p.box.query('upload')
        .update('files/content')
        .where({parent_id:0})
        .upload({
          filename:fs.createReadStream(image)
        })
        .auth(user.box.token)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.entries[0].name.should.equal('cat.png')
          done()
        })
    })
  })
})

describe('facebook', function () {
  it('options', function (done) {
    p.facebook.post('me/photos', {
      qs:{
        access_token:user.facebook.token,
        message:'Sent on '+new Date()
      },
      formData:{
        source:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.match(/\d+/)
      body.post_id.should.match(/\d+_\d+/)
      done()
    })
  })
  it('query', function (done) {
    p.facebook.query()
      .update('me/photos')
      .upload({
        message:'Sent on '+new Date(),
        source:fs.createReadStream(image)
      })
      .auth(user.facebook.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.match(/\d+/)
        body.post_id.should.match(/\d+_\d+/)
        done()
      })
  })
})

describe('flickr', function () {
  describe('options', function () {
    it('upload', function (done) {
      p.flickr.post('', {
        api:'upload',
        oauth:{token:user.flickr.token, secret:user.flickr.secret},
        qs:{
          title:'Sent on '+new Date(),
          description:'...',
          is_public:0
        },
        formData: {
          title:'Sent on '+new Date(),
          description:'...',
          is_public:0,
          photo:fs.createReadStream(image)
        }
      },
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        res.statusCode.should.equal(200)
        done()
      })
    })
    it('replace', function (done) {
      p.flickr.post('', {
        api:'replace',
        oauth:{token:user.flickr.token, secret:user.flickr.secret},
        qs: {
          photo_id:'14887285783'
        },
        formData: {
          photo_id:'14887285783',
          photo:fs.createReadStream(image)
        }
      },
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        res.statusCode.should.equal(200)
        done()
      })
    })
  })
  describe('query', function () {
    it('upload', function (done) {
      p.flickr.query('upload')
        .update('')
        .where({
          title:'Sent on '+new Date(),
          description:'...',
          is_public:0
        })
        .upload({
          title:'Sent on '+new Date(),
          description:'...',
          is_public:0,
          photo:fs.createReadStream(image)
        })
        .auth(user.flickr.token, user.flickr.secret)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          res.statusCode.should.equal(200)
          done()
        })
    })
    it('replace', function (done) {
      p.flickr.query('replace')
        .update('')
        .where({
          photo_id:'14887285783'
        })
        .upload({
          photo_id:'14887285783',
          photo:fs.createReadStream(image)
        })
        .auth(user.flickr.token, user.flickr.secret)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          res.statusCode.should.equal(200)
          done()
        })
    })
  })
})

describe('flowdock', function () {
  it('options', function (done) {
    p.flowdock.post('messages', {
      auth:{bearer:user.flowdock.token},
      qs:{flow:user.flowdock.flow, event:'file'},
      formData:{
        content:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.content.file_size.should.equal(22025)
      done()
    })
  })
  it('query', function (done) {
    p.flowdock.query()
      .update('messages')
      .where({flow:user.flowdock.flow, event:'file'})
      .upload({
        content:fs.createReadStream(image)
      })
      .auth(user.flowdock.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.content.file_size.should.equal(22025)
        done()
      })
  })
})

describe('foursquare', function () {
  it('options', function (done) {
    p.foursquare.post('users/self/update', {
      qs:{
        oauth_token:user.foursquare.token,
        v:'20140503'
      },
      formData:{
        photo:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.meta.code.should.equal(200)
      done()
    })
  })
  it('query', function (done) {
    p.foursquare.query()
      .update('users/self/update')
      .where({v:'20140503'})
      .upload({
        photo:fs.createReadStream(image)
      })
      .auth(user.foursquare.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.meta.code.should.equal(200)
        done()
      })
  })
})

describe('google', function () {
  describe('options', function () {
    it('drive', function (done) {
      p.google.post('files', {
        api:'upload-drive',
        auth:{bearer:user.google.token},
        qs:{uploadType:'multipart'},
        multipart: [
          {
            'Content-Type':'application/json',
            body:JSON.stringify({
              title:'cat.png'
            })
          },
          {
            'Content-Type':'image/png',
            body:fs.createReadStream(image)
          }
        ]
      },
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.title.should.equal('cat.png')
        body.fileSize.should.equal('22025')
        done()
      })
    })
    it('batch', function (done) {
      p.google.post('batch', {
        auth:{bearer:user.google.token},
        headers:{'content-type':'multipart/mixed'},
        multipart: [
          {
            'Content-Type':'application/http',
            body:'GET https://www.googleapis.com/calendar/v3/users/me/calendarList\n'
          }, {
            'Content-Type':'application/http',
            body:'GET https://www.googleapis.com/calendar/v3/users/me/settings\n'
          }
        ]
      },
      function (err, res, body) {
        debugger
        if (err) return error(err, done)
        (body.match(/HTTP\/1.1 200 OK/g)||[]).length.should.equal(2)
        done()
      })
    })
  })
  describe('query', function () {
    it('drive', function (done) {
      p.google.query('upload-drive')
        .update('files')
        .where({uploadType:'multipart'})
        .upload([
          {
            'Content-Type':'application/json',
            body:JSON.stringify({title:'cat.png'})
          },
          {
            'Content-Type':'image/png',
            body:fs.createReadStream(image)
          }
        ])
        .auth(user.google.token)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.title.should.equal('cat.png')
          body.fileSize.should.equal('22025')
          done()
        })
    })
    it('batch', function (done) {
      p.google.query()
        .post('batch')
        .headers({'content-type':'multipart/mixed'})
        .multipart([
          {
            'Content-Type':'application/http',
            body:'GET https://www.googleapis.com/calendar/v3/users/me/calendarList\n'
          }, {
            'Content-Type':'application/http',
            body:'GET https://www.googleapis.com/calendar/v3/users/me/settings\n'
          }
        ])
        .auth(user.google.token)
        .request(function (err, res, body) {
          debugger
          if (err) return error(err, done)
          (body.match(/HTTP\/1.1 200 OK/g)||[]).length.should.equal(2)
          done()
        })
    })
  })
})

describe('mailgun', function () {
  it('options', function (done) {
    p.mailgun.post(user.mailgun.domain+'/messages', {
      auth:{user:'api',pass:user.mailgun.apikey},
      formData:{
        from:'purest@mailinator.com',
        to:'purest@mailinator.com,purest2@mailinator.com',
        subject:'Purest is awesome! (mailgun+attachments)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!',
        attachment:[fs.createReadStream(image), fs.createReadStream(audio)]
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.message.should.be.type('string')
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.mailgun.query()
      .update(user.mailgun.domain+'/messages')
      .upload({
        from:'purest@mailinator.com',
        to:'purest@mailinator.com,purest2@mailinator.com',
        subject:'Purest is awesome! (mailgun+attachments)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!',
        attachment:[
          fs.createReadStream(image),
          fs.createReadStream(audio)
        ]
      })
      .auth('api', user.mailgun.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.message.should.be.type('string')
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('sendgrid', function () {
  it('options', function (done) {
    p.sendgrid.post('mail.send', {
      formData:{
        api_user:user.sendgrid.user,
        api_key:user.sendgrid.pass,
        from:'purest@mailinator.com',
        to:['purest@mailinator.com','purest2@mailinator.com'],
        subject:'Purest is awesome! (sendgrid+attachments)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!',
        'files[cat.png]':fs.createReadStream(image),
        'files[beep.mp3]':fs.createReadStream(audio)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.message.should.equal('success')
      done()
    })
  })
  it('query', function (done) {
    p.sendgrid.query()
      .post('mail.send')
      .upload({
        from:'purest@mailinator.com',
        to:['purest@mailinator.com','purest2@mailinator.com'],
        subject:'Purest is awesome! (sendgrid+attachments)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!',
        'files[image.png]': fs.createReadStream(image),
        'files[beep.mp3]': fs.createReadStream(audio)
      })
      .auth(user.sendgrid.user, user.sendgrid.pass)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.message.should.equal('success')
        done()
      })
  })
})

describe('slack', function () {
  it('options', function (done) {
    p.slack.post('files.upload', {
      qs:{
        token:user.slack.token,
        filename:'cat',
        title:'Sent on '+new Date()
      },
      formData:{
        file:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.ok.should.equal(true)
      body.file.name.should.equal('cat')
      done()
    })
  })
  it('query', function (done) {
    p.slack.query()
      .update('files.upload')
      .upload({
        title:'Sent on '+new Date(),
        filename:'cat',
        file:fs.createReadStream(image)
      })
      .auth(user.slack.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.ok.should.equal(true)
        body.file.name.should.equal('cat')
        done()
      })
  })
})

describe('soundcloud', function () {
  it('options', function (done) {
    p.soundcloud.post('tracks', {
      qs:{
        oauth_token:user.soundcloud.token
      },
      formData:{
        'track[title]':'Sent on '+new Date(),
        'track[asset_data]':fs.createReadStream(audio)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.kind.should.equal('track')
      done()
    })
  })
  it('query', function (done) {
    p.soundcloud.query()
      .update('tracks')
      .upload({
        'track[title]':'Sent on '+new Date(),
        'track[asset_data]':fs.createReadStream(audio)
      })
      .auth(user.soundcloud.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.kind.should.equal('track')
        done()
      })
  })
})

describe('stocktwits', function () {
  it('options', function (done) {
    p.stocktwits.post('messages/create', {
      qs:{
        access_token:user.stocktwits.token
      },
      formData:{
        body:'Sent on '+new Date(),
        chart:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response.status.should.equal(200)
      body.message.entities.chart.should.be.an.instanceOf(Object)
      done()
    })
  })
  it('query', function (done) {
    p.stocktwits.query()
      .update('messages/create')
      .upload({
        body:'Sent on '+new Date(),
        chart:fs.createReadStream(image)
      })
      .auth(user.stocktwits.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.response.status.should.equal(200)
        body.message.entities.chart.should.be.an.instanceOf(Object)
        done()
      })
  })
})

describe('trello', function () {
  it('options', function (done) {
    p.trello.post('cards/'+user.trello.card+'/attachments', {
      qs:{key:app.trello.key, token:user.trello.token},
      formData:{
        file:fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.bytes.should.equal(22025)
      done()
    })
  })
  it('query', function (done) {
    p.trello.query()
      .update('cards/'+user.trello.card+'/attachments')
      .upload({file:fs.createReadStream(image)})
      .auth(app.trello.key, user.trello.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.bytes.should.equal(22025)
        done()
      })
  })
})

describe('twitter', function () {
  it('options', function (done) {
    p.twitter.post('statuses/update_with_media', {
      oauth:{token:user.twitter.token, secret:user.twitter.secret},
      formData:{
        status:'Sent on '+new Date(),
        'media[]':fs.createReadStream(image)
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.entities.media[0].should.be.an.instanceOf(Object)
      done()
    })
  })
  it('query', function (done) {
    p.twitter.query()
      .update('statuses/update_with_media')
      .upload({
        status:'Sent on '+new Date(),
        'media[]':fs.createReadStream(image)
      })
      .auth(user.twitter.token, user.twitter.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.entities.media[0].should.be.an.instanceOf(Object)
        done()
      })
  })
})
