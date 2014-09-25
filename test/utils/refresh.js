
var fs = require('fs'),
    path = require('path');
var fpath = path.resolve(__dirname, '../../config/user.json');


exports.store = function (provider, token, refresh) {
    var user = require(fpath);
    user[provider].token = token;
    user[provider].refresh = refresh;
    fs.writeFileSync(fpath, JSON.stringify(user, null, 4), 'utf8');
}
