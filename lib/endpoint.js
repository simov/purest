
var extend = require('@simov/deep-extend')
var def = require('../config/methods')

module.exports = (ctor, req) => {

  var endpoint = (() => {
    var all = extend({}, ctor.defaults || {}, req)

    var aliases = (ctor.methods || {}).endpoint || def.purest.endpoint

    var alias = ['endpoint'].concat(aliases).find((key) => all[key] !== undefined)

    return all[alias] || 'default'
  })()

  var options = (ctor.config[ctor.provider] || {})[endpoint] || {}
  if (options.auth) {
    options._auth = options.auth
  }
  options = extend({}, options, ctor.defaults || {}, req)

  var methods = Object.assign({}, def.methods, def.http, def.url, def.purest, ctor.methods || {})

  return {options, methods}

}
