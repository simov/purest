
var purest = require('../../lib/provider');
var providers = require('../../config/providers');


describe('path', function () {
    describe('type', function () {
        it('version/endpoint.json', function () {
            var p = new purest({provider:'twitter'});
            p.createPath('endpoint').should.equal(p.version+'/endpoint.json');
        });
        it('version/endpoint', function () {
            var p = new purest({provider:'linkedin'});
            p.createPath('endpoint').should.equal(p.version+'/endpoint');
        });

        it('api/version/endpoint.json', function () {
            var p = new purest({provider:'stocktwits'});
            p.createPath('endpoint').should.equal('api/'+p.version+'/endpoint.json');
        });
        it('api/version/endpoint', function () {
            var p = new purest({provider:'asana'});
            p.createPath('endpoint').should.equal('api/'+p.version+'/endpoint');
        });
        it('api/endpoint', function () {
            var p = new purest({provider:'slack'});
            p.createPath('endpoint').should.equal('api/endpoint');
        });

        it('endpoint.json', function () {
            var p = new purest({provider:'soundcloud'});
            p.createPath('endpoint').should.equal('endpoint.json');
        });
        it('endpoint', function () {
            var p = new purest({provider:'facebook'});
            p.createPath('endpoint').should.equal('endpoint');
        });
    });
    
    describe('options', function () {
        it('set version through options', function () {
            var p = new purest({provider:'linkedin'});
            p.createPath('endpoint',{version:'2.2'}).should.equal('2.2/endpoint');
        });
    });

    describe('same domain', function () {
        it('apiname/version/endpoint - apiname set in the ctor', function () {
            var apis = ['plus', 'youtube', 'drive', 'freebase', 'pagespeedonline'],
                google = providers.google;
            for (var i=0; i < apis.length; i++) {
                var p = new purest({provider:'google', api:apis[i]});
                p.createPath('endpoint',{})
                    .should.equal(apis[i]+'/'+google.api[apis[i]].version+'/endpoint');
            }
        });
        it('apiname/version/endpoint - api set through options', function () {
            var apis = ['plus', 'youtube', 'drive', 'freebase', 'pagespeedonline'],
                google = providers.google;
            for (var i=0; i < apis.length; i++) {
                var p = new purest({provider:'google'});
                p.createPath('endpoint',{api:apis[i]})
                    .should.equal(apis[i]+'/'+google.api[apis[i]].version+'/endpoint');
            }
        });
        it('set version through options', function () {
            var p = new purest({provider:'google'});
            p.createPath('api/method',{api:'freebase', version:'4.4'})
                .should.equal('freebase/4.4/api/method');
        });
    });

    describe('different domains', function () {
        it('yahoo', function () {
            var apis = Object.keys(providers.yahoo.api);
            for (var i=0; i < apis.length; i++) {
                var p = new purest({provider:'yahoo', api:apis[i]});
                p.api.should.equal(apis[i]);
                switch (p.api) {
                    case 'geo': p.url('endpoint', {})
                        .should.equal('http://where.yahooapis.com/v1/endpoint'); break;
                    case 'social': p.url('endpoint', {})
                        .should.equal('https://social.yahooapis.com/v1/endpoint'); break;
                    case 'yql': p.url('endpoint', {})
                        .should.equal('https://query.yahooapis.com/v1/endpoint'); break;
                }
            }
        });
        it('google', function () {
            var apis = Object.keys(providers.google.api);
            for (var i=0; i < apis.length; i++) {
                var p = new purest({provider:'google', api:apis[i]});
                p.api.should.equal(apis[i]);
                if (/contacts/.test(p.api)) {
                    p.url('endpoint', {})
                        .should.match(/^https:\/\/www.google.com/);
                } else {
                    p.url('endpoint', {})
                        .should.match(/^https:\/\/www.googleapis.com/);
                }
            }
        });
        it('flickr', function () {
            var apis = Object.keys(providers.flickr.api);
            for (var i=0; i < apis.length; i++) {
                var p = new purest({provider:'flickr', api:apis[i]});
                p.api.should.equal(apis[i]);
                if (/(upload|replace)/.test(p.api)) {
                    p.url('endpoint', {})
                        .should.match(/^https:\/\/up.flickr.com/);
                } else {
                    p.url('endpoint', {})
                        .should.match(/^https:\/\/api.flickr.com/);
                }
            }
        });
    });

    describe('different path', function () {
        it('flickr', function () {
            var apis = Object.keys(providers.flickr.api);
            for (var i=0; i < apis.length; i++) {
                var p = new purest({provider:'flickr', api:apis[i]});
                p.api.should.equal(apis[i]);
                switch (p.api) {
                    case 'upload': p.url('endpoint', {})
                        .should.equal('https://up.flickr.com/services/upload'); break;
                    case 'replace': p.url('endpoint', {})
                        .should.equal('https://up.flickr.com/services/replace'); break;
                }
            }
            var p = new purest({provider:'flickr'});
            p.domain.should.equal('https://api.flickr.com');
            p.url('endpoint', {})
                .should.equal('https://api.flickr.com/services/rest');
        });
    });

    describe('url', function () {
        it('get domain from provider.api.name.domain', function () {
            var p = new purest({provider:'google'});
            p.url('api/method', {api:'plus'})
                .should.equal('https://www.googleapis.com/plus/v1/api/method')
        });
        it('get domain from provider.domain', function () {
            var p = new purest({provider:'google'});
            p.url('api/method', {api:'contacts'})
                .should.equal('https://www.google.com/m8/feeds/api/method');
        });
        it('get mailchimp data centre through apikey', function () {
            var p = new purest({provider:'mailchimp'});
            p.url('api/method', {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}})
                .should.equal('https://us2.api.mailchimp.com/2.0/api/method.json');
        });
        it('get mailchimp data centre through option', function () {
            var p = new purest({provider:'mailchimp'});
            p.url('api/method', {dc:'us2'})
                .should.equal('https://us2.api.mailchimp.com/2.0/api/method.json');
        });
        it('throw error on missing mailchimp data centre', function () {
            var p = new purest({provider:'mailchimp'});
            (function () {
                p.url('api/method', {qs:{apikey:'access_token'}});
            }).should.throw('purest: specify data centre to use through the dc option!');
        });
    });
});
