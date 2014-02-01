
var cred = require('../../test/credentials');


exports = module.exports = function () {
    return {
        0: function (id) {
            t.get('users/show', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret,
                user_id:id
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('statuses/user_timeline', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret,
                count: 3000
                // trim_user: true
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            t.get('statuses/home_timeline', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret,
                count: 200
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        3: function () {
            t.get('statuses/mentions_timeline', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret
                // since_id: 'id'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        4: function () {
            t.get('statuses/retweets_of_me', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        5: function () {
            t.get('statuses/retweets', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret,
                id:'tweet id must be passed as a parameter',
                count:100
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        6: function () {
            t.get('help/configuration', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        7: function () {
            t.post('statuses/update_with_media', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret,
                t_mime:'image/jpeg'
            }, {
                status:'Message on '+new Date(),
                'media[]':fs.readFileSync('/absolute/path/to/cat.jpg')
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
