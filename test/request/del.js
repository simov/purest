
var fs = require('fs'),
    path = require('path');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png');


describe('del', function () {
    require('../utils/credentials');
    var cred = {
        app:require('../../config/app'),
        user:require('../../config/user')
    };
    var refresh = require('../utils/refresh');
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    describe('box', function () {
        var access = {}, file = {};
        before(function (done) {
            (function (done) {
                p.box.refresh(
                    cred.app.box,
                    cred.user.box.refresh,
                function (err, res, body) {
                    debugger;
                    if (err) return done(err);
                    access = {token:body.access_token};
                    refresh.store('box', body.access_token, body.refresh_token);
                    done();
                });
            }(function (err) {
                if (err) return done(err);
                p.box.post('files/content', {
                    auth:{bearer:access.token},
                    api:'upload',
                    upload:'cat.png',
                    qs:{parent_id:0},
                    form:{filename:fs.readFileSync(image)}
                }, function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    file = body.entries[0];
                    done();
                });
            }));
        });
        it('delete', function (done) {
            p.box.del('files/'+file.id, {
                auth:{bearer:access.token}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                res.headers['content-location']
                    .should.equal('https://api.box.com/api/2.0/files/'+file.id+'/trash');
                done();
            });
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
