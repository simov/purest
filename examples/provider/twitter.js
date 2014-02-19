
var cred = require('../../test/credentials');


exports = module.exports = function (t) {
    return {
        0: function (id) {
            t.get('users/show', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                },
                params:{user_id:id}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('statuses/user_timeline', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                },
                params:{
                    count: 3000
                    // trim_user: true
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            t.get('statuses/home_timeline', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                },
                params:{count: 200}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        3: function () {
            t.get('statuses/mentions_timeline', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                }
                // params:{since_id: 'id'}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        4: function () {
            t.get('statuses/retweets_of_me', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        5: function () {
            t.get('statuses/retweets', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                },
                params:{
                    id:'tweet id must be passed as a parameter',
                    count:100
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        6: function () {
            t.get('help/configuration', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        7: function () {
            t.post('statuses/update', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                },
                data:{status:'Message on '+new Date()}
            },
            function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        8: function () {
            t.post('statuses/update_with_media', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret,
                    upload:'cat.jpg'
                },
                data:{
                    status:'Message on '+new Date(),
                    'media[]':fs.readFileSync('/absolute/path/to/cat.jpg')
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        9: function () {
            t.get('users/search', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                },
                params:{
                    q:'twitter'
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        10: function () {
            t.get('direct_messages', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        10: function () {
            t.get('direct_messages/sent', {
                options:{
                    token:cred.user.twitter.token,
                    secret:cred.user.twitter.secret
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
