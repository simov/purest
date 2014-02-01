
var cred = require('../../test/credentials');


exports = module.exports = function (t) {
    return {
        0: function (id) {
            t.get(id||'me', {
                access_token:cred.user.facebook.token
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        1: function (id) {
            t.get((id||'me')+'/feed', {
                access_token:cred.user.facebook.token
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            t.get('me/accounts', {
                access_token:cred.user.facebook.token,
                fields:'id,name,picture,access_token'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        3: function () {
            t.get('me/groups', {
                access_token:cred.user.facebook.token,
                fields:'id,name,picture,administrator,cover,icon'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        4: function (id) {
            t.get('fql', {
                access_token:cred.user.facebook.token,
                q:'SELECT icon34 FROM group WHERE gid IN ('+id+')'
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        5: function (id) {
            t.get('fql', {
                access_token:cred.user.facebook.token,
                q:'SELECT friend_count FROM user WHERE uid = ' + id
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        6: function (id) {
            t.get('fql', {
                access_token:cred.user.facebook.token,
                q:'SELECT uid FROM group_member WHERE gid = ' + id
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        7: function (id) {
            t.post((id||'me')+'/feed', {
                access_token:cred.user.facebook.token,
                message:'Publish message on ' + new Date()
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        }
    };
}
