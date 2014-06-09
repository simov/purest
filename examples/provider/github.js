
var cred = require('../../config/credentials');


exports = module.exports = function (t) {
    return {
        // get user's account
        0: function () {
            t.get('users/simov', {
                qs:{access_token:cred.user.github.token}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get repo
        1: function () {
            t.get('repos/senchalabs/connect', {
                qs:{access_token:cred.user.github.token}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
