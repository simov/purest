
var should = require('should')
var Purest = require('../../')
  , config = require('../../lib/config')
  , utils = require('../../lib/utils')


describe('hooks', function () {
  // improve this test
  it('ctor option', function () {
    var before = {
      all: function (endpoint, options, config) {
        options.a = 1
      }
    }

    var p1 = new Purest({provider:'twitter'})
      , p2 = new Purest({provider:'twitter', before:before})

    p1._request = function (url, options, callback) {
      should.equal(options.a, undefined)
    }
    p2._request = function (url, options, callback) {
      options.a.should.equal(1)
    }

    p1.get('endpoint')
    p2.get('endpoint')
  })
})

describe('hooks auth', function () {
  var token30 = '012345678901234567890123456789'
    , token40 = '0123456789012345678901234567890123456789'
    , token45 = '012345678901234567890123456789012345678901234'

  it('aboutme header basic', function () {
    var provider = new Purest({provider:'aboutme'})
      , query = provider.query().auth(token45)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.headers, {authorization:'OAuth '+token45})
  })
  it('aboutme header oauth', function () {
    var provider = new Purest({provider:'aboutme'})
      , query = provider.query().auth(token40)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.headers, {authorization:'Basic '+token40})
  })

  it('asana bearer', function () {
    var provider = new Purest({provider:'asana'})
      , query = provider.query().auth(token30)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.auth, {user:token30})
  })
  it('asana apikey', function () {
    var provider = new Purest({provider:'asana'})
      , query = provider.query().auth(token40)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.auth, {bearer:token40})
  })

  it('flowdock bearer token', function () {
    var provider = new Purest({provider:'flowdock'})
      , query = provider.query().auth(token40)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.auth, {bearer:token40})
  })
  it('flowdock api token', function () {
    var provider = new Purest({provider:'flowdock'})
      , query = provider.query().auth(token30)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.auth, {user:token30})
  })

  it('imgur apikey', function () {
    var provider = new Purest({provider:'imgur'})
      , query = provider.query().auth(token30)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.headers,
      {authorization:'Client-ID '+token30})
  })
  it('imgur token', function () {
    var provider = new Purest({provider:'imgur'})
      , query = provider.query().auth(token40)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.auth, {bearer:token40})
  })

  it('openstreetmap use basic auth', function () {
    var provider = new Purest({
      provider:'openstreetmap', key:'key', secret:'secret'})
    var query = provider.query().auth('user','pass')
    utils.oauth.call(provider, query._options)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options,
      {api:'__default', auth:{user:'user', pass:'pass'}})
  })
  it('openstreetmap use oauth', function () {
    var provider = new Purest({
      provider:'openstreetmap', key:'key', secret:'secret'})
    var query = provider.query().auth(token40,'pass')
    utils.oauth.call(provider, query._options)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.oauth, {
      consumer_key:'key', consumer_secret:'secret',
      token:token40, token_secret:'pass'
    })
  })
})

describe('hooks other', function () {
  it('getpocket', function () {

  })

  it('linkedin options - send form data as entity body', function () {
    var p = new Purest({provider:'linkedin', key:'k', secret:'s'})
      , options = {headers:{}, form:{a:1}, oauth:{token:'t', secret:'ts'}}
    p.before.post('endpoint', options)
    should.deepEqual(options.json, {a:1})
    should.not.exist(options.form)
  })

  it('mailchimp domain - get data center name from apikey', function () {
    var provider = new Purest({provider:'mailchimp'})
      , endpoint = 'endpoint'
      , options = {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}}
      , config = provider.apis.__default
    provider.before.all.call(provider, endpoint, options, config)
    provider.url.get('endpoint', options, config)
      .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json')
  })
  it('mailchimp domain - get data center name from option', function () {
    var provider = new Purest({provider:'mailchimp'})
      , endpoint = 'endpoint'
      , options = {subdomain:'us2'}
      , config = provider.apis.__default
    provider.before.all.call(provider, endpoint, options, config)
    provider.url.get('endpoint', options, config)
      .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json')
  })
})
