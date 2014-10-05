
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
    var refresh = require('../utils/refresh');
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

    describe('asana', function () {
        var access = {};
        before(function (done) {
            p.asana.refresh(
                cred.app.asana,
                cred.user.asana.refresh,
            function (err, res, body) {
                debugger;
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
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
                .auth(access.token)
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
        var access = {};
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
        it('content API', function (done) {
            p.box.config()
                .get('users/me')
                .auth(access.token)
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
        var access = {};
        before(function (done) {
            p.google.refresh(
                cred.app.google,
                cred.user.google.refresh,
            function (err, res, body) {
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
        it('plus', function (done) {
            p.google.query('plus')
                .select('people/106189723444098348646')
                .auth(access.token)
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
                .auth(access.token)
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
                .auth(access.token)
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
                .auth(access.token)
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
                .auth(access.token)
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
                .auth(access.token)
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
                .auth(access.token)
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
    describe.skip('heroku', function () {
        var access = {};
        before(function (done) {
            p.heroku.refresh(
                cred.app.heroku,
                cred.user.heroku.refresh,
            function (err, res, body) {
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
        it.skip('get', function (done) {
            p.heroku.get('account', {
                auth: {bearer:access.token}
                // or
                // auth: {user:'email', pass:'password'}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.email.should.be.type('string');
                done();
            });
        });
    });
    it.skip('instagram', function (done) {
        p.instagram.get('users/self/feed', {
            qs:{access_token:cred.user.instagram.token}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.pagination.should.be.type('object');
            body.meta.code.should.equal(200);
            body.data.should.be.an.instanceOf(Array);
            done();
        });
    });
    it.skip('linkedin', function (done) {
        p.linkedin.get('companies', {
            oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            qs:{'email-domain':'apple.com'}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    describe.skip('mailchimp', function () {
        it.skip('apikey', function (done) {
            p.mailchimp.get('campaigns/list', {
                qs:{apikey:cred.user.mailchimp.apikey}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                should.deepEqual(Object.keys(body),
                    ['total','data','errors']);
                body.errors.length.should.equal(0);
                done();
            });
        });
        it.skip('oauth', function (done) {
            p.mailchimp.get('campaigns/list', {
                dc:cred.user.mailchimp.dc,
                qs:{apikey:cred.user.mailchimp.token}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                should.deepEqual(Object.keys(body),
                    ['total','data','errors']);
                body.errors.length.should.equal(0);
                done();
            });
        });
    });
    it.skip('mailgun', function (done) {
        p.mailgun.get(cred.user.mailgun.domain+'/stats', {
            auth:{user:'api',pass:cred.user.mailgun.apikey}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.total_count.should.be.type('number');
            body.items.should.be.instanceOf(Array);
            done();
        });
    });
    it.skip('mandrill', function (done) {
        p.mandrill.post('users/info', {
            form:{key:cred.user.mandrill.key}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.reputation.should.be.type('number');
            done();
        });
    });
    it.skip('openstreetmap', function (done) {
        p.openstreetmap.get('user/details', {
            // oauth for writing to the database
            oauth:{
                token:cred.user.openstreetmap.token,
                secret:cred.user.openstreetmap.secret
            }
            // or basic auth for reading user details
            // auth: {user:'email', pass:'password'}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/);
            done();
        });
    });
    it.skip('rubygems', function (done) {
        p.rubygems.get('gems/rails', function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it.skip('sendgrid', function (done) {
        p.sendgrid.get('profile.get', {
            qs:{api_user:cred.user.sendgrid.user, api_key:cred.user.sendgrid.pass}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body[0].active.should.equal('true');
            done();
        });
    });
    it.skip('slack', function (done) {
        p.slack.get('users.list', {
            qs:{token:cred.user.slack.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.ok.should.equal(true);
            done();
        });
    });
    it.skip('soundcloud', function (done) {
        p.soundcloud.get('users', {
            qs:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
    it.skip('stackexchange', function (done) {
        p.stackexchange.get('users', {
            qs:{
                key:cred.user.stackexchange.apikey,
                access_token:cred.user.stackexchange.token,
                site:'stackoverflow',
                sort:'reputation',
                order:'desc'
            }
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.items.length.should.equal(30);
            done();
        });
    });
    it.skip('stocktwits', function (done) {
        p.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    describe.skip('trello', function () {
        it.skip('public', function (done) {
            p.trello.get('boards/4d5ea62fd76aa1136000000c', {
                qs:{key:cred.app.trello.key}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.name.should.equal('Trello Development');
                done();
            });
        });
        it.skip('private', function (done) {
            p.trello.get('members/me/boards', {
                qs:{key:cred.app.trello.key, token:cred.user.trello.token}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.should.be.an.instanceOf(Array);
                done();
            });
        });
    });
    it.skip('twitter', function (done) {
        p.twitter.get('users/show', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            qs:{screen_name:'mightymob'}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it.skip('wikimapia', function (done) {
        p.wikimapia.get('', {
            qs: {
                key:cred.user.wikimapia.apikey,
                function:'place.search',
                q:'Central Park, New York, NY',
                lat:'40.7629025',
                lon:'-73.9826439',
                format:'json'
            }
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.count.should.equal(5);
            done();
        });
    });
    describe.skip('yahoo', function () {
        var access = {};
        before(function (done) {
            p.yahoo.refresh(
                cred.app.yahoo,
                cred.user.yahoo,
                {oauth_session_handle:cred.user.yahoo.session},
            function (err, res, body) {
                if (err) return done(err);
                access = {token:body.oauth_token, secret:body.oauth_token_secret};
                done();
            });
        });
        it.skip('social', function (done) {
            p.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
                oauth:{
                    token:access.token, secret:access.secret
                },
                api:'social'
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.profile.nickname.should.equal('Simeon')
                done();
            });
        });
        it.skip('yql', function (done) {
            p.yahoo.get('yql', {
                oauth:{
                    token:access.token, secret:access.secret
                },
                api:'yql',
                qs:{q:'SELECT * FROM social.profile WHERE guid=me'}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.query.results.profile.nickname.should.equal('Simeon');
                done();
            });
        });
        it.skip('geo', function (done) {
            p.yahoo.get("places.q('Central Park, New York')", {
                api:'geo',
                qs:{appid:cred.user.yahoo.apikey}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.places.place[0].admin1.should.equal('New York');
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
