
var fs = require('fs'),
    path = require('path'),
    should = require('should');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');
var image = path.resolve(__dirname, '../fixtures/cat.png'),
    audio = path.resolve(__dirname, '../fixtures/beep.mp3'),
    pdf = path.resolve(__dirname, '../fixtures/coffee.pdf');


describe('upload', function () {
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

    describe('asana', function () {
        var access = {};
        before(function (done) {
            p.asana.refresh(
                cred.app.asana,
                cred.user.asana.refresh,
            function (err, res, body) {
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
        it('upload', function (done) {
            var id = '16202185639027';
            p.asana.query()
                .update('tasks/'+id+'/attachments')
                .set({
                    file:fs.readFileSync(image)
                })
                .files('cat.png')
                .auth(access.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.data.name.should.equal('cat.png');
                    done();
                });
        });
    });
    describe('box content', function () {
        var access = {}, file = {};
        before(function (done) {
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
        });
        it('upload', function (done) {
            p.box.query('upload')
                .update('files/content')
                .where({parent_id:0})
                .set({
                    filename:fs.readFileSync(image)
                })
                .files('cat.png')
                .auth(access.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.entries[0].name.should.equal('cat.png');
                    file = body.entries[0];
                    done();
                });
        });
        it('download', function (done) {
            p.box.query()
                .get('files/'+file.id+'/content')
                .auth(access.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    fs.writeFileSync('cat.png', body, 'binary');
                    fs.statSync('cat.png').size.should.equal(22025);
                    done();
                });
        });
        after(function (done) {
            p.box.del('files/'+file.id, {
                auth:{bearer:access.token}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                fs.unlinkSync('cat.png');
                done();
            });
        });
    });
    describe.skip('box view', function () {
        it.skip('upload', function (done) {
            // works - need to figure out a testing scheme
            p.box.post('documents', {
                headers: {
                    'Authorization':'Token '+cred.user.box.viewapikey
                },
                api:'view-upload',
                upload:'coffee.pdf',
                form:{name:'coffee.pdf', file:fs.readFileSync(pdf)}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.type.should.equal('document');
                body.status.should.equal('queued');
                done();
            });
        });
    });
    it('facebook', function (done) {
        p.facebook.query()
            .update('me/photos')
            .set({
                message:'Sent on '+new Date(),
                source:fs.readFileSync(image)
            })
            .files('cat.png')
            .auth(cred.user.facebook.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.id.should.match(/\d+/);
                body.post_id.should.match(/\d+_\d+/);
                done();
            });
    });
    describe('flickr', function () {
        it('upload', function (done) {
            p.flickr.query('upload')
                .update('')
                .set({
                    title:'Sent on '+new Date(),
                    description:'...',
                    is_public:0, is_friend:1, is_family:1, hidden:2,
                    photo:fs.readFileSync(image)
                })
                .files('cat.png')
                .auth(cred.user.flickr.token, cred.user.flickr.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    res.statusCode.should.equal(200);
                    done();
                });
        });
        it('replace', function (done) {
            p.flickr.query('replace')
                .update('')
                .set({
                    photo_id:'14887285783',
                    photo:fs.readFileSync(image)
                })
                .files('cat.png')
                .auth(cred.user.flickr.token, cred.user.flickr.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    res.statusCode.should.equal(200);
                    done();
                });
        });
    });
    it('foursquare', function (done) {
        p.foursquare.query()
            .update('users/self/update')
            .set({
                photo:fs.readFileSync(image)
            })
            .files('cat.png')
            .where({v:'20140503'})
            .auth(cred.user.foursquare.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.meta.code.should.equal(200);
                done();
            });
    });
    it('mailgun', function (done) {
        p.mailgun.query()
            .update(cred.user.mailgun.domain+'/messages')
            .set({
                from:'purest@mailinator.com',
                to:'purest@mailinator.com,purest2@mailinator.com',
                subject:'Purest is awesome! (mailgun+attachments)',
                html:'<h1>Purest is awesome!</h1>',
                text:'True idd!',
                attachment:[
                    fs.readFileSync(image),
                    fs.readFileSync(audio)
                ]
            })
            .files(['cat.png','beep.mp3'])
            .auth('api', cred.user.mailgun.apikey)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.message.should.be.type('string');
                body.id.should.be.type('string');
                done();
            });
    });
    it('sendgrid', function (done) {
        p.sendgrid.query()
            .post('mail.send')
            .files(['cat.png','beep.mp3'])
            .set({
                from:'purest@mailinator.com',
                to:['purest@mailinator.com','purest2@mailinator.com'],
                subject:'Purest is awesome! (sendgrid+attachments)',
                html:'<h1>Purest is awesome!</h1>',
                text:'True idd!',
                files: [
                    fs.readFileSync(image),
                    fs.readFileSync(audio)
                ]
            })
            .auth(cred.user.sendgrid.user, cred.user.sendgrid.pass)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.message.should.equal('success');
                done();
            });
    });
    it('slack', function (done) {
        p.slack.query()
            .update('files.upload')
            .set({
                file:fs.readFileSync(image),
                filename:'cat',
                title:'Sent on '+new Date()
            })
            .files('cat.png')
            .auth(cred.user.slack.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.ok.should.equal(true);
                body.file.name.should.equal('cat');
                done();
            });
    });
    it('soundcloud', function (done) {
        p.soundcloud.query()
            .update('tracks')
            .set({
                'track[title]':'Sent on '+new Date(),
                'track[asset_data]':fs.readFileSync(audio)
            })
            .files('beep.mp3')
            .auth(cred.user.soundcloud.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.kind.should.equal('track');
                done();
            });
    });
    it('stocktwits', function (done) {
        p.stocktwits.query()
            .update('messages/create')
            .set({
                body:'Sent on '+new Date(),
                chart:fs.readFileSync(image)
            })
            .files('cat.png')
            .auth(cred.user.stocktwits.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.response.status.should.equal(200);
                body.message.entities.chart.should.be.an.instanceOf(Object);
                done();
            });
    });
    it('twitter', function (done) {
        p.twitter.query()
            .update('statuses/update_with_media')
            .set({
                status:'Sent on '+new Date(),
                'media[]':fs.readFileSync(image)
            })
            .files('cat.png')
            .auth(cred.user.twitter.token, cred.user.twitter.secret)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.entities.media[0].should.be.an.instanceOf(Object);
                done();
            });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
