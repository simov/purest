
var fs = require('fs'),
    path = require('path');

var app = path.resolve(__dirname, '../../config/app.json'),
    user = path.resolve(__dirname, '../../config/user.json'),
    providers = require('../../config/providers');

if (fs.existsSync(app)) return;

var cred = {app:{}, user:{}};
for (var key in providers) {
    cred.app[key] = {key:'', secret:''};
    cred.user[key] = {token:'', secret:''};
}
fs.writeFileSync(app, JSON.stringify(cred.app, null, 4), 'utf8');
fs.writeFileSync(user, JSON.stringify(cred.user, null, 4), 'utf8');
