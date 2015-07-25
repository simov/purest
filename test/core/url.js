
var should = require('should')
var Purest = require('../../')


describe('url', function () {
  describe('type', function () {
    it('set json by default', function () {
      var provider = new Purest({provider:'twitter'}),
        api = provider.apis.__default,
        options = {}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/1.1/endpoint.json')
    })
    it('set in ctor', function () {
      var provider = new Purest({provider:'twitter', type:'xml'}),
        api = provider.apis.__default,
        options = {}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/1.1/endpoint.xml')
    })
    it('set in request', function () {
      var provider = new Purest({provider:'twitter'}),
        api = provider.apis.__default,
        options = {}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/1.1/endpoint.json')
      var options = {type:'xml'}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/1.1/endpoint.xml')
    })
  })

  describe('version', function () {
    it('set in ctor for all apis', function () {
      var provider = new Purest({provider:'twitter'}),
        api = provider.apis.__default,
        options = {}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/1.1/endpoint.json')

      provider = new Purest({provider:'twitter', version:'2'}),
        api = provider.apis.__default,
        options = {}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/2/endpoint.json')
    })

    it('set in request for __default api', function () {
      var provider = new Purest({provider:'twitter'}),
        api = provider.apis.__default,
        options = {}

      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/1.1/endpoint.json')

      options = {version:'2'}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/2/endpoint.json')
    })

    it('set in request for other api', function () {
      var provider = new Purest({provider:'google'}),
        api = provider.apis.drive,
        options = {api:'drive'}

      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/drive/v2/endpoint')

      options = {api:'drive', version:'v3'}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/drive/v3/endpoint')
    })
  })

  describe('path', function () {
    it('set in ctor', function () {
      var provider = new Purest({provider:'basecamp', path:'purest'}),
        api = provider.apis.__default,
        options = {}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/purest/api/v1/endpoint.json')
    })
    it('set in request', function () {
      var provider = new Purest({provider:'basecamp'}),
        api = provider.apis.__default,
        options = {path:'purest'}
      provider.url.get('endpoint', options)
        .should.equal(api.domain+'/purest/api/v1/endpoint.json')
    })
  })

  describe('domain', function () {
    it('set in ctor', function () {
      var provider = new Purest({provider:'salesforce', domain:'eu3'})
      provider.url.get('endpoint', {})
        .should.equal('https://eu3.salesforce.com/endpoint')
    })
    it('set in request', function () {
      var provider = new Purest({provider:'salesforce'})
      provider.url.get('endpoint', {domain:'eu3'})
        .should.equal('https://eu3.salesforce.com/endpoint')
    })
    it('throw error on missing domain option', function () {
      var provider = new Purest({provider:'salesforce'})
      ;(function () {
        provider.url.get('endpoint', {qs:{apikey:'access_token'}})
      }).should.throw('Purest: specify domain name to use through the domain option!')
    })
  })
})
