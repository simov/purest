
var async = require('async');
var Purest = require('../lib/provider');


function Facebook (options) {
    this.purest = new Purest(options);
}

Facebook.prototype.user = function (options, done) {
    async.waterfall([
        function (done) {
            this.purest.query()
                .get('me')
                .auth(options.auth.token)
                .request(function (err, res, body) {
                    // error responses must be wrapped also
                    if (err) return done(err);
                    done(null, {id:body.id, username:body.username, name:body.name});
                });
        }.bind(this),
        function (result, done) {
            this.purest.query()
                .select(result.id+'/picture')
                .where({redirect:false})
                .auth(options.auth.token)
                .request(function (err, res, body) {
                    if (err) return done(err);
                    result.avatar = body.data.url;
                    done(null, result);
                });
        }.bind(this)
    ], function (err, result) {
        if (err) return done(err);
        result.type = 'facebook';
        done(null, null, null, result);
    });
}


function Linkedin (options) {
    this.purest = new Purest(options);
}

Linkedin.prototype.user = function (options, done) {
    var fields = ':(id,first-name,last-name,formatted-name,headline,picture-url,'+
        'auth-token,distance,num-connections)';
    this.purest.query()
        .select('people/~'+fields)
        .auth(options.auth.token, options.auth.secret)
        .request(function (err, res, body) {
            // error responses must be wrapped also
            if (err) return done(err);
            done(null, res, body, {
                id:body.id, username:body.formattedName,
                name:body.formattedName, avatar:body.pictureUrl,
                type:'linkedin'
            });
        });
}


function Twitter (options) {
    this.purest = new Purest(options);
}

Twitter.prototype.user = function (options, done) {
    this.purest.query()
        .get('users/show')
        .where({user_id:options.id})
        .auth(options.auth.token, options.auth.secret)
        .request(function (err, res, body) {
            // error responses must be wrapped also
            if (err) return done(err);
            done(null, res, body, {
                id:body.id_str, username:body.screen_name,
                name:body.name, avatar:body.profile_image_url_https,
                type:'twitter'
            });
        });
}


function Provider (options) {
    if (options.provider == 'facebook') {
        return new Facebook(options);
    }
    else if (options.provider == 'linkedin') {
        return new Linkedin(options);
    }
    else if (options.provider == 'twitter') {
        return new Twitter(options);
    }
}





// consumer app
var async = require('async');
var cred = {
    app: require('../config/app'),
    user: require('../config/user')
};


var facebook = new Provider({provider:'facebook'});
var linkedin = new Provider({provider:'linkedin',
    key:cred.app.linkedin.key, secret:cred.app.linkedin.secret
});
var twitter = new Provider({provider:'twitter',
    key:cred.app.twitter.key, secret:cred.app.twitter.secret
});


var results = [];
async.parallel([
    function (done) {
        facebook.user({
            auth:{token:cred.user.facebook.token}
        }, function (err, res, body, result) {
            if (err) return console.log(err) || done();
            results.push(result);
            done();
        });
    },
    function (done) {
        linkedin.user({
            auth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret}
        }, function (err, res, body, result) {
            if (err) return console.log(err) || done();
            results.push(result);
            done();
        });
    },
    function (done) {
        twitter.user({
            auth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            id:'1504092505'
        }, function (err, res, body, result) {
            if (err) return console.log(err) || done();
            results.push(result);
            done();
        });
    }
], function () {
    console.log(results);
    /*
    [
        {
            id: '100006399333306',
            username: 'fin.maven.9',
            name: 'Fin Maven',
            avatar: 'https://fbcdn-profile-a.akamaihd.net/...',
            type: 'facebook'
        },
        {
            id: 'yOU9pg2D8S',
            username: 'Fmvn1 last',
            name: 'Fmvn1 last',
            avatar: 'https://media.licdn.com/mpr/mprx/...',
            type: 'linkedin'
        },
        {
            id: '1504092505',
            username: 'mightymob',
            name: 'simo 2',
            avatar: 'https://abs.twimg.com/sticky/...',
            type: 'twitter'
        }
    ]
    */
});
