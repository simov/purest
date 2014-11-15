
var cred = {
    app:require('../../config/app'),
    user:require('../../config/user')
};


exports = module.exports = function (p) {
    return {
        // get all boards
        0: function () {
            p.query()
                .get('members/me/boards')
                .auth(cred.app.trello.key, cred.user.trello.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // get all lists in a board
        1: function () {
            p.query()
                .get('boards/'+cred.user.trello.board+'/lists')
                .auth(cred.app.trello.key, cred.user.trello.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        },
        // get all cards in a list
        2: function () {
            p.query()
                .get('lists/'+cred.user.trello.list+'/cards')
                .auth(cred.app.trello.key, cred.user.trello.token)
                .request(function (err, res, body) {
                    debugger;
                    if (err) console.log(err);
                    console.log(body);
                });
        }
    };
}
