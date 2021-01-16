
var extend = require('extend')
var compose = require('./lib/client')
var def = require('./config/methods')

var transform = {
  endpoint: require('./lib/endpoint'),
  method: require('./lib/method'),
  url: require('./lib/url'),
  auth: require('./lib/auth'),
  alias: require('./lib/alias'),
}

module.exports = function purest (ctor = {}) {

  var client = compose(
    (req) => transform.endpoint(ctor, req),
    transform.alias,
    transform.method,
    transform.url,
    transform.auth,
    (req) =>
      req.buffer ? compose.buffer(req) :
      req.stream ? compose.stream(req) :
      compose.client(req),
  )

  // same in lib/endpoint.js - probably move it here ..
  var methods = Object.assign(
    {}, def.methods, def.http, def.url, def.purest, ctor.methods || {})

  var exec = ['request', 'buffer', 'stream']
    .concat(methods.request)
    .concat(methods.buffer)
    .concat(methods.stream)

  var wrap = (name) => (value, ...rest) => {
    if (exec.includes(name)) {
      var main = ['request', 'buffer', 'stream']
      if (main.includes(name)) {
        client._options[name] = true
      }
      else {
        var index = main.findIndex((key) => methods[key].includes(key))
        client._options[main[index]] = true
      }

      var options = extend(true, {}, client._options, value || {})
      client._options = {}
      return client(options)
    }
    else if (['auth'].concat(methods.auth).includes(name)) {
      client._options.auth = [].concat(value).concat(rest)
      return client
    }
    else {
      client._options[name] = value
      return client
    }
  }

  client._options = {}

  var all = Object.keys(methods).concat(Object.values(methods).reduce((all, aliases) => all.concat(aliases)))

  all.forEach((name) => client[name] = wrap(name))

  return client
}
