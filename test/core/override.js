
var should = require('should');
var Purest = require('../../lib/provider'),
    config = require('../../lib/config');


describe('override', function () {
    describe('flowdock', function () {
        it('bearer token', function () {
            var provider = new Purest({provider:'flowdock'});
            var query = provider.query().auth('0123456789012345678901234567890123456789');
            provider.before.all('endpoint', query._options);
            should.deepEqual(query._options,
                {api:'__default', auth:{bearer:'0123456789012345678901234567890123456789'}});
        });
        it('api token', function () {
            var provider = new Purest({provider:'flowdock'});
            var query = provider.query().auth('0123456789012345678901234567890123');
            provider.before.all('endpoint', query._options);
            should.deepEqual(query._options,
                {api:'__default', auth:{user:'0123456789012345678901234567890123'}});
        });
    });

    describe('google', function () {
        describe('url endpoint', function () {
            it('set json as default return type', function () {
                var provider = new Purest({provider:'google',api:'gmaps'}),
                    config = provider.apis.gmaps;
                ['geocode', 'directions', 'timezone', 'elevation', 'distancematrix'].forEach(function (endpoint) {
                    provider.url.get(endpoint,{})
                        .should.equal([
                            config.domain,
                            config.path.replace('{endpoint}', endpoint), 'json'
                        ].join('/'));
                });
            });
            it('specify return type', function () {
                var provider = new Purest({provider:'google',api:'gmaps'}),
                    config = provider.apis.gmaps;
                provider.url.get('geocode/json',{})
                    .should.equal([
                        config.domain,
                        config.path.replace('{endpoint}','geocode'),
                    'json'].join('/'));
                provider.url.get('geocode/xml',{})
                    .should.equal([
                        config.domain,
                        config.path.replace('{endpoint}','geocode'),
                        'xml'].join('/'));
            });
        });
    });

    describe('hackpad', function () {
        it('0-legged OAuth', function () {
            var provider = new Purest({provider:'hackpad', key:'key', secret:'secret'});
            var query = provider.query();
            provider.options.oauth(query._options);
            should.deepEqual(query._options,
                {api:'__default', oauth:{consumer_key:'key', consumer_secret:'secret'}});
        });
    });

    describe('imgur', function () {
        it('use apikey', function () {
            var provider = new Purest({provider:'imgur'});
            var query = provider.query()
                .headers({'User-Agent':'Purest'}).auth('b13e265d3ct1de7');
            provider.before.all('endpoint', query._options);
            should.deepEqual(query._options,
                {api:'__default', headers:{
                    'User-Agent':'Purest',
                    Authorization:'Client-ID b13e265d3ct1de7'
                }});
        });
        it('use token', function () {
            var provider = new Purest({provider:'imgur'});
            var query = provider.query().auth('c47d19b1183g4207d7287b75g4ee63g6f6c9e3a');
            provider.before.all('endpoint', query._options);
            should.deepEqual(query._options,
                {api:'__default', auth:{
                    bearer:'c47d19b1183g4207d7287b75g4ee63g6f6c9e3a'}});
        });
    });

    describe('linkedin', function () {
        describe('before post', function () {
            it('send form data as entity body', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, form:{a:1}, oauth:{token:'t', secret:'ts'}};
                p.before.post('endpoint', options);
                options.body.should.equal('{"a":1}');
                should.not.exist(options.form);
            });
        });
    });

    describe('mailchimp', function () {
        describe('url domain', function () {
            it('get data center name from apikey', function () {
                var provider = new Purest({provider:'mailchimp'});
                provider.url.get('endpoint', {qs:{apikey:'546ae091fd5ytr3a611d3hj527ad2940-us2'}})
                    .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
            });
            it('get data center name from option', function () {
                var provider = new Purest({provider:'mailchimp'});
                provider.url.get('endpoint', {domain:'us2'})
                    .should.equal('https://us2.api.mailchimp.com/2.0/endpoint.json');
            });
            it('throw error on missing data center name', function () {
                var provider = new Purest({provider:'mailchimp'});
                (function () {
                    provider.url.get('endpoint', {qs:{apikey:'access_token'}});
                }).should.throw('Purest: specify domain name to use through the domain option!');
            });
        });
    });

    describe('openstreetmap', function () {
        it('use basic auth', function () {
            var provider = new Purest({provider:'openstreetmap', key:'key', secret:'secret'});
            var query = provider.query().auth('user','pass');
            provider.options.oauth(query._options);
            provider.before.all('endpoint', query._options);
            should.deepEqual(query._options,
                {api:'__default', auth:{user:'user', pass:'pass'}});
        });
        it('use oauth', function () {
            var provider = new Purest({provider:'openstreetmap', key:'key', secret:'secret'});
            var query = provider.query().auth('0123456789012345678901234567890','pass');
            provider.options.oauth(query._options);
            provider.before.all('endpoint', query._options);
            should.deepEqual(query._options,
                {api:'__default', oauth:{
                    consumer_key:'key', consumer_secret:'secret',
                    token:'0123456789012345678901234567890', token_secret:'pass'}});
        });
    });

    describe('paypal', function () {
        describe('url domain', function () {
            it('use default domain', function () {
                var provider = new Purest({provider:'paypal', api:'payments'});
                provider.url.get('endpoint', {})
                    .should.equal('https://api.paypal.com/v1/payments/endpoint');
            });
            it('use sandbox domain', function () {
                var provider = new Purest({provider:'paypal', api:'payments'});
                provider.url.get('endpoint', {domain:'sandbox'})
                    .should.equal('https://api.sandbox.paypal.com/v1/payments/endpoint');
            });
        });
    });

    describe('salesforce', function () {
        describe('url domain', function () {
            it('domain option', function () {
                var provider = new Purest({provider:'salesforce'});
                console.log(provider.url.get('endpoint', {domain:'eu3'}));
                provider.url.get('endpoint', {domain:'eu3'})
                    .should.equal('https://eu3.salesforce.com/services/data/v20.0/endpoint');
            });
            it('throw error on missing data center name', function () {
                var provider = new Purest({provider:'salesforce'});
                (function () {
                    provider.url.get('endpoint', {qs:{apikey:'access_token'}});
                }).should.throw('Purest: specify domain name to use through the domain option!');
            });
        });
    });

    describe('twitter', function () {
        describe('url qs', function () {
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
    });
});
