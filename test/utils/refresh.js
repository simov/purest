
var fs = require('fs'),
    path = require('path');
var fpath = path.resolve(__dirname, '../../config/user.json');


exports.store = function (provider, token, refresh) {
    var cred = require(fpath);
    cred[provider].token = token;
    if (refresh)
        cred[provider].refresh = refresh;
    fs.writeFileSync(fpath, JSON.stringify(cred, null, 4), 'utf8');
}

// used only for Yahoo
exports.storeOAuth1 = function (provider, token, secret) {
    var cred = require(fpath);
    cred[provider].token = token;
    cred[provider].secret = secret;
    fs.writeFileSync(fpath, JSON.stringify(cred, null, 4), 'utf8');
}
