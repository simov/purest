
var should = require('should')
var Purest = require('../../')
  , providers = require('../../config/providers')


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
  if (providers[name].__provider && providers[name].__provider.oauth) {
    options.key = app[name].key
    options.secret = app[name].secret
  }
  p[name] = new Purest(options)
}


describe('500px', function () {
  it('options', function (done) {
    p['500px'].get('users', {
      oauth:{token:user['500px'].token, secret:user['500px'].secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.should.be.type('object')
      done()
    })
  })
  it('query', function (done) {
    p['500px'].query()
      .get('users')
      .auth(user['500px'].token, user['500px'].secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.should.be.type('object')
        done()
      })
  })
})

describe('aboutme', function () {
  it('options apikey', function (done) {
    p.aboutme.get('user/view/simeonv', {
      headers:{Authorization:'Basic '+user.aboutme.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_name.should.equal('simeonv')
      done()
    })
  })
  it('options token', function (done) {
    p.aboutme.get('user/directory/simeonv', {
      qs: {
        client_id:user.aboutme.apikey,
        token:user.aboutme.token
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.status.should.equal(200)
      done()
    })
  })
  it('query apikey', function (done) {
    p.aboutme.query('user')
      .select('view/simeonv')
      .auth(user.aboutme.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_name.should.equal('simeonv')
        done()
      })
  })
  it('query token', function (done) {
    p.aboutme.query('user')
      .get('directory/simeonv')
      .auth(user.aboutme.apikey, user.aboutme.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.status.should.equal(200)
        done()
      })
  })
})

