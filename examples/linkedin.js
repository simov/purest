
var cred = require('../test/credentials');


exports = module.exports = function (t) {
    return [
        function () {
            t.get('people/id=4cmQvrxtRR', {
                t_token:cred.user.linkedin.token,
                t_secret:cred.user.linkedin.secret
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        function () {
            t.get('people/id=pxHPwSchVu', {
                t_token:cred.user.linkedin.token,
                t_secret:cred.user.linkedin.secret
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    ];
}
