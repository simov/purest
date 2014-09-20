
var should = require('should');
var purest = require('../../lib/provider');
var Url = require('../../lib/url');
var providers = require('../../config/providers');


describe('path', function () {
    it('version/endpoint.json', function () {
        var url = new Url({name:'twitter'});
        url.path('v1','endpoint').should.equal('v1/endpoint.json');
    });
    it('version/endpoint', function () {
        var url = new Url({name:'bitly'});
        url.path('v1','endpoint').should.equal('v1/endpoint');
    });

    it('api/version/endpoint.json', function () {
        var url = new Url({name:'stocktwits'});
        url.path('v1','endpoint').should.equal('api/v1/endpoint.json');
    });
    it('api/version/endpoint', function () {
        var url = new Url({name:'asana'});
        url.path('v1','endpoint').should.equal('api/v1/endpoint');
    });
    it('api/endpoint.json', function () {
        var url = new Url({name:'sendgrid'});
        url.path('v1','endpoint').should.equal('api/endpoint.json');
    });
    it('api/endpoint', function () {
        var url = new Url({name:'slack'});
        url.path('v1','endpoint').should.equal('api/endpoint');
    });

    it('endpoint.json', function () {
        var url = new Url({name:'soundcloud'});
        url.path('v1','endpoint').should.equal('endpoint.json');
    });
    it('endpoint', function () {
        var url = new Url({name:'facebook'});
        url.path('v1','endpoint').should.equal('endpoint');
    });
});

describe('api', function () {
    it('skip on missing api options key', function () {
        var provider = {name:'google',apis:providers.google.api};
        var url = new Url(provider);
        should.equal(url.api('endpoint',{}), undefined);
    });
    it('skip on missing api ctor key', function () {
        var provider = {name:'google',apis:providers.google.api};
        var url = new Url(provider);
        should.equal(url.api('endpoint',{}), undefined);
    });
    it('skip on non existing api name', function () {
        var provider = {name:'google',api:'yahoo',apis:providers.google.api};
        var url = new Url(provider);
        should.equal(url.api('endpoint',{}), undefined);
    });
    it('set api name in options', function () {
        var provider = {name:'google',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{api:'plus'}).should.equal('plus/v1/endpoint');
    });
    it('set api name in ctor', function () {
        var provider = {name:'google',api:'plus',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{}).should.equal('plus/v1/endpoint');
    });
    it('set version in options', function () {
        var provider = {name:'google',api:'plus',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{version:'1.1'}).should.equal('plus/1.1/endpoint');
    });
    it('set version in ctor', function () {
        var provider = {name:'google',version:'2.2',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{api:'plus'}).should.equal('plus/2.2/endpoint');
    });
    it('use api version from config', function () {
        var provider = {name:'google',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{api:'plus'}).should.equal('plus/v1/endpoint');
    });
    it('use api path key', function () {
        var provider = {name:'google',api:'contacts',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{}).should.equal('m8/feeds/endpoint');
    });
    it('use api name as a path', function () {
        var provider = {name:'google',api:'plus',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{}).should.equal('plus/v1/endpoint');
    });
    it('path/version/endpoint', function () {
        var provider = {name:'google',api:'plus',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{}).should.equal('plus/v1/endpoint');
    });
    it('path/endpoint', function () {
        var provider = {name:'google',api:'contacts',apis:providers.google.api};
        var url = new Url(provider);
        url.api('endpoint',{}).should.equal('m8/feeds/endpoint');
    });
    it('version/endpoint', function () {
        var provider = {name:'yahoo',api:'social',apis:providers.yahoo.api};
        var url = new Url(provider);
        url.api('endpoint',{}).should.equal('v1/endpoint');
    });
    it('path', function () {
        var provider = {name:'flickr',api:'upload',apis:providers.flickr.api};
        var url = new Url(provider);
        url.api('',{}).should.equal('services/upload');
    });
});

