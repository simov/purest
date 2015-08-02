
var http = require('http')
var should = require('should')
var Purest = require('../../')


describe('required options', function () {
  it('throw on missing options', function () {
    (function () {
      var p = new Purest()
    }).should.throw('Purest: provider option is required!')
  })
  it('throw on missing provider option', function () {
    (function () {
      var p = new Purest({})
    }).should.throw('Purest: provider option is required!')
  })
  it('throw on non existing provider', function () {
    (function () {
      var p = new Purest({provider:'purest'})
    }).should.throw('Purest: non existing provider!')
  })
})

describe('add custom provider', function () {
  before(function () {
    ;(function () {
      var provider = new Purest({provider:'custom1'})
    }).should.throw('Purest: non existing provider!')
  })

  it('add', function () {
    var config = {
      'custom1': {
        'http://site.com': {
          '{endpoint}': {
            '__path': {'alias':'__default'}
          }
        }
      }
    }
    var provider = new Purest({provider:'custom1', config:config})

    provider.name.should.equal('custom1')
    should.deepEqual(provider.apis, {
      __default: {
        domain: 'http://site.com',
        path: '{endpoint}',
        subdomain:null, subpath:null, version:null, endpoint:null, type:null,
        auth: null,
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
})

describe('extend existing provider', function () {
  before(function () {
    var provider = new Purest({provider:'500px'})

    should.deepEqual(provider.apis, {
      __default: {
        domain: 'https://api.500px.com',
        path: '[version]/{endpoint}',
        subdomain:null, subpath:null, version:'v1', endpoint:null, type:null,
        auth: {oauth: {token:'[0]', secret:'[1]'}},
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })

  it('extend', function () {
    var config = {
      '500px': {
        'https://api.500px.com': {
          '[version]/users': {
            '__path': {
              'alias': 'user',
              'version': 'v1'
            }
          }
        }
      }
    }
    var provider = new Purest({provider:'500px', config:config})

    should.deepEqual(provider.apis, {
      __default: {
        domain: 'https://api.500px.com',
        path: '[version]/{endpoint}',
        subdomain:null, subpath:null, version:'v1', endpoint:null, type:null,
        auth: {oauth: {token:'[0]', secret:'[1]'}},
        endpoints: {all:null, str:null, regex:null}
      },
      user: {
        domain: 'https://api.500px.com',
        path: '[version]/users',
        subdomain:null, subpath:null, version:'v1', endpoint:null, type:null,
        auth: {oauth: {token:'[0]', secret:'[1]'}},
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
})

describe('key & secret', function () {
  it('consumerKey & consumerSecret', function () {
    var p = new Purest({provider:'twitter',
      consumerKey:'app-key', consumerSecret:'app-secret'
    })
    p.key.should.equal('app-key')
    p.secret.should.equal('app-secret')
  })
  it('key & secret', function () {
    var p = new Purest({provider:'twitter',
      key:'app-key', secret:'app-secret'
    })
    p.key.should.equal('app-key')
    p.secret.should.equal('app-secret')
  })
})

describe('defaults', function () {
  before(function (done) {
    var server = http.createServer()
    server.on('request', function (req, res) {
      res.end(req.headers.authorization)
    })
    server.listen(6767, done)
  })
  it('defaults', function (done) {
    var defaults = {
      oauth:{
        consumer_key:'key', consumer_secret:'secret',
        token:'token', token_secret:'secret'
      }
    }
    var p = new Purest({provider:'twitter', defaults:defaults})
    p.get('http://localhost:6767', function (err, res, body) {
      body.should.match(/oauth_consumer_key="key"/)
      body.should.match(/oauth_token="token"/)
      done()
    })
  })
  it('no defaults', function (done) {
    var p = new Purest({provider:'twitter'})
    p.get('http://localhost:6767', function (err, res, body) {
      should.equal(body, undefined)
      done()
    })
  })
})

describe('debug', function () {
  it('false', function () {
    var p = new Purest({provider:'twitter'})
    should.equal(p._request.stopDebugging, undefined)
  })
  it.skip('true', function () {
    var p = new Purest({provider:'twitter', debug:true})
    p._request.stopDebugging.should.be.type('function')
  })
})

describe('url modifiers', function () {
  it('defaults', function () {
    var p = new Purest({provider:'twitter'})
    should.equal(p.subdomain, undefined)
    should.equal(p.path, undefined)
    should.equal(p.version, undefined)
    should.equal(p.type, undefined)
  })
  it('set', function () {
    var p = new Purest({provider:'twitter',
      subdomain:'subdomain', subpath:'subpath', version:'version', type:'xml'})
    p.subdomain.should.equal('subdomain')
    p.subpath.should.equal('subpath')
    p.version.should.equal('version')
    p.type.should.equal('xml')
  })
})

describe('api - path alias', function () {
  it('__default', function () {
    var p = new Purest({provider:'google'})
    p.api.should.equal('__default')
  })
  it('throw on provider without defined APIs', function () {
    ;(function () {
      var p = new Purest({provider:'500px', api:'user'})
    }).should.throw('Purest: non existing API!')
  })
  it('throw on non existing API', function () {
    ;(function () {
      var p = new Purest({provider:'google', api:'yahoo'})
    }).should.throw('Purest: non existing API!')
  })
  it('set', function () {
    var p = new Purest({provider:'google', api:'plus'})
    p.api.should.equal('plus')
  })
})

describe('shortcuts', function () {
  it('name & [provider] flag', function () {
    var p = new Purest({provider:'facebook'})
    p.facebook.should.equal(true)
    p.name.should.equal('facebook')
  })
})

describe('overrides', function () {
  it('pre-defined in Purest', function () {
    var p = new Purest({provider:'linkedin'})
    var options = {form:{key:'data'}}
    p.before.post('endpoint',options)
    should.deepEqual(options, {json:{key:'data'}})
  })
  it('user defined', function () {
    var before = {
      post: function (endpoint, options, config) {
        options.form.format = 'json'
      }
    }
    var p = new Purest({provider:'facebook', before:before})
    var options = {form:{key:'data'}}
    p.before.post('endpoint',options)
    should.deepEqual(options, {form:{key:'data', format:'json'}})
  })
})

describe('expose', function () {
  it('request', function () {
    Purest.request.should.be.type('function')
  })
  it('extend', function () {
    Purest.extend.should.be.type('function')
  })
})
