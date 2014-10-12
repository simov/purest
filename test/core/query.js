
var should = require('should');
var Query = require('../../lib/query'),
    Purest = require('../../lib/provider');


describe('Query', function () {
    var provider = null;
    before(function () {
        provider = new Purest({provider:'box'});
    });
    it('config', function () {
        provider.config().should.be.instanceOf(Query);
    });
    it('qs', function () {
        provider.config().qs({some:'data'}).should.be.instanceOf(Query);
        should.deepEqual(provider._query._options, {api:'__default', qs:{some:'data'}});
    });
    it('form', function () {
        provider.config().form({some:'data'}).should.be.instanceOf(Query);
        should.deepEqual(provider._query._options, {api:'__default', form:{some:'data'}});
    });
    it('override & extend', function () {
        provider.config()
            .form({some:'data1'})
            .qs({some:'data1'})
            .form({some:'data2', some2:'data3'})
            .should.be.instanceOf(Query);
        should.deepEqual(provider._query._options, {
            api:'__default',
            form: {some:'data2', some2:'data3'},
            qs: {some:'data1'}
        });
    });
});

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
            }
        }
    };

    it('__domain auth', function () {
        var provider = new Purest({provider:'custom', config:fixture});
        provider.config().auth('token');
        should.deepEqual(provider._query._options,
            {api:'__default', qs:{access_token:'token'}});
        should.deepEqual(provider._query.api.auth,
            {qs:{access_token:'[0]'}});
    });
    it('__path auth', function () {
        var provider = new Purest({provider:'custom', config:fixture});
        provider.config('alias1').auth('token');
        should.deepEqual(provider._query._options,
            {api:'alias1', headers:{Authorization:'Token token'}});
        should.deepEqual(provider._query.api.auth,
            {headers:{Authorization:'Token [0]'}});
    });
    it('array auth', function () {
        var provider = new Purest({provider:'custom', config:fixture});

        provider.config('alias2').auth('token');
        should.deepEqual(provider._query._options,
            {api:'alias2', auth:{bearer:'token'}});

        provider.config('alias2').auth('user', 'pass');
        should.deepEqual(provider._query._options,
            {api:'alias2', auth:{user:'user',pass:'pass'}});

        should.deepEqual(provider._query.api.auth, [
            {auth:{bearer:'[0]'}}, {auth:{user:'[0]',pass:'[1]'}}
        ]);
    });
    it('__endpoint auth', function () {
        var provider = new Purest({provider:'custom', config:fixture});
        provider.config('alias2').get('endpoint').auth('token','secret');
        should.deepEqual(provider._query._options,
            {api:'alias2', oauth:{token:'token',secret:'secret'}});

        should.deepEqual(provider._query.api.auth, [
            {auth:{bearer:'[0]'}}, {auth:{user:'[0]',pass:'[1]'}}
        ]);

        should.deepEqual(provider._query.api.endpoints.str.endpoint.__endpoint, {
            auth: {oauth:{token:'[0]',secret:'[1]'}}
        });
    });
});
