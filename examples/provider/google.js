
var cred = require('../../config/credentials');


exports = module.exports = function (p) {
    return {
        // get all google contact's groups
        0: function () {
            p.google.get('groups/default/full', {
                api:'contacts',
                qs:{
                    access_token:cred.user.google.token,
                    'max-results':50
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        // get google contacts from specific group
        1: function () {
            p.google.get('contacts/default/full', {
                api:'contacts',
                qs:{
                    access_token:cred.user.google.token,
                    // group:'http://www.google.com/m8/feeds/groups/email%40gmail.com/base/ID',
                    'max-results':50
                }
            }, function (err, res, body) {
                debugger;
                console.log(body);
            });
        },
        2: function () {
            
        }
    };
}