describe('create', function () {
    it('return func with check for api', function () {
        var provider = {name:'flickr',path:'services/rest',apis:providers.flickr.api};
        var url = new Url(provider);
        url.create('endpoint',{api:'upload'}).should.equal('services/upload');
        url.create('endpoint',{}).should.equal('services/rest/endpoint');
    });
    it('return func without check for api', function () {
        var provider = {name:'flickr',path:'services/rest'};
        var url = new Url(provider);
        url.create('endpoint',{api:'upload'}).should.equal('services/rest/endpoint');
        url.create('endpoint',{}).should.equal('services/rest/endpoint');
    });
    it('set version in options', function () {
        var provider = {name:'linkedin',version:'v1'};
        var url = new Url(provider);
        url.create('endpoint',{version:'2.2'}).should.equal('2.2/endpoint');
    });
    it('set version in config', function () {
        var provider = {name:'linkedin',version:'v1'};
        var url = new Url(provider);
        url.create('endpoint',{}).should.equal('v1/endpoint');
    });
});

describe('domain', function () {
    it('return func with check for api', function () {
        var provider = {name:'flickr',domain:'https://api.flickr.com',apis:providers.flickr.api};
        var url = new Url(provider);
        url.domain({api:'upload'}).should.equal('https://up.flickr.com');
        url.domain({}).should.equal('https://api.flickr.com');
    });
    it('return func without check for api', function () {
        var provider = {name:'flickr',domain:'https://api.flickr.com'};
        var url = new Url(provider);
        url.domain({api:'upload'}).should.equal('https://api.flickr.com');
        url.domain({}).should.equal('https://api.flickr.com');
    });
});

describe('get', function () {
    it('url', function () {
        var provider = {name:'flickr',path:'services/rest',domain:'https://api.flickr.com'};
        var url = new Url(provider);
        url.get('endpoint').should.equal('https://api.flickr.com/services/rest/endpoint');
    });
});

describe('provider', function () {
    describe('mailchimp', function () {
        it('get data center name from apikey', function () {
            var p = new purest({provider:'mailchimp'});
            p.url.get('endpoint', {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}})
                .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
        });
        it('get data center name from option', function () {
            var p = new purest({provider:'mailchimp'});
            p.url.get('endpoint', {dc:'us2'})
                .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
        });
        it('throw error on missing data center name', function () {
            var p = new purest({provider:'mailchimp'});
            (function () {
                p.url.get('endpoint', {qs:{apikey:'access_token'}});
            }).should.throw('Purest: specify data center to use through the dc option!');
        });
    });
    describe('twitter', function () {
        it('on POST request escape !*()\' (RFC3986 URI symbols) and send them as qs', function () {
            var p = new purest({provider:'twitter'}),
                options = {form:{one:"!*()'",two:2}};
            p.url.get('endpoint', options).should.equal(
                'https://api.twitter.com/1.1/endpoint.json?one=%21%2a%28%29%27&two=2'
            );
            should.not.exist(options.form);
        });
        it('use default url on GET request', function () {
            var p = new purest({provider:'twitter'});
            p.url.get('endpoint').should.equal('https://api.twitter.com/1.1/endpoint.json');
        });
    });
    describe('gmaps', function () {
        it('set json as default return type', function () {
            var p = new purest({provider:'gmaps'});
            p.url.get('geocode').should.equal([p.domain, p.path, 'geocode', 'json'].join('/'));
            p.url.get('directions').should.equal([p.domain, p.path, 'directions', 'json'].join('/'));
            p.url.get('timezone').should.equal([p.domain, p.path, 'timezone', 'json'].join('/'));
            p.url.get('elevation').should.equal([p.domain, p.path, 'elevation', 'json'].join('/'));
            p.url.get('distancematrix').should.equal([p.domain, p.path, 'distancematrix', 'json'].join('/'));
        });
        it('specify return type', function () {
            var p = new purest({provider:'gmaps'});
            p.url.get('geocode/json').should.equal([p.domain, p.path, 'geocode', 'json'].join('/'));
            p.url.get('directions/xml').should.equal([p.domain, p.path, 'directions', 'xml'].join('/'));
        });
    });
});
