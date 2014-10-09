
var es = require('event-stream');

var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (p) {
    return {
        // retrieve all of the lists defined for your user account
        0: function () {
            p.query()
                .select('lists/list')
                .auth(cred.user.mailchimp.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // export contacts from a list
        1: function () {
            p.query('export')
                .select('list')
                .where({id:'bd0b216f1c'})
                .auth(cred.user.mailchimp.apikey)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // stream contacts from a list
        2: function () {
            p.query('export')
                .select('list')
                .where({id:'bd0b216f1c'})
                .auth(cred.user.mailchimp.apikey)
                .request()
                .pipe(es.split())
                .pipe(es.map(function (data, done) {
                    console.log(data);
                    console.log('---------------------');
                    done();
                }));
        }
    };
}
