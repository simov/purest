
var fs = require('fs')
var path = require('path')
var should = require('should')
var Purest = require('../../')
var providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')
var audio = path.resolve(__dirname, '../fixtures/beep.mp3')
var pdf = path.resolve(__dirname, '../fixtures/coffee.pdf')


describe('upload', function () {
  function error (err, done) {
    return (err instanceof Error)
      ? done(err)
      : (console.log(err) || done(new Error('Network error!')))
  }

  require('../utils/credentials')
  var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
  }

  var p = {}
  before(function () {
    for (var name in providers) {
      var options = {
        provider:name,
        defaults:{headers:{'User-Agent':'Purest'}}
      }
      if (providers[name].__provider && providers[name].__provider.oauth) {
        options.key = cred.app[name].key
        options.secret = cred.app[name].secret
      }
      p[name] = new Purest(options)
    }
  })

  describe('asana', function () {
    describe('request', function () {
      it('upload', function (done) {
        var id = '16202185639027'
        p.asana.post('tasks/'+id+'/attachments', {
          auth: {bearer:cred.user.asana.token},
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
    })
    describe('query', function () {
      it('upload', function (done) {
        var id = '16202185639027'
        p.asana.query()
          .update('tasks/'+id+'/attachments')
          .upload({
            file:fs.createReadStream(image)
          })
          .auth(cred.user.asana.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.data.name.should.equal('cat.png')
            done()
          })
      })
    })
  })

  describe('box', function () {
    describe('request', function () {
      var file = {}
      it('content API upload', function (done) {
        p.box.post('files/content', {
          api:'upload',
          auth:{bearer:cred.user.box.token},
          qs:{parent_id:0},
          formData:{filename:fs.createReadStream(image)}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.entries[0].name.should.equal('cat.png')
          file = body.entries[0]
          done()
        })
      })
      it('download', function (done) {
        p.box.get('files/'+file.id+'/content', {
          auth:{bearer:cred.user.box.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.writeFileSync('cat.png', body, 'binary')
          fs.statSync('cat.png').size.should.equal(22025)
          done()
        })
      })
      it.skip('view API upload', function (done) {
        // works - need to figure out a testing scheme
        p.box.post('documents', {
          api:'view-upload',
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey,
            'content-type':'multipart/form-data'
          },
          formData:{
            name:'coffee.pdf',
            file:fs.readFileSync(pdf)
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.type.should.equal('document')
          body.status.should.equal('queued')
          done()
        })
      })
      after(function (done) {
        p.box.del('files/'+file.id, {
          auth:{bearer:cred.user.box.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.unlinkSync('cat.png')
          done()
        })
      })
    })
    describe('query', function () {
      var file = {}
      it('content API upload', function (done) {
        p.box.query('upload')
          .update('files/content')
          .where({parent_id:0})
          .upload({
            filename:fs.createReadStream(image)
          })
          .auth(cred.user.box.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.entries[0].name.should.equal('cat.png')
            file = body.entries[0]
            done()
          })
      })
      it('download', function (done) {
        p.box.query()
          .get('files/'+file.id+'/content')
          .auth(cred.user.box.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            fs.writeFileSync('cat.png', body, 'binary')
            fs.statSync('cat.png').size.should.equal(22025)
            done()
          })
      })
      it.skip('view API upload', function (done) {
        // works - need to figure out a testing scheme
        p.box.post('documents', {
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey
          },
          api:'view-upload',
          upload:'coffee.pdf',
          form:{name:'coffee.pdf', file:fs.readFileSync(pdf)}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.type.should.equal('document')
          body.status.should.equal('queued')
          done()
        })
      })
      after(function (done) {
        p.box.del('files/'+file.id, {
          auth:{bearer:cred.user.box.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.unlinkSync('cat.png')
          done()
        })
      })
    })
  })

  describe('facebook', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.facebook.post('me/photos', {
          qs:{
            access_token:cred.user.facebook.token,
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.facebook.query()
          .update('me/photos')
          .upload({
            message:'Sent on '+new Date(),
            source:fs.createReadStream(image)
          })
          .auth(cred.user.facebook.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.match(/\d+/)
            body.post_id.should.match(/\d+_\d+/)
            done()
          })
      })
    })
  })

  describe('flickr', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.flickr.post('', {
          api:'upload',
          oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
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
          oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
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
          .auth(cred.user.flickr.token, cred.user.flickr.secret)
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
          .auth(cred.user.flickr.token, cred.user.flickr.secret)
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
    describe('request', function () {
      it('upload', function (done) {
        p.flowdock.post('messages', {
          auth:{bearer:cred.user.flowdock.token},
          qs:{flow:cred.user.flowdock.flow, event:'file'},
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.flowdock.query()
          .update('messages')
          .where({flow:cred.user.flowdock.flow, event:'file'})
          .upload({
            content:fs.createReadStream(image)
          })
          .auth(cred.user.flowdock.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.content.file_size.should.equal(22025)
            done()
          })
      })
    })
  })

  describe('foursquare', function () {
    describe('request', function () {
      it('foursquare', function (done) {
        p.foursquare.post('users/self/update', {
          qs:{
            oauth_token:cred.user.foursquare.token,
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.foursquare.query()
          .update('users/self/update')
          .where({v:'20140503'})
          .upload({
            photo:fs.createReadStream(image)
          })
          .auth(cred.user.foursquare.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.meta.code.should.equal(200)
            done()
          })
      })
    })
  })

  describe('google', function () {
    describe('request', function () {
      it('drive', function (done) {
        p.google.post('files', {
          api:'upload-drive',
          qs:{
            access_token:cred.user.google.token,
            uploadType:'multipart'
          },
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
          auth:{bearer:cred.user.google.token},
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
              body:JSON.stringify({
                title:'cat.png'
              })
            },
            {
              'Content-Type':'image/png',
              body:fs.createReadStream(image)
            }
          ])
          .auth(cred.user.google.token)
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
          .auth(cred.user.google.token)
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
    describe('request', function () {
      it('upload', function (done) {
        p.mailgun.post(cred.user.mailgun.domain+'/messages', {
          auth:{user:'api',pass:cred.user.mailgun.apikey},
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.mailgun.query()
          .update(cred.user.mailgun.domain+'/messages')
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
          .auth('api', cred.user.mailgun.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.message.should.be.type('string')
            body.id.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('sendgrid', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.sendgrid.post('mail.send', {
          formData:{
            api_user:cred.user.sendgrid.user,
            api_key:cred.user.sendgrid.pass,
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
    })
    describe('query', function () {
      it('upload', function (done) {
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
          .auth(cred.user.sendgrid.user, cred.user.sendgrid.pass)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.message.should.equal('success')
            done()
          })
      })
    })
  })

  describe('slack', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.slack.post('files.upload', {
          qs:{
            token:cred.user.slack.token,
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.slack.query()
          .update('files.upload')
          .upload({
            title:'Sent on '+new Date(),
            filename:'cat',
            file:fs.createReadStream(image)
          })
          .auth(cred.user.slack.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.ok.should.equal(true)
            body.file.name.should.equal('cat')
            done()
          })
      })
    })
  })

  describe('soundcloud', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.soundcloud.post('tracks', {
          qs:{
            oauth_token:cred.user.soundcloud.token
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.soundcloud.query()
          .update('tracks')
          .upload({
            'track[title]':'Sent on '+new Date(),
            'track[asset_data]':fs.createReadStream(audio)
          })
          .auth(cred.user.soundcloud.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.kind.should.equal('track')
            done()
          })
      })
    })
  })

  describe('stocktwits', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.stocktwits.post('messages/create', {
          qs:{
            access_token:cred.user.stocktwits.token
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.stocktwits.query()
          .update('messages/create')
          .upload({
            body:'Sent on '+new Date(),
            chart:fs.createReadStream(image)
          })
          .auth(cred.user.stocktwits.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.response.status.should.equal(200)
            body.message.entities.chart.should.be.an.instanceOf(Object)
            done()
          })
      })
    })
  })

  describe('trello', function () {
    describe('request', function () {
      it('upload', function (done) {
        p.trello.post('cards/'+cred.user.trello.card+'/attachments', {
          qs:{key:cred.app.trello.key, token:cred.user.trello.token},
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.trello.query()
          .update('cards/'+cred.user.trello.card+'/attachments')
          .upload({file:fs.createReadStream(image)})
          .auth(cred.app.trello.key, cred.user.trello.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.bytes.should.equal(22025)
            done()
          })
      })
    })
  })

  describe('twitter', function () {
    describe('request', function () {
      it('twitter', function (done) {
        p.twitter.post('statuses/update_with_media', {
          oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
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
    })
    describe('query', function () {
      it('upload', function (done) {
        p.twitter.query()
          .update('statuses/update_with_media')
          .upload({
            status:'Sent on '+new Date(),
            'media[]':fs.createReadStream(image)
          })
          .auth(cred.user.twitter.token, cred.user.twitter.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.entities.media[0].should.be.an.instanceOf(Object)
            done()
          })
      })
    })
  })
})
