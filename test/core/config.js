
var should = require('should')
var Purest = require('../../')
  , config = require('../../lib/config')
var providers = require('../../config/providers')


describe('aliases', function () {
  it('throw on missing __path key', function () {
    var provider = {
      domain: {
        path: {}
      }
    }
    ;(function () {
      var aliases = config.aliases(provider)
    }).should.throw('Purest: __path key is required!')
  })
  it('throw on missing __path.alias key', function () {
    var provider = {
      domain: {
        path: {__path:{}}
      }
    }
    ;(function () {
      var aliases = config.aliases(provider)
    }).should.throw('Purest: __path.alias key is required!')
  })
  it('alias string', function () {
    var provider = {
      domain: {
        path: {__path: {alias:'name'}}
      }
    }
    var aliases = config.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', version:null, auth:null,
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
  it('alias array', function () {
    var provider = {
      domain: {
        path: {__path: {alias:['name1', 'name2']}}
      }
    }
    var aliases = config.aliases(provider)
    should.deepEqual(aliases, {
      name1: {
        domain:'domain', path:'path', version:null, auth:null,
        endpoints: {all:null, str:null, regex:null}
      },
      name2: {
        domain:'domain', path:'path', version:null, auth:null,
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
  it('__path.version', function () {
    var provider = {
      domain: {
        path: {__path: {alias:'name', version:'v1'}}
      }
    }
    var aliases = config.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', version:'v1', auth:null,
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
  it('__domain.auth', function () {
    var provider = {
      domain: {
        __domain: {auth:{a:1}},
        path: {__path: {alias:'name'}}
      }
    }
    var aliases = config.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', version:null, auth:{a:1},
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
  it('__path.auth', function () {
    var provider = {
      domain: {
        __domain: {auth:{a:1}},
        path: {__path: {alias:'name', auth:{a:2}}}
      }
    }
    var aliases = config.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', version:null, auth:{a:2},
        endpoints: {all:null, str:null, regex:null}
      }
    })
  })
})

describe('endpoints', function () {
  it('all', function () {
    var endpoints = {
      '*': {get:{a:1}}
    }
    var result = config.endpoints(endpoints)
    should.deepEqual(result, {all: {get:{a:1}}, str:null, regex:null})
  })
  it('regex', function () {
    var endpoints = {
      '\\d+': {__endpoint:{regex:true}, get:{a:1}}
    }
    var result = config.endpoints(endpoints)
    should.deepEqual(result, {all: null, str:null,
      regex: {'\\d+': {__endpoint:{regex:true}, get:{a:1}}}})
  })
  it('str', function () {
    var endpoints = {
      'string': {get:{a:1}}
    }
    var result = config.endpoints(endpoints)
    should.deepEqual(result, {all: null, str:{string:{get:{a:1}}}, regex:null})
  })
})

describe('options', function () {
  it('all', function () {
    var endpoints = {all: {get:{a:1}}}
      , options = {b:2}
    var result = config.options('endpoint', options, 'get', endpoints)
    should.deepEqual(result, {a:1, b:2})
  })
  it('regex', function () {
    var endpoints = {regex: {'\\d+': {__endpoint:{regex:true}, get:{a:1}}}}
      , options = {b:2}
    var result = config.options('123', options, 'get', endpoints)
    should.deepEqual(result, {a:1, b:2})
  })
  it('str', function () {
    var endpoints = {str: {string:{get:{a:1}}}}
      , options = {b:2}
    var result = config.options('string', options, 'get', endpoints)
    should.deepEqual(result, {a:1, b:2})
  })
})

describe('auth', function () {
  it('all', function () {
    var endpoints = {all: {__endpoint:{auth:'a'}}}
      , auth = config.auth('endpoint', endpoints)
    auth.should.equal('a')
  })
  it('regex', function () {
    var endpoints = {regex: {'\\d+': {__endpoint:{regex:true, auth:'a'}}}}
      , auth = config.auth('123', endpoints)
    auth.should.equal('a')
  })
  it('str', function () {
    var endpoints = {str: {string:{__endpoint:{auth:'a'}}}}
      , auth = config.auth('string', endpoints)
    auth.should.equal('a')
  })
})


var fixture = {
  provider: {
    custom1: {
      __provider: {
        oauth: true
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
