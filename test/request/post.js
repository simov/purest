
var should = require('should');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    cred = require('../../config/credentials');


describe('post', function () {
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

    it('twitter', function (done) {
        p.twitter.post('statuses/update', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            form:{status:'Sent on '+new Date()}
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.id.should.be.type('number');
            body.id_str.should.be.type('string');
            done();
        });
    });
    it('linkedin', function (done) {
        p.linkedin.post('people/~/shares', {
            oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            form:{
                comment:'Sent on '+new Date(),
                visibility:{code:'anyone'}
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.updateKey.should.match(/^UNIU-\d+-\d+-SHARE$/);
            body.updateUrl.should.match(/^http:.*/);
            done();
        });
    });
    it('facebook', function (done) {
        p.facebook.post('me/feed', {
            qs:{access_token:cred.user.facebook.token},
            form:{message:'Sent on '+new Date()}
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.id.should.match(/\d+_\d+/);
            done();
        });
    });
    it('stocktwits', function (done) {
        p.stocktwits.post('messages/create', {
            qs:{access_token:cred.user.stocktwits.token},
            form:{body:'Sent on '+new Date()}
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            should.deepEqual(Object.keys(body.message),
                ['id','body','created_at','user','source'])
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
