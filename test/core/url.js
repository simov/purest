
var should = require('should')
var Purest = require('../../')


describe('url subdomain', function () {
  it('set in ctor', function () {
    var provider = new Purest({provider:'salesforce', subdomain:'eu3'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal('https://eu3.salesforce.com/endpoint')
  })
  it('set in request', function () {
    var provider = new Purest({provider:'salesforce'})
      , options = {subdomain:'eu3'}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal('https://eu3.salesforce.com/endpoint')
  })
})

describe('url subpath', function () {
  it('set in ctor', function () {
    var provider = new Purest({provider:'basecamp', subpath:'purest'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/purest/api/v1/endpoint.json')
  })
  it('set in request', function () {
    var provider = new Purest({provider:'basecamp'})
      , options = {subpath:'purest'}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/purest/api/v1/endpoint.json')
  })
})

describe('url version', function () {
  it('set in ctor for all apis', function () {
    var provider = new Purest({provider:'twitter'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/1.1/endpoint.json')

    provider = new Purest({provider:'twitter', version:'2'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/2/endpoint.json')
  })

  it('set in request for __default api', function () {
    var provider = new Purest({provider:'twitter'})
      , options = {}
      , config = provider.apis.__default

    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/1.1/endpoint.json')

    options = {version:'2'}
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/2/endpoint.json')
  })

  it('set in request for other api', function () {
    var provider = new Purest({provider:'google'})
      , options = {api:'drive'}
      , config = provider.apis.drive

    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/drive/v2/endpoint')

    options = {api:'drive', version:'v3'}
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/drive/v3/endpoint')
  })
})

describe('url type', function () {
  it('set json by default', function () {
    var provider = new Purest({provider:'twitter'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/1.1/endpoint.json')
  })
  it('set in ctor', function () {
    var provider = new Purest({provider:'twitter', type:'xml'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/1.1/endpoint.xml')
  })
  it('set in request', function () {
    var provider = new Purest({provider:'twitter'})
      , options = {}
      , config = provider.apis.__default
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/1.1/endpoint.json')
    var options = {type:'xml'}
    provider.url.get('endpoint', options, config)
      .should.equal(config.domain+'/1.1/endpoint.xml')
  })
})
