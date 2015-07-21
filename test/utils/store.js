
var fs = require('fs')
  , path = require('path')
var fpath = path.resolve(__dirname, '../../config/user.json')
  , cred = require(fpath)


exports.oauth2 = function (provider, token, refresh) {
  cred[provider].token = token
  if (refresh) {
    cred[provider].refresh = refresh
  }
  fs.writeFileSync(fpath, JSON.stringify(cred, null, 2), 'utf8')
}

// used only for Yahoo
exports.oauth1 = function (provider, token, secret) {
  cred[provider].token = token
  cred[provider].secret = secret
  fs.writeFileSync(fpath, JSON.stringify(cred, null, 2), 'utf8')
}
