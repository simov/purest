
var should = require('should')
var Purest = require('../../')
  , config = require('../../lib/config')


describe('overrides', function () {
  it('ctor option', function () {
    function overrides () {
      this.url.domain = function (config, options) {
        return config.domain.replace('api', 'sandbox')
      }
    }
    var p1 = new Purest({provider:'twitter'})
      , p2 = new Purest({provider:'twitter', overrides:overrides})

    var url = p1.url.get('endpoint', {})
    url.should.equal('https://api.twitter.com/1.1/endpoint.json')

    url = p2.url.get('endpoint', {})
    url.should.equal('https://sandbox.twitter.com/1.1/endpoint.json')
  })
})

describe('overrides auth', function () {
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
    provider.options.oauth(query._options)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options,
      {api:'__default', auth:{user:'user', pass:'pass'}})
  })
  it('openstreetmap use oauth', function () {
    var provider = new Purest({
      provider:'openstreetmap', key:'key', secret:'secret'})
    var query = provider.query().auth(token40,'pass')
    provider.options.oauth(query._options)
    provider.before.all('endpoint', query._options)
    should.deepEqual(query._options.oauth, {
      consumer_key:'key', consumer_secret:'secret',
      token:token40, token_secret:'pass'
    })
  })
})

describe('overrides other', function () {
  it('getpocket', function () {

  })
  it('google url - set json as default return type', function () {
    var provider = new Purest({provider:'google', api:'gmaps'})
      , config = provider.apis.gmaps
    ;['geocode', 'directions', 'timezone', 'elevation', 'distancematrix']
    .forEach(function (endpoint) {
      provider.url.get(endpoint,{})
        .should.equal([
          config.domain,
          config.path.replace('{endpoint}', endpoint), 'json'
        ].join('/'))
    })
  })
  it('google url - specify return type', function () {
    var provider = new Purest({provider:'google', api:'gmaps'})
      , config = provider.apis.gmaps
    provider.url.get('geocode/json',{})
      .should.equal([
        config.domain,
        config.path.replace('{endpoint}','geocode'),
      'json'].join('/'))
    provider.url.get('geocode/xml',{})
      .should.equal([
        config.domain,
        config.path.replace('{endpoint}','geocode'),
        'xml'].join('/'))
  })

  it('hackpad oauth - 0-legged OAuth', function () {
    var provider = new Purest({provider:'hackpad', key:'key', secret:'secret'})
      , query = provider.query()
    provider.options.oauth(query._options)
    should.deepEqual(query._options,
      {api:'__default', oauth:{consumer_key:'key', consumer_secret:'secret'}})
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
    provider.url.get('endpoint', {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}})
      .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json')
  })
  it('mailchimp domain - get data center name from option', function () {
    var provider = new Purest({provider:'mailchimp'})
    provider.url.get('endpoint', {subdomain:'us2'})
      .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json')
  })
  it('mailchimp domain - throw error on missing data center name', function () {
    var provider = new Purest({provider:'mailchimp'})
    ;(function () {
      provider.url.get('endpoint', {qs:{apikey:'access_token'}})
    }).should.throw('Purest: specify data center name to use through the subdomain option!')
  })

  it('paypal domain - use default domain', function () {
    var provider = new Purest({provider:'paypal', api:'payments'})
    provider.url.get('endpoint', {})
      .should.equal('https://api.paypal.com/v1/payments/endpoint')
  })
  it('paypal domain - use sandbox domain', function () {
    var provider = new Purest({provider:'paypal', api:'payments'})
    provider.url.get('endpoint', {subdomain:'sandbox'})
      .should.equal('https://api.sandbox.paypal.com/v1/payments/endpoint')
  })
})
