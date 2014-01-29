
var cred = require('../test/credentials');


exports = module.exports = function (t) {
    return [
        function () {
            t.get('me', {
                oauth_token:cred.user.soundcloud.token
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        function () {
            t.get('tracks', {
                oauth_token:cred.user.soundcloud.token,
                q:'dnb'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    ];
}
