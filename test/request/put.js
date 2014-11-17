
var fs = require('fs'),
    path = require('path');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png');


describe('put', function () {
    require('../utils/credentials');
    var cred = {
        app:require('../../config/app'),
        user:require('../../config/user')
    };
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.__provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    describe('dropbox', function () {
        it('upload', function (done) {
            p.dropbox.put('files_put/auto/cat.png', {
                auth: {bearer:cred.user.dropbox.token},
                api: 'files',
                body: fs.readFileSync(image)
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.size.should.equal('21.5 KB');
                done();
            });
        });
        it('download', function (done) {
            p.dropbox.get('files/auto/cat.png', {
                auth: {bearer:cred.user.dropbox.token},
                api: 'files'
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                var img = path.resolve(__dirname,'cat.png');
                fs.writeFileSync(img, body);
                fs.statSync(path.resolve(__dirname, '../fixtures/cat.png')).size
                    .should.equal(fs.statSync(img).size);
                done();
            });
        });
        after(function () {
            fs.unlinkSync(path.resolve(__dirname,'cat.png'));
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
