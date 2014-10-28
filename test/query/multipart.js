
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
        it('upload', function (done) {
            var id = '16202185639027';
            p.asana.query()
                .update('tasks/'+id+'/attachments')
                .upload({
                    file:fs.createReadStream(image)
                })
                .auth(cred.user.asana.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.data.name.should.equal('cat.png');
                    done();
                });
        });
    });
    describe('box content', function () {
        var file = {};
        it('upload', function (done) {
            p.box.query('upload')
                .update('files/content')
                .where({parent_id:0})
                .upload({
                    filename:fs.createReadStream(image)
                })
                .auth(cred.user.box.token)
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
                .auth(cred.user.box.token)
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
                auth:{bearer:cred.user.box.token}
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
            .upload({
                message:'Sent on '+new Date(),
                source:fs.createReadStream(image)
            })
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
            .where({v:'20140503'})
            .upload({
                photo:fs.createReadStream(image)
            })
            .auth(cred.user.foursquare.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.meta.code.should.equal(200);
                done();
            });
    });
    describe('google', function () {
        it('drive', function (done) {
            p.google.query('upload-drive')
                .update('files')
                .where({uploadType:'multipart'})
                .upload([
                    {
                        'Content-Type':'application/json',
                        body:JSON.stringify({
                            title:'cat.png'
                        })
                    },
                    {
                        'Content-Type':'image/png',
                        body:fs.createReadStream(image)
                    }
                ])
                .options({json:false})
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.title.should.equal('cat.png');
                    body.fileSize.should.equal('22025');
                    done();
                });
        });
    });
    it('mailgun', function (done) {
        p.mailgun.query()
            .update(cred.user.mailgun.domain+'/messages')
            .upload({
                from:'purest@mailinator.com',
                to:'purest@mailinator.com,purest2@mailinator.com',
                subject:'Purest is awesome! (mailgun+attachments)',
                html:'<h1>Purest is awesome!</h1>',
                text:'True idd!',
                attachment:[
                    fs.createReadStream(image),
                    fs.createReadStream(audio)
                ]
            })
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
            .upload({
                from:'purest@mailinator.com',
                to:['purest@mailinator.com','purest2@mailinator.com'],
                subject:'Purest is awesome! (sendgrid+attachments)',
                html:'<h1>Purest is awesome!</h1>',
                text:'True idd!',
                'files[image.png]': fs.createReadStream(image),
                'files[beep.mp3]': fs.createReadStream(audio)
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
            .upload({
                title:'Sent on '+new Date(),
                filename:'cat',
                file:fs.createReadStream(image)
            })
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
            .upload({
                'track[title]':'Sent on '+new Date(),
                'track[asset_data]':fs.createReadStream(audio)
            })
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
            .upload({
                body:'Sent on '+new Date(),
                chart:fs.createReadStream(image)
            })
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
            .upload({
                status:'Sent on '+new Date(),
                'media[]':fs.createReadStream(image)
            })
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
