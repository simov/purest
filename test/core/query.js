
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
        should.deepEqual(provider._config.options, {api:'__default', qs:{some:'data'}});
    });
    it('form', function () {
        provider.config().form({some:'data'}).should.be.instanceOf(Query);
        should.deepEqual(provider._config.options, {api:'__default', form:{some:'data'}});
    });
    it('override & extend', function () {
        provider.config()
            .form({some:'data1'})
            .qs({some:'data1'})
            .form({some:'data2', some2:'data3'})
            .should.be.instanceOf(Query);
        should.deepEqual(provider._config.options, {
            api:'__default',
            form: {some:'data2', some2:'data3'},
            qs: {some:'data1'}
        });
    });
});

describe('auth', function () {
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
        should.deepEqual(provider._config.options,
            {api:'__default', qs:{access_token:'token'}});
        should.deepEqual(provider._config.api.auth,
            {qs:{access_token:'[0]'}});
    });
    it('path overrides auth', function () {
        var provider = new Purest({provider:'custom1', config:fixture});
        provider.config('alias1').auth('token');
        should.deepEqual(provider._config.options,
            {api:'alias1', headers:{Authorization:'Token token'}});
        should.deepEqual(provider._config.api.auth,
            {headers:{Authorization:'Token [0]'}});
    });
    it('array', function () {
        var provider = new Purest({provider:'custom1', config:fixture});

        provider.config('alias2').auth('token');
        should.deepEqual(provider._config.options,
            {api:'alias2', auth:{bearer:'token'}});

        provider.config('alias2').auth('user', 'pass');
        should.deepEqual(provider._config.options,
            {api:'alias2', auth:{user:'user',pass:'pass'}});

        should.deepEqual(provider._config.api.auth, [
            {auth:{bearer:'[0]'}}, {auth:{user:'[0]',pass:'[1]'}}
        ]);
    });
});
