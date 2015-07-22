
var should = require('should')
var Purest = require('../../')
  , config = require('../../lib/config')
var providers = require('../../config/providers')


var fixture = {
  provider: {
    custom1: {
      __provider: {
        oauth: true,
        refresh: '',
        docs: ''
      },
      'https://domain.com': {
        __domain: {
          auth: {qs:{access_token:'[1]'}}
        },
        'api/[version]/{endpoint}.[type]': {
          __path: {
            alias: ['__default'],
            version: 'v3'
          },
          '*': {
            all: {
              headers: {
                'x-li-format': 'json'
              }
            }
          },
          // added dynamically below
          // 'documents': {
          //   get: {
          //     encoding: null
          //   }
          // },
          'files\\/\\d+\\/content': {
            __endpoint: {
              regex: true
            },
            post: {
              multipart: 'file'
            }
          }
        }
      }
    }
  },
  alias: {
    __default: {
      domain: 'https://domain.com',
      path: 'api/[version]/{endpoint}.[type]',
      version: 'v3',
      auth: {qs:{access_token:'[1]'}},
      endpoints: {
        all: {
          'all': {
            headers: {
              'x-li-format': 'json'
            }
          }
        },
        str: {
          'documents': {
            get: {
              encoding: null
            }
          }
        },
        regex: {
          'files\\/\\d+\\/content': {
            __endpoint: {
              regex: true
            },
            post: {
              multipart: 'file'
            }
          }
        }
      }
    }
  }
}


describe('config', function () {
  it('extend with new provider', function () {
    var provider = new Purest({provider:'custom1', config:fixture.provider})
    provider.name.should.equal('custom1')
    should.deepEqual(providers.custom1, fixture.provider.custom1)
  })

  it('extend existing provider', function () {
    var extend = {
      custom1: {
        'https://domain.com': {
          'api/[version]/{endpoint}.[type]': {
            'documents': {
              get: {
                encoding: null
              }
            }
          }
        }
      }
    }
    var provider = new Purest({provider:'custom1', config:extend})
    fixture.provider.custom1
      ['https://domain.com']
      ['api/[version]/{endpoint}.[type]']
      ['documents'] = {get: {encoding: null}}
    should.deepEqual(providers.custom1, fixture.provider.custom1)
  })

  it('aliases', function () {
    should.deepEqual(config.aliases(fixture.provider.custom1), fixture.alias)
  })

  it('options', function () {
    var endpoints = fixture.alias.__default.endpoints

    should.deepEqual(
      config.options('files', {}, 'get', endpoints),
      {headers:{'x-li-format':'json'}}
    )
    should.deepEqual(
      config.options('documents', {}, 'get', endpoints),
      {headers:{'x-li-format':'json'}, encoding:null }
    )
    should.deepEqual(
      config.options('files/123/content', {}, 'post', endpoints),
      {headers:{'x-li-format':'json'}, multipart:'file'}
    )
    var options = {headers:{'User-Agent':'Grant', 'x-li-format':'xml'}}
    should.deepEqual(
      config.options('files', options, 'get', endpoints),
      {headers:{'x-li-format':'xml', 'User-Agent':'Grant'}}
    )
  })
})
