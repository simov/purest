
var cred = require('../../config/credentials');


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('account/verify', {
                qs:{access_token:cred.user.stocktwits.token}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function (id) {
            t.get('streams/user/'+id, {
                qs:{
                    access_token:cred.user.stocktwits.token//,
                    // since: '', max: '', limit: '', callback: '', filter: ''
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            t.get('streams/home', {
                qs:{
                    access_token:cred.user.stocktwits.token//,
                    // since: '', max: '', limit: '', callback: '', filter: ''
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        3: function () {
            t.get('messages/create', {
                qs:{access_token:cred.user.stocktwits.token},
                form:{
                    body: 'Publisher message on ' + new Date()//,
                    // in_reply_to_message_id: '', chart: '', sentiment: ''
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
