
var fs = require('fs'),
    path = require('path');
var should = require('should');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers');


describe('query', function () {
    require('../utils/credentials');
    var cred = {
        app:require('../../config/app'),
        user:require('../../config/user')
    };
    var p = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.__provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
        done();
    });

    it('500px', function (done) {
        p['500px'].query()
            .get('users')
            .auth(cred.user['500px'].token, cred.user['500px'].secret)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.user.should.be.type('object');
                done();
            });
    });
    describe('aboutme', function () {
        it('apikey', function (done) {
            p.aboutme.query('user')
                .select('view/simeonv')
                .auth(cred.user.aboutme.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.user_name.should.equal('simeonv');
                    done();
                });
        });
        it('token', function (done) {
            p.aboutme.query('user')
                .get('directory/simeonv')
                .auth(cred.user.aboutme.apikey, cred.user.aboutme.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.status.should.equal(200);
                    done();
                });
        });
    });
    describe('asana', function () {
        it('basic auth', function (done) {
            p.asana.config()
                .get('users/me')
                .auth(cred.user.asana.apikey,'')
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    should.deepEqual(Object.keys(body.data),
                        ['id','name','email','photo','workspaces']);
                    done();
                });
        });
        it('oauth', function (done) {
            p.asana.config()
                .get('users/me')
                .auth(cred.user.asana.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    should.deepEqual(Object.keys(body.data),
                        ['id','name','email','photo','workspaces']);
                    done();
                });
        });
    });
    it('bitly', function (done) {
        p.bitly.query()
            .select('bitly_pro_domain')
            .where({domain:'nyti.ms'})
            .auth(cred.user.bitly.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.data.domain.should.equal('nyti.ms');
                body.data.bitly_pro_domain.should.equal(true);
                done();
            });
    });
    describe('box', function () {
        it('content API', function (done) {
            p.box.config()
                .get('users/me')
                .auth(cred.user.box.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.type.should.equal('user');
                    body.id.should.be.type('string');
                    done();
                });
        });
    });
    describe('box', function () {
        it('view API', function (done) {
            p.box.config('view')
                .get('documents')
                .auth(cred.user.box.viewapikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.document_collection.should.be.an.instanceOf(Object);
                    done();
                });
        });
        it.skip('view download', function (done) {
            // needs session/sharing permissions for that document
            p.box.get('documents/d7ee1566af95470eb2a44df5f612ed17/content.pdf', {
                headers: {
                    'Authorization':'Token '+cred.user.box.viewapikey
                },
                api:'view'
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                fs.writeFileSync('test.pdf', body, 'binary');
                fs.statSync('test.pdf').size.should.equal(973602);
                done();
            });
        });
        it.skip('cloud download', function (done) {
            // works
            p.box.get('zzxlzc38hq7u1u5jdteu.pdf', {
                headers: {
                    'Authorization':'Token '+cred.user.box.viewapikey
                },
                api:'download'
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                fs.writeFileSync('test.pdf', body, 'binary');
                fs.statSync('test.pdf').size.should.equal(973602);
                done();
            });
        });
        after(function () {
            // fs.unlinkSync('test.pdf');
        });
    });
    it('coderbits', function (done) {
        p.coderbits.get('simov', function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.username.should.equal('simov');
            done();
        });
    });
    it('digitalocean', function (done) {
        p.digitalocean.query()
            .get('actions')
            .auth(cred.user.digitalocean.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.actions.should.be.instanceOf(Array);
                done();
            });
    });
    it('dropbox', function (done) {
        p.dropbox.query()
            .get('account/info')
            .auth(cred.user.dropbox.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.email.should.be.type('string');
                done();
            });
    });
    describe('facebook', function () {
        it('get', function (done) {
            p.facebook.query()
                .get('me/groups')
                .where({fields:'id,name'})
                .auth(cred.user.facebook.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.data.length.should.equal(2);
                    Object.keys(body.data[0]).length.should.equal(2);
                    body.data[0].id.should.equal('313807222041302');
                    body.data[0].name.should.equal('Facebook Developers');
                    done();
                });
        });
        it('fql', function (done) {
            p.facebook.query()
                .select('fql')
                .where({q:'SELECT friend_count FROM user WHERE uid = 100006399333306'})
                .auth(cred.user.facebook.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.data[0].friend_count.should.equal(1);
                    done();
                });
        });
    });
    it('flickr', function (done) {
        p.flickr.query()
            .select('')
            .where({
                method: 'flickr.people.findByUsername',
                api_key:cred.app.flickr.key,
                username:'obama'
            })
            .auth(cred.user.flickr.token, cred.user.flickr.secret)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.stat.should.equal('ok');
                done();
            });
    });
    describe('flowdock', function () {
        it('oauth2', function (done) {
            p.flowdock.query()
                .get('users')
                .auth(cred.user.flowdock.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.should.be.instanceOf(Array);
                    done();
                });
        });
        it('basic', function (done) {
            p.flowdock.query()
                .get('users')
                .auth(cred.user.flowdock.user, cred.user.flowdock.pass)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.should.be.instanceOf(Array);
                    done();
                });
        });
        it('api token', function (done) {
            p.flowdock.query()
                .get('users')
                .auth(cred.user.flowdock.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.should.be.instanceOf(Array);
                    done();
                });
        });
    });
    it('foursquare', function (done) {
        p.foursquare.query()
            .get('users/81257627')
            .where({v:'20140503'})
            .auth(cred.user.foursquare.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.response.user.firstName.should.equal('Simo');
                done();
            });
    });
    it('github', function (done) {
        p.github.get('users/simov', {
            qs:{access_token:cred.user.github.token}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.login.should.equal('simov');
            body.name.should.equal('simo');
            done();
        });
    });
    describe('google', function () {
        it('plus', function (done) {
            p.google.query('plus')
                .select('people/106189723444098348646')
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.displayName.should.equal('Larry Page');
                    done();
                });
        });
        it('youtube', function (done) {
            p.google.query('youtube')
                .select('channels')
                .where({
                    forUsername:'RayWilliamJohnson',
                    part:'id, snippet, contentDetails, statistics, status, topicDetails'
                })
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.items[0].snippet.title.should.equal('RayWilliamJohnson');
                    done();
                });
        });
        it('youtube/analytics', function (done) {
            p.google.query('youtube/analytics')
                .select('reports')
                .where({
                    ids:'channel==UCar6nMFGfuv254zn5vDyVaA',
                    metrics:'views',
                    'start-date':'2014-01-15',
                    'end-date':'2014-02-15'
                })
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.rows.should.be.an.instanceOf(Array);
                    done();
                });
        });
        it('drive', function (done) {
            p.google.query('drive')
                .get('about')
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.user.isAuthenticatedUser.should.equal(true);
                    done();
                });
        });
        it('freebase', function (done) {
            p.google.query('freebase')
                .select('search')
                .where({query:'Thriftworks'})
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.result[0].name.should.equal('Thriftworks');
                    done();
                });
        });
        it('tasks', function (done) {
            p.google.query('tasks')
                .select('users/@me/lists')
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.items[0].title.should.equal('Default List');
                    done();
                });
        });
        it('urlshortener', function (done) {
            p.google.query('urlshortener')
                .select('url')
                .where({shortUrl:'http://goo.gl/0wkZ4V'})
                .auth(cred.user.google.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.longUrl.should.equal('http://nodejs.org/');
                    done();
                });
        });
        it('pagespeed', function (done) {
            p.google.query('pagespeedonline')
                .select('runPagespeed')
                .where({url:'http://www.amazon.com/'})
                .auth(cred.user.google.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.responseCode.should.equal(200);
                    done();
                });
        });
        it('contacts', function (done) {
            p.google.query('contacts')
                .select('contacts/default/full')
                .where({'max-results':50})
                .auth(cred.user.google.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.feed['openSearch$itemsPerPage']['$t'].should.equal('50');
                    done();
                });
        });
        describe('gmaps', function () {
            it('streetview', function (done) {
                p.google.query('gmaps')
                    .get('streetview')
                    .where({
                        location:'40.7828647,-73.9653551',
                        size:'400x400',
                        sensor:false
                    })
                    .auth(cred.user.google.apikey)
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        fs.writeFileSync('streetview.jpg', body, 'binary');
                        done();
                    });
            });
            it('staticmap', function (done) {
                p.google.query('gmaps')
                    .get('staticmap')
                    .where({
                        center:'40.7828647,-73.9653551',
                        size:'640x640',
                        zoom:15,
                        format:'jpg',
                        sensor:false
                    })
                    .auth(cred.user.google.apikey)
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        fs.writeFileSync('staticmap.jpg', body, 'binary');
                        done();
                    });
            });
            it('geocode', function (done) {
                p.google.query('gmaps')
                    .get('geocode')
                    .where({
                        address:'Central Park, New York, NY',
                        sensor:false
                    })
                    .auth(cred.user.google.apikey)
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        body.results[0].formatted_address
                            .should.equal('Central Park, New York, NY, USA');
                        done();
                    });
            });
            it('directions', function (done) {
                p.google.query('gmaps')
                    .get('directions')
                    .where({
                        origin:'Central Park, New York, NY',
                        destination:'New York, New Jersey',
                        sensor:false
                    })
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        body.routes[0].summary
                            .should.equal('79th St Transverse and Central Park West');
                        done();
                    });
            });
            it('timezone', function (done) {
                p.google.query('gmaps')
                    .select('timezone')
                    .where({
                        location:'40.7828647,-73.9653551',
                        timestamp:'1331161200',
                        sensor:false
                    })
                    .auth(cred.user.google.apikey)
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        body.timeZoneName.should.equal('Eastern Standard Time');
                        done();
                    });
            });
            it('elevation', function (done) {
                p.google.query('gmaps')
                    .get('elevation')
                    .where({
                        locations:'40.7828647,-73.9653551',
                        sensor:false
                    })
                    .auth(cred.user.google.apikey)
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        body.results[0].elevation.should.equal(34.39545059204102);
                        done();
                    });
            });
            it('distancematrix', function (done) {
                p.google.query('gmaps')
                    .get('distancematrix')
                    .where({
                        origins:'40.7828647,-73.9653551',
                        destinations:'40.7873463,-74.0108939',
                        sensor:false
                    })
                    .auth(cred.user.google.apikey)
                    .request(function (err, res, body) {
                        debugger;
                        if (err) return error(err, done);
                        body.rows[0].elements[0].distance.text.should.equal('11.8 km');
                        body.rows[0].elements[0].duration.text.should.equal('21 mins');
                        done();
                    });
            });
            after(function () {
                fs.unlinkSync('staticmap.jpg');
                fs.unlinkSync('streetview.jpg');
            });
        });
    });
    describe('heroku', function () {
        it('get', function (done) {
            p.heroku.query()
                .get('account')
                .auth(cred.user.heroku.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.email.should.be.type('string');
                    done();
                });
        });
    });
    describe('imgur', function () {
        it('apikey', function (done) {
            p.imgur.query()
                .get('account/simov')
                .auth(cred.app.imgur.key)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.data.url.should.equal('simov');
                    done();
                });
        });
        it('token', function (done) {
            p.imgur.query()
                .get('account/simov')
                .auth(cred.user.imgur.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.data.url.should.equal('simov');
                    done();
                });
        });
    });
    it('instagram', function (done) {
        p.instagram.query()
            .select('users/self/feed')
            .auth(cred.user.instagram.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.pagination.should.be.type('object');
                body.meta.code.should.equal(200);
                body.data.should.be.an.instanceOf(Array);
                done();
            });
    });
    describe('linkedin', function () {
        it('oauth1', function (done) {
            p.linkedin.query()
                .select('companies')
                .where({'email-domain':'apple.com'})
                .auth(cred.user.linkedin.token, cred.user.linkedin.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.values[0].id.should.equal(162479);
                    body.values[0].name.should.equal('Apple');
                    done();
                });
        });
        it('oauth2', function (done) {
            p.linkedin.query()
                .select('companies')
                .where({'email-domain':'apple.com'})
                .auth(cred.user.linkedin.oauth2)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.values[0].id.should.equal(162479);
                    body.values[0].name.should.equal('Apple');
                    done();
                });
        });
    });
    describe('mailchimp', function () {
        it('apikey', function (done) {
            p.mailchimp.query()
                .select('campaigns/list')
                .auth(cred.user.mailchimp.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    should.deepEqual(Object.keys(body),
                        ['total','data','errors']);
                    body.errors.length.should.equal(0);
                    done();
                });
        });
        it('oauth', function (done) {
            p.mailchimp.query()
                .select('campaigns/list')
                .auth(cred.user.mailchimp.token)
                .options({dc:cred.user.mailchimp.dc})
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    should.deepEqual(Object.keys(body),
                        ['total','data','errors']);
                    body.errors.length.should.equal(0);
                    done();
                });
        });
    });
    it('mailgun', function (done) {
        p.mailgun.query()
            .select(cred.user.mailgun.domain+'/stats')
            .auth('api', cred.user.mailgun.apikey)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.total_count.should.be.type('number');
                body.items.should.be.instanceOf(Array);
                done();
            });
    });
    it('mandrill', function (done) {
        p.mandrill.query()
            .post('users/info')
            .auth(cred.user.mandrill.key)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.reputation.should.be.type('number');
                done();
            });
    });
    describe('openstreetmap', function () {
        it('oauth', function (done) {
            p.openstreetmap.query()
                .select('user/details')
                .auth(cred.user.openstreetmap.token, cred.user.openstreetmap.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/);
                    done();
                });
        });
        it('basic auth', function (done) {
            p.openstreetmap.query()
                .select('user/details')
                .auth(cred.user.openstreetmap.user, cred.user.openstreetmap.pass)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/);
                    done();
                });
        });
    });
    it('paypal', function (done) {
        p.paypal.query('identity')
            .get('userinfo')
            .where({schema:'openid'})
            .auth(cred.user.paypal.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.user_id.should.be.type('string');
                body.name.should.be.type('string');
                done();
            });
    });
    it('redbooth', function (done) {
        p.redbooth.query()
            .get('me')
            .auth(cred.user.redbooth.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.id.should.be.type('number');
                done();
            });
    });
    describe('rubygems', function () {
        it('headers auth', function (done) {
            p.rubygems.query()
                .get('gems')
                .auth(cred.user.rubygems.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    should.deepEqual(body, []);
                    done();
                });
        });
        it('basic auth', function (done) {
            p.rubygems.query()
                .get('api_key')
                .auth(cred.user.rubygems.user, cred.user.rubygems.pass)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.rubygems_api_key.should.be.type('string');
                    done();
                });
        });
    });
    it('salesforce', function (done) {
        p.salesforce.query('sobjects')
            .get('Account')
            .options({domain:cred.user.salesforce.domain})
            .auth(cred.user.salesforce.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                should.deepEqual(Object.keys(body), ['objectDescribe', 'recentItems']);
                done();
            });
    });
    it('sendgrid', function (done) {
        p.sendgrid.query()
            .select('profile.get')
            .auth(cred.user.sendgrid.user, cred.user.sendgrid.pass)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body[0].active.should.equal('true');
                done();
            });
    });
    it('slack', function (done) {
        p.slack.get('users.list', {
            qs:{token:cred.user.slack.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.ok.should.equal(true);
            done();
        });
    });
    it('soundcloud', function (done) {
        p.soundcloud.query()
            .select('users')
            .where({q:'thriftworks'})
            .auth(cred.user.soundcloud.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body[0].username.should.equal('Thriftworks');
                done();
            });
    });
    it('stackexchange', function (done) {
        p.stackexchange.query()
            .select('users')
            .where({
                site:'stackoverflow',
                sort:'reputation',
                order:'desc'
            })
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.items.length.should.equal(30);
                done();
            });
    });
    it('stocktwits', function (done) {
        p.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it('stripe', function (done) {
        p.stripe.query()
            .get('account')
            .auth(cred.user.stripe.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.id.should.be.type('string');
                body.email.should.be.type('string');
                done();
            });
    });
    describe('trello', function () {
        it('public', function (done) {
            p.trello.query()
                .get('boards/4d5ea62fd76aa1136000000c')
                .auth(cred.app.trello.key)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.name.should.equal('Trello Development');
                    done();
                });
        });
        it('private', function (done) {
            p.trello.query()
                .get('members/me/boards')
                .auth(cred.app.trello.key, cred.user.trello.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.should.be.an.instanceOf(Array);
                    done();
                });
        });
    });
    describe('tumblr', function () {
        it('apikey', function (done) {
            p.tumblr.query()
                .get('blog/simovblog.tumblr.com/info')
                .auth(cred.app.tumblr.key)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.response.blog.name.should.equal('simovblog');
                    done();
                });
        });
        it('token', function (done) {
            p.tumblr.query()
                .get('blog/simovblog.tumblr.com/followers')
                .auth(cred.user.tumblr.token, cred.user.tumblr.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    should.deepEqual(body.meta, {status:200, msg:'OK'});
                    done();
                });
        });
    });
    it('twitch', function (done) {
        p.twitch.query()
            .get('user')
            .auth(cred.user.twitch.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body._id.should.be.type('number');
                body.name.should.be.type('string');
                done();
            });
    });
    it('twitter', function (done) {
        p.twitter.query()
            .select('users/show')
            .where({screen_name:'mightymob'})
            .auth(cred.user.twitter.token, cred.user.twitter.secret)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.id.should.equal(1504092505);
                body.screen_name.should.equal('mightymob');
                done();
            })
    });
    it('vimeo', function (done) {
        p.vimeo.query()
            .get('me')
            .auth(cred.user.vimeo.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.name.should.be.type('string');
                body.uri.should.be.type('string');
                done();
            });
    });
    it('wikimapia', function (done) {
        p.wikimapia.query()
            .select('')
            .where({
                function:'place.search',
                q:'Central Park, New York, NY',
                lat:'40.7629025',
                lon:'-73.9826439'
            })
            .auth(cred.user.wikimapia.apikey)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.count.should.equal(5);
                done();
            });
    });
    describe('yahoo', function () {
        it('social', function (done) {
            p.yahoo.query('social')
                .select('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile')
                .auth(cred.user.yahoo.token, cred.user.yahoo.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.profile.nickname.should.equal('Simeon')
                    done();
                });
        });
        it('yql', function (done) {
            p.yahoo.config('yql')
                .get('yql')
                .where({q:'SELECT * FROM social.profile WHERE guid=me'})
                .auth(cred.user.yahoo.token, cred.user.yahoo.secret)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.query.results.profile.nickname.should.equal('Simeon');
                    done();
                });
        });
        it('geo', function (done) {
            p.yahoo.query('geo')
                .select("places.q('Central Park, New York')")
                .auth(cred.user.yahoo.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) return error(err, done);
                    body.places.place[0].admin1.should.equal('New York');
                    done();
                });
        });
    });
    it('yammer', function (done) {
        p.yammer.query()
            .get('users/current')
            .auth(cred.user.yammer.token)
            .request(function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.type.should.equal('user');
                done();
            });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}
