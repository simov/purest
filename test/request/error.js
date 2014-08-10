
var purest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('error', function () {
    var p = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
        done();
    });

    it('stocktwits', function (done) {
        p.stocktwits.get('streams/user/nonexisting', function (err, res, body) {
            err.response.status.should.equal(404);
            err.errors[0].message.should.equal('User not found');
            done();
        });
    });
});
