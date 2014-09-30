
var should = require('should');
var Purest = require('../../lib/provider');
var providers = require('../../config/providers');


describe('format', function () {
    function url (provider, config, options) {
        return [
            provider.url.domain(config.domain, options),
            path(config)
        ].join('/');
    }
    function path (provider) {
        switch (provider.format) {
            case 'version/endpoint.type':
            return [provider.version,'endpoint.json'].join('/');
            case 'version/endpoint':
            return [provider.version,'endpoint'].join('/');
            case 'api/version/endpoint.type':
            return ['api',provider.version,'endpoint.json'].join('/');
            case 'api/version/endpoint':
            return ['api',provider.version,'endpoint'].join('/');
            case 'api/endpoint.type':
            return ['api','endpoint.json'].join('/');
            case 'api/endpoint':
            return ['api','endpoint'].join('/');
            case 'endpoint.type':
            return ['endpoint.json'].join('/');
            case 'endpoint':
            return ['endpoint'].join('/');
            case 'path/version/endpoint':
            return [provider.path,provider.version,'endpoint'].join('/');
            case 'path/endpoint':
            return [provider.path,'endpoint'].join('/');
            case 'path':
            return [provider.path].join('/');
        }
    }
    it.skip('types', function () {
        for (var name in providers) {
            var provider = new Purest({provider:name});

            var config = provider,
                options = {dc:'us2'};
            provider.url.get('endpoint', options)
                .should.equal(url(provider, config, options));

            for (var api in provider.apis) {
                
                var config = provider.apis[api],
                    options = {api:api};
                provider.url.get('endpoint', options)
                    .should.equal(url(provider, config, options));
            }
        }
    });
});

describe('url', function () {
    it('', function () {
        var provider = new Purest({provider:'twitter'}),
            api = provider.apis.__default,
            options = {};
        provider.url.get('endpoint', options)
            .should.equal(api.domain+'/1.1/endpoint.json');
        var options = {version:'5',type:'xml'};
        provider.url.get('endpoint', options)
            .should.equal(api.domain+'/5/endpoint.xml');
    });
});
