
var should = require('should');
var Purest = require('../../lib/provider'),
    Multipart = require('../../lib/multipart'),
    config = require('../../lib/config');


describe('multipart', function () {
    it('text', function () {
        var multipart = new Multipart();
        should.deepEqual(multipart.text('key','data'), {
            'content-disposition': 'form-data; name="key"',
            'content-type': 'text/plain',
            'content-transfer-encoding': 'utf8',
            body: 'data'
        });
    });
    it('file', function () {
        var multipart = new Multipart();
        should.deepEqual(multipart.file('key','cat.png','data'), {
            'content-disposition': 'form-data; name="key"; filename="cat.png"',
            'content-type': 'image/png',
            'content-transfer-encoding': 'binary',
            body: 'data'
        });
    });
    it.skip('multipart endpoints', function () {
        var p = new Purest({provider:'twitter'});
        should.deepEqual(p.multipart.endpoints, {'statuses/update_with_media': 'media[]'});
    });
    it('single file to upload', function () {
        var p = new Purest({provider:'twitter'});
        var options = {
            upload:'cat.jpg',
            form:{'media[]':'...', status:'tweet'
        }};
        options = config.options('statuses/update_with_media', options, 'post',
            p.apis.__default.endpoints);
        var multipart = p.multipart.create('statuses/update_with_media', options);
        should.deepEqual(multipart, [{
            'content-disposition': 'form-data; name="media[]"; filename="cat.jpg"',
            'content-type': 'image/jpeg',
            'content-transfer-encoding': 'binary',
            body: '...' },
            { 'content-disposition': 'form-data; name="status"',
            'content-type': 'text/plain',
            'content-transfer-encoding': 'utf8',
            body: 'tweet'
        }]);
    });
    it.skip('array of files to upload & array of text fields', function () {
        var p = new Purest({provider:'sendgrid'});
        var options = {
            upload:['cat.png','beep.mp3'],
            form:{
                from:'purest@email.com',
                to:['a@email.com','b@email.com'],
                files:['content1','content2']
            }
        };
        options = config.options('mail.send', options, 'post',
            p.apis.__default.endpoints);
        var multipart = p.multipart.create('mail.send', options);
        should.deepEqual(multipart, [{
        'content-disposition': 'form-data; name="from"',
        'content-type': 'text/plain',
        'content-transfer-encoding': 'utf8',
        body: 'purest@email.com' },
        { 'content-disposition': 'form-data; name="to"',
        'content-type': 'text/plain',
        'content-transfer-encoding': 'utf8',
        body: 'a@email.com' },
        { 'content-disposition': 'form-data; name="to"',
        'content-type': 'text/plain',
        'content-transfer-encoding': 'utf8',
        body: 'b@email.com' },
        { 'content-disposition': 'form-data; name="files[cat.png]"; filename="cat.png"',
        'content-type': 'image/png',
        'content-transfer-encoding': 'binary',
        body: 'content1' },
        { 'content-disposition': 'form-data; name="files[beep.mp3]"; filename="beep.mp3"',
        'content-type': 'audio/mpeg',
        'content-transfer-encoding': 'binary',
        body: 'content2'
        }]);
    });
});
