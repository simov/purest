
var provider = process.argv[2]
  , name = process.argv[3]

if (!provider) {
  console.log('Specify provider!')
  process.exit()
}
if (provider == 'twitter' && !name) {
  console.log('Specify screen name!')
  process.exit()
}

var Social = require('./social')

var config = require('./config')
  , app = config.app[provider]
  , user = config.user[provider]

var network = new Social({
  provider:provider,
  key:app.key,
  secret:app.secret
})

network.user({
  name:name,
  token:user.token,
  secret:user.secret
}, function (err, res, body, data) {
  if (err) console.log(err)
  console.log(data)
})
