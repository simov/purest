
var should = require('should');
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
    
    describe('version', function () {
        it('set version through config', function () {
            var p = new purest({provider:'linkedin'});
            p.createPath('endpoint').should.equal('v1/endpoint');
        });
        it('set version through options', function () {
            var p = new purest({provider:'linkedin'});
            p.createPath('endpoint',{version:'2.2'}).should.equal('2.2/endpoint');
        });
    });

    describe('sub api', function () {
        describe('core', function () {
            it('api set through ctor', function () {
                var p = new purest({provider:'google', api:'plus'});
                p.createPath('endpoint').should.equal('plus/v1/endpoint');
            });
            it('api set through options', function () {
                var p = new purest({provider:'google'});
                p.createPath('endpoint', {api:'plus'}).should.equal('plus/v1/endpoint');
            });
            it('api version set through options', function () {
                var p = new purest({provider:'google'});
                p.createPath('endpoint', {api:'plus', version:'v2'})
                    .should.equal('plus/v2/endpoint');
            });
            it('api name used as api path', function () {
                var p = new purest({provider:'google'});
                p.createPath('endpoint', {api:'plus'})
                    .should.equal('plus/v1/endpoint');
            });
            it('api path set explicitly', function () {
                var p = new purest({provider:'google'});
                p.createPath('endpoint', {api:'contacts'})
                    .should.equal('m8/feeds/endpoint');
            });
        });
        describe('flickr', function () {
            it('provider path', function () {
                var p = new purest({provider:'flickr'});
                p.createPath('endpoint').should.equal('services/rest');
            });
            it('api path', function () {
                var p = new purest({provider:'flickr'});
                p.createPath('endpoint', {api:'upload'}).should.equal('services/upload');
                p.createPath('endpoint', {api:'replace'}).should.equal('services/replace');
            });
        });
        describe('google', function () {
            it('apiname|apipath/apiver/endpoing', function () {
                var p = new purest({provider:'google'});
                for (var name in p.apis) {
                    if (name == 'contacts') continue;
                    p.createPath('endpoint',{api:name})
                        .should.equal(name+'/'+p.apis[name].version+'/endpoint');
                }
            });
            it('apiname|apipath/endpoing', function () {
                var p = new purest({provider:'google'});
                p.createPath('endpoint',{api:'contacts'})
                        .should.equal('m8/feeds/endpoint');
            });
        });
        describe('yahoo', function () {
            it('apiversion/endpoint', function () {
                var p = new purest({provider:'yahoo'});
                for (var name in p.apis) {
                    p.createPath('endpoint',{api:name})
                        .should.equal(p.apis[name].version+'/endpoint');
                }
            });
        });
    });
});

describe('url', function () {
    describe('core', function () {
        it('provider domain', function () {
            var p = new purest({provider:'facebook'});
            p.url('endpoint').should.equal('https://graph.facebook.com/endpoint');
        });
        it('api domain', function () {
            var p = new purest({provider:'yahoo', api:'geo'});
            p.url('endpoint').should.equal('http://where.yahooapis.com/v1/endpoint');
        });
        it('google', function () {
            var p = new purest({provider:'google'});
            for (var name in p.apis) {
                if (name == 'contacts') {
                    p.url('endpoint',{api:name}).should.equal(
                        ['https://www.google.com', 'm8/feeds', 'endpoint'].join('/')
                    );
                    continue;
                }
                p.url('endpoint',{api:name}).should.equal(
                    ['https://www.googleapis.com', name, p.apis[name].version, 'endpoint']
                    .join('/')
                );
            }
        });
        it('yahoo', function () {
            var p = new purest({provider:'yahoo'});
            for (var name in p.apis) {
                var api = p.apis[name];
                p.url('endpoint',{api:name}).should.equal(
                    [api.domain, api.version, 'endpoint'].join('/')
                );
            }
        });
        it('flickr', function () {
            var p = new purest({provider:'flickr'});
            for (var name in p.apis) {
                var api = p.apis[name];
                p.url('',{api:name}).should.equal(
                    [api.domain, api.path].join('/')
                );
            }
            p.url('').should.equal([p.domain, p.path].join('/'));
        });
    });
    describe('mailchimp', function () {
        it('get data center name from apikey', function () {
            var p = new purest({provider:'mailchimp'});
            p.url('endpoint', {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}})
                .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
        });
        it('get data center name from option', function () {
            var p = new purest({provider:'mailchimp'});
            p.url('endpoint', {dc:'us2'})
                .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
        });
        it('throw error on missing data center name', function () {
            var p = new purest({provider:'mailchimp'});
            (function () {
                p.url('endpoint', {qs:{apikey:'access_token'}});
            }).should.throw('Purest: specify data center to use through the dc option!');
        });
    });
    describe('twitter', function () {
        it('on POST request escape !*()\' (RFC3986 URI symbols) and send them as qs', function () {
            var p = new purest({provider:'twitter'}),
                options = {form:{one:"!*()'",two:2}};
            p.url('endpoint', options).should.equal(
                'https://api.twitter.com/1.1/endpoint.json?one=%21%2a%28%29%27&two=2'
            );
            should.not.exist(options.form);
        });
        it('use default url on GET request', function () {
            var p = new purest({provider:'twitter'});
            p.url('endpoint').should.equal('https://api.twitter.com/1.1/endpoint.json');
        });
    });
    describe('gmaps', function () {
        it('set json as default return type', function () {
            var p = new purest({provider:'gmaps'});
            p.url('geocode').should.equal([p.domain, p.path, 'geocode', 'json'].join('/'));
            p.url('directions').should.equal([p.domain, p.path, 'directions', 'json'].join('/'));
            p.url('timezone').should.equal([p.domain, p.path, 'timezone', 'json'].join('/'));
            p.url('elevation').should.equal([p.domain, p.path, 'elevation', 'json'].join('/'));
            p.url('distancematrix').should.equal([p.domain, p.path, 'distancematrix', 'json'].join('/'));
        });
        it('specify return type', function () {
            var p = new purest({provider:'gmaps'});
            p.url('geocode/json').should.equal([p.domain, p.path, 'geocode', 'json'].join('/'));
            p.url('directions/xml').should.equal([p.domain, p.path, 'directions', 'xml'].join('/'));
        });
    });
});
