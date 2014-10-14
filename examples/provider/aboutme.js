
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (p) {
    return {
        // get access token
        0: function () {
            p.post('user/login/simeonv', {
                qs:{
                    client_id:cred.user.aboutme.apikey,
                    grant_type:'password',
                    password:'...user pass here'
                }
            }, function (err, res, body) {
                if (err) console.log(err);
                // access_token, status, expires_in
                console.log(body);
            });
        },
        // revoke access token
        1: function () {
            p.post('user/logout/simeonv', {
                qs:{
                    client_id:cred.user.aboutme.apikey,
                    token:cred.user.aboutme.token
                }
            }, function (err, res, body) {
                if (err) console.log(err);
                console.log(body);
            });
        }
    };
}
