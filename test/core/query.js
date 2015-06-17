
var should = require('should')
var Query = require('../../lib/query')
var Purest = require('../../')


describe('query', function () {
  var provider = null
  before(function () {
    provider = new Purest({provider:'box'})
  })
  it('config', function () {
    provider.query().should.be.instanceOf(Query)
  })
  it('get', function () {
    var query = provider.query().get('endpoint')
    query.endpoint.should.equal('endpoint')
  })
  it('qs', function () {
    var query = provider.query().qs({some:'data'})
    should.deepEqual(query._options, {api:'__default', qs:{some:'data'}})
  })
  it('form', function () {
    var query = provider.query().form({some:'data'})
    should.deepEqual(query._options, {api:'__default', form:{some:'data'}})
  })
  it('override & extend', function () {
    var query = provider.query()
      .form({some:'data1'})
      .qs({some:'data1'})
      .form({some:'data2', some2:'data3'})
    should.deepEqual(query._options, {
      api:'__default',
      form: {some:'data2', some2:'data3'},
      qs: {some:'data1'}
    })
  })
})

describe('auth', function () {
  var fixture = {
    custom: {
      __provider: {
        oauth: true,
        refresh: '',
        docs: ''
      },
      'https://domain1.com': {
        __domain: {
          auth: {qs:{access_token:'[0]'}}
        },
        'path1': {
          __path: {
            alias: '__default',
            version: 'v3'
          }
        },
        'path2': {
          __path: {
            alias: ['alias1'],
            version: 'v3',
            auth: {headers:{Authorization:'Token [0]'}}
          }
        }
      },
      'https://domain2.com': {
        __domain: {
          auth: [
            {auth: {bearer: '[0]'}},
            {auth: {user:'[0]', pass:'[1]'}}
          ]
        },
        'path1': {
          __path: {
            alias: ['alias2']
          },
          'endpoint': {
            __endpoint: {
              auth: {oauth:{token:'[0]', secret:'[1]'}}
            }
          }
        }
      },
      'https://domain3.com': {
        __domain: {
          auth: {
            qs: {api_key:'[0]'},
            headers: {Authorization:'Basic [1]'}
          }
        },
        'path1': {
          __path: {
            alias: ['alias3']
          }
        },
        'path2': {
          __path: {
            alias: ['alias4'],
            auth: [
              {qs: {api_key:'[0]'}},
              {
                qs: {api_key:'[0]'},
                headers: {Authorization:'OAuth [1]'}
              }
            ]
          }
        }
      }
    }
  }

  it('__domain auth', function () {
    var provider = new Purest({provider:'custom', config:fixture})
    var query = provider.query().auth('token')
    should.deepEqual(query._options,
      {api:'__default', qs:{access_token:'token'}})
    should.deepEqual(query.api.auth,
      {qs:{access_token:'[0]'}})
  })
  it('__path auth', function () {
    var provider = new Purest({provider:'custom', config:fixture})
    var query = provider.query('alias1').auth('token')
    should.deepEqual(query._options,
      {api:'alias1', headers:{Authorization:'Token token'}})
    should.deepEqual(query.api.auth,
      {headers:{Authorization:'Token [0]'}})
  })
  it('__endpoint auth', function () {
    var provider = new Purest({provider:'custom', config:fixture})
    var query = provider.query('alias2').get('endpoint').auth('token','secret')
    should.deepEqual(query._options,
      {api:'alias2', oauth:{token:'token',secret:'secret'}})

    should.deepEqual(query.api.auth, [
      {auth:{bearer:'[0]'}}, {auth:{user:'[0]',pass:'[1]'}}
    ])

    should.deepEqual(query.api.endpoints.str.endpoint.__endpoint, {
      auth: {oauth:{token:'[0]',secret:'[1]'}}
    })
  })

  it('array auth', function () {
    var provider = new Purest({provider:'custom', config:fixture})

    var query = provider.query('alias2').auth('token')
    should.deepEqual(query._options,
      {api:'alias2', auth:{bearer:'token'}})

    var query = provider.query('alias2').auth('user', 'pass')
    should.deepEqual(query._options,
      {api:'alias2', auth:{user:'user',pass:'pass'}})

    should.deepEqual(query.api.auth, [
      {auth:{bearer:'[0]'}}, {auth:{user:'[0]',pass:'[1]'}}
    ])
  })
  it('objects auth', function () {
    var provider = new Purest({provider:'custom', config:fixture})

    var query = provider.query('alias3').auth('apikey', 'token')
    should.deepEqual(query._options,
      {api:'alias3', qs:{api_key:'apikey'}, headers:{Authorization:'Basic token'}})

    should.deepEqual(query.api.auth, {
      qs: {api_key:'[0]'},
      headers: {Authorization:'Basic [1]'}
    })
  })
  it('array and objects auth', function () {
    var provider = new Purest({provider:'custom', config:fixture})

    var query = provider.query('alias4').auth('token')
    should.deepEqual(query._options,
      {api:'alias4', qs:{api_key:'token'}})

    var query = provider.query('alias4').auth('apikey', 'token')
    should.deepEqual(query._options,
      {api:'alias4', qs:{api_key:'apikey'}, headers:{Authorization:'OAuth token'}})

    should.deepEqual(query.api.auth, [
      {qs:{api_key:'[0]'}}, {qs:{api_key:'[0]'}, headers:{Authorization:'OAuth [1]'}}
    ])
  })
})

describe('all methods', function () {
  var provider = null
  before(function () {
    provider = new Purest({provider:'box'})
  })
  describe('http', function () {
    var http = {
      verb:['get', 'post', 'put', 'del', 'patch', 'head'],
      alias:[{get:['select']}, {post:['update']}, {put:['create','insert']}]
    }
    it('verb', function () {
      http.verb.forEach(function (verb) {
        var query = provider.query()[verb]('endpoint')
        query.method.should.equal(verb)
      })
    })
    it('alias', function () {
      http.alias.forEach(function (aliases) {
        var verb = Object.keys(aliases)[0]
        aliases[verb].forEach(function (alias) {
          var query = provider.query()[alias]('endpoint')
          query.method.should.equal(verb)
        })
      })
    })
  })

  describe('options', function () {
    var options = {
      request:['headers', 'qs', 'form', 'formData', 'multipart', 'json', 'body'],
      alias:[{qs:['where']}, {form:['set']}, {formData:['upload']}, {multipart:['upload']}],
      generic:['options']
    }
    it('request', function () {
      options.request.forEach(function (option) {
        var query = provider.query()[option]('value')
        query._options[option].should.equal('value')
      })
    })
    it('alias', function () {
      options.alias.forEach(function (aliases) {
        var option = Object.keys(aliases)[0]
        aliases[option].forEach(function (alias) {
          var data = (option == 'multipart') ? [{key:'value'}] : {key:'value'}
          var query = provider.query()[alias](data)
          should.deepEqual(query._options[option], data)
        })
      })
    })
    it('generic', function () {
      options.generic.forEach(function (option) {
        var query = provider.query()[option]({timeout:100})
        query._options.timeout.should.equal(100)
      })
    })
  })
})
