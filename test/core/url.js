
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
    it('types', function () {
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

describe('options', function () {
    it('provider - version, type', function () {
        var provider = new Purest({provider:'twitter'}),
            options = {};
        provider.url.get('endpoint', options)
            .should.equal(provider.domain+'/1.1/endpoint.json');
        var options = {provider:{version:'5',type:'xml'}};
        provider.url.get('endpoint', options)
            .should.equal(provider.domain+'/5/endpoint.xml');
    });
    it('provider - path', function () {
        var provider = new Purest({provider:'flickr'}),
            options = {};
        provider.url.get('endpoint', options)
            .should.equal(provider.domain+'/services/rest/endpoint');
        var options = {provider:{path:'api/json'}};
        provider.url.get('endpoint', options)
            .should.equal(provider.domain+'/api/json/endpoint');
    });
    it('api string', function () {
        var provider = new Purest({provider:'box'}),
            options = {api:'upload'},
            config = provider.apis.upload;
        provider.url.get('endpoint', options)
            .should.equal(config.domain+'/api/2.0/endpoint');
    });
    it('api object - version', function () {
        var provider = new Purest({provider:'box'}),
            config = provider.apis.upload;
        var options = {api:{name:'upload'}}
        provider.url.get('endpoint', options)
            .should.equal(config.domain+'/api/2.0/endpoint');
        var options = {api:{name:'upload',version:'5.0'}};
        provider.url.get('endpoint', options)
            .should.equal(config.domain+'/api/5.0/endpoint');
    });
    it('api object - path', function () {
        var provider = new Purest({provider:'flickr'}),
            config = provider.apis.upload;
        var options = {api:{name:'upload'}};
        provider.url.get('', options)
            .should.equal(config.domain+'/services/upload');
        var options = {api:{name:'upload',path:'api/rest'}};
        provider.url.get('', options)
            .should.equal(config.domain+'/api/rest');
    });
    it.skip('provider domain', function () {
        // not implemented
    });
    it('api domain', function () {
        var provider = new Purest({provider:'google'}),
            config = provider.apis.plus;
        var options = {api:{name:'plus'}}
        provider.url.get('endpoint', options)
            .should.equal('https://www.googleapis.com/plus/v1/endpoint');
        var options = {api:{name:'plus',domain:'https://google.com'}};
        provider.url.get('endpoint', options)
            .should.equal('https://google.com/plus/v1/endpoint');
    });
});

describe('override', function () {
    describe('mailchimp', function () {
        it('get data center name from apikey', function () {
            var provider = new Purest({provider:'mailchimp'});
            provider.url.get('endpoint', {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}})
                .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
        });
        it('get data center name from option', function () {
            var provider = new Purest({provider:'mailchimp'});
            provider.url.get('endpoint', {dc:'us2'})
                .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
        });
        it('throw error on missing data center name', function () {
            var provider = new Purest({provider:'mailchimp'});
            (function () {
                provider.url.get('endpoint', {qs:{apikey:'access_token'}});
            }).should.throw('Purest: specify data center to use through the dc option!');
        });
    });
    describe('twitter', function () {
        it('on POST request escape !*()\' (RFC3986 URI symbols) and send them as qs', function () {
            var provider = new Purest({provider:'twitter'}),
                options = {form:{one:"!*()'",two:2}};
            provider.url.get('endpoint', options).should.equal(
                'https://api.twitter.com/1.1/endpoint.json?one=%21%2a%28%29%27&two=2'
            );
            should.not.exist(options.form);
        });
        it('use default url on GET request', function () {
            var provider = new Purest({provider:'twitter'});
            provider.url.get('endpoint',{})
                .should.equal('https://api.twitter.com/1.1/endpoint.json');
        });
    });
    describe('gmaps', function () {
        it('set json as default return type', function () {
            var provider = new Purest({provider:'google',api:'gmaps'}),
                config = provider.apis.gmaps;
            ['geocode', 'directions', 'timezone', 'elevation', 'distancematrix'].forEach(function (endpoint) {
                provider.url.get(endpoint,{})
                    .should.equal([config.domain, config.path, endpoint, 'json'].join('/'));
            });
        });
        it('specify return type', function () {
            var provider = new Purest({provider:'google',api:'gmaps'}),
                config = provider.apis.gmaps;
            provider.url.get('geocode/json',{})
                .should.equal([config.domain, config.path, 'geocode', 'json'].join('/'));
            provider.url.get('geocode/xml',{})
                .should.equal([config.domain, config.path, 'geocode', 'xml'].join('/'));
        });
    });
});
