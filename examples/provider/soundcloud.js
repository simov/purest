
var cred = require('../../test/credentials');


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('me', {
                oauth_token:cred.user.soundcloud.token
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('tracks', {
                oauth_token:cred.user.soundcloud.token,
                q:'dnb'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
