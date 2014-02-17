
var fs = require('fs');
var TinyRest = require('../lib/tinyrest'),
    cred = require('./credentials');


describe.skip('upload', function () {
    var t = null;
    before(function (done) {
        t = {
            twitter: new TinyRest({provider:'twitter',
                consumerKey:cred.app.twitter.key,
                consumerSecret:cred.app.twitter.secret
            }),
            linkedin: new TinyRest({provider:'linkedin',
                consumerKey:cred.app.linkedin.key,
                consumerSecret:cred.app.linkedin.secret
            }),
            facebook: new TinyRest({provider:'facebook'}),
            bitly: new TinyRest({provider:'bitly'}),
            stocktwits: new TinyRest({provider:'stocktwits'}),
            soundcloud: new TinyRest({provider:'soundcloud'}),
            rubygems: new TinyRest({provider:'rubygems'})
        };
        done();
    });
    it('should upload image to twitter', function (done) {
        t.twitter.post('statuses/update_with_media', {
            options:{
                token:cred.user.twitter.token,
                secret:cred.user.twitter.secret,
                upload:'cat1.png'
            },
            data:{
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
            options:{
                upload:'cat1.png'
            },
            params:{
                access_token:cred.user.facebook.token,
                message:'Message on '+new Date()
            },
            data:{
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
            options:{
                upload:'cat1.png'
            },
            params:{
                access_token:cred.user.stocktwits.token
            },
            data:{
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
