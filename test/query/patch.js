
var fs = require('fs'),
    path = require('path');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png');


describe('patch', function () {
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

    describe('salesforce', function () {
        var id = '';
        before(function (done) {
            // POST
            p.salesforce.query('sobjects')
                .post('Lead')
                .options({domain:cred.user.salesforce.domain})
                .json({
                    email:'purest@mailinator.com',
                    FirstName:'Unkown', LastName:'Unknown', Company:'Unknown'
                })
                .auth(cred.user.salesforce.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.success.should.equal(true);
                    id = body.id;
                    done();
                });
        });
        it('patch', function (done) {
            p.salesforce.query('sobjects')
                .patch('Lead/'+id)
                .options({domain:cred.user.salesforce.domain})
                .json({FirstName:'First', LastName:'Last'})
                .auth(cred.user.salesforce.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);

                    // GET
                    p.salesforce.query('sobjects')
                        .get('Lead/'+id)
                        .options({domain:cred.user.salesforce.domain})
                        .auth(cred.user.salesforce.token)
                        .request(function (err, res, body) {
                            debugger;
                            if (err) return error(err, done);
                            body.FirstName.should.equal('First');
                            body.LastName.should.equal('Last');
                            done();
                        });
                });
        });
        after(function (done) {
            // DELETE
            p.salesforce.query('sobjects')
                .del('Lead/'+id)
                .options({domain:cred.user.salesforce.domain})
                .auth(cred.user.salesforce.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
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
