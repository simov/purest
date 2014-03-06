
var fs = require('fs');
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe('upload', function () {
    var t = null;
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            if (provider.oauth) {
                t[name] = new TinyRest({provider:name,
                    consumerKey:cred.app[name].key,
                    consumerSecret:cred.app[name].secret
                });
            } else {
                t[name] = new TinyRest({provider:name});
            }
        }
        done();
    });
    it('should upload image to twitter', function (done) {
        t.twitter.post('statuses/update_with_media', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            upload:'cat1.png',
            form:{
                status:'Message on '+new Date(),
                'media[]':fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.source.should.equal('<a href="http://outofindex.com" rel="nofollow">TinyRest</a>');
            body.entities.media[0].should.be.an.instanceOf(Object);
            done();
        });
    });
    it('should upload image to facebook', function (done) {
        t.facebook.post('me/photos', {
            upload:'cat1.png',
            qs:{
                access_token:cred.user.facebook.token,
                message:'Message on '+new Date()
            },
            form:{
                source:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.match(/\d+/);
            body.post_id.should.match(/\d+_\d+/);
            done();
        });
    });
    it('should upload image to stocktwits', function (done) {
        t.stocktwits.post('messages/create', {
            upload:'cat1.png',
            qs:{
                access_token:cred.user.stocktwits.token
            },
            form:{
                body:'Message on '+new Date(),
                chart:fs.readFileSync('/home/mighty/hdd/images/cat1.png')
            }
        },
        function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.message.entities.chart.should.be.an.instanceOf(Object);
            done();
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
