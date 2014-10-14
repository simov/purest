
var should = require('should');
var Purest = require('../../lib/provider');


describe('url', function () {
    describe('type', function () {
        it('set json by default', function () {
            var provider = new Purest({provider:'twitter'}),
                api = provider.apis.__default,
                options = {};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/1.1/endpoint.json');
        });
        it('set in ctor', function () {
            var provider = new Purest({provider:'twitter', type:'xml'}),
                api = provider.apis.__default,
                options = {};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/1.1/endpoint.xml');
        });
        it('set in request', function () {
            var provider = new Purest({provider:'twitter'}),
                api = provider.apis.__default,
                options = {};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/1.1/endpoint.json');
            var options = {type:'xml'};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/1.1/endpoint.xml');
        });
    });

    describe('version', function () {
        it('set in request for __default', function () {
            var provider = new Purest({provider:'twitter'}),
                api = provider.apis.__default,
                options = {};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/1.1/endpoint.json');
            var options = {version:'2'};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/2/endpoint.json');
        });
        it('set in request for other api', function () {
            var provider = new Purest({provider:'google'}),
                api = provider.apis.drive,
                options = {api:'drive'};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/drive/v2/endpoint');
            var options = {api:'drive', version:'v3'};
            provider.url.get('endpoint', options)
                .should.equal(api.domain+'/drive/v3/endpoint');
        });
    });
});
