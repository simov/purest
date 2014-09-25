
var fs = require('fs'),
    path = require('path');
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};
var fpath = path.resolve(__dirname,'../../test/fixtures/cat.png');


exports = module.exports = function (p) {
    return {
        // get root folder metadata
        0: function () {
            p.get('folders/0', {
                auth: {bearer:cred.user.box.token}
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        // get root folder items
        1: function () {
            p.get('folders/0/items', {
                auth: {bearer:cred.user.box.token}
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        }
    };
}
