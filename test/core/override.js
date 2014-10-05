
var should = require('should');
var Purest = require('../../lib/provider'),
    config = require('../../lib/config');


describe('config', function () {
    describe('asana', function () {
        it('tasks\\/.*\\/attachments', function () {
            var p = new Purest({provider:'asana'}),
                endpoints = p.apis.__default.endpoints;
            var options = {upload:'cat.jpg', form:{file:'..'}};
            should.deepEqual(
                config.options('tasks/id/attachments', options, 'post', endpoints),
                { multipart: 'file', upload: 'cat.jpg', form: { file: '..' } }
            );
        });
    });
    describe('box', function () {
        describe('__default', function () {
            it('files\\/\\d+\\/content', function () {
                var p = new Purest({provider:'box'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('files/123/content', options, 'get', endpoints),
                    { encoding: null }
                );
            });
        });
        describe('upload', function () {
            it('files\\/(?:.*\\/)?content', function () {
                var p = new Purest({provider:'box', api:'upload'}),
                    endpoints = p.apis.upload.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('files/content', options, 'post', endpoints),
                    { multipart: 'filename' }
                );
                var options = {};
                should.deepEqual(
                    config.options('files/ab12/content', options, 'post', endpoints),
                    { multipart: 'filename' }
                );
            });
        });
        describe('view', function () {
            it('documents\\/.+\\/content\\.(?:pdf|zip)', function () {
                var p = new Purest({provider:'box', api:'upload'}),
                    endpoints = p.apis.upload.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('files/ab12/content', options, 'post', endpoints),
                    { multipart: 'filename' }
                );
            });
        });
        describe('view-upload', function () {
            it('documents', function () {
                var p = new Purest({provider:'box', api:'view-upload'}),
                    endpoints = p.apis['view-upload'].endpoints;
                var options = {};
                should.deepEqual(
                    config.options('documents', options, 'post', endpoints),
                        {multipart:'file'}
                );
            });
        });
        describe.skip('download', function () {
            
        });
    });
    describe('dropbox', function () {
        describe('files', function () {
            it('* get', function () {
                var p = new Purest({provider:'dropbox', api:'files'}),
                    endpoints = p.apis.files.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('endpoint', options, 'get', endpoints),
                    {encoding:null}
                );
            });
        });
    });
    describe('facebook', function () {
        describe('__default', function () {
            it('me/photos', function () {
                var p = new Purest({provider:'facebook'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('me/photos', options, 'post', endpoints),
                    {multipart:'source'}
                );
            });
        });
    });
    describe('flickr', function () {
        describe('__default', function () {
            it('* all', function () {
                var p = new Purest({provider:'flickr'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('', options, 'get', endpoints),
                    {qs:{format:'json'}}
                );
            });
        });
        describe('upload', function () {
            it('* post', function () {
                var p = new Purest({provider:'flickr', api:'upload'}),
                    endpoints = p.apis.upload.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('', options, 'post', endpoints),
                    {multipart:'photo'}
                );
            });
        });
        describe('replace', function () {
            it('* post', function () {
                var p = new Purest({provider:'flickr', api:'replace'}),
                    endpoints = p.apis.upload.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('', options, 'post', endpoints),
                    {multipart:'photo'}
                );
            });
        });
    });
    describe('foursquare', function () {
        describe('__default', function () {
            it('users/self/update', function () {
                var p = new Purest({provider:'foursquare'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('users/self/update', options, 'post', endpoints),
                    {multipart:'photo'}
                );
            });
        });
    });
    describe('google', function () {
        describe('gmaps', function () {
            it('streetview', function () {
                var p = new Purest({provider:'google',api:'gmaps'}),
                    endpoints = p.apis.gmaps.endpoints
                var options = {};
                should.deepEqual(
                    config.options('streetview', options, 'get', endpoints),
                    {encoding:null}
                );
            });
            it('staticmap', function () {
                var p = new Purest({provider:'google',api:'gmaps'}),
                    endpoints = p.apis.gmaps.endpoints
                var options = {};
                should.deepEqual(
                    config.options('staticmap', options, 'get', endpoints),
                    {encoding:null}
                );
            });
        });
        describe('contacts', function () {
            it('* all', function () {
                var p = new Purest({provider:'google', api:'contacts'}),
                    endpoints = p.apis.contacts.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('endpoint', options, 'get', endpoints),
                    { headers: { 'GData-Version': '3.0' }, qs: { alt: 'json' } }
                );
            });
        });
    });
    describe('linkedin', function () {
        describe('__default', function () {
            it('* all', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('endpoint', options, 'get', endpoints),
                    { headers: { 'x-li-format': 'json' } }
                );
            });
        });
    });
    describe('mailgun', function () {
        describe('__default', function () {
            it('.*\\/messages', function () {
                var p = new Purest({provider:'mailgun'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('ab12/messages', options, 'post', endpoints),
                    { multipart: 'attachment' }
                );
            });
        });
    });
    describe('sendgrid', function () {
        describe('__default', function () {
            it('mail.send', function () {
                var p = new Purest({provider:'sendgrid'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('mail.send', options, 'post', endpoints),
                    { multipart: 'files' }
                );
            });
        });
    });
    describe('slack', function () {
        describe('__default', function () {
            it('files.upload', function () {
                var p = new Purest({provider:'slack'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('files.upload', options, 'post', endpoints),
                    { multipart: 'file' }
                );
            });
        });
    });
    describe('soundcloud', function () {
        describe('__default', function () {
            it('tracks', function () {
                var p = new Purest({provider:'soundcloud'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('tracks', options, 'post', endpoints),
                    { multipart: 'track[asset_data]' }
                );
            });
        });
    });
    describe('stackexchange', function () {
        describe('__default', function () {
            it('* all', function () {
                var p = new Purest({provider:'stackexchange'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('endpoint', options, 'get', endpoints),
                    { encoding: null }
                );
            });
        });
    });
    describe('stocktwits', function () {
        describe('__default', function () {
            it('messages/create', function () {
                var p = new Purest({provider:'stocktwits'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('messages/create', options, 'post', endpoints),
                    { multipart: 'chart' }
                );
            });
        });
    });
    describe('twitter', function () {
        describe('__default', function () {
            it('statuses/update_with_media', function () {
                var p = new Purest({provider:'twitter'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('statuses/update_with_media', options, 'post', endpoints),
                    { multipart: 'media[]' }
                );
            });
        });
    });
    describe('wikimapia', function () {
        describe('__default', function () {
            it('* all', function () {
                var p = new Purest({provider:'wikimapia'}),
                    endpoints = p.apis.__default.endpoints;
                var options = {};
                should.deepEqual(
                    config.options('', options, 'get', endpoints),
                    { qs: { format: 'json' } }
                );
            });
        });
    });
});


describe('override', function () {
    describe('flickr', function () {
        describe('before multipart', function () {
            it('generate OAuth params and add them to form body', function () {
                var p = new Purest({provider:'flickr', key:'k', secret:'s'});
                var options = {upload:'cat.jpg', api:'upload', headers:{},
                    oauth:{token:'t', secret:'s'}, form:{photo:''}, json:true};
                p.before.multipart('', options);
                options.form.oauth_consumer_key.should.equal('k');
                options.form.oauth_nonce.should.be.instanceOf(String);
                options.form.oauth_signature_method.should.equal('HMAC-SHA1');
                options.form.oauth_timestamp.should.be.instanceOf(String);
                options.form.oauth_token.should.equal('t');
                options.form.oauth_version.should.equal('1.0');
                options.form.oauth_signature.should.be.instanceOf(String);
                options.form.photo.should.equal('');
            });
        });
        describe('after multipart', function () {
            it('remove oauth options key', function () {
                var p = new Purest({provider:'flickr', key:'k', secret:'s'});
                var options = {upload:'cat.jpg', headers:{},
                    oauth:{token:'t', secret:'s'}, form:{photo:''}, json:true};
                p.after.multipart('', options);
                should.not.exist(options.oauth);
            });
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
    });

    describe('openstreetmap', function () {
        it('change auth method', function () {
            var provider = new Purest({provider:'openstreetmap', key:'key', secret:'secret'});
            provider.query().auth('user','pass');
            provider.options.oauth(provider._query._options);
            provider.before.get('endpoint', provider._query._options);
            should.deepEqual(provider._query._options,
                {api:'__default', auth:{user:'user', pass:'pass'}});
        });
        it('keep auth method', function () {
            var provider = new Purest({provider:'openstreetmap', key:'key', secret:'secret'});
            provider.query().auth('0123456789012345678901234567890','pass');
            provider.options.oauth(provider._query._options);
            provider.before.get('endpoint', provider._query._options);
            should.deepEqual(provider._query._options,
                {api:'__default', oauth:{
                    consumer_key:'key', consumer_secret:'secret',
                    token:'0123456789012345678901234567890', token_secret:'pass'}});
        });
    });

    describe('sendgrid', function () {
        describe('multipart file', function () {
            it('customize content-disposition', function () {
                var p = new Purest({provider:'sendgrid'});
                should.deepEqual(p.multipart.file('key','cat.png','data'), {
                    'content-disposition': 'form-data; name="key[cat.png]"; filename="cat.png"',
                    'content-type': 'image/png',
                    'content-transfer-encoding': 'binary',
                    body: 'data'
                });
            });
        });
    });

    describe('soundcloud', function () {
        describe('after multipart', function () {
            it('remove multipart content-type', function () {
                var p = new Purest({provider:'soundcloud'});
                var options = {
                    upload:'beep.mp3',
                    form:{'track[title]':'title', 'track[asset_data]':'...'}
                };

                options = config.options('tracks', options, 'post', p.apis.__default.endpoints);
                options.multipart = p.multipart.create('tracks', options);
                should.deepEqual(options.multipart, [{
                    'content-disposition': 'form-data; name="track[title]"',
                    'content-type': 'text/plain',
                    'content-transfer-encoding': 'utf8',
                    body: 'title' },
                    { 'content-disposition': 'form-data; name="track[asset_data]"; filename="beep.mp3"',
                    'content-type': 'audio/mpeg',
                    'content-transfer-encoding': 'binary',
                    body: '...'
                }]);

                p.after.multipart('tracks', options);
                should.deepEqual(options.multipart, [{
                    'content-disposition': 'form-data; name="track[title]"',
                    'content-transfer-encoding': 'utf8',
                    body: 'title' },
                    { 'content-disposition': 'form-data; name="track[asset_data]"; filename="beep.mp3"',
                    'content-transfer-encoding': 'binary',
                    body: '...'
                }]);
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
