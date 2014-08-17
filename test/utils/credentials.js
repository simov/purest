
var fs = require('fs'),
    path = require('path');

var fpath = path.resolve(__dirname, '../../config/credentials.json'),
    providers = require('../../config/providers');

if (fs.existsSync(fpath)) return;

var cred = {app:{}, user:{}};
for (var key in providers) {
    cred.app[key] = {key:'', secret:''};
    cred.user[key] = {token:'', secret:''};
}
fs.writeFileSync(fpath, JSON.stringify(cred, null, 4), 'utf8');
