
var cred = require('../test/credentials');


exports = module.exports = function () {
    return [
        function () {
            t.get('statuses/user_timeline', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        function () {
            t.get('help/configuration', {
                t_token:cred.user.twitter.token,
                t_secret:cred.user.twitter.secret
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    ];
}
