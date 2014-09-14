
var should = require('should');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');


describe('post', function () {
    require('../utils/credentials');
    var cred = require('../../config/credentials');
    var p = {};
    before(function () {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
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
            body.updateKey.should.match(/^UPDATE-\d+-\d+$/);
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
    it('sendgrid', function (done) {
        p.sendgrid.post('mail.send', {
            form:{
                api_user:cred.user.sendgrid.user,
                api_key:cred.user.sendgrid.pass,
                from:'purest@mailinator.com',
                to:'purest@mailinator.com',
                subject:'Purest is awesome!',
                text:'True idd!'
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.message.should.equal('success');
            done();
        });
    });
    it('mandrill', function (done) {
        p.mandrill.post('messages/send', {
            form:{
                key:cred.user.mandrill.key,
                message: {
                    html:'<h1>Purest is awesome!</h1>',
                    text:'Plain text',
                    subject:'Purest is awesome!',
                    from_email:'purest@mailinator.com',
                    to:[{email:'purest@mailinator.com'}]
                }
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            should.deepEqual(Object.keys(body[0]), ['email','status','_id']);
            done();
        });
    });
    it('mailgun', function (done) {
        p.mailgun.post(cred.user.mailgun.domain+'/messages', {
            auth:{user:'api',pass:cred.user.mailgun.key},
            form:{
                from:'purest@mailinator.com',
                to:'purest@mailinator.com',
                subject:'Purest is awesome!',
                html:'<h1>Purest is awesome!</h1>',
                text:'Plain text'
            }
        },
        function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.message.should.be.type('string');
            body.id.should.be.type('string');
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
