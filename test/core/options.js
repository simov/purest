
var should = require('should');
var purest = require('../../lib/provider'),
    Options = require('../../lib/options');


describe('options', function () {

    describe('get', function () {
        describe('github', function () {
            it('user defined User-Agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{'User-Agent':'AwesomeApp'}};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {headers:{'User-Agent':'AwesomeApp'}});
            });
            it('set User-Agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{}};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {headers:{'User-Agent':'Purest'}});
            });
        });
        describe('gmaps', function () {
            it('set binary encoding for certain APIs', function () {
                var p = new purest({provider:'gmaps'});
                var options = {};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {});
                p.options.get.call(p, 'streetview', options);
                should.deepEqual(options, {encoding:null});
                options = {};
                p.options.get.call(p, 'staticmap', options);
                should.deepEqual(options, {encoding:null});
            });
        });
        describe('google', function () {
            describe('contacts', function () {
                it('set GData-Version to 3.0 by default', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.headers['GData-Version'].should.equal('3.0');
                });
                it('user defined GData-Version', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{'GData-Version':'2.0'}, qs:{}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.headers['GData-Version'].should.equal('2.0');
                });
                it('return json by default', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.qs.alt.should.equal('json');
                });
                it('specify return type', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{alt:'rss'}, api:'contacts'};
                    p.options.get.call(p, 'endpoint', options);
                    options.qs.alt.should.equal('rss');
                });
            });
        });
        describe('linkedin', function () {
            it('set x-li-format to json by default', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, oauth:{token:'t', secret:'ts'}};
                p.options.get.call(p, 'endpoint', options);
                options.headers['x-li-format'].should.equal('json');
            });
            it('user defined x-li-format', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{'x-li-format':'jsonp'}, oauth:{token:'t', secret:'ts'}};
                p.options.get.call(p, 'endpoint', options);
                options.headers['x-li-format'].should.equal('jsonp');
            });
        });
        describe('stackexchange', function () {
            it('set request encoding to binary', function () {
                var p = new purest({provider:'stackexchange'});
                var options = {};
                p.options.get.call(p, 'endpoint', options);
                should.deepEqual(options, {encoding:null});
            });
        });
    });

    describe('post', function () {
        describe('github', function () {
            it('user defined User-Agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{'User-Agent':'AwesomeApp'}};
                p.options.post.call(p, 'endpoint', options);
                should.deepEqual(options, {headers:{'User-Agent':'AwesomeApp'}});
            });
            it('set User-Agent headers', function () {
                var p = new purest({provider:'github'});
                var options = {headers:{}};
                p.options.post.call(p, 'endpoint', options);
                should.deepEqual(options, {headers:{'User-Agent':'Purest'}});
            });
        });
        describe('google', function () {
            describe('contacts', function () {
                it('set GData-Version to 3.0 by default', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.options.post.call(p, 'endpoint', options);
                    options.headers['GData-Version'].should.equal('3.0');
                });
                it('user defined GData-Version', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{'GData-Version':'2.0'}, qs:{}, api:'contacts'};
                    p.options.post.call(p, 'endpoint', options);
                    options.headers['GData-Version'].should.equal('2.0');
                });
                it('return json by default', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.options.post.call(p, 'endpoint', options);
                    options.qs.alt.should.equal('json');
                });
                it('specify return type', function () {
                    var p = new purest({provider:'google'});
                    var options = {headers:{}, qs:{alt:'rss'}, api:'contacts'};
                    p.options.post.call(p, 'endpoint', options);
                    options.qs.alt.should.equal('rss');
                });
            });
        });
        describe('linkedin', function () {
            it('set x-li-format to json by default', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, oauth:{token:'t', secret:'ts'}};
                p.options.post.call(p, 'endpoint', options);
                options.headers['x-li-format'].should.equal('json');
            });
            it('user defined x-li-format', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{'x-li-format':'jsonp'}, oauth:{token:'t', secret:'ts'}};
                p.options.post.call(p, 'endpoint', options);
                options.headers['x-li-format'].should.equal('jsonp');
            });
            it('send form data as entity body', function () {
                var p = new purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, form:{a:1}, oauth:{token:'t', secret:'ts'}};
                p.options.post.call(p, 'endpoint', options);
                options.body.should.equal('{"a":1}');
                should.not.exist(options.form);
            });
        });
        describe('stackexchange', function () {
            it('set request encoding to binary', function () {
                var p = new purest({provider:'stackexchange'});
                var options = {};
                p.options.post.call(p, 'endpoint', options);
                should.deepEqual(options, {encoding:null});
            });
        });
    });

    describe('oauth', function () {
        it('throw error on missing credentials', function () {
            (function () {
                var p = new purest({provider:'twitter', secret:'s'});
                p.options.oauth.call(p, {token:'t', secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var p = new purest({provider:'twitter', key:'k'});
                p.options.oauth.call(p, {token:'t', secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var p = new purest({provider:'twitter', key:'k', secret:'s'});
                p.options.oauth.call(p, {secret:'ts'});
            }).should.throw('Missing OAuth credentials!');
            (function () {
                var p = new purest({provider:'twitter', key:'k', secret:'s'});
                p.options.oauth.call(p, {token:'ts'});
            }).should.throw('Missing OAuth credentials!');
        });
        it('use consumer key/secret provided from the ctor', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{token:'t', secret:'ts'}};
            p.options.oauth.call(p, options);
            options.oauth.consumer_key.should.equal('k');
            options.oauth.consumer_secret.should.equal('s');
        });
        it('use consumer key/secret provided as parameters', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{consumer_key:'ck', consumer_secret:'cs', token:'t', secret:'s'}};
            p.options.oauth.call(p, options);
            options.oauth.consumer_key.should.equal('ck');
            options.oauth.consumer_secret.should.equal('cs');
        });
        it('set user token/secret', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{token:'t', token_secret:'ts'}};
            p.options.oauth.call(p, options);
            options.oauth.token.should.equal('t');
            options.oauth.token_secret.should.equal('ts');
        });
        it('set user token/secret through token_secret shortcut', function () {
            var p = new purest({provider:'twitter', key:'k', secret:'s'}),
                options = {oauth:{token:'t', secret:'ts'}};
            p.options.oauth.call(p, options);
            options.oauth.token.should.equal('t');
            options.oauth.token_secret.should.equal('ts');
        });
    });
    
    describe('upload', function () {
        it('pass on missing upload option', function () {
            var p = new purest({provider:'twitter'});
            var options = {};
            p.options.upload(p, 'endpoint', options);
            should.deepEqual(options, {});
        });
        it('pass on missing upload provider', function () {
            var p = new purest({provider:'coderbits'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'endpoint', options);
            should.deepEqual(options, {upload:'cat.jpg'});
        });
        it('pass on missing upload endpoint', function () {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg'};
            p.options.upload(p, 'upload_image', options);
            should.deepEqual(options, {upload:'cat.jpg'});
        });
        it('set content-type to multipart/form-data', function () {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}};
            p.options.upload(p, 'statuses/update_with_media', options);
            options.headers['content-type'].should.equal('multipart/form-data');
        });
        it('remove form and json options', function () {
            var p = new purest({provider:'twitter'});
            var options = {upload:'cat.jpg', headers:{}, form:{'media[]':''}, json:true};
            p.options.upload(p, 'statuses/update_with_media', options);
            should.not.exist(options.form);
            should.not.exist(options.json);
            should.not.exist(options.upload);
        });
        describe('asana', function () {
            it('match on regex endpoint', function () {
                var p = new purest({provider:'asana'});
                var options = {upload:'cat.jpg', headers:{}, form:{file:''}, json:true};
                p.options.upload(p, 'tasks/id/attachments', options);
                options.headers['content-type'].should.equal('multipart/form-data');
                should.not.exist(options.form);
                should.not.exist(options.json);
                should.not.exist(options.upload);
            });
        });
        describe('sendgrid', function () {
            it('pass on missing files key', function () {
                var p = new purest({provider:'sendgrid'});
                var options = {upload:true, headers:{}, form:{}, json:true};
                p.options.upload(p, 'mail.send', options);
                should.deepEqual(options, {upload:true, headers:{}, form:{}, json:true});
            });
            it('pass on empty files array', function () {
                var p = new purest({provider:'sendgrid'});
                var options = {upload:true, headers:{}, form:{files:[]}, json:true};
                p.options.upload(p, 'mail.send', options);
                should.deepEqual(options, {upload:true, headers:{}, form:{files:[]}, json:true});
            });
            it('match on non empty files array', function () {
                var p = new purest({provider:'sendgrid'});
                var options = {upload:true, headers:{}, form:{files:[{filename:'',content:''}]}, json:true};
                p.options.upload(p, 'mail.send', options);
                options.headers['content-type'].should.equal('multipart/form-data');
                should.not.exist(options.form);
                should.not.exist(options.json);
                should.not.exist(options.upload);
            });
        });
    });
    
    describe('beforeMultipart', function () {
        describe('flickr', function () {
            it('generate OAuth params and add them to form body', function () {
                var p = new purest({provider:'flickr', key:'k', secret:'s'});
                var options = {upload:'cat.jpg', api:'upload', headers:{},
                    oauth:{token:'t', secret:'s'}, form:{photo:''}, json:true};
                p.options.beforeMultipart(p, '', options);
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
    });

    describe('afterMultipart', function () {
        describe('flickr', function () {
            it('remove oauth options key', function () {
                var p = new purest({provider:'flickr', key:'k', secret:'s'});
                var options = {upload:'cat.jpg', headers:{},
                    oauth:{token:'t', secret:'s'}, form:{photo:''}, json:true};
                p.options.afterMultipart(p, '', options);
                should.not.exist(options.oauth);
            });
        });
        describe('soundcloud', function () {
            it('remove multipart content-type', function () {
                var p = new purest({provider:'soundcloud'});
                var options = {upload:'beep.mp3', headers:{},
                    form:{'track[title]':'title', 'track[asset_data]':''}, json:true};

                options.multipart = p.options.multipart(p, 'tracks', options);
                should.deepEqual([{
                    'content-disposition': 'form-data; name="track[title]"',
                    'content-type': 'text/plain',
                    'content-transfer-encoding': 'utf8',
                    body: 'title'}, {
                    'content-disposition': 'form-data; name="track[asset_data]"; filename="beep.mp3"',
                    'content-type': 'audio/mpeg',
                    'content-transfer-encoding': 'binary',
                    body: ''
                }], options.multipart);

                p.options.afterMultipart(p, 'tracks', options);
                should.deepEqual([{
                    'content-disposition': 'form-data; name="track[title]"',
                    'content-transfer-encoding': 'utf8',
                    body: 'title'}, {
                    'content-disposition': 'form-data; name="track[asset_data]"; filename="beep.mp3"',
                    'content-transfer-encoding': 'binary',
                    body: ''
                }], options.multipart);
            });
        });
    });

    describe('multipart', function () {
        it('generate multipart/form-data', function () {
            var p = new purest({provider:'twitter'});
            var options =
                {upload:'cat.jpg', headers:{}, form:{'media[]':'...', status:'tweet'}};
            p.options.upload(p, 'statuses/update_with_media', options);
            should.deepEqual(options.multipart, [{
                'content-disposition': 'form-data; name="media[]"; filename="cat.jpg"',
                'content-type': 'image/jpeg',
                'content-transfer-encoding': 'binary',
                body: '...'}, {
                'content-disposition': 'form-data; name="status"',
                'content-type': 'text/plain',
                'content-transfer-encoding': 'utf8',
                body: 'tweet'}
            ]);
        });
        describe('sendgrid', function () {
            it('string text key, array text key, array file key', function () {
                var p = new purest({provider:'sendgrid'});
                var options = {
                    upload:true, headers:{},
                    form:{
                        from:'purest@email.com',
                        to:['a@email.com','b@email.com'],
                        files:[
                            {filename:'file1.png',content:'content1'},
                            {filename:'file2.mp3',content:'content2'}
                        ]
                    },
                    json:true
                };
                p.options.upload(p, 'mail.send', options);
                should.deepEqual(options.multipart, [{
                    'content-disposition': 'form-data; name="from"',
                    'content-type': 'text/plain',
                    'content-transfer-encoding': 'utf8',
                    body: 'purest@email.com' }, {
                    'content-disposition': 'form-data; name="to"',
                    'content-type': 'text/plain',
                    'content-transfer-encoding': 'utf8',
                    body: 'a@email.com' }, {
                    'content-disposition': 'form-data; name="to"',
                    'content-type': 'text/plain',
                    'content-transfer-encoding': 'utf8',
                    body: 'b@email.com' }, {
                    'content-disposition': 'form-data; name="files[file1.png]"; filename="file1.png"',
                    'content-type': 'image/png',
                    'content-transfer-encoding': 'binary',
                    body: 'content1' }, {
                    'content-disposition': 'form-data; name="files[file2.mp3]"; filename="file2.mp3"',
                    'content-type': 'audio/mpeg',
                    'content-transfer-encoding': 'binary',
                    body: 'content2' }
                ]);
            });
        });
    });
});
