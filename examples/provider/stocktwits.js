
var cred = require('../../test/credentials');


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('account/verify', {
                params:{access_token:cred.user.stocktwits.token}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function (id) {
            t.get('streams/user/'+id, {
                params:{
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
                params:{
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
                params:{access_token:cred.user.stocktwits.token},
                data:{
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
