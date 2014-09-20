
var fs = require('fs'),
    path = require('path');
var cred = require('../../config/credentials'),
    image = fs.readFileSync(path.resolve(__dirname,'../../test/fixtures/cat.png'));


exports = module.exports = function (p) {
    return {
        0: function () {
            p.get('account/info', {
                auth: {bearer:cred.user.dropbox.token}
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        1: function () {
            p.put('files_put/auto/cat.png', {
                auth: {bearer:cred.user.dropbox.token},
                api: 'files',
                body: image
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                console.log(body);
            });
        },
        2: function () {
            p.get('files/auto/cat.png', {
                auth: {bearer:cred.user.dropbox.token},
                api: 'files'
            }, function (err, res, body) {
                debugger;
                if (err) console.log(err);
                fs.writeFileSync('cat.png', body);
            });
        }
    };
}
