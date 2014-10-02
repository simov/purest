
var should = require('should');
var config = require('../../lib/config'),
    Purest = require('../../lib/provider');


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
                    'documents': {
                        get: {
                            options: {
                                encoding: null
                            }
                        }
                    },
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
                            options: {
                                encoding: null
                            }
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
};


describe('config', function () {
    it('extend', function () {
        var provider = new Purest({provider:'custom1', config:fixture.provider});
        provider.name.should.equal('custom1');
    });
    it('aliases', function () {
        should.deepEqual(config.aliases(fixture.provider.custom1), fixture.alias);
    });
    it('options', function () {
        var endpoints = fixture.alias.__default.endpoints;

        should.deepEqual(
            config.options('files', {}, 'get', endpoints),
            {headers:{'x-li-format':'json'}}
        );
        should.deepEqual(
            config.options('documents', {}, 'get', endpoints),
            {headers:{'x-li-format':'json'}, options:{encoding:null} }
        );
        should.deepEqual(
            config.options('files/123/content', {}, 'post', endpoints),
            {headers:{'x-li-format':'json'}, multipart:'file'}
        );
        var options = {headers:{'User-Agent':'Grant', 'x-li-format':'xml'}};
        should.deepEqual(
            config.options('files', options, 'get', endpoints),
            {headers:{'x-li-format':'xml', 'User-Agent':'Grant'}}
        );
    });
});


describe('Config', function () {
    var provider = new Purest({provider:'custom1', config:fixture.provider});

    it('config', function () {
        provider.config().should.be.instanceOf(config.Config);
        should.deepEqual(provider._config.api, fixture.alias.__default);
    });
    it('qs', function () {
        provider.config().qs({some:'data'}).should.be.instanceOf(config.Config);
        should.deepEqual(provider._config.options, {qs:{some:'data'}});
    });
    it('form', function () {
        provider.config().form({some:'data'}).should.be.instanceOf(config.Config);
        should.deepEqual(provider._config.options, {form:{some:'data'}});
    });
    it('override & extend', function () {
        provider.config()
            .form({some:'data1'})
            .qs({some:'data1'})
            .form({some:'data2', some2:'data3'})
            .should.be.instanceOf(config.Config);
        should.deepEqual(provider._config.options, {
            form: {some:'data2', some2:'data3'},
            qs: {some:'data1'}
        });
    });
});


describe('Config.auth', function () {
    var fixture = {
        custom1: {
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
                    }
                }
            }
        }
    };

    it('object', function () {
        var provider = new Purest({provider:'custom1', config:fixture});
        provider.config().auth('token');
        should.deepEqual(provider._config.options, {qs:{ access_token:'token'} });
        should.deepEqual(provider._config.api.auth, {qs:{ access_token:'[0]'} });
    });
    it('path overrides auth', function () {
        var provider = new Purest({provider:'custom1', config:fixture});
        provider.config('alias1').auth('token');
        should.deepEqual(provider._config.options, {headers:{Authorization:'Token token'}});
        should.deepEqual(provider._config.api.auth, {headers:{Authorization:'Token [0]'}});
    });
    it('array', function () {
        var provider = new Purest({provider:'custom1', config:fixture});

        provider.config('alias2').auth('token');
        should.deepEqual(provider._config.options, {auth:{bearer:'token'}});

        provider.config('alias2').auth('user', 'pass');
        should.deepEqual(provider._config.options, {auth:{user:'user',pass:'pass'}});

        should.deepEqual(provider._config.api.auth, [
            {auth:{bearer:'[0]'}}, {auth:{user:'[0]',pass:'[1]'}}
        ]);
    });
});


describe('Config.verb', function () {
    it.skip('', function () {
        
    });
});
