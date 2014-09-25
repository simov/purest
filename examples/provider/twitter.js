
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (t) {
    return {
        0: function (id) {
            t.get('users/show', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                qs:{user_id:id}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('statuses/user_timeline', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                qs:{
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
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                qs:{count: 200}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        3: function () {
            t.get('statuses/mentions_timeline', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret}
                // qs:{since_id: 'id'}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        4: function () {
            t.get('statuses/retweets_of_me', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        5: function () {
            t.get('statuses/retweets', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                qs:{
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
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        7: function () {
            t.post('statuses/update', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                data:{status:'Message on '+new Date()}
            },
            function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        8: function () {
            t.post('statuses/update_with_media', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                upload:'cat.jpg',
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
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
                qs:{
                    q:'twitter'
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        10: function () {
            t.get('direct_messages', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        11: function () {
            t.get('direct_messages/sent', {
                oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
