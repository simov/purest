
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (p) {
    return {
        // get all flows (channels)
        0: function () {
            p.query()
                .get('flows')
                .auth(cred.user.flowdock.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // stream messages from a flow (channel)
        1: function () {
            p.query('stream')
                .get('flows')
                .where({filter:'simeon-velichkov/main'})
                .auth(cred.user.flowdock.token)
                .request()
                .on('data', function (data) {
                    console.log(data.toString('utf8'));
                });
        }
    };
}
