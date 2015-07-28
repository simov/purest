
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
  if (app[name]) {
    options.key = app[name].key
    options.secret = app[name].secret
  }
  p[name] = new Purest(options)
}


describe('23andme', function () {
  it('options', function (done) {
    p['23andme'].get('user', {
      auth:{bearer:user['23andme'].token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p['23andme'].query()
      .get('user')
      .auth(user['23andme'].token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('500px', function () {
  it('options', function (done) {
    p['500px'].get('users', {
      oauth:{token:user['500px'].token, secret:user['500px'].secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.id.should.be.type('number')
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
        body.user.id.should.be.type('number')
        done()
      })
  })
})

describe('aboutme', function () {
  it('options token', function (done) {
    p.aboutme.get('user/view/'+user.aboutme.user, {
      headers:{Authorization:'OAuth '+user.aboutme.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_name.should.be.type('string')
      done()
    })
  })
  it('query token', function (done) {
    p.aboutme.query()
      .get('user/view/'+user.aboutme.user)
      .auth(user.aboutme.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_name.should.be.type('string')
        done()
      })
  })
  it('options apikey', function (done) {
    p.aboutme.get('user/view/'+user.aboutme.user, {
      headers:{Authorization:'Basic '+user.aboutme.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_name.should.be.type('string')
      done()
    })
  })
  it('query apikey', function (done) {
    p.aboutme.query()
      .select('user/view/'+user.aboutme.user)
      .auth(user.aboutme.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_name.should.be.type('string')
        done()
      })
  })
})

describe('acton', function () {

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
  it('options oauth', function (done) {
    p.asana.get('users/me', {
      auth:{bearer:user.asana.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.id.should.be.type('number')
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
        body.data.id.should.be.type('number')
        done()
      })
  })
  it('options basic', function (done) {
    p.asana.get('users/me', {
      auth:{user:user.asana.apikey}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.id.should.be.type('number')
      done()
    })
  })
  it('query basic', function (done) {
    p.asana.config()
      .get('users/me')
      .auth(user.asana.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.id.should.be.type('number')
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
      body.identity.id.should.be.type('number')
      done()
    })
  })
  it('options', function (done) {
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
  it('query', function (done) {
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

describe('beatport', function () {
  it('options', function (done) {
    p.beatport.get('person', {
      api:'oauth',
      oauth:{token:user.beatport.token, secret:user.beatport.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.beatport.query('oauth')
      .get('person')
      .auth(user.beatport.token, user.beatport.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
        done()
      })
  })
})

describe('beatsmusic', function () {
  it('options', function (done) {
    p.beatsmusic.get('me', {
      auth:{bearer:user.beatsmusic.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.result.user_context.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.beatsmusic.query()
      .select('me')
      .auth(user.beatsmusic.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.result.user_context.should.be.type('string')
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
      auth:{bearer:user.buffer.token}
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
  it('options oauth', function (done) {
    p.digitalocean.get('account', {
      auth:{bearer:user.digitalocean.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.account.uuid.should.be.type('string')
      done()
    })
  })
  it('query oauth', function (done) {
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
      auth:{bearer:user.disqus.token},
      qs:{api_key:app.disqus.key},
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
      auth:{bearer:user.dropbox.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.uid.should.be.type('number')
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
        body.uid.should.be.type('number')
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
    p.flattr.get('user', {
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
      .select('user')
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
    p.flickr.get({
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
      .select()
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
  it('options oauth', function (done) {
    p.flowdock.get('users', {
      auth:{bearer:user.flowdock.token},
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body[0].id.should.be.type('number')
      done()
    })
  })
  it('query oauth', function (done) {
    p.flowdock.query()
      .get('users')
      .auth(user.flowdock.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].id.should.be.type('number')
        done()
      })
  })
  it('query apikey', function (done) {
    p.flowdock.query()
      .get('users')
      .auth(user.flowdock.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].id.should.be.type('number')
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
        body[0].id.should.be.type('number')
        done()
      })
  })
})

describe('foursquare', function () {
  it('options', function (done) {
    p.foursquare.get('users/self', {
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
      .get('users/self')
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
      auth:{bearer:user.github.token}
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
      auth:{bearer:user.google.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
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

  it('options youtube', function (done) {
    p.google.get('channels', {
      api:'youtube',
      auth:{bearer:user.google.token},
      qs:{
        part:'id, snippet, contentDetails, statistics, status, topicDetails',
        mine:true
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.items[0].id.should.be.type('string')
      done()
    })
  })
  it('query youtube', function (done) {
    p.google.query('youtube')
      .select('channels')
      .where({
        part:'id, snippet, contentDetails, statistics, status, topicDetails',
        mine:true
      })
      .auth(user.google.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.items[0].id.should.be.type('string')
        done()
      })
  })

  it('options drive', function (done) {
    p.google.get('about', {
      api:'drive',
      auth:{bearer:user.google.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.displayName.should.be.type('string')
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
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body[0].id.should.be.type('string')
        done()
      })
  })
})

describe('harvest', function () {
  it('options oauth', function (done) {
    p.harvest.get('account/who_am_i', {
      subdomain:user.harvest.subdomain,
      auth:{bearer:user.harvest.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user.id.should.be.type('number')
      done()
    })
  })
  it('query oauth', function (done) {
    p.harvest.query()
      .get('account/who_am_i')
      .options({subdomain:user.harvest.subdomain})
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
      .options({subdomain:user.harvest.subdomain})
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
  it('options oauth', function (done) {
    p.imgur.get('account/me', {
      auth:{bearer:user.imgur.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.id.should.be.type('number')
      done()
    })
  })
  it('query oauth', function (done) {
    p.imgur.query()
      .get('account/me')
      .auth(user.imgur.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.id.should.be.type('number')
        done()
      })
  })
  it('options apikey', function (done) {
    p.imgur.get('account/'+user.imgur.user, {
      headers: {Authorization: 'Client-ID '+app.imgur.key}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.data.id.should.be.type('number')
      done()
    })
  })
  it('query apikey', function (done) {
    p.imgur.query()
      .get('account/'+user.imgur.user)
      .auth(app.imgur.key)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.data.id.should.be.type('number')
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
      body.data.xid.should.be.type('string')
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
        body.data.xid.should.be.type('string')
        done()
      })
  })
})

describe('linkedin', function () {
  it('options oauth2', function (done) {
    p.linkedin.get('people/~', {
      auth:{bearer:user.linkedin.oauth2}
    }, function (err, res, body) {
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
})

describe('live', function () {
  it('options', function (done) {
    p.live.get('me', {
      auth:{bearer:user.live.token}
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
  it('options oauth', function (done) {
    p.mailchimp.get('metadata', {
      api:'oauth',
      auth:{bearer:user.mailchimp.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_id.should.be.type('number')
      done()
    })
  })
  it('query oauth', function (done) {
    p.mailchimp.query('oauth')
      .select('metadata')
      .auth(user.mailchimp.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_id.should.be.type('number')
        done()
      })
  })
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
})

describe('mailgun', function () {
  it('options', function (done) {
    p.mailgun.get(user.mailgun.subdomain+'/stats', {
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
      .select(user.mailgun.subdomain+'/stats')
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
      oauth:{token:user.odesk.token, secret:user.odesk.secret}
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
      oauth:{token:user.openstreetmap.token, secret:user.openstreetmap.secret}
      // or basic auth for reading user details
      // auth: {user:'email', pass:'password'}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.should.match(
        /<user id="\d+" display_name="\w+" account_created=".*">/)
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
        body.should.match(
          /<user id="\d+" display_name="\w+" account_created=".*">/)
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
        body.should.match(
          /<user id="\d+" display_name="\w+" account_created=".*">/)
        done()
      })
  })
})

describe('organisedminds', function () {

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

describe('pipelinedeals', function () {

})

describe('podio', function () {
  it('options', function (done) {
    p.podio.get('user', {
      auth:{bearer:user.podio.token}
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
    p.rdio.post({
      auth:{bearer:user.rdio.token},
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
      .post()
      .form({method:'currentUser'})
      .auth(user.rdio.token)
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
    p.reddit.get('me', {
      api:'auth',
      auth:{bearer:user.reddit.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.reddit.query('auth')
      .get('me')
      .auth(user.reddit.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('string')
        done()
      })
  })
})

describe('rubygems', function () {
  it('options', function (done) {
    p.rubygems.get('gems/rails', function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.name.should.be.type('string')
      done()
    })
  })
  it('query apikey', function (done) {
    p.rubygems.query()
      .get('gems')
      .auth(user.rubygems.apikey)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.should.be.instanceOf(Array)
        done()
      })
  })
  it('query basic', function (done) {
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
    p.salesforce.get(
      'id/'+user.salesforce.organisation_id+'/'+user.salesforce.user_id,
    {
      subdomain:user.salesforce.subdomain,
      auth:{bearer:user.salesforce.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.salesforce.query()
      .get('id/'+user.salesforce.organisation_id+'/'+user.salesforce.user_id)
      .options({subdomain:user.salesforce.subdomain})
      .auth(user.salesforce.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_id.should.be.type('string')
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
      subdomain:user.shopify.subdomain,
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
      .options({subdomain:user.shopify.subdomain})
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
    p.slack.get('auth.test', {
      qs:{token:user.slack.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.user_id.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.slack.query()
      .select('auth.test')
      .auth(user.slack.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user_id.should.be.type('string')
        done()
      })
  })
})

describe('soundcloud', function () {
  it('options', function (done) {
    p.soundcloud.get('me', {
      qs:{oauth_token:user.soundcloud.token}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.soundcloud.query()
      .select('me')
      .auth(user.soundcloud.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.id.should.be.type('number')
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
    p.stackexchange.get('me', {
      qs:{
        key:user.stackexchange.apikey,
        access_token:user.stackexchange.token,
        site:'stackoverflow'
      }
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.items[0].account_id.should.be.type('number')
      done()
    })
  })
  it('query', function (done) {
    p.stackexchange.query()
      .select('me')
      .where({site:'stackoverflow'})
      .auth(user.stackexchange.apikey, user.stackexchange.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.items[0].account_id.should.be.type('number')
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
})

describe('tripit', function () {
  it('options', function (done) {
    p.tripit.get('get/profile', {
      oauth:{token:user.tripit.token, secret:user.tripit.secret}
    }, function (err, res, body) {
      debugger
      if (err) return error(err, done)
      body.Profile.screen_name.should.be.type('string')
      done()
    })
  })
  it('query', function (done) {
    p.tripit.query()
      .get('get/profile')
      .auth(user.tripit.token, user.tripit.secret)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.Profile.screen_name.should.be.type('string')
        done()
      })
  })
})

describe('tumblr', function () {
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
      qs:{user_id:user.twitter.user_id} // or screen_name
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
      .where({user_id:user.twitter.user_id}) // or screen_name
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
      body.link.should.be.type('string')
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
        body.link.should.be.type('string')
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
    p.wikimapia.get({
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
      .select()
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
      subdomain:user.zendesk.subdomain,
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
      .options({subdomain:user.zendesk.subdomain})
      .auth(user.zendesk.token)
      .request(function (err, res, body) {
        debugger
        if (err) return error(err, done)
        body.user.id.should.be.type('number')
        done()
      })
  })
})
