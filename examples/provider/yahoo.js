
var cred = require('../../config/credentials');


exports = module.exports = function (t) {
    return {
        0: function () {
            t.get('me/guid', {
                oauth:{
                    token:cred.user.yahoo.token,
                    secret:cred.user.yahoo.secret
                },
                api:'social'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function (id) {
            t.get('user/'+id+'/profile', {
                oauth:{
                    token:cred.user.yahoo.token,
                    secret:cred.user.yahoo.secret
                },
                api:'social'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function (id) {
            t.get('yql', {
                oauth:{
                    token:cred.user.yahoo.token,
                    secret:cred.user.yahoo.secret
                },
                api:'query',
                params:{q: 'SELECT * FROM social.profile WHERE guid='+
                                            (id ? "'"+id+"'" : 'me')}
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // accepts multiple ids
        3: function (id) {
            t.get('users.guid('+id+')/profile', {
                oauth:{
                    token:cred.user.yahoo.token,
                    secret:cred.user.yahoo.secret
                },
                api:'social'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        4: function (id) {
            t.get('user/'+(id||'me')+'/connections', {
                oauth:{
                    token:cred.user.yahoo.token,
                    secret:cred.user.yahoo.secret
                },
                api:'social'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        5: function () {
            t.get("places.q('Central Park, New York')", {
                oauth:{
                    token:cred.user.yahoo.token,
                    secret:cred.user.yahoo.secret
                },
                api:'where',
                params:{
                    appid:cred.app.yahoo.req_key
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