describe('angellist', function () {
  it('options', function (done) {
    p.angellist.get('me', {
      auth:{bearer:user.angellist.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.angellist.query()
      .select('me')
      .auth(user.angellist.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('asana', function () {
  it('options basic', function (done) {
    p.asana.get('users/me', {
      auth:{user:user.asana.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      should.deepEqual(Object.keys(body.data),
        ['id','name','email','photo','workspaces'])
      done()
    })
  })
  it('options oauth', function (done) {
    p.asana.get('users/me', {
      auth: {bearer:user.asana.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      should.deepEqual(Object.keys(body.data),
        ['id','name','email','photo','workspaces'])
      done()
    })
  })
  it('query basic', function (done) {
    p.asana.config()
      .get('users/me')
      .auth(user.asana.apikey,'')
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body.data),
          ['id','name','email','photo','workspaces'])
        done()
      })
  })
  it('query oauth', function (done) {
    p.asana.config()
      .get('users/me')
      .auth(user.asana.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body.data),
          ['id','name','email','photo','workspaces'])
        done()
      })
  })
})

describe('assembla', function () {
  it('options', function (done) {
    p.assembla.get('user', {
      auth:{bearer:user.assembla.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.assembla.query()
      .select('user')
      .auth(user.assembla.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('basecamp', function () {
  it('auth', function (done) {
    p.basecamp.get('authorization', {
      api:'id',
      auth:{bearer:user.basecamp.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.accounts.should.be.instanceOf(Array)
      done()
    })
  })
  it.skip('options', function (done) {
    p.basecamp.get('people/me', {
      path:user.basecamp.id,
      auth:{bearer:user.basecamp.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it.skip('query', function (done) {
    p.basecamp.query()
      .select('people/me')
      .options({path:user.basecamp.id})
      .auth(user.basecamp.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('bitly', function () {
  it('options', function (done) {
    p.bitly.get('user/info', {
      qs:{access_token:user.bitly.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.apiKey.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.bitly.query()
      .select('user/info')
      .auth(user.bitly.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.apiKey.should.be.type('string')
        done()
      })
  })
})

describe('bitbucket', function () {
  it('options', function (done) {
    p.bitbucket.get('users/simovelichkov', {

    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.username.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.bitbucket.query()
      .select('users/simovelichkov')
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.username.should.be.type('string')
        done()
      })
  })
})

describe('box', function () {
  it('options', function (done) {
    p.box.get('users/me', {
      auth:{bearer:user.box.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.box.config()
      .get('users/me')
      .auth(user.box.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('buffer', function () {
  it('options', function (done) {
    p.buffer.get('user', {
      qs:{access_token:user.buffer.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.buffer.query()
      .get('user')
      .auth(user.buffer.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('cheddar', function () {
  it('options', function (done) {
    p.cheddar.get('me', {
      auth:{bearer:user.cheddar.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.cheddar.query()
      .get('me')
      .auth(user.cheddar.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('coderbits', function () {
  it('options', function (done) {
    p.coderbits.get('simov', function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.username.should.equal('simov')
      done()
    })
  })
  it('query', function (done) {
    p.coderbits.query()
      .select('simov')
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.username.should.equal('simov')
        done()
      })
  })
})

describe('coinbase', function () {
  it('options', function (done) {
    p.coinbase.get('users/self', {
      auth:{bearer:user.coinbase.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.coinbase.query()
      .select('users/self')
      .auth(user.coinbase.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.id.should.be.type('string')
        done()
      })
  })
})

describe('dailymile', function () {
  it('options', function (done) {
    p.dailymile.get('people/me', {
      qs:{oauth_token:user.dailymile.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.username.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.dailymile.query()
      .select('people/me')
      .auth(user.dailymile.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.username.should.be.type('string')
        done()
      })
  })
})

describe('dailymotion', function () {
  it('options', function (done) {
    p.dailymotion.get('user/me', {
      auth:{bearer:user.dailymotion.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.dailymotion.query()
      .select('user/me')
      .auth(user.dailymotion.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('deezer', function () {
  it('options', function (done) {
    p.deezer.get('user/me', {
      qs:{access_token:user.deezer.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.deezer.query()
      .select('user/me')
      .auth(user.deezer.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('deviantart', function () {
  it('options', function (done) {
    p.deviantart.get('user/whoami', {
      auth:{bearer:user.deviantart.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.userid.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.deviantart.query()
      .select('user/whoami')
      .auth(user.deviantart.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.userid.should.be.type('string')
        done()
      })
  })
})

describe('digitalocean', function () {
  it('options bearer', function (done) {
    p.digitalocean.get('account', {
      auth:{bearer:user.digitalocean.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.account.uuid.should.be.type('string')
      done()
    })
  })
  it('options basic', function (done) {
    p.digitalocean.get('account', {
      auth:{user:user.digitalocean.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.account.uuid.should.be.type('string')
      done()
    })
  })
  it('query bearer', function (done) {
    p.digitalocean.query()
      .get('account')
      .auth(user.digitalocean.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.account.uuid.should.be.type('string')
        done()
      })
  })
  it('query basic', function (done) {
    p.digitalocean.query()
      .get('account')
      .auth(user.digitalocean.apikey, '')
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.account.uuid.should.be.type('string')
        done()
      })
  })
})

describe('disqus', function () {
  it('options', function (done) {
    p.disqus.get('users/details', {
      qs:{api_key:app.disqus.key, access_token:user.disqus.token},
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.disqus.query()
      .get('users/details')
      .auth(app.disqus.key, user.disqus.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.response.id.should.be.type('string')
        done()
      })
  })
})

describe('dropbox', function () {
  it('options', function (done) {
    p.dropbox.get('account/info', {
      auth: {bearer:user.dropbox.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.email.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.dropbox.query()
      .get('account/info')
      .auth(user.dropbox.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.email.should.be.type('string')
        done()
      })
  })
})

describe('edmodo', function () {
  it('options', function (done) {
    p.edmodo.get('users/me', {
      auth:{bearer:user.edmodo.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.edmodo.query()
      .get('users/me')
      .auth(user.edmodo.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('eventbrite', function () {
  it('options', function (done) {
    p.eventbrite.get('users/me', {
      auth:{bearer:user.eventbrite.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.eventbrite.query()
      .get('users/me')
      .auth(user.eventbrite.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('facebook', function () {
  it('options', function (done) {
    p.facebook.get('me', {
      auth:{bearer:user.facebook.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.facebook.query()
      .get('me')
      .auth(user.facebook.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('fitbit', function () {
  it('options', function (done) {
    p.fitbit.get('user/-/profile', {
      oauth:{token:user.fitbit.token, secret:user.fitbit.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.encodedId.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.fitbit.query()
      .select('user/-/profile')
      .auth(user.fitbit.token, user.fitbit.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.encodedId.should.be.type('string')
        done()
      })
  })
})

describe('flattr', function () {
  it('options', function (done) {
    p.flattr.get('users/me', {
      auth:{bearer:user.flattr.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.flattr.query()
      .select('users/me')
      .auth(user.flattr.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('flickr', function () {
  it('options', function (done) {
    p.flickr.get('', {
      oauth:{token:user.flickr.token, secret:user.flickr.secret},
      qs:{
        method: 'flickr.urls.getUserProfile',
        api_key:app.flickr.key
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.nsid.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.flickr.query()
      .select('')
      .where({
        method: 'flickr.urls.getUserProfile',
        api_key:app.flickr.key
      })
      .auth(user.flickr.token, user.flickr.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.nsid.should.be.type('string')
        done()
      })
  })
})

describe('flowdock', function () {
  it('options get', function (done) {
    p.flowdock.get('users', {
      auth:{bearer:user.flowdock.token},
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.should.be.instanceOf(Array)
      done()
    })
  })
  it('query oauth2', function (done) {
    p.flowdock.query()
      .get('users')
      .auth(user.flowdock.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.should.be.instanceOf(Array)
        done()
      })
  })
  it('query basic', function (done) {
    p.flowdock.query()
      .get('users')
      .auth(user.flowdock.user, user.flowdock.pass)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.should.be.instanceOf(Array)
        done()
      })
  })
  it('query api token', function (done) {
    p.flowdock.query()
      .get('users')
      .auth(user.flowdock.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.should.be.instanceOf(Array)
        done()
      })
  })
})

describe('foursquare', function () {
  it('options', function (done) {
    p.foursquare.get('users/81257627', {
      qs:{oauth_token:user.foursquare.token, v:'20140503'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response.user.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.foursquare.query()
      .get('users/81257627')
      .where({v:'20140503'})
      .auth(user.foursquare.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.response.user.id.should.be.type('string')
        done()
      })
  })
})

describe('getpocket', function () {
  it('options', function (done) {
    p.getpocket.post('get', {
      body: {
        consumer_key:app.getpocket.key,
        access_token:user.getpocket.token
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.list.should.be.instanceOf(Array)
      done()
    })
  })
  it('query', function (done) {
    p.getpocket.query()
      .get('get')
      .auth(app.getpocket.key, user.getpocket.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.list.should.be.instanceOf(Array)
        done()
      })
  })
})

describe('github', function () {
  it('options', function (done) {
    p.github.get('users/simov', {
      qs:{access_token:user.github.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.github.query()
      .get('users/simov')
      .auth(user.github.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('gitter', function () {
  it('options', function (done) {
    p.gitter.get('user', {
      auth:{bearer:user.gitter.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body[0].id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.gitter.query()
      .get('user')
      .auth(user.gitter.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].id.should.be.type('string')
        done()
      })
  })
})

describe('google', function () {
  it('options plus', function (done) {
    p.google.get('people/me', {
      api:'plus',
      qs:{access_token:user.google.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('options gmail', function (done) {
    p.google.get('users/me/profile', {
      api:'gmail',
      auth:{bearer:user.google.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.emailAddress.should.be.type('string')
      done()
    })
  })
  it('options youtube', function (done) {
    p.google.get('channels', {
      api:'youtube',
      qs:{
        access_token:user.google.token,
        part:'id, snippet, contentDetails, statistics, status, topicDetails',
        forUsername:'RayWilliamJohnson'
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.items[0].id.should.be.type('string')
      done()
    })
  })
  it('options drive', function (done) {
    p.google.get('about', {
      api:'drive',
      qs:{
        access_token:user.google.token
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.displayName.should.be.type('string')
      done()
    })
  })

  it('query plus', function (done) {
    p.google.query('plus')
      .select('people/me')
      .auth(user.google.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
  it('query gmail', function (done) {
    p.google.query('gmail')
      .select('users/me/profile')
      .auth(user.google.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.emailAddress.should.be.type('string')
        done()
      })
  })
  it('query youtube', function (done) {
    p.google.query('youtube')
      .select('channels')
      .where({
        forUsername:'RayWilliamJohnson',
        part:'id, snippet, contentDetails, statistics, status, topicDetails'
      })
      .auth(user.google.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.items[0].id.should.be.type('string')
        done()
      })
  })
  it('query drive', function (done) {
    p.google.query('drive')
      .get('about')
      .auth(user.google.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.displayName.should.be.type('string')
        done()
      })
  })
})

describe('hackpad', function () {
  it('options', function (done) {
    p.hackpad.get('search', {
      oauth:{},
      qs:{q:'hackpad'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body[0].id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.hackpad.query()
      .select('search')
      .where({q:'hackpad'})
      .oauth({})
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].id.should.be.type('string')
        done()
      })
  })
})

describe('harvest', function () {
  it('options', function (done) {
    p.harvest.get('account/who_am_i', {
      domain:user.harvest.domain,
      auth:{bearer:user.harvest.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.id.should.be.type('number')
      done()
    })
  })
  it('query bearer', function (done) {
    p.harvest.query()
      .get('account/who_am_i')
      .options({domain:user.harvest.domain})
      .auth(user.harvest.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.id.should.be.type('number')
        done()
      })
  })
  it('query basic', function (done) {
    p.harvest.query()
      .get('account/who_am_i')
      .options({domain:user.harvest.domain})
      .auth(user.harvest.user, user.harvest.pass)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.id.should.be.type('number')
        done()
      })
  })
})

describe('heroku', function () {
  it('options', function (done) {
    p.heroku.get('account', {
      auth: {bearer:user.heroku.token}
      // or
      // auth: {user:'email', pass:'password'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.heroku.query()
      .get('account')
      .auth(user.heroku.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('imgur', function () {
  it('options apikey', function (done) {
    p.imgur.get('account/simov', {
      headers: {Authorization: 'Client-ID '+app.imgur.key}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.url.should.equal('simov')
      done()
    })
  })
  it('options token', function (done) {
    p.imgur.get('account/simov', {
      auth:{bearer:user.imgur.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.url.should.equal('simov')
      done()
    })
  })
  it('query apikey', function (done) {
    p.imgur.query()
      .get('account/simov')
      .auth(app.imgur.key)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.url.should.equal('simov')
        done()
      })
  })
  it('query token', function (done) {
    p.imgur.query()
      .get('account/simov')
      .auth(user.imgur.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.url.should.equal('simov')
        done()
      })
  })
})

describe('instagram', function () {
  it('options', function (done) {
    p.instagram.get('users/self', {
      qs:{access_token:user.instagram.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.instagram.query()
      .select('users/self')
      .auth(user.instagram.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.id.should.be.type('string')
        done()
      })
  })
})

describe('jawbone', function () {
  it('options', function (done) {
    p.jawbone.get('users/@me', {
      auth:{bearer:user.jawbone.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.meta.user_xid.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.jawbone.query()
      .select('users/@me')
      .auth(user.jawbone.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.meta.user_xid.should.be.type('string')
        done()
      })
  })
})

describe('linkedin', function () {
  it('options oauth1', function (done) {
    p.linkedin.get('people/~', {
      oauth:{token:user.linkedin.token, secret:user.linkedin.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('options oauth2', function (done) {
    p.linkedin.get('people/~', {
      qs:{oauth2_access_token:user.linkedin.oauth2}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query oauth1', function (done) {
    p.linkedin.query()
      .select('people/~')
      .auth(user.linkedin.token, user.linkedin.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
  it('query oauth2', function (done) {
    p.linkedin.query()
      .select('people/~')
      .auth(user.linkedin.oauth2)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('live', function () {
  it('options', function (done) {
    p.live.get('me', {
      qs:{access_token:user.live.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.live.query()
      .select('me')
      .auth(user.live.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('mailchimp', function () {
  it('options apikey', function (done) {
    p.mailchimp.get('campaigns/list', {
      qs:{apikey:user.mailchimp.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.should.be.instanceOf(Array)
      done()
    })
  })
  it('options oauth', function (done) {
    p.mailchimp.get('campaigns/list', {
      domain:user.mailchimp.domain,
      qs:{apikey:user.mailchimp.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.should.be.instanceOf(Array)
      done()
    })
  })
  it('query apikey', function (done) {
    p.mailchimp.query()
      .select('campaigns/list')
      .auth(user.mailchimp.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.should.be.instanceOf(Array)
        done()
      })
  })
  it('query oauth', function (done) {
    p.mailchimp.query()
      .select('campaigns/list')
      .auth(user.mailchimp.token)
      .options({domain:user.mailchimp.domain})
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.should.be.instanceOf(Array)
        done()
      })
  })
})

describe('mailgun', function () {
  it('options', function (done) {
    p.mailgun.get(user.mailgun.domain+'/stats', {
      auth:{user:'api',pass:user.mailgun.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.total_count.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.mailgun.query()
      .select(user.mailgun.domain+'/stats')
      .auth('api', user.mailgun.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.total_count.should.be.type('number')
        done()
      })
  })
})

describe('mandrill', function () {
  it('options', function (done) {
    p.mandrill.post('users/info', {
      form:{key:user.mandrill.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.public_id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.mandrill.query()
      .post('users/info')
      .auth(user.mandrill.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.public_id.should.be.type('string')
        done()
      })
  })
})

describe('mixcloud', function () {
  it('options', function (done) {
    p.mixcloud.get('me', {
      qs:{access_token:user.mixcloud.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.username.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.mixcloud.query()
      .get('me')
      .auth(user.mixcloud.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.username.should.be.type('string')
        done()
      })
  })
})

describe('odesk', function () {
  it('options', function (done) {
    p.odesk.get('info', {
      api:'auth',
      oauth:{
        token:user.odesk.token,
        secret:user.odesk.secret
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.info.ref.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.odesk.query('auth')
      .select('info')
      .auth(user.odesk.token, user.odesk.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.info.ref.should.be.type('string')
        done()
      })
  })
})

describe('openstreetmap', function () {
  it('options oauth', function (done) {
    p.openstreetmap.get('user/details', {
      // oauth for writing to the database
      oauth:{
        token:user.openstreetmap.token,
        secret:user.openstreetmap.secret
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
  it('query oauth', function (done) {
    p.openstreetmap.query()
      .select('user/details')
      .auth(user.openstreetmap.token, user.openstreetmap.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/)
        done()
      })
  })
  it('query basic', function (done) {
    p.openstreetmap.query()
      .select('user/details')
      .auth(user.openstreetmap.user, user.openstreetmap.pass)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/)
        done()
      })
  })
})

describe('paypal', function () {
  it('options', function (done) {
    p.paypal.get('userinfo', {
      api:'identity',
      auth:{bearer:user.paypal.token},
      qs: {schema:'openid'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.paypal.query('identity')
      .get('userinfo')
      .where({schema:'openid'})
      .auth(user.paypal.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_id.should.be.type('string')
        done()
      })
  })
})

describe('podio', function () {
  it('options', function (done) {
    p.podio.get('user', {
      headers:{Authorization:'OAuth2 '+user.podio.token},
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.podio.query()
      .select('user')
      .auth(user.podio.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_id.should.be.type('number')
        done()
      })
  })
})

describe('rdio', function () {
  it('options', function (done) {
    p.rdio.post('', {
      oauth:{token:user.rdio.token, secret:user.rdio.secret},
      form:{method:'currentUser'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.result.key.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.rdio.query()
      .post('')
      .form({method:'currentUser'})
      .auth(user.rdio.token, user.rdio.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.result.key.should.be.type('string')
        done()
      })
  })
})

describe('redbooth', function () {
  it('options', function (done) {
    p.redbooth.get('me', {
      auth:{bearer:user.redbooth.token},
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.redbooth.query()
      .get('me')
      .auth(user.redbooth.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('reddit', function () {
  it('options', function (done) {
    p.reddit.get('user/simov/about.json', {

    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.reddit.query()
      .get('user/simov/about.json')
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.id.should.be.type('string')
        done()
      })
  })
})

describe('rubygems', function () {
  it('options get', function (done) {
    p.rubygems.get('gems/rails', function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.name.should.equal('rails')
      body.platform.should.equal('ruby')
      done()
    })
  })
  it('query headers auth', function (done) {
    p.rubygems.query()
      .get('gems')
      .auth(user.rubygems.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(body, [])
        done()
      })
  })
  it('query basic auth', function (done) {
    p.rubygems.query()
      .get('api_key')
      .auth(user.rubygems.user, user.rubygems.pass)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.rubygems_api_key.should.be.type('string')
        done()
      })
  })
})

describe('runkeeper', function () {
  it('options', function (done) {
    p.runkeeper.get('user', {
      headers:{'accept':'application/vnd.com.runkeeper.User+json'},
      auth:{bearer:user.runkeeper.token},
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.userID.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.runkeeper.query()
      .select('user')
      .auth(user.runkeeper.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.userID.should.be.type('number')
        done()
      })
  })
})

describe('salesforce', function () {
  it('options', function (done) {
    p.salesforce.get('sobjects/Account', {
      domain:user.salesforce.domain,
      auth:{bearer:user.salesforce.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      should.deepEqual(Object.keys(body), ['objectDescribe', 'recentItems'])
      done()
    })
  })
  it('query', function (done) {
    p.salesforce.query('sobjects')
      .get('Account')
      .options({domain:user.salesforce.domain})
      .auth(user.salesforce.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        should.deepEqual(Object.keys(body), ['objectDescribe', 'recentItems'])
        done()
      })
  })
})

describe('sendgrid', function () {
  it('options', function (done) {
    p.sendgrid.get('profile.get', {
      qs:{api_user:user.sendgrid.user, api_key:user.sendgrid.pass}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body[0].username.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.sendgrid.query()
      .select('profile.get')
      .auth(user.sendgrid.user, user.sendgrid.pass)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].username.should.be.type('string')
        done()
      })
  })
})

describe('shopify', function () {
  it('options', function (done) {
    p.shopify.get('admin/shop', {
      domain:user.shopify.domain,
      headers:{'X-Shopify-Access-Token':user.shopify.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.shop.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.shopify.query()
      .get('admin/shop')
      .options({domain:user.shopify.domain})
      .auth(user.shopify.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.shop.id.should.be.type('number')
        done()
      })
  })
})

describe('skyrock', function () {
  it('options', function (done) {
    p.skyrock.get('user/get', {
      oauth:{token:user.skyrock.token, secret:user.skyrock.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id_user.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.skyrock.query()
      .select('user/get')
      .auth(user.skyrock.token, user.skyrock.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id_user.should.be.type('number')
        done()
      })
  })
})

describe('slack', function () {
  it('options', function (done) {
    p.slack.get('users.list', {
      qs:{token:user.slack.token}
    }, function (err, res, body) {
      if (err) return error(err, done)
      body.members[0].id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.slack.query()
      .select('users.list')
      .auth(user.slack.token)
      .request(function (err, res, body) {
        if (err) return error(err, done)
        body.members[0].id.should.be.type('string')
        done()
      })
  })
})

describe('soundcloud', function () {
  it('options', function (done) {
    p.soundcloud.get('users', {
      qs:{oauth_token:user.soundcloud.token, q:'thriftworks'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body[0].username.should.equal('Thriftworks')
      done()
    })
  })
  it('query', function (done) {
    p.soundcloud.query()
      .select('users')
      .where({q:'thriftworks'})
      .auth(user.soundcloud.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].username.should.equal('Thriftworks')
        done()
      })
  })
})

describe('spotify', function () {
  it('options', function (done) {
    p.spotify.get('me', {
      auth:{bearer:user.spotify.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.spotify.query()
      .get('me')
      .auth(user.spotify.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('stackexchange', function () {
  it('options', function (done) {
    p.stackexchange.get('users', {
      qs:{
        key:user.stackexchange.apikey,
        access_token:user.stackexchange.token,
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
  it('query', function (done) {
    p.stackexchange.query()
      .select('users')
      .where({
        site:'stackoverflow',
        sort:'reputation',
        order:'desc'
      })
      .auth(user.stackexchange.apikey, user.stackexchange.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.items.length.should.equal(30)
        done()
      })
  })
})

describe('stocktwits', function () {
  it('options', function (done) {
    p.stocktwits.get('account/verify', {
      qs:{access_token:user.stocktwits.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.stocktwits.query()
      .select('account/verify')
      .auth(user.stocktwits.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.id.should.be.type('number')
        done()
      })
  })
})

describe('strava', function () {
  it('options', function (done) {
    p.strava.get('athlete', {
      auth:{bearer:user.strava.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.strava.query()
      .get('athlete')
      .auth(user.strava.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('stripe', function () {
  it('options', function (done) {
    p.stripe.get('account', {
      auth:{user:user.stripe.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.stripe.query()
      .get('account')
      .auth(user.stripe.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('traxo', function () {
  it('options', function (done) {
    p.traxo.get('me', {
      auth:{bearer:user.traxo.token}
    }, function (err, res, body) {
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.traxo.query()
      .select('me')
      .auth(user.traxo.token)
      .request(function (err, res, body) {
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('trello', function () {
  it('options apikey', function (done) {
    p.trello.get('boards/4d5ea62fd76aa1136000000c', {
      qs:{key:app.trello.key}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.name.should.equal('Trello Development')
      done()
    })
  })
  it('options oauth', function (done) {
    p.trello.get('members/me', {
      qs:{key:app.trello.key, token:user.trello.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query apikey', function (done) {
    p.trello.query()
      .get('boards/4d5ea62fd76aa1136000000c')
      .auth(app.trello.key)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.name.should.equal('Trello Development')
        done()
      })
  })
  it('query oauth', function (done) {
    p.trello.query()
      .get('members/me')
      .auth(app.trello.key, user.trello.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('tripit', function () {
  it('options', function (done) {
    p.tripit.get('get/profile/id/simovelichkov/format/json', {
      oauth:{token:user.tripit.token, secret:user.tripit.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.Profile.profile_url.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.tripit.query()
      .get('get/profile/id/simovelichkov/format/json')
      .auth(user.tripit.token, user.tripit.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.Profile.profile_url.should.be.type('string')
        done()
      })
  })
})

describe('tumblr', function () {
  it('options apikey', function (done) {
    p.tumblr.get('blog/nodejsreactions.tumblr.com/info', {
      qs:{api_key:app.tumblr.key}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response.blog.name.should.be.type('string')
      done()
    })
  })
  it('options oauth', function (done) {
    p.tumblr.get('user/info', {
      oauth:{token:user.tumblr.token, secret:user.tumblr.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response.user.name.should.be.type('string')
      done()
    })
  })
  it('query apikey', function (done) {
    p.tumblr.query()
      .get('blog/nodejsreactions.tumblr.com/info')
      .auth(app.tumblr.key)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.response.blog.name.should.be.type('string')
        done()
      })
  })
  it('query oauth', function (done) {
    p.tumblr.query()
      .get('user/info')
      .auth(user.tumblr.token, user.tumblr.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.response.user.name.should.be.type('string')
        done()
      })
  })
})

describe('twitch', function () {
  it('options', function (done) {
    p.twitch.get('user', {
      headers:{Authorization:'OAuth '+user.twitch.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body._id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.twitch.query()
      .get('user')
      .auth(user.twitch.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body._id.should.be.type('number')
        done()
      })
  })
})

describe('twitter', function () {
  it('options', function (done) {
    p.twitter.get('users/show', {
      oauth:{token:user.twitter.token, secret:user.twitter.secret},
      qs:{screen_name:'nodejs'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.twitter.query()
      .select('users/show')
      .where({screen_name:'nodejs'})
      .auth(user.twitter.token, user.twitter.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('vimeo', function () {
  it('options', function (done) {
    p.vimeo.get('me', {
      auth:{bearer:user.vimeo.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.name.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.vimeo.query()
      .get('me')
      .auth(user.vimeo.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.name.should.be.type('string')
        done()
      })
  })
})

describe('vk', function () {
  it('options', function (done) {
    p.vk.get('users.get', {
      qs:{access_token:user.vk.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.response[0].uid.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.vk.query()
      .get('users.get')
      .auth(user.vk.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.response[0].uid.should.be.type('number')
        done()
      })
  })
})

describe('wikimapia', function () {
  it('options', function (done) {
    p.wikimapia.get('', {
      qs: {
        key:user.wikimapia.apikey,
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
  it('query', function (done) {
    p.wikimapia.query()
      .select('')
      .where({
        function:'place.search',
        q:'Central Park, New York, NY',
        lat:'40.7629025',
        lon:'-73.9826439'
      })
      .auth(user.wikimapia.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.count.should.equal(5)
        done()
      })
  })
})

describe('withings', function () {
  it('options', function (done) {
    p.withings.get('measure', {
      oauth:{token:user.withings.token, secret:user.withings.secret},
      qs:{userid:user.withings.userid, action:'getactivity'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.body.activities.should.be.instanceOf(Array)
      done()
    })
  })
  it('query', function (done) {
    p.withings.query()
      .get('measure')
      .where({userid:user.withings.userid, action:'getactivity'})
      .auth(user.withings.token, user.withings.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.body.activities.should.be.instanceOf(Array)
        done()
      })
  })
})

describe('yahoo', function () {
  it('options', function (done) {
    p.yahoo.get('user/me/profile', {
      api:'social',
      oauth:{token:user.yahoo.token, secret:user.yahoo.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.profile.guid.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.yahoo.query('social')
      .select('user/me/profile')
      .auth(user.yahoo.token, user.yahoo.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.profile.guid.should.be.type('string')
        done()
      })
  })
})

describe('yammer', function () {
  it('options', function (done) {
    p.yammer.get('users/current', {
      auth:{bearer:user.yammer.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.yammer.query()
      .get('users/current')
      .auth(user.yammer.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('zendesk', function () {
  it('options', function (done) {
    p.zendesk.get('users/me', {
      domain:user.zendesk.domain,
      auth:{bearer:user.zendesk.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.zendesk.query()
      .get('users/me')
      .options({domain:user.zendesk.domain})
      .auth(user.zendesk.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.id.should.be.type('number')
        done()
      })
  })
})
