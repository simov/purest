
var fs = require('fs');
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (p) {
    return {

        // Identity

        // user's profile
        0: function () {
            p.query()
                .select('me')
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // user's avatar
        1: function () {
            p.query()
                .select('me/picture')
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                    fs.writeFileSync('avatar.png', body);
                });
        },


        // Outlook

        // get user's contacts
        2: function () {
            p.query()
                .select('me/contacts')
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // get a single contact
        3: function () {
            p.query()
                .select('contact.de3413e6000000000000000000000000')
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },


        // OneDrive

        // get the root skydrive folder
        4: function () {
            p.query()
                .select('me/skydrive') // or [id]/skydrive
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // list of all folders, albums and files inside the root directory
        5: function () {
            p.query()
                .select('me/skydrive/files') // or [id]/skydrive
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // get folder's metadata
        6: function () {
            p.query()
                .select('folder.e8e0202776d99ad4.E8E0202776D99AD4!103')
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // get folder's content
        7: function () {
            p.query()
                .select('folder.e8e0202776d99ad4.E8E0202776D99AD4!103/files')
                .auth(cred.user.live.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        }
    };
}
