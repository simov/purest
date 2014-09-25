
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('me', {
                qs:{oauth_token:cred.user.soundcloud.token}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('tracks', {
                qs:{
                    oauth_token:cred.user.soundcloud.token,
                    q:'dnb'
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
