
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('users', {
                qs:{
                    // anonymous
                    site:'stackoverflow',
                    sort:'reputation',
                    order:'desc'
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function () {
            t.get('users', {
                qs:{
                    // app limited
                    key:cred.app.stackexchange.req_key,
                    site:'stackoverflow',
                    sort:'reputation',
                    order:'desc'
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            t.get('users', {
                qs:{
                    // app/user pair limited
                    key:cred.app.stackexchange.req_key,
                    access_token:cred.user.stackexchange.token,
                    site:'stackoverflow',
                    sort:'reputation',
                    order:'desc'
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }	
    };
}
