
var fs = require('fs')
  , path = require('path')
var should = require('should')
  , base64url = require('base64-url')
var Purest = require('../../')
  , providers = require('../../config/providers')
var image = path.resolve(__dirname, '../fixtures/cat.png')
  , audio = path.resolve(__dirname, '../fixtures/beep.mp3')


function error (err, done) {
  return (err instanceof Error)
    ? done(err)
    : (console.log(err) || done(new Error('Error response!')))
}

require('../utils/credentials')
var cred = {
  app:require('../../config/app'),
  user:require('../../config/user')
}

var p = {}
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


describe('facebook', function () {
  it('options', function (done) {
    p.facebook.post('me/feed', {
      qs:{access_token:cred.user.facebook.token},
      form:{message:'Sent on '+new Date()}
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.match(/\d+_\d+/)
      done()
    })
  })
})

describe('google', function () {
  it('gmail send', function (done) {
    // 'Message-ID: <1234869991.499a9ee7f1d5e@purest.generated>\n'+
    // 'Date: '+(new Date())+'\n'+
    // 'MIME-Version: 1.0\n'+
    // 'Content-Transfer-Encoding: quoted-printable\n'+
    // 'Content-Disposition: attachment; filename*=utf-8''report%E2%80%93may.pdf\n'+
    // 'Return-Path: <person@example.org>\n'+
    var message =
      'From: Purest <purest@mailinator.com>\n'+
      'To: Mailinator 1 <purest1@mailinator.com>,'+
          'Mailinator 2 <purest2@mailinator.com>\n'+
      'Cc: Mailinator 3 <purest3@mailinator.com>\n'+
      'Bcc: Mailinator 4 <purest4@mailinator.com>\n'+
      'Subject: Purest is awesome! (gmail)\n'+
      'Content-Type: text/html; charset=utf-8\n'+
      '\n'+
      '<h1>True idd!</h1>'

    p.google.post('users/me/messages/send', {
      api:'gmail',
      auth:{bearer:cred.user.google.token},
      json:{raw:base64url.encode(message)}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      should.deepEqual(body.labelIds, ['SENT'])
      done()
    })
  })
})

describe('linkedin', function () {
  it('options', function (done) {
    p.linkedin.post('people/~/shares', {
      oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
      form:{
        comment:'Sent on '+new Date(),
        visibility:{code:'anyone'}
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.updateKey.should.match(/^UPDATE-\d+-\d+$/)
      body.updateUrl.should.match(/^https:.*/)
      done()
    })
  })
  it('query', function (done) {
    p.linkedin.query()
      .update('people/~/shares')
      .json({
        comment:'Sent on '+new Date(),
        visibility:{code:'anyone'}
      })
      .auth(cred.user.linkedin.token, cred.user.linkedin.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.updateKey.should.match(/^UPDATE-\d+-\d+$/)
        body.updateUrl.should.match(/^https:.*/)
        done()
      })
  })
})

describe('mailgun', function () {
  it('options', function (done) {
    p.mailgun.post(cred.user.mailgun.domain+'/messages', {
      auth:{user:'api',pass:cred.user.mailgun.apikey},
      form:{
        from:'purest@mailinator.com',
        to:'purest@mailinator.com,purest2@mailinator.com',
        subject:'Purest is awesome! (mailgun)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!'
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

describe('mandrill', function () {
  it('send', function (done) {
    p.mandrill.post('messages/send', {
      form:{
        key:cred.user.mandrill.apikey,
        message: {
          from_email:'purest@mailinator.com',
          to:[{email:'purest@mailinator.com'}, {email:'purest2@mailinator.com'}],
          subject:'Purest is awesome! (mandrill)',
          html:'<h1>Purest is awesome!</h1>',
          text:'True idd!'
        }
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      should.deepEqual(Object.keys(body[0]), ['email','status','_id', 'reject_reason'])
      should.deepEqual(Object.keys(body[1]), ['email','status','_id', 'reject_reason'])
      done()
    })
  })
  it('attachments', function (done) {
    // uses base64 instead of multipart
    p.mandrill.post('messages/send', {
      form:{
        key:cred.user.mandrill.apikey,
        message: {
          from_email:'purest@mailinator.com',
          to:[{email:'purest@mailinator.com'}, {email:'purest2@mailinator.com'}],
          subject:'Purest is awesome! (mandrill+attachments)',
          html:'<h1>Purest is awesome!</h1>',
          text:'True idd!',
          attachments:[{
            type:'image/png',name:'cat.png',
            content:fs.readFileSync(image).toString('base64')
          }, {
            type:'audio/mp3',name:'beep.mp3',
            content:fs.readFileSync(audio).toString('base64')
          }]
        }
      }
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      should.deepEqual(Object.keys(body[0]), ['email','status','_id'])
      should.deepEqual(Object.keys(body[1]), ['email','status','_id'])
      done()
    })
  })
})

describe('sendgrid', function () {
  it('options', function (done) {
    p.sendgrid.post('mail.send', {
      form:{
        api_user:cred.user.sendgrid.user,
        api_key:cred.user.sendgrid.pass,
        from:'purest@mailinator.com',
        to:['purest@mailinator.com','purest2@mailinator.com'],
        subject:'Purest is awesome! (sendgrid)',
        html:'<h1>Purest is awesome!</h1>',
        text:'True idd!'
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

describe('stocktwits', function () {
  it('options', function (done) {
    p.stocktwits.post('messages/create', {
      qs:{access_token:cred.user.stocktwits.token},
      form:{body:'Sent on '+new Date()}
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response.status.should.equal(200)
      should.deepEqual(Object.keys(body.message),
        ['id','body','created_at','user','source'])
      done()
    })
  })
})

describe('twitter', function () {
  it('options', function (done) {
    p.twitter.post('statuses/update', {
      oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
      form:{status:'Sent on '+new Date()}
    },
    function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      body.id_str.should.be.type('string')
      done()
    })
  })
})
