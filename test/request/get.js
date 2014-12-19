
var fs = require('fs')
var path = require('path')
var should = require('should')
var Purest = require('../../lib/provider')
var providers = require('../../config/providers')


describe('get', function () {
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
      if (providers[name].__provider.oauth) {
        options.key = cred.app[name].key
        options.secret = cred.app[name].secret
      }
      p[name] = new Purest(options)
    }
  })

  describe('500px', function () {
    describe('request', function () {
      it('get', function (done) {
        p['500px'].get('users', {
          oauth:{token:cred.user['500px'].token, secret:cred.user['500px'].secret}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.user.should.be.type('object')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p['500px'].query()
          .get('users')
          .auth(cred.user['500px'].token, cred.user['500px'].secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.user.should.be.type('object')
            done()
          })
      })
    })
  })

  describe('aboutme', function () {
    describe('request', function () {
      it('apikey', function (done) {
        p.aboutme.get('user/view/simeonv', {
          headers:{Authorization:'Basic '+cred.user.aboutme.apikey}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.user_name.should.equal('simeonv')
          done()
        })
      })
      it('token', function (done) {
        p.aboutme.get('user/directory/simeonv', {
          qs: {
            client_id:cred.user.aboutme.apikey,
            token:cred.user.aboutme.token
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.status.should.equal(200)
          done()
        })
      })
    })
    describe('query', function () {
      it('apikey', function (done) {
        p.aboutme.query('user')
          .select('view/simeonv')
          .auth(cred.user.aboutme.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.user_name.should.equal('simeonv')
            done()
          })
      })
      it('token', function (done) {
        p.aboutme.query('user')
          .get('directory/simeonv')
          .auth(cred.user.aboutme.apikey, cred.user.aboutme.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.status.should.equal(200)
            done()
          })
      })
    })
  })

  describe('asana', function () {
    describe('request', function () {
      it('basic auth', function (done) {
        p.asana.get('users/me', {
          auth:{user:cred.user.asana.apikey, pass:''}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body.data),
            ['id','name','email','photo','workspaces'])
          done()
        })
      })
      it('oauth', function (done) {
        p.asana.get('users/me', {
          auth: {bearer:cred.user.asana.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body.data),
            ['id','name','email','photo','workspaces'])
          done()
        })
      })
    })
    describe('query', function () {
      it('basic auth', function (done) {
        p.asana.config()
          .get('users/me')
          .auth(cred.user.asana.apikey,'')
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(Object.keys(body.data),
              ['id','name','email','photo','workspaces'])
            done()
          })
      })
      it('oauth', function (done) {
        p.asana.config()
          .get('users/me')
          .auth(cred.user.asana.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(Object.keys(body.data),
              ['id','name','email','photo','workspaces'])
            done()
          })
      })
    })
  })

  describe('bitly', function () {
    describe('request', function () {
      it('get', function (done) {
        p.bitly.get('bitly_pro_domain', {
          qs:{access_token:cred.user.bitly.token, domain:'nyti.ms'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.data.domain.should.equal('nyti.ms')
          body.data.bitly_pro_domain.should.equal(true)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.bitly.query()
          .select('bitly_pro_domain')
          .where({domain:'nyti.ms'})
          .auth(cred.user.bitly.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.data.domain.should.equal('nyti.ms')
            body.data.bitly_pro_domain.should.equal(true)
            done()
          })
      })
    })
  })

  describe('box', function () {
    describe('request', function () {
      it('content API', function (done) {
        p.box.get('users/me', {
          auth:{bearer:cred.user.box.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.type.should.equal('user')
          body.id.should.be.type('string')
          done()
        })
      })
      it('view API', function (done) {
        p.box.get('documents', {
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey
          },
          api:'view'
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.document_collection.should.be.an.instanceOf(Object)
          done()
        })
      })
      it.skip('view download', function (done) {
        // needs session/sharing permissions for that document
        p.box.get('documents/d7ee1566af95470eb2a44df5f612ed17/content.pdf', {
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey
          },
          api:'view'
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.writeFileSync('test.pdf', body, 'binary')
          fs.statSync('test.pdf').size.should.equal(973602)
          done()
        })
      })
      it.skip('cloud download', function (done) {
        // works
        p.box.get('zzxlzc38hq7u1u5jdteu.pdf', {
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey
          },
          api:'download'
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.writeFileSync('test.pdf', body, 'binary')
          fs.statSync('test.pdf').size.should.equal(973602)
          done()
        })
      })
      after(function () {
        // fs.unlinkSync('test.pdf')
      })
    })
    describe('query', function () {
      it('content API', function (done) {
        p.box.config()
          .get('users/me')
          .auth(cred.user.box.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.type.should.equal('user')
            body.id.should.be.type('string')
            done()
          })
      })
      it('view API', function (done) {
        p.box.config('view')
          .get('documents')
          .auth(cred.user.box.viewapikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.document_collection.should.be.an.instanceOf(Object)
            done()
          })
      })
      it.skip('view download', function (done) {
        // needs session/sharing permissions for that document
        p.box.get('documents/d7ee1566af95470eb2a44df5f612ed17/content.pdf', {
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey
          },
          api:'view'
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.writeFileSync('test.pdf', body, 'binary')
          fs.statSync('test.pdf').size.should.equal(973602)
          done()
        })
      })
      it.skip('cloud download', function (done) {
        // works
        p.box.get('zzxlzc38hq7u1u5jdteu.pdf', {
          headers: {
            'Authorization':'Token '+cred.user.box.viewapikey
          },
          api:'download'
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          fs.writeFileSync('test.pdf', body, 'binary')
          fs.statSync('test.pdf').size.should.equal(973602)
          done()
        })
      })
      after(function () {
        // fs.unlinkSync('test.pdf')
      })
    })
  })

  describe('buffer', function () {
    describe('request', function () {
      it('get', function (done) {
        p.buffer.get('user', {
          qs:{access_token:cred.user.buffer.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.id.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.buffer.query()
          .get('user')
          .auth(cred.user.buffer.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('coderbits', function () {
    describe('request', function () {
      it('get', function (done) {
        p.coderbits.get('simov', function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.username.should.equal('simov')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.coderbits.get('simov', function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.username.should.equal('simov')
          done()
        })
      })
    })
  })

  describe('deviantart', function () {
    describe('request', function () {
      it('get', function (done) {
        p.deviantart.get('user/whoami', {
          auth:{bearer:cred.user.deviantart.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.userid.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.deviantart.query()
          .select('user/whoami')
          .auth(cred.user.deviantart.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.userid.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('digitalocean', function () {
    describe('request', function () {
      it('bearer', function (done) {
        p.digitalocean.get('actions', {
          auth:{bearer:cred.user.digitalocean.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.actions.should.be.instanceOf(Array)
          done()
        })
      })
      it('basic', function (done) {
        p.digitalocean.get('actions', {
          auth:{user:cred.user.digitalocean.apikey, pass:''}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.actions.should.be.instanceOf(Array)
          done()
        })
      })
    })
    describe('query', function () {
      it('bearer', function (done) {
        p.digitalocean.query()
          .get('actions')
          .auth(cred.user.digitalocean.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.actions.should.be.instanceOf(Array)
            done()
          })
      })
      it('basic', function (done) {
        p.digitalocean.query()
          .get('actions')
          .auth(cred.user.digitalocean.apikey, '')
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.actions.should.be.instanceOf(Array)
            done()
          })
      })
    })
  })

  describe('disqus', function () {
    describe('request', function () {
      it('get', function (done) {
        p.disqus.get('users/details', {
          qs:{
            api_key:cred.app.disqus.key,
            access_token:cred.user.disqus.token
          },
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.response.id.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.disqus.query()
          .get('users/details')
          .auth(cred.app.disqus.key, cred.user.disqus.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.response.id.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('dropbox', function () {
    describe('request', function () {
      it('get', function (done) {
        p.dropbox.get('account/info', {
          auth: {bearer:cred.user.dropbox.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.email.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.dropbox.query()
          .get('account/info')
          .auth(cred.user.dropbox.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.email.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('facebook', function () {
    describe('request', function () {
      it('get', function (done) {
        p.facebook.get('me/groups', {
          auth:{bearer:cred.user.facebook.token},
          qs:{fields:'id,name'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.data.length.should.equal(2)
          Object.keys(body.data[0]).length.should.equal(2)
          body.data[0].id.should.equal('313807222041302')
          body.data[0].name.should.equal('Facebook Developers')
          done()
        })
      })
      it('fql', function (done) {
        p.facebook.get('fql', {
          qs:{
            access_token:cred.user.facebook.token,
            q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.data[0].friend_count.should.equal(1)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.facebook.query()
          .get('me/groups')
          .where({fields:'id,name'})
          .auth(cred.user.facebook.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.data.length.should.equal(2)
            Object.keys(body.data[0]).length.should.equal(2)
            body.data[0].id.should.equal('313807222041302')
            body.data[0].name.should.equal('Facebook Developers')
            done()
          })
      })
      it('fql', function (done) {
        p.facebook.query()
          .select('fql')
          .where({q:'SELECT friend_count FROM user WHERE uid = 100006399333306'})
          .auth(cred.user.facebook.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.data[0].friend_count.should.equal(1)
            done()
          })
      })
    })
  })

  describe('flickr', function () {
    describe('request', function () {
      it('get', function (done) {
        p.flickr.get('', {
          oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
          qs:{
            method: 'flickr.people.findByUsername',
            api_key:cred.app.flickr.key,
            username:'obama',
            format:'json'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.stat.should.equal('ok')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.flickr.query()
          .select('')
          .where({
            method: 'flickr.people.findByUsername',
            api_key:cred.app.flickr.key,
            username:'obama'
          })
          .auth(cred.user.flickr.token, cred.user.flickr.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.stat.should.equal('ok')
            done()
          })
      })
    })
  })

  describe('flowdock', function () {
    describe('request', function () {
      it('get', function (done) {
        p.flowdock.get('users', {
          auth:{bearer:cred.user.flowdock.token},
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.should.be.instanceOf(Array)
          done()
        })
      })
    })
    describe('query', function () {
      it('oauth2', function (done) {
        p.flowdock.query()
          .get('users')
          .auth(cred.user.flowdock.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.be.instanceOf(Array)
            done()
          })
      })
      it('basic', function (done) {
        p.flowdock.query()
          .get('users')
          .auth(cred.user.flowdock.user, cred.user.flowdock.pass)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.be.instanceOf(Array)
            done()
          })
      })
      it('api token', function (done) {
        p.flowdock.query()
          .get('users')
          .auth(cred.user.flowdock.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.be.instanceOf(Array)
            done()
          })
      })
    })
  })

  describe('foursquare', function () {
    describe('request', function () {
      it('foursquare', function (done) {
        p.foursquare.get('users/81257627', {
          qs:{oauth_token:cred.user.foursquare.token, v:'20140503'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.response.user.firstName.should.equal('Simo')
          done()
        })
      })
    })
    describe('query', function () {
      it('foursquare', function (done) {
        p.foursquare.query()
          .get('users/81257627')
          .where({v:'20140503'})
          .auth(cred.user.foursquare.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.response.user.firstName.should.equal('Simo')
            done()
          })
      })
    })
  })

  describe('github', function () {
    describe('request', function () {
      it('get', function (done) {
        p.github.get('users/simov', {
          qs:{access_token:cred.user.github.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.login.should.equal('simov')
          body.name.should.equal('simo')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.github.query()
          .get('users/simov')
          .auth(cred.user.github.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.login.should.equal('simov')
            body.name.should.equal('simo')
            done()
          })
      })
    })
  })

  describe('gitter', function () {
    describe('request', function () {
      it('get', function (done) {
        p.gitter.get('user', {
          auth:{bearer:cred.user.gitter.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body[0].id.should.be.type('string')
          body[0].username.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.gitter.query()
          .get('user')
          .auth(cred.user.gitter.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body[0].id.should.be.type('string')
            body[0].username.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('google', function () {
    describe('request', function () {
      it('calendar', function (done) {
        p.google.get('users/me/calendarList', {
          api:'calendar',
          qs:{
            access_token:cred.user.google.token
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.items.should.be.instanceOf(Array)
          done()
        })
      })
      it('gmail', function (done) {
        p.google.get('users/me/profile', {
          api:'gmail',
          auth:{bearer:cred.user.google.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.emailAddress.should.be.type('string')
          body.messagesTotal.should.be.type('number')
          done()
        })
      })
      it('plus', function (done) {
        p.google.get('people/106189723444098348646', {
          api:'plus',
          qs:{
            access_token:cred.user.google.token
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.displayName.should.equal('Larry Page')
          done()
        })
      })
      it('youtube', function (done) {
        p.google.get('channels', {
          api:'youtube',
          qs:{
            access_token:cred.user.google.token,
            part:'id, snippet, contentDetails, statistics, status, topicDetails',
            forUsername:'RayWilliamJohnson'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.items[0].snippet.title.should.equal('RayWilliamJohnson')
          done()
        })
      })
      it('youtube/analytics', function (done) {
        p.google.get('reports', {
          api:'youtube/analytics',
          qs:{
            access_token:cred.user.google.token,
            ids:'channel==UCar6nMFGfuv254zn5vDyVaA',
            metrics:'views',
            'start-date':'2014-01-15',
            'end-date':'2014-02-15'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.rows.should.be.an.instanceOf(Array)
          done()
        })
      })
      it('drive', function (done) {
        p.google.get('about', {
          api:'drive',
          qs:{
            access_token:cred.user.google.token
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.user.isAuthenticatedUser.should.equal(true)
          done()
        })
      })
      it('freebase', function (done) {
        p.google.get('search', {
          api:'freebase',
          qs:{
            access_token:cred.user.google.token,
            query:'Thriftworks'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.result[0].name.should.equal('Thriftworks')
          done()
        })
      })
      it('tasks', function (done) {
        p.google.get('users/@me/lists', {
          api:'tasks',
          qs:{
            access_token:cred.user.google.token
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.items[0].title.should.equal('Default List')
          done()
        })
      })
      it('urlshortener', function (done) {
        p.google.get('url', {
          api:'urlshortener',
          qs:{
            key:cred.user.google.apikey,
            shortUrl:'http://goo.gl/0wkZ4V'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.longUrl.should.equal('http://nodejs.org/')
          done()
        })
      })
      it('pagespeed', function (done) {
        p.google.get('runPagespeed', {
          api:'pagespeedonline',
          qs:{
            key:cred.user.google.apikey,
            url:'http://www.amazon.com/'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.responseCode.should.equal(200)
          done()
        })
      })
      it('contacts', function (done) {
        p.google.get('contacts/default/full', {
          api:'contacts',
          qs:{
            access_token:cred.user.google.token,
            'max-results':50
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.feed['openSearch$itemsPerPage']['$t'].should.equal('50')
          done()
        })
      })
      describe('gmaps', function () {
        it('streetview', function (done) {
          p.google.get('streetview', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              location:'40.7828647,-73.9653551',
              size:'400x400',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            fs.writeFileSync('streetview.jpg', body, 'binary')
            done()
          })
        })
        it('staticmap', function (done) {
          p.google.get('staticmap', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              center:'40.7828647,-73.9653551',
              size:'640x640',
              zoom:15,
              format:'jpg',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            fs.writeFileSync('staticmap.jpg', body, 'binary')
            done()
          })
        })
        it('geocode', function (done) {
          p.google.get('geocode/json', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              address:'Central Park, New York, NY',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.results[0].formatted_address
              .should.equal('Central Park, New York, NY, USA')
            done()
          })
        })
        it('directions', function (done) {
          p.google.get('directions/json', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              origin:'Central Park, New York, NY',
              destination:'New York, New Jersey',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.routes[0].summary
              .should.equal('79th St Transverse and Central Park West')
            done()
          })
        })
        it('timezone', function (done) {
          p.google.get('timezone/json', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              location:'40.7828647,-73.9653551',
              timestamp:'1331161200',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.timeZoneName.should.equal('Eastern Standard Time')
            done()
          })
        })
        it('elevation', function (done) {
          p.google.get('elevation/json', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              locations:'40.7828647,-73.9653551',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.results[0].elevation.should.equal(34.39545059204102)
            done()
          })
        })
        it('distancematrix', function (done) {
          p.google.get('distancematrix/json', {
            api:'gmaps',
            qs:{
              key:cred.user.google.apikey,
              origins:'40.7828647,-73.9653551',
              destinations:'40.7873463,-74.0108939',
              sensor:false
            }
          }, function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.rows[0].elements[0].distance.text.should.equal('11.8 km')
            body.rows[0].elements[0].duration.text.should.equal('21 mins')
            done()
          })
        })
        after(function () {
          fs.unlinkSync('staticmap.jpg')
          fs.unlinkSync('streetview.jpg')
        })
      })
    })
    describe('query', function () {
      it('calendar', function (done) {
        p.google.query('calendar')
          .get('users/me/calendarList')
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.items.should.be.instanceOf(Array)
            done()
          })
      })
      it('gmail', function (done) {
        p.google.query('gmail')
          .select('users/me/profile')
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.emailAddress.should.be.type('string')
            body.messagesTotal.should.be.type('number')
            done()
          })
      })
      it('plus', function (done) {
        p.google.query('plus')
          .select('people/106189723444098348646')
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.displayName.should.equal('Larry Page')
            done()
          })
      })
      it('youtube', function (done) {
        p.google.query('youtube')
          .select('channels')
          .where({
            forUsername:'RayWilliamJohnson',
            part:'id, snippet, contentDetails, statistics, status, topicDetails'
          })
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.items[0].snippet.title.should.equal('RayWilliamJohnson')
            done()
          })
      })
      it('youtube/analytics', function (done) {
        p.google.query('youtube/analytics')
          .select('reports')
          .where({
            ids:'channel==UCar6nMFGfuv254zn5vDyVaA',
            metrics:'views',
            'start-date':'2014-01-15',
            'end-date':'2014-02-15'
          })
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.rows.should.be.an.instanceOf(Array)
            done()
          })
      })
      it('drive', function (done) {
        p.google.query('drive')
          .get('about')
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.user.isAuthenticatedUser.should.equal(true)
            done()
          })
      })
      it('freebase', function (done) {
        p.google.query('freebase')
          .select('search')
          .where({query:'Thriftworks'})
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.result[0].name.should.equal('Thriftworks')
            done()
          })
      })
      it('tasks', function (done) {
        p.google.query('tasks')
          .select('users/@me/lists')
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.items[0].title.should.equal('Default List')
            done()
          })
      })
      it('urlshortener', function (done) {
        p.google.query('urlshortener')
          .select('url')
          .where({shortUrl:'http://goo.gl/0wkZ4V'})
          .auth(cred.user.google.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.longUrl.should.equal('http://nodejs.org/')
            done()
          })
      })
      it('pagespeed', function (done) {
        p.google.query('pagespeedonline')
          .select('runPagespeed')
          .where({url:'http://www.amazon.com/'})
          .auth(cred.user.google.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.responseCode.should.equal(200)
            done()
          })
      })
      it('contacts', function (done) {
        p.google.query('contacts')
          .select('contacts/default/full')
          .where({'max-results':50})
          .auth(cred.user.google.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.feed['openSearch$itemsPerPage']['$t'].should.equal('50')
            done()
          })
      })
      describe('gmaps', function () {
        it('streetview', function (done) {
          p.google.query('gmaps')
            .get('streetview')
            .where({
              location:'40.7828647,-73.9653551',
              size:'400x400',
              sensor:false
            })
            .auth(cred.user.google.apikey)
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              fs.writeFileSync('streetview.jpg', body, 'binary')
              done()
            })
        })
        it('staticmap', function (done) {
          p.google.query('gmaps')
            .get('staticmap')
            .where({
              center:'40.7828647,-73.9653551',
              size:'640x640',
              zoom:15,
              format:'jpg',
              sensor:false
            })
            .auth(cred.user.google.apikey)
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              fs.writeFileSync('staticmap.jpg', body, 'binary')
              done()
            })
        })
        it('geocode', function (done) {
          p.google.query('gmaps')
            .get('geocode')
            .where({
              address:'Central Park, New York, NY',
              sensor:false
            })
            .auth(cred.user.google.apikey)
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              body.results[0].formatted_address
                .should.equal('Central Park, New York, NY, USA')
              done()
            })
        })
        it('directions', function (done) {
          p.google.query('gmaps')
            .get('directions')
            .where({
              origin:'Central Park, New York, NY',
              destination:'New York, New Jersey',
              sensor:false
            })
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              body.routes[0].summary
                .should.equal('79th St Transverse and Central Park West')
              done()
            })
        })
        it('timezone', function (done) {
          p.google.query('gmaps')
            .select('timezone')
            .where({
              location:'40.7828647,-73.9653551',
              timestamp:'1331161200',
              sensor:false
            })
            .auth(cred.user.google.apikey)
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              body.timeZoneName.should.equal('Eastern Standard Time')
              done()
            })
        })
        it('elevation', function (done) {
          p.google.query('gmaps')
            .get('elevation')
            .where({
              locations:'40.7828647,-73.9653551',
              sensor:false
            })
            .auth(cred.user.google.apikey)
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              body.results[0].elevation.should.equal(34.39545059204102)
              done()
            })
        })
        it('distancematrix', function (done) {
          p.google.query('gmaps')
            .get('distancematrix')
            .where({
              origins:'40.7828647,-73.9653551',
              destinations:'40.7873463,-74.0108939',
              sensor:false
            })
            .auth(cred.user.google.apikey)
            .request(function (err, res, body) {
              debugger
              if (err) return error(err, done)
              body.rows[0].elements[0].distance.text.should.equal('11.8 km')
              body.rows[0].elements[0].duration.text.should.equal('21 mins')
              done()
            })
        })
        after(function () {
          fs.unlinkSync('staticmap.jpg')
          fs.unlinkSync('streetview.jpg')
        })
      })
    })
  })

  describe('hackpad', function () {
    describe('request', function () {
      it('get', function (done) {
        p.hackpad.get('search', {
          oauth:{},
          qs:{q:'hackpad'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.should.be.instanceOf(Array)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.hackpad.query()
          .select('search')
          .where({q:'hackpad'})
          .auth()
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.be.instanceOf(Array)
            done()
          })
      })
    })
  })

  describe('heroku', function () {
    describe('request', function () {
      it('get', function (done) {
        p.heroku.get('account', {
          auth: {bearer:cred.user.heroku.token}
          // or
          // auth: {user:'email', pass:'password'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.email.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.heroku.query()
          .get('account')
          .auth(cred.user.heroku.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.email.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('imgur', function () {
    describe('request', function () {
      it('apikey', function (done) {
        p.imgur.get('account/simov', {
          headers: {Authorization: 'Client-ID '+cred.app.imgur.key}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.data.url.should.equal('simov')
          done()
        })
      })
      it('token', function (done) {
        p.imgur.get('account/simov', {
          auth:{bearer:cred.user.imgur.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.data.url.should.equal('simov')
          done()
        })
      })
    })
    describe('query', function () {
      it('apikey', function (done) {
        p.imgur.query()
          .get('account/simov')
          .auth(cred.app.imgur.key)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.data.url.should.equal('simov')
            done()
          })
      })
      it('token', function (done) {
        p.imgur.query()
          .get('account/simov')
          .auth(cred.user.imgur.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.data.url.should.equal('simov')
            done()
          })
      })
    })
  })

  describe('instagram', function () {
    describe('request', function () {
      it('get', function (done) {
        p.instagram.get('users/self/feed', {
          qs:{access_token:cred.user.instagram.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.pagination.should.be.type('object')
          body.meta.code.should.equal(200)
          body.data.should.be.an.instanceOf(Array)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.instagram.query()
          .select('users/self/feed')
          .auth(cred.user.instagram.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.pagination.should.be.type('object')
            body.meta.code.should.equal(200)
            body.data.should.be.an.instanceOf(Array)
            done()
          })
      })
    })
  })

  describe('linkedin', function () {
    describe('request', function () {
      it('oauth1', function (done) {
        p.linkedin.get('people/~', {
          oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.firstName.should.be.type('string')
          body.lastName.should.be.type('string')
          done()
        })
      })
      it('oauth2', function (done) {
        p.linkedin.get('people/~', {
          qs:{oauth2_access_token:cred.user.linkedin.oauth2}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.firstName.should.be.type('string')
          body.lastName.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('oauth1', function (done) {
        p.linkedin.query()
          .select('people/~')
          .auth(cred.user.linkedin.token, cred.user.linkedin.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.firstName.should.be.type('string')
            body.lastName.should.be.type('string')
            done()
          })
      })
      it('oauth2', function (done) {
        p.linkedin.query()
          .select('people/~')
          .auth(cred.user.linkedin.oauth2)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.firstName.should.be.type('string')
            body.lastName.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('live', function () {
    describe('request', function () {
      it('get', function (done) {
        p.live.get('me', {
          qs:{access_token:cred.user.live.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.id.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.live.query()
          .select('me')
          .auth(cred.user.live.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('mailchimp', function () {
    describe('request', function () {
      it('apikey', function (done) {
        p.mailchimp.get('campaigns/list', {
          qs:{apikey:cred.user.mailchimp.apikey}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body),
            ['total','data','errors'])
          body.errors.length.should.equal(0)
          done()
        })
      })
      it('oauth', function (done) {
        p.mailchimp.get('campaigns/list', {
          domain:cred.user.mailchimp.domain,
          qs:{apikey:cred.user.mailchimp.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body),
            ['total','data','errors'])
          body.errors.length.should.equal(0)
          done()
        })
      })
    })
    describe('query', function () {
      it('apikey', function (done) {
        p.mailchimp.query()
          .select('campaigns/list')
          .auth(cred.user.mailchimp.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(Object.keys(body),
              ['total','data','errors'])
            body.errors.length.should.equal(0)
            done()
          })
      })
      it('oauth', function (done) {
        p.mailchimp.query()
          .select('campaigns/list')
          .auth(cred.user.mailchimp.token)
          .options({domain:cred.user.mailchimp.domain})
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(Object.keys(body),
              ['total','data','errors'])
            body.errors.length.should.equal(0)
            done()
          })
      })
    })
  })

  describe('mailgun', function () {
    describe('request', function () {
      it('get', function (done) {
        p.mailgun.get(cred.user.mailgun.domain+'/stats', {
          auth:{user:'api',pass:cred.user.mailgun.apikey}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.total_count.should.be.type('number')
          body.items.should.be.instanceOf(Array)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.mailgun.query()
          .select(cred.user.mailgun.domain+'/stats')
          .auth('api', cred.user.mailgun.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.total_count.should.be.type('number')
            body.items.should.be.instanceOf(Array)
            done()
          })
      })
    })
  })

  describe('mandrill', function () {
    describe('request', function () {
      it('get', function (done) {
        p.mandrill.post('users/info', {
          form:{key:cred.user.mandrill.key}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.reputation.should.be.type('number')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.mandrill.query()
          .post('users/info')
          .auth(cred.user.mandrill.key)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.reputation.should.be.type('number')
            done()
          })
      })
    })
  })

  describe('odesk', function () {
    describe('request', function () {
      it('get', function (done) {
        p.odesk.get('info', {
          api:'auth',
          oauth:{
            token:cred.user.odesk.token,
            secret:cred.user.odesk.secret
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.info.ref.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.odesk.query('auth')
          .select('info')
          .auth(cred.user.odesk.token, cred.user.odesk.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.info.ref.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('openstreetmap', function () {
    describe('request', function () {
      it('get', function (done) {
        p.openstreetmap.get('user/details', {
          // oauth for writing to the database
          oauth:{
            token:cred.user.openstreetmap.token,
            secret:cred.user.openstreetmap.secret
          }
          // or basic auth for reading user details
          // auth: {user:'email', pass:'password'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/)
          done()
        })
      })
    })
    describe('query', function () {
      it('oauth', function (done) {
        p.openstreetmap.query()
          .select('user/details')
          .auth(cred.user.openstreetmap.token, cred.user.openstreetmap.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/)
            done()
          })
      })
      it('basic auth', function (done) {
        p.openstreetmap.query()
          .select('user/details')
          .auth(cred.user.openstreetmap.user, cred.user.openstreetmap.pass)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/)
            done()
          })
      })
    })
  })

  describe('paypal', function () {
    describe('request', function () {
      it('get', function (done) {
        p.paypal.get('userinfo', {
          api:'identity',
          auth:{bearer:cred.user.paypal.token},
          qs: {schema:'openid'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.user_id.should.be.type('string')
          body.name.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.paypal.query('identity')
          .get('userinfo')
          .where({schema:'openid'})
          .auth(cred.user.paypal.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.user_id.should.be.type('string')
            body.name.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('redbooth', function () {
    describe('request', function () {
      it('get', function (done) {
        p.redbooth.get('me', {
          auth:{bearer:cred.user.redbooth.token},
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.id.should.be.type('number')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.redbooth.query()
          .get('me')
          .auth(cred.user.redbooth.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.be.type('number')
            done()
          })
      })
    })
  })

  describe('rubygems', function () {
    describe('request', function () {
      it('get', function (done) {
        p.rubygems.get('gems/rails', function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.name.should.equal('rails')
          body.platform.should.equal('ruby')
          done()
        })
      })
    })
    describe('query', function () {
      it('headers auth', function (done) {
        p.rubygems.query()
          .get('gems')
          .auth(cred.user.rubygems.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(body, [])
            done()
          })
      })
      it('basic auth', function (done) {
        p.rubygems.query()
          .get('api_key')
          .auth(cred.user.rubygems.user, cred.user.rubygems.pass)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.rubygems_api_key.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('salesforce', function () {
    describe('request', function () {
      it('get', function (done) {
        p.salesforce.get('sobjects/Account', {
          domain:cred.user.salesforce.domain,
          auth:{bearer:cred.user.salesforce.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(Object.keys(body), ['objectDescribe', 'recentItems'])
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.salesforce.query('sobjects')
          .get('Account')
          .options({domain:cred.user.salesforce.domain})
          .auth(cred.user.salesforce.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(Object.keys(body), ['objectDescribe', 'recentItems'])
            done()
          })
      })
    })
  })

  describe('sendgrid', function () {
    describe('request', function () {
      it('get', function (done) {
        p.sendgrid.get('profile.get', {
          qs:{api_user:cred.user.sendgrid.user, api_key:cred.user.sendgrid.pass}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body[0].active.should.equal('true')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.sendgrid.query()
          .select('profile.get')
          .auth(cred.user.sendgrid.user, cred.user.sendgrid.pass)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body[0].active.should.equal('true')
            done()
          })
      })
    })
  })

  describe('slack', function () {
    describe('request', function () {
      it('get', function (done) {
        p.slack.get('users.list', {
          qs:{token:cred.user.slack.token}
        }, function (err, res, body) {
          if (err) return error(err, done)
          body.ok.should.equal(true)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.slack.query()
          .select('users.list')
          .auth(cred.user.slack.token)
          .request(function (err, res, body) {
            if (err) return error(err, done)
            body.ok.should.equal(true)
            done()
          })
      })
    })
  })

  describe('soundcloud', function () {
    describe('request', function () {
      it('get', function (done) {
        p.soundcloud.get('users', {
          qs:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body[0].username.should.equal('Thriftworks')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.soundcloud.query()
          .select('users')
          .where({q:'thriftworks'})
          .auth(cred.user.soundcloud.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body[0].username.should.equal('Thriftworks')
            done()
          })
      })
    })
  })

  describe('spotify', function () {
    describe('request', function () {
      it('get', function (done) {
        p.spotify.get('me', {
          auth:{bearer:cred.user.spotify.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.id.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.spotify.query()
          .get('me')
          .auth(cred.user.spotify.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('stackexchange', function () {
    describe('request', function () {
      it('get', function (done) {
        p.stackexchange.get('users', {
          qs:{
            key:cred.user.stackexchange.apikey,
            access_token:cred.user.stackexchange.token,
            site:'stackoverflow',
            sort:'reputation',
            order:'desc'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.items.length.should.equal(30)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.stackexchange.query()
          .select('users')
          .where({
            site:'stackoverflow',
            sort:'reputation',
            order:'desc'
          })
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.items.length.should.equal(30)
            done()
          })
      })
    })
  })

  describe('stocktwits', function () {
    describe('request', function () {
      it('get', function (done) {
        p.stocktwits.get('streams/home', {
          qs:{access_token:cred.user.stocktwits.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.response.status.should.equal(200)
          body.messages.length.should.equal(30)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.stocktwits.query()
          .select('streams/home')
          .auth(cred.user.stocktwits.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.response.status.should.equal(200)
            body.messages.length.should.equal(30)
            done()
          })
      })
    })
  })

  describe('stripe', function () {
    describe('request', function () {
      it('get', function (done) {
        p.stripe.get('account', {
          auth:{user:cred.user.stripe.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.id.should.be.type('string')
          body.email.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.stripe.query()
          .get('account')
          .auth(cred.user.stripe.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.be.type('string')
            body.email.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('trello', function () {
    describe('request', function () {
      it('public', function (done) {
        p.trello.get('boards/4d5ea62fd76aa1136000000c', {
          qs:{key:cred.app.trello.key}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.name.should.equal('Trello Development')
          done()
        })
      })
      it('private', function (done) {
        p.trello.get('members/me/boards', {
          qs:{key:cred.app.trello.key, token:cred.user.trello.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.should.be.an.instanceOf(Array)
          done()
        })
      })
    })
    describe('query', function () {
      it('public', function (done) {
        p.trello.query()
          .get('boards/4d5ea62fd76aa1136000000c')
          .auth(cred.app.trello.key)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.name.should.equal('Trello Development')
            done()
          })
      })
      it('private', function (done) {
        p.trello.query()
          .get('members/me/boards')
          .auth(cred.app.trello.key, cred.user.trello.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.should.be.an.instanceOf(Array)
            done()
          })
      })
    })
  })

  describe('tumblr', function () {
    describe('request', function () {
      it('apikey', function (done) {
        p.tumblr.get('blog/simovblog.tumblr.com/info', {
          qs:{api_key:cred.app.tumblr.key}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.response.blog.name.should.equal('simovblog')
          done()
        })
      })
      it('token', function (done) {
        p.tumblr.get('blog/simovblog.tumblr.com/followers', {
          oauth:{token:cred.user.tumblr.token, secret:cred.user.tumblr.secret}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          should.deepEqual(body.meta, {status:200, msg:'OK'})
          done()
        })
      })
    })
    describe('query', function () {
      it('apikey', function (done) {
        p.tumblr.query()
          .get('blog/simovblog.tumblr.com/info')
          .auth(cred.app.tumblr.key)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.response.blog.name.should.equal('simovblog')
            done()
          })
      })
      it('token', function (done) {
        p.tumblr.query()
          .get('blog/simovblog.tumblr.com/followers')
          .auth(cred.user.tumblr.token, cred.user.tumblr.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            should.deepEqual(body.meta, {status:200, msg:'OK'})
            done()
          })
      })
    })
  })

  describe('twitch', function () {
    describe('request', function () {
      it('get', function (done) {
        p.twitch.get('user', {
          headers:{Authorization:'OAuth '+cred.user.twitch.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body._id.should.be.type('number')
          body.name.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.twitch.query()
          .get('user')
          .auth(cred.user.twitch.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body._id.should.be.type('number')
            body.name.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('twitter', function () {
    describe('request', function () {
      it('get', function (done) {
        p.twitter.get('users/show', {
          oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
          qs:{screen_name:'mightymob'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.id.should.equal(1504092505)
          body.screen_name.should.equal('mightymob')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.twitter.query()
          .select('users/show')
          .where({screen_name:'mightymob'})
          .auth(cred.user.twitter.token, cred.user.twitter.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.id.should.equal(1504092505)
            body.screen_name.should.equal('mightymob')
            done()
          })
      })
    })
  })

  describe('vimeo', function () {
    describe('request', function () {
      it('get', function (done) {
        p.vimeo.get('me', {
          auth:{bearer:cred.user.vimeo.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.name.should.be.type('string')
          body.uri.should.be.type('string')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.vimeo.query()
          .get('me')
          .auth(cred.user.vimeo.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.name.should.be.type('string')
            body.uri.should.be.type('string')
            done()
          })
      })
    })
  })

  describe('wikimapia', function () {
    describe('request', function () {
      it('get', function (done) {
        p.wikimapia.get('', {
          qs: {
            key:cred.user.wikimapia.apikey,
            function:'place.search',
            q:'Central Park, New York, NY',
            lat:'40.7629025',
            lon:'-73.9826439',
            format:'json'
          }
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.count.should.equal(5)
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.wikimapia.query()
          .select('')
          .where({
            function:'place.search',
            q:'Central Park, New York, NY',
            lat:'40.7629025',
            lon:'-73.9826439'
          })
          .auth(cred.user.wikimapia.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.count.should.equal(5)
            done()
          })
      })
    })
  })

  describe('yahoo', function () {
    describe('request', function () {
      it('social', function (done) {
        p.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
          oauth:{
            token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
          },
          api:'social'
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.profile.nickname.should.equal('Simeon')
          done()
        })
      })
      it('yql', function (done) {
        p.yahoo.get('yql', {
          oauth:{
            token:cred.user.yahoo.token, secret:cred.user.yahoo.secret
          },
          api:'yql',
          qs:{q:'SELECT * FROM social.profile WHERE guid=me'}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.query.results.profile.nickname.should.equal('Simeon')
          done()
        })
      })
      it('geo', function (done) {
        p.yahoo.get("places.q('Central Park, New York')", {
          api:'geo',
          qs:{appid:cred.user.yahoo.apikey}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.places.place[0].admin1.should.equal('New York')
          done()
        })
      })
    })
    describe('query', function () {
      it('social', function (done) {
        p.yahoo.query('social')
          .select('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile')
          .auth(cred.user.yahoo.token, cred.user.yahoo.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.profile.nickname.should.equal('Simeon')
            done()
          })
      })
      it('yql', function (done) {
        p.yahoo.config('yql')
          .get('yql')
          .where({q:'SELECT * FROM social.profile WHERE guid=me'})
          .auth(cred.user.yahoo.token, cred.user.yahoo.secret)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.query.results.profile.nickname.should.equal('Simeon')
            done()
          })
      })
      it('geo', function (done) {
        p.yahoo.query('geo')
          .select("places.q('Central Park, New York')")
          .auth(cred.user.yahoo.apikey)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.places.place[0].admin1.should.equal('New York')
            done()
          })
      })
    })
  })

  describe('yammer', function () {
    describe('request', function () {
      it('get', function (done) {
        p.yammer.get('users/current', {
          auth:{bearer:cred.user.yammer.token}
        }, function (err, res, body) {
          debugger
          if (err) return error(err, done)
          body.type.should.equal('user')
          done()
        })
      })
    })
    describe('query', function () {
      it('get', function (done) {
        p.yammer.query()
          .get('users/current')
          .auth(cred.user.yammer.token)
          .request(function (err, res, body) {
            debugger
            if (err) return error(err, done)
            body.type.should.equal('user')
            done()
          })
      })
    })
  })
})
