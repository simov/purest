
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (p) {
    return {
        0: function () {
            p.get('blocks.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body.length);
                if (body.length) console.log(body[0]);
            });
        },
        1: function () {
            p.get('bounces.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body.length);
                if (body.length) console.log(body[0]);
            });
        },
        2: function () {
            p.get('invalidemails.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body.length);
                if (body.length) console.log(body[0]);
            });
        },
        3: function () {
            p.get('spamreports.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body.length);
                if (body.length) console.log(body[0]);
            });
        },
        4: function () {
            p.get('unsubscribes.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body.length);
                if (body.length) console.log(body[0]);
            });
        },
        5: function () {
            p.get('credentials/get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        6: function () {
            p.get('profile.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        7: function () {
            p.get('filter.getavailable', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        8: function () {
            p.get('stats.get', {
                qs:{
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        9: function () {
            var date = new Date();
            date.setDate(date.getDate()-7);
            p.post('stats.getAdvanced', {
                form: {
                    api_user:cred.user.sendgrid.token,
                    api_key:cred.user.sendgrid.secret,
                    data_type:'global',
                    start_date:date.toISOString().slice(0, 10)
                }
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        }
    };
}
