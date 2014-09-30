
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');


describe('error', function () {
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
            p[name] = new purest(provider.__provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
    });

    it('stocktwits', function (done) {
        p.stocktwits.get('streams/user/nonexisting', function (err, res, body) {
            err.response.status.should.equal(404);
            err.errors[0].message.should.equal('User not found');
            done();
        });
    });
});
