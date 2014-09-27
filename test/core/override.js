
var should = require('should');
var Purest = require('../../lib/provider');


describe('override', function () {
    describe('before get', function () {
        describe('dropbox', function () {
            it('set request encoding to binary on files api', function () {
                var p = new Purest({provider:'dropbox'});
                var options = {api:'files'};
                p.before.get('endpoint', options);
                should.deepEqual(options, {api:'files',encoding:null});
            });
        });
        describe('google', function () {
            describe('contacts', function () {
                it('set GData-Version to 3.0 by default', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.before.get('endpoint', options);
                    options.headers['GData-Version'].should.equal('3.0');
                });
                it('user defined GData-Version', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{'GData-Version':'2.0'}, qs:{}, api:'contacts'};
                    p.before.get('endpoint', options);
                    options.headers['GData-Version'].should.equal('2.0');
                });
                it('return json by default', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.before.get('endpoint', options);
                    options.qs.alt.should.equal('json');
                });
                it('specify return type', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{}, qs:{alt:'rss'}, api:'contacts'};
                    p.before.get('endpoint', options);
                    options.qs.alt.should.equal('rss');
                });
            });
            describe('gmaps', function () {
                it('set binary encoding for certain APIs', function () {
                    var p = new Purest({provider:'google',api:'gmaps'});
                    var options = {};
                    p.before.get('endpoint', options);
                    should.deepEqual(options, {});
                    
                    options = {};
                    p.before.get('streetview', options);
                    should.deepEqual(options, {encoding:null});

                    options = {};
                    p.before.get('staticmap', options);
                    should.deepEqual(options, {encoding:null});
                });
            });
        });
        describe('linkedin', function () {
            it('set x-li-format to json by default', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, oauth:{token:'t', secret:'ts'}};
                p.before.get('endpoint', options);
                options.headers['x-li-format'].should.equal('json');
            });
            it('user defined x-li-format', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{'x-li-format':'jsonp'}, oauth:{token:'t', secret:'ts'}};
                p.before.get('endpoint', options);
                options.headers['x-li-format'].should.equal('jsonp');
            });
        });
        describe('stackexchange', function () {
            it('set request encoding to binary', function () {
                var p = new Purest({provider:'stackexchange'});
                var options = {};
                p.before.get('endpoint', options);
                should.deepEqual(options, {encoding:null});
            });
        });
    });

    describe('before post', function () {
        describe('google', function () {
            describe('contacts', function () {
                it('set GData-Version to 3.0 by default', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.before.post('endpoint', options);
                    options.headers['GData-Version'].should.equal('3.0');
                });
                it('user defined GData-Version', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{'GData-Version':'2.0'}, qs:{}, api:'contacts'};
                    p.before.post('endpoint', options);
                    options.headers['GData-Version'].should.equal('2.0');
                });
                it('return json by default', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{}, qs:{}, api:'contacts'};
                    p.before.post('endpoint', options);
                    options.qs.alt.should.equal('json');
                });
                it('specify return type', function () {
                    var p = new Purest({provider:'google'});
                    var options = {headers:{}, qs:{alt:'rss'}, api:'contacts'};
                    p.before.post('endpoint', options);
                    options.qs.alt.should.equal('rss');
                });
            });
        });
        describe('linkedin', function () {
            it('set x-li-format to json by default', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, oauth:{token:'t', secret:'ts'}};
                p.before.post('endpoint', options);
                options.headers['x-li-format'].should.equal('json');
            });
            it('user defined x-li-format', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{'x-li-format':'jsonp'}, oauth:{token:'t', secret:'ts'}};
                p.before.post('endpoint', options);
                options.headers['x-li-format'].should.equal('jsonp');
            });
            it('send form data as entity body', function () {
                var p = new Purest({provider:'linkedin', key:'k', secret:'s'});
                var options = {headers:{}, form:{a:1}, oauth:{token:'t', secret:'ts'}};
                p.before.post('endpoint', options);
                options.body.should.equal('{"a":1}');
                should.not.exist(options.form);
            });
        });
        describe('stackexchange', function () {
            it('set request encoding to binary', function () {
                var p = new Purest({provider:'stackexchange'});
                var options = {};
                p.before.post('endpoint', options);
                should.deepEqual(options, {encoding:null});
            });
        });
    });

    describe('before upload', function () {
        describe('asana', function () {
            it('regex endpoint', function () {
                var p = new Purest({provider:'asana'});
                var options = {upload:'cat.jpg', form:{file:''}};
                p.before.upload('tasks/id/attachments', options).should.equal(true);
            });
        });
        describe('box', function () {
            it('skip on missing upload API key', function () {
                var p = new Purest({provider:'box'});
                var options = {upload:'cat.png', form:{filename:'...'}};
                p.before.upload('files/content', options).should.equal(false);
            });
            it('match on upload API', function () {
                var p = new Purest({provider:'box'});
                var options = {upload:'cat.png', api:'upload', form:{filename:'...'}};
                p.before.upload('files/content', options).should.equal(true);
            });
            it('match on regex endpoint', function () {
                var p = new Purest({provider:'box'});
                var options = {upload:'cat.png', api:'upload', form:{filename:'...'}};
                p.before.upload('files/1234/content', options).should.equal(true);
            });
            it('match on view-upload API', function () {
                var p = new Purest({provider:'box'});
                var options = {upload:'cat.png', api:'view-upload', form:{file:'...'}};
                p.before.upload('documents', options).should.equal(true);
            });
        });
        describe('mailgun', function () {
            it('regex endpoint', function () {
                var p = new Purest({provider:'mailgun'});
                var options = {upload:'cat.png', form:{attachment:'...'}};
                p.before.upload('domain/messages', options).should.equal(true);
            });
            it('key existance', function () {
                var p = new Purest({provider:'mailgun'});
                var options = {upload:'cat.png', form:{attachment:'...'}};
                p.before.upload('domain/messages', options).should.equal(true);
            });
        });
        describe('sendgrid', function () {
            it('key existance', function () {
                var p = new Purest({provider:'sendgrid'});
                var options = {upload:'cat.png', form:{files:'...'}};
                p.before.upload('mail.send', options).should.equal(true);
            });
        });
    });
    
    describe('before multipart', function () {
        describe('flickr', function () {
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
    });

    describe('after multipart', function () {
        describe('flickr', function () {
            it('remove oauth options key', function () {
                var p = new Purest({provider:'flickr', key:'k', secret:'s'});
                var options = {upload:'cat.jpg', headers:{},
                    oauth:{token:'t', secret:'s'}, form:{photo:''}, json:true};
                p.after.multipart('', options);
                should.not.exist(options.oauth);
            });
        });
        describe('soundcloud', function () {
            it('remove multipart content-type', function () {
                var p = new Purest({provider:'soundcloud'});
                var options = {
                    upload:'beep.mp3',
                    form:{'track[title]':'title', 'track[asset_data]':'...'}
                };

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


    describe('multipart file', function () {
        it('sendgrid', function () {
            var p = new Purest({provider:'sendgrid'});
            should.deepEqual(p.multipart.file('key','cat.png','data'), {
                'content-disposition': 'form-data; name="key[cat.png]"; filename="cat.png"',
                'content-type': 'image/png',
                'content-transfer-encoding': 'binary',
                body: 'data'
            });
        });
    });

    describe('url endpoint', function () {
        
    });

    describe('url qs', function () {
        
    });
});
