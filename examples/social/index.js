
var provider = process.argv[2]

if (!provider) {
  throw new Error('Specify provider!')
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
  id:user.id,
  auth:{
    token:user.token,
    secret:user.secret
  }
}, function (err, res, body, data) {
  if (err) console.log(err)
  console.log(data)
})
